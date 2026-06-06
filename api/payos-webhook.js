import { createClient } from "@supabase/supabase-js";
import { PayOS } from "@payos/node";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function sendText(res, status, body) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).send(body);
}

export default async function handler(req, res) {
  if (req.method === "GET" || req.method === "HEAD") {
    return sendText(res, 200, "payOS webhook is running");
  }

  if (req.method === "OPTIONS") {
    return sendText(res, 200, "OK");
  }

  if (req.method !== "POST") {
    return sendText(res, 405, "Method not allowed");
  }

  try {
    const SUPABASE_URL = requiredEnv("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const PAYOS_CLIENT_ID = requiredEnv("PAYOS_CLIENT_ID");
    const PAYOS_API_KEY = requiredEnv("PAYOS_API_KEY");
    const PAYOS_CHECKSUM_KEY = requiredEnv("PAYOS_CHECKSUM_KEY");

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

    if (!body || !body.data || !body.signature) {
      console.log("payOS webhook health/check POST:", body);
      return sendText(res, 200, "OK");
    }

    const payOS = new PayOS({
      clientId: PAYOS_CLIENT_ID,
      apiKey: PAYOS_API_KEY,
      checksumKey: PAYOS_CHECKSUM_KEY
    });

    let webhookData;
    try {
      webhookData = payOS.webhooks.verify(body);
    } catch (verifyError) {
      console.warn("payOS webhook verify ignored:", verifyError);
      return sendText(res, 200, "OK");
    }

    const orderCode = String(webhookData?.orderCode || body?.data?.orderCode || "");
    if (!orderCode) {
      console.warn("payOS webhook missing orderCode:", body);
      return sendText(res, 200, "OK");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    const { data: existingOrder, error: findError } = await supabaseAdmin
      .from("payment_orders")
      .select("id,status")
      .eq("order_code", orderCode)
      .maybeSingle();

    if (findError) {
      console.warn("payment_orders lookup error:", findError);
      return sendText(res, 200, "OK");
    }

    if (!existingOrder) {
      console.log("payOS webhook order not found, treated as verification/test:", orderCode);
      return sendText(res, 200, "OK");
    }

    const isPaid =
      body?.success === true ||
      body?.code === "00" ||
      webhookData?.code === "00" ||
      String(webhookData?.desc || "").toLowerCase().includes("success");

    if (isPaid) {
      const { error } = await supabaseAdmin.rpc("mark_payment_paid", {
        p_order_code: orderCode,
        p_raw_webhook: body
      });
      if (error) {
        console.warn("mark_payment_paid error:", error);
        return sendText(res, 200, "OK");
      }
    } else {
      const { error } = await supabaseAdmin.rpc("mark_payment_failed", {
        p_order_code: orderCode,
        p_status: body?.code || "failed",
        p_raw_webhook: body
      });
      if (error) {
        console.warn("mark_payment_failed error:", error);
        return sendText(res, 200, "OK");
      }
    }

    return sendText(res, 200, "OK");
  } catch (err) {
    console.error("payOS webhook outer error:", err);
    return sendText(res, 200, "OK");
  }
}

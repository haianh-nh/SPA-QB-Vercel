import { createClient } from "@supabase/supabase-js";
import PayOS from "@payos/node";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const SUPABASE_URL = requiredEnv("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const SITE_URL = requiredEnv("SITE_URL");
    const PAYOS_CLIENT_ID = requiredEnv("PAYOS_CLIENT_ID");
    const PAYOS_API_KEY = requiredEnv("PAYOS_API_KEY");
    const PAYOS_CHECKSUM_KEY = requiredEnv("PAYOS_CHECKSUM_KEY");

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing Authorization token" });

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Invalid Supabase session" });
    }

    const user = userData.user;
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    if (body.packageId && body.packageId !== "ata_10_attempts") {
      return res.status(400).json({ error: "Invalid package" });
    }

    const amount = 50000;
    const creditsAdded = 10;
    const orderCode = Number(String(Date.now()).slice(-10));

    const payOS = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY);

    const paymentData = {
      orderCode,
      amount,
      description: "ATA 10 luot",
      items: [
        { name: "ATA Quiz 10 luot", quantity: 1, price: amount }
      ],
      cancelUrl: `${SITE_URL}/?payment=cancelled&orderCode=${orderCode}`,
      returnUrl: `${SITE_URL}/?payment=success&orderCode=${orderCode}`
    };

    const paymentLink = await payOS.createPaymentLink(paymentData);

    const { error: insertError } = await supabaseAdmin.from("payment_orders").insert({
      user_id: user.id,
      order_code: String(orderCode),
      amount,
      credits_added: creditsAdded,
      status: "pending",
      checkout_url: paymentLink.checkoutUrl
    });

    if (insertError) {
      return res.status(500).json({ error: "Cannot save payment order: " + insertError.message });
    }

    return res.status(200).json({
      orderCode: String(orderCode),
      amount,
      creditsAdded,
      checkoutUrl: paymentLink.checkoutUrl,
      qrCode: paymentLink.qrCode || null
    });
  } catch (err) {
    console.error("create-payment error", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

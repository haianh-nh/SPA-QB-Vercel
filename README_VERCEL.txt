ATA Quiz Bank V6 - Vercel Ready

Bản này dùng Vercel thay Netlify.

Cấu trúc:
- index.html
- api/create-payment.js
- api/payos-webhook.js
- package.json
- vercel.json
- schema_v6.sql

Đã đổi endpoint trong index.html:
- Từ /.netlify/functions/create-payment
- Sang /api/create-payment

Environment Variables cần nhập trong Vercel:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- PAYOS_CLIENT_ID
- PAYOS_API_KEY
- PAYOS_CHECKSUM_KEY
- SITE_URL

SITE_URL phải là domain Vercel của bạn, ví dụ:
https://ata-quiz-bank-v6.vercel.app

Webhook payOS sau khi deploy:
https://YOUR-VERCEL-DOMAIN.vercel.app/api/payos-webhook

Sau deploy, mở URL webhook phải hiện:
payOS webhook is running

Lưu ý:
- Chạy schema_v6.sql trong Supabase nếu chưa chạy.
- Không đưa SUPABASE_SERVICE_ROLE_KEY, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY vào index.html.

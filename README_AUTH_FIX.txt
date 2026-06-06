AUTH RESET FIX

Đã sửa:
- const SITE_URL = window.location.origin
- resetPasswordForEmail redirectTo = window.location.origin
- resend confirmation emailRedirectTo = window.location.origin
- Thêm handlePasswordRecoveryIfNeeded():
  Khi user bấm link reset email về web, web sẽ hỏi mật khẩu mới và gọi:
  supabaseClient.auth.updateUser({ password: newPassword })

Cần cấu hình thêm trong Supabase:
Authentication -> URL Configuration
Site URL:
https://spa-qb-vercel.vercel.app

Redirect URLs:
https://spa-qb-vercel.vercel.app
https://spa-qb-vercel.vercel.app/**

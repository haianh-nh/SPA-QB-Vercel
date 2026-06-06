FORCE PASSWORD CHANGE AFTER EMAIL CONFIRMATION

Bản này sửa luồng Supabase Auth:
- Khi user bấm link xác nhận email, Supabase vẫn tạo session tạm thời.
- Web sẽ bắt buộc hiện bước nhập mật khẩu mới.
- Đổi mật khẩu thành công xong web tự đăng xuất.
- User phải đăng nhập lại bằng mật khẩu mới.
- Luồng quên mật khẩu cũng dùng cùng cơ chế này.

Cần cấu hình trong Supabase:
Authentication -> URL Configuration

Site URL:
https://spa-qb-vercel.vercel.app

Redirect URLs:
https://spa-qb-vercel.vercel.app
https://spa-qb-vercel.vercel.app/**

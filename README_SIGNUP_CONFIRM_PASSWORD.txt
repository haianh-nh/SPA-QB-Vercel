SIGNUP CONFIRM PASSWORD FIX

Luồng mới:
1. Đăng ký tài khoản:
   - Có ô Password
   - Có ô Nhập lại password
   - Hai mật khẩu phải giống nhau
   - Sau xác nhận email không bắt đổi password nữa
   - User đăng nhập bằng password đã tạo lúc đăng ký

2. Quên mật khẩu:
   - Bấm Quên mật khẩu
   - Mở link email reset
   - Sau khi xác nhận mail reset mới nhập mật khẩu mới 2 lần
   - Đổi xong tự đăng xuất
   - Đăng nhập lại bằng mật khẩu mới

Supabase:
Authentication -> Providers -> Email:
- Bật Confirm email nếu muốn người dùng phải xác nhận email trước khi đăng nhập.

Authentication -> URL Configuration:
Site URL:
https://spa-qb-vercel.vercel.app

Redirect URLs:
https://spa-qb-vercel.vercel.app
https://spa-qb-vercel.vercel.app/**

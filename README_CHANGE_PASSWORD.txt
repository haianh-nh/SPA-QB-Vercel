CHANGE PASSWORD AFTER LOGIN

Đã thêm function đổi mật khẩu sau khi đăng nhập:

- Sau khi user đăng nhập, trong phần Tài khoản có nút: Đổi mật khẩu.
- Khi bấm:
  1. Nhập mật khẩu mới
  2. Nhập lại mật khẩu mới
  3. Hai mật khẩu phải giống nhau
  4. Gọi Supabase updateUser({ password })
  5. Đổi xong tự đăng xuất
  6. User đăng nhập lại bằng mật khẩu mới

Giữ nguyên:
- Confirm password khi đăng ký
- Quên mật khẩu qua email
- PayOS
- Bank câu hỏi
- Font fix

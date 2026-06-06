MUST CHANGE PASSWORD FIX

Sửa cơ chế bắt đổi mật khẩu lần đầu:

1. Khi user đăng ký:
   supabase.auth.signUp(... data:{must_change_password:true})

2. Khi user xác nhận email, Supabase có thể tự đăng nhập.
   Web kiểm tra user_metadata.must_change_password.

3. Nếu true:
   - Bắt nhập mật khẩu mới.
   - updateUser({password, data:{must_change_password:false}})
   - signOut()
   - User phải đăng nhập lại bằng mật khẩu mới.

4. Quên mật khẩu:
   - Link recovery vẫn bắt nhập mật khẩu mới.
   - Đổi xong signOut.

Lưu ý test:
- Cần tạo user/email mới để test luồng đăng ký mới.
- User cũ đã tạo trước bản này sẽ không có metadata must_change_password:true, nên sẽ không bị bắt đổi mật khẩu.
- Nếu test user cũ, xóa user đó trong Supabase Auth rồi đăng ký lại.

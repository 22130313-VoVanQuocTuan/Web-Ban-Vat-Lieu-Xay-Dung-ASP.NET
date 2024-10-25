USER-ADMIN dùng dùng trang login,signup


- Font chữ: font-family: Arial, Helvetica, sans-serif
- Bảng màu : nền     background: linear-gradient(to right, #82a0c2, #15283e);


USER
1. Trang chủ (index.html)
Chức năng:
Hiển thị thông tin nổi bật về sản phẩm và khuyến mãi.
Banner quảng cáo.
Các danh mục sản phẩm chính (gạch, xi măng, thép...).
Liên kết nhanh đến các sản phẩm mới và bán chạy.

2. Trang sản phẩm (product-list.html)
Chức năng:
Hiển thị danh sách sản phẩm theo danh mục (ví dụ: gạch, xi măng, sơn).
Có bộ lọc tìm kiếm (lọc theo giá, thương hiệu, hoặc loại vật liệu).
Mỗi sản phẩm có hình ảnh, tên, giá và nút "Thêm vào giỏ hàng".

3. Trang chi tiết sản phẩm (product-detail.html)
Chức năng:
Hiển thị chi tiết về một sản phẩm cụ thể (mô tả, giá, số lượng tồn kho).
Tùy chọn số lượng sản phẩm.
Nút "Thêm vào giỏ hàng".
Đánh giá và nhận xét từ khách hàng.

4. Trang giỏ hàng (cart.html)
Chức năng:
Hiển thị các sản phẩm mà người dùng đã thêm vào giỏ hàng.
Cho phép cập nhật số lượng hoặc xóa sản phẩm.
Tính tổng tiền.
Nút "Thanh toán" để chuyển sang trang thanh toán.

5. Trang thanh toán (checkout.html)
Chức năng:
Cho phép người dùng điền thông tin giao hàng (họ tên, địa chỉ, số điện thoại).
Chọn phương thức thanh toán (COD, chuyển khoản).
Hiển thị tổng chi phí và xác nhận đơn hàng.

6. Trang đăng nhập / đăng ký (login_signup.html)
Chức năng:
Người dùng đăng nhập hoặc đăng ký tài khoản mới.
Cung cấp tùy chọn đăng nhập qua Google/Facebook (nếu cần).
Đặt lại mật khẩu nếu quên.

7. Trang tài khoản người dùng (user-account.html)
Chức năng:
Hiển thị thông tin cá nhân của người dùng (họ tên, email).
Danh sách các đơn hàng đã đặt.
Cho phép chỉnh sửa thông tin cá nhân và đổi mật khẩu.

8. Trang quản lý đơn hàng (order-management.html)
Chức năng:
Dành cho quản trị viên để theo dõi các đơn hàng.
Xem và cập nhật trạng thái đơn hàng (đang xử lý, đã giao, đã hủy).

9. Trang liên hệ (contact.html)
Chức năng:
Hiển thị thông tin liên hệ (địa chỉ, số điện thoại, email).
Form liên hệ để khách hàng gửi câu hỏi hoặc khiếu nại.

10. Trang giới thiệu (about.html)
Chức năng:
Giới thiệu về cửa hàng hoặc công ty (lịch sử phát triển, tầm nhìn, sứ mệnh).
Thông tin về đối tác hoặc nhà cung cấp.
11. Trang tìm kiếm (search-results.html)
Chức năng:
Hiển thị kết quả tìm kiếm sản phẩm từ thanh tìm kiếm.
Có bộ lọc để tinh chỉnh kết quả (theo giá, danh mục...).

12. Trang lỗi 404 (404.html)
Chức năng:
Hiển thị thông báo khi người dùng truy cập vào một liên kết không tồn tại.
Có nút quay lại Trang chủ hoặc đề xuất một số sản phẩm phổ biến.

13. Trang điều khoản và chính sách (policy.html)
Chức năng:
Hiển thị các chính sách về bảo mật thông tin, giao hàng, và đổi trả.



ADMIN
1. dashboard.html – Trang Tổng Quan
Hiển thị các số liệu thống kê chính:
Doanh thu hôm nay, tháng này.
Số lượng đơn hàng đang chờ xử lý.
Số lượng người dùng mới đăng ký.
Biểu đồ doanh thu và số đơn hàng.

2. product.html – Quản Lý Sản Phẩm
Hiển thị danh sách sản phẩm với chức năng:
Tìm kiếm, lọc theo danh mục.
Chỉnh sửa hoặc xóa sản phẩm.
Liên kết tới trang product-add.html để thêm sản phẩm mới.

3. product-add.html – Thêm Mới Sản Phẩm
Form nhập thông tin sản phẩm:
Tên sản phẩm, giá, mô tả, hình ảnh.
Số lượng tồn kho và danh mục.
Nút lưu để thêm sản phẩm mới vào hệ thống.

4. orders.html – Quản Lý Đơn Hàng
Danh sách các đơn hàng với các trạng thái:
Chờ xử lý, Đã giao, Đã hủy.
Cho phép thay đổi trạng thái đơn hàng và xem chi tiết.

5. order-details.html – Xem Chi Tiết Đơn Hàng
Thông tin chi tiết của một đơn hàng:
Sản phẩm đã mua, số lượng, giá tiền.
Thông tin người nhận, địa chỉ giao hàng.
Tùy chọn cập nhật trạng thái đơn hàng.

6. users.html – Quản Lý Người Dùng
Hiển thị danh sách khách hàng đã đăng ký:
Email, tên người dùng, trạng thái tài khoản (active, banned).
Có chức năng khóa hoặc mở tài khoản người dùng.

7. user-details.html – Chi Tiết Người Dùng
Hiển thị thông tin chi tiết của từng người dùng:
Thông tin cá nhân và lịch sử đơn hàng.
Cho phép quản trị viên chỉnh sửa hoặc khóa tài khoản.

8. promotions.html – Quản Lý Khuyến Mãi
Thêm và quản lý các chương trình khuyến mãi:
Giảm giá theo %, giảm giá cố định.
Cài đặt ngày bắt đầu và kết thúc khuyến mãi.

9. settings.html – Cài Đặt Hệ Thống
Quản lý các thiết lập hệ thống:
Cài đặt thanh toán, giao hàng.
Quản lý tài khoản admin.
Thay đổi thông tin website (tên, logo).

10. reports.html – Báo Cáo
Báo cáo doanh thu theo ngày, tháng, năm.
Báo cáo đơn hàng theo trạng thái (chờ xử lý, đã giao, hủy).
Xuất báo cáo ra Excel hoặc PDF.


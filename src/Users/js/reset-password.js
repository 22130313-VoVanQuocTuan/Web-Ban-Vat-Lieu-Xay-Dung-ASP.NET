import { showDialog } from "./showDidlog";

    const backToLoginLink = document.getElementById('back-to-login');
  
    // Khi người dùng muốn trở lại trang đăng nhập
    backToLoginLink.addEventListener('click', function() {
        window.location.href = "/src/Users/pages/account/login-signup.html"; // Địa chỉ trang đăng nhập
    });
    const error_email = document.getElementById("error-confirm");
    error_email.innerText ='';

// Lắng nghe sự kiện gửi form reset mật khẩu
document.getElementById("reset-password-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Ngăn chặn reload trang

    const email = document.getElementById("reset-email").value.trim();
    error_email.innerText = ''; // Xóa thông báo lỗi mỗi lần gửi yêu cầu mới
    
    try {
        const response = await fetch("http://localhost:5241/api/SendEmail/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email }) // Gửi email trong body
        });

        if (response.ok) {
            const ok = await response.json();
            error_email.style.color = "green"
            error_email.innerText = ok.message;
        } else {
            const error = await response.json();
            error_email.innerText = error.message ;
        }
    } catch (error) {
        error_email.innerText = "Không thể kết nối đến server. Vui lòng kiểm tra mạng.";
      
    }
});

window.onload = function() {
    // Lấy token từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        // Nếu có token, ẩn form nhập email và hiển thị form nhập mật khẩu mới
        document.getElementById('email-form').style.display = 'none';  // Ẩn form email
        document.getElementById('new-password-form-container').style.display = 'block';  // Hiển thị form mật khẩu mới

        // Lưu token vào một biến hoặc làm gì đó với token
        console.log("Token nhận được: ", token);
    }
};

// Lắng nghe sự kiện gửi form đặt mật khẩu mới
document.getElementById("new-password-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Ngăn chặn reload trang

    const newPassword = document.getElementById("new-password").value;
    const confirmNewPassword = document.getElementById("confirm-password").value;
    const error_pass = document.getElementById("password-error");
    error_pass.innerText = '';
    if (newPassword !== confirmNewPassword) {
        error_pass.innerText = 'Mật khẩu không khớp';
        return;
    }

    // Lấy token từ URL và giải mã nó
    const urlParams = new URLSearchParams(window.location.search);
    const token = decodeURIComponent(urlParams.get("token")); // Giải mã token từ URL

    if (!token) {
        showDialog("Lỗi token","Token không hợp lệ hoặc đã hết hạn.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5241/api/SendEmail/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,              // Gửi token trong body
                newPassword,        // Gửi mật khẩu mới
                confirmNewPassword  // Gửi mật khẩu xác nhận
            })
        });

        const text = await response.text(); // Đọc phản hồi dưới dạng văn bản
        console.log(text); // Xem phản hồi từ server

        if (response.ok) {
            s("Mật khẩu của bạn đã được đặt lại thành công.");
            window.location.href = "/src/Users/pages/account/login-signup.html"; // Chuyển hướng đến trang đăng nhập
        } else {
            try {
                const error = JSON.parse(text); // Chỉ phân tích JSON nếu có thể
                showDialog(`Lỗi: ${error.message || "Không thể đặt lại mật khẩu."}`);
            } catch (e) {
                showDialog("Lỗi không xác định: " , text); // Nếu không thể phân tích JSON
            }
        }
    } catch (error) {
        console.error("Có lỗi xảy ra:", error);
        showDialog("Có lỗi xảy ra","Đã xảy ra lỗi khi đặt lại mật khẩu.");
    }
});

// đóng dialog
window.closeDialog = closeDialog;
export function closeDialog() {
    const dialog = document.getElementById("successDialog");
    if (dialog) {
        dialog.close(); // Đóng dialog

    }

}
import { showDialog } from "./showDidlog.js";



const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const home = document.getElementById('home');
const HOME = document.getElementById('HOME');


registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
home.addEventListener('click', () => {
    window.location.href = '../home.html';

});
HOME.addEventListener('click', () => {
    window.location.href = '../home.html';

});


// Lấy các phần tử DOM cần thiết
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form'); 

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const userCreateRequest = {
        email: email,
        userName: username,
        password: password
    };

    try {
        const response = await fetch('http://localhost:5241/api/User/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCreateRequest),
        });

        const data = await response.json();
        if (response.ok) {
            // Hiện form xác thực email
            document.getElementById('verify-code-container').style.display = 'block';

            // Ngăn chặn tương tác với các form đăng nhập/đăng ký
            overlay.style.display = 'block';
            document.querySelector('.form-container.sign-in').classList.add('disabled');
            document.querySelector('.form-container.sign-up').classList.add('disabled');
        } else {
            showDialog("Đăng kí thất bại", data.error || "Mật khẩu và tài khoản không nhỏ hơn 3 kí tự và lớn hơn 20 kí tự");
        }
    }
    catch (error) {
        console.error('Error:', error);
        showDialog("Có lỗi xảy ra", error.message); // Hiển thị thông báo lỗi chung
    }
});



// Xử lý đăng nhập
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const userLoginRequest = {
        userName: username,
        password: password
    };

    try {
        const response = await fetch('http://localhost:5241/api/Authenticate/login', { // Thay đổi địa chỉ API phù hợp
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userLoginRequest),
        });

        const data = await response.json();

        if (response.ok) {

            // Lưu token và refresh token
            localStorage.setItem('token', data.result.token);
            localStorage.setItem('refreshToken', data.result.refreshToken);
            if (data.result.role === "ADMIN") {
                window.location.href = '/src/Admin/pages/index.html';
            } else {


                window.location.href = '../home.html'; // Chuyển hướng đến trang chính
            }
        } else {
            showDialog("Đăng nhập không thành công", data.message); // Hiển thị dialog thông báo
        }
    } catch (error) {
        console.error('Error:', error);
        showDialog("Đăng nhập không thành công", data.message); // Hiển thị dialog thông báo
    }
});


// Xử lý sự kiện xác thực email
document.getElementById('verify-button').addEventListener('click', async () => {
    const email = document.getElementById('register-email').value; // Lấy email từ form đăng ký
    const verificationCodeInputs = Array.from(document.getElementsByClassName('verification-code'));
    const verificationCode = verificationCodeInputs.map(input => input.value).join('');

    const requestData = {
        email: email,
        code: verificationCode
    };

    try {
        const response = await fetch('http://localhost:5241/api/SendEmail/confirm-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        // Kiểm tra xem phản hồi có hợp lệ không
        if (!response.ok) {
            const errorData = await response.json();
            showDialog("Xác thực không thành công", errorData.message); // Hiển thị dialog thông báo
            return;
        }

        const data = await response.json();
        if (data.status === 200) {
            document.getElementById('verify-code-container').style.display = 'none';
            showDialog("Tài khoản đã được tạo thành công, vui lòng đăng nhập!")

            // Khôi phục trạng thái ban đầu của các form
            document.querySelector('.form-container.sign-in').classList.remove('disabled');
            document.querySelector('.form-container.sign-up').classList.remove('disabled');

        } else {
            showDialog("Xác thực không thành công", errorData.message); // Hiển thị dialog thông báo
        }
    } catch (error) {
        console.error('Lỗi:', error);
        showDialog("Xác thực không thành công", errorData.message); // Hiển thị dialog thông báo
    }
});

// Xử lý sự kiện đóng form xác thực
document.getElementById('close-button').addEventListener('click', () => {
    document.getElementById('verify-code-container').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

});

// đóng dialog
window.closeDialog = closeDialog;
export function closeDialog() {
    const dialog = document.getElementById("successDialog");
    if (dialog) {
        dialog.close(); // Đóng dialog
        window.location.reload(); // Tải lại trang
    }

}



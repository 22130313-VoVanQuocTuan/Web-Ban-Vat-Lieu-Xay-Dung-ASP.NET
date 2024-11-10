async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('Refresh token không tồn tại trong localStorage.');
    }

    const response = await fetch('http://localhost:5241/api/Authenticate/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
        throw new Error('Refresh token thất bại, mã lỗi: ' + response.status);
    } else {
        const data = await response.json();  // Đảm bảo rằng bạn nhận được dữ liệu từ API
        // Cập nhật token và refresh token mới
        localStorage.setItem('token', data.message.token);
        localStorage.setItem('refreshToken', data.message.refreshToken);

        console.log('Token mới:', data.message.token);
        console.log('Refresh Token mới:', data.message.refreshToken);

        return data.message.token;  // Trả về token mới để sử dụng
    }
}

export async function customFetch(url, options = {}) {
    let token = localStorage.getItem('token');

    // Gọi API lần đầu với token hiện tại
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });

    // Kiểm tra nếu token hết hạn (lỗi 401)
    if (response.status === 401) {
        try {
            // Làm mới token
           let newToken = await  refreshToken(); // Lấy token mới từ hàm refreshToken
            
            // Gọi lại API với token mới
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newToken}`  // Sử dụng token mới
                }
            });
        } catch (error) {
            console.error('Làm mới token thất bại:', error.message);
            // Xóa token và refresh token khỏi localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            alert("Hết phiên làm việc. Vui lòng đăng nhập lại.");
            window.location.href = "/src/Users/pages/account/login-signup.html"; // Chuyển hướng đến trang đăng nhập
            return; // Kết thúc hàm
        }
    }

    return response; // Trả về phản hồi
}
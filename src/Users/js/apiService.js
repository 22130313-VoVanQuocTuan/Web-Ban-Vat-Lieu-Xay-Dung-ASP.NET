// apiService.js

// Xuất hàm refreshToken
export async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await fetch('http://localhost:5241/api/Authenticate/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
        throw new Error('Refresh token thất bại');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Cập nhật token mới
    return data.token;
}

// Xuất hàm customFetch
export async function customFetch(url, options = {}) {
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    // Kiểm tra nếu token hết hạn (lỗi 401)
    if (response.status === 401) {
        try {
            const newToken = await refreshToken();

            // Gọi lại API với token mới
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newToken}`
                }
            });
        } catch (error) {
            console.error('Làm mới token thất bại:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            alert("hết phiên làm việc")
            window.location.href = "/src/Users/pages/account/login-signup.html"; // Chuyển hướng đến trang đăng nhập
        }
    }

    return response;
}

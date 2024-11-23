document.addEventListener("DOMContentLoaded", async () => {
    try {
        const userId = getUserIdFromToken(); // Lấy UserId từ token
        const response = await fetch(`http://localhost:5241/api/InfoOrder/userId?userId=${userId}`);
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById("email").value = data?.email ?? "";
            document.getElementById("name").value = data?.fullName ?? "";
            document.getElementById("phone").value = data?.phoneNumber ?? "";
            document.getElementById("address").value = data?.address ?? "";
           
        } else {
            const errorMessage = await response.text();
            console.error("Lỗi khi lấy thông tin vận chuyển:", errorMessage);
            alert("Lỗi khi lấy thông tin vận chuyển!");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi khi lấy thông tin vận chuyển.");
    }
});

// Lấy userId từ token
function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Bạn cần đăng nhập để thực hiện hành động này.');
        throw new Error('No token found');
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.UserId; // Đảm bảo tên thuộc tính đúng với cấu trúc của token
    } catch (error) {
        console.error('Lỗi khi giải mã token:', error);
        throw new Error('Token không hợp lệ');
    }
}

document.getElementById("info").addEventListener("click", async () => {
    try {
        const userId = getUserIdFromToken();
        const data = {
            email: document.getElementById("email").value,
            fullName: document.getElementById("name").value,
            phoneNumber: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            note: document.getElementById("note").value,
            userId: userId
        };

        const response = await fetch('http://localhost:5241/api/InfoOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Lưu thông tin thành công!");
        } else {
            const errorData = await response.json();
            let errorMessages = '';
    
            // Kiểm tra và hiển thị tất cả các lỗi trả về từ API
            for (const [key, messages] of Object.entries(errorData.errors)) {
                errorMessages += `${key}: ${messages.join(', ')}\n`;
            }

            alert("Lỗi: \n" + errorMessages);  // Hiển thị tất cả lỗi
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi khi lưu thông tin vận chuyển.");
    }
});
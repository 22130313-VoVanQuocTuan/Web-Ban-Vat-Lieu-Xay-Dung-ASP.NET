
import { showDialog } from "./showDidlog.js";
import { getUserIdFromToken } from "./UserId.js";

//Lấy thông tin vận chuyển
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const userId = getUserIdFromToken(); // Lấy UserId từ token
        const response = await fetch(`http://localhost:5241/api/InfoOrder/userId?userId=${userId}`);
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
            const data = await response.json();
            document.getElementById("email").value = data?.email || '';
            document.getElementById("name").value = data?.fullName || '';
            document.getElementById("phone").value = data?.phoneNumber || '';
            document.getElementById("address").value = data?.address || '';
        } else {
            const errorMessage = await response.json();
            showDialog("Lỗi khi lấy thông tin vận chuyển!", errorMessage.message);
        }
    } catch (error) {
        showDialog("Đã xảy ra lỗi khi lấy thông tin vận chuyển.", error);
    }
});

document.getElementById("info").addEventListener("click", async (event) => {
    event.preventDefault(); // Ngăn reload trang
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

        const datas = await response.json();
        if (datas.status === 200) {
            showDialog("Cập nhật thành công", datas.message);
        } else {
            showDialog("Cập nhật thất bại", "Dữ liệu không được bỏ trống");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

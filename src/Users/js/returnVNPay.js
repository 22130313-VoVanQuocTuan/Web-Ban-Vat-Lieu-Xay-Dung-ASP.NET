

const apiUrl = "http://localhost:5241/api/vnpay/paymentconfirm";

// Lấy các tham số từ URL hiện tại
const urlParams = new URLSearchParams(window.location.search);
const vnp_TxnRef = urlParams.get('vnp_TxnRef');
const vnp_OrderInfo = urlParams.get('vnp_OrderInfo');
const vnp_TransactionNo = urlParams.get('vnp_TransactionNo');
const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
const vnp_SecureHash = urlParams.get('vnp_SecureHash');

// Tạo request đến API
fetch(`${apiUrl}?vnp_TxnRef=${vnp_TxnRef}&vnp_OrderInfo=${vnp_OrderInfo}&vnp_TransactionNo=${vnp_TransactionNo}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_SecureHash=${vnp_SecureHash}`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data); // Kiểm tra dữ liệu trả về
        if (data.message === "Payment successful") {
            document.getElementById("message").textContent = "Cảm ơn bạn đã tin tưởng chúng tôi!";
            document.getElementById("status").textContent = `Giao dịch thành công! ID: ${data.transactionId}`;
            document.getElementById("status").style.color = "green";
        } else {
            document.getElementById("message").textContent = "Giao dịch thất bại.";
            document.getElementById("status").textContent = `Error: ${data.message}`;
            document.getElementById("status").style.color = "red";
        }
    })
    .catch((error) => {
        console.error("Error calling PaymentConfirm API:", error);
        document.getElementById("message").textContent = "Lỗi khi thanh toán";
        document.getElementById("status").textContent = "Xin vui lòng thử lại.";
        document.getElementById("status").style.color = "red";
    });
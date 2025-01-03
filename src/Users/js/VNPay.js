// Helper function to get query string parameters
function getQueryParams() {
    // Sử dụng URLSearchParams để lấy các tham số từ URL
    const params = new URLSearchParams(window.location.search); 
    
    // Tạo một object rỗng để lưu các tham số
    let queryParams = {}; 
    
    // Duyệt qua tất cả các cặp key-value trong URL
    for (const [key, value] of params.entries()) { 
        // Gắn từng cặp key-value vào object queryParams
        queryParams[key] = value; 
    }
    
    // Trả về object chứa các tham số từ URL
    return queryParams; 
}

// Xử lý hiển thị kết quả thanh toán
document.addEventListener("DOMContentLoaded", () => {
    // Truy cập phần tử HTML hiển thị thông báo
    const messageElement = document.getElementById("message"); 
    
    // Truy cập phần tử HTML hiển thị trạng thái thanh toán
    const statusElement = document.getElementById("status"); 
    
    // Lấy các tham số từ URL bằng hàm getQueryParams
    const queryParams = getQueryParams(); 

    // Kiểm tra nếu có tham số vnp_ResponseCode (mã phản hồi từ VNPay)
    if (queryParams.vnp_ResponseCode) { 
        // Lấy mã phản hồi (00 là thành công, các mã khác là thất bại)
        const responseCode = queryParams.vnp_ResponseCode; 
        
        // Lấy số tiền từ tham số vnp_Amount, nếu có (VNPay gửi số tiền tính bằng đơn vị nhỏ nhất, thường là đồng)
        const amount = queryParams.vnp_Amount ? parseFloat(queryParams.vnp_Amount) / 100 : 0; 
        
        // Lấy mã giao dịch (Transaction Reference), hoặc giá trị mặc định là "N/A" nếu không tồn tại
        const transactionRef = queryParams.vnp_TxnRef || "N/A"; 
        
        // Lấy thông tin vnp_OrderInfo, giả sử đây là mã theo dõi đơn hàng (tracking number)
        const trackingNumber = queryParams.vnp_OrderInfo || ""; 
        
        // Xử lý theo mã phản hồi
        if (responseCode === "00") { 
            // Gọi API cập nhật trạng thái thanh toán nếu mã phản hồi là 00 (thanh toán thành công)
            updatePaymentStatus(trackingNumber); 
            
            // Cập nhật nội dung thông báo hiển thị thành công
            messageElement.textContent = "Thanh toán thành công!"; 
            
            // Hiển thị thông tin chi tiết giao dịch như số tiền và mã giao dịch
            statusElement.textContent = `Số tiền: ${amount.toLocaleString()} VND. Mã giao dịch: ${transactionRef}`; 
            
            // Đổi màu trạng thái thành màu xanh lá để báo hiệu thành công
            statusElement.style.color = "green"; 
        } else {
            // Hiển thị thông báo thanh toán thất bại nếu mã phản hồi không phải 00
            messageElement.textContent = "Thanh toán thất bại."; 
            
            // Hiển thị mã lỗi và yêu cầu người dùng thử lại sau
            statusElement.textContent = `Mã lỗi: ${responseCode}. Vui lòng thử lại sau.`; 
            
            // Đổi màu trạng thái thành màu đỏ để báo hiệu thất bại
            statusElement.style.color = "red"; 
        }
    } else {
        // Trường hợp URL không chứa thông tin xác nhận thanh toán
        messageElement.textContent = "Không thể xác nhận thanh toán."; 
        
        // Yêu cầu người dùng kiểm tra lại thông tin thanh toán
        statusElement.textContent = "Vui lòng kiểm tra thông tin thanh toán."; 
        
        // Đổi màu trạng thái thành màu đỏ
        statusElement.style.color = "red"; 
    }
});

// Hàm gọi API để cập nhật trạng thái thanh toán
function updatePaymentStatus(trackingNumber) {
    // Định nghĩa URL API, bao gồm mã theo dõi (trackingNumber) trong URL
    const apiUrl = `http://localhost:5241/api/Order/${trackingNumber}/VNPay-status`; 

    // Gửi yêu cầu PUT tới API
    fetch(apiUrl, {
        method: "PUT", // Phương thức PUT để cập nhật dữ liệu
        headers: {
            "Content-Type": "application/json", // Định dạng dữ liệu là JSON
        },
    })
    .then(response => {
        // Kiểm tra nếu phản hồi từ server là thành công
        if (response.ok) { 
            console.log("Cập nhật trạng thái thanh toán thành công."); // Log ra console nếu thành công
        } else {
            console.error("Cập nhật trạng thái thanh toán thất bại."); // Log ra console nếu thất bại
        }
    })
    .catch(error => {
        // Xử lý lỗi trong quá trình gọi API
        console.error("Lỗi khi gọi API:", error); 
    });
}

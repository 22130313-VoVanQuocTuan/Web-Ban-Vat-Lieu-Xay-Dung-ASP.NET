import { getUserIdFromToken } from "./UserId.js";
import { customFetch } from "/src/apiService.js";

document.querySelector('.submit-btn').addEventListener('click', async (event) => {
    event.preventDefault(); // Ngăn chặn reload form

    // Lấy giá trị phương thức thanh toán
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

    if (!paymentMethod) {
        showDialog('Vui lòng chọn phương thức thanh toán!');
        return;
    }

    const userId = getUserIdFromToken();
    // Dữ liệu request
    const requestData = {
        userId: userId, // Thay bằng giá trị thực tế
        paymentMethod: paymentMethod
    };

    try {
        // Gửi request tới API
        const response = await fetch('http://localhost:5241/api/Order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error('Lỗi khi gọi API');
        }

        const responseData = await response.json();

        // Kiểm tra trạng thái phản hồi
        if (responseData.status !== 200) {
            showDialog('Đơn hàng không hợp lệ!');
        }
        // Cập nhật thông tin trong form
        updateFormData(responseData.results, paymentMethod);
    } catch (error) {
        console.error('Lỗi:', error.message);
        showDialog('Có lỗi xảy ra, vui lòng thử lại sau!',error.message );
    }
});

// Hàm cập nhật dữ liệu trong form
function updateFormData(results, paymentMethod) {
    // Cập nhật thông tin chung
    const dialogId = paymentMethod === 'cod' ? 'codForm' : 'vnpayForm';
    const dialog = document.getElementById(dialogId);

    if (!dialog) return;

    const { orderId, totalAmount,trackingNumber,
        totalPrice, shipping_fee, discount_amount, 
        shipping_address, email, phoneNumber, fullName, note, orderDetailsRespone 
    } = results;
    
    // Lưu orderId vào thuộc tính data-order-id của dialog
    dialog.setAttribute('data-order-id', orderId);
    dialog.setAttribute('total-price',totalPrice )
    dialog.setAttribute('tracking-number',trackingNumber )
    // Điền dữ liệu vào form
    dialog.querySelector('.title').textContent = paymentMethod === 'cod' 
        ? 'Thanh toán khi nhận hàng (COD)' 
        : 'Thanh toán với VNPay';

    // Cập nhật bảng sản phẩm
    const tableBody = dialog.querySelector('table');
    tableBody.innerHTML = `
        <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Gía</th>
            <th>Giảm giá</th>
            <th>Tổng giá</th>
        </tr>
        ${orderDetailsRespone.map(product => `
            <tr>

                <td>${product.productName}</td>
                <td>${product.quantity}</td>
                <td>${product.price}</td>
                <td>${product.discount}</td>
                <td>${product.totalPrice.toLocaleString()} ₫</td>
            </tr>
        `).join('')}
          
    `;
    
    // Điền thông tin khác
    dialog.innerHTML += `
        <p>Tổng giá: ${totalAmount.toLocaleString()} ₫</p>
        <p>Phí vận chuyển: ${shipping_fee.toLocaleString()} ₫</p>
        <p>Giảm giá: ${discount_amount.toLocaleString()} ₫</p>
        <p>Tổng cộng: ${totalPrice.toLocaleString()} ₫</p>
        <p>Địa chỉ giao: ${shipping_address}</p>
        <p>Email: ${email}</p>
        <p>Tên người nhận: ${fullName}</p>
        <p>Số điện thoại: ${phoneNumber}</p>
        <p>Ghi chú: ${note}</p>
        
    `;
    
    // Hiển thị form
    dialog.showModal();
}

window.closeForm = closeForm;
// Đóng form
async function closeForm(dialogId) {
    const dialog = document.getElementById(dialogId);

    if (dialog) {
        // Lấy orderId từ thuộc tính data-order-id
        const orderId = dialog.getAttribute('data-order-id');

        if (!orderId) {
            showDialog("Không tìm thấy mã hóa đơn để hủy.");
            return;
        }

        try {
            // Gọi API hủy hóa đơn
            const response = await fetch(`http://localhost:5241/api/Order/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (result.status === 200) {
                showDialog(result.message);
                location.reload(); // Refresh trang
            } else {
                showDialog(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API hủy hóa đơn:", error.message);
            showDialog("Lỗi không mong muốn khi hủy hóa đơn.");
        } finally {
            // Đóng form sau khi gọi API
            dialog.close();
        }
    }
}

window.confirmCOD = confirmCOD;
// Xác nhận thanh toán với COD
async function confirmCOD(dialogId) {
    const dialog = document.getElementById(dialogId); // Lấy phần tử dialog từ id
    if (!dialog) {
        showDialog("Không tìm thấy form thanh toán.");
        return;
    }

    const orderId = dialog.getAttribute('data-order-id'); // Lấy orderId từ thuộc tính data-order-id của dialog

    if (!orderId) {
        showDialog("Không tìm thấy ID đơn hàng.");
        return;
    }

    const userId = getUserIdFromToken();

    try {
        // Gửi yêu cầu POST tới API
        const response = await customFetch(`http://localhost:5241/api/Order/${orderId}/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Xử lý phản hồi từ API
        const data = await response.json();

        if (data.status === 200) {
                
            showDialog("Đặt hàng thành công!", data.message); // Hiển thị dialog thông báo
            
        } else {
            throw new Error(data.message || "Lỗi xác nhận đơn hàng.");
        }
    } catch (error) {
        console.error("Lỗi:", error.message);
        showDialog("Đặt hàng thất bại", error.message); // Hiển thị dialog lỗi
    }
}


window.confirmVNPay = confirmVNPay;
async function confirmVNPay(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (!dialog) {
        showDialog("Không tìm thấy form thanh toán.");
        return;
    }

    const trackingNumber = dialog.getAttribute('tracking-number');
    const totalprice = dialog.getAttribute('total-price');
  
    if (!trackingNumber) {
        alert("Không tìm thấy mã đơn hàng.");
        return;
    }

    const apiUrl = `http://localhost:5241/api/vnpay/payment`;

    try {
        // Gửi yêu cầu POST tới API với body JSON
        const response = await customFetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: parseFloat(totalprice),
                infor: 'Thanh toán với VNPay',
                orderinfor: trackingNumber
            })
        });

        // Kiểm tra phản hồi thô từ server trước khi chuyển đổi thành JSON
        const responseText = await response.text();
        console.log("Phản hồi từ server:", responseText);

        // Kiểm tra phản hồi trước khi chuyển đổi thành JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (error) {
            console.error("Không thể phân tích phản hồi JSON:", error.message);
            showDialog("Phản hồi từ server không hợp lệ.");
            return;
        }

        if (response.ok && data.paymentUrl) {
            window.location.href = data.paymentUrl;
        } else {
            showDialog(data.message || "Lỗi xác nhận đơn hàng.");
        }
    } catch (error) {
        console.error("Lỗi:", error.message);
        showDialog("Đặt hàng thất bại", error.message);
    }
}

// Hàm hiển thị dialog
function showDialog(title, message) {
    // Đóng tất cả các dialog hiện tại trước khi mở dialog mới
    const existingDialog = document.querySelector('dialog[open]');
    if (existingDialog) {
        existingDialog.close(); // Đóng dialog hiện tại nếu có
    }

    // Lấy dialog mới và cập nhật nội dung
    const dialog = document.getElementById("successDialog");

    if (dialog) {
        dialog.querySelector(".dialog-title").textContent = title;
        dialog.querySelector(".dialog-message").textContent = message;
        dialog.showModal(); // Hiển thị dialog mới
    }
}

window.closeDialog = closeDialog;
function closeDialog() {
    const dialog = document.getElementById("successDialog");
    if (dialog) {
        dialog.close(); // Đóng dialog
        location.reload();
    }
    
}

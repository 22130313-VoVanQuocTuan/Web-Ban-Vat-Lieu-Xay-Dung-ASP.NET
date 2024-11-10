import { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn chính xác

async function getDiscount() {
    try {
        const response = await customFetch('http://localhost:5241/api/Discount', {
            method: 'GET',
            headers: {
               
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const vouchers = await response.json();  // Phân tích JSON từ response
            displayVouchers(vouchers.response);  // Gọi hàm để hiển thị dữ liệu vào bảng
        } else {
            console.error("Lỗi khi gọi API:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// Hàm hiển thị voucher lên bảng
function displayVouchers(vouchers) {
    const voucherList = document.getElementById('voucherList');
    voucherList.innerHTML = '';

    vouchers.forEach(voucher => {
        const voucherRow = document.createElement('tr');
        voucherRow.innerHTML = `
            <td>${voucher.discountId}</td>  <!-- Hiển thị ID voucher -->
            <td>${voucher.code}</td>       <!-- Hiển thị mã voucher -->
            <td>${voucher.percent.toLocaleString()} VNĐ</td>   <!-- Hiển thị tỷ lệ giảm giá -->
            <td>
                
                <a href="#" class="delete" data-id="${voucher.discountId}">Xóa</a>
            </td>
        `;
        voucherList.appendChild(voucherRow);
    });
    
// Thêm event listeners cho "Xóa"
document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', function(event) {
        const id = event.target.getAttribute('data-id');
        deleteVoucher(id);
    });
});
}
// Hàm xóa voucher
async function deleteVoucher(id) {
    try {
        // Gọi API xóa voucher
        const response = await customFetch(`http://localhost:5241/api/Discount/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            alert("Xóa voucher thành công!");
            getDiscount(); // Cập nhật lại danh sách voucher
        } else {
            const error = await response.json();
            alert(`Lỗi khi xóa voucher: ${error.message}`);
        }
    } catch (err) {
        console.error("Lỗi:", err);
        alert("Có lỗi xảy ra khi xóa voucher.");
    }
}

// Gọi hàm getDiscount sau khi trang tải xong
document.addEventListener("DOMContentLoaded", function() {
    getDiscount();
});



document.getElementById("addVoucher").addEventListener("click", async function(event) {
    event.preventDefault(); // Ngừng hành động mặc định của form, tránh reload trang

    // Lấy dữ liệu từ các trường input
    const voucherCode = document.getElementById('voucherCode').value;
    const voucherDown = parseFloat(document.getElementById('voucherDown').value);

    // Kiểm tra xem các trường có trống không
    if (!voucherCode || !voucherDown) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    // Tạo đối tượng dữ liệu voucher
    const voucherData = {
        code: voucherCode,
        percent: voucherDown  // Đảm bảo rằng giá trị giảm giá là số
    };

    try {
        // Gửi yêu cầu POST tới API để thêm voucher mới
        const response = await customFetch('http://localhost:5241/api/Discount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(voucherData)
        });

        // Kiểm tra phản hồi từ server
        if (response.status === 200) {
            alert("Thêm voucher thành công!");
            closeAddVoucherModal();  // Đóng modal sau khi thêm thành công
            getDiscount();  // Cập nhật lại danh sách voucher
        } else {
            const error = await response.json();
            alert(`${error.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Đã có lỗi xảy ra khi thêm voucher.");
    }
});

// Lắng nghe sự kiện click để mở modal
const openAddVoucherButton = document.getElementById("addopenvoucher");

if (openAddVoucherButton) {
    openAddVoucherButton.addEventListener("click", function() {
        document.getElementById('addVoucherModal').style.display = 'block';  // Mở modal
    });
}

// Hàm để đóng modal
function closeAddVoucherModal() {
    document.getElementById('addVoucherModal').style.display = 'none';
}

// Đóng modal khi nhấn nút thoát
document.querySelector('.exit-btn').addEventListener("click", function() {
    closeAddVoucherModal();
});
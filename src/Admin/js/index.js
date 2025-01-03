// Hàm gọi API và hiển thị đơn hàng
async function loadOrders() {
    try {
        // Gọi API để lấy danh sách tất cả đơn hàng
        const response = await fetch('http://localhost:5241/api/Order/order-new');
        if (!response.ok) {
            throw new Error('Lỗi khi tải danh sách đơn hàng');
        }
        const data = await response.json();

        // Kiểm tra dữ liệu trả về
        if (!Array.isArray(data.message)) {
            console.error('Dữ liệu trả về không đúng:', data);
            return;
        }

        // Lưu tất cả đơn hàng
        window.allOrders = data.message;

        // Hiển thị chỉ 10 đơn hàng đầu tiên
        renderOrders(data.message.slice(0, 10));
    } catch (error) {
        console.error('Error loading orders:', error);
        alert('Không thể tải danh sách đơn hàng!');
    }
}

function renderOrders(orders) {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = ''; // Xóa dữ liệu cũ

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${parseFloat(order.price).toLocaleString()}₫</td>
            <td class="payment-status">${order.paymentStatus}</td>
            <td><span class="status ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></td>
            <td>
                <button class="update-order-status" data-order-id="${order.orderId}">Cập nhật trạng thái đơn hàng</button>
                <button class="update-payment-status" data-order-id="${order.orderId}">Cập nhật trạng thái thanh toán</button>
            </td>
        `;

        // Gắn sự kiện cho các nút
        row.querySelector('.update-order-status').addEventListener('click', () => {
            updateStatus(order.orderId, 'order');
        });
        row.querySelector('.update-payment-status').addEventListener('click', () => {
            updateStatus(order.orderId, 'payment');
        });

        tbody.appendChild(row);
    });
}

// Hiển thị tất cả đơn hàng khi nhấn "Xem Tất Cả"
document.getElementById('viewAllBtn').addEventListener('click', () => {
    renderOrders(window.allOrders);
});

async function updateStatus(orderId, type) {
    const status = prompt(`Nhập trạng thái mới cho ${type === 'order' ? 'đơn hàng' : 'thanh toán'}:`);

    if (!status) return; // Hủy nếu không nhập trạng thái

    const endpoint = type === 'order' 
        ? `http://localhost:5241/api/Order/${orderId}/status` 
        : `http://localhost:5241/api/Order/${orderId}/payment-status`;

    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        const result = await response.json();

        if (response.ok) {
            showToast("Cập nhật thành công");
            loadOrders();
        } else {
            showToast(result.message || 'Cập nhật thất bại!');
            loadOrders();
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
}

// Hàm gọi API và hiển thị dữ liệu khách hàng
async function loadCustomers() {
    try {
        // Gọi API lấy danh sách khách hàng gần đây
        const response = await fetch('http://localhost:5241/api/Order/top-order');
        
        if (!response.ok) {
            throw new Error('Error fetching data');
        }

        // Lấy dữ liệu từ API
        const data = await response.json();

        // Lấy đối tượng bảng để hiển thị
        const customerTable = document.getElementById('recentCustomers');
        customerTable.innerHTML = ''; // Xóa nội dung cũ trước khi thêm mới

        // Duyệt qua dữ liệu và tạo các dòng trong bảng
        data.message.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = ` 
                <td width="60px">
                    <div class="imgBx">
                        <img src="/src/Admin/imgs/customer01.jpg" alt="Customer Image" />
                    </div>
                </td>
                <td><h4>${customer.username}</h4></td>
                <td><p>Số tiền: ${customer.totalPrice.toLocaleString()}₫</p></td>
            `;
            customerTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// Số lượng khách hàng, đánh giá, doanh thu
async function loadDashboardData() {
    try {
        // Gọi API để lấy thông tin số liệu
        const response = await fetch('http://localhost:5241/api/User/number');
        
        // Kiểm tra trạng thái HTTP của phản hồi
        if (!response.ok) {
            console.error('HTTP error:', response.status);
            return;
        }

        const data = await response.json();

        // Kiểm tra trạng thái của phản hồi từ API
        if (data.status !== 200) {
            console.error('Error fetching data:', data.message);
            return;
        }

        // Lấy dữ liệu từ API
        const { totalUser, rate, revenue } = data.message;

        // Cập nhật số người dùng
        const userElement = document.querySelector('.numbers');
        if (userElement) {
            userElement.textContent = totalUser; // Cập nhật số người dùng
        } else {
            console.error('User element not found');
        }

        // Cập nhật số nhận xét
        const reviewElement = document.querySelector('.card:nth-child(2) .numbers');
        if (reviewElement) {
            reviewElement.textContent = rate;
        } else {
            console.error('Review element not found');
        }

        // Cập nhật doanh thu
        const revenueElement = document.querySelector('.card:nth-child(3) .numbers');
        if (revenueElement) {
            revenueElement.textContent = parseFloat(revenue).toLocaleString() + '₫';
        } else {
            console.error('Revenue element not found');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Gọi cả ba hàm khi trang được tải
window.onload = () => {
    loadOrders();        // Tải đơn hàng
    loadCustomers();     // Tải khách hàng gần đây
    loadDashboardData(); // Tải dữ liệu bảng điều khiển
};

// Hiển thị thông báo
const showToast = (message) => {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
};

// Hàm gọi API và hiển thị đơn hàng
async function loadOrders() {
    try {
        // Gọi API để lấy danh sách tất cả đơn hàng
        const response = await fetch('http://localhost:5241/api/Order/order-new');
        const data = await response.json();

        // Kiểm tra xem 'message' có phải là mảng không
        if (!Array.isArray(data.message)) {
            console.error('Dữ liệu trả về không phải là mảng:', data);
            return; // Dừng lại nếu không phải mảng
        }

        // Lấy mảng đơn hàng từ 'message'
        const orders = data.message;

        // Lấy bảng để hiển thị dữ liệu
        const tbody = document.getElementById('orderTableBody');
        tbody.innerHTML = ''; // Xóa dữ liệu cũ nếu có
       
        // Hiển thị chỉ 10 đơn hàng đầu tiên
        const ordersToShow = orders.slice(0, 10);

        ordersToShow.forEach(order => {
             // Kiểm tra và chuyển đổi giá nếu cần
             const price = parseFloat(order.price) || 0; // Nếu không phải số thì gán 0
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.orderId}</td>
                <td>${price.toLocaleString()} ₫</td>
                <td>${order.paymentStatus}</td>
                <td><span class="status ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></td>
            `;
            tbody.appendChild(row);
        });

        // Lưu lại toàn bộ đơn hàng để hiển thị sau khi nhấn "Xem Tất Cả"
        window.allOrders = orders;
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Hiển thị tất cả đơn hàng khi nhấn "Xem Tất Cả"
document.getElementById('viewAllBtn').addEventListener('click', () => {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = ''; // Xóa các đơn hàng hiện tại

    window.allOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = ` 
            <td>${order.orderId}</td>
            <td>${order.price.toLocaleString()}₫</td>
            <td>${order.paymentStatus}</td>
            <td><span class="status ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></td>
        `;
        tbody.appendChild(row);
    });

    // Ẩn nút "Xem Tất Cả" nếu không cần thiết
    document.getElementById('viewAllBtn').style.display = 'none';
});

// Hàm gọi API và hiển thị dữ liệu khách hàng
async function loadCustomers() {
    try {
      // Gọi API lấy danh sách khách hàng gần đây (thay 'YOUR_API_URL' bằng URL của API của bạn)
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
          
           <td> <h4>${customer.username}</h4></td>
            <td><p>Số tiền: ${customer.totalPrice.toLocaleString()}₫</p></td>
          </td>
        `;
        customerTable.appendChild(row);
      });
    } catch (error) {
      console.error('Error loading customers:', error);
    }
}


// Hàm gọi API và cập nhật giao diện
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
// Gọi cả hai hàm khi trang được tải
window.onload = () => {
    loadOrders(); // Tải đơn hàng
    loadCustomers(); // Tải khách hàng gần đây
    loadDashboardData();
};

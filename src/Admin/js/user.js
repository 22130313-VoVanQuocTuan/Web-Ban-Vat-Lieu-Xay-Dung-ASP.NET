import { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn chính xác

// Hàm gọi API và hiển thị danh sách người dùng
async function loadUsers() {
    try {
        // Gọi API để lấy danh sách người dùng
        const response = await customFetch('http://localhost:5241/api/User/users', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Kiểm tra trạng thái phản hồi
        if (data.status !== 200) {
            console.error('Error fetching users:', data.message);
            return;
        }

        // Lấy danh sách người dùng từ phản hồi
        const users = data.result;

        // Hiển thị danh sách người dùng trong bảng
        const userListElement = document.getElementById('userList');
        userListElement.innerHTML = ''; // Xóa nội dung cũ

        users.forEach(user => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${user.fullName}</td>
                <td>${user.userName}</td>
                <td>${user.email}</td>
                <td>${user.address}</td>
                <td>${user.phoneNumber}</td>
                <td><button class="delete-btn" data-userid="${user.id}">Xóa</button></td>
            `;

            userListElement.appendChild(row);
        });

        // Gắn sự kiện cho tất cả các nút "Xóa" sau khi người dùng được tải
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const userId = this.getAttribute('data-userid'); // Lấy ID từ thuộc tính data-userid
                deleteUser(userId); // Gọi hàm xóa
            });
        });

    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Hàm xóa người dùng
async function deleteUser(userId) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        return;
    }

    try {
        const response = await customFetch(`http://localhost:5241/api/User/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 200) {
            alert('Xóa không thành công: ' + data.message);
            return;
        }

        alert('Xóa thành công!');
        loadUsers(); // Làm mới danh sách người dùng
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Gọi hàm loadUsers khi trang tải
loadUsers();

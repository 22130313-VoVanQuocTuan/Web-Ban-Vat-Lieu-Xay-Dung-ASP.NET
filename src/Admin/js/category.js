import { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn chính xác


// Hàm gọi API để lấy danh sách danh mục sản phẩm
async function loadCategories() {
    try {
        const response = await customFetch('http://localhost:5241/api/Category/category', {
            method: 'GET',
        
        });

        if (!response.ok) {
            throw new Error('Không thể tải danh mục');
        }

        const data = await response.json();
        const categories = data.result;

        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = ''; // Xóa nội dung hiện tại trong bảng

        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.categotyId}</td>
                <td>${category.name}</td>
                <td>
                    <button class="delete-btn" onclick="openDeleteDialog(${category.categotyId})">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
    }
}

// Gọi hàm để tải danh mục khi trang được tải
window.onload = loadCategories;




// Mở modal thêm sản phẩm khi nhấn nút "Thêm danh mục"
document.getElementById('add-product-btn').onclick = function() {
    document.getElementById('addProductModal').style.display = 'block';
}

// Đóng modal khi nhấn vào nút "X"
document.getElementById('closeModal').onclick = function(){
    document.getElementById('addProductModal').style.display = 'none';
}
// Đóng modal khi nhấn vào nút "X"
document.getElementById('close2').onclick = function(){
    document.getElementById('addProductModal').style.display = 'none';
}


// Gọi API để thêm danh mục
// Sự kiện lưu thay đổi
document.getElementById('addProductButton').addEventListener('click', addCategory);
async function addCategory() {
    // Lấy dữ liệu từ form
    const categoryName = document.getElementById('productName').value;
  
    try {
        // Gọi API để thêm danh mục
        const response = await customFetch('http://localhost:5241/api/Category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: categoryName
               
            })
        });

        if (!response.ok) {
            throw new Error('Không thể thêm danh mục');
        }

        // Nếu thêm thành công, đóng modal và làm mới danh sách danh mục
        alert('Thêm danh mục thành công');
        document.getElementById('addProductModal').style.display = 'none';
         loadCategories(); // Làm mới danh sách danh mục (giả sử có hàm loadCategories để hiển thị danh sách)
    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
    }
}

window.openDeleteDialog = openDeleteDialog;
// Mở hộp thoại xác nhận xóa
function openDeleteDialog(categoryId) {
    const deleteButton = document.getElementById('delete-category');
    deleteButton.onclick = function() {
        deleteCategory(categoryId);
    };
    document.getElementById('deleteConfirmDialog').showModal();
}

// Xóa danh mục sản phẩm
// Sự kiện lưu thay đổi

async function deleteCategory(categoryId) {
    try {
        const response = await customFetch(`http://localhost:5241/api/Category/${categoryId}`, {
            method: 'DELETE',
         });

        if (!response.ok) {
            throw new Error('Không thể xóa danh mục');
        }

        alert('Xóa danh mục thành công');
        loadCategories(); // Làm mới danh sách sau khi xóa
        document.getElementById('deleteConfirmDialog').close();
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
    }
}

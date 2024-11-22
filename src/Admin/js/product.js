const products = [];
let currentPage = 1;
const pageSize = 10;

import { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn chính xác

// Hàm lấy danh sách sản phẩm với phân trang
async function fetchProducts(page = 1) {
    try {
        const response = await fetch(`http://localhost:5241/api/Product?page=${page}&size=${pageSize}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            products.length = 0; // Xóa dữ liệu cũ
            products.push(...data.results); // Thêm dữ liệu mới
            displayProducts(); // Hiển thị danh sách sản phẩm
        } else {
            console.error("Error: ", response.statusText);
            alert("Failed to fetch products.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching products.");
    }
}

// Hiển thị danh sách sản phẩm trong bảng
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Xóa nội dung cũ

    products.forEach((product) => {
        const productRow = document.createElement('tr');
        const imageUrl = product.urlImage.startsWith('http') ? product.urlImage : `http://localhost:5241${product.urlImage}`;
        productRow.innerHTML = `
            <td>${product.productId}</td>
            <td><img src="${imageUrl}" alt="Product Image" width="50" height="50"></td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.stockQuantity}</td>
            <td>${new Date(product.createdAt).toLocaleDateString()}</td>
            <td>${product.status}</td>
             <td>${product.categoryId}</td>
            <td class="bt">
                 <button class="view-description-button" data-description="${product.description}">Mô tả</button>
                 
                 <button class="update-product-button" data-product-id="${product.productId}">Cập nhật</button>
                <button class="delete-product-button" data-product-id="${product.productId}">Xóa</button>
            </td>
        `;
        productList.appendChild(productRow);
    });

    attachEventListeners();

 
}

// Hàm hiển thị mô tả sản phẩm trong modal
function viewDescription(event) {
    const button = event.target; // Lấy đối tượng button đã nhấn
    const description = button.getAttribute('data-description'); // Lấy mô tả từ data-description

    // Lấy phần tử modal để hiển thị mô tả sản phẩm
    const descriptionDetails = document.getElementById('productDescriptionDetails');
    descriptionDetails.innerHTML = description; // Cập nhật nội dung mô tả trong modal

    // Hiển thị modal
    const modal = document.getElementById('viewDescriptionModal');
    modal.style.display = 'block';
}

// Hàm đóng modal khi người dùng nhấn vào nút đóng
function closeViewDescriptionModal() {
    const modal = document.getElementById('viewDescriptionModal');
    modal.style.display = 'none'; // Ẩn modal
}

// Khi người dùng nhấn vào vùng ngoài modal, modal sẽ đóng
window.onclick = function(event) {
    const modal = document.getElementById('viewDescriptionModal');
    if (event.target === modal) {
        closeViewDescriptionModal();
    }
};


// Gán sự kiện cho các nút xóa và cập nhật được thêm động
function attachEventListeners() {
    document.querySelectorAll('.delete-product-button').forEach(button => {
        button.addEventListener('click', deleteProduct);
    });
    document.querySelectorAll('.update-product-button').forEach(button => {
        button.addEventListener('click', handleEditProduct);
    });

    document.querySelectorAll('.view-description-button').forEach(button => {
        button.addEventListener('click', viewDescription );
         
    });
}

// Định nghĩa các hàm toàn cục để có thể truy cập từ HTML
window.openAddProductModal = openAddProductModal;
window.viewDescription = viewDescription;
window.addProduct = addProduct;
window.closeUpdateProductModal = closeUpdateProductModal;
window.closeAddProductModal = closeAddProductModal;
window.closeViewDescriptionModal = closeViewDescriptionModal;

// Hàm mở modal thêm sản phẩm
function openAddProductModal() {
    document.getElementById("addProductModal").style.display = "block";
}

// Hàm đóng modal thêm sản phẩm
function closeAddProductModal() {
    document.getElementById("addProductModal").style.display = "none"; // Ẩn modal khi nhấn "Thoát"
}

// Hàm đóng modal cập nhật sản phẩm
function closeUpdateProductModal() {
   document.getElementById("updateProductModal").style.display = "none";
}






// Gán sự kiện click cho các nút "View Description" sau khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('.view-description-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewDescription(button); // Gọi hàm khi nhấn nút
        });
    });
});


CKEDITOR.replace('productDescription');
// Đăng ký sự kiện cho nút thêm sản phẩm
document.getElementById("addProductButton").addEventListener("click", addProduct);
// Hàm thêm sản phẩm mới
async function addProduct() {
    const productStatusElement = document.getElementById("productStatus");
    const productStatusText = productStatusElement.options[productStatusElement.selectedIndex].textContent;

    const formData = new FormData();
    formData.append("Name", document.getElementById("productName").value);
    formData.append("Price", parseFloat(document.getElementById("productPrice").value));
    formData.append("CategoryId", parseInt(document.getElementById("productCategory").value));
    formData.append("StockQuantity", parseInt(document.getElementById("productStock").value));
   // Lấy mô tả từ CKEditor (bao gồm HTML)
   formData.append("Description", CKEDITOR.instances.productDescription.getData());
    formData.append("Status", productStatusText);

    const productImage = document.getElementById("productImage").files[0];
    if (productImage) formData.append("UrlImage", productImage);

    try {
        const response = await fetch("http://localhost:5241/api/Product/product", {
            method: "POST",
            body: formData,
          
        });

        if (response.ok) {
            closeAddProductModal();
            fetchProducts(currentPage);
        } else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error adding product.");
    }
}

// Hàm xóa sản phẩm
async function deleteProduct(event) {
    const productId = event.target.getAttribute('data-product-id');
    try {
        const response = await customFetch(`http://localhost:5241/api/Product/${productId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            fetchProducts(currentPage);
        } else {
            console.error("Error deleting product:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}





// Hàm lưu thay đổi sản phẩm và gọi API để cập nhật
async function handleEditProduct(event) {
    const productId = event.target.getAttribute("data-product-id");
    const product = products.find(p => p.productId == productId); // Tìm sản phẩm theo ID

    // Điền thông tin vào form trong modal
    document.getElementById('updateProductName').value = product.name;
    document.getElementById('updateProductPrice').value = product.price;
    document.getElementById('updateProductCategory').value = product.categoryId;
    document.getElementById('updateProductStock').value = product.stockQuantity;
    document.getElementById('updateProductDescription').value = product.description;
    document.getElementById('updateProductStatus').value = product.status;
    
    // Nếu hình ảnh có, hiển thị hình ảnh trong modal
    const imageUrl = product.urlImage.startsWith('http') ? product.urlImage : `http://localhost:5241${product.urlImage}`;
    document.getElementById('updateProductImage').value = ''; // Reset file input
    document.getElementById('updateProductModal').style.display = 'block'; // Mở modal
    document.getElementById('updateProductModal').setAttribute("data-product-id", product.productId);
}

// Lưu thay đổi sản phẩm
 async function saveProductChanges() {
    const productId = document.getElementById('updateProductModal').getAttribute('data-product-id');
    const product = products.find(p => p.productId == productId); // Sản phẩm hiện tại

    const formData = new FormData();

    // Chỉ lấy giá trị từ form nếu có sự thay đổi, nếu không giữ nguyên giá trị cũ
    const updatedName = document.getElementById("updateProductName").value || product.name;
    if (updatedName !== product.name) {
        formData.append("Name", updatedName);
    }

    const updatedPrice = parseFloat(document.getElementById("updateProductPrice").value) || product.price;
    if (updatedPrice !== product.price) {
        formData.append("Price", updatedPrice);
    }

    const updatedCategoryId = parseInt(document.getElementById("updateProductCategory").value) || product.categoryId;
    if (updatedCategoryId !== product.categoryId) {
        formData.append("CategoryId", updatedCategoryId);
    }

    const updatedStockQuantity = parseInt(document.getElementById("updateProductStock").value) || product.stockQuantity;
    if (updatedStockQuantity !== product.stockQuantity) {
        formData.append("StockQuantity", updatedStockQuantity);
    }

    const updatedDescription = document.getElementById("updateProductDescription").value || product.description;
    if (updatedDescription !== product.description) {
        formData.append("Description", updatedDescription);
    }

    // Xử lý trạng thái sản phẩm
    const productStatusElement = document.getElementById("updateProductStatus");
    let updatedStatus = product.status; // Sử dụng trạng thái hiện tại làm mặc định
    if (productStatusElement && productStatusElement.selectedIndex >= 0) {
        updatedStatus = productStatusElement.options[productStatusElement.selectedIndex].textContent;
    }
    if (updatedStatus !== product.status) {
        formData.append("Status", updatedStatus);
    }

    // Xử lý hình ảnh
    const productImage = document.getElementById("updateProductImage").files[0];
    if (productImage) {
        formData.append("UrlImage", productImage); // Thêm hình ảnh mới nếu có
    } else if (product.urlImage) {
        formData.append("UrlImage", product.urlImage); // Giữ hình ảnh hiện tại nếu không có hình mới
    }

    // Gửi yêu cầu PUT với productId ở cuối URL
    const response = await customFetch (`http://localhost:5241/api/Product/${productId}`, {
        method: 'PUT',
        body: formData
    });

    // Kiểm tra phản hồi từ server
    if (response.ok) {
        alert('Cập nhật sản phẩm thành công!');
        closeUpdateProductModal();
        fetchProducts(currentPage);
    } else {
        console.error('Lỗi khi cập nhật sản phẩm:', response.statusText);
        alert('Cập nhật sản phẩm thất bại');
    }
}
// Sự kiện lưu thay đổi
document.getElementById('saveChangesButton').addEventListener('click', saveProductChanges);
// Khởi chạy khi trang được load
window.addEventListener("DOMContentLoaded", () => fetchProducts(currentPage));

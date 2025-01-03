const products = [];
let currentPage = 1;
const pageSize = 1000;
import { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn chính xác
// Hàm lấy danh sách sản phẩm với phân trang
async function fetchProducts(page = 1) {
    try {
        const response = await fetch(`http://localhost:5241/api/Product?page=${page}&size=${pageSize}`, {
            method: 'GET',
            headers: {
                   "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const data = await response.json();
            products.length = 0; // Xóa dữ liệu cũ
            products.push(...data.results.products); // Thêm dữ liệu mới
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
            <td>${product.price.toLocaleString() } VNĐ</td>
            <td>${product.stockQuantity}</td>
            <td>${new Date(product.createdAt).toLocaleDateString()}</td>
            <td>${product.status}</td>
             <td>${product.categoryId}</td>
            <td class="bt">
                 <button class="view-description-button" data-product-id="${product.productId}">Mô tả</button>
                 
                 <button class="update-product-button" data-product-id="${product.productId}">Cập nhật</button>
                <button class="delete-product-button" data-product-id="${product.productId}">Xóa</button>
            </td>
        `;
        productList.appendChild(productRow);
    });
    attachEventListeners();
 
}
//Xem mô tả
async function getDescription(event) {
    const productId = event.target.getAttribute("data-product-id");
    // Gọi API để lấy mô tả sản phẩm
    const response = await fetch(`http://localhost:5241/api/Product/description/${productId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    // Kiểm tra nếu API trả về dữ liệu
    const data = await response.json(); // Chuyển dữ liệu từ JSON
    if (data.status === 200) {
        const description = data.results.description; // Lấy mô tả từ kết quả API
        // Giải mã HTML nếu cần
        const parser = new DOMParser();
        const decodedDescription = parser.parseFromString(description, 'text/html').body.innerHTML;
        // Hiển thị mô tả vào modal
        document.getElementById("productDescriptionDetails").innerHTML = decodedDescription;
        // Mở modal
        document.getElementById("viewDescriptionModal").style.display = "block";
    } else {
        // Xử lý lỗi nếu không có phản hồi thành công từ API
        console.error('Có lỗi xảy ra khi gọi API');
    }
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
        button.addEventListener('click', getDescription);
    });
}
// Định nghĩa các hàm toàn cục để có thể truy cập từ HTML
window.openAddProductModal = openAddProductModal;
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
CKEDITOR.replace('productDescriptions');
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
    formData.append("Description", CKEDITOR.instances.productDescriptions.getData());
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
async function handleEditProduct(event) {
    const productId = event.target.getAttribute("data-product-id");
    const product = products.find(p => p.productId == productId);
    const imageUrl = product.urlImage.startsWith('http') ? product.urlImage : `http://localhost:5241${product.urlImage}`;
    
    const descriptions = document.getElementById("updateProductModal");
    descriptions.style.display = "block";
    document.getElementById('updateProductName').value = product.name;
    document.getElementById('updateProductPrice').value = product.price;
    document.getElementById('updateProductCategory').value = product.categoryId;
    document.getElementById('updateProductStock').value = product.stockQuantity;
   // Kiểm tra nếu CKEditor đã được khởi tạo
    if (CKEDITOR.instances.updateProductDescription) {
        // Gán dữ liệu vào CKEditor
        CKEDITOR.instances.updateProductDescription.setData(product.description);
    } else {
        // Nếu chưa khởi tạo, khởi tạo CKEditor và gán dữ liệu sau
        CKEDITOR.replace('updateProductDescription', {
            on: {
                instanceReady: function () {
                    CKEDITOR.instances.updateProductDescription.setData(product.description);
                }
            }
        });
    }
    document.getElementById('updateProductStatus').value = product.status;  
    
    const imageElement = document.getElementById('currentProductImage');
    imageElement.src = imageUrl || '';
    document.getElementById('saveChangesButton').setAttribute('data-product-id', productId);
}
CKEDITOR.replace('updateProductDescription');
async function saveProductChanges(event) {
    const productId = event.target.getAttribute('data-product-id');
    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    
    // Thêm các trường dữ liệu vào FormData
    formData.append('name', document.getElementById('updateProductName').value);
    formData.append('price', parseFloat(document.getElementById('updateProductPrice').value));
    formData.append('categoryId', document.getElementById('updateProductCategory').value);
    formData.append('stockQuantity', parseInt(document.getElementById('updateProductStock').value));
    formData.append('description', CKEDITOR.instances.updateProductDescription.getData());
    formData.append('status', document.getElementById('updateProductStatus').value);
    // Lấy tệp hình ảnh từ input và thêm vào FormData
    const urlImage = document.getElementById('updateProductImage').files[0];
    if (urlImage) {
        formData.append('urlImage', urlImage);  // Thêm tệp vào FormData
    }
    try {
        const response = await fetch(`http://localhost:5241/api/Product/${productId}`, {
            method: 'PUT',
            body: formData  // Gửi FormData thay vì JSON
        });
        if (response.ok) {
            alert('Cập nhật sản phẩm thành công!');
            closeUpdateProductModal();
            fetchProducts(currentPage);
        } else {
            alert('Cập nhật sản phẩm thất bại');
            console.error('Lỗi:', response.statusText);
        }
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu cập nhật:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
}
// Sự kiện lưu thay đổi
document.getElementById('saveChangesButton').addEventListener('click', saveProductChanges);
// Khởi chạy khi trang được load
window.addEventListener("DOMContentLoaded", () => fetchProducts(currentPage));
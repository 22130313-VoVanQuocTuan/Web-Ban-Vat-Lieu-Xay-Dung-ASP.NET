const products = [];
let currentPage = 1;
const pageSize = 10;

// Hàm gọi API lấy danh sách sản phẩm theo trang
async function fetchProducts(page = 1) {
    try {
        const response = await fetch(`http://localhost:5241/api/Product?page=${page}&size=${pageSize}`);
        if (response.ok) {
            const result = await response.json();
            products.length = 0; // Xóa sản phẩm cũ trong mảng
            products.push(...result);
            displayProducts();
        } else {
            alert("Lỗi khi lấy danh sách sản phẩm.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Đã xảy ra lỗi khi lấy danh sách sản phẩm.");
    }
<<<<<<< HEAD

    // Hiển thị lại danh sách sản phẩm
    displayProducts();

    // Làm sạch form
    clearForm();

    // Đóng modal
    closeAddProductModal();
=======
>>>>>>> a7ea03020f1f2cfb4400be3b53447f22658753a8
}

// Hàm hiển thị danh sách sản phẩm ra bảng
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const productRow = document.createElement('tr');
        const productImage = product.UrlImage ? `<img src="${product.UrlImage}" width="50">` : 'No image';
        productRow.innerHTML = `
            <td>${productImage}</td>
            <td>${product.Code}</td>
            <td>${product.Name}</td>
            <td>${product.Price}</td>
            <td>${product.Status === 'active' ? 'Còn hàng' : 'Hết hàng'}</td>
            <td>${product.CreatedAt}</td>
            <td class="action-links">
                <a href="#" class="add-to-cart" onclick="addToCart(${index})">Thêm vào giỏ</a>
            </td>
        `;
        productList.appendChild(productRow);
    });
}

// Hàm gọi API thêm sản phẩm vào giỏ hàng
async function addProduct() {
    const formData = new FormData();
    formData.append("Name", document.getElementById("productName").value);
    formData.append("Price", parseFloat(document.getElementById("productPrice").value));
    formData.append("CategoryId", parseInt(document.getElementById("productCategory").value));
    formData.append("StockQuantity", parseInt(document.getElementById("productStock").value));
    formData.append("Description", document.getElementById("productDescription").value);
    formData.append("Status", document.getElementById("productStatus").value);

    // Kiểm tra và thêm hình ảnh nếu người dùng có chọn hình ảnh
    const productImage = document.getElementById("productImage").files[0];
    if (productImage) {
        formData.append("UrlImage", productImage);
    }

    try {
        const response = await fetch("http://localhost:5241/api/Product/product", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            alert("Thêm sản phẩm thành công!");
            closeAddProductModal();
            fetchProducts(); // Cập nhật danh sách sản phẩm sau khi thêm mới
        } else {
            const error = await response.json();
            alert("Lỗi: " + error.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Đã xảy ra lỗi khi thêm sản phẩm.");
    }
}
// Chuyển sang trang kế tiếp
function nextPage() {
    currentPage++;
    fetchProducts(currentPage);
}

// Quay lại trang trước
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchProducts(currentPage);
    }
}

// Gọi hàm fetchProducts khi tải trang để hiển thị danh sách sản phẩm
window.onload = () => fetchProducts(currentPage);

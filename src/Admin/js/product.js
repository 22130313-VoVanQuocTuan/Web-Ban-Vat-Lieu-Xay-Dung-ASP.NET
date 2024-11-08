const products = [];
    
// Hàm mở modal để thêm sản phẩm mới
function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'flex';
}

// Hàm đóng modal Thêm sản phẩm
function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

let editingProductIndex = null; // Biến lưu chỉ mục sản phẩm đang sửa

// Hàm thêm/sửa sản phẩm
function addProduct() {
    const code = document.getElementById('productCode').value;
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const stock = document.getElementById('productStock').value;
    const description = document.getElementById('productDescription').value;
    const status = document.getElementById('productStatus').value;
    const image = document.getElementById('productImage').files[0];

    const createdAt = new Date().toLocaleDateString(); // Ngày tạo sản phẩm

    const product = {
        code,
        name,
        price,
        category,
        stock,
        description,
        status,
        image,
        createdAt
    };
    if (editingProductIndex !== null) {
        // Nếu đang trong chế độ chỉnh sửa, cập nhật thông tin sản phẩm
        products[editingProductIndex] = product;
        editingProductIndex = null; // Đặt lại chỉ mục sau khi sửa xong
    } else {
        // Nếu không, thêm sản phẩm mới
        products.push(product);
    }


    // // Tạo đối tượng sản phẩm mới
    // products.push(product);

    // Hiển thị lại danh sách sản phẩm
    displayProducts();

    // Làm sạch form
    clearForm();

    // Đóng modal
    closeAddProductModal();
}

// Hàm hiển thị danh sách sản phẩm lên bảng
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    // Duyệt qua mảng sản phẩm và hiển thị vào bảng
    products.forEach((product, index) => {
        const productRow = document.createElement('tr');
        const productImage = product.image ? `<img src="${URL.createObjectURL(product.image)}" width="50">` : 'No image';
        productRow.innerHTML = `
            <td>${productImage}</td>
            <td>${product.code}</td>  <!-- Hiển thị mã sản phẩm -->
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.status === 'active' ? 'Còn hàng' : 'Hết hàng'}</td>  <!-- Hiển thị trạng thái -->
            <td>${product.createdAt}</td> <!-- Hiển thị ngày tạo -->
            <td class="action-links">
                <a href="#" class="detail" onclick="viewProductDescription(${index})">Mô tả</a>
                <a href="#" class="edit" onclick="editProduct(${index})">Sửa</a>
                <a href="#" class="delete" onclick="deleteProduct(${index})">Xóa</a>
            </td>
        `;
        productList.appendChild(productRow);
    });
}

// Hàm xem mô tả sản phẩm
function viewProductDescription(index) {
    const product = products[index];
    const description = `
        <p><strong>Mô tả:</strong> ${product.description}</p>
    `;
    document.getElementById('productDescriptionDetails').innerHTML = description;
    document.getElementById('viewDescriptionModal').style.display = 'flex';
}

// Hàm đóng modal mô tả sản phẩm
function closeViewDescriptionModal() {
    document.getElementById('viewDescriptionModal').style.display = 'none';
}

// Hàm chỉnh sửa sản phẩm
function editProduct(index) {
    const product = products[index];
    document.getElementById('productCode').value = product.code;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productStatus').value = product.status;
    editingProductIndex = index; // Ghi nhận chỉ mục sản phẩm đang sửa
    openAddProductModal();
}

// Hàm xóa sản phẩm
function deleteProduct(index) {
    products.splice(index, 1);
    displayProducts();
}

// Hàm làm sạch form nhập liệu
function clearForm() {
    document.getElementById('addProductForm').reset();
}
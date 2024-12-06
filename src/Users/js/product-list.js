// Cấu hình mặc định

import { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn đúng
let currentCategoryId = 0; // 0 nghĩa là lấy toàn bộ
let currentPage = 1;
const itemsPerPage = 9; // Số sản phẩm trên mỗi trang
let totalPages = 1; // Khai báo biến totalPages

// Lấy sản phẩm từ API
async function fetchProducts(page, categoryId = 0) {
    const apiUrl = categoryId === 0
        ? `http://localhost:5241/api/Product?page=${page}&size=${itemsPerPage}` // API lấy toàn bộ sản phẩm
        : `http://localhost:5241/api/Product/category/${categoryId}?page=${page}&size=${itemsPerPage}`; // API theo danh mục

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return {
            products: data.results.products || [], // Danh sách sản phẩm
            totalItems: data.results.totalCount || 0 // Tổng số mục
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Hiển thị sản phẩm
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Xóa sản phẩm cũ

    if (!products || products.length === 0) {
        productList.innerHTML = "<p>No products available</p>";
        return;
    }

    products.forEach(product => {
        const imageUrl = product.urlImage.startsWith('http') ? product.urlImage : `http://localhost:5241${product.urlImage}`;
        const productDiv = document.createElement("div");
        productDiv.classList.add("name-cart");
        productDiv.innerHTML = `
        <a href="#" onclick="redirectToProductDetail(${product.productId})">
            <img  src="${imageUrl}" class="product-image" alt="${product.name}" data-product-id="${product.productId}">
            </a>
            <h3>${product.name}</h3>
            <p>Giá: <del>${product.price.toLocaleString()} VNĐ</del></p>
            <p style="color: red;">Giá đã giảm: ${(product.price * (1 - product.discountPercentage)).toLocaleString()} VNĐ</p>
            <p>Giảm giá: ${Math.round(product.discountPercentage * 100)}%</p>
            <a href="" class="add-cart" data-product-id="${product.productId}">Thêm</a>
        `;
        productList.appendChild(productDiv);
    });
    attachImageClickEvents();
}

// Hàm điều hướng đến trang chi tiết sản phẩm
 function redirectToProductDetail(productId) {
    window.location.href = `http://127.0.0.1:5500/src/Users/pages/product-detail.html?productId=${productId}`;
}

// Thêm sự kiện click cho ảnh
 function attachImageClickEvents() {
    const productImages = document.querySelectorAll('.product-image');
    productImages.forEach(image => {
        image.addEventListener('click', (e) => {
            const productId = image.getAttribute('data-product-id');
            // Điều hướng đến trang chi tiết sản phẩm
            e.preventDefault();  // Ngăn không cho trang reload lại khi click
            redirectToProductDetail(productId);
        });
    });
}
/// Cập nhật thông tin phân trang
function updatePagination(totalItems) {
    if (totalItems === 0) {
        document.getElementById("page-info").innerText = "Không có sản phẩm";
        document.getElementById("prev").disabled = true;
        document.getElementById("next").disabled = true;
        return;
    }

    totalPages = Math.ceil(totalItems / itemsPerPage); // Tính tổng số trang lại mỗi khi cập nhật
    document.getElementById("page-info").innerText = `Trang ${currentPage} / ${totalPages}`;
    document.getElementById("prev").disabled = currentPage <= 1;
    document.getElementById("next").disabled = currentPage >= totalPages;
}

// Gọi API và hiển thị sản phẩm cho trang hiện tại
async function loadPage(page) {
    try {
        const { products, totalItems } = await fetchProducts(page, currentCategoryId);
        displayProducts(products);
        updatePagination(totalItems); // Cập nhật phân trang với tổng số sản phẩm
    } catch (error) {
        console.error("Error loading page:", error);
    }
}

// Điều khiển nút phân trang

document.getElementById("prev").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
    }
});

document.getElementById("next").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadPage(currentPage);
    }
});

// Lấy dữ liệu cho trang đầu tiên
async function loadProducts() {
    try {
        const { products, totalItems } = await fetchProducts(currentPage, currentCategoryId);
        displayProducts(products);
        updatePagination(totalItems); // Cập nhật phân trang sau khi tải sản phẩm
    } catch (error) {
        console.error('Error loading products:', error);
    }
}


// Sự kiện khi nhấn vào danh mục
  function attachCategoryClickHandlers() {
    const sidebarItems = document.querySelectorAll('.item');
    sidebarItems.forEach(sideItem => {
        sideItem.addEventListener('click', async () => {
            if (sideItem.classList.contains('active')) return;

            sidebarItems.forEach(item => item.classList.remove('active'));
            sideItem.classList.add('active');

            // Cập nhật danh mục hiện tại
            currentCategoryId = parseInt(sideItem.getAttribute('data-category-id')) || 0;
            currentPage = 1; // Reset về trang đầu
            await loadProducts(); // Gọi API mới
        });
    });
}

// Khởi tạo trang
(async function initializeProducts() {
    attachCategoryClickHandlers(); // Gắn sự kiện cho danh mục
    await loadProducts(); // Tải sản phẩm mặc định (toàn bộ sản phẩm)
})();


// Lấy userId từ token
function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Hết phiên làm việc, vui lòng đăng nhập lại!")
        window.location.href = "/src/Users/pages/account/login-signup.html"
    }

    // Gỉa mã JWT để lấy UserId từ token
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.UserId; // Đảm bảo tên thuộc tính đúng với cấu trúc của token
}

// Xử lý gọi API cho nút thêm sản phẩm
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('add-cart')) {
        event.preventDefault();

        const productId = parseInt(event.target.getAttribute('data-product-id'));
        const userId = getUserIdFromToken();

        try {
            const response = await customFetch('http://localhost:5241/api/Cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, userId })


            });

            if (response.ok) {
                window.location.href = '/src/Users/pages/cart.html';
            } else {
                window.location.href = "/src/Users/pages/account/login-signup.html"

            }
        } catch (error) {
            console.error('Lỗi: Không thêm được vào giỏ hàng.', error);
        }
    }
});

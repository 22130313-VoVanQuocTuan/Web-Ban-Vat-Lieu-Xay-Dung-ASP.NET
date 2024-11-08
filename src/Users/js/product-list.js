
import  { customFetch } from './apiService.js'; // Đảm bảo đường dẫn đúng
const sidebarItems = document.querySelectorAll('.conten .left-sidebar .item');
let currentProducts = [];
let currentCategoryId = 1; // ID danh mục mặc định để tải ban đầu
const itemsPerPage = 12; // Số lượng sản phẩm trên trang
let currentPage = 1; // Số trang hiện tại
let totalItems = 3; // Tổng số mục để phân trang

// Lấy sản phẩm theo danh mục từ API
async function fetchProductsByCategory(categoryId, page) {
    const response = await fetch(`http://localhost:5241/api/Product/category/${categoryId}?page=${page}&size=${itemsPerPage}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return {
        products: data.results || [], // Truy cập thuộc tính 'results'
        // Thay thế tổng số mục bằng độ dài của data.results
        totalItems: data.results.length || 0 // Giả sử tổng số mục là số lượng sản phẩm nhận được
    };
}
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear current content

    // Check if products array is empty
    if (!Array.isArray(products) || products.length === 0) {
        productList.innerHTML = "<p>No products available</p>"; // Handle empty product list
        return;
    }

    products.forEach(product => {
        const imageUrl = product.urlImage.startsWith('http') ? product.urlImage : `http://localhost:5241${product.urlImage}`;
        const productDiv = document.createElement("div");
        productDiv.classList.add("name-cart");
        productDiv.innerHTML = `
            <a href=""><img src="${imageUrl}" alt="${product.name}"></a>
            <h3>${product.name}</h3>
            <p>Giá: <del>${product.price.toLocaleString()} VNĐ</del></p>
            <p style="color: red;">Giá đã giảm: ${(product.price * (1 - product.discountPercentage)).toLocaleString()} VNĐ</p>
            <p>Giảm giá: ${Math.round(product.discountPercentage * 100)}%</p>
            <a href="" class="add-cart" data-product-id="${product.productId}">Thêm</a>
        `;
        productList.appendChild(productDiv);
    });
}

async function loadProducts() {
    try {
        const { products, totalItems: fetchedTotalItems } = await fetchProductsByCategory(currentCategoryId, currentPage);
        currentProducts = products; // Sản phẩm được lấy từ API
      
        displayProducts(currentProducts);
        updatePagination();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function updatePagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Tính số trang dựa trên totalItems hiện có
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const pageInfo = document.getElementById("page-info");

    // Cập nhật trạng thái của các nút
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages;

    // Cập nhật thông tin trang
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;

    // Thêm sự kiện cho nút Quay lại
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            loadProducts(); // Tải lại sản phẩm cho trang hiện tại
        }
    };
    
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadProducts(); // Tải lại sản phẩm cho trang hiện tại
        }
    };
}
// Xử lý sự kiện click cho từng mục 
sidebarItems.forEach(sideItem => {
    sideItem.addEventListener('click', async () => {
        if (sideItem.classList.contains('active')) {
            return; // Không làm gì nếu mục này đã hoạt động
        }

      // Xóa lớp 'active' khỏi tất cả các mục
        sidebarItems.forEach(item => item.classList.remove('active'));
        sideItem.classList.add('active');

       // Đặt ID danh mục hiện tại dựa trên mục được nhấp
        currentCategoryId = parseInt(sideItem.getAttribute('data-category-id')); // Đảm bảo thuộc tính này được đặt
        currentPage = 1; // Đặt lại về trang đầu tiên
        await loadProducts();// Tải sản phẩm cho danh mục đã chọn
    });
});

// Initialize by displaying products from the default category
(async function initializeProducts() {
    await loadProducts(); // Load products for the initial category ID
})();



// Lấy userId từ token
function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
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
                body: JSON.stringify({productId,userId})
                 
                
            });
            console.log('User ID:', getUserIdFromToken());
           
            if (response.ok) {
                   
                window.location.href = '/src/Users/pages/cart.html';
            } else {
                const error = await response.json();
                console.error(error)
                alert(`Error: ${error.message || 'Lỗi: Không thêm được vào giỏ hàng.'}`);
            }
        } catch (error) {
            console.error('Lỗi: Không thêm được vào giỏ hàng.', error);
        }
    }
});
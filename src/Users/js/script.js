
import { getUserIdFromToken, getUserName } from "./UserId.js";
import { customFetch } from "/src/apiService.js"; // Đảm bảo đường dẫn đúng

const userGreeting = document.getElementById("user-greeting");
const usernameDisplay = document.getElementById("username");
const loginLink = document.getElementById("login-link");
const signupLink = document.getElementById("signup-link");
const logoutLink = document.getElementById("logout-link");
const cartItemCount = document.getElementById("cart-count");

// Hiển thị thông tin người dùng nếu đã đăng nhập
const username = getUserName();
if (username) {
  if (userGreeting) userGreeting.style.display = "inline";
  if (usernameDisplay) usernameDisplay.textContent = username;
  if (loginLink) loginLink.style.display = "none";
  if (logoutLink) logoutLink.style.display = "inline";
  if (signupLink) signupLink.style.display = "inline";
  if (cartItemCount) cartItemCount.style.display = "inline";
} else {
  if (userGreeting) userGreeting.style.display = "none";
  if (logoutLink) logoutLink.style.display = "none";
  if (cartItemCount) cartItemCount.style.display = "none";
}

// Xử lý đăng xuất
if (logoutLink) {
  logoutLink.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/src/Users/pages/account/login-signup.html";
  });
}

// Hàm gọi API để lấy số lượng sản phẩm trong giỏ hàng
async function fetchCartItemCount() {
  const userId = getUserIdFromToken();
  try {
    const response = await customFetch(`http://localhost:5241/api/Cart/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 200) {
       cartItemCount.textContent = data.results.totalItem;
      } else {
        console.warn("Unexpected API response:", data);
      }
    } else {
      console.error("Failed to fetch cart item count:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching cart item count:", error.message);
  }
}

// Gọi API khi trang được tải

//Tìm kiếm sản phẩm
document.addEventListener("DOMContentLoaded", () => {
  fetchCartItemCount();
});
document.getElementById('searchButton').addEventListener('click', async () => {
  const keyword = document.getElementById('searchInput').value.trim();
  
  if (!keyword) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
  }

  try {
      const response = await fetch(`http://localhost:5241/api/Product/search?keyword=${encodeURIComponent(keyword)}`);

      if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu từ server');
      }

      const data = await response.json();

      const resultsDiv = document.getElementById('searchResults');
      resultsDiv.innerHTML = ''; // Xóa nội dung cũ

      if (data.response && data.response.length > 0) {
          // Nếu có sản phẩm, hiển thị kết quả
          data.response.forEach(product => {
            const imageUrl = product.urlImage.startsWith('http') ? product.urlImage : `http://localhost:5241${product.urlImage}`;
              const productDiv = document.createElement('div');
              productDiv.classList.add('product-item'); // Bạn có thể thêm class cho đẹp hơn

              productDiv.innerHTML = `
                <a href="#" onclick="redirectToProductDetail(${product.productId})">
              <img style="height: 50px; width: 50px;" src="${imageUrl}" class="product-image" alt="${product.name}" data-product-id="${product.productId}">
              </a>
                  <h3>${product.name}</h3>
                  <p>Giá: ${product.price.toLocaleString()} VNĐ</p>
                   <a href="" class="add-cart-search" data-product-id="${product.productId}">Thêm</a>
              `;
              resultsDiv.appendChild(productDiv);
          });
           attachImageClickEvents();
      } else {
          // Nếu không có sản phẩm nào
          resultsDiv.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
      }

      // Mở modal
      const modal = document.getElementById('searchModal');
      modal.style.display = 'block';

  } catch (error) {
      console.error('Error:', error);
      alert('Đã xảy ra lỗi khi tìm kiếm sản phẩm.');
  }
});

// Đóng modal khi nhấn vào dấu "×"
document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('searchModal');
    modal.style.display = 'none';
});

// Đóng modal nếu người dùng nhấn ra ngoài modal
window.addEventListener('click', (event) => {
    const modal = document.getElementById('searchModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
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
// Xử lý gọi API cho nút thêm sản phẩm
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('add-cart-search')) {
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


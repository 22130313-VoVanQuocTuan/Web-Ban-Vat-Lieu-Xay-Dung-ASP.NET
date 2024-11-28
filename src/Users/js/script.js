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
document.addEventListener("DOMContentLoaded", () => {
  fetchCartItemCount();
});

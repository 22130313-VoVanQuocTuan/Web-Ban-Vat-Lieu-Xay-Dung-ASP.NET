import { getUserIdFromToken } from "./UserId.js";

document.addEventListener('DOMContentLoaded', () => {
     getCart();
  });

  // LẤY THÔNG TIN GIỎ HÀNG
async function getCart() {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token không tồn tại. Vui lòng đăng nhập.");
        return;
      }
  
  
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("Không tìm thấy userId trong token.");
        return;
      }
  
      // Gọi API lấy dữ liệu giỏ hàng
      const apiUrl = `http://localhost:5241/api/Cart/${userId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`API trả về lỗi: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Kiểm tra dữ liệu trả về từ API
      if (data.status === 200) {
        const {totalItem, price, totalPrice, totalDiscount, shippingFee } = data.results;
        
        // Cập nhật giao diện
        document.getElementById("totalitems").innerText = `${totalItem}`;
        document.getElementById("price").innerText = `${price.toLocaleString()}₫`;
        document.getElementById("shipping-fee").innerText = `${shippingFee.toLocaleString()}₫`;
        document.getElementById("discount").innerText = `${totalDiscount.toLocaleString()}₫`;
        document.getElementById("totals").innerText = `${totalPrice.toLocaleString()}₫`;
      } else {
        console.error("Lỗi từ API: ", data.message);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu giỏ hàng: ", error.message);
    }
  }
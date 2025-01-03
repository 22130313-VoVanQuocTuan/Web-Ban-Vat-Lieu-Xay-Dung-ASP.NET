
import  { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn đúng


// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};



// Hàm gọi API để đăng xuất
async function logoutUser() {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  if (!token) {
    alert("Không tìm thấy token. Bạn cần đăng nhập lại.");
    return;
  }

  try {
      const response = await fetch('http://localhost:5241/api/Authenticate/logout-user', {
          method: 'DELETE', // Sử dụng phương thức DELETE cho logout
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token }) // Gửi token trong body dưới dạng đối tượng JSON
      });

      if (response.status === 200) { // Kiểm tra mã trạng thái HTTP
          // Xóa token khỏi localStorage sau khi đăng xuất
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = "/src/Users/pages/account/login-signup.html";
      } else {
          const error = await response.json();
          alert("Lỗi: " + error.message);
      }
  } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi khi đăng xuất.");
  }
}


// Lắng nghe sự kiện nhấn vào nút đăng xuất
document.querySelector('#logoutButton').addEventListener('click', logoutUser);
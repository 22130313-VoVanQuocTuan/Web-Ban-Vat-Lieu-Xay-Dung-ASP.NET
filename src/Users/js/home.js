import { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn đúng
// Slider image
const rightbtn = document.querySelector('.nut_phai');
const leftbtn = document.querySelector('.nut_trai');
const imgCount = document.querySelectorAll('.slide-show-content-image img');
let index = 0;
console.log(rightbtn);
console.log(leftbtn);

rightbtn.addEventListener("click", function () {
  index = index + 1;
  if (index > imgCount.length - 1) {
    index = 0; // Quay lại đầu
  }
  updateSlider();
});

leftbtn.addEventListener("click", function () {
  index = index - 1;
  if (index < 0) {
    index = imgCount.length - 1; // Quay lại cuối
  }
  updateSlider();
});

function updateSlider() {
  const offset = -index * 100; // Tính toán offset dựa trên index
  document.querySelector(".slide-show-content-image").style.transform = `translateX(${offset}%)`;
  console.log("Current Index:", index); // Kiểm tra giá trị index
}
// Làm silder image tự chạy.
function imgAuto() {
   index = index + 1
  if (index > imgCount.length - 1) {
    index = 0;
  }
  updateSlider();
  console.log(index);
}
setInterval(imgAuto,5000);

async function fetchDiscounts() {
  try {
      const response = await customFetch('http://localhost:5241/api/Discount', {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
          }
      });

      if (!response.ok) {
          throw new Error('Không thể tải dữ liệu.');
      }

      const responseData = await response.json(); // Parse dữ liệu JSON
      const discounts = responseData.response || []; // Lấy danh sách từ `response`

      const container = document.getElementById('discount-container');

      if (discounts.length === 0) {
          container.innerHTML = "<p>Hiện không có khuyến mãi nào!</p>";
          return;
      }

      // Xóa nội dung cũ nếu có
      container.innerHTML = "";

      // Duyệt qua danh sách và hiển thị khuyến mãi
      discounts.forEach(discount => {
          const div = document.createElement('div');
          div.classList.add('discount-item');
          div.innerHTML = `
              <p><strong >Mã giảm giá:</strong> ${discount.code}</p>
              <p><strong>Giảm giá:</strong> ${discount.percent.toLocaleString()}đ</p>
          `;
          container.appendChild(div);
      });
  } catch (error) {
      console.error("Lỗi:", error);
      document.getElementById('discount-container').innerHTML =
          "<p>Có lỗi xảy ra khi tải khuyến mãi, vui lòng thử lại sau.</p>";
  }
}

// Gọi hàm khi trang được tải
fetchDiscounts();



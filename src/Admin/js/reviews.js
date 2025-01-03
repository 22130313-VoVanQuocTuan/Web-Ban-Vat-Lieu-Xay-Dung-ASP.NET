import { customFetch } from '/src/apiService.js'; 

// Mảng chứa dữ liệu đánh giá mẫu
const reviews = [];

// Hàm lấy danh sách đánh giá
async function fetchReviews() {
  try {
    const response = await customFetch(`http://localhost:5241/api/Review`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      reviews.length = 0; // Xóa mảng cũ
      reviews.push(...data.response); // Thêm dữ liệu mới
      displayReviews(); // Hiển thị danh sách đánh giá
    } else {
      console.error("Error fetching reviews:", response.statusText);
      alert("Không thể tải danh sách đánh giá.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Đã xảy ra lỗi khi tải danh sách đánh giá.");
  }
}

// Hàm hiển thị danh sách đánh giá
function displayReviews() {
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = ""; // Xóa dữ liệu cũ

  // Lặp qua danh sách đánh giá và thêm vào bảng
  reviews.forEach((review) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${review.productId}</td>
      <td>${review.comment}</td>
      <td>${new Date(review.createdAt).toLocaleDateString("vi-VN")}</td>
      <td class="bt">
        <button class="delete-review-btn" data-review-id="${review.reviewId}">Xóa</button>
      </td>
    `;
    reviewList.appendChild(row);
  });

  attachEventListeners();
}

// Gán sự kiện cho nút xóa
function attachEventListeners() {
  document.querySelectorAll(".delete-review-btn").forEach((button) => {
    button.addEventListener("click", deleteReview);
  });
}

// Hàm xóa đánh giá
async function deleteReview(event) {
  const reviewId = event.target.getAttribute("data-review-id");
  try {
    const response = await customFetch(`http://localhost:5241/api/Review/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Xóa đánh giá thành công!");
      fetchReviews(); // Cập nhật danh sách đánh giá
    } else {
      console.error("Error deleting review:", response.statusText);
      alert("Không thể xóa đánh giá.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Đã xảy ra lỗi khi xóa đánh giá.");
  }
}

// Gọi hàm để lấy danh sách đánh giá khi tải trang
fetchReviews();
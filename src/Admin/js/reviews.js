// Mảng chứa dữ liệu đánh giá mẫu
const reviews = [];
let currentReview = 1;
const pageSize = 10;

import { customFetch } from "/src/apiService.js"; // Đảm bảo đường dẫn chính xác

// Hàm lấy danh sách sản phẩm với phân trang
async function fetchReviews(page = 1) {
  try {
    const response = await fetch(
      `http://localhost:5241/api/Review?page=${page}&size=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      reviews.length = 0; // Xóa dữ liệu cũ
      reviews.push(...data.results.reviews); // Thêm dữ liệu mới
      displayReviews(); // Hiển thị danh sách sản phẩm
    } else {
      console.error("Error: ", response.statusText);
      alert("Failed to fetch reviews.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching reviews.");
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
        <td>${review.name}</td>
        <td>${review.content}</td>
        <td>${review.date}</td>
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
    const response = await customFetch(
      "http://localhost:5241/api/Review/${reviewId}",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      fetchReviews(currentReview);
    } else {
      console.error("Error deleting review:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

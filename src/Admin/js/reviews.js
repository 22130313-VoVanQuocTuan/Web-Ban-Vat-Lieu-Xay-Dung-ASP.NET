// Mảng chứa dữ liệu đánh giá mẫu
const reviews = [
  {
    name: "Nguyễn Văn A",
    content: "Sản phẩm rất tốt, tôi rất hài lòng!",
    date: "2024-11-01",
  },
  {
    name: "Trần Thị B",
    content: "Giá cả hợp lý, giao hàng nhanh chóng.",
    date: "2024-11-10",
  },
  {
    name: "Phạm Văn C",
    content: "Sản phẩm không giống như mô tả, cần cải thiện.",
    date: "2024-11-15",
  },
  {
    name: "Lê Thị D",
    content: "Chất lượng sản phẩm ổn, dịch vụ khách hàng rất nhiệt tình.",
    date: "2024-11-18",
  },
  {
    name: "Võ Văn E",
    content: "Rất thất vọng vì giao hàng chậm hơn dự kiến.",
    date: "2024-11-20",
  },
];

// Lấy các phần tử DOM cần thiết
const reviewsTableBody = document.querySelector("table tbody");
const deleteModal = document.getElementById("delete-confirmation");
const confirmBtn = deleteModal.querySelector(".confirm-btn");
const cancelBtn = deleteModal.querySelector(".cancel-btn");

// Biến tạm để lưu index của đánh giá cần xóa
let reviewToDeleteIndex = null;

// Hàm hiển thị danh sách đánh giá
function renderReviews() {
  // Xóa sạch nội dung cũ trong bảng
  reviewsTableBody.innerHTML = "";

  // Lặp qua danh sách đánh giá và thêm vào bảng
  reviews.forEach((review, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${review.name}</td>
        <td>${review.content}</td>
        <td>${review.date}</td>
        <td>
          <button class="delete-btn" data-index="${index}">Xóa</button>
        </td>
      `;
    reviewsTableBody.appendChild(row);
  });

  // Gán sự kiện xóa cho các nút "Xóa"
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      openDeleteModal(index);
    });
  });
}

// Hàm mở modal xác nhận xóa
function openDeleteModal(index) {
  reviewToDeleteIndex = index; // Lưu index của đánh giá cần xóa
  deleteModal.style.display = "block"; // Hiển thị modal
}

// Hàm đóng modal xác nhận xóa
function closeDeleteModal() {
  deleteModal.style.display = "none"; // Ẩn modal
  reviewToDeleteIndex = null; // Xóa dữ liệu tạm
}

// Hàm xử lý xóa đánh giá
function deleteReview() {
  if (reviewToDeleteIndex !== null) {
    reviews.splice(reviewToDeleteIndex, 1); // Xóa đánh giá khỏi danh sách
    renderReviews(); // Cập nhật lại bảng
    closeDeleteModal(); // Đóng modal
  }
}

// Gán sự kiện cho các nút trong modal
confirmBtn.addEventListener("click", deleteReview); // Đồng ý xóa
cancelBtn.addEventListener("click", closeDeleteModal); // Thoát modal

// Hiển thị danh sách đánh giá ban đầu
renderReviews();

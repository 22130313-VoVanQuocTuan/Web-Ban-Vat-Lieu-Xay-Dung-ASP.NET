import { customFetch } from "/src/apiService.js";

// Hàm gọi API và hiển thị danh sách khuyến mãi
async function loadPromotions() {
  try {
    // Gọi API để lấy danh sách khuyến mãi
    const response = await fetch("http://localhost:5241/api/Promotional", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Kiểm tra trạng thái phản hồi
    if (data.status !== 200) {
      console.error("Error fetching promotions:", data.message);
      return;
    }

    // Lấy danh sách sản phẩm từ phản hồi
    const promotions = data.message;

    // Hiển thị danh sách sản phẩm trong bảng
    const productListElement = document.getElementById("productList");
    productListElement.innerHTML = ""; // Xóa nội dung cũ

    promotions.forEach((promotion) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${promotion.productId}</td>
                <td>${promotion.discountPercentage * 100}%</td>
                <td>${promotion.productName}</td>
                <td>${promotion.startDate}</td>
                <td>${promotion.endDate}</td>
                <td class="bt">
                    <button class="update-product-button" data-product-id="${
                      promotion.saleId
                    }">Cập nhật</button>
                    <button class="delete-product-button" data-product-id="${
                      promotion.productId
                    }">Xóa</button>
                </td>
            `;

      productListElement.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading promotions:", error);
  }
  // Hiển thị Modal cập nhật sản phẩm
  document.querySelectorAll(".update-product-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const saleId = e.target.getAttribute("data-product-id");

      // Lưu saleId hiện tại vào biến hoặc data attribute để sử dụng khi gửi yêu cầu
      document
        .getElementById("updateProductForm")
        .setAttribute("data-sale-id", saleId);

      // Hiển thị modal
      document.getElementById("updateProductModal").style.display = "block";
    });
  });
  // Đóng Modal
  window.closeUpdatePromotionalModal = closeUpdatePromotionalModal;
  function closeUpdatePromotionalModal() {
    document.getElementById("updateProductModal").style.display = "none";
  }
}

// Gọi hàm loadPromotions khi trang tải
loadPromotions();

// Mở modal thêm sản phẩm
document.getElementById("add-pro").onclick = function () {
  document.getElementById("addPromotionModal").style.display = "block";
};
//Đóng model
document.getElementById("close-modal").onclick = function () {
  document.getElementById("addPromotionModal").style.display = "none";
};

// Lưu sản phẩm mới
document
  .getElementById("saveNewPromotion")
  .addEventListener("click", saveNewPromotion);
async function saveNewPromotion() {
  const productId = document.getElementById("addProductId").value;
  const discount = document.getElementById("addDiscount").value;
  const startDate = document.getElementById("addStartDate").value;
  const endDate = document.getElementById("addEndDate").value;

  const newPromotion = {
    productId,
    discountPercentage: discount,
    startDate,
    endDate,
  };

  try {
    const response = await customFetch(
      "http://localhost:5241/api/Promotional",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPromotion),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
      alert("Thêm sản phẩm không thành công: " + data.message);
      return;
    }

    alert("Thêm sản phẩm thành công!");
    document.getElementById("addPromotionModal").style.display = "none"; // Đóng modal
    loadPromotions();
  } catch (error) {
    console.error("Error adding product:", error);
  }
}

document
  .getElementById("saveChangesButton")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const saleId = document
      .getElementById("updateProductForm")
      .getAttribute("data-sale-id");

    const discountPercentage = document.getElementById(
      "updateDiscountPercentage"
    ).value;
    const startDate = document.getElementById("updateStarDate").value;
    const endDate = document.getElementById("updateEndDate").value;

    const requestData = {
      discountPercentage: parseFloat(discountPercentage) / 100, // Lưu dưới dạng số thập phân
      startDate: startDate,
      endDate: endDate,
    };

    try {
      const response = await customFetch(
        `http://localhost:5241/api/Promotional/${saleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Cập nhật thành công!");
        closeUpdatePromotionalModal();
        loadPromotions();
        // Tải lại danh sách khuyến mãi nếu cần
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      alert("Không thể cập nhật khuyến mãi!");
    }
  });

// Đóng modal khi click ra ngoài
window.onclick = function (event) {
  const addModal = document.getElementById("addPromotionModal");
  const updateModal = document.getElementById("updatePromotionModal");

  if (event.target === addModal) {
    document.getElementById("addPromotionModal").style.display = "none";
  }

  if (event.target === updateModal) {
    document.getElementById("updatePromotionModal").style.display = "none";
  }
};

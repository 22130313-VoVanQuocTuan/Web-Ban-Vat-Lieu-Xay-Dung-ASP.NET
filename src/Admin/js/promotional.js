import { customFetch } from "/src/apiService.js"; // Đảm bảo đường dẫn chính xác

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
    const productListElement = document.getElementById("promotionalList");
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
                    promotion.productId
                  }">Cập nhật</button>
                  <button class="delete-product-button" data-product-id="${
                    promotion.productId
                  }">Xóa</button>
              </td>
          `;

      productListElement.appendChild(row);
    });

    // Gắn sự kiện cho các nút "Xóa" và "Cập nhật"
    document.querySelectorAll(".delete-product-button").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-product-id"); // Lấy ID sản phẩm
        deleteProduct(productId); // Gọi hàm xóa
      });
    });

    document.querySelectorAll(".update-product-button").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-product-id"); // Lấy ID sản phẩm
        updateProduct(productId); // Gọi hàm cập nhật
      });
    });
  } catch (error) {
    console.error("Error loading promotions:", error);
  }
}

window.addProduct = addProduct;
window.openAddPromotionalModal = openAddPromotionalModal;
window.closeAddPromotionalModal = closeAddPromotionalModal;
window.closeUpdatePromotionalModal = closeUpdatePromotionalModal;

function openAddPromotionalModal() {
  document.getElementById("addPromotionalModal").style.display = "block";
}

function closeAddPromotionalModal() {
  document.getElementById("addPromotionalModal").style.display = "none";
}

function closeUpdatePromotionalModal() {
  document.getElementById("updatePromotionalModal").style.display = "none";
}

// Gắn sự kiện cho nút "Thêm sản phẩm"
document
  .getElementById("addPromotionalButton")
  .addEventListener("click", addProduct);

// Hàm thêm sản phẩm
async function addProduct() {
  const promotionalId = document.getElementById("promotionalId").value;
  const discountPercentage =
    document.getElementById("discountPercentage").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const newPromotion = {
    productId: promotionalId,
    discountPercentage: discountPercentage,
    startDate: startDate,
    endDate: endDate,
  };

  try {
    const response = await customFetch(
      `http://localhost:5241/api/Promotional`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPromotion),
      }
    );

    if (response.ok) {
      closeAddPromotionalModal();
      loadPromotions();
    } else {
      const data = await response.json();
      alert("Thêm sản phẩm không thành công: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Hàm xóa sản phẩm
async function deleteProduct(productId) {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    return;
  }

  try {
    const response = await customFetch(
      `http://localhost:5241/api/Promotions/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
      alert("Xóa không thành công: " + data.message);
      return;
    }

    alert("Xóa thành công!");
    loadPromotions(); // Làm mới danh sách khuyến mãi
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

// Hàm cập nhật sản phẩm
function updateProduct(productId) {}

// Gọi hàm loadPromotions khi trang tải
loadPromotions();

import { customFetch } from "/src/apiService.js";

// Hàm tải danh sách khuyến mãi
async function loadPromotions() {
  try {
    const response = await customFetch("http://localhost:5241/api/Promotional", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
      console.error("Error fetching promotions:", data.message);
      return;
    }

    const promotions = data.message;
    const productListElement = document.getElementById("productList");
    productListElement.innerHTML = "";

    promotions.forEach((promotion) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${promotion.productId}</td>
        <td>${(promotion.discountPercentage * 100).toFixed(2)}%</td>
        <td>${promotion.productName}</td>
        <td>${promotion.startDate}</td>
        <td>${promotion.endDate}</td>
        <td class="bt">
          <button class="update-product-button" data-sale-id="${promotion.saleId}">Cập nhật</button>
          <button class="delete-product-button" data-product-id="${promotion.productId}">Xóa</button>
        </td>
      `;
      productListElement.appendChild(row);
    });

    // Gắn sự kiện cho các nút Cập nhật và Xóa
    document.querySelectorAll(".update-product-button").forEach((button) => {
      button.addEventListener("click", showUpdateProductModal);
    });

    document.querySelectorAll(".delete-product-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-product-id");
        showDeleteConfirmationDialog(productId);
      });
    });
  } catch (error) {
    console.error("Error loading promotions:", error);
  }
}

// Mở modal thêm sản phẩm
const openAddProductModal = () => {
  document.getElementById("addPromotionModal").style.display = "block";
};

// Đóng modal thêm sản phẩm
const closeAddProductModal = () => {
  document.getElementById("addPromotionModal").style.display = "none";
};

// Hiển thị modal cập nhật sản phẩm
const showUpdateProductModal = (e) => {
  const saleId = e.target.getAttribute("data-sale-id");
  const form = document.getElementById("updateProductForm");
  form.setAttribute("data-sale-id", saleId);
  document.getElementById("updateProductModal").style.display = "block";
};

// Đóng modal cập nhật sản phẩm
const closeUpdatePromotionalModal = () => {
  document.getElementById("updateProductModal").style.display = "none";
};

// Thêm mới khuyến mãi
const saveNewPromotion = async () => {
  const productId = document.getElementById("addProductId").value;
  const discount = parseFloat(document.getElementById("addDiscount").value) / 100;
  const startDate = document.getElementById("addStartDate").value;
  const endDate = document.getElementById("addEndDate").value;

  const newPromotion = {
    productId,
    discountPercentage: discount,
    startDate,
    endDate,
  };

  try {
    const response = await customFetch("http://localhost:5241/api/Promotional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPromotion),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
      alert("Thêm sản phẩm không thành công: " + data.message);
      return;
    }

    showToast("Thêm sản phẩm thành công!");
    closeAddProductModal();
    loadPromotions();
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

// Xóa sản phẩm
const deleteProduct = async (productId) => {
  try {
    const response = await customFetch(`http://localhost:5241/api/Promotional/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
      console.error("Xóa không thành công: " + data.message);
      return;
    }

    showToast("Xóa thành công!");
    loadPromotions();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

// Hiển thị hộp thoại xác nhận xóa
const showDeleteConfirmationDialog = (productId) => {
  const dialog = document.getElementById("confirmDeleteDialog");
  const confirmBtn = document.getElementById("confirmDeleteYes");
  const cancelBtn = document.getElementById("confirmDeleteNo");

  dialog.showModal();

  confirmBtn.onclick = () => {
    deleteProduct(productId);
    dialog.close();
  };

  cancelBtn.onclick = () => {
    dialog.close();
  };
};

// Cập nhật khuyến mãi
const saveChanges = async () => {
  const saleId = document.getElementById("updateProductForm").getAttribute("data-sale-id");
  const discountPercentage = parseFloat(document.getElementById("updateDiscountPercentage").value) / 100;
  const startDate = document.getElementById("updateStartDate").value;
  const endDate = document.getElementById("updateEndDate").value;

  const requestData = {
    discountPercentage,
    startDate,
    endDate,
  };

  try {
    const response = await customFetch(`http://localhost:5241/api/Promotional/${saleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (response.ok) {
      showToast("Cập nhật thành công!");
      closeUpdatePromotionalModal();
      loadPromotions();
    } else {
      showToast(`Lỗi: ${result.message}`);
    }
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
    alert("Không thể cập nhật khuyến mãi!");
  }
};

// Hiển thị thông báo
const showToast = (message) => {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
};

// Gắn sự kiện cho các nút trên modal
window.onclick = (event) => {
  if (event.target === document.getElementById("addPromotionModal")) {
    closeAddProductModal();
  }

  if (event.target === document.getElementById("updateProductModal")) {
    closeUpdatePromotionalModal();
  }
};

// Gắn sự kiện khi tải trang
document.getElementById("add-pro").onclick = openAddProductModal;
document.getElementById("close-modal").onclick = closeAddProductModal;
document.getElementById("close-modals").onclick = closeUpdatePromotionalModal;
document.getElementById("exit").onclick = closeUpdatePromotionalModal;
document.getElementById("saveNewPromotion").onclick = saveNewPromotion;
document.getElementById("saveChangesButton").onclick = saveChanges;


// Tải danh sách khuyến mãi khi trang tải
loadPromotions();

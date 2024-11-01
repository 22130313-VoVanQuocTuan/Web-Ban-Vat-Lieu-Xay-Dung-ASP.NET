let cart = []; // Khởi tạo biến cart
let selectedProducts = new Set(); // Khởi tạo biến selectedProducts
let originalTotal = 0; // Khởi tạo biến tổng ban đầu

<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
  fetchCartProducts();
});
=======
// Hàm cập nhật tổng giỏ hàng
function updateCart() {
  const cartContainer = document.getElementById("cart-items-container");
  cartContainer.innerHTML = ""; // Xóa nội dung cũ
>>>>>>> 4791a4f65f4469c3a21b155d0b2d2f9f9fab4b96

async function fetchCartProducts(page = 1, limit = 2) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5241/api/Cart?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

<<<<<<< HEAD
    const data = await response.json();
    renderCartProducts(data.results);
  } catch (error) {
    console.error('Có lỗi xảy ra khi lấy dữ liệu giỏ hàng:', error);
  }
=======
    // Tạo phần tử HTML cho từng sản phẩm dưới dạng hàng bảng
    const cartRow = document.createElement("tr");
    cartRow.innerHTML = `
      <td><input type="checkbox" class="select-product" onchange="toggleProductSelection(${index})" ${
      selectedProducts.has(index) ? "checked" : ""
    }></td>
      <td>${item.name}</td>
      <td><img src="image-placeholder.png" alt="Product Image" class="product-img"></td>
      <td>
        <div class="quantity">
          <button class="qty-btn minus-btn" onclick="changeQuantity(${index}, -1)">-</button>
          <input type="text" value="${
            item.quantity
          }" class="qty-input" min="1" onchange="updateQuantity(${index}, this.value)">
          <button class="qty-btn plus-btn" onclick="changeQuantity(${index}, 1)">+</button>
        </div>
      </td>
      <td>${formatCurrency(item.price)}</td>
      <td class="product-subtotal">${formatCurrency(itemTotal)}</td>
    `;

    cartContainer.appendChild(cartRow);
  });

  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat - subtotal * discountRate;

  // Cập nhật hiển thị tổng
  document.getElementById("subtotal").innerText = formatCurrency(subtotal);
  document.getElementById("vat").innerText = formatCurrency(vat);
  document.getElementById("total").innerText = formatCurrency(total);
>>>>>>> 4791a4f65f4469c3a21b155d0b2d2f9f9fab4b96
}

function renderCartProducts(products) {
  cart = products; // Cập nhật dữ liệu giỏ hàng
  const cartContainer = document.getElementById('cart-items-container');
  cartContainer.innerHTML = '';
  let subtotal = 0; // Khởi tạo tạm tính

  products.forEach((product, index) => {
    let imageUrl = product.urlImage.startsWith('http') ? product.urlImage : `http://localhost:5241/${product.urlImage}`;

    // Cộng giá trị từng sản phẩm vào subtotal
    subtotal += product.price * product.quantity;

    const productHtml = `
      <tr>
        <td>${product.name}</td>
        <td><img src="${imageUrl}" alt="${product.name}"></td>
        <td>
          <div class="quantity">
            <button class="qty-btn minus-btn" onclick="changeQuantity(${index}, -1)">-</button>
            <input 
              type="number" 
              value="${product.quantity}" 
              class="qty-input" 
              min="1" 
              onchange="updateQuantity(${index}, this.value)" />
            <button class="qty-btn plus-btn" onclick="changeQuantity(${index}, 1)">+</button>
          </div>
        </td>
        <td>${(product.price * product.quantity).toLocaleString()} VNĐ</td>
        <td><button class="remove-from-cart-button" data-product-id="${product.cartProductId}">Xóa</button></td>
      </tr>`;
      
    cartContainer.insertAdjacentHTML('beforeend', productHtml);
  });

  // Tính VAT và tổng cộng
  const vat = subtotal * 0.08;
  const total = subtotal + vat;

  // Lưu tổng giá trị ban đầu
  originalTotal = total;

  // Hiển thị các giá trị trên giao diện
  document.getElementById('subtotal').textContent = `${subtotal.toLocaleString()} VNĐ`;
  document.getElementById('vat').textContent = `${vat.toLocaleString()} VNĐ`;
  document.getElementById('total').textContent = `${total.toLocaleString()} VNĐ`;

  attachRemoveFromCartEvent();
}

function attachRemoveFromCartEvent() {
  const removeButtons = document.querySelectorAll('.remove-from-cart-button');
  removeButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const cartProductId = event.target.getAttribute('data-product-id');
      console.log('Xóa sản phẩm với ID:', cartProductId);
      try {
        const response = await fetch(`http://localhost:5241/api/Cart/${cartProductId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Cập nhật giỏ hàng sau khi xóa sản phẩm
          await fetchCartProducts(); // Lấy lại dữ liệu giỏ hàng
        } else {
          console.error('Có lỗi khi xóa sản phẩm:', response.statusText);
        }
      } catch (error) {
        console.error('Có lỗi xảy ra khi gọi API xóa sản phẩm:', error);
      }
    });
  });
}

// Thay đổi số lượng sản phẩm
function changeQuantity(index, amount) {
  if (cart[index].quantity + amount >= 1) {
    cart[index].quantity += amount;
    renderCartProducts(cart); // Cập nhật lại giao diện
  }
}

 function updateQuantity(index, newValue) {
  const quantity = parseInt(newValue, 10);
  if (quantity >= 1) {
    cart[index].quantity = quantity;
    renderCartProducts(cart); // Cập nhật lại giao diện
  }
}

// ÁP MÃ GIẢM GIÁ
  async function applyVoucher() {
  const voucherCode = document.getElementById('voucher').value.trim();

  if (!voucherCode) {
    alert('Vui lòng nhập mã ưu đãi.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5241/api/Discount/${voucherCode}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      alert('Mã ưu đãi không hợp lệ hoặc có lỗi xảy ra.');
      return;
    }

    const data = await response.json();

    if (data.status === 200 && data.response) {
      const discountAmount = data.response.percent; // Giả định API trả về số tiền giảm giá
      applyDiscount(discountAmount);
    } else {
      alert('Mã ưu đãi không hợp lệ.');
    }
  } catch (error) {
    console.error('Có lỗi xảy ra khi kiểm tra mã ưu đãi:', error);
  }
}

// Áp dụng giảm giá và cập nhật tổng giá trị
 function applyDiscount(discountAmount) {
  const discountedTotal = Math.max(0, originalTotal - discountAmount); // Đảm bảo tổng không âm

  updateTotalDisplay(discountedTotal); // Cập nhật hiển thị tổng mới

  alert(`Áp dụng mã giảm giá thành công! Bạn đã được giảm ${discountAmount.toLocaleString()} VNĐ.`);
}

// Cập nhật tổng giá trị hiển thị
 function updateTotalDisplay(total) {
  document.getElementById('total').textContent = `${total.toLocaleString()} VNĐ`;
}

// Hàm để chọn hoặc bỏ chọn sản phẩm
function toggleProductSelection(index) {
  if (selectedProducts.has(index)) {
    selectedProducts.delete(index);
  } else {
    selectedProducts.add(index);
  }
}

<<<<<<< HEAD
// Nhập hàm customFetch nếu cần
//import { customFetch } from './apiService.js';
=======
// Áp dụng mã giảm giá
function applyVoucher() {
  const voucherInput = document.getElementById("voucher").value;
  if (voucherInput === "DISCOUNT10") {
    discountRate = 0.1;
    alert("Mã giảm giá 10% đã được áp dụng!");
  } else {
    discountRate = 0;
    alert("Mã giảm giá không hợp lệ!");
  }
  updateCart();
}

// Định dạng tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Hàm xóa sản phẩm đã chọn khỏi giỏ hàng
function removeSelectedProducts() {
  // Lọc lại các sản phẩm không nằm trong selectedProducts
  cart = cart.filter((_, index) => !selectedProducts.has(index));
  selectedProducts.clear(); // Xóa danh sách sản phẩm được chọn
  updateCart(); // Cập nhật lại giỏ hàng
}

// Khởi tạo giỏ hàng mẫu
addToCart({ name: "Gạch Ốp Lát Eurotile An Cư", price: 398700, quantity: 1 });
addToCart({ name: "Sơn Tường Jotun", price: 250000, quantity: 1 });
addToCart({ name: "Vật Liệu Chống Thấm Sika", price: 120000, quantity: 1 });
addToCart({ name: "Xi Măng Hà Tiên", price: 95000, quantity: 1 });
addToCart({ name: "Cát Xây Dựng", price: 80000, quantity: 1 });
addToCart({ name: "Sắt Thép Xây Dựng", price: 350000, quantity: 1 });
addToCart({ name: "Gạch Ốp Lát Viglacera", price: 450000, quantity: 1 });
addToCart({ name: "Sơn Nước Dulux", price: 300000, quantity: 1 });
addToCart({ name: "Vật Liệu Chống Thấm Sika", price: 120000, quantity: 1 });
addToCart({ name: "Xi Măng Hà Tiên", price: 95000, quantity: 1 });
>>>>>>> 4791a4f65f4469c3a21b155d0b2d2f9f9fab4b96

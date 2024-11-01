let cart = []; // Khởi tạo biến cart
let selectedProducts = new Set(); // Khởi tạo biến selectedProducts
let originalTotal = 0; // Khởi tạo biến tổng ban đầu

document.addEventListener('DOMContentLoaded', () => {
  fetchCartProducts();
});

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

    const data = await response.json();
    renderCartProducts(data.results);
  } catch (error) {
    console.error('Có lỗi xảy ra khi lấy dữ liệu giỏ hàng:', error);
  }
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

// Nhập hàm customFetch nếu cần
//import { customFetch } from './apiService.js';

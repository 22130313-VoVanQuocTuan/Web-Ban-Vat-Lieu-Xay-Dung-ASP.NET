
let cart = []; // Khởi tạo biến cart



import  { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn đúng

document.addEventListener('DOMContentLoaded', () => {
  fetchCartProducts();
});

// Hàm lấy sản phẩm từ giỏ hàng
async function fetchCartProducts(page = 1, limit = 2) {
  try {
    const token = localStorage.getItem('token');
    const response = await customFetch(`http://localhost:5241/api/Cart?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' } // Thêm header cho Content-Type
      
    });
      
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
    renderCartProducts(data.results);
  } catch (error) {
    console.error('Có lỗi xảy ra khi lấy dữ liệu giỏ hàng:', error);
  }
}


// Hàm hiển thị sản phẩm trong giỏ hàng
 function renderCartProducts(products) {
  cart = products; // Cập nhật dữ liệu giỏ hàng
  const cartContainer = document.getElementById('cart-items-container');
  cartContainer.innerHTML = ''; // Xóa nội dung cũ

  const subtotal = products.priceTotal; // Lấy tổng tiền từ response

  products.forEach((product, index) => {
    const imageUrl = product.urlImage.startsWith('http') ? product.urlImage : `http://localhost:5241/${product.urlImage}`;
    

    // HTML cho sản phẩm
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
        <td>${product.price.toLocaleString()} VNĐ</td> <!-- Giá sau giảm -->
        <td>${product.totalPrice.toLocaleString()} VNĐ</td> <!-- Tổng sau giảm -->
        <td><button class="remove-from-cart-button" data-product-id="${product.cartProductId}">Xóa</button></td>
      </tr>`;
   
      fetchAndDisplaySubtotal(product.cartId);
    cartContainer.insertAdjacentHTML('beforeend', productHtml);

     

     
  });



  


  attachRemoveFromCartEvent(); // xóa sản phẩm
  

}
// Hàm gọi API và hiển thị tổng giá trị
function fetchAndDisplaySubtotal(cartId) {
  // URL API với cartId
  const apiUrl = `http://localhost:5241/api/Cart/${cartId}`;

  // Gọi API
  customFetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Chuyển đổi response thành JSON
    })
    .then(data => {
      const subtotal = data.results; // Lấy tổng giá từ API (đảm bảo backend trả về đúng thuộc tính này)
      document.getElementById('subtotal').textContent = `${subtotal.toLocaleString()} VNĐ`; // Gán chuỗi hiển thị    .catch(error => {
      console.error('Có lỗi khi gọi API:', error); // Log lỗi nếu có
    });
}

// Hàm gán sự kiện xóa sản phẩm khỏi giỏ hàng
function attachRemoveFromCartEvent() {
  const removeButtons = document.querySelectorAll('.remove-from-cart-button');
  removeButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const cartProductId = event.target.getAttribute('data-product-id');
      console.log('Xóa sản phẩm với ID:', cartProductId);
      try {
        const response = await customFetch(`http://localhost:5241/api/Cart/${cartProductId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
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

// Hàm thay đổi số lượng sản phẩm

 async  function  changeQuantity(index, amount) { 
  if (cart[index].quantity + amount >= 1) {
    cart[index].quantity += amount;
    await updateCartQuantity(cart[index].cartProductId, cart[index].quantity); // Gọi API cập nhật số lượng
    renderCartProducts(cart); // Cập nhật lại giao diện
  }
}

// Hàm cập nhật số lượng sản phẩme
 async function updateQuantity(index, newValue) {
  const quantity = parseInt(newValue, 10);
  if (quantity >= 1) {
    cart[index].quantity = quantity;
    await updateCartQuantity(cart[index].cartProductId, cart[index].quantity); // Gọi API cập nhật số lượng
    renderCartProducts(cart); // Cập nhật lại giao diện
  }
}

// thêm để cóthể chạy được các hàm khác scop
window.changeQuantity = changeQuantity;
window.updateQuantity = updateQuantity;

// Hàm gọi API để cập nhật số lượng trong giỏ hàng
async function updateCartQuantity(cartProductId, quantity) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5241/api/Cart`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartProductId: cartProductId,
        quantity: quantity
      }),
    });

    if (!response.ok) {
      throw new Error('Có lỗi xảy ra khi cập nhật số lượng.');
    }
    await fetchCartProducts(); // Lấy lại dữ liệu giỏ hàng

    const data = await response.json();
    console.log('Cập nhật số lượng thành công:', data);
  } catch (error) {
    console.error('Có lỗi xảy ra khi gọi API cập nhật số lượng:', error);
  }
}


// Gán sự kiện cho nút áp dụng mã voucher
document.querySelector('.apply-btn').addEventListener('click', applyVoucher);

// Hàm áp dụng mã giảm giá
async function applyVoucher() {
  const voucherCode = document.getElementById('voucher').value.trim(); // Lấy mã voucher từ input

  if (!voucherCode) {
      alert('Vui lòng nhập mã ưu đãi.'); // Kiểm tra xem người dùng đã nhập mã chưa
      return;
  }

  try {
      const response = await customFetch(`http://localhost:5241/api/Discount/${voucherCode}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
          alert('Mã ưu đãi không hợp lệ hoặc có lỗi xảy ra.'); // Kiểm tra phản hồi từ API
          return;
      }

      const data = await response.json();

      // Kiểm tra dữ liệu trả về
      if (data.status === 200 && data.response && data.response.percent) {
          const voucherDiscount = data.response.percent; // Lấy tỷ lệ giảm giá từ API
          applyDiscount(voucherDiscount, originalTotal); // Giả định bạn đã định nghĩa hàm applyDiscount
      } else {
          alert('Mã ưu đãi không hợp lệ.'); // Thông báo nếu mã không hợp lệ
      }
  } catch (error) {
      console.error('Có lỗi xảy ra khi kiểm tra mã ưu đãi:', error); // Ghi log lỗi nếu có
      alert('Đã xảy ra lỗi, vui lòng thử lại sau.'); // Thông báo cho người dùng
  }
}


// Hàm áp dụng giảm giá và cập nhật tổng giá trị
function applyDiscount(discountAmount, originalTotal) {
  const discountValue = Math.min(discountAmount, originalTotal); // Giảm giá không vượt quá tổng
  const discountedTotal = originalTotal - discountValue; // Áp dụng giảm giá trực tiếp
  updateTotalDisplay(discountedTotal); // Cập nhật hiển thị tổng mới
  alert(`Áp dụng mã giảm giá thành công! Bạn đã được giảm ${discountValue.toLocaleString()} VNĐ.`);
}


// Cập nhật tổng giá trị hiển thị
function updateTotalDisplay(total) {
  document.getElementById('total').textContent = `${total.toLocaleString()} VNĐ`;
}


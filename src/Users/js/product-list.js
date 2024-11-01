
import { customFetch } from './apiService.js';

document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'http://localhost:5241/api/Product/category/1'; // Thay địa chỉ API phù hợp
    const productContainer = document.querySelector('.right-content .block');

    async function fetchProducts(page = 1, size = 10) {
        try {
            const response = await fetch(`${apiUrl}?page=${page}&size=${size}`);
            const data = await response.json();

            if (response.ok && data.status === 200) {
                renderProducts(data.results);
            } else {
                console.error('Error fetching products:', data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    function renderProducts(products) {
        productContainer.innerHTML = ''; // Xóa nội dung cũ
        // Kiểm tra và chuẩn hóa đường dẫn hình ảnh
        products.forEach(product => {
            // Kiểm tra và chuẩn hóa đường dẫn hình ảnh
            let imageUrl = product.urlImage;
            if (!imageUrl.startsWith('http')) {
                imageUrl = `http://localhost:5241/${imageUrl}`; // Chèn địa chỉ API vào nếu cần
            }
    
            const productHtml = `
                <div class="one-block">
                    <div class="elements">
                        <div class="gr-black"></div>
                        <ul class="list-element">
                            <li><img class="img-right-content" src="${imageUrl}" alt="${product.name}"></li>
                            <li><span>${product.name}</span></li>
                            <li><p>Giá: ${product.price.toLocaleString()} VNĐ</p></li>
                           <button class="add-to-cart-button" data-product-id="${product.productId}">Thêm vào Giỏ hàng</button>

                        </ul>
                    </div>
                </div>`;
            productContainer.insertAdjacentHTML('beforeend', productHtml);
        });

   // Gọi hàm để thêm sự kiện cho các nút "Thêm vào Giỏ hàng"
   attachAddToCartEvent();

}

function attachAddToCartEvent() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.getAttribute('data-product-id');
            await addToCart(productId);
        });
    });
}
 async function addToCart(productId) {
    const userId = getUserIdFromToken(); // Hàm để lấy userId từ token

     const requestBody = {
        productId: productId,
        UserId: userId
    };

    try {
        const response = await customFetch('http://localhost:5241/api/Cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Lấy token từ local storage
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
       
        
        if (data.status === 200) {
          
            window.location.href = '/src/Users/pages/cart.html';
            
        } else {
            console.error('Error adding product to cart:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchProducts(); // Gọi hàm khi trang tải
});


// lấy 
function getUserIdFromToken() {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    // Giả định token là một JWT, lấy userId từ payload
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã payload
            return payload.UserId || payload.sub; // Trả về userId hoặc sub (nếu sử dụng sub làm userId)
        } catch (error) {
            console.error('Error parsing token payload:', error);
            return null; // Trả về null nếu không thể parse
        }
    }
    return null; // Trả về null nếu không có token
}


import { getUserIdFromToken } from "./UserId.js";
import { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn đúng

        // Lấy productId từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('productId');

        // Gọi API để lấy thông tin sản phẩm theo productId
        fetch(`http://localhost:5241/api/Product/${productId}`) // Đổi URL này thành URL thực tế của API của bạn
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    const product = data.result;
                    const imageUrl = product.urlImage.startsWith('http') ? product.urlImage : `http://localhost:5241${product.urlImage}`;

                    // Cập nhật thông tin chi tiết sản phẩm trên trang
                    document.getElementById('product-name').innerText = product.name;
                    document.getElementById('product-image').src = imageUrl;
                    document.getElementById('product-description').innerHTML = product.description;
                    document.getElementById('product-price').innerText = `${product.price.toLocaleString()} VNĐ`;
                    document.getElementById('product-status').innerText = `Tình trạng: ${product.status}`;

                    // Thêm nút "MUA NGAY" với hành động kèm productId
                       const addCartButton = document.getElementById('add-cart');
                         // Thêm nội dung cho nút
                        addCartButton.innerHTML = `
                            <p class="add-cart" data-product-id=${product.productId} style="font-weight: bold; font-size: 18px;">MUA NGAY</p>
                            <p style="font-style: italic;">Đặt mua và giao hàng tận nơi</p>
                        `;
                } else {
                    alert('Không thể lấy thông tin sản phẩm');
                }
            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error);

            });

            // Xử lý gọi API cho nút thêm sản phẩm
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('add-cart')) {
        event.preventDefault();

        const productId = parseInt(event.target.getAttribute('data-product-id'));
        const userId = getUserIdFromToken();

        try {
            const response = await customFetch('http://localhost:5241/api/Cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, userId })


            });

            if (response.ok) {
                window.location.href = '/src/Users/pages/cart.html';
            } else {
                window.location.href = "/src/Users/pages/account/login-signup.html"

            }
        } catch (error) {
            console.error('Lỗi: Không thêm được vào giỏ hàng.', error);
        }
    }
});

// Xử lý gửi đánh giá
document.getElementById('commentform').addEventListener('submit', async (event) => {
    event.preventDefault(); // Ngăn form tải lại trang

    const comment = document.getElementById('review-comment').value.trim();
    const userId = getUserIdFromToken(); // Lấy userId từ token
    if (!userId) {
        alert("Vui lòng đăng nhập để đánh giá sản phẩm!");
        window.location.href = "/src/Users/pages/account/login-signup.html";
        return;
    }

    if (!comment) {
        alert("Vui lòng nhập ý kiến đánh giá!");
        return;
    }

    try {
        // Gửi đánh giá lên server
        const response = await customFetch('http://localhost:5241/api/Review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, userId, comment })
        });

        if (response.ok) {
            alert('Đánh giá của bạn đã được gửi thành công!');
            document.getElementById('commentform').reset(); // Xóa nội dung trong form
        } else {
            const result = await response.json();
            alert(`Không thể gửi đánh giá: ${result.message || 'Đã xảy ra lỗi.'}`);
        }
    } catch (error) {
        console.error('Lỗi khi gửi đánh giá:', error);
        alert('Đã xảy ra lỗi khi gửi đánh giá.');
    }
});


document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:5241/api/Promotional")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Truy cập vào mảng message trong phản hồi JSON
            const products = data.message;
           
            const container = document.getElementById("promotional-products-container");
            container.innerHTML = ""; // Xóa nội dung hiện tại
            
            products.forEach(product => {
                const baseUrl = "http://localhost:5241"; // Thay đổi địa chỉ này nếu cần
                const imageUrl = `${baseUrl}${product.imageUrl}`;
                const productItem = `
                    <div class="product-one-content-item">
                        <div class="img-product">
                            <a href="${`http://127.0.0.1:5500/src/Users/pages/product-detail.html?productId=${product.productId}`}"><img src="${imageUrl}" alt="${product.productName}"></a>
                            <span class="sale-box">${(product.discountPercentage * 100).toFixed(0)}%</span>
                        </div>
                        <div class="product-title">
                            <div class="name-product"><a href="#">${product.productName}</a></div>
                            <div class="product-price">
                                <li>Giá khuyến mãi: ${calculateDiscountedPrice(product.price, product.discountPercentage)}₫</li>
                                <li>Giá gốc: ${getOriginalPrice(product.price)}₫</li>
                            </div>
                        </div>
                    </div>`;
                container.innerHTML += productItem; // Thêm sản phẩm vào container
            });
        })
        .catch(error => {
            console.error("There has been a problem with your fetch operation:", error);
        });
});

// Hàm tính giá khuyến mãi
function calculateDiscountedPrice(price, discountPercentage) {
    
    return (price * (1 - discountPercentage)).toLocaleString();
}

// Hàm lấy giá gốc
function getOriginalPrice(price) {
// Kiểm tra xem giá có tồn tại cho productId không
    if (price !== undefined) {
        return price.toLocaleString(); // Trả về giá gốc được định dạng
    } else {
        console.error("Price is undefined for productId:", price);
        return "N/A"; // Hoặc một giá trị mặc định nào đó
    }
}


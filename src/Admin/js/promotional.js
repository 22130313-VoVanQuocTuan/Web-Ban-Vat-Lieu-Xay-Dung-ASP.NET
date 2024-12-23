import { customFetch } from '/src/apiService.js'; 

// Hàm gọi API và hiển thị danh sách khuyến mãi
async function loadPromotions() {
    try {
        // Gọi API để lấy danh sách khuyến mãi
        const response = await fetch('http://localhost:5241/api/Promotional', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Kiểm tra trạng thái phản hồi
        if (data.status !== 200) {
            console.error('Error fetching promotions:', data.message);
            return;
        }

        // Lấy danh sách sản phẩm từ phản hồi
        const promotions = data.message;

        // Hiển thị danh sách sản phẩm trong bảng
        const productListElement = document.getElementById('productList');
        productListElement.innerHTML = ''; // Xóa nội dung cũ

        promotions.forEach(promotion => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${promotion.productId}</td>
                <td>${promotion.discountPercentage * 100}%</td>
                <td>${promotion.productName }</td>
                <td>${promotion.startDate}</td>
                <td>${promotion.endDate}</td>
                <td class="bt">
                    <button class="update-product-button" data-product-id="${promotion.productId}">Cập nhật</button>
                    <button class="delete-product-button" data-product-id="${promotion.productId}">Xóa</button>
                </td>
            `;

            productListElement.appendChild(row);
        });

        // Gắn sự kiện cho các nút "Xóa" và "Cập nhật"
        document.querySelectorAll('.delete-product-button').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id'); // Lấy ID sản phẩm
                deleteProduct(productId); // Gọi hàm xóa
            });
        });

        document.querySelectorAll('.update-product-button').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id'); // Lấy ID sản phẩm
                updateProduct(productId); // Gọi hàm cập nhật
            });
        });

    } catch (error) {
        console.error('Error loading promotions:', error);
    }
}



// Hàm xóa sản phẩm
async function deleteProduct(productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5241/api/Promotions/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 200) {
            alert('Xóa không thành công: ' + data.message);
            return;
        }

        alert('Xóa thành công!');
        loadPromotions(); // Làm mới danh sách khuyến mãi
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}


// Gọi hàm loadPromotions khi trang tải
loadPromotions();






// tôi viết 

// Mở modal thêm sản phẩm

document.getElementById('add-pro').onclick = function(){
    document.getElementById('addPromotionModal').style.display= 'block';
}
//Đóng model
document.getElementById('close-modal').onclick = function(){
    document.getElementById('addPromotionModal').style.display= 'none';
}



// Mở modal cập nhật sản phẩm
function openUpdateProductModal(product) {
    const modal = document.getElementById('updatePromotionModal');
    modal.style.display = 'block';

    // Điền thông tin sản phẩm vào form
    document.getElementById('updateProductId').value = product.productId;
    document.getElementById('updateProductName').value = product.productName;
    document.getElementById('updateDiscount').value = product.discountPercentage * 100;
    document.getElementById('updateStartDate').value = product.startDate;
    document.getElementById('updateEndDate').value = product.endDate;
}



// Lưu sản phẩm mới
document.getElementById('saveNewPromotion').addEventListener('click', saveNewPromotion);
async function saveNewPromotion() {
    const productId = document.getElementById('addProductId').value;

    const discount = document.getElementById('addDiscount').value;
    const startDate = document.getElementById('addStartDate').value;
    const endDate = document.getElementById('addEndDate').value;

    const newPromotion = {
        productId,
     
        discountPercentage: discount,
        startDate,
        endDate,
    };

    try {
        const response = await customFetch('http://localhost:5241/api/Promotional', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(newPromotion)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 200) {
            alert('Thêm sản phẩm không thành công: ' + data.message);
            return;
        }

        alert('Thêm sản phẩm thành công!');
        loadPromotions();
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

// Lưu cập nhật sản phẩm
async function saveUpdatedPromotion() {
    const productId = document.getElementById('updateProductId').value;
    const discount = document.getElementById('updateDiscount').value;
    const startDate = document.getElementById('updateStartDate').value;
    const endDate = document.getElementById('updateEndDate').value;

    const updatedPromotion = {
        productId,
        productName,
        discountPercentage: discount,
        startDate,
        endDate,
    };

    try {
        const response = await fetch(`http://localhost:5241/api/Promotional/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPromotion),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 200) {
            alert('Cập nhật sản phẩm không thành công: ' + data.message);
           
            return;
        }

        alert('Cập nhật sản phẩm thành công!');
        document.getElementById('addPromotionModal').style.display= 'none';
        loadPromotions();
    } catch (error) {
        console.error('Error updating product:', error);
    }
}



// Đóng modal khi click ra ngoài
window.onclick = function (event) {
    const addModal = document.getElementById('addPromotionModal');
    const updateModal = document.getElementById('updatePromotionModal');

    if (event.target === addModal) {
        closeAddPromotionModal();
    }

    if (event.target === updateModal) {
        closeUpdatePromotionModal();
    }
};
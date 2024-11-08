const vouchers = [];

// Hàm mở modal để thêm sản phẩm mới
function openAddVoucherModal() {
    document.getElementById('addVoucherModal').style.display = 'flex';
}

// Hàm đóng modal Thêm sản phẩm
function closeAddVoucherModal() {
    document.getElementById('addVoucherModal').style.display = 'none';
}

let editingVoucherIndex = null; // Biến lưu chỉ mục sản phẩm đang sửa

// Hàm thêm/sửa sản phẩm
function addVoucher() {
    const id = document.getElementById('voucherId').value;
    const code = document.getElementById('voucherCode').value;
    const down = document.getElementById('voucherDown').value;

    const voucher = {
        id,
        code,
        down
    };
    if (editingVoucherIndex !== null) {
        // Nếu đang trong chế độ chỉnh sửa, cập nhật thông tin sản phẩm
        vouchers[editingVoucherIndex] = voucher;
        editingVoucherIndex = null; // Đặt lại chỉ mục sau khi sửa xong
    } else {
        // Nếu không, thêm sản phẩm mới
        vouchers.push(voucher);
    }

    // Hiển thị lại danh sách sản phẩm
    displayVouchers();

    // Làm sạch form
    clearForm();

    // Đóng modal
    closeAddVoucherModal();
}
// Hàm hiển thị danh sách sản phẩm lên bảng
function displayVouchers() {
    const voucherList = document.getElementById('voucherList');
    voucherList.innerHTML = '';

    // Duyệt qua mảng sản phẩm và hiển thị vào bảng
    vouchers.forEach((voucher, index) => {
        const voucherRow = document.createElement('tr');
        voucherRow.innerHTML = `
            <td>${voucher.id}</td> 
            <td>${voucher.code}</td>  <!-- Hiển thị mã sản phẩm -->
            <td>${voucher.down}</td>
            <td class="action-links">
                <a href="#" class="edit" onclick="editVoucher(${index})">Sửa</a>
                <a href="#" class="delete" onclick="deleteVoucher(${index})">Xóa</a>
            </td>
        `;
        voucherList.appendChild(voucherRow);
    });
}
// Hàm chỉnh sửa voucher
function editVoucher(index) {
    const voucher = vouchers[index];
    document.getElementById('voucherId').value = voucher.id;
    document.getElementById('voucherCode').value = voucher.code;
    document.getElementById('voucherDown').value = voucher.down;
    
    editingVoucherIndex = index; // Ghi nhận chỉ mục sản phẩm đang sửa
    openAddVoucherModal();
}

// Hàm xóa sản phẩm
function deleteVoucher(index) {
    vouchers.splice(index, 1);
    displayVouchers();
}

// Hàm làm sạch form nhập liệu
function clearForm() {
    document.getElementById('addVoucherForm').reset();
}

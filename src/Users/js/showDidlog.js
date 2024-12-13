
// Hàm hiển thị dialog
export function showDialog(title, message) {
    // Đóng tất cả các dialog hiện tại trước khi mở dialog mới
    const existingDialog = document.querySelector('dialog[open]');
    if (existingDialog) {
        existingDialog.close(); // Đóng dialog hiện tại nếu có
    }

    // Lấy dialog mới và cập nhật nội dung
    const dialog = document.getElementById("successDialog");

    if (dialog) {
        dialog.querySelector(".dialog-title").textContent = title;
        dialog.querySelector(".dialog-message").textContent = message;
        dialog.showModal(); // Hiển thị dialog mới
    }
}

window.closeDialog = closeDialog;
export function closeDialog() {
    const dialog = document.getElementById("successDialog");
    if (dialog) {
        dialog.close(); // Đóng dialog
       
    }
    
}



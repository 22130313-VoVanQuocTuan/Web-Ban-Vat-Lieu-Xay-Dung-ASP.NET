import { showDialog } from "./showDidlog.js";
import { getUserIdFromToken } from "./UserId.js";
import { customFetch } from '/src/apiService.js'; // Đảm bảo đường dẫn đúng

const userId = getUserIdFromToken();
const apiUrl = "http://localhost:5241/api/User"; // Không cần dấu '/' ở cuối


async function fetchUserData() {
  try {
    const response = await customFetch(`${apiUrl}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
  
      }
    });

    if (!response.ok) {
      saveButton("Lỗi khi lấy thông tin người dùng.");
    }

    const data = await response.json();

    // Hiển thị thông tin người dùng lên giao diện
    displayUserData(data.message);
    populateForm(data.message);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
}

function displayUserData(user) {
  document.getElementById("username-hello").textContent = user.userName;
  document.getElementById("username-user").textContent = user.userName;
  document.getElementById("fullname").textContent = user.fullName;
  document.getElementById("email").textContent = user.email;
  document.getElementById("birth-year").textContent = user.phoneNumber;
  document.getElementById("address").textContent = user.address;
}
// Gọi hàm khi trang được tải
document.addEventListener("DOMContentLoaded", fetchUserData);

// Các input trong form
const nameInput = document.getElementById("customer-name");
const phoneInput = document.getElementById("customer-phone");
const emailInput = document.getElementById("customer-email");
const addressInput = document.getElementById("customer-address");
// Điền dữ liệu vào form
function populateForm(userData) {
  nameInput.value = userData.fullName || "";
  phoneInput.value = userData.phoneNumber || "";
  emailInput.value = userData.email || "";
  addressInput.value = userData.address || "";
}

//  Cập nhật th tin tài khoản
const saveButton = document.getElementById("save-button");
const dialog = document.getElementById("edit-dialog");
const updateAccount = document.getElementById("update-customer");
const closeDialogButton = document.getElementById("close-dialog");

// Mở dialog
updateAccount.addEventListener("click", () => dialog.showModal());

// Đóng dialog
closeDialogButton.addEventListener("click", () => dialog.close());

// Xử lý cập nhật thông tin
saveButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const updatedData = {
    FullName: nameInput.value,
    PhoneNumber: phoneInput.value,
    Email: emailInput.value,
    Address: addressInput.value,
  };
  const apiUrl = "http://localhost:5241/api/User/";
  try {
    const response = await customFetch(`${apiUrl}${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      showDialog("Cập nhật thông tin thất bại.");
    } else {
      showDialog("Thông tin đã được cập nhật thành công!");
     

    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error.message);
  }
});


window.closeDialog = closeDialog;
export function closeDialog() {
    const dialog = document.getElementById("successDialog");
    if (dialog) {
        dialog.close(); // Đóng dialog
        location.reload();
    }
    
}

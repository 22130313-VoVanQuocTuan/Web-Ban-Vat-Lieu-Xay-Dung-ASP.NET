// Ví dụ dữ liệu đơn hàng
const orders = [
  {
    id: 1,
    date: "2024-11-01",
    address: "123 Đường ABC, TP.HCM",
    value: "1.000.000 VNĐ",
    paymentStatus: "Đã thanh toán",
  },
  {
    id: 2,
    date: "2024-10-15",
    address: "456 Đường DEF, Hà Nội",
    value: "500.000 VNĐ",
    paymentStatus: "Chưa thanh toán",
  },
  {
    id: 3,
    date: "2024-09-30",
    address: "789 Đường GHI, Đà Nẵng",
    value: "750.000 VNĐ",
    paymentStatus: "Đã thanh toán",
  },
];

// Hàm tạo danh sách đơn hàng
function populateOrderInformation() {
  const tbody = document.getElementById("order-information");
  orders.forEach((order, index) => {
    // Tạo phần tử tr
    const tr = document.createElement("tr");

    // Thêm dữ liệu vào tr
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${order.date}</td>
        <td>${order.address}</td>
        <td>${order.value}</td>
        <td>${order.paymentStatus}</td>
      `;

    // Thêm tr vào tbody
    tbody.appendChild(tr);
  });
}

// Gọi hàm để thêm dữ liệu vào bảng
populateOrderInformation();

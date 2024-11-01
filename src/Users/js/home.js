// Slider image
const rightbtn = document.querySelector('.nut_phai');
const leftbtn = document.querySelector('.nut_trai');
const imgCount = document.querySelectorAll('.slide-show-content-image img');
let index = 0;
console.log(rightbtn);
console.log(leftbtn);

rightbtn.addEventListener("click", function () {
  index = index + 1;
  if (index > imgCount.length - 1) {
    index = 0; // Quay lại đầu
  }
  updateSlider();
});

leftbtn.addEventListener("click", function () {
  index = index - 1;
  if (index < 0) {
    index = imgCount.length - 1; // Quay lại cuối
  }
  updateSlider();
});

function updateSlider() {
  const offset = -index * 100; // Tính toán offset dựa trên index
  document.querySelector(".slide-show-content-image").style.transform = `translateX(${offset}%)`;
  console.log("Current Index:", index); // Kiểm tra giá trị index
}
// Làm silder image tự chạy.
function imgAuto() {
   index = index + 1
  if (index > imgCount.length - 1) {
    index = 0;
  }
  updateSlider();
  console.log(index);
}
setInterval(imgAuto,5000);




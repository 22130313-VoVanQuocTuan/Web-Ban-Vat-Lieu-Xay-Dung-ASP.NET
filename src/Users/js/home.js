// Slider image
const rightbtn = document.querySelector('.nut_phai');
const leftbtn = document.querySelector('.nut_trai');
const imgCount = document.querySelectorAll('.slider-product-one-content-items');
let index = 0;
console.log(rightbtn);
console.log(leftbtn);

rightbtn.addEventListener("click", function () {
  index = index + 1;
  if (index > productCounttwo1.length - 1) {
      index = 0; // Quay lại đầu
  }
  updateSlider();
});

leftbtn.addEventListener("click", function () {
  index = index - 1;
  if (index < 0) {
      index = productCounttwo1.length - 1; // Quay lại cuối
  }
  updateSlider();
});

  function updateSlider() {
  const offset = -index1 * 100; // Tính toán offset dựa trên index
  document.querySelector(".slide-show-container").style.transform = `translateX(${offset}%)`;
  console.log("Current Index:", index); // Kiểm tra giá trị index
}





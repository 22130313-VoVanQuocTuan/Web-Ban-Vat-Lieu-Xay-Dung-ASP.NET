let products = [
    { id: 'P001', value: 20, startDate: '2024-11-01', endDate: '2024-11-30', name: 'Sản phẩm A' },
    { id: 'P002', value: 30, startDate: '2024-11-05', endDate: '2024-11-25', name: 'Sản phẩm B' }
  ];
  
  function renderDiscountList() {
    const discountList = document.getElementById('discount-list');
    discountList.innerHTML = '';
  
    products.forEach((product, index) => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.value}%</td>
        <td>${product.startDate}</td>
        <td>${product.endDate}</td>
        <td>${product.name}</td>
        <td>
          <button class="btn btn-primary" onclick="showUpdateForm(${index})">Cập Nhật</button>
          <button class="btn btn-danger" onclick="confirmDelete(${index})">Xóa</button>
        </td>
      `;
  
      discountList.appendChild(row);
    });
  }
  
  function showAddForm() {
    document.getElementById('add-form').style.display = 'flex';
  }
  
  function closeForm() {
    document.getElementById('add-form').style.display = 'none';
  }
  
  function closeUpdateForm() {
    document.getElementById('update-form').style.display = 'none';
  }
  
  function showUpdateForm(index) {
    const product = products[index];
    document.getElementById('update-product-id').value = product.id;
    document.getElementById('update-discount-value').value = product.value;
    document.getElementById('update-start-date').value = product.startDate;
    document.getElementById('update-end-date').value = product.endDate;
    document.getElementById('update-product-name').value = product.name;
  
    document.getElementById('update-form').style.display = 'flex';
  
    document.getElementById('update-discount-form').onsubmit = function (event) {
      event.preventDefault();
      updateProduct(index);
    };
  }
  
  function addProduct() {
    const newProduct = {
      id: document.getElementById('product-id').value.trim(),
      value: parseInt(document.getElementById('discount-value').value),
      startDate: document.getElementById('start-date').value,
      endDate: document.getElementById('end-date').value,
      name: document.getElementById('product-name').value.trim()
    };
  
    if (products.some(product => product.id === newProduct.id)) {
      alert('Mã sản phẩm đã tồn tại!');
      return;
    }
  
    products.push(newProduct);
    renderDiscountList();
    closeForm();
  }
  
  function updateProduct(index) {
    const newId = document.getElementById('update-product-id').value.trim();
    const newValue = parseInt(document.getElementById('update-discount-value').value);
    const newStartDate = document.getElementById('update-start-date').value;
    const newEndDate = document.getElementById('update-end-date').value;
    const newName = document.getElementById('update-product-name').value.trim();
  
    if (products.some((product, i) => product.id === newId && i !== index)) {
      alert('Mã sản phẩm đã tồn tại!');
      return;
    }
  
    products[index] = {
      id: newId,
      value: newValue,
      startDate: newStartDate,
      endDate: newEndDate,
      name: newName
    };
  
    renderDiscountList();
    closeUpdateForm();
  }
  
  function confirmDelete(index) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      products.splice(index, 1);
      renderDiscountList();
    }
  }
  
  document.getElementById('add-discount-form').onsubmit = function (event) {
    event.preventDefault();
    addProduct();
  };
  
  renderDiscountList();
  
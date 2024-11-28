 // Lấy userId từ token
 export function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Gỉa mã JWT để lấy UserId từ token
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.UserId; // Đảm bảo tên thuộc tính đúng với cấu trúc của token
  }


  export function getUserName() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Gỉa mã JWT để lấy UserId từ token
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.name; // Đảm bảo tên thuộc tính đúng với cấu trúc của token
  }
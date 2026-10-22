import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page-not-found">
      <div className="not-found-card">
        <h1>404 - Không tìm thấy trang</h1>
        <p>Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.</p>
        <Link to="/" className="link-home">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

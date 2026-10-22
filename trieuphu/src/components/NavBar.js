import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const navStyle = ({ isActive }) => ({
    color: isActive ? '#dc2626' : '#374151',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  });

  return (
    <nav className="navbar">
      <div className="nav-brand">AI LÀ TRIỆU PHÚ</div>
      <div className="nav-links">
        <NavLink to="/" end style={navStyle}>
          Trang chủ
        </NavLink>
        <NavLink to="/questions" style={navStyle}>
          Ngân hàng câu hỏi
        </NavLink>
        <NavLink to="/history" style={navStyle}>
          Lịch sử
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;

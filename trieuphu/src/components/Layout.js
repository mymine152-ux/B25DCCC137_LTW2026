import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => {
  return (
    <div className="app-layout">
      <NavBar />
      <main className="main-content">
        {loading && <div className="status-message loading">Đang tải câu hỏi...</div>}
        {!loading && error && <div className="status-message error">Không tải được câu hỏi.</div>}
        {!loading && !error && <Outlet />}
      </main>
    </div>
  );
};

export default Layout;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import { clearAuth, isTokenExpired } from '@/lib/auth';

const Layout: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired()) {
    if (token) {
      clearAuth();
    }
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;

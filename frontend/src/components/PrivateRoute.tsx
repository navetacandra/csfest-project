import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired, clearAuth } from '@/lib/auth';

interface PrivateRouteProps {
  role?: 'admin' | 'dosen' | 'mahasiswa';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token || isTokenExpired()) {
    if (token) {
      clearAuth();
    }
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    // Redirect to a default page if the role does not match
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PrivateRoute;

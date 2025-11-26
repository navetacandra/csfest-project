import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { isTokenExpired, clearAuth } from '@/lib/auth';

interface PrivateRouteProps {
  role?: 'admin' | 'dosen' | 'mahasiswa';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    // Check if token is expired on mount
    if (!token || isTokenExpired()) {
      if (token) {
        clearAuth();
      }
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  // Initial render check
  if (!token || isTokenExpired()) {
    if (token) {
      clearAuth();
    }
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // Redirect to a default page if the role does not match
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

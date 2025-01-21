import React from 'react';
import { Navigate } from 'react-router-dom';

// Mock authentication flag
const isAuthenticated = localStorage.getItem('admin_logged_in') === 'true'; // Removed the extra space

const PrivateRoutes = ({ children }) => {
  return isAuthenticated ? children : <Navigate to="/admin-login" />;
};

export default PrivateRoutes;

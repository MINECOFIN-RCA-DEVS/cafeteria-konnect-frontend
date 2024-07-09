// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ isAuthenticated, role, children }) => {
  if (!isAuthenticated || !role) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoutes;

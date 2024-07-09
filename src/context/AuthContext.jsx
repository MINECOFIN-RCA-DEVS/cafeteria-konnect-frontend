import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  const [role, setRole] = useState(() => sessionStorage.getItem('role') || '');

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    sessionStorage.setItem('userId', decodedToken.id);
    sessionStorage.setItem('role', decodedToken.role);
    sessionStorage.setItem('isAuthenticated', true);
    setRole(decodedToken.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('isAuthenticated');

    setIsAuthenticated(false);
  };

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem('isAuthenticated') === 'true');
    setRole(sessionStorage.getItem('role') || '');
  }, [sessionStorage]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

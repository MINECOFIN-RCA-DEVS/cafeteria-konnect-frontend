import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  const [role, setRole] = useState(() => sessionStorage.getItem('role') || '');
  const [token, setToken] = useState(()=> sessionStorage.getItem('token') || '')

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    sessionStorage.setItem('userId', decodedToken.id);
    sessionStorage.setItem('role', decodedToken.role);
    sessionStorage.setItem('isAuthenticated', true);
    sessionStorage.setItem('token', token)
    setRole(decodedToken.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('token');

    setIsAuthenticated(false);
  };

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem('isAuthenticated') === 'true');
    setRole(sessionStorage.getItem('role') || '');
  }, [sessionStorage]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

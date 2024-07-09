import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check sessionStorage on initial load
    const storedUserId = sessionStorage.getItem('userId');
    const storedRole = sessionStorage.getItem('role');

    if (storedUserId && storedRole) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(API_BASE_URL + '/users/login', {
        email,
        password,
      });

      const token = response.data.data.access_token;
      const decodedToken = jwtDecode(token);

      // Store in sessionStorage
      sessionStorage.setItem('userId', decodedToken.id);
      sessionStorage.setItem('role', decodedToken.role);

      setIsAuthenticated(true);
      setError(null);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response.data.message);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setError(null);

    // Clear sessionStorage
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

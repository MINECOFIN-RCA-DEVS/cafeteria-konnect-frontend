import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RestaurantHome from './restaurantHome/RestaurantHome';
import ProtectedRoute from '../components/protectedRoutes/ProtectedRoutes';
import RestaurantReceipts from './restaurantReceipts/RestaurantReceipts';
import RestaurantInvoice from './restaurantInvoice/RestaurantInvoice';

function RestaurantRoutes({ isAuthenticated }) {
  return (
    <Routes>
      <Route
        path={'home'}
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RestaurantHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="receipts"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RestaurantReceipts />
          </ProtectedRoute>
        }
      />
      <Route
        path="invoice"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RestaurantInvoice />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default RestaurantRoutes;

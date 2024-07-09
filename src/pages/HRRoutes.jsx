import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from '../components/protectedRoutes/ProtectedRoutes';
import Statistics from './statistics/Statistics';
import Guests from './guests/Guests';
import Attendees from './attendees/Attendees';
import Restaurant from './restaurant/Restaurant';

const HRRoutes = ({ isAuthenticated }) => (
  <Routes>
    <Route
      path="statistics"
      element={
        <ProtectedRoutes isAuthenticated={isAuthenticated}>
          <Statistics />
        </ProtectedRoutes>
      }
    />
    <Route
      path="attendees"
      element={
        <ProtectedRoutes isAuthenticated={isAuthenticated}>
          <Attendees />
        </ProtectedRoutes>
      }
    />
    <Route
      path="restaurant"
      element={
        <ProtectedRoutes isAuthenticated={isAuthenticated}>
          <Restaurant />
        </ProtectedRoutes>
      }
    />
    <Route
      path="guests"
      element={
        <ProtectedRoutes isAuthenticated={isAuthenticated}>
          <Guests />
        </ProtectedRoutes>
      }
    />
  </Routes>
);

export default HRRoutes;

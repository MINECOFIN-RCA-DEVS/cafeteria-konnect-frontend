// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HRRoutes from './pages/HRRoutes';
import RestaurantRoutes from './pages/RestaurantRoutes';
import { FaChartBar, FaFileInvoice } from 'react-icons/fa';
import { FaFileInvoiceDollar, FaPeopleGroup } from 'react-icons/fa6';
import { BsPeopleFill } from 'react-icons/bs';
import { IoReceipt } from 'react-icons/io5';
import ProtectedRoutes from './components/protectedRoutes/ProtectedRoutes';
import Login from './pages/auth/Login';

function App() {
  const isAuthenticated = true;
  const role = 'hr'; // Change this to 'restaurant' for restaurant role

  const hrHeaderTitle = 'HR Dashboard';
  const hrSidebarFields = [
    {
      id: 1,
      destination: '/hr/statistics',
      icon: <FaChartBar className="mr-2" />,
      title: 'Statistics',
    },
    {
      id: 2,
      destination: '/hr/attendees',
      icon: <FaPeopleGroup className="mr-2" />,
      title: 'Attendees',
    },
    {
      id: 3,
      destination: '/hr/restaurant',
      icon: <FaFileInvoiceDollar className="mr-2" />,
      title: 'Restaurant',
    },
    {
      id: 4,
      destination: '/hr/guests',
      icon: <BsPeopleFill className="mr-2" />,
      title: 'Guests',
    },
  ];

  const restaurantHeaderTitle = 'Restaurant Dashboard';
  const restaurantSidebarFields = [
    {
      id: 1,
      destination: '/restaurant/home',
      icon: <FaChartBar className="mr-2" />,
      title: 'Home',
    },
    {
      id: 2,
      destination: '/restaurant/receipts',
      icon: <IoReceipt className="mr-2" />,
      title: 'Receipts',
    },
    {
      id: 3,
      destination: '/restaurant/invoice',
      icon: <FaFileInvoice className="mr-2" />,
      title: 'Invoice',
    },
  ];

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Unauthenticated Routes */}
          <Route path="/login" element={<Login />} />

          {/* Authenticated Routes */}
          <Route
            path="/hr/*"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated} role={role}>
                <Layout
                  sidebarFields={hrSidebarFields}
                  headerTitle={hrHeaderTitle}
                >
                  <HRRoutes isAuthenticated={isAuthenticated} />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/restaurant/*"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated} role={role}>
                <Layout
                  sidebarFields={restaurantSidebarFields}
                  headerTitle={restaurantHeaderTitle}
                >
                  <RestaurantRoutes isAuthenticated={isAuthenticated} />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated} role={role}>
                <Navigate
                  to={role === 'hr' ? '/hr/statistics' : '/restaurant/home'}
                />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

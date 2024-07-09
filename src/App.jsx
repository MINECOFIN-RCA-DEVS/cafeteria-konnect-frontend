import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HRRoutes from './pages/HRRoutes';
import Login from './pages/auth/Login';
import RestaurantRoutes from './pages/RestaurantRoutes';
import { FaChartBar, FaFileInvoice } from 'react-icons/fa';
import { FaFileInvoiceDollar, FaPeopleGroup } from 'react-icons/fa6';
import { BsPeopleFill } from 'react-icons/bs';
import { IoReceipt } from 'react-icons/io5';

function App() {

  const { isAuthenticated } = useAuth();
  const role = sessionStorage.getItem('role');

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
        {/* Redirect to appropriate dashboard if authenticated */}
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={role === 'HR' ? '/hr/statistics' : '/restaurant/home'}
                />
              ) : (
                <Login />
              )
            }
          />
          {role === 'HR' && (
            <>
              <Route
                path="/hr/*"
                element={
                  isAuthenticated ? (
                    <Layout
                      sidebarFields={hrSidebarFields}
                      headerTitle={hrHeaderTitle}
                    >
                      <HRRoutes isAuthenticated={isAuthenticated} />
                    </Layout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/hr/statistics" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </>
          )}
          {role === 'RESTAURANT' && (
            <>
              <Route
                path="/restaurant/*"
                element={
                  isAuthenticated ? (
                    <Layout
                      sidebarFields={restaurantSidebarFields}
                      headerTitle={restaurantHeaderTitle}
                    >
                      <RestaurantRoutes isAuthenticated={isAuthenticated} />
                    </Layout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/restaurant/home" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </>
          )}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

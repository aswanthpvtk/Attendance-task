import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DashboardHome from './pages/DashboardHome';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/Login';
import Batches from './pages/Batches';
import CourseDetails from './pages/CourseDetails';
import QrDisplayPage from './pages/QrDisplayPage';
import Attendance from './pages/Attendance';
import DeviceChange from './pages/DeviceChange';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Pass handleLogin function to Login */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />

        {/* QR Page Without Layout */}
        <Route path="/qr" element={<QrDisplayPage />} />

        {/* Protected Routes With DashboardLayout */}
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="/batches" element={<Batches />} />
                  <Route path="/batches/details" element={<CourseDetails />} />
                  <Route path="/batches/details/attendance" element={<Attendance />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/device" element={<DeviceChange />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </DashboardLayout>
            }
          />
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import FloatingButton from './components/common/FloatingButton';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetail from './pages/VenueDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerBookings from './pages/owner/OwnerBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmailVerification from './pages/EmailVerification';
import { useAuth } from './contexts/AuthContext';
import './index.css';

function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Only show Navbar if user is authenticated */}
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* Protected User Routes */}
        <Route
          path="/venues"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Venues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues/:id"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <VenueDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Favorites />
            </ProtectedRoute>
          }
        />

        {/* Protected Owner Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/bookings"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerBookings />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === 'owner' ? (
                <Navigate to="/owner/dashboard" replace />
              ) : user?.role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/venues" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      {/* Only show FloatingButton for regular users */}
      {isAuthenticated && user?.role === 'user' && <FloatingButton />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;


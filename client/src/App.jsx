import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import FloatingButton from './components/common/FloatingButton';
import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetail from './pages/VenueDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <FloatingButton />
      </Router>
    </AuthProvider>
  );
}

export default App;


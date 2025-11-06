import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Play, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  // Handle logout and redirect
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = user?.role === 'owner' 
    ? [
        { path: '/owner/dashboard', label: 'Dashboard' },
        { path: '/owner/bookings', label: 'Bookings' },
        { path: '/profile', label: 'Profile' },
      ]
    : [
        { path: '/venues', label: 'Venues' },
        { path: '/favorites', label: 'Favorites' },
        { path: '/profile', label: 'Profile' },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-secondary/95 backdrop-blur-md shadow-lg shadow-primary/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center gap-2">
              <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-gradient-primary">
                <Play className="w-5 h-5 text-secondary md:text-secondary" fill="currentColor" />
              </div>
              <span className="text-xl sm:text-2xl font-heading font-bold gradient-text">
                SportifyPro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-semibold transition-colors whitespace-nowrap ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-muted hover:text-primary'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    layoutId="underline"
                  />
                )}
              </Link>
            ))}
            {user?.role !== 'owner' && (
              <Link
                to="/venues"
                className="btn-glow bg-gradient-primary text-secondary px-4 py-2 lg:px-6 lg:py-2 rounded-full font-bold text-xs lg:text-sm hover:shadow-glow transition"
              >
                Book Now
              </Link>
            )}
            {/* Show logout if authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-accent1 border border-accent1/50 glass hover:border-accent1 transition text-sm"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 text-lg font-semibold ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-neutral'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role !== 'owner' && (
              <Link
                to="/venues"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-glow inline-block bg-gradient-primary text-secondary px-6 py-2 rounded-full font-bold"
              >
                Book Now
              </Link>
            )}
            {/* Show logout if authenticated */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-accent1 border border-accent1/50 glass hover:border-accent1 transition text-lg w-full justify-center"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

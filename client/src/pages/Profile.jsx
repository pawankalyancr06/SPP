import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Star, Settings, LogOut, Building2, DollarSign, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getBookings } from '../api/bookings';
import { getFavorites } from '../api/favorites';
import BookingCard from '../components/ui/BookingCard';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import SettingsPanel from '../components/common/SettingsPanel';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  // Check if we should open settings tab (from Settings button)
  useEffect(() => {
    if (location.state?.openSettings) {
      setActiveTab('settings');
    }
  }, [location]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsData, favoritesData] = await Promise.all([
        getBookings().catch(() => []),
        user?.role === 'user' ? getFavorites().catch(() => []) : Promise.resolve([]),
      ]);
      setBookings(bookingsData);
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats based on user role
  const stats = user?.role === 'owner' 
    ? {
        totalVenues: 0, // Will be fetched from owner dashboard
        totalRevenue: bookings
          .filter(b => b.paymentStatus === 'Completed')
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        upcomingBookings: bookings.filter(b => 
          b.paymentStatus === 'Pending' && new Date(b.date) >= new Date()
        ).length,
      }
    : {
        matchesBooked: bookings.length,
        hoursPlayed: bookings.reduce((sum, b) => sum + (b.duration || 1), 0),
        favoriteVenues: favorites.length,
      };

  // Role-based tabs
  const tabs = user?.role === 'owner'
    ? [
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    : [
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pt-24 flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-20 md:pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 md:py-8">
        {/* Profile Header with colorful gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden glass rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent2/20 to-primary/10 opacity-50 animate-pulse" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <User className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-secondary" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-success rounded-full border-4 border-secondary shadow-lg"></div>
            </div>
            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black gradient-text mb-2">
                {user?.name || 'User'}
              </h1>
              <p className="text-neutral mb-2 text-sm sm:text-base">{user?.email || 'user@example.com'}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                user?.role === 'owner' 
                  ? 'bg-accent2/20 text-accent2' 
                  : user?.role === 'admin'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-success/20 text-success'
              }`}>
                {user?.role?.toUpperCase() || 'USER'}
              </span>
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start mt-4">
                {user?.role === 'owner' ? (
                  <>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="glass-hover rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 border border-primary/30"
                    >
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <DollarSign className="w-5 h-5" />
                        <div className="text-xl sm:text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                      </div>
                      <div className="text-xs sm:text-sm text-neutral">Total Revenue</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="glass-hover rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 border border-accent2/30"
                    >
                      <div className="flex items-center gap-2 text-accent2 mb-1">
                        <Calendar className="w-5 h-5" />
                        <div className="text-xl sm:text-2xl font-bold">{stats.upcomingBookings}</div>
                      </div>
                      <div className="text-xs sm:text-sm text-neutral">Upcoming</div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="glass-hover rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 border border-primary/30"
                    >
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <Calendar className="w-5 h-5" />
                        <div className="text-xl sm:text-2xl font-bold">{stats.matchesBooked}</div>
                      </div>
                      <div className="text-xs sm:text-sm text-neutral">Matches Booked</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="glass-hover rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 border border-accent2/30"
                    >
                      <div className="flex items-center gap-2 text-accent2 mb-1">
                        <TrendingUp className="w-5 h-5" />
                        <div className="text-xl sm:text-2xl font-bold">{stats.hoursPlayed}</div>
                      </div>
                      <div className="text-xs sm:text-sm text-neutral">Hours Played</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="glass-hover rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 border border-success/30"
                    >
                      <div className="flex items-center gap-2 text-success mb-1">
                        <Heart className="w-5 h-5" />
                        <div className="text-xl sm:text-2xl font-bold">{stats.favoriteVenues}</div>
                      </div>
                      <div className="text-xs sm:text-sm text-neutral">Favorites</div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn-glow glass border border-danger/50 text-danger px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold flex items-center gap-2 hover:border-danger transition text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Colorful Tabs */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 rounded-xl font-bold transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-secondary shadow-glow'
                  : 'glass text-neutral hover:text-primary border border-transparent hover:border-primary/30'
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8"
        >
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6 gradient-text">My Bookings</h2>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking, index) => (
                    <motion.div
                      key={booking.id || booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BookingCard booking={booking} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                  <p className="text-neutral text-lg mb-2">No bookings yet</p>
                  <p className="text-muted text-sm mb-6">Start booking venues to see them here</p>
                  {user?.role === 'user' && (
                    <Link
                      to="/venues"
                      className="btn-glow bg-gradient-primary text-secondary px-6 py-3 rounded-xl font-bold hover:shadow-glow inline-block"
                    >
                      Browse Venues
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && user?.role === 'user' && (
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6 gradient-text">Favorite Venues</h2>
              {favorites.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((venue) => (
                    <motion.div
                      key={venue._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass rounded-xl overflow-hidden card-hover"
                    >
                      {venue.images?.[0] && (
                        <img
                          src={venue.images[0]}
                          alt={venue.name}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2">{venue.name}</h3>
                        <p className="text-sm text-neutral mb-4">{venue.location}</p>
                        <Link
                          to={`/venues/${venue._id}`}
                          className="btn-glow bg-gradient-primary text-secondary px-4 py-2 rounded-lg font-bold text-sm hover:shadow-glow inline-block"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                  <p className="text-neutral text-lg mb-2">No favorites yet</p>
                  <p className="text-muted text-sm mb-6">Start exploring venues and add them to your favorites!</p>
                  <Link
                    to="/venues"
                    className="btn-glow bg-gradient-primary text-secondary px-6 py-3 rounded-xl font-bold hover:shadow-glow inline-block"
                  >
                    Browse Venues
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsPanel user={user} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Calendar, DollarSign, Users, Settings, ListFilter, Plus, Filter } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import VenueManagement from '../../components/owner/VenueManagement';
import CreateVenueForm from '../../components/owner/CreateVenueForm';
import { getVenues } from '../../api/venues';
import { getBookings } from '../../api/bookings';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    utilization: 0,
    upcomingBookings: 0,
    totalVenues: 0,
  });
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showCreateVenue, setShowCreateVenue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch owner's venues and bookings
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const [venuesRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/venues?owner=me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const venuesData = await venuesRes.json();
      const bookingsData = await bookingsRes.json();

      setVenues(venuesData);
      setBookings(bookingsData);

      // Calculate stats from real data (will be recalculated with date filter)
      const totalRevenue = bookingsData
        .filter(b => b.paymentStatus === 'Completed')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      
      const totalSlots = venuesData.reduce((sum, v) => sum + (v.slots?.length || 0), 0);
      const bookedSlots = bookingsData.filter(b => b.paymentStatus === 'Completed').length;
      const utilization = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

      const upcomingBookings = bookingsData.filter(b => 
        b.paymentStatus === 'Pending' && new Date(b.date) >= new Date()
      ).length;

      setStats({
        totalRevenue,
        utilization,
        upcomingBookings,
        totalVenues: venuesData.length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueCreated = () => {
    fetchData();
    setShowCreateVenue(false);
  };

  // Filter bookings by date range
  const filteredBookings = React.useMemo(() => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);
      return bookingDate >= start && bookingDate <= end;
    });
  }, [bookings, dateRange]);

  // Generate chart data from filtered bookings
  const revenueData = React.useMemo(() => {
    const monthlyRevenue = {};
    filteredBookings
      .filter(b => b.paymentStatus === 'Completed')
      .forEach(booking => {
        const month = new Date(booking.date).toLocaleDateString('en-US', { month: 'short' });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (booking.totalAmount || 0);
      });
    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));
  }, [filteredBookings]);

  const utilizationData = React.useMemo(() => {
    const totalSlots = venues.reduce((sum, v) => sum + (v.slots?.length || 0), 0);
    const bookedSlots = filteredBookings.filter(b => b.paymentStatus === 'Completed').length;
    const available = Math.max(0, totalSlots - bookedSlots);
    return [
      { name: 'Booked', value: bookedSlots, color: '#FFD400' },
      { name: 'Available', value: available, color: '#1E90FF' },
    ];
  }, [venues, filteredBookings]);

  const bookingsData = React.useMemo(() => {
    const dayCounts = {};
    filteredBookings.forEach(booking => {
      const day = new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({ day, bookings: dayCounts[day] || 0 }));
  }, [filteredBookings]);

  // Recalculate stats with date filter
  const filteredStats = React.useMemo(() => {
    const filteredRevenue = filteredBookings
      .filter(b => b.paymentStatus === 'Completed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    
    const totalSlots = venues.reduce((sum, v) => sum + (v.slots?.length || 0), 0);
    const bookedSlots = filteredBookings.filter(b => b.paymentStatus === 'Completed').length;
    const utilization = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

    const upcomingBookings = filteredBookings.filter(b => 
      b.paymentStatus === 'Pending' && new Date(b.date) >= new Date()
    ).length;

    return {
      totalRevenue: filteredRevenue,
      utilization,
      upcomingBookings,
      totalVenues: venues.length,
    };
  }, [filteredBookings, venues]);

  const dashboardCards = [
    {
      icon: DollarSign,
      title: 'Total Revenue',
      value: `₹${filteredStats.totalRevenue.toLocaleString()}`,
      change: 'Filtered',
      color: 'primary',
    },
    {
      icon: TrendingUp,
      title: 'Turf Utilization',
      value: `${filteredStats.utilization}%`,
      change: 'Filtered',
      color: 'accent2',
    },
    {
      icon: Calendar,
      title: 'Upcoming Bookings',
      value: filteredStats.upcomingBookings,
      change: 'Filtered',
      color: 'accent1',
    },
    {
      icon: Users,
      title: 'Total Venues',
      value: filteredStats.totalVenues,
      change: 'Active',
      color: 'primary',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pt-24 flex items-center justify-center">
        <div className="text-primary text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-heading font-black gradient-text">Owner Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateVenue(true)}
              className="btn-glow bg-gradient-primary text-secondary px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-glow"
            >
              <Plus className="w-5 h-5" />
              Add Venue
            </button>
            <button 
              onClick={() => navigate('/profile', { state: { openSettings: true } })}
              className="btn-glow glass border border-primary/50 text-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:border-primary"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${card.color}/20 flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 text-${card.color}`} />
                </div>
                <span className="text-sm text-neutral">{card.change}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-1">{card.value}</h3>
              <p className="text-sm text-neutral">{card.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Date Range Filter */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-primary" />
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-neutral">From:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="bg-secondary/50 border border-neutral/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-neutral">To:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="bg-secondary/50 border border-neutral/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
                setDateRange({
                  startDate: lastMonth.toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                });
              }}
              className="btn-glow glass border border-primary/50 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:border-primary"
            >
              Last Month
            </button>
            <button
              onClick={() => {
                const today = new Date();
                setDateRange({
                  startDate: today.toISOString().split('T')[0],
                  endDate: today.toISOString().split('T')[0],
                });
              }}
              className="btn-glow glass border border-primary/50 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:border-primary"
            >
              Today
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-heading font-bold mb-6 text-white">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FFD400"
                  strokeWidth={3}
                  dot={{ fill: '#FFD400', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Utilization Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-heading font-bold mb-6 text-white">Turf Utilization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={utilizationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {utilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Bookings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-heading font-bold mb-6 text-white">Weekly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="bookings" fill="#00FF87" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Venue Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
              <ListFilter className="w-6 h-6" />
              Manage Your Venues
            </h2>
          </div>
          <VenueManagement onVenueUpdate={fetchData} />
        </motion.div>
      </div>

      {showCreateVenue && (
        <CreateVenueForm
          onClose={() => setShowCreateVenue(false)}
          onSuccess={handleVenueCreated}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;

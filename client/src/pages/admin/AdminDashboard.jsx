import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, XCircle, Search, Calendar, DollarSign, Users } from 'lucide-react';
import { approveVenue } from '../../api/venues';

const AdminDashboard = () => {
  const [pendingVenues, setPendingVenues] = useState([]);
  const [approvedVenues, setApprovedVenues] = useState([]);
  const [stats, setStats] = useState({
    totalVenues: 0,
    pendingVenues: 0,
    approvedVenues: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // Fetch all venues
      const [allVenuesRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/venues`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const allVenues = await allVenuesRes.json();
      const bookings = await bookingsRes.json();

      const pending = allVenues.filter(v => !v.isApproved);
      const approved = allVenues.filter(v => v.isApproved);

      setPendingVenues(pending);
      setApprovedVenues(approved);

      // Calculate stats
      const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'Completed')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      setStats({
        totalVenues: allVenues.length,
        pendingVenues: pending.length,
        approvedVenues: approved.length,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (venueId) => {
    try {
      await approveVenue(venueId);
      await fetchData();
    } catch (error) {
      alert('Failed to approve venue. Please try again.');
    }
  };

  const handleReject = async (venueId) => {
    if (!window.confirm('Are you sure you want to reject this venue?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/venues/${venueId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to reject venue');
      await fetchData();
    } catch (error) {
      alert('Failed to reject venue. Please try again.');
    }
  };

  const filteredPending = pendingVenues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pt-24 flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-heading font-black gradient-text mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-bold text-white mb-1">{stats.totalVenues}</h3>
            <p className="text-sm text-neutral">Total Venues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent2/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent2" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-bold text-white mb-1">{stats.pendingVenues}</h3>
            <p className="text-sm text-neutral">Pending Approval</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-bold text-white mb-1">{stats.approvedVenues}</h3>
            <p className="text-sm text-neutral">Approved Venues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-bold text-white mb-1">
              ₹{(stats.totalRevenue / 100000).toFixed(1)}L
            </h3>
            <p className="text-sm text-neutral">Total Revenue</p>
          </motion.div>
        </div>

        {/* Pending Venues for Approval */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-white">Pending Venue Approvals</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral w-5 h-5" />
              <input
                type="text"
                placeholder="Search venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-2 text-white placeholder-neutral focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {filteredPending.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral text-lg">No pending venues for approval</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPending.map((venue) => (
                <motion.div
                  key={venue._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-6"
                >
                  {venue.images && venue.images.length > 0 && (
                    <img
                      src={venue.images[0]}
                      alt={venue.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{venue.name}</h3>
                  <p className="text-neutral text-sm mb-2">{venue.location}</p>
                  <p className="text-xs text-primary mb-4">{venue.sport}</p>
                  {venue.description && (
                    <p className="text-xs text-muted mb-4 line-clamp-2">{venue.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(venue._id)}
                      className="flex-1 btn-glow bg-gradient-primary text-secondary py-2 rounded-lg font-bold text-sm hover:shadow-glow"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(venue._id)}
                      className="flex-1 glass border border-danger/50 text-danger py-2 rounded-lg font-bold text-sm hover:border-danger"
                    >
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

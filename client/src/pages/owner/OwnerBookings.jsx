import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { getBookings } from '../../api/bookings';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-primary';
      case 'Failed':
        return 'text-danger';
      case 'Pending':
        return 'text-muted';
      default:
        return 'text-neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'Failed':
        return <XCircle className="w-5 h-5 text-danger" />;
      default:
        return <Clock className="w-5 h-5 text-neutral" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pt-24 flex items-center justify-center">
        <div className="text-primary text-xl">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-heading font-black gradient-text mb-2">
            Bookings Management
          </h1>
          <p className="text-neutral">Manage all bookings for your venues</p>
        </motion.div>

        {bookings.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-neutral mx-auto mb-4 opacity-50" />
            <p className="text-neutral text-lg mb-2">No bookings yet</p>
            <p className="text-neutral text-sm">Bookings for your venues will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id || booking.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-neutral/20 hover:border-primary/50 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-heading font-bold text-neutral">
                        {booking.venue?.name || 'Venue'}
                      </h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(booking.paymentStatus)}
                        <span className={`text-sm font-bold ${getStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-neutral">
                        <User className="w-4 h-4" />
                        <span>{booking.user?.name || 'User'}</span>
                        <span className="text-muted">({booking.user?.email})</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral">
                        <Clock className="w-4 h-4" />
                        <span>
                          {booking.slot?.startTime || booking.startTime} - {booking.slot?.endTime || booking.endTime}
                        </span>
                      </div>
                      {booking.venue?.location && (
                        <div className="flex items-center gap-2 text-neutral">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.venue.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-2">
                      ₹{booking.totalAmount || 0}
                    </div>
                    <p className="text-xs text-neutral">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;


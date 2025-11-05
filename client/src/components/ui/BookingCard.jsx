import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

const BookingCard = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-primary';
      case 'cancelled':
        return 'text-danger';
      case 'completed':
        return 'text-accent2';
      default:
        return 'text-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-accent1" />;
      default:
        return <Clock className="w-5 h-5 text-neutral" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-xl p-6 border border-neutral/20 hover:border-primary/50 transition"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-heading font-bold text-neutral">
              {booking.venueName || booking.venue?.name || 'Venue'}
            </h3>
            <div className="flex items-center gap-1">
              {getStatusIcon(booking.status)}
              <span className={`text-sm font-bold ${getStatusColor(booking.status)}`}>
                {booking.status?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral">
              <Calendar className="w-4 h-4" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral">
              <Clock className="w-4 h-4" />
              <span>
                {booking.startTime} - {booking.endTime}
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
          {booking.status === 'confirmed' && (
            <button className="btn-glow glass border border-danger/50 text-danger px-4 py-2 rounded-lg text-sm font-bold hover:border-danger">
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;

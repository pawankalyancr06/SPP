import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock } from 'lucide-react';

const VenueCard = ({ venue }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass rounded-2xl overflow-hidden card-hover group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-bold text-white">{venue.rating}</span>
        </div>
        {venue.sport && (
          <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-primary">{venue.sport}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold mb-2 text-white group-hover:text-primary transition-colors">
          {venue.name}
        </h3>
        <div className="flex items-center gap-2 text-neutral mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{venue.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary mb-1">
              ₹{venue.price}
              <span className="text-sm text-neutral font-normal">/hour</span>
            </p>
          </div>
          <Link
            to={`/venues/${venue.id}`}
            className="btn-glow bg-gradient-primary text-secondary px-6 py-2 rounded-full font-bold text-sm hover:shadow-glow"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default VenueCard;

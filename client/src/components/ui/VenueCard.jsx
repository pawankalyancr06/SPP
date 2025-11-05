import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock } from 'lucide-react';

const VenueCard = ({ venue }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass rounded-xl md:rounded-2xl overflow-hidden card-hover group"
    >
      {/* Image */}
      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,20,40,0.7)] via-transparent to-transparent opacity-80" />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 glass px-2 py-1 sm:px-3 sm:py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary" />
          <span className="text-xs sm:text-sm font-bold text-neutral">{venue.rating}</span>
        </div>
        {venue.sport && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 glass px-2 py-1 sm:px-3 sm:py-1 rounded-full">
            <span className="text-xs font-bold text-primary">{venue.sport}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl font-heading font-bold mb-2 text-neutral group-hover:text-primary transition-colors line-clamp-1">
          {venue.name}
        </h3>
        <div className="flex items-center gap-2 text-muted mb-3 md:mb-4">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm line-clamp-1">{venue.location}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-shrink-0">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
              ₹{venue.price}
              <span className="text-xs sm:text-sm text-neutral font-normal">/hour</span>
            </p>
          </div>
          <Link
            to={`/venues/${venue.id}`}
            className="btn-glow bg-gradient-primary text-secondary px-4 py-2 sm:px-5 sm:py-2 md:px-6 rounded-full font-bold text-xs sm:text-sm hover:shadow-glow transition flex-shrink-0"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default VenueCard;

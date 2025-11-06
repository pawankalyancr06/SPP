import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star } from 'lucide-react';
import { getFavorites } from '../api/favorites';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      // Filter only approved venues
      const approvedFavorites = data.filter(v => v.isApproved);
      setFavorites(approvedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pt-24 flex items-center justify-center">
        <div className="text-primary text-xl">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-4xl font-heading font-black gradient-text">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-neutral text-xl mb-2">No favorites yet</p>
            <p className="text-muted text-sm mb-6">Start exploring venues and add them to your favorites!</p>
            <Link
              to="/venues"
              className="btn-glow bg-gradient-primary text-secondary px-6 py-3 rounded-xl font-bold hover:shadow-glow inline-block"
            >
              Browse Venues
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((venue) => (
              <motion.div
                key={venue._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl overflow-hidden card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={venue.images?.[0] || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-bold text-neutral">4.5</span>
                  </div>
                  {venue.sport && (
                    <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-primary">{venue.sport}</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-2 text-neutral group-hover:text-primary transition-colors">
                    {venue.name}
                  </h3>
                  <div className="flex items-center gap-2 text-muted mb-4">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{venue.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-primary">
                      ₹{venue.slots?.length > 0 
                        ? Math.round(venue.slots.reduce((sum, slot) => sum + slot.price, 0) / venue.slots.length)
                        : 2000}
                      <span className="text-sm text-neutral font-normal">/hour</span>
                    </p>
                    <Link
                      to={`/venues/${venue._id}`}
                      className="btn-glow bg-gradient-primary text-secondary px-5 py-2 rounded-full font-bold text-sm hover:shadow-glow transition"
                    >
                      View Details
                    </Link>
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

export default Favorites;


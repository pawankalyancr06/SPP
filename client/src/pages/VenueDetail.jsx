import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Calendar, Users, Phone, Heart } from 'lucide-react';
import { getVenueById } from '../api/venues';
import BookingModal from '../components/ui/BookingModal';
import { useAuth } from '../contexts/AuthContext';
import { addFavorite, removeFavorite, checkFavorite } from '../api/favorites';

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetchVenue();
  }, [id]);

  useEffect(() => {
    if (venue && user?.role === 'user') {
      checkFavorite(venue._id || venue.id).then(setIsFavorited).catch(() => setIsFavorited(false));
    }
  }, [venue, user]);

  const handleFavorite = async () => {
    if (!user || user.role !== 'user' || !venue) return;

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(venue._id || venue.id);
        setIsFavorited(false);
      } else {
        await addFavorite(venue._id || venue.id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const fetchVenue = async () => {
    try {
      const data = await getVenueById(id);
      // Normalize venue data: ensure _id and id exist, add price from slots
      const normalizedVenue = {
        ...data,
        id: data._id || data.id,
        _id: data._id || data.id,
        price: data.slots?.length > 0 
          ? data.slots.reduce((sum, slot) => sum + slot.price, 0) / data.slots.length 
          : data.price || 2000,
        rating: data.rating || 4.5,
        image: data.images?.[0] || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        description: data.description || 'Premium sports venue with top-notch facilities',
        amenities: data.amenities || ['Parking', 'Changing Rooms', 'Water Facility', 'Lighting'],
      };
      setVenue(normalizedVenue);
    } catch (error) {
      console.error('Error fetching venue:', error);
      setVenue(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pt-24 flex items-center justify-center">
        <div className="text-primary text-2xl">Loading...</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-secondary pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral text-2xl mb-4">Venue not found</p>
          <button
            onClick={() => navigate('/venues')}
            className="btn-glow bg-gradient-primary text-secondary px-6 py-2 rounded-full font-bold"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-20 md:pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 md:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/venues')}
          className="text-primary mb-4 md:mb-6 hover:text-accent2 transition text-sm sm:text-base"
        >
          ← Back to Venues
        </button>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl md:rounded-2xl overflow-hidden"
          >
            <img
              src={venue.image}
              alt={venue.name}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black gradient-text">
                  {venue.name}
                </h1>
                {user?.role === 'user' && (
                  <button
                    onClick={handleFavorite}
                    disabled={favoriteLoading}
                    className={`glass p-2 sm:p-3 rounded-full transition ${
                      isFavorited ? 'text-danger' : 'text-neutral hover:text-danger'
                    }`}
                  >
                    <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFavorited ? 'fill-danger' : ''}`} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-neutral mb-4 text-sm sm:text-base">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>{venue.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary flex-shrink-0" />
                  <span className="font-bold">{venue.rating}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  ₹{venue.price}
                  <span className="text-base sm:text-lg text-neutral font-normal">/hour</span>
                </span>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="btn-glow bg-gradient-primary text-secondary px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-glow transition w-full sm:w-auto"
                >
                  Book Now
                </button>
              </div>
            </div>

            <div className="glass rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold mb-3 md:mb-4">About</h3>
              <p className="text-neutral text-sm sm:text-base">{venue.description || 'Premium sports venue with top-notch facilities'}</p>
            </div>

            <div className="glass rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold mb-3 md:mb-4">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {venue.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-neutral text-sm sm:text-base">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold mb-3 md:mb-4">Available Time Slots</h3>
              {venue.slots && venue.slots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {venue.slots.map((slot, index) => (
                    <div
                      key={slot._id || index}
                      className="glass rounded-lg p-3 text-center border border-neutral/20 hover:border-primary/50 transition"
                    >
                      <div className="text-sm font-bold text-primary mb-1">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="text-xs text-neutral">₹{slot.price}/hr</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral text-sm">No slots available. Please contact the owner.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          venue={venue}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default VenueDetail;

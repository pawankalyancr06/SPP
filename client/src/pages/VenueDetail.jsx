import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Calendar, Users, Phone } from 'lucide-react';
import { getVenueById } from '../api/venues';
import BookingModal from '../components/ui/BookingModal';

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenue();
  }, [id]);

  const fetchVenue = async () => {
    try {
      const data = await getVenueById(id);
      setVenue(data);
    } catch (error) {
      console.error('Error fetching venue:', error);
      // Fallback mock data
      setVenue({
        id: 1,
        name: 'Elite Football Turf',
        location: 'Mumbai',
        price: 2500,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        sport: 'Football',
        description: 'Premium football turf with professional-grade facilities',
        amenities: ['Parking', 'Changing Rooms', 'Water Facility', 'Lighting'],
        capacity: 22,
        availableSlots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00'],
      });
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
    <div className="min-h-screen bg-secondary pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/venues')}
          className="text-primary mb-6 hover:text-accent2 transition"
        >
          ← Back to Venues
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <img
              src={venue.image}
              alt={venue.name}
              className="w-full h-96 object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-heading font-black mb-2 gradient-text">
                {venue.name}
              </h1>
              <div className="flex items-center gap-4 text-neutral mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{venue.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-bold">{venue.rating}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-primary">
                  ₹{venue.price}
                  <span className="text-lg text-neutral font-normal">/hour</span>
                </span>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="btn-glow bg-gradient-primary text-secondary px-8 py-3 rounded-full font-bold hover:shadow-glow"
                >
                  Book Now
                </button>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-heading font-bold mb-4">About</h3>
              <p className="text-neutral">{venue.description || 'Premium sports venue with top-notch facilities'}</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-heading font-bold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {venue.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-neutral">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-6 text-neutral">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Capacity: {venue.capacity || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Available Slots</span>
                </div>
              </div>
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

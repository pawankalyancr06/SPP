import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Star, SlidersHorizontal } from 'lucide-react';
import VenueCard from '../components/ui/VenueCard';
import { getVenues } from '../api/venues';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sport: '',
    priceRange: '',
    rating: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [searchTerm, filters, venues]);

  const fetchVenues = async () => {
    try {
      // Fetch only approved venues for regular users
      const data = await getVenues();
      // Normalize data: ensure _id and id exist, add price from slots if needed
      const normalizedVenues = data.map(venue => ({
        ...venue,
        id: venue._id || venue.id,
        // Calculate average price from slots or use a default
        price: venue.slots?.length > 0 
          ? venue.slots.reduce((sum, slot) => sum + slot.price, 0) / venue.slots.length 
          : venue.price || 2000,
        rating: venue.rating || 4.5,
        image: venue.images?.[0] || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      }));
      setVenues(normalizedVenues);
      setFilteredVenues(normalizedVenues);
    } catch (error) {
      console.error('Error fetching venues:', error);
      setVenues([]);
      setFilteredVenues([]);
    }
  };

  const filterVenues = () => {
    let filtered = [...venues];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sport filter
    if (filters.sport) {
      filtered = filtered.filter((venue) => venue.sport === filters.sport);
    }

    // Price filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter((venue) => {
        if (max) {
          return venue.price >= min && venue.price <= max;
        }
        return venue.price >= min;
      });
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter((venue) => venue.rating >= Number(filters.rating));
    }

    setFilteredVenues(filtered);
  };

  const sports = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Volleyball'];

  return (
    <div className="min-h-screen bg-secondary pt-20 md:pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 md:py-8">
        {/* Header with colorful gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent2/10 to-primary/10 rounded-2xl blur-3xl" />
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black mb-3">
              <span className="gradient-text">Discover</span> <span className="text-white">Venues</span>
            </h1>
            <p className="text-neutral text-sm sm:text-base md:text-lg">Find the perfect sports venue for your game</p>
          </div>
        </motion.div>

        {/* Search and Filter Bar with colorful border */}
        <div className="glass rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 mb-6 md:mb-8 border-2 border-primary/30 shadow-lg shadow-primary/10">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral w-5 h-5" />
              <input
                type="text"
                placeholder="Search venues by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-glow glass border border-primary/50 text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:border-primary"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-neutral/20 grid md:grid-cols-3 gap-4"
            >
              {/* Sport Filter */}
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Sport Type</label>
                <select
                  value={filters.sport}
                  onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
                  className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">All Sports</option>
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">All Prices</option>
                  <option value="0-1500">₹0 - ₹1,500</option>
                  <option value="1500-2500">₹1,500 - ₹2,500</option>
                  <option value="2500-3500">₹2,500 - ₹3,500</option>
                  <option value="3500-">₹3,500+</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.0">4.0+ ⭐</option>
                  <option value="3.5">3.5+ ⭐</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count with colorful badge */}
        <div className="mb-4 md:mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-primary/30"
          >
            <span className="text-neutral text-sm sm:text-base">
              Found <span className="text-primary font-bold text-lg">{filteredVenues.length}</span> venues
            </span>
            {filteredVenues.length > 0 && (
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            )}
          </motion.div>
        </div>

        {/* Venues Grid */}
        {filteredVenues.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredVenues.map((venue, index) => (
              <motion.div
                key={venue._id || venue.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VenueCard venue={venue} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-neutral mb-4">No venues found</p>
            <p className="text-neutral">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;

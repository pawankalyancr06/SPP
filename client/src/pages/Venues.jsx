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
      const data = await getVenues();
      setVenues(data);
      setFilteredVenues(data);
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Fallback to mock data
      const mockVenues = [
        {
          id: 1,
          name: 'Elite Football Turf',
          location: 'Mumbai',
          price: 2500,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
          sport: 'Football',
        },
        {
          id: 2,
          name: 'Cricket Arena Pro',
          location: 'Delhi',
          price: 3000,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
          sport: 'Cricket',
        },
        {
          id: 3,
          name: 'Basketball Court Hub',
          location: 'Bangalore',
          price: 2000,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
          sport: 'Basketball',
        },
        {
          id: 4,
          name: 'Tennis Pro Center',
          location: 'Chennai',
          price: 3500,
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1622163642992-8f44d9b6d5a4?w=800',
          sport: 'Tennis',
        },
        {
          id: 5,
          name: 'Badminton Excellence',
          location: 'Hyderabad',
          price: 1500,
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
          sport: 'Badminton',
        },
        {
          id: 6,
          name: 'Volleyball Arena',
          location: 'Pune',
          price: 1800,
          rating: 4.4,
          image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
          sport: 'Volleyball',
        },
      ];
      setVenues(mockVenues);
      setFilteredVenues(mockVenues);
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
    <div className="min-h-screen bg-secondary pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-heading font-black mb-4">
            <span className="gradient-text">Discover</span> Venues
          </h1>
          <p className="text-neutral text-lg">Find the perfect sports venue for your game</p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-neutral">
            Found <span className="text-primary font-bold">{filteredVenues.length}</span> venues
          </p>
        </div>

        {/* Venues Grid */}
        {filteredVenues.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue, index) => (
              <motion.div
                key={venue.id}
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Calendar, TrendingUp, Users, Trophy } from 'lucide-react';
import VenueCard from '../components/ui/VenueCard';

const Home = () => {
  const [venues, setVenues] = useState([]);

  // Mock data - will be replaced with API call
  useEffect(() => {
    // Simulate API call
    setVenues([
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
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background Placeholder - Replace with actual video */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary to-accent2/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920')] bg-cover bg-center opacity-20"></div>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl md:text-9xl font-heading font-black mb-6"
          >
            <span className="gradient-text">FIND.</span>{' '}
            <span className="text-white">BOOK.</span>{' '}
            <span className="gradient-text">PLAY.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral mb-12 max-w-2xl mx-auto"
          >
            Your game, your turf — anytime, anywhere.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link
              to="/venues"
              className="btn-glow bg-gradient-primary text-secondary px-8 py-4 rounded-full font-bold text-lg hover:shadow-glow"
            >
              Explore Venues
            </Link>
            <Link
              to="/signup"
              className="btn-glow glass border-2 border-primary text-primary px-8 py-4 rounded-full font-bold text-lg hover:border-accent2 hover:text-accent2"
            >
              Join as Owner
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Venue Showcase */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-black mb-4">
              <span className="gradient-text">Featured</span> Venues
            </h2>
            <p className="text-neutral text-lg">Discover top-rated sports venues near you</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue, index) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <VenueCard venue={venue} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/venues"
              className="btn-glow inline-block bg-gradient-primary text-secondary px-8 py-3 rounded-full font-bold text-lg hover:shadow-glow"
            >
              View All Venues
            </Link>
          </div>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-black mb-4">
              <span className="gradient-text">Community</span> Highlights
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'Active Tournaments', value: '12', color: 'primary' },
              { icon: Users, title: 'Players Registered', value: '2.5K+', color: 'accent2' },
              { icon: Trophy, title: 'Matches Played', value: '500+', color: 'accent1' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl p-8 text-center card-hover"
              >
                <stat.icon className={`w-12 h-12 mx-auto mb-4 text-${stat.color}`} />
                <h3 className="text-4xl font-heading font-bold mb-2 gradient-text">
                  {stat.value}
                </h3>
                <p className="text-neutral">{stat.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

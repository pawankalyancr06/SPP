import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const FloatingButton = () => {
  return (
    <Link to="/venues">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-primary rounded-full shadow-neon flex items-center justify-center hover:shadow-glow transition"
      >
        <Play className="w-8 h-8 text-secondary" fill="currentColor" />
      </motion.button>
    </Link>
  );
};

export default FloatingButton;


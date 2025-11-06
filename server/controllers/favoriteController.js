const User = require('../models/User');
const Venue = require('../models/Venue');

// Add venue to favorites
const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const venue = await Venue.findById(req.params.venueId);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (user.favorites.includes(req.params.venueId)) {
      return res.status(400).json({ message: 'Venue already in favorites' });
    }

    user.favorites.push(req.params.venueId);
    await user.save();

    res.status(200).json({ message: 'Venue added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add favorite', error: error.message });
  }
};

// Remove venue from favorites
const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(req.params.venueId)) {
      return res.status(400).json({ message: 'Venue not in favorites' });
    }

    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.venueId
    );
    await user.save();

    res.status(200).json({ message: 'Venue removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove favorite', error: error.message });
  }
};

// Get user's favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: error.message });
  }
};

// Check if venue is favorited
const checkFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isFavorited = user.favorites.some(
      fav => fav.toString() === req.params.venueId
    );
    res.status(200).json({ isFavorited });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check favorite', error: error.message });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
};


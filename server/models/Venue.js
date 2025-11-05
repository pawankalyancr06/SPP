// Venue model

const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [String],
  amenities: [String],
  capacity: Number,
  availableSlots: [Date],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Venue', venueSchema);


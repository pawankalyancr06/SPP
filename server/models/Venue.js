const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true }, // e.g., "09:00"
    endTime: { type: String, required: true },   // e.g., "10:00"
    price: { type: Number, required: true },
});

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    sport: { type: String, enum: ['Badminton', 'Football', 'Cricket', 'Gym'], required: true },
    description: { type: String },
    slots: [timeSlotSchema],
    isApproved: { type: Boolean, default: false }, // For admin approval
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);
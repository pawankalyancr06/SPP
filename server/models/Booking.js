const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    slot: {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
    },
    date: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    razorpayOrderId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
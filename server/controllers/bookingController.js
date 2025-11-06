// Booking controller

const Booking = require('../models/Booking');
const Venue = require('../models/Venue');

// Get all bookings (admin: all, owner: their venues, user: their bookings)
const getBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'user') {
      filter.user = req.user._id;
    } else if (req.user.role === 'owner') {
      // Find venues owned by this owner
      const venues = await Venue.find({ owner: req.user._id }).select('_id');
      filter.venue = { $in: venues.map(v => v._id) };
    }
    const bookings = await Booking.find(filter).populate('user', 'name email').populate('venue', 'name location');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// Get booking by ID (user/owner/admin)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email').populate('venue', 'name location');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Only user, owner of venue, or admin can view
    if (
      req.user.role !== 'admin' &&
      booking.user.toString() !== req.user._id.toString() &&
      (!booking.venue.owner || booking.venue.owner.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
};

// Create booking (user)
const createBooking = async (req, res) => {
  try {
    const { venue: venueId, date, slot, totalAmount } = req.body;
    if (!venueId || !date || !slot || !slot.startTime || !slot.endTime || !totalAmount) {
      return res.status(400).json({ message: 'Venue, date, slot, and totalAmount are required.' });
    }
    // Check for slot conflict
    const conflict = await Booking.findOne({
      venue: venueId,
      date: new Date(date),
      'slot.startTime': slot.startTime,
      'slot.endTime': slot.endTime,
    });
    if (conflict) {
      return res.status(409).json({ message: 'Slot already booked for this time.' });
    }
    const booking = await Booking.create({
      user: req.user._id,
      venue: venueId,
      date: new Date(date),
      slot,
      totalAmount,
      paymentStatus: 'Pending',
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// Update booking (user can update their own, admin can update any)
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
    Object.assign(booking, req.body);
    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking', error: error.message });
  }
};

// Cancel booking (user can cancel their own, admin can cancel any)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    booking.paymentStatus = 'Failed';
    await booking.save();
    res.status(200).json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
};


// Booking routes

const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, getBookings);
router.get('/:id', authenticate, getBookingById);
router.post('/', authenticate, createBooking);
router.put('/:id', authenticate, updateBooking);
router.delete('/:id', authenticate, cancelBooking);

module.exports = router;


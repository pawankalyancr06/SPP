// Venue routes

const express = require('express');
const router = express.Router();
const {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  approveVenue,
  rejectVenue,
  addSlot,
  deleteSlot,
} = require('../controllers/venueController');
const { authenticate, authorize, optionalAuth } = require('../middlewares/authMiddleware');
const { uploadImages } = require('../controllers/uploadController');

// Public route but supports ?owner=me which requires auth (handled in controller)
router.get('/', optionalAuth, getVenues); // Supports ?approved=true and ?owner=me (requires auth)
router.get('/:id', getVenueById);
router.post('/', authenticate, authorize('owner', 'admin'), uploadImages, createVenue);
router.put('/:id', authenticate, authorize('owner', 'admin'), updateVenue);
router.delete('/:id', authenticate, authorize('owner', 'admin'), deleteVenue);
router.patch('/:id/approve', authenticate, authorize('owner', 'admin'), approveVenue);
router.patch('/:id/reject', authenticate, authorize('admin'), rejectVenue);
// Slot management routes
router.post('/:id/slots', authenticate, authorize('owner', 'admin'), addSlot);
router.delete('/:id/slots/:slotId', authenticate, authorize('owner', 'admin'), deleteSlot);

module.exports = router;


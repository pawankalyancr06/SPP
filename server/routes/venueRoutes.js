// Venue routes

const express = require('express');
const router = express.Router();
const {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
} = require('../controllers/venueController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', getVenues);
router.get('/:id', getVenueById);
router.post('/', authenticate, authorize('owner', 'admin'), createVenue);
router.put('/:id', authenticate, authorize('owner', 'admin'), updateVenue);
router.delete('/:id', authenticate, authorize('owner', 'admin'), deleteVenue);

module.exports = router;


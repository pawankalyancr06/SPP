const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} = require('../controllers/favoriteController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// All favorite routes require authentication and user role
router.use(authenticate, authorize('user'));

router.get('/', getFavorites);
router.post('/:venueId', addFavorite);
router.delete('/:venueId', removeFavorite);
router.get('/check/:venueId', checkFavorite);

module.exports = router;


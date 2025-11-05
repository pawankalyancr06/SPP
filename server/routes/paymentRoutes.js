// Payment routes

const express = require('express');
const router = express.Router();
const { createPayment, verifyPayment } = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/create', authenticate, createPayment);
router.post('/verify', authenticate, verifyPayment);

module.exports = router;


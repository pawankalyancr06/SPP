// Authentication routes

const express = require('express');
const router = express.Router();
const { register, login, logout, verifyEmail, resendVerification, devVerifyUser } = require('../controllers/authController');


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
// Dev mode endpoint to manually verify users
router.post('/dev/verify-user', devVerifyUser);

module.exports = router;


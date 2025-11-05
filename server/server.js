require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logger for development

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/venues', require('./routes/venueRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Simple health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the SportifyPro API!' });
});

// Custom Error Handler Middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is fired up on port ${PORT}`);
});
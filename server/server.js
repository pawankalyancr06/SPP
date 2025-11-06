require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Fail fast on critical env misconfigurations
if (!process.env.JWT_SECRET) {
    console.warn('[Startup] JWT_SECRET is not set. Set it in server/.env to enable auth.');
}

// Development mode indicator
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.log('🔧 Running in DEVELOPMENT mode');
    console.log('   - Auto-verification enabled when SMTP not configured');
    console.log('   - Verification URLs will be logged to console');
}

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Core Middlewares
app.use(cors({
    origin: [
        'http://localhost:5173', // Vite default
        'http://localhost:3000', // React default
        'http://localhost:5001', // API self
    ],
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev')); // Logger for development

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/venues', require('./routes/venueRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));

// Simple health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the SportifyPro API!' });
});

// Custom Error Handler Middleware (must be last)
app.use(errorHandler);

const DEFAULT_PORT = parseInt(process.env.PORT || '5000', 10);

function startServer(port, attemptsLeft = 5) {
    const server = app.listen(port, () => {
        console.log(`Server is fired up on port ${port}`);
    });

    server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
            const nextPort = port + 1;
            console.warn(`Port ${port} in use, retrying on ${nextPort}...`);
            startServer(nextPort, attemptsLeft - 1);
        } else {
            throw err;
        }
    });
}

startServer(DEFAULT_PORT);
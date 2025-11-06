const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and attach to request object
            // We exclude the password from being attached
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Proceed to the next middleware or controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Grant access to specific roles
const owner = (req, res, next) => {
    if (req.user && req.user.role === 'owner') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an owner' });
    }
};

// Alias to keep route imports consistent
const authenticate = protect;

// Generic authorize middleware for roles
const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, no user' });
    }

    // Allow if user role is admin or one of the allowed roles
    if (req.user.role === 'admin' || roles.includes(req.user.role)) {
        return next();
    }

    return res.status(403).json({ message: 'Not authorized for this action' });
};

// Optional authentication - doesn't fail if no token, but sets req.user if token is valid
const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            // Silently fail - user is not authenticated but can still access public routes
            req.user = null;
        }
    }
    next();
};

module.exports = { protect, owner, authenticate, authorize, optionalAuth };
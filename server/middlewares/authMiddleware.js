// Authentication middleware

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Authentication logic
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Authorization logic
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};


const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
  headers: true,
});

module.exports = rateLimiter;

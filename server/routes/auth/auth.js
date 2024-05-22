const express = require('express');
const router = express.Router();
const adminAuthRoutes = require('./adminAuth');
const customerAuthRoutes = require('./customerAuth');
const { handleRefreshToken } = require('../../controllers/auth/refreshTokenController');

// admin auth routes
router.use('/admin', adminAuthRoutes);
router.use('/customer', customerAuthRoutes);

router.post('/refresh-token', handleRefreshToken);

module.exports = router;

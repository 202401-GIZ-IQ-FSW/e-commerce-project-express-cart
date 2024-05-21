const express = require('express');
const router = express.Router();
const adminAuthRoutes = require('./adminAuth');
const customerAuthRoutes = require('./customerAuth');

// admin auth routes
router.use('/admin', adminAuthRoutes);
router.use('/customer', customerAuthRoutes);

module.exports = router;

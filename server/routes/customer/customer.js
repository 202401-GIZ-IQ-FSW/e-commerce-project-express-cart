const express = require('express');
const router = express.Router();
const cartRoutes = require('./cart');
const { handleCheckout, getCustomerOrders } = require('../../controllers/customerController');

// cart routes
router.use('/', cartRoutes);

// customer routes
router.post('/checkout', handleCheckout);
router.get('/orders', getCustomerOrders);

module.exports = router;

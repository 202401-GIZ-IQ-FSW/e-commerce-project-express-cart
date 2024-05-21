const express = require('express');
const router = express.Router();
const cartRoutes = require('./cart');
const customerAuthRoutes = require('./custonerAuth');

const {
  handleCheckout,
  getCustomerOrders,
  getCustomerProfile,
  updateCustomerProfile,
} = require('../../controllers/customerController');

// customer auth routes
router.use('/auth', customerAuthRoutes);

// customer cart routes
router.use('/cart', cartRoutes);

// customer functionalities routes
router.post('/checkout', handleCheckout);
router.get('/orders', getCustomerOrders);
router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);

module.exports = router;

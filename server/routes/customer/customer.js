const express = require('express');
const router = express.Router();
const cartRoutes = require('./cart');
const {
  handleCheckout,
  getCustomerOrders,
  getCustomerProfile,
  updateCustomerProfile,
} = require('../../controllers/customerController');

// cart routes
router.use('/cart', cartRoutes);

// customer routes
router.post('/checkout', handleCheckout);
router.get('/orders', getCustomerOrders);
router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);

module.exports = router;

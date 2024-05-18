const express = require('express');
const router = express.Router();

const {
  addToCart,
  handleCheckout,
  removeFromCart,
  getCustomerCart,
  getCustomerOrders,
} = require('../controllers/cartController');

router.post('/cart', addToCart);
router.delete('/cart', removeFromCart);
router.get('/cart/:customerId', getCustomerCart);
router.post('/checkout', handleCheckout);
router.get('/:customerId/orders', getCustomerOrders);

module.exports = router;

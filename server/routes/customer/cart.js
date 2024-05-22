const express = require('express');
const router = express.Router();
const {
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
} = require('../../controllers/customer/cartController');

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/', removeFromCart);
router.put('/', updateCart);

module.exports = router;

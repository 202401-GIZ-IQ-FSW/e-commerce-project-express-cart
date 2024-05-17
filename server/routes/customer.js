const express = require('express');
const router = express.Router();

const { addToCart, handleCheckout, removeFromCart } = require('../controllers/cartController');

router.post('/cart', addToCart);
router.delete('/cart', removeFromCart);
router.post('/checkout', handleCheckout);

module.exports = router;

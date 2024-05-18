const express = require('express');
const router = express.Router();
const { addToCart, updateCart, removeFromCart, getCart } = require('../../controllers/cartController');

router.get('/:customerId/cart', getCart);
router.post('/cart', addToCart);
router.delete('/cart', removeFromCart);
router.put('/cart', updateCart);

module.exports = router;

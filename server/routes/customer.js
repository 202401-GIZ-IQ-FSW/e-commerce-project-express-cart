const express = require('express');
const { getAllShopItems, searchShopItems } = require('../controllers/adminController');
const { addToCart } = require('../controllers/customerController');
const router = express.Router();

// Get and search for shop items (same as /admin, using same functions)
router.get('/', getAllShopItems);
router.get('/search', searchShopItems);

router.post('/cart', addToCart);

module.exports = router;

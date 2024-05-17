const express = require('express');
const { getAllShopItems, searchShopItems, filterShopItems } = require('../controllers/adminController');
const { addToCart } = require('../controllers/customerController');
const router = express.Router();

// Get all, search and filter shop items are the same as /admin, using the same functions
router.get('/', getAllShopItems);
router.get('/search', searchShopItems);
router.get('/filter', filterShopItems);

router.post('/cart', addToCart);

module.exports = router;

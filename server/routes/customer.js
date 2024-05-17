const express = require('express');
const {
  getAllShopItems,
  searchShopItems,
  filterShopItems,
  getShopItemById,
} = require('../controllers/adminController');
const {
  registerCustomer,
  addToCart,
  handleCheckout,
  removeFromCart,
} = require('../controllers/customerController');
const router = express.Router();

// Get all, search and filter shop items are the same as /admin, using the same functions
router.get('/shop-items', getAllShopItems);
router.get('/shop-items/:id', getShopItemById);
router.get('/shop-items/search', searchShopItems);
router.get('/shop-items/filter', filterShopItems);

router.post('/register', registerCustomer);
router.post('/cart', addToCart);
router.delete('/cart', removeFromCart);
router.post('/checkout', handleCheckout);

module.exports = router;

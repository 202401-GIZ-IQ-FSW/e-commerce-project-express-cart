const express = require('express');
const router = express.Router();
const {
  getAllShopItems,
  searchShopItems,
  filterShopItems,
  getShopItemById,
} = require('../controllers/shopItemsController');

router.get('/shop-items', getAllShopItems);
router.get('/shop-items/:id', getShopItemById);
router.get('/shop-items/search', searchShopItems);
router.get('/shop-items/filter', filterShopItems);

module.exports = router;

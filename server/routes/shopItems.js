const express = require('express');
const router = express.Router();
const {
  getAllShopItems,
  searchShopItems,
  filterShopItems,
  getShopItemById,
} = require('../controllers/shopItemsController');

router.get('/search', searchShopItems);
router.get('/filter', filterShopItems);
router.get('/:id', getShopItemById);
router.get('/', getAllShopItems);

module.exports = router;

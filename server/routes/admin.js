const express = require('express');
const router = express.Router();
const {
  getAllShopItems,
  searchShopItems,
  filterShopItems,
  addShopItem,
  updateShopItem,
  removeShopItem,
} = require('../controllers/adminController');

router.get('/', getAllShopItems);
router.get('/search', searchShopItems);
router.get('/filter', filterShopItems);
router.post('/', addShopItem);
router.patch('/:id', updateShopItem);
router.delete('/:id', removeShopItem);

module.exports = router;

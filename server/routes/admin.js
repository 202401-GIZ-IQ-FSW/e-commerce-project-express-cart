const express = require('express');
const router = express.Router();
const {
  getAllShopItems,
  searchShopItems,
  addShopItem,
  updateShopItem,
  removeShopItem,
} = require('../controllers/adminController');

router.get('/', getAllShopItems);
router.get('/search', searchShopItems);
router.post('/', addShopItem);
router.patch('/:id', updateShopItem);
router.delete('/:id', removeShopItem);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllShopItems,
  searchShopItems,
  filterShopItems,
  addShopItem,
  updateShopItem,
  removeShopItem,
  getShopItemById,
  getAllCustomers,
} = require('../controllers/adminController');

router.get('/shop-items', getAllShopItems);
router.get('/shop-items/:id', getShopItemById);
router.get('/shop-items/search', searchShopItems);
router.get('/shop-items/filter', filterShopItems);
router.post('/shop-items', addShopItem);
router.patch('/shop-items/:id', updateShopItem);
router.delete('/shop-items/:id', removeShopItem);

// get all customers
router.get('/customers', getAllCustomers);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  addShopItem,
  updateShopItem,
  removeShopItem,
  getAllCustomers,
} = require('../controllers/adminController');

router.post('/shop-items', addShopItem);
router.patch('/shop-items/:id', updateShopItem);
router.delete('/shop-items/:id', removeShopItem);

// get all customers
router.get('/customers', getAllCustomers);

module.exports = router;

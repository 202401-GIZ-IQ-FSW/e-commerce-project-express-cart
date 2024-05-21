const express = require('express');
const router = express.Router();
const adminAuthRoutes = require('./adminAuth');

const {
  addShopItem,
  updateShopItem,
  removeShopItem,
  getAllCustomers,
  getAllOrders,
} = require('../../controllers/adminController');

// admin auth routes
router.use('auth/', adminAuthRoutes);

// admin shop items CRUD
router.post('/shop-items', addShopItem);
router.patch('/shop-items/:id', updateShopItem);
router.delete('/shop-items/:id', removeShopItem);

// get all customers
router.get('/customers', getAllCustomers);
// get all orders
router.get('/orders', getAllOrders);
module.exports = router;

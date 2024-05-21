const express = require('express');
const router = express.Router();

const {
  addShopItem,
  updateShopItem,
  removeShopItem,
  getAllCustomers,
  getAllOrders,
} = require('../../controllers/adminController');
const { getAllAdmins, removeAdmin } = require('../../controllers/auth/authControllerAdmin');

// admin shop items CRUD
router.post('/shop-items', addShopItem);
router.patch('/shop-items/:id', updateShopItem);
router.delete('/shop-items/:id', removeShopItem);

// get all customers
router.get('/customers', getAllCustomers);
// get all orders
router.get('/orders', getAllOrders);

// admin accounts
router.get('/admins', getAllAdmins);
router.delete('/admins/:id', removeAdmin);

module.exports = router;

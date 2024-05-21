const express = require('express');
const router = express.Router();

const adminShopItems = require('./adminShopItems');
const customerAccounts = require('./customerAccounts');
const adminAccounts = require('./adminAccounts');
const { getAllOrders } = require('../../controllers/adminController');

router.use('/shop-items', adminShopItems);
router.use('/customers', customerAccounts);
router.use('/admins', adminAccounts);

// Other admin routes
router.get('/orders', getAllOrders);

module.exports = router;

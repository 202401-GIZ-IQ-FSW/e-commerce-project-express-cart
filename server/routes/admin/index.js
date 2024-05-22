const express = require('express');
const router = express.Router();

const adminShopItems = require('./adminShopItems');
const customerAccounts = require('./customerAccounts');
const adminAccounts = require('./adminAccounts');
const { getAllOrders } = require('../../controllers/admin/adminShopItemsController');
const { createAdmin } = require('../../controllers/admin/adminProfileController');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT');
const USER_ROLES = require('../../config/userRoles');

router.use('/shop-items', adminShopItems);
router.use('/customers', customerAccounts);
router.use('/admins', adminAccounts);

// Other admin routes
router.get('/orders', getAllOrders);
router.post('/new-admin', verifyJWT, verifyRoles(USER_ROLES.Admin), createAdmin);

module.exports = router;

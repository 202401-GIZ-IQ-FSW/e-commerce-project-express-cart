const express = require('express');
const router = express.Router();
const { getAllCustomers, removeCustomer } = require('../../controllers/admin/adminShopItemsController');

// Customer routes
router.get('/', getAllCustomers);
router.delete('/:id', removeCustomer);

module.exports = router;

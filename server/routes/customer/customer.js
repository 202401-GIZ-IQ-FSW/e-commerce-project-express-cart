const express = require('express');
const { handleCheckout, getCustomerOrders } = require('../../controllers/customerController');
const router = express.Router();

router.post('/checkout', handleCheckout);
router.get('/:customerId/orders', getCustomerOrders);

module.exports = router;

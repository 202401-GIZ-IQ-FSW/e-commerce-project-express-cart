const express = require('express');
const { registerCustomer } = require('../controllers/authController');
const router = express.Router();

router.post('/customer/register', registerCustomer);

module.exports = router;

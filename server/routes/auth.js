const express = require('express');
const { registerCustomer, handleLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/customer/register', registerCustomer);
router.post('/customer/login', handleLogin);

module.exports = router;

const express = require('express');
const { registerCustomer, handleLogin, handleLogout } = require('../controllers/authController');
const router = express.Router();

router.post('/customer/register', registerCustomer);
router.post('/customer/login', handleLogin);
router.post('/customer/logout', handleLogout);

module.exports = router;

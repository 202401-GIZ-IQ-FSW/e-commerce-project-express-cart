const express = require('express');
const { handleLogin, handleLogout, handleRegistration } = require('../controllers/authController');
const router = express.Router();

router.post('/customer/register', handleRegistration);
router.post('/customer/login', handleLogin);
router.post('/customer/logout', handleLogout);

module.exports = router;

const express = require('express');
const { handleLogin, handleLogout, handleRegistration } = require('../../controllers/auth/authControllerCustomer');
const router = express.Router();

router.post('/register', handleRegistration);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  handleLogin,
  handleLogout,
  handleRegistration,
} = require('../../controllers/auth/authControllerCustomer');

router.post('/register', handleRegistration);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);

module.exports = router;

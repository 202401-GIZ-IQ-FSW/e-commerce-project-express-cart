const express = require('express');
const router = express.Router();
const { handleRefreshToken } = require('../../controllers/auth/refreshTokenController');
const {
  handleLogin,
  handleLogout,
  handleCustomerRegistration,
} = require('../../controllers/auth/authController');
const { createAdmin } = require('../../controllers/admin/adminProfileController');

router.use('/customer/register', handleCustomerRegistration);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.post('/refresh-token', handleRefreshToken);
router.post('/admin/register', createAdmin); // temporary route to register as admin
module.exports = router;

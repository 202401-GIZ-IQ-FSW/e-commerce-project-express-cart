const express = require('express');
const { adminLogin, adminLogout, createAdmin } = require('../../controllers/auth/authControllerAdmin');
const router = express.Router();

router.post('/register', createAdmin);
router.post('/login', adminLogin);
router.post('/logout', adminLogout);

module.exports = router;

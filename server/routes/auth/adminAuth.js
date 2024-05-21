const express = require('express');
const router = express.Router();

const { adminLogin, adminLogout, createAdmin } = require('../../controllers/auth/authControllerAdmin');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const USER_ROLES = require('../../config/userRoles');

// router.post('/register', createAdmin); // temporary route to create admin
router.post('/login', adminLogin);
router.post('/logout', verifyJWT, verifyRoles(USER_ROLES.Admin), adminLogout);
router.post('/new-admin', verifyJWT, verifyRoles(USER_ROLES.Admin), createAdmin);

module.exports = router;

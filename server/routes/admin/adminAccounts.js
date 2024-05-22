const express = require('express');
const router = express.Router();
const { getAllAdmins, removeAdmin, updateAdmin } = require('../../controllers/admin/adminProfileController');

// Admin account routes
router.get('/', getAllAdmins);
router.delete('/:id', removeAdmin);
router.patch('/:id', updateAdmin);

module.exports = router;

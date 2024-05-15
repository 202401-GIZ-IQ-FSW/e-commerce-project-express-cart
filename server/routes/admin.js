const express = require('express');
const router = express.Router();
const { addShopItem, getAllShopItems, removeShopItem, updateShopItem } = require('../controllers/adminController');

router.get('/', getAllShopItems);
router.post('/', addShopItem);
router.patch('/:id', updateShopItem);
router.delete('/:id', removeShopItem);

module.exports = router;

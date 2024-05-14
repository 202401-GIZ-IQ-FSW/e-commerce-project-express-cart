const express = require('express');
const { addShopItem, getAllShopItems, removeShopItem } = require('../controllers/adminController');
const router = express.Router();

router.get('/', getAllShopItems);
router.post('/', addShopItem);
router.delete('/:id', removeShopItem);

module.exports = router;

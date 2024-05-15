const { default: mongoose } = require('mongoose');
const ShopItemModel = require('../models/shopItemmodel');
const { getUpdateFields } = require('../util/getUpdatedFields');

const getAllShopItems = async (req, res) => {
  try {
    const shopItems = await ShopItemModel.find();
    res.json(shopItems);
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

const addShopItem = async (req, res) => {
  try {
    const newItem = await ShopItemModel.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(422).send({ errors });
    }
    res.status(500).send('Something went wrong');
  }
};

const updateShopItem = async (req, res) => {
  const postId = req.params.id;
  const updatedFields = getUpdateFields(req.body);
  try {
    const updatedShopItem = await ShopItemModel.findByIdAndUpdate(postId, updatedFields, { new: true });
    console.log(updateShopItem);
    if (!updatedShopItem) {
      return res.status(404).json({ message: "The shop item you are trying to update wasn't found" });
    }

    return res.json(updatedShopItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const removeShopItem = async (req, res) => {
  const postId = req.params.id;
  // return early if the passed id doesn't match mongoose object ids structure
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ message: 'Invalid item ID' });
  }
  try {
    const shopItem = await ShopItemModel.findByIdAndDelete(postId);
    if (!shopItem) {
      res.status(404).json({ message: "The item you are trying to delete wasn't found" });
    } else {
      res.status(204).json({ message: 'Item was deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  addShopItem,
  getAllShopItems,
  removeShopItem,
  updateShopItem,
};

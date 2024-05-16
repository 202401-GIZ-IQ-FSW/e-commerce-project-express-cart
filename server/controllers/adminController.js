const { default: mongoose } = require('mongoose');
const ShopItemModel = require('../models/ShopItemModel');
const { getUpdateFields } = require('../util/getUpdatedFields');

// get all shop items
const getAllShopItems = async (req, res) => {
  try {
    const shopItems = await ShopItemModel.find();
    res.json(shopItems);
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

const searchShopItems = async (req, res) => {
  const { title, category, minPrice, maxPrice } = req.query;
  const searchQuery = {};

  // Construct the search query based on the request query parameters
  if (title) {
    searchQuery.title = { $regex: title, $options: 'i' }; // Case-insensitive search for partial match
  }
  if (category) {
    searchQuery.category = { $regex: category, $options: 'i' }; // Case-insensitive search for partial match
  }
  if (minPrice && maxPrice) {
    searchQuery.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) }; // Filter by price range
  } else if (minPrice) {
    searchQuery.price = { $gte: parseInt(minPrice) }; // Filter by minimum price
  } else if (maxPrice) {
    searchQuery.price = { $lte: parseInt(maxPrice) }; // Filter by maximum price
  }

  try {
    const shopItems = await ShopItemModel.find(searchQuery);
    res.json(shopItems);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// create a new shop item
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

// update a shop item's details - any passed fields will be updated
const updateShopItem = async (req, res) => {
  const postId = req.params.id;
  // return early if the passed id doesn't match mongoose object ids structure
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ message: 'Invalid item ID' });
  }
  const updatedFields = getUpdateFields(req.body);
  try {
    const updatedShopItem = await ShopItemModel.findByIdAndUpdate(postId, updatedFields, { new: true });
    if (!updatedShopItem) {
      return res.status(404).json({ message: "The shop item you are trying to update wasn't found" });
    }

    return res.json(updatedShopItem);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// remove a shop item
const removeShopItem = async (req, res) => {
  const postId = req.params.id;
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
  searchShopItems,
};

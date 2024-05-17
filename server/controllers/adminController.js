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

// get a shop item by ID
const getShopItemById = async (req, res) => {
  const itemId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(404).json({ message: 'Invalid item ID' });
  }
  try {
    const shopItem = await ShopItemModel.findById(itemId);
    if (!shopItem) {
      return res.status(404).json({ message: 'Shop item not found' });
    }
    res.json(shopItem);
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

const searchShopItems = async (req, res) => {
  const { title, category } = req.query;
  const searchQuery = {};
  
  // Check if necessary query parameters are provided
  if (!title && !category) {
    return res.status(400).json({ message: 'Please provide a title or category to search' });
  }

  // Construct the search query based on the request query parameters
  if (title) {
    searchQuery.title = { $regex: title, $options: 'i' }; // Case-insensitive search for partial match
  }
  if (category) {
    searchQuery.category = { $regex: category, $options: 'i' }; // Case-insensitive search for partial match
  }

  try {
    const shopItems = await ShopItemModel.find(searchQuery);
    if (shopItems.length === 0) {
      return res.status(404).json({ message: 'No items found' });
    }
    res.json(shopItems);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const filterShopItems = async (req, res) => {
  const { minPrice, maxPrice, category, available } = req.query;
  const filterQuery = {};

  // Check if necessary query parameters are provided
  if (!minPrice && !maxPrice && !category && available === undefined) {
    return res.status(400).json({
      message: 'Please provide at least one filter criteria (minPrice, maxPrice, category, or available)',
    });
  }

  // Construct the filter query based on the request query parameters
  if (minPrice && maxPrice) {
    filterQuery.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) }; // Filter by price range
  } else if (minPrice) {
    filterQuery.price = { $gte: parseInt(minPrice) }; // Filter by minimum price
  } else if (maxPrice) {
    filterQuery.price = { $lte: parseInt(maxPrice) }; // Filter by maximum price
  }

  if (category) {
    filterQuery.category = { $regex: category, $options: 'i' }; // Case-insensitive filter by category
  }

  if (available !== undefined) {
    filterQuery.availableCount = available === 'true' ? { $gt: 0 } : 0; // Filter by availability
  }

  try {
    const shopItems = await ShopItemModel.find(filterQuery);

    if (shopItems.length === 0) {
      return res.status(404).json({ message: 'No items found matching the criteria' });
    }

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
  const itemId = req.params.id;
  // return early if the passed id doesn't match mongoose object ids structure
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(404).json({ message: 'Invalid item ID' });
  }
  const updatedFields = getUpdateFields(req.body);
  try {
    const updatedShopItem = await ShopItemModel.findByIdAndUpdate(itemId, updatedFields, { new: true });
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
  const itemId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(404).json({ message: 'Invalid item ID' });
  }
  try {
    const shopItem = await ShopItemModel.findByIdAndDelete(itemId);
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
  getShopItemById,
  removeShopItem,
  updateShopItem,
  searchShopItems,
  filterShopItems,
};

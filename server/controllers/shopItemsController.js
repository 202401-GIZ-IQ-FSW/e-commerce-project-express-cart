const { default: mongoose } = require('mongoose');
const ShopItemModel = require('../models/ShopItemModel');

const getAllShopItems = async (req, res) => {
  try {
    const shopItems = await ShopItemModel.find();
    res.json(shopItems);
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

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

module.exports = {
  getAllShopItems,
  getShopItemById,
  searchShopItems,
  filterShopItems,
};

const { default: mongoose } = require('mongoose');
const ShopItemModel = require('../../models/ShopItemModel');
const { getUpdateFields } = require('../../util/getUpdatedFields');
const CustomerModel = require('../../models/CustomerModel');
const OrderModel = require('../../models/OrderModel');

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

const getAllCustomers = async (req, res) => {
  try {
    const customers = await CustomerModel.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// get all orders ever made with associated customers
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate('customer').populate('items.item');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const removeCustomer = async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await CustomerModel.findByIdAndDelete(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
module.exports = {
  addShopItem,
  removeShopItem,
  updateShopItem,
  getAllCustomers,
  getAllOrders,
  removeCustomer,
};

const CustomerModel = require('../models/CustomerModel');
const OrderModel = require('../models/OrderModel');
const ShopItemModel = require('../models/ShopItemModel');

const getCart = async (req, res) => {
  const customerId = req.user.id;

  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ cart: customer.cart });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const addToCart = async (req, res) => {
  const customerId = req.user.id;
  const { itemId, quantity } = req.body;
  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const shopItem = await ShopItemModel.findById(itemId);
    if (!shopItem) {
      return res.status(400).json({ message: 'Item not found' });
    }

    // Check if the item already exists in the cart
    const existingCartItem = customer.cart.find((cartItem) => cartItem.item.equals(itemId));
    if (existingCartItem) {
      // Update the quantity of the existing item
      existingCartItem.quantity += quantity;
    } else {
      // Add new item to the cart
      customer.cart.push({ item: itemId, quantity });
    }

    // Save the updated customer
    await customer.save();

    res.status(201).json({ message: 'Item added to cart', cart: customer.cart });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const updateCart = async (req, res) => {
  const customerId = req.user.id;

  const { itemId, quantity } = req.body;

  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const shopItem = await ShopItemModel.findById(itemId);
    if (!shopItem) {
      return res.status(400).json({ message: 'Item not found' });
    }

    // Check if the item exists in the cart
    const existingCartItem = customer.cart.find((cartItem) => cartItem.item.equals(itemId));
    if (!existingCartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update the quantity of the existing item
    existingCartItem.quantity = quantity;

    // Save the updated customer
    await customer.save();

    res.status(200).json({ message: 'Cart updated successfully', cart: customer.cart });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const customerId = req.user.id;
  const { itemId } = req.body;

  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const cartItemIndex = customer.cart.findIndex((item) => item.item.toString() === itemId);
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Decrement the quantity or remove the item if quantity is less than 1
    if (customer.cart[cartItemIndex].quantity > 1) {
      customer.cart[cartItemIndex].quantity -= 1;
    } else {
      customer.cart.splice(cartItemIndex, 1);
    }

    await customer.save();

    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  getCart,
  updateCart,
  addToCart,
  removeFromCart,
};

const CustomerModel = require('../models/CustomerModel');
const OrderModel = require('../models/OrderModel');
const ShopItemModel = require('../models/ShopItemModel');

const registerCustomer = async (req, res) => {
  const { name, email, address, gender } = req.body;

  try {
    // Check if the email already exists
    const existingCustomer = await CustomerModel.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    // Create a new customer
    const customer = await CustomerModel.create({ name, email, address, gender });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const addToCart = async (req, res) => {
  const { customerId, itemId, quantity } = req.body;

  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const shopItem = await ShopItemModel.findById(itemId);
    if (!shopItem || shopItem.availableCount < quantity) {
      return res.status(400).json({ message: 'Item not available in sufficient quantity' });
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

    // Decrement the available count
    shopItem.availableCount -= quantity;
    await shopItem.save();

    // Save the updated customer
    await customer.save();

    res.status(201).json({ message: 'Item added to cart', cart: customer.cart });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { customerId, itemId } = req.body;

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

const handleCheckout = async (req, res) => {
  const { customerId } = req.body;
  try {
    // Populate the cart items with full item details
    const customer = await CustomerModel.findById(customerId).populate('cart.item');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Prepare the order items and calculate the total bill
    const orderItems = customer.cart.map((cartItem) => ({
      item: cartItem.item._id,
      quantity: cartItem.quantity,
    }));

    const totalBill = customer.cart.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );

    // Create and save the order
    const order = new OrderModel({
      items: orderItems,
      totalBill,
      customer: customerId,
    });
    await order.save();

    // Clear the customer's cart
    customer.cart = [];
    await customer.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  addToCart,
  handleCheckout,
  registerCustomer,
  removeFromCart,
};

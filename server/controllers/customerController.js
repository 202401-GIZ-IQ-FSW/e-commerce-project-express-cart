const CustomerModel = require('../models/CustomerModel');
const OrderModel = require('../models/OrderModel');
const ShopItemModel = require('../models/ShopItemModel');

const handleCheckout = async (req, res) => {
  const customerId = req.user.id;
  try {
    // Populate the cart items with full item details
    const customer = await CustomerModel.findById(customerId).populate('cart.item');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if the cart is empty
    if (customer.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
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

    // Check if all items are available in the required quantity before finalizing the order
    for (const cartItem of customer.cart) {
      const shopItem = await ShopItemModel.findById(cartItem.item._id);
      if (!shopItem || shopItem.availableCount < cartItem.quantity) {
        return res
          .status(400)
          .json({ message: `Item ${shopItem.title} not available in sufficient quantity` });
      }
    }

    // Deduct the items from the inventory
    for (const cartItem of customer.cart) {
      const shopItem = await ShopItemModel.findById(cartItem.item._id);
      shopItem.availableCount -= cartItem.quantity;
      await shopItem.save();
    }

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

const getCustomerOrders = async (req, res) => {
  const customerId = req.user.id;

  try {
    const orders = await OrderModel.find({ customer: customerId }).populate('items.item');
    if (!orders) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const getCustomerProfile = async (req, res) => {
  const customerId = req.user.id;

  try {
    const customer = await CustomerModel.findById(customerId)
      .populate('cart.item')
      .populate('orders')
      .select('-password -refreshToken -role'); // Exclude these fields

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update customer profile
const updateCustomerProfile = async (req, res) => {
  const customerId = req.user.id;
  const { name, address, gender } = req.body;

  try {
    let customer = await CustomerModel.findById(customerId).select('-refreshToken -role'); // exclude
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = name || customer.name;
    customer.address = address || customer.address;
    customer.gender = gender || customer.gender;

    await customer.save();

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  handleCheckout,
  getCustomerOrders,
  getCustomerProfile,
  updateCustomerProfile,
};

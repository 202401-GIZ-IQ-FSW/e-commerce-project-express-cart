const CustomerModel = require('../models/CustomerModel');
const OrderModel = require('../models/OrderModel');
const ShopItemModel = require('../models/ShopItemModel');

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
    // Decrement the available count
    shopItem.availableCount -= quantity;
    await shopItem.save();

    // Add to cart
    const cartItem = { item: itemId, quantity };
    customer.cart.push(cartItem);
    await customer.save();

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const handleCheckout = async (req, res) => {
  const { customerId } = req.body;
  try {
    // const customer = await CustomerModel.findById(customerId).populate('cart.item');
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const orderItems = customer.cart.map((cartItem) => ({
      item: cartItem.item._id,
      quantity: cartItem.quantity,
    }));

    const totalBill = customer.cart.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );

    const order = OrderModel.create({
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
};

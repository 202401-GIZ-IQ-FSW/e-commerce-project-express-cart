const CustomerModel = require('../models/CustomerModel');

const registerCustomer = async (req, res) => {
  const { name, email, password, address, gender } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    // Check if the email already exists
    const existingCustomer = await CustomerModel.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    // Create a new customer
    const customer = new CustomerModel({ name, email, password, address, gender });

    // Save the customer to the database
    await customer.save();

    // Exclude password from the response
    const customerResponse = {
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      address: customer.address,
      gender: customer.gender,
      cart: customer.cart,
      orders: customer.orders,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };

    res.status(201).json(customerResponse);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = { registerCustomer };

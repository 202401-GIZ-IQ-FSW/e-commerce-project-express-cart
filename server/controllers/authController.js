const CustomerModel = require('../models/CustomerModel');

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

module.exports = { registerCustomer };

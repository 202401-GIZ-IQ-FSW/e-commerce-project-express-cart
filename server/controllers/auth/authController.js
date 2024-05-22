const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USER_ROLES = require('../../config/userRoles');
const AdminModel = require('../../models/AdminModel');
const CustomerModel = require('../../models/CustomerModel');

const handleCustomerRegistration = async (req, res) => {
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
    const customer = new CustomerModel({ name, email, password, address, gender, role: USER_ROLES.Customer });

    // Save the customer to the database
    await customer.save();

    // Exclude password from the response
    const { password: _, role: _role, ...customerData } = customer._doc;

    res.status(201).json({ message: 'Customer created successfully', customer: customerData });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Unified login for customer and admin
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    let user = await AdminModel.findOne({ email });
    let role = USER_ROLES.Admin;

    if (!user) {
      user = await CustomerModel.findOne({ email });
      role = USER_ROLES.Customer;
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // one day
    });

    const { password: _password, refreshToken: _refreshToken, ...userData } = user._doc;

    res.status(200).json({ accessToken, user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Unified logout for customer and admin
const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204); // No content
  const refreshToken = cookies.refreshToken;

  try {
    let user = await AdminModel.findOne({ refreshToken });

    if (!user) {
      user = await CustomerModel.findOne({ refreshToken });
    }

    if (!user) {
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
      return res.sendStatus(204);
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204); // No content
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = { handleCustomerRegistration, handleLogin, handleLogout };

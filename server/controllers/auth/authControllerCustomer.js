const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CustomerModel = require('../../models/CustomerModel');
const USER_ROLES = require('../../config/userRoles');

const handleRegistration = async (req, res) => {
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

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Check if the email exists
    const customer = await CustomerModel.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate a JWT token
    const accessToken = jwt.sign(
      {
        userInfo: {
          id: customer._id,
          role: customer.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      {
        id: customer._id,
        role: customer.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Save the refresh token to the database
    customer.refreshToken = refreshToken;
    await customer.save();

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // one day
    });

    // Exclude sensitive information from the response
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

    res.status(200).json({ accessToken, customer: customerResponse });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const handleLogout = async (req, res) => {
  // on client (frontend), also delete the accessToken upon logout
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204); // no content
  const refreshToken = cookies.refreshToken;

  try {
    // Check if the refresh token exists in the database
    const customer = await CustomerModel.findOne({ refreshToken });
    if (!customer) {
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
      return res.sendStatus(204);
    }

    // Delete the refresh token from the database
    customer.refreshToken = null;
    await customer.save();

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204); // No content
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = { handleRegistration, handleLogin, handleLogout };

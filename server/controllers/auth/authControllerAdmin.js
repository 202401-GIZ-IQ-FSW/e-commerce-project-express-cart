const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminModel = require('../../models/AdminModel');

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const accessToken = jwt.sign(
      {
        userInfo: {
          id: admin._id,
          role: admin.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    admin.refreshToken = refreshToken;
    await admin.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // one day
    });
    // Exclude password, role, and refreshToken from the response
    const { password: _password, refreshToken: _refreshToken, role: _role, ...adminData } = admin._doc;

    res.json({ accessToken, admin: adminData });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const adminLogout = async (req, res) => {
  const { id } = req.user;

  try {
    const admin = await AdminModel.findById(id);
    if (!admin) return res.status(400).json({ message: 'Invalid request' });

    admin.refreshToken = null;
    await admin.save();

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new admin account
const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Admin with this email already exists' });

    const admin = new AdminModel({ name, email, password });

    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.find({});
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove an admin
const removeAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await AdminModel.findById(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    await admin.remove();
    res.status(200).json({ message: 'Admin removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const admin = await AdminModel.findById(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (name) admin.name = name;
    if (email) admin.email = email;

    await admin.save();
    const { password, refreshToken, ...adminData } = admin._doc;

    res.status(200).json(adminData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = {
  adminLogin,
  adminLogout,
  createAdmin,
  getAllAdmins,
  removeAdmin,
  updateAdmin,
};

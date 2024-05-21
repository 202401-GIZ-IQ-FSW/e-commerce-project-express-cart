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
    res.json({ accessToken });
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

    res.clearCookie('refreshToken');
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new AdminModel({ name, email, password: hashedPassword });

    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  createAdmin,
};

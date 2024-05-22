const AdminModel = require('../../models/AdminModel');

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
  createAdmin,
  getAllAdmins,
  removeAdmin,
  updateAdmin,
};

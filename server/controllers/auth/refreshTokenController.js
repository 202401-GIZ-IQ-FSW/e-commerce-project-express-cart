const jwt = require('jsonwebtoken');
const AdminModel = require('../../models/AdminModel');
const CustomerModel = require('../../models/CustomerModel');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.sendStatus(401); // Unauthorized

  const refreshToken = cookies.refreshToken;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Look up user (Admin or Customer) in the database using the ID in the token
    const user = (await AdminModel.findById(decoded.id)) || (await CustomerModel.findById(decoded.id));

    if (!user || user.refreshToken !== refreshToken) return res.sendStatus(403); // Forbidden

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

    res.json({ accessToken });
  } catch (err) {
    res.sendStatus(403); // Forbidden
  }
};

module.exports = { handleRefreshToken };

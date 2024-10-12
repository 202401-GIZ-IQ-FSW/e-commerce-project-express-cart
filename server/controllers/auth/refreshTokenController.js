const jwt = require('jsonwebtoken');
const AdminModel = require('../../models/AdminModel');
const CustomerModel = require('../../models/CustomerModel');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    console.log('No refresh token found in cookies');
    return res.sendStatus(401); // Unauthorized
  }

  const refreshToken = cookies.refreshToken;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log('Decoded refresh token:', decoded);

    // Look up user (Admin or Customer) in the database using the ID in the token
    const user = (await AdminModel.findById(decoded.id)) || (await CustomerModel.findById(decoded.id));

    if (!user) {
      console.log('No user found for decoded token ID:', decoded.id);
      return res.sendStatus(403); // Forbidden
    }

    console.log('User refreshToken:', user.refreshToken);
    console.log('Frontend refreshToken:', refreshToken);
    console.log(user.refreshToken === refreshToken);

    // TODO: there's a bug here where the refresh token stored in db is not matching the one coming from the frontend
    if (user.refreshToken !== refreshToken) {
      console.log('Stored refresh token does not match the one in the cookie');
      return res.sendStatus(403); // Forbidden
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

    res.json({ accessToken });
  } catch (err) {
    console.error('Error in handleRefreshToken:', err);
    res.sendStatus(403); // Forbidden
  }
};

module.exports = { handleRefreshToken };

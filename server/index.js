const express = require('express');
require('dotenv').config();

// config and middleware
const connectToMongo = require('./db/connection');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');

// routes
const shopItemsRoutes = require('./routes/shopItems');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer/customer');

const app = express();
const port = process.env.NODE_ENV === 'test' ? process.env.NODE_LOCAL_TEST_PORT : process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/shop-items', shopItemsRoutes);
app.use('/auth', authRoutes);

app.use(verifyJWT); // everything below this line will use verifyJWT
app.use('/customer', customerRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;

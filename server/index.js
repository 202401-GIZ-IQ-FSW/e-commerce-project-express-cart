const express = require('express');
require('dotenv').config();
const cors = require('cors');

// config and middleware
const connectToMongo = require('./db/connection');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const verifyRoles = require('./middleware/verifyRoles');

// routes
const shopItemsRoutes = require('./routes/shopItems');
const authRoutes = require('./routes/auth/auth');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');
const USER_ROLES = require('./config/userRoles');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const port = process.env.NODE_ENV === 'test' ? process.env.NODE_LOCAL_TEST_PORT : process.env.NODE_LOCAL_PORT;

// CORS options
const corsOptions = {
  origin: ['http://localhost:3000'], // Whitelist
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  credentials: true, // Allow cookies and other credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(rateLimiter); // Apply rate limiting to all requests

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/shop-items', shopItemsRoutes);
app.use('/api/v1/auth', authRoutes);

app.use(verifyJWT); // everything below this line will use verifyJWT
app.use('/api/v1/customer', verifyRoles(USER_ROLES.Customer), customerRoutes);
app.use('/api/v1/admin', verifyRoles(USER_ROLES.Admin), adminRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;

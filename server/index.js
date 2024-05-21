const express = require("express");
require("dotenv").config();

const path = require("path");

// config and middleware
const connectToMongo = require("./db/connection");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
const verifyRoles = require("./middleware/verifyRoles");

// routes
const shopItemsRoutes = require("./routes/shopItems");
const authRoutes = require("./routes/auth/auth");
const adminRoutes = require("./routes/admin/admin");
const customerRoutes = require("./routes/customer/customer");
const uiRoutes = require("./routes/ui/ui");
const USER_ROLES = require("./config/userRoles");

const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/ui", uiRoutes);

app.use("/shop-items", shopItemsRoutes);
app.use("/auth", authRoutes);

app.use(verifyJWT); // everything below this line will use verifyJWT
app.use("/customer", verifyRoles(USER_ROLES.Customer), customerRoutes);
app.use("/admin", verifyRoles(USER_ROLES.Admin), adminRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;

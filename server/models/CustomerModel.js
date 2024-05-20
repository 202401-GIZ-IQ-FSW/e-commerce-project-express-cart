const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { passwordValidation } = require('../util/passwordValidation');
const USER_ROLES = require('../config/userRoles');

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      validate: {
        validator: passwordValidation,
        message:
          'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a special character.',
      },
    },
    refreshToken: {
      type: String,
      default: null,
    },
    role: {
      type: Number,
      default: USER_ROLES.Customer, // Default role is Customer
    },
    address: String,
    gender: String,
    cart: [
      {
        item: { type: Schema.Types.ObjectId, ref: 'ShopItem' },
        quantity: { type: Number, required: true },
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  },
  { timestamps: true }
);

// Hash the password before saving the customer
customerSchema.pre('save', async function (next) {
  // If the password hasn't been modified, proceed with the save operation without hashing the password again
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const CustomerModel = mongoose.model('Customer', customerSchema);

module.exports = CustomerModel;

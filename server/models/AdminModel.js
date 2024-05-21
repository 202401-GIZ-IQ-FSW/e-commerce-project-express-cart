const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { passwordValidation } = require('../util/passwordValidation');
const USER_ROLES = require('../config/userRoles');

const adminSchema = new Schema(
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
      default: USER_ROLES.Admin, // Default role is Admin
    },
  },
  { timestamps: true }
);

// Hash the password before saving the admin
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const AdminModel = mongoose.model('Admin', adminSchema);

module.exports = AdminModel;

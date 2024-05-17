const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const CustomerModel = mongoose.model('Customer', customerSchema);

module.exports = CustomerModel;

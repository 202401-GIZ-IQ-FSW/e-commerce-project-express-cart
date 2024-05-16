const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: 'ShopItem' },
      quantity: { type: Number, default: 1 },
    },
  ],
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;

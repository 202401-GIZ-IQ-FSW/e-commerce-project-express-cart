const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: 'ShopItem' },
      quantity: { type: Number, required: true },
    },
  ],
  totalBill: { type: Number, required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;

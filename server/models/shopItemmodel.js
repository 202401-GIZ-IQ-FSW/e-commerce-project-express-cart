const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    image: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: [true, 'Please set the price'],
    },
    description: {
      type: String,
      required: false,
    },
    availableCount: {
      type: String,
      required: [true, 'Please set the available quantity'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
  },
  {
    timestamps: true,
  }
);
const ShopItemModel = mongoose.model('ShopItem', shopItemSchema);

module.exports = ShopItemModel;

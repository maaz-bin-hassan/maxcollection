const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userInfo: {
    name: String,
    email: String,
    number: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
  },
  cartItems: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  status: { type: String, enum: ['pending', 'delivered'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
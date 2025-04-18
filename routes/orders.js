const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Middleware for admin authentication
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === `Bearer ${process.env.ADMIN_TOKEN}`) return next();
  return res.status(401).json({ message: 'Unauthorized' });
};

// POST /api/orders — Submit an order
router.post('/', async (req, res) => {
  try {
    const { userInfo, cartItems } = req.body;
    if (!userInfo || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'User info and cart items are required.' });
    }
    // Attach imageUrls to each cartItem
    const cartItemsWithImages = await Promise.all(cartItems.map(async (item) => {
      let imageUrls = [];
      if (item.productId) {
        const product = await Product.findById(item.productId);
        if (product && product.imageUrls) imageUrls = product.imageUrls;
      }
      return { ...item, imageUrls };
    }));
    const order = new Order({ userInfo, cartItems: cartItemsWithImages });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders — Admin can view all orders
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/deliver — Admin can mark an order as delivered
router.put('/:id/deliver', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = 'delivered';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
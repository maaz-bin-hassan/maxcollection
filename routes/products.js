const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { cloudinary } = require('../utils/cloudinary');

// Middleware for admin authentication
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === `Bearer ${process.env.ADMIN_TOKEN}`) return next();
  return res.status(401).json({ message: 'Unauthorized' });
};

// POST /api/products — Add product with multiple images (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, category, price, quantity, images, shippingPrice } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }
    // Upload images to Cloudinary
    const imageUrls = [];
    for (const base64 of images) {
      const uploadRes = await cloudinary.uploader.upload(base64, { folder: 'max-collection/products' });
      imageUrls.push(uploadRes.secure_url);
    }
    const product = new Product({ name, description, category, price, quantity, imageUrls, shippingPrice });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products — Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id — Fetch a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id — Delete a product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id — Edit a product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, category, price, quantity, shippingPrice, imageUrls } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.category = category ?? product.category;
    product.price = price ?? product.price;
    product.quantity = quantity ?? product.quantity;
    product.shippingPrice = shippingPrice ?? product.shippingPrice;
    if (imageUrls) product.imageUrls = imageUrls;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
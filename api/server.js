const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Sample data
let products = [
  { id: 1, name: 'MacBook Pro', price: 1299.99, category: 'Electronics', stock: 15 },
  { id: 2, name: 'iPhone 15', price: 799.99, category: 'Electronics', stock: 30 },
  { id: 3, name: 'Samsung Galaxy', price: 699.99, category: 'Electronics', stock: 25 },
  { id: 4, name: 'Nike Air Max', price: 120.99, category: 'Fashion', stock: 50 }
];

let orders = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running', 
    timestamp: new Date().toISOString() 
  });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  res.json({
    success: true,
    data: product
  });
});

// Create order
app.post('/api/orders', (req, res) => {
  const { productId, quantity, customerName, customerEmail } = req.body;
  
  if (!productId || !quantity || !customerName || !customerEmail) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  const product = products.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock'
    });
  }
  
  // Update stock
  product.stock -= quantity;
  
  // Create order
  const order = {
    id: orders.length + 1,
    productId: parseInt(productId),
    productName: product.name,
    quantity: parseInt(quantity),
    totalPrice: product.price * quantity,
    customerName,
    customerEmail,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  orders.push(order);
  
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// Get orders
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

const PORT = process.env.PORT || 3000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;

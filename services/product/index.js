const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const app = express();
const PORT = 5001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// SQL Injection vulnerability
app.post('/product', (req, res) => {
  const { id } = req.body;
  const query = `SELECT * FROM products WHERE id = '${id}'`;
  console.log(`Executing query: ${query}`);
  res.send(`Executed query: ${query}`);
});

// XSS vulnerability
app.get('/product/:id', (req, res) => {
  const productId = req.params.id;
  res.send(`<h1>Product Details for: ${productId}</h1>`);
});

// CORS Misconfiguration
app.get('/all-products', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]);
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 5001;

app.use(cors({ origin: '*' }));
app.use(express.json());  // To parse JSON request bodies

// Define the Product schema directly in index.js
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

// SQL Injection simulation (replace with MongoDB query)
app.post('/product', async (req, res) => {
  const { id } = req.body;

  // Fetch product by ID (safe query using MongoDB)
  try {
    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching product');
  }
});

// XSS vulnerability example
app.get('/product/:id', (req, res) => {
  const productId = req.params.id;
  // Directly injects user input, which can be exploited
  res.send(`<h1>Product Details for: ${productId}</h1>`);
});

// Correct way: Fetch all products safely
app.get('/all-products', async (req, res) => {
  try {
    const products = await Product.find();  // Fetch all products from MongoDB
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});

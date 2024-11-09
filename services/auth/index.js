const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = 5004;
app.use(cors({ origin: '*' }));  // Allows all origins
// Insecure JWT Secret Key
const JWT_SECRET = '123';

app.use(bodyParser.json());

// Define the User schema directly in index.js
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Connect to MongoDB (replace '<your_connection_string>' with your actual MongoDB URI)
mongoose.connect('mongodb://mongodb:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));
// Signup Endpoint (No validation)
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    console.log("yessssssss"); 
    res.send('User registered successfully');
});

// Login Endpoint (Brute Force Vulnerability)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }

    // Session Hijacking Vulnerability
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Remote Code Execution Example (Evaluating User Input)
app.post('/rce', (req, res) => {
    const code = req.body.code;
    try {
        const result = eval(code);  // Vulnerable to RCE
        res.send(`Result: ${result}`);
    } catch (err) {
        res.status(400).send('Invalid code');
    }
});

app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});

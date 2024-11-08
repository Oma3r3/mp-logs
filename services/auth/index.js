const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');  // Example schema
const app = express();
const PORT = 5004;

app.use(bodyParser.json());

// Insecure JWT Secret Key
const JWT_SECRET = 'insecure_secret_key';

// Vulnerable in-memory user storage
let users = [
    { username: 'admin', password: 'admin123' }
];

// Signup Endpoint (No validation)
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.send('User registered successfully');
});

// Login Endpoint (Brute Force Vulnerability)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
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

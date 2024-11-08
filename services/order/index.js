const express = require('express');
const app = express();
const PORT = 5002;

app.use(express.json());

// Vulnerable CSRF Endpoint (No CSRF Token)
app.post('/order', (req, res) => {
    res.send('Order placed without CSRF protection');
});

// Clickjacking Vulnerability
app.get('/checkout', (req, res) => {
    res.setHeader('X-Frame-Options', 'ALLOW-FROM *');  // Vulnerable to clickjacking
    res.send('<h1>Proceed to Checkout</h1>');
});

// SSRF Vulnerability
app.post('/fetch-data', (req, res) => {
    const url = req.body.url;
    // SSRF Vulnerability: Allowing unvalidated URL fetch
    res.send(`Fetched data from ${url}`);
});

app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
});

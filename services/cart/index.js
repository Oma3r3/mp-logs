const express = require('express');
const app = express();
const PORT = 5003;

app.use(express.json());

// Business Logic Flaw (Allowing large quantities)
app.post('/add', (req, res) => {
    const { quantity } = req.body;
    if (quantity > 1000) {
        res.send('Quantity not allowed');
    } else {
        res.send('Item added to cart');
    }
});

// DDOS Susceptibility (No rate limiting, large payload)
app.get('/items', (req, res) => {
    res.json(Array(1000).fill({ id: 1, name: 'Sample Item' }));  // Large payload
});

app.listen(PORT, () => {
    console.log(`Cart service running on port ${PORT}`);
});

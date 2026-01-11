require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/bundle', require('./routes/bundle'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api', require('./routes/dashboard'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api', require('./routes/topup'));


const path = require('path');
// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Landing page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Catch-all route to serve login.html for any unknown route
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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


const path = require('path');
// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Catch-all route to serve index.html for SPA routing
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

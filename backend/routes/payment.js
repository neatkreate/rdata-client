// Payment routes
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/paystack/initiate', paymentController.initiatePaystack);
router.post('/paystack/webhook', paymentController.paystackWebhook);

module.exports = router;

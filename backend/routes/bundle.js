// Bundle routes
const express = require('express');
const router = express.Router();
const bundleController = require('../controllers/bundleController');

router.post('/purchase', bundleController.purchaseBundle);
router.get('/status/:orderId', bundleController.checkOrderStatus);

module.exports = router;

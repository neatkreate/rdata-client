const express = require('express');
const router = express.Router();
const topupController = require('../controllers/topupController');

router.post('/top-up-mobile-money', topupController.topUpMobileMoney);

module.exports = router;

// dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', dashboardController.getDashboard);
router.get('/networks', dashboardController.getNetworks);
router.get('/data-plans', dashboardController.getDataPlans);
router.post('/buy-data', dashboardController.buyData);
router.post('/top-up', dashboardController.topUp);

module.exports = router;

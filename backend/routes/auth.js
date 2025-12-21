// Auth routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/renewal-status/:userId', authController.renewalStatus);

module.exports = router;

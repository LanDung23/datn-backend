const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal.controller');

router.post('/create', paypalController.create);
router.get('/capture', paypalController.capture);

module.exports = router;

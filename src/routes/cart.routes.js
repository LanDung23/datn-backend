const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.getCart);
router.put('/update', cartController.updateQuantity);
router.delete('/remove', cartController.removeItem);
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;

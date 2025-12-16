const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');

router.get('/', OrderController.findAll);
router.post('/', OrderController.createOrder);
router.get('/user/:id', OrderController.getOrdersByUser);
router.get('/user/:id/details', OrderController.getOrderDetailsByUser);
router.put('/status', OrderController.updateOrderStatus);
router.put('/item/:orderItemId', OrderController.updateOrderItemQuantity);
router.put('/:id', OrderController.updateOrder);
router.delete('/:orderId', OrderController.deleteOrder);

module.exports = router;
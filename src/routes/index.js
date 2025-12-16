const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const categoryRouter = require('./category.routes');
const userRouter = require('./user.routes');
const contactRouter = require('./contact.routes');
const discontRouter = require('./discount.routes');
const productRouter = require('./product.routes');
const cartRouter = require('./cart.routes');
const authRouter = require('./auth.routes');
const orderRouter = require('./order.routes');
const paypalRoutes = require('./paypal.routes');
const addressRouter = require('./address.routes');

router.use('/roles', roleRouter);
router.use('/categories', categoryRouter);
router.use('/users', userRouter);
router.use('/contacts', contactRouter);
router.use('/discounts', discontRouter);
router.use('/products', productRouter);
router.use('/carts', cartRouter);
router.use('/auth', authRouter);
router.use('/orders', orderRouter);
router.use('/paypal', paypalRoutes);
router.use('/address', addressRouter);

module.exports = router;
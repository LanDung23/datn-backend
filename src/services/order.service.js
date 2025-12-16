const { User, Product } = require('../models');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const { client: paypalClient } = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

class OrderService {
    static async findAll({ offset, limit }) {
        const orders = await Order.findAndCountAll({
            distinct: true,
            include: [
                { model: User, as: 'user' },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        { model: Product, as: 'product' },
                    ],
                },
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });

        return orders;
    }

    static async getOrdersByUser(id) {
        const order = await Order.findAll({
            where: { userId: id },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        { model: Product, as: 'product' },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return order;
    }

    static async create(userId, items, totalPrice, note, shipping_address, paymentMethod = 'cod') {
        // Lấy unique productId từ items
        const productIds = [...new Set(items.map(i => i.productId))];

        // Truy vấn DB để lấy tên sản phẩm
        const products = await Product.findAll({ where: { id: productIds } });
        const productMap = {};
        products.forEach(p => { productMap[p.id] = p.name; });

        return await Order.sequelize.transaction(async (t) => {
            const order = await Order.create({
                userId,
                total_price: totalPrice,
                note,
                paymentMethod,
                shipping_address
            }, { transaction: t });

            const orderItemsData = items.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            }));

            await OrderItem.bulkCreate(orderItemsData, { transaction: t });

            // Nếu COD thì trả về luôn
            if (paymentMethod === 'cod') {
                return { order };
            }

            // Nếu PayPal, tính toán chính xác giá USD
            const itemsUSD = items.map(item => ({
                ...item,
                unitAmount: parseFloat((item.price / 24000).toFixed(2)) // quy đổi VND -> USD
            }));

            const itemTotal = itemsUSD
                .reduce((sum, item) => sum + item.unitAmount * item.quantity, 0)
                .toFixed(2);

            const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
            request.prefer('return=representation');
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: itemTotal,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: itemTotal,
                            },
                        },
                    },
                    items: itemsUSD.map(item => ({
                        name: productMap[item.productId] || 'Sản phẩm',
                        unit_amount: {
                            currency_code: 'USD',
                            value: item.unitAmount.toFixed(2),
                        },
                        quantity: item.quantity.toString(),
                    }))
                }],
                application_context: {
                    brand_name: 'My Shop',
                    landing_page: 'LOGIN',
                    user_action: 'PAY_NOW',
                    return_url: `https://datn-frontend-two.vercel.app/paypal-success?orderId=${order.id}`,
                    cancel_url: `https://datn-frontend-two.vercel.app/payment-fail?orderId=${order.id}`,
                },
            });

            const response = await paypalClient().execute(request);
            const paypalOrderId = response.result.id;
            const approveUrl = response.result.links.find(link => link.rel === 'approve')?.href;

            order.paypal_order_id = paypalOrderId;
            await order.save({ transaction: t });

            return { order, approveUrl };
        });
    }

    static async update(orderId, { userId, note, items }) {
        return await Order.sequelize.transaction(async (t) => {
            const order = await Order.findByPk(orderId, { transaction: t });
            if (!order) throw new Error('Order not found');

            order.userId = userId ?? order.userId;
            order.note = note ?? '';

            await OrderItem.destroy({ where: { orderId }, transaction: t });

            const orderItemsData = items.map((item) => ({
                orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            }));

            await OrderItem.bulkCreate(orderItemsData, { transaction: t });

            const totalPrice = orderItemsData.reduce((sum, item) => {
                return sum + item.quantity * item.price;
            }, 0);

            order.total_price = totalPrice;
            await order.save({ transaction: t });

            return order;
        });
    }

    static async updateOrderStatus(orderId, status) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        order.status = status;
        await order.save();
        return order;
    }

    static async updateOrderItemQuantity(orderItemId, newQuantity) {
        return await OrderItem.sequelize.transaction(async (t) => {
            const orderItem = await OrderItem.findByPk(orderItemId, {
                include: [
                    { model: Product, as: 'product' },
                ],
                transaction: t,
            });

            if (!orderItem) {
                throw new Error('Order item not found');
            }

            orderItem.quantity = newQuantity;
            await orderItem.save({ transaction: t });

            const orderId = orderItem.orderId;

            const allItems = await OrderItem.findAll({
                where: { orderId },
                transaction: t,
            });

            const newTotal = allItems.reduce((sum, item) => {
                return sum + item.quantity * item.price;
            }, 0);

            const order = await Order.findByPk(orderId, { transaction: t });
            order.total_price = newTotal;
            await order.save({ transaction: t });

            return {
                orderItem,
                newTotal,
            };
        });
    }

    static async delete(orderId) {
        return await Order.sequelize.transaction(async (t) => {
            const order = await Order.findByPk(orderId, { transaction: t });
            if (!order) throw new Error('Order not found');

            await OrderItem.destroy({ where: { orderId }, transaction: t });
            await order.destroy({ transaction: t });

            return { message: 'Order deleted successfully' };
        });
    }
}

module.exports = OrderService;

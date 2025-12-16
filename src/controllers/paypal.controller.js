const { client: paypalClient } = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const Order = require('../models/order.model');

/**
 * Helper: convert cart items sang PayPal format, tránh ITEM_TOTAL_MISMATCH
 */
const convertCartToPaypalItems = (items, usdRate = 25000) => {
    // items: [{ name, price (VND), quantity }]
    const paypalItems = items.map(item => {
        const usdPrice = Math.round((item.price / usdRate) * 100) / 100; // 2 chữ số
        return {
            name: item.name,
            unit_amount: {
                currency_code: "USD",
                value: usdPrice.toFixed(2), // string 2 chữ số
            },
            quantity: String(item.quantity),
        };
    });

    const itemTotal = paypalItems
        .reduce((sum, item) => sum + parseFloat(item.unit_amount.value) * parseInt(item.quantity), 0);

    return { paypalItems, itemTotal: itemTotal.toFixed(2) };
};

/**
 * Create PayPal order
 */
const create = async (req, res) => {
    try {
        const { items } = req.body; // [{ name, price, quantity }]
        const { paypalItems, itemTotal } = convertCartToPaypalItems(items);

        // Tạo request PayPal
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: itemTotal,
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: itemTotal,
                            },
                        },
                    },
                    items: paypalItems,
                },
            ],
        });

        const order = await paypalClient().execute(request);

        // Lưu DB
        const newOrder = await Order.create({
            paypal_order_id: order.result.id,
            status: "pending",
            total: itemTotal,
        });

        res.json({
            success: true,
            orderID: order.result.id,
            paypal: order.result,
            data: newOrder,
        });
    } catch (err) {
        console.error("Error in createOrder:", err.response?.data || err);
        res.status(500).json({
            success: false,
            message: "PayPal order creation failed",
            error: err.message,
        });
    }
};

/**
 * Capture PayPal order
 */
const capture = async (req, res) => {
    try {
        const { orderId } = req.query;
        const order = await Order.findByPk(orderId);

        if (!order || !order.paypal_order_id) {
            return res.status(404).json({ message: "Order not found or not paid via PayPal" });
        }

        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(order.paypal_order_id);
        request.requestBody({});

        const capture = await paypalClient().execute(request);

        order.status = "paid";
        await order.save();

        res.json({
            success: true,
            message: "PayPal payment captured",
            data: order,
            paypal: capture.result,
        });
    } catch (err) {
        console.error("Error in capture:", err.response?.data || err);
        res.status(500).json({
            success: false,
            message: "PayPal capture failed",
            error: err.message,
        });
    }
};

module.exports = { create, capture };

const OrderService = require('../services/order.service');

class OrderController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 5;
            const offset = (page - 1) * pageSize;

            const { count, rows } = await OrderService.findAll({ offset, limit: pageSize });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách đơn hàng thành công',
                data: rows,
                total: count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng',
                error: error.message,
            });
        }
    }

    async createOrder(req, res) {
        try {
            const { items, totalPrice, note, shipping_address, paymentMethod } = req.body;
            const userId = req.user?.id || req.body.userId;

            if (!items || items.length === 0) {
                return res.status(400).json({ message: 'Order must have at least one item' });
            }

            const { order, approveUrl } = await OrderService.create(
                userId,
                items,
                totalPrice,
                note,
                shipping_address,
                paymentMethod
            );

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order,
                ...(approveUrl && { approveUrl })
            });
        } catch (err) {
            console.error('Error in createOrder:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to create order',
                error: err.message
            });
        }
    }

    async updateOrder(req, res) {
        try {
            const orderId = req.params.id;
            const { userId, note, items } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Order must have at least one item',
                });
            }

            const updated = await OrderService.update(orderId, {
                userId,
                note,
                items,
            });

            res.status(200).json({
                success: true,
                message: 'Order updated successfully',
                data: updated,
            });
        } catch (err) {
            console.error('Error in updateOrder:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to update order',
                error: err.message
            });
        }
    }

    async getOrdersByUser(req, res) {
        try {
            const userId = req.user?.id || req.params.id;
            const data = await OrderService.getOrdersByUser(userId);
            res.status(200).json({
                success: true,
                message: 'Orders fetched successfully',
                data
            });

        } catch (err) {
            console.error('Error in getOrdersByUser:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch orders',
                error: err.message
            });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const { orderId, status } = req.body;
            const data = await OrderService.updateOrderStatus(orderId, status);
            res.status(200).json({
                success: true,
                message: 'Order status updated',
                data
            });
        } catch (err) {
            console.error('Error in updateOrderStatus:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to update order status',
                error: err.message
            });
        }
    }

    async updateOrderItemQuantity(req, res) {
        try {
            const { orderItemId } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid quantity' });
            }

            const { orderItem, newTotal } = await OrderService.updateOrderItemQuantity(orderItemId, quantity);

            res.status(200).json({
                success: true,
                message: 'Order item quantity and total updated successfully',
                orderItem,
                newTotal,
            });
        } catch (err) {
            console.error('Error in updateOrderItemQuantity:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to update order item quantity',
                error: err.message
            });
        }
    }

    async deleteOrder(req, res) {
        try {
            const { orderId } = req.params;
            const data = await OrderService.delete(orderId);
            res.status(200).json({
                success: true,
                message: 'Order deleted successfully',
                data
            });
        } catch (err) {
            console.error('Error in deleteOrder:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to delete order',
                error: err.message
            });
        }
    }

    async getOrderDetailsByUser(req, res) {
        try {
            const userId = req.params.id || req.user?.id;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const orders = await OrderService.getOrdersByUser(userId);

            if (!orders || orders.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No orders found for this user'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Order details fetched successfully',
                data: orders
            });
        } catch (err) {
            console.error('Error in getOrderDetailsByUser:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch order details',
                error: err.message
            });
        }
    }
}

module.exports = new OrderController();

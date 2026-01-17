const CartService = require('../services/cart.service');

class CartController {
    async addToCart(req, res) {
        try {
            const { userId, productId, quantity } = req.body;
            if (!userId || !productId || !quantity) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin đầu vào' });
            }
            const data = await CartService.addToCart(userId, productId, quantity);
            res.status(200).json({ success: true, message: 'Đã thêm vào giỏ hàng', data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async getCart(req, res) {
        try {
            const { userId } = req.params;
            const data = await CartService.getCartByUserId(userId);
            res.status(200).json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Lỗi tải giỏ hàng' });
        }
    }

    async updateQuantity(req, res) {
        try {
            const { cartItemId, quantity } = req.body;
            if (!cartItemId || quantity === undefined) {
                return res.status(400).json({ success: false, message: 'Thiếu ID hoặc số lượng' });
            }
            const data = await CartService.updateQuantity(cartItemId, quantity);
            res.status(200).json({ success: true, message: 'Cập nhật thành công', data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async removeItem(req, res) {
        try {
            const { cartItemId } = req.body;
            await CartService.removeItem(cartItemId);
            res.status(200).json({ success: true, message: 'Đã xóa sản phẩm' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm' });
        }
    }

    async clearCart(req, res) {
        try {
            const { userId } = req.params;
            await CartService.clearCart(userId);
            res.status(200).json({ success: true, message: 'Giỏ hàng đã trống' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Lỗi khi làm sạch giỏ hàng' });
        }
    }
}

module.exports = new CartController();
const { Cart, CartItem, Product, Discount, sequelize } = require('../models');

class CartService {
    static async addToCart(userId, productId, quantity) {
        const t = await sequelize.transaction();
        try {
            let cart = await Cart.findOne({ where: { userId }, transaction: t });
            if (!cart) {
                cart = await Cart.create({ userId }, { transaction: t });
            }

            const product = await Product.findByPk(productId, {
                include: [{ model: Discount, as: 'discount' }],
                transaction: t
            });

            if (!product) throw new Error('Sản phẩm không tồn tại');

            // Tính toán giá cuối cùng (Final Price) dựa trên Discount
            let basePrice = parseFloat(product.price);
            let discountPercent = 0;
            const now = new Date();
            
            if (product.discount && 
                new Date(product.discount.start_date) <= now && 
                now <= new Date(product.discount.end_date)) {
                discountPercent = parseFloat(product.discount.percentage);
            }
            let finalPrice = basePrice * (1 - discountPercent / 100);

            const existingItem = await CartItem.findOne({
                where: { cartId: cart.id, productId },
                transaction: t
            });

            if (existingItem) {
                existingItem.quantity += parseInt(quantity);
                await existingItem.save({ transaction: t });
            } else {
                await CartItem.create({
                    cartId: cart.id,
                    productId,
                    quantity: parseInt(quantity),
                    price: finalPrice.toFixed(2)
                }, { transaction: t });
            }

            await t.commit();
            return { cartId: cart.id, productId, quantity };
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    static async getCartByUserId(userId) {
        // Tìm giỏ hàng và kèm theo tất cả thông tin Product, Discount để tính giá
        const cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    include: ['category', 'discount']
                }]
            }],
            order: [[ { model: CartItem, as: 'items' }, 'createdAt', 'ASC' ]] // Quan trọng: Giữ thứ tự dòng không bị nhảy
        });

        return cart ? cart.items : [];
    }

    static async updateQuantity(cartItemId, quantity) {
        const item = await CartItem.findByPk(cartItemId);
        if (!item) throw new Error('Không tìm thấy dòng này trong giỏ hàng');

        if (quantity < 1) throw new Error('Số lượng không được nhỏ hơn 1');
        
        item.quantity = parseInt(quantity);
        await item.save();
        return item;
    }

    static async removeItem(cartItemId) {
        const item = await CartItem.findByPk(cartItemId);
        if (!item) throw new Error('Sản phẩm không còn trong giỏ');
        await item.destroy();
        return { success: true };
    }

    static async clearCart(userId) {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) return 0;
        return await CartItem.destroy({ where: { cartId: cart.id } });
    }
}

module.exports = CartService;
const { Cart, CartItem, Product, Discount } = require('../models');

class CartService {
    static async addToCart(userId, productId, quantity) {
        const t = await Cart.sequelize.transaction();
        try {
            let cart = await Cart.findOne({ where: { userId }, transaction: t });
            if (!cart) {
                cart = await Cart.create({ userId }, { transaction: t });
            }

            const product = await Product.findByPk(productId, {
                include: [{ model: Discount, as: 'discount' }],
                transaction: t
            });

            if (!product) throw new Error('Product not found');

            let basePrice = parseFloat(product.price);
            let discountPercent = 0;

            const now = new Date();
            if (
                product.discount &&
                new Date(product.discount.start_date) <= now &&
                now <= new Date(product.discount.end_date)
            ) {
                discountPercent = parseFloat(product.discount.percentage);
            }

            let finalPrice = basePrice * (1 - discountPercent / 100);

            const existingItem = await CartItem.findOne({
                where: { cartId: cart.id, productId },
                transaction: t
            });

            if (existingItem) {
                existingItem.quantity += quantity;
                await existingItem.save({ transaction: t });
            } else {
                await CartItem.create(
                    {
                        cartId: cart.id,
                        productId,
                        quantity,
                        price: finalPrice.toFixed(2)
                    },
                    { transaction: t }
                );
            }

            await t.commit();
            return {
                cartId: cart.id,
                productId,
                quantity,
                finalPrice: finalPrice.toFixed(2)
            };
        } catch (err) {
            await t.rollback();
            console.error('Error in addToCart:', err);
            throw err;
        }
    }

    static async getCartByUserId(userId) {
        try {
            const cart = await Cart.findOne({
                where: { userId },
                include: [
                    {
                        model: CartItem,
                        as: 'items',
                        include: [
                            {
                                model: Product,
                                as: 'product',
                                include: ['category', 'discount']
                            }
                        ]
                    }
                ]
            });

            if (!cart) return [];

            return cart.items;
        } catch (err) {
            console.error('Error in getCart:', err);
            throw err;
        }
    }

    static async updateQuantity(cartItemId, quantity) {
        const item = await CartItem.findByPk(cartItemId);
        if (!item) throw new Error('Cart item not found');

        item.quantity = quantity;
        await item.save();

        return item;
    }

    static async removeItem(cartItemId) {
        const item = await CartItem.findByPk(cartItemId);
        if (!item) throw new Error('Cart item not found');
        await item.destroy();
        return { success: true };
    }

    static async clearCart(userId) {
        if (!userId) throw new Error('userId is required');
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) return 0;
        const deleted = await CartItem.destroy({ where: { cartId: cart.id } });
        return deleted;
    }
}

module.exports = CartService;

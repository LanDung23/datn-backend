/**
 * ⚠️ CHỈ CHẠY FILE NÀY TRONG DEV
 */
if (process.env.NODE_ENV === 'production') {
    console.error('❌ Không được chạy seed trên production');
    process.exit(1);
}

const sequelize = require('./src/config/database');
const { faker } = require('@faker-js/faker');

// Import models
const Role = require('./src/models/role.model');
const User = require('./src/models/user.model');
const Category = require('./src/models/category.model');
const Discount = require('./src/models/discount.model');
const Product = require('./src/models/product.model');
const Cart = require('./src/models/cart.model');
const CartItem = require('./src/models/cartItem.model');
const Order = require('./src/models/order.model');
const OrderItem = require('./src/models/orderItem.model');
const Contact = require('./src/models/contact.model');

// Utils
const { normalizeName } = require('./src/utils/normalizeName');

async function seed() {
    try {
        // 1️⃣ Kết nối DB
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        // 2️⃣ Reset DB theo thứ tự FK
        await Role.sync({ force: true });
        await User.sync({ force: true });
        await Category.sync({ force: true });
        await Discount.sync({ force: true });
        await Product.sync({ force: true });
        await Cart.sync({ force: true });
        await CartItem.sync({ force: true });
        await Order.sync({ force: true });
        await OrderItem.sync({ force: true });
        await Contact.sync({ force: true });
        console.log('✅ Database synced (force)');

        // ================= ROLES =================
        const roles = await Role.bulkCreate([
            { code: 'ADMIN', name: 'Admin' },
            { code: 'CUSTOMER', name: 'Customer' }
        ]);

        // ================= USERS =================
        const users = await User.bulkCreate([
            { firstname: 'Nguyen', lastname: 'Van A', email: 'admin@example.com', password: 'admin123', roleId: roles[0].id },
            { firstname: 'Tran', lastname: 'Thi B', email: 'customer@example.com', password: 'customer123', roleId: roles[1].id }
        ]);

        // ================= CATEGORIES =================
        const categories = await Category.bulkCreate([
            { code: 'CON_TAY', name: 'Xe Côn Tay' },
            { code: 'XE_SO', name: 'Xe Số' },
            { code: 'XE_TAY_GA', name: 'Xe Tay Ga' }
        ]);

        // ================= DISCOUNTS =================
        const discounts = await Discount.bulkCreate([
            { name: 'Black Friday', percentage: 10, start_date: '2025-11-20', end_date: '2025-11-30' },
            { name: 'New Year', percentage: 15, start_date: '2025-12-30', end_date: '2026-01-05' }
        ]);

        // Helper
        const randomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const randomFeatured = () => Math.random() < 0.3;

        // ================= PRODUCTS =================
        const productsData = [
            // Xe Côn Tay
            'Áo WINNER V3 - Đen Bóng (14 Món)',
            'Áo WINNER V3 - Trắng (14 Món)',
            'Áo WINNER V3 - Xám Bóng (14 Món)',
            'Áo WINNER V3 - Đen Nhám (14 Món)',
            'Bánh răng bơm nước',
            'Bình chứa nước làm mát WINNER',
            'Ống xả thể thao',
            // Xe Số
            'Giảm xóc trước phải WAVE 2023 - Đen',
            'Áo FU NEO Đỏ 2009 (KYL-920) / 24 Món',
            'Áo ZX Trắng / 16 Món (Full Bóng + Nhám)',
            'Áo ZX Đỏ / 16 Món (Full Bóng + Nhám)',
            'Áo ZX Tím / 16 Món (Full Bóng + Nhám)',
            'Ốc bắt giỏ xe FUTURE 2',
            'Ốc đĩa FUTURE NEO/RS',
            'Ốc tay dắt FUTURE 2',
            'Lốp trước WAVE',
            // Xe Tay Ga
            'Bộ ốp sườn trái NHC60P - SH 160',
            'Bộ ốp sườn phải NHC60P - SH 160',
            'Bộ ốp sườn phải PB421',
            'Dây phanh sau AB 2020',
            'Tem ốp sườn VARIO 160 - XI',
            'Tem ốp sườn VARIO 160 - VÀNG',
            'Gương chiếu hậu LED',
            'Baga sau xe tay ga',
            'Đèn pha LED SH',
            // Phụ kiện ngẫu nhiên
            'Bộ lọc gió thể thao',
            'Lốp xe cao su',
            'Pin xe máy',
            'Kính chắn gió',
            'Túi đựng đồ đa năng',
            'Giỏ xe trước',
            'Tay lái thể thao',
            'Bộ nhông xích xe',
            'Bình dầu phụ',
            'Đèn xi-nhan LED'
        ].map(name => {
            const category = faker.helpers.arrayElement(categories);
            const discount = Math.random() < 0.5 ? faker.helpers.arrayElement(discounts) : null;
            return {
                name,
                slug: normalizeName(name),
                price: randomPrice(50000, 4000000),
                categoryId: category.id,
                discountId: discount ? discount.id : null,
                is_active: true,
                is_featured: randomFeatured()
            };
        });

        const products = await Product.bulkCreate(productsData, { individualHooks: true });

        // ================= CARTS =================
        const carts = await Cart.bulkCreate([
            { userId: users[1].id }
        ]);

        // ================= CART ITEMS =================
        await CartItem.bulkCreate([
            { cartId: carts[0].id, productId: products[0].id, price: products[0].price, quantity: 1 }
        ]);

        // ================= ORDERS =================
        const orders = await Order.bulkCreate([
            { userId: users[1].id, total_price: products[0].price, shipping_address: '123 Main St', status: 'pending', paymentMethod: 'cod' }
        ]);

        // ================= ORDER ITEMS =================
        await OrderItem.bulkCreate([
            { orderId: orders[0].id, productId: products[0].id, price: products[0].price, quantity: 1 }
        ]);

        // ================= CONTACTS =================
        await Contact.bulkCreate([
            { name: 'Customer A', email: 'customerA@example.com', phone: '0909009009', subject: 'Inquiry', message: 'Hello!' },
            { name: 'Customer B', email: 'customerB@example.com', phone: '0909111222', subject: 'Hỗ trợ', message: 'Cần tư vấn sản phẩm.' }
        ]);

        console.log('🎉 SEED DATA COMPLETED SUCCESSFULLY');
        process.exit(0);

    } catch (error) {
        console.error('❌ SEED ERROR:', error);
        process.exit(1);
    }
}

seed();

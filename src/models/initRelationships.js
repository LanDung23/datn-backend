module.exports = (db) => {
    const { Role, User, Category, Product, Discount, Cart, CartItem, Order, OrderItem, Contact } = db;

    // Helper định nghĩa foreign key
    const fk = (name, allowNull = false, onDelete = 'CASCADE', onUpdate = 'CASCADE') => ({
        foreignKey: { name, allowNull },
        constraints: true,
        onDelete,
        onUpdate
    });

    // ===== Role ↔ User =====
    Role.hasMany(User, { ...fk('roleId'), as: 'users' });
    User.belongsTo(Role, { ...fk('roleId', false, 'SET NULL'), as: 'role' });

    // ===== Category ↔ Product =====
    Category.hasMany(Product, { ...fk('categoryId'), as: 'products' });
    Product.belongsTo(Category, { ...fk('categoryId', false, 'SET NULL'), as: 'category' });

    // ===== Discount ↔ Product =====
    Discount.hasMany(Product, { ...fk('discountId', true, 'SET NULL'), as: 'products' });
    Product.belongsTo(Discount, { ...fk('discountId', true, 'SET NULL'), as: 'discount' });

    // ===== User ↔ Cart =====
    User.hasMany(Cart, { ...fk('userId'), as: 'carts' });
    Cart.belongsTo(User, { ...fk('userId'), as: 'user' });

    // ===== Cart ↔ CartItem =====
    Cart.hasMany(CartItem, { ...fk('cartId'), as: 'items', hooks: true });
    CartItem.belongsTo(Cart, { ...fk('cartId'), as: 'cart' });

    // ===== Product ↔ CartItem =====
    Product.hasMany(CartItem, { ...fk('productId'), as: 'cartItems' });
    CartItem.belongsTo(Product, { ...fk('productId'), as: 'product' });

    // ===== User ↔ Order =====
    User.hasMany(Order, { ...fk('userId'), as: 'orders' });
    Order.belongsTo(User, { ...fk('userId'), as: 'user' });

    // ===== Order ↔ OrderItem =====
    Order.hasMany(OrderItem, { ...fk('orderId'), as: 'orderItems', hooks: true });
    OrderItem.belongsTo(Order, { ...fk('orderId'), as: 'order' });

    // ===== Product ↔ OrderItem =====
    Product.hasMany(OrderItem, { ...fk('productId'), as: 'productOrderItems' });
    OrderItem.belongsTo(Product, { ...fk('productId', false, 'SET NULL'), as: 'product' });

    console.log('All relationships initialized successfully.');
};

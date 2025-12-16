const sequelize = require('../config/database');
const Role = require('./role.model');
const User = require('./user.model');
const Product = require('./product.model');
const Category = require('./category.model');
const Discount = require('./discount.model');
const Cart = require('./cart.model');
const CartItem = require('./cartItem.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const Contact = require('./contact.model');

const db = {
    Role,
    Category,
    Discount,
    User,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,    
    Contact,
    sequelize
}

require('./initRelationships')(db);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Connection successful');
    })
    .catch((error) => {
        console.error('Connection error:', error);
        throw error;
    });

module.exports = db;
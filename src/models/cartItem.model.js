const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const CartItem = sequelize.define('CartItem', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    cartId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    productId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    price: { 
        type: DataTypes.DECIMAL(10,2), 
        allowNull: false 
    },
    quantity: { 
        type: DataTypes.INTEGER, 
        defaultValue: 1 
    }
}, {
    tableName: 'cart_items',
    timestamps: true
});

module.exports = CartItem;

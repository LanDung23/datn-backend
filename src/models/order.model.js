const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Order = sequelize.define('Order', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    total_price: { 
        type: DataTypes.DECIMAL(10,2), 
        allowNull: false 
    },
    shipping_address: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    status: { 
        type: DataTypes.ENUM('pending','paid','shipped','completed','cancelled'), 
        defaultValue: 'pending' 
    },
    paymentMethod: { 
        type: DataTypes.ENUM('cod','paypal'), 
        defaultValue: 'cod' 
    },
    paypal_order_id: { 
        type: DataTypes.STRING 
    },
    note: { 
        type: DataTypes.TEXT 
    }
}, {
    tableName: 'orders',
    timestamps: true
});

module.exports = Order;

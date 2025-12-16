const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Cart = sequelize.define('Cart', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    }
}, {
    tableName: 'carts',
    timestamps: true
});

module.exports = Cart;

const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Discount = sequelize.define('Discount', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: { min: 0.01, max: 100.00 }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'discounts'
});

module.exports = Discount;

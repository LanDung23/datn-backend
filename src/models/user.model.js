const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    lastname: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    firstname: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    image: { 
        type: DataTypes.STRING,
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    phone: { 
        type: DataTypes.STRING,
    },
    roleId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;

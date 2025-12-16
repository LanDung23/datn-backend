const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Contact = sequelize.define('Contact', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    phone: { 
        type: DataTypes.STRING 
    },
    subject: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    message: { 
        type: DataTypes.TEXT 
    }
}, {
    tableName: 'contacts',
    timestamps: true
});

module.exports = Contact;

const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const { normalizeName } = require('../utils/normalizeName')

const Product = sequelize.define('Product', {
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
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    image: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    description: {
        type: DataTypes.TEXT
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discountId: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'products',
    timestamps: true,
    hooks: {
        beforeCreate: (product) => {
            if (product.name) {
                product.slug = normalizeName(product.name);
                console.log('Generating slug for:', product.name, '=>', product.slug);
            }
        },
        beforeUpdate: (product) => {
            if (product.name) {
                product.slug = normalizeName(product.name);
                console.log('Updating slug for:', product.name, '=>', product.slug);
            }
        }
    }

});

module.exports = Product;

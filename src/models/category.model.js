const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const slugify = require('slugify');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    timestamps: true,
    tableName: 'categories',
    hooks: {
        beforeCreate: (category, options) => {
            if (category.name) {
                category.slug = slugify(category.name, { lower: true, strict: true });
            }
        },
        beforeUpdate: (category, options) => {
            if (category.name) {
                category.slug = slugify(category.name, { lower: true, strict: true });
            }
        }
    }
});

module.exports = Category;

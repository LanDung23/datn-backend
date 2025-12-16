const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const slugify = require('slugify');

const Role = sequelize.define('Role', {
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
    tableName: 'roles',
    hooks: {
        beforeCreate: (role, options) => {
            if (role.name) {
                role.slug = slugify(role.name, { lower: true, strict: true });
            }
        },
        beforeUpdate: (role, options) => {
            if (role.name) {
                role.slug = slugify(role.name, { lower: true, strict: true });
            }
        }
    }
});

module.exports = Role;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Role = require('../models/role.model');
const User = require('../models/user.model');
const checkPassword = require('../utils/checkPassword');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

class AuthService {
    static async login(email, password) {
        const user = await User.findOne({
            where: { email },
            include: {
                model: Role,
                as: 'role',
                attributes: ['id', 'name', 'code']
            }
        })

        if (!user) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }
        if (!user.is_active) {
            throw new Error('Tài khoản đã bị khóa');
        }
        const isMatch = await checkPassword(password, user.password);
        if (!isMatch) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { user, token };
    }

    static async register({ firstname, lastname, email, password, image }) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email đã được sử dụng');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstname,
            lastname,
            email,
            image,
            password: hashedPassword,
            roleId: 2,
        });

        return user;
    }

}

module.exports = AuthService;
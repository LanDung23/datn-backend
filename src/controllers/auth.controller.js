const AuthService = require('../services/auth.service');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.login(email, password);
            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                token,
                user
            })
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    async register(req, res) {
        try {
            const data = await AuthService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công',
                data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();
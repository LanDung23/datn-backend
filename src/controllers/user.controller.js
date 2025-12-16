const UserService = require('../services/user.service');
const path = require('path');
const fs = require('fs');

class UserController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await UserService.findAll({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Lấy tất cả người dùng thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await UserService.findAll({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách người dùng thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách người dùng',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await UserService.create(req.body, req.file);

            res.status(200).json({
                success: true,
                message: 'Thêm người dùng thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm người dùng',
                error: error.message
            });
        }
    }
    
    async update(req, res) {
        try {
            const data = await UserService.update(req.params.id, req.body, req.file);

            res.status(200).json({
                success: true,
                message: 'Cập nhật thành công người dùng',
                data
            });
        } catch (error) {
            console.error('Lỗi: ', error);
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi cập nhật người dùng",
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await UserService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng để xóa'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thành công người dùng'
            });
        } catch (error) {
            console.error('Lỗi: ', error);
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa người dùng",
                error: error.message
            });
        }
    }

}

module.exports = new UserController();
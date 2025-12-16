const RoleService = require('../services/role.service');

class RoleController {
    async findAll(req, res) {
        try {
            const data = await RoleService.findAll();
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lấy danh sách thất bại',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await RoleService.create(req.body);
            res.status(200).json({
                success: true,
                message: 'Thêm thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Thêm thất bại',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const data = await RoleService.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Cập nhật thất bại',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const deletedCount = await RoleService.delete(req.params.id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy vai trò để xóa'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa vai trò thành công'
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa vai trò",
                error: error.message
            });
        }
    }
}

module.exports = new RoleController();

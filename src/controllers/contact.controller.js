const ContactService = require('../services/contact.service');

class ContactController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await ContactService.findAll({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Lấy tất cả thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await ContactService.findAll({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await ContactService.create(req.body);
            return res.status(201).json({
                success: true,
                message: 'Tạo liên hệ thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo liên hệ',
                error: error.message
            });
        }
    }

    async detail(req, res) {
        try {
            const data = await ContactService.detail(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Lấy liên hệ thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy liên hệ',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const data = await ContactService.update(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                message: 'Cập nhật liên hệ thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật liên hệ',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const data = await ContactService.delete(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Xóa liên hệ thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa liên hệ',
                error: error.message
            });
        }
    }

}

module.exports = new ContactController();
const CategoryService = require('../services/category.service');

class CategoryController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                // không phân trang
                result = await CategoryService.findAll({ search });
                return res.status(200).json({
                    success: true,
                    message: "Lấy tất cả category thành công",
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await CategoryService.findAll({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: "Lấy danh sách category thành công",
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lấy danh sách thất bại",
                error: error.message
            });
        }
    }


    async create(req, res) {
        try {
            const data = await CategoryService.create(req.body);
            res.status(200).json({
                success: true,
                message: 'Thêm thành công',
                data
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Thêm thất bại',
                data
            })
        }
    }

    async update(req, res) {
        try {
            const data = await CategoryService.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật thành công',
                data
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Cập nhật thất bại',
                data
            })
        }
    }

    async delete(req, res) {
        try {
            const deletedCount = await CategoryService.delete(req.params.id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thành công'
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa",
                error: error.message
            });
        }
    }

    async findAllWithProducts(req, res) {
        try {
            const data = await CategoryService.findAllWithProducts();
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách category + sản phẩm thành công',
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

}

module.exports = new CategoryController();
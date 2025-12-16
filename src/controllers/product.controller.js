const ProductService = require('../services/product.service');

class ProductController {
    static async findAll(options = {}) {
        const {
            offset,
            limit,
            search,
            categories,
            types,
            priceMin,
            priceMax,
            featured,
        } = options;

        const whereClause = {};

        // 🔍 SEARCH (Postgres dùng iLike)
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { '$category.name$': { [Op.iLike]: `%${search}%` } },
            ];
        }

        if (types && types.length > 0) {
            whereClause.type = { [Op.in]: types };
        }

        if (priceMin !== undefined && priceMax !== undefined) {
            whereClause.price = { [Op.between]: [priceMin, priceMax] };
        }

        if (featured !== undefined) {
            whereClause.is_featured = featured === 'true';
        }

        const includeClause = [
            {
                model: Category,
                as: 'category',
                attributes: ['name'],
                required: false, // ❗ QUAN TRỌNG
                where:
                    categories && categories.length > 0
                        ? { name: { [Op.in]: categories } }
                        : undefined,
            },
            {
                model: Discount,
                as: 'discount',
                attributes: ['name', 'percentage'],
            },
        ];

        const queryOptions = {
            where: whereClause,
            include: includeClause,
            order: [['createdAt', 'DESC']],
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const result = await Product.findAndCountAll(queryOptions);

        const rows = result.rows.map((p) => {
            const product = p.toJSON();
            product.originalPrice = product.price;
            product.finalPrice = product.discount
                ? Math.round(product.price * (1 - product.discount.percentage / 100))
                : product.price;
            return product;
        });

        return {
            count: result.count,
            rows,
        };
    }
    async findBySlug(req, res) {
        try {
            const { slug } = req.params;
            const product = await ProductService.findBySlug(slug);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Sản phẩm không tồn tại'
                });
            }

            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy chi tiết sản phẩm',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await ProductService.create(req.body, req.file);
            res.status(200).json({
                success: true,
                message: 'Thêm sản phẩm thành công',
                data
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const data = await ProductService.update(req.params.id, req.body, req.file);
            res.status(200).json({
                success: true,
                message: 'Cập nhật sản phẩm thành công',
                data
            });
        } catch (error) {
            console.log('Loi: ', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await ProductService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm để xóa'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thành công sản phẩm'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa sản phẩm",
                error: error.message
            });
        }
    }

}

module.exports = new ProductController();
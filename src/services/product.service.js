const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Discount = require('../models/discount.model');
const { Op } = require('sequelize');
const { uploadToCloudinary } = require('../utils/multer');

class ProductService {
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

    static async findBySlug(slug) {
        const product = await Product.findOne({
            where: { slug },
            include: [
                { model: Category, as: 'category', attributes: ['name'] },
                { model: Discount, as: 'discount', attributes: ['name', 'percentage'] }
            ]
        });

        if (!product) return null;

        const p = product.toJSON();
        p.originalPrice = p.price;
        if (p.discount) {
            p.finalPrice = Math.round(product.price * (1 - product.discount.percentage / 100));
        } else {
            p.finalPrice = p.price;
        }

        return p;
    }

    static async create(data, file) {
        if (file) {
            const uploadResult = await uploadToCloudinary(file);
            data.image = uploadResult.url;
            data.image_public_id = uploadResult.public_id;
        }
        const product = await Product.create(data);
        return product;
    }

    static async update(id, data, file) {
        const product = await Product.findOne({ where: { id } });
        if (!product) throw new Error('Product not found');

        if (file) {
            // Xóa ảnh cũ trên Cloudinary
            if (product.image_public_id) {
                const cloudinary = require('../config/cloudinaryConfig');
                await cloudinary.uploader.destroy(product.image_public_id);
            }

            const uploadResult = await uploadToCloudinary(file);
            data.image = uploadResult.url;
            data.image_public_id = uploadResult.public_id;
        }

        if (data.discountId === '' || data.discountId === 'null' || data.discountId === null) {
            data.discountId = null;
        } else {
            data.discountId = parseInt(data.discountId, 10);
            if (isNaN(data.discountId)) {
                data.discountId = null;
            }
        }

        return await product.update(data);
    }

    static async delete(id) {
        const product = await Product.findByPk(id);
        if (!product) return 0;

        if (product.image_public_id) {
            const cloudinary = require('../config/cloudinaryConfig');
            await cloudinary.uploader.destroy(product.image_public_id);
        }

        return await Product.destroy({ where: { id } });
    }
}

module.exports = ProductService;

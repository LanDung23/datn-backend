const Category = require('../models/category.model');

class CategoryService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;
        const { Op } = require("sequelize");

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const queryOptions = {
            where: whereClause,
            order: [["id", "ASC"]]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const categories = await Category.findAndCountAll(queryOptions);
        return categories;
    }

    static async create(data) {
        const category = await Category.create(data);
        return category
    }

    static async update(id, data) {
        const category = await Category.findOne({ where: { id: id } });
        if (!category) throw new Error("Không tìm thấy vai trò");
        return await category.update(data);
    }

    static async delete(id) {
        return await Category.destroy({ where: { id: id } })
    }

    static async findAllWithProducts() {
        const categories = await Category.findAll({
            include: [
                {
                    model: require('../models/product.model'),
                    as: 'products',
                    include: [
                        { model: require('../models/discount.model'), as: 'discount', attributes: ['name', 'percentage'] }
                    ]
                }
            ],
            order: [['id', 'ASC']]
        });

        return categories.map(cat => {
            const c = cat.toJSON();
            c.products = c.products.map(p => {
                const prod = { ...p };
                prod.originalPrice = prod.price;

                if (prod.discount) {
                    prod.finalPrice = Math.round(
                        prod.price * (1 - prod.discount.percentage / 100)
                    );
                } else {
                    prod.finalPrice = prod.price;
                }

                if (!prod.price || prod.price === 0) {
                    prod.displayPrice = "Liên hệ";
                } else if (prod.discount) {
                    prod.displayPrice = {
                        old: prod.originalPrice.toLocaleString() + "đ",
                        new: prod.finalPrice.toLocaleString() + "đ"
                    };
                } else {
                    prod.displayPrice = prod.price.toLocaleString() + "đ";
                }

                return prod;
            });
            return c;
        });
    }
}

module.exports = CategoryService;
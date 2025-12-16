const Discount = require('../models/discount.model');

class DiscountService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        if (search) {
            const { Op } = require('sequelize');
            whereClause[Op.or] = [
                { id: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { percentage: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        const queryOptions = {
            where: whereClause,
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const discounts = await Discount.findAndCountAll(queryOptions);
        return discounts;
    }

    static async create(data) {
        const discount = await Discount.create(data);
        return discount;
    }

    static async update(id, data) {
        const discount = await Discount.findOne({ where: { id: id } });
        if (!discount) throw new Error('Discount not found');
        return await discount.update(data);
    }

    static async delete(id) {
        const discount = await Discount.findOne({ where: { id: id } });
        if (!discount) throw new Error('Discount not found');
        return await discount.destroy();
    }
}

module.exports = DiscountService;
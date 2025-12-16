const Contact = require('../models/contact.model');

class ContactService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        const { Op } = require('sequelize');
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { subject: { [Op.like]: `%${search}%` } },
                { message: { [Op.like]: `%${search}%` } },
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
        const contact = await Contact.findAndCountAll(queryOptions);
        return contact;
    }

    static async create(data) {
        const contact = await Contact.create(data);
        return contact;
    }

    static async update(id, data) {
        const contact = await Contact.findOne({ where: { id: id } });
        if (!contact) throw new Error('Contact not found');
        return await contact.update(data);
    }

    static async delete(id) {
        return await Contact.destroy({ where: { id: id } });
    }
}

module.exports = ContactService;
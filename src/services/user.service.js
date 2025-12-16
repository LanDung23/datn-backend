const hashPassword = require('../utils/hashPassword');
const Role = require('../models/role.model');
const User = require('../models/user.model');
const { uploadToCloudinary } = require('../utils/multer');
const cloudinary = require('../config/cloudinaryConfig');

class UserService {
    // Lấy danh sách người dùng với filter, pagination
    static async findAll(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        if (search) {
            const { Op } = require('sequelize');
            whereClause[Op.or] = [
                { id: { [Op.like]: `%${search}%` } },
                { lastname: { [Op.like]: `%${search}%` } },
                { firstname: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { is_active: { [Op.like]: `%${search}%` } },
            ];
        }

        return await User.findAndCountAll({
            where: whereClause,
            include: {
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            },
            offset,
            limit,
            order: [['createdAt', 'ASC']]
        });
    }

    // Tạo người dùng mới
    static async create(data, file) {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }

        if (file) {
            try {
                const uploadResult = await uploadToCloudinary(file);
                data.image = uploadResult.url;
                data.image_public_id = uploadResult.public_id;
            } catch (err) {
                console.error('Upload ảnh thất bại:', err.message);
                throw new Error('Upload ảnh thất bại');
            }
        }

        return await User.create(data);
    }

    // Cập nhật người dùng
    static async update(id, data, file) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('Người dùng không tồn tại');

        // Hash password nếu thay đổi
        if (data.password && data.password !== user.password) {
            data.password = await hashPassword(data.password);
        } else {
            delete data.password;
        }

        // Xử lý file ảnh mới
        if (file) {
            try {
                // Xóa ảnh cũ trên Cloudinary
                if (user.image_public_id) {
                    await cloudinary.uploader.destroy(user.image_public_id);
                }

                const uploadResult = await uploadToCloudinary(file);
                data.image = uploadResult.url;
                data.image_public_id = uploadResult.public_id;
            } catch (err) {
                console.error('Upload ảnh thất bại:', err.message);
                throw new Error('Upload ảnh thất bại');
            }
        }

        return await user.update(data);
    }

    // Xóa người dùng
    static async delete(id) {
        const user = await User.findByPk(id);
        if (!user) return 0;

        if (user.image_public_id) {
            try {
                await cloudinary.uploader.destroy(user.image_public_id);
            } catch (err) {
                console.error('Xóa ảnh thất bại:', err.message);
            }
        }

        return await User.destroy({ where: { id } });
    }
}

module.exports = UserService;

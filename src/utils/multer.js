const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const { normalizeFileName } = require('./normalizeName');

// Multer memoryStorage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPEG/PNG/JPG files are allowed'), false);
    }
});

// Hàm tạo uniqueName
const generateUniqueName = (originalname) => {
    const baseName = normalizeFileName(originalname).replace(/\.[^/.]+$/, '');
    const ext = originalname.substring(originalname.lastIndexOf('.')).toLowerCase();
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const dateStr = `${day}-${month}-${year}`;
    return `${dateStr}-${randomStr}-${baseName}`;
};

const uploadToCloudinary = async (file) => {
    if (!file) throw new Error('No file provided');
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();

    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'uploads',
                public_id: generateUniqueName(file.originalname),
                format: ext.replace('.', '').toLowerCase()
            },
            (err, res) => err ? reject(err) : resolve(res)
        );
        stream.end(file.buffer);
    });

    return { url: result.secure_url, public_id: result.public_id };
};

module.exports = { upload, uploadToCloudinary };

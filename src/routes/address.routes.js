const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');

// Lấy danh sách tỉnh/thành phố
router.get('/provinces', addressController.getProvinces);
// Lấy quận/huyện theo tỉnh
router.get('/districts/:provinceCode', addressController.getDistricts);
// Lấy phường/xã theo quận
router.get('/wards/:districtCode', addressController.getWards);
// Submit địa chỉ (có cả số nhà / đường)
router.post('/submit', addressController.submitAddress);

module.exports = router;

const axios = require('axios');

// Hàm lấy danh sách tỉnh/thành phố
const fetchProvinces = async () => {
    try {
        const res = await axios.get('https://provinces.open-api.vn/api/?depth=1');
        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh:', error.message);
        return [];
    }
};

// Hàm lấy quận/huyện theo tỉnh
const fetchDistricts = async (provinceCode) => {
    try {
        const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        return res.data.districts || [];
    } catch (error) {
        console.error('Lỗi khi lấy quận/huyện:', error.message);
        return [];
    }
};

// Hàm lấy phường/xã theo quận
const fetchWards = async (districtCode) => {
    try {
        const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        return res.data.wards || [];
    } catch (error) {
        console.error('Lỗi khi lấy phường/xã:', error.message);
        return [];
    }
};

module.exports = {
    fetchProvinces,
    fetchDistricts,
    fetchWards
};

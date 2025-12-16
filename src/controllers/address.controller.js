const { fetchProvinces, fetchDistricts, fetchWards } = require('../utils/apiProvinces');

exports.getProvinces = async (req, res) => {
    const data = await fetchProvinces();
    res.json(data);
};

exports.getDistricts = async (req, res) => {
    const { provinceCode } = req.params;
    const data = await fetchDistricts(provinceCode);
    res.json(data);
};

exports.getWards = async (req, res) => {
    const { districtCode } = req.params;
    const data = await fetchWards(districtCode);
    res.json(data);
};

exports.submitAddress = (req, res) => {
    const { street, province, district, ward } = req.body;
    if (!street || !province || !district || !ward) {
        return res.status(400).send('Bạn chưa nhập đầy đủ địa chỉ!');
    }
    const fullAddress = `${street}, ${ward}, ${district}, ${province}`;
    res.send(`Bạn đã gửi địa chỉ đầy đủ: <b>${fullAddress}</b>`);
};

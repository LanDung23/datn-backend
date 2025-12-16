const normalizeName = (str) => {
    if (!str || typeof str !== 'string') return '';

    return str
        .toLowerCase()
        .replace(/đ/g, 'd')
        .replace(/tr/g, 'tr')
        .replace(/ch/g, 'ch')
        .replace(/gh/g, 'g')
        .replace(/kh/g, 'kh')
        .replace(/ng/g, 'ng')
        .replace(/ngh/g, 'ng')
        .replace(/ph/g, 'ph')
        .replace(/th/g, 'th')
        .replace(/nh/g, 'nh')
        .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, 'a')
        .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
        .replace(/[íìỉĩị]/g, 'i')
        .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
        .replace(/[úùủũụưứừửữự]/g, 'u')
        .replace(/[ýỳỷỹỵ]/g, 'y')
        .replace(/ư/g, 'u')
        // Loại bỏ ký tự đặc biệt
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

const normalizeFileName = (filename) => {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1) return normalizeName(filename);

    const name = normalizeName(filename.substring(0, lastDot));
    const ext = filename.substring(lastDot).toLowerCase();
    return name + ext;
}

module.exports = {
    normalizeName,
    normalizeFileName
};

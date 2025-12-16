const bcrypt = require('bcrypt');

module.exports = async function checkPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
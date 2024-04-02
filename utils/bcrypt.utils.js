const bcrypt = require('bcrypt')

module.exports = {
    bcryptCompare: async function (passDB, pass) {
        const isMatch = await bcrypt.compare(pass, passDB);
        return isMatch
    },
    bcryptHash: async function (pass) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);
        return hashedPassword
    },
}
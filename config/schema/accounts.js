const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema

const accounts = new Schema({
    username: String,
    password: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    timezone: 'Asia/Ho_Chi_Minh'
})

accounts.pre('save', async function (next) {
    try {
        if (!this.password) return next()
        const salt = await bcrypt.genSalt(10)
        const hasPass = await bcrypt.hash(this.password, salt)
        this.password = hasPass
        return next()
    } catch (error) {
        return next(error)
    }
})

module.exports = mongoose.model('account', accounts);
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logs = new Schema({
    content: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    timezone: 'Asia/Ho_Chi_Minh'
})

module.exports = mongoose.model('logs_bmw', logs);
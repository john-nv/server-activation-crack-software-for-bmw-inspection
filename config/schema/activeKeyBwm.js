const mongoose = require('mongoose')
const Schema = mongoose.Schema

const activeKeys = new Schema({
    key: String,
    active: Boolean,
    modifyBy: String,
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    timezone: 'Asia/Ho_Chi_Minh'
})


module.exports = mongoose.model('activeKey', activeKeys);
const mongoose = require('mongoose');
require('dotenv').config()

const { activeKeyBwmsSchema } = require('../config/schema')

class activeKeyBMW {

    async activeOne(req, res) {
        try {
            const { key, active } = req.body
            if (typeof active !== 'boolean') return res.status(401).json({ message: 'Không đúng định dạng active' })
            let keyItem = await activeKeyBwmsSchema.findOne({ key })
            if (!keyItem) return res.status(403).json({ message: 'Key không tồn tại' })
            keyItem.active = active
            await keyItem.save()
            return res.status(201).json({ message: 'Active thành công' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    }

    async createKey(req, res) {
        try {
            const { key } = req.body
            let keyItem = await activeKeyBwmsSchema.findOne({ key })
            let msg = keyItem.active ? 'Key đã được kích hoạt' : 'Key chưa được kích hoạt'
            if (keyItem) return res.status(400).json({ message: `Key đã tồn tại. ${msg}`, active: keyItem.active })

            let newKey = new activeKeyBwmsSchema({ key, active: false });
            await newKey.save()
            return res.status(201).json({ message: 'Tạo key thành công. Chưa được active' });
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async checkKey(req, res) {
        try {
            const { key } = req.body
            let keyItem = await activeKeyBwmsSchema.findOne({ key })
            if (!keyItem || keyItem.active == false) return res.status(400).json({ message: 'Key không tồn tại hoặc chưa được kích hoạt', active: false })
            if (keyItem && keyItem.active == true) return res.status(200).json({ message: 'Key đã được kích hoạt thành công', active: keyItem.active })

            return res.status(500).json({ message: 'Lỗi không xác định', status: false });
        } catch (error) {
            res.status(500).json({ message: error.message, status: false })
        }
    }

    async getAllkey(req, res) {
        try {
            const listKey = await activeKeyBwmsSchema.find().select('-_id active key')
            return res.status(200).json(listKey)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new activeKeyBMW
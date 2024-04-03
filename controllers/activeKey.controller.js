const mongoose = require('mongoose');
require('dotenv').config()

const { activeKeyBwmsSchema } = require('../config/schema')
const { logs } = require('../utils')

class activeKeyBMW {

    async activeOne(req, res) {
        try {
            let { userId, active = false } = req.body;
            active = active == 'true' ? true : false
            if (typeof active != 'boolean') return res.status(401).json({ message: 'Không đúng định dạng active' });
            let keyItem = await activeKeyBwmsSchema.findOne({ _id: userId });
            if (!keyItem) return res.status(403).json({ message: 'Key không tồn tại' });
            await activeKeyBwmsSchema.updateOne({ _id: userId }, { active })
            let message = active == true ? '✅✅✅ Kích hoạt thiết bị thành công' : '❌❌❌ Hủy kích hoạt thành công'
            logs.writeLog(`[WEB] ${message}. Key ${keyItem._id} | Thiết bị ${keyItem.key} | Thực hiện bởi ADMIN`);

            return res.status(201).json({ message });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }

    // async createKey(req, res) {
    //     try {
    //         const { key } = req.body
    //         let keyItem = await activeKeyBwmsSchema.findOne({ key })
    //         let msg = keyItem.active ? 'Key đã được kích hoạt' : 'Key chưa được kích hoạt'
    //         if (keyItem) return res.status(400).json({ message: `Key đã tồn tại. ${msg}`, active: keyItem.active })

    //         let newKey = new activeKeyBwmsSchema({ key, active: false });
    //         await newKey.save()
    //         return res.status(201).json({ message: 'Tạo key thành công. Chưa được active', item: newKey });
    //     } catch (error) {
    //         res.status(500).json({ message: error.message })
    //     }
    // }

    async checkKey(req, res) {
        try {
            const { key } = req.body
            if (!key) {
                logs.writeLog(`[APP] Nguy hiểm`);
                res.status(201).json({ message: 'Vui lòng cung cấp key', active: false, item: null });
                return
            }
            let keyItem = await activeKeyBwmsSchema.findOne({ key })
            if (!keyItem) {
                logs.writeLog(`[APP] Đã cho vào danh sách phê duyệt. Key chưa được active | Thiết bị ${key}`);
                let newKey = new activeKeyBwmsSchema({ key, active: false, note: '?' });
                await newKey.save()
                return res.status(201).json({ message: 'Đã cho vào danh sách phê duyệt. Key chưa được active', active: false, item: newKey });
            }
            if (keyItem.active == false) {
                logs.writeLog(`[APP] Truy cập không key. Key chưa được active | Thiết bị ${key}`);
                return res.status(200).json({ message: 'Key chưa được active', active: false, item: keyItem });
            }

            if (keyItem && keyItem.active == true) {
                logs.writeLog(`[APP] Key đã được kích hoạt thành công | Thiết bị ${key}`);
                return res.status(200).json({ message: 'Key đã được kích hoạt thành công', active: keyItem.active, item: keyItem })
            }

            return res.status(500).json({ message: 'Lỗi không xác định', active: false });
        } catch (error) {
            console.error(error)
            res.status(500).json({ active: false })
        }
    }

    async getAllkey(req, res) {
        try {
            const listKey = await activeKeyBwmsSchema.find().select('_id active key note')
            return res.status(200).json(listKey)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error.message })
        }
    }

    async deleteOne(req, res) {
        const { id } = req.body
        if (!id || id.length < 10) return res.status(403).json({ message: "Vui lòng cung cấp ID hợp lệ !" })
        try {
            const delKey = await activeKeyBwmsSchema.deleteOne({ _id: id })
            if (delKey.deletedCount === 1) {
                logs.writeLog(`[WEB] Xóa key thành công ! Key ${id} | Xóa bởi ADMIN`);
                return res.status(201).json({ message: 'Xóa thành công' });
            }
            logs.writeLog(`[WEB] Xóa key không thành công ! Key ${id} | Thực hiện bởi ADMIN`);
            return res.status(500).json({ message: 'Xóa không thành công' });
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    }

    async editNoteOne(req, res) {
        let { id, note } = req.body
        if (!id || id.length < 10) return res.status(403).json({ message: "Vui lòng cung cấp ID hợp lệ !" })
        note = note.length < 1 ? '?' : note
        try {
            const noteKey = await activeKeyBwmsSchema.updateOne({ _id: id }, { note })
            if (noteKey.modifiedCount === 1) {
                logs.writeLog(`[WEB] Thay đổi note ${id} => ${note} | Thay đổi thành công | Thực hiện ADMIN`);
                return res.status(201).json({ message: 'Thay đổi thành công' });
            }
            logs.writeLog(`[WEB] Thay đổi note ${id} => ${note} | Thay đổi không thành công | Thực hiện ADMIN`);
            return res.status(500).json({ message: 'Xóa không thành công' });
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new activeKeyBMW
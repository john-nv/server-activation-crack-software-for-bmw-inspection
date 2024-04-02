const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { accountsSchema, logsBwmsSchema } = require('../config/schema')
const { bcrypt, jsonWebToken, logs } = require('../utils')
const secretKey = process.env.JWT_SECRET;

class accountControllers {

    async login(req, res) {
        try {
            const { username, password } = req.body
            if (username.length < 5 || password.length < 5) return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu phải trên 5 kí tự' })
            const accountDb = await accountsSchema.findOne({ username })
            if (!accountDb) {
                logs.writeLog(`[WEB] Đăng nhập không thành công (Tài khoản không tồn tại)`)
                res.status(403).json({ message: 'Tài khoản không tồn tại' })
                return
            }
            const isCheck = await bcrypt.bcryptCompare(accountDb.password, password)
            if (!isCheck) {
                logs.writeLog(`[WEB] Đăng nhập không thành công (Sai tài khoản hoặc mật khẩu)`)
                res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' })
                return
            }
            const jwtCode = await jsonWebToken.generateJWT({ username })
            logs.writeLog(`[WEB] Đăng nhập thành công`)
            return res.status(201).json({ token: jwtCode })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: error.message })
        }
    }

    async verify(req, res) {
        try {
            const { token } = req.body;
            logs.writeLog(`[WEB] Truy cập`)
            const decodedPayload = await jwt.verify(token, secretKey);
            if (!decodedPayload) return res.status(200).json({ expired: false, message: 'Phiên đăng nhập hết hạn' });
            return res.status(200).json({ expired: true, message: 'Còn hạn sử dụng' });
        } catch (error) {
            console.error('JWT:', error.message);
            return res.status(200).json({ expired: false, message: 'Lỗi từ server' });
        }
    }

    async changePassword(req, res) {
        try {
            let { password, passwordOld } = req.body
            const { username } = req.user

            if (!password || password.length <= 6) return res.status(400).json({ message: 'Mật khẩu quá ngắn. Vui lòng thử lại' })

            let accountDB = await accountsSchema.findOne({ username })
            if (!accountDB) return res.status(403).json({ message: 'Không tìm thấy account' })

            const isCheck = await bcrypt.bcryptCompare(accountDB.password, passwordOld)
            if (!isCheck) {
                logs.writeLog(`[WEB] Thay đổi mật khẩu không thành công. Sai mật khẩu hiện tại`)
                return res.status(401).json({ message: 'Sai mật khẩu' })
            }
            password = await bcrypt.bcryptHash(password)
            let updateResult = await accountsSchema.updateOne({ username }, { password })
            if (updateResult.modifiedCount === 0) return res.status(500).json({ message: 'Không thể cập nhật mật khẩu.' });

            return res.status(200).json({ message: 'Thay đổi mật khẩu thành công.' });
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: error.message })
        }
    }

    // async _registerAccount(req, res) {
    //     try {
    //         const { username, password } = req.body
    //         const searchAccount = await accountsSchema.find({ username })
    //         console.log(searchAccount.length)
    //         if (searchAccount.length > 0) return res.status(400).json({ message: 'Đã tồn tại' })
    //         let newAccount = new accountsSchema({ username, password });
    //         await newAccount.save();

    //         return res.status(201).json(newAccount)
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json(error.message)
    //     }
    // }

    async mdwVerifyJWT(req, res, next) {
        try {
            const token = req.header('Authorization');
            if (!token) return res.status(401).json({ message: 'Token không tồn tại' });

            const tokenParts = token.split(' ');
            if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
                return res.status(401).json({ message: 'Token không hợp lệ' });
            }

            const decodedPayload = await jwt.verify(tokenParts[1], secretKey);
            if (!decodedPayload) return res.status(401).json({ message: 'Phiên đăng nhập hết hạn' });

            req.user = decodedPayload;
            next();
            // return res.status(200).json({ message: 'OK' });
        } catch (error) {
            console.error('Lỗi xác thực JWT:', error.message);
            return res.status(500).json({ message: 'Lỗi xác thực JWT' });
        }
    }

    async getLogs(req, res) {
        try {
            let logs = await logsBwmsSchema.find().sort({ createdAt: -1 }).limit(500).select('-_id content')
            return res.status(200).json(logs)
        } catch (error) {
            console.log(error)
            console.log(error.message)
            res.status(500).json({ message: error.message })
        }
    }

    async deleteAllLogs(req, res) {
        try {
            let logs = await await logsBwmsSchema.deleteMany({})
            return res.status(200).json({ message: 'Xóa toàn bộ các logs thành công' })
        } catch (error) {
            console.log(error)
            console.log(error.message)
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new accountControllers
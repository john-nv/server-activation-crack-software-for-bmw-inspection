const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { accountsSchema } = require('../config/schema')
const { bcrypt, jsonWebToken } = require('../utils')
const secretKey = process.env.JWT_SECRET;

class accountControllers {

    async login(req, res) {
        try {
            const { username, password } = req.body
            if (username.length < 5 || password.length < 5) return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu phải trên 5 kí tự' })
            const accountDb = await accountsSchema.findOne({ username })
            if (!accountDb) return res.status(403).json({ message: 'Tài khoản không tồn tại' })
            const isCheck = await bcrypt.bcryptCompare(accountDb.password, password)
            if (!isCheck) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' })
            const jwtCode = await jsonWebToken.generateJWT({ username })
            return res.status(201).json({ jwt: jwtCode })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: error.message })
        }
    }

    async changePassword(req, res) {
        try {
            let { password } = req.body
            const { username } = req.user

            let updateAccount = await accountsSchema.findOne({ username })
            if (!updateAccount) return res.status(403).json({ message: 'Không tìm thấy account' })
            password = await bcrypt.bcryptHash(password)
            updateAccount = await accountsSchema.updateOne({ username }, { password })
            if (updateAccount.modifiedCount === 0) return res.status(500).json({ message: 'Không thể cập nhật mật khẩu' });
            return res.status(201).json({ message: 'Thay đổi mật khẩu thành công' })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: error.message })
        }
    }

    async _registerAccount(username, password) {
        try {
            let newAccount = { username, password }
            const searchAccount = await accountsSchema.find({ username })
            if (searchAccount.length > 0) return { error: 1, message: 'Đã tồn tại' }
            newAccount = new accountsSchema(newAccount);
            await newAccount.save();

            return {
                error: 0,
                item: newAccount
            }
        } catch (error) {
            console.log(error)
        }
    }

    async initAccount() {
        try {
            setTimeout(async () => {
                await this._registerAccount('admin-extra', 'passwordextrabmw')
                await this._registerAccount('usernameadmin', 'passwordadmin@')
            }, 5000);
        } catch (error) {
            console.log(error)
        }
    }

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
        } catch (error) {
            console.error('Lỗi xác thực JWT:', error.message);
            return res.status(500).json({ message: 'Lỗi xác thực JWT' });
        }
    }
}

module.exports = new accountControllers
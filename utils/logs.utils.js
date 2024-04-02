const mongoose = require('mongoose');
const moment = require('moment-timezone');
require('dotenv').config();

const { logsBwmsSchema } = require('../config/schema');

module.exports = {
    writeLog: async function (content) {
        try {
            const time = moment.tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY | HH:mm:ss')
            const logNew = new logsBwmsSchema({ content: `[${time}] ${content}` })
            await logNew.save()
            return logNew
        } catch (error) {
            console.error(error)
            throw error;
        }
    },
};

const moment = require('moment-timezone');

module.exports = {
    getDateToday: () => {
        const now = moment.tz('Asia/Ho_Chi_Minh');
        console.log(now)
        return now.format('DD-MM-YYYY | HH:mm:ss')
    },
};
const account = require('./account.router')
const activeKey = require('./activeKey.router')

function router(app) {
    app.use('/account', account)
    app.use('/key', activeKey)
}

module.exports = router
const router = require('express').Router()

const activeKeyControllers = require('../controllers/activeKey.controller')
const accountControllers = require('../controllers/account.controller')

router.post('/active', accountControllers.mdwVerifyJWT, activeKeyControllers.activeOne)
router.post('/getAllkey', accountControllers.mdwVerifyJWT, activeKeyControllers.getAllkey)
router.post('/checkKey', activeKeyControllers.checkKey)
// router.post('/createKey', activeKeyControllers.createKey)

module.exports = router



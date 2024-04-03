const router = require('express').Router()

const activeKeyControllers = require('../controllers/activeKey.controller')
const accountControllers = require('../controllers/account.controller')

router.post('/checkKey', activeKeyControllers.checkKey)
// router.post('/createKey', activeKeyControllers.createKey)

router.post('/active', accountControllers.mdwVerifyJWT, activeKeyControllers.activeOne)
router.post('/getAllkey', accountControllers.mdwVerifyJWT, activeKeyControllers.getAllkey)
router.post('/deleteOne', accountControllers.mdwVerifyJWT, activeKeyControllers.deleteOne)
router.post('/editNoteOne', accountControllers.mdwVerifyJWT, activeKeyControllers.editNoteOne)

module.exports = router



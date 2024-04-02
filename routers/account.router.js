const router = require('express').Router()

const accountControllers = require('../controllers/account.controller')

router.post('/login', accountControllers.login)
router.post('/verify', accountControllers.verify)
router.post('/getLogs', accountControllers.mdwVerifyJWT, accountControllers.getLogs)
router.post('/deleteAllLogs', accountControllers.mdwVerifyJWT, accountControllers.deleteAllLogs)
router.post('/changePassword', accountControllers.mdwVerifyJWT, accountControllers.changePassword)
// router.post('/mdwVerifyJWT', accountControllers.mdwVerifyJWT)
// router.post('/registerAccount', accountControllers._registerAccount)

module.exports = router
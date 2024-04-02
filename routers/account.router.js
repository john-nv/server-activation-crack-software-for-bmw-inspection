const router = require('express').Router()

const accountControllers = require('../controllers/account.controller')

router.post('/login', accountControllers.login)
router.post('/changePassword', accountControllers.mdwVerifyJWT, accountControllers.changePassword)

module.exports = router
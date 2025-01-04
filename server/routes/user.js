const Router = require('express')
const router = new Router()
const user_controller = require('../controllers/user_controller')
const AuthorizationMiddleware = require('../middleware/AuthorizationMiddleware')

router.post('/registration', user_controller.registration)
router.post('/login', user_controller.login)
router.get('/authorized', AuthorizationMiddleware, user_controller.isAuthorized)


module.exports = router
const Router = require('express')
const router = new Router()
const user_controller = require('../controllers/user_controller')

router.post('/registration', user_controller.registration)
router.post('/login', user_controller.login)
router.get('/authorized', user_controller.isAuthorized)

module.exports = router
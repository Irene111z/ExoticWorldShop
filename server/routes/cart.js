const Router = require('express')
const router = new Router()
const cart_controller = require('../controllers/cart_controller')
const roleControll = require('../middleware/RoleControllMiddleware')

router.get('/', cart_controller.getCart)

module.exports = router
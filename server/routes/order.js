const Router = require('express')
const router = new Router()
const order_controller = require('../controllers/order_controller')
const roleControll = require('../middleware/RoleControllMiddleware')
const AuthorizationMiddleware = require('../middleware/AuthorizationMiddleware')

//router.get('/', AuthorizationMiddleware, order_controller.getOrder)
router.post('/', AuthorizationMiddleware, order_controller.createOrder)
// router.delete('/item/:productId', AuthorizationMiddleware, order_controller.deleteProductFromCart)
// router.put('/incItem', AuthorizationMiddleware, order_controller.increaseCartItem)
// router.put('/decItem', AuthorizationMiddleware, order_controller.decreaseCartItem)
// router.delete('/', AuthorizationMiddleware, order_controller.clearCart)

module.exports = router
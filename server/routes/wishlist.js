const Router = require('express')
const router = new Router()
const wishlist_controller = require('../controllers/wishlist_controller')
const AuthorizationMiddleware = require('../middleware/AuthorizationMiddleware')

router.get('/', AuthorizationMiddleware, wishlist_controller.getWishlist)
router.post('/addProduct', AuthorizationMiddleware, wishlist_controller.addProductToWishlist)
router.delete('/removeProduct', AuthorizationMiddleware, wishlist_controller.deleteProductFromWishlist)
router.delete('/clearWishlist', AuthorizationMiddleware, wishlist_controller.clearWishlist)

module.exports = router
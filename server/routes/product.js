const Router = require('express')
const router = new Router()
const product_controller = require('../controllers/product_controller')
const roleControll = require('../middleware/RoleControllMiddleware')

router.post('/', roleControll('admin'), product_controller.createProduct)
router.get('/', product_controller.getAllProducts)
router.get('/search', product_controller.searchProductByName)
router.get('/:id', product_controller.getProduct)
router.delete('/:id', roleControll('admin'), product_controller.deleteProduct)
router.put('/:id', roleControll('admin'), product_controller.changeProduct)

module.exports = router
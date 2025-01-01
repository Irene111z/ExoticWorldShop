const Router = require('express')
const router = new Router()
const product_controller = require('../controllers/product_controller')

router.post('/', product_controller.createProduct)
router.get('/', product_controller.getAllProducts)
router.get('/:id', product_controller.getProduct)
router.delete('/:id', product_controller.deleteProduct)

module.exports = router
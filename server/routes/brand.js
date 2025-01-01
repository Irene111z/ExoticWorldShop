const Router = require('express')
const router = new Router()
const brand_controller = require('../controllers/brand_controller')

router.post('/', brand_controller.createBrand)
router.get('/', brand_controller.getAllBrands)
router.delete('/', brand_controller.deleteBrand)

module.exports = router
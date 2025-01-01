const Router = require('express')
const router = new Router()
const category_controller = require('../controllers/category_controller')

router.post('/', category_controller.createCategory)
router.get('/', category_controller.getAllCategories)
router.delete('/:id', category_controller.deleteCategory)
router.put('/:id', category_controller.updateCategory)

module.exports = router
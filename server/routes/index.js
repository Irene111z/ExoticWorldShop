const Router = require('express')
const router = new Router()

const product = require('./product')
const user = require('./user')
const brand = require('./brand')
const category = require('./category')
const cart = require('./cart')

router.use('/user', user)
router.use('/category', category)
router.use('/product', product)
router.use('/brand', brand)
router.use('/cart', cart)

module.exports = router
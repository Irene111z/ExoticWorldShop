const Router = require('express')
const router = new Router()
const user_controller = require('../controllers/user_controller')
const AuthorizationMiddleware = require('../middleware/AuthorizationMiddleware')
const roleControll = require('../middleware/RoleControllMiddleware')

router.post('/reg', user_controller.registration)
router.post('/login', user_controller.login)
router.get('/auth', AuthorizationMiddleware, user_controller.auth)
router.get('/profile', AuthorizationMiddleware, user_controller.getUserProfile)
router.put('/profile', AuthorizationMiddleware, user_controller.editUserProfile)
router.get('/', roleControll('admin'), user_controller.getAllUsers)
module.exports = router
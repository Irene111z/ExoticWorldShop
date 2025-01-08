const ApiError = require('../errors/ApiError')
const user_service = require('../services/user_service')

class UserController{
    async registration(req, res, next){
        try {
            const jwt_token = await user_service.registerUser(req.body)
            return res.json({jwt_token})
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async login(req, res, next){
        try {
            const jwt_token = await user_service.loginUser(req.body)
            return res.json({jwt_token})
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
        
    }
    async auth(req, res, next){
        try {
            const jwt_token = createJWT(req.user.id, req.user.email, req.user.role)
            res.json({jwt_token})
        }
        catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async getUserProfile(req, res, next){
        try {
            const userProfile = await user_service.getUserById(req.params.id)
            res.status(200).json(userProfile);
        }
        catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async getAllUsers(req, res, next){
        try {
            const users = await user_service.getAllUsers()
            res.status(200).json(users);
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async editUserProfile(req, res, next)
    {
        try {
            const profile = await user_service.changeUserProfile(req.params.id, req.body, req.files)
            res.status(200).json(profile);
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
}

module.exports = new UserController()
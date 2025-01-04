const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ApiError = require('../errors/ApiError')
const {User, Cart} = require('../models/models')
const { query } = require('../database')

const createJWT = (id, email, role) =>{
    return jwt.sign({id, email, role},
        process.env.SECRET_KEY,
         {expiresIn:'24h'})
}

class UserController{
    async registration(req, res, next){
        try {
            const {email, name, lastname, phone, password, role} = req.body
            if(!email){
                return next(ApiError.badRequest('Введіть email'))
            }
            if(!name){
                return next(ApiError.badRequest('Введіть ім\'я'))
            }
            if(!lastname){
                return next(ApiError.badRequest('Введіть прізвище'))
            }
            if(!phone){
                return next(ApiError.badRequest('Введіть номер телефону'))
            }
            if(!password){
                return next(ApiError.badRequest('Введіть пароль'))
            }
            const authorizedUser = await User.findOne({where:{email}})
            if(authorizedUser){
                return next(ApiError.badRequest('Користувач з такою потштою вже зареєстрований'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email, name, lastname, phone, password:hashPassword, role})
            const cart = await Cart.create({userId:user.id})
            const jwt_token = createJWT(user.id, user.email, user.role)
            return res.json({jwt_token})
        } 
        catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async login(req, res, next){
        try {
            const {email, password} = req.body
            const user = await User.findOne({where:{email}})
            if(!user){
                return next(ApiError.notFound(`Користувача ${email} не існує`))
            }
            let checkPassword = bcrypt.compareSync(password, user.password)
            if(!checkPassword){
                return next(ApiError.badRequest('Неправильний пароль'))
            }
            const jwt_token = createJWT(user.id, user.email, user.role)
            return res.json({jwt_token})
            
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
        
    }
    async isAuthorized(req, res, next){
        try {
            const jwt_token = createJWT(req.user.id, req.user.email, req.user.role)
            res.json({jwt_token})
        }
        catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
}

module.exports = new UserController()
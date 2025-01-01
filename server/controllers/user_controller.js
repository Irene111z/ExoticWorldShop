const ApiError = require('../errors/ApiError')
class UserController{
    async registration(req, res){

    }
    async login(req, res){

    }
    async isAuthorized(req, res, next){
        const {id} = req.query
        if(!id){
           return  next(ApiError.badRequest('you must input ID'))
        }
        res.json(id)
    }
}

module.exports = new UserController()
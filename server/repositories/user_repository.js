const {User, Cart} = require('../models/models')

class UserRepository{
    async getUserByEmail(email){
        return await User.findOne({where:{email}})
    }
    async createUser(data){
        return await User.create(data)
    }
    async createUserCart(id){
        return await Cart.create({userId:id})
    }
    async getUserById(id){
        return await User.findByPk(id)
    }
    async getAllUsers(){
        return await User.findAndCountAll({
            where: {
                role: 'user'
            },
            attributes: ['email', 'name', 'lastname', 'phone']
        })
    }
}

module.exports = new UserRepository()
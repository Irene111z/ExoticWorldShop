const user_repository = require('../repositories/user_repository')
const {createJWT} = require('../utils/jwt')

class UserService{
    async registerUser(data){
        const existingUser = await user_repository.getUserByEmail(data.email)
        if(existingUser){
            throw new Error('Користувач з такою потштою вже зареєстрований')
        }
        const user = await user_repository.createUser(data)
        const cart = await user_repository.createUserCart(user.id)
        return createJWT(user.id, user.email, user.role)
    }
    async loginUser(data){
        const {email, password} = data
        const user = await user_repository.getUserByEmail(email)
        if(!user){
            throw new Error(`Користувача ${email} не існує`)
        }
        let isPasswordValid = await user.validatePassword(password)
        if(!isPasswordValid){
            throw new Error('Неправильний пароль')
        }
        return createJWT(user.id, user.email, user.role)
    }
    async getUserById(id){
        return await user_repository.getUserById(id)
    }
    async getAllUsers(){
        return await user_repository.getAllUsers()
    }
}
module.exports = new UserService()
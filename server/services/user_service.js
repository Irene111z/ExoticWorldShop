const user_repository = require('../repositories/user_repository')
const {createJWT} = require('../utils/jwt')
const uuid = require('uuid')
const path = require('path')

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
    async changeUserProfile(id, data, files){
        const user = await user_repository.getUserById(id)
        if(!user){
            throw new Error(`Користувача не існує`)
        }
        const { img } = files;
        if (img) {
            if (img.mimetype.startsWith('image')) {
                const fileName = uuid.v4() + ".jpg";
                const uploadPath = path.resolve(__dirname, '..', 'static', fileName);
    
                await img.mv(uploadPath, (err) => {
                    if (err) {
                        throw new Error('Не вдалося завантажити зображення');
                    }
                });
                data.img = fileName;
            } else {
                throw new Error('Файл не є зображенням');
            }
        }
        return await user_repository.updateUserProfile(id, data)
    }
}
module.exports = new UserService()
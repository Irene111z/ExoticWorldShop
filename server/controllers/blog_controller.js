const ApiError = require('../errors/ApiError')
const blog_service = require('../services/blog_service')

class BlogController{
    async createPost(req, res, next){
        try {
            const {title, content, authorIds} = req.body
            console.log(req.body.authorIds);

            if(!title){
                return next(ApiError.badRequest("Заголовок обов'язковий для створення посту"))
            }
            if(!req.files){
                return next(ApiError.badRequest("Фото попереднього перегляду обов'язкове для створення посту"))
            }
            if(!content){
                return next(ApiError.badRequest("Зміст посту обов'язковий для створення посту"))
            }
            if (authorIds.length === 0){
                return next(ApiError.badRequest("Вкажіть принаймні одного автора"))
            }
            const post = await blog_service.createPost(title, req.files, content, authorIds)
            return res.status(200).json(post)

        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async editPost(req, res, next){
        try {
            const post = await blog_service.editPost(req.params.id, req.body)
            return res.status(200).json(post)
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async deletePost(req, res, next){
        try {
            await blog_service.deletePost(req.params.id)
            return res.status(200).json("Пост успішно видалено")
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async getAllPosts(req, res, next){
        try {
            const posts = await blog_service.getAllPosts()
            return res.status(200).json(posts)
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async getFullPost(req, res, next){
        try {
            const post = await blog_service.getFullPost(req.params.id)
            return res.status(200).json(post)
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
}

module.exports = new BlogController()
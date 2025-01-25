const blog_repository = require('../repositories/blog_repository')
const uuid = require('uuid')
const path = require('path')

class BlogService{
    async createPost(title, files, content, authorIds){
        const post = await blog_repository.getPostByTitle(title)
        const fileName = uuid.v4()+".jpg"
        const {preview} = files
        preview.mv(path.resolve(__dirname, '..','static',fileName))

        if(post){
            throw new Error("Пост з таким заголовком вже існує")
        }
        return await blog_repository.createPost(title, fileName, content, authorIds)
    }
    async editPost(id, data){
        const post = await blog_repository.getPostById(id)
        if(!post){
            throw new Error("Пост не знайдено")
        }
        return await blog_repository.updatePost(post, data)
    }
    async deletePost(id){
        const post = await blog_repository.getPostById(id)
        if(!post){
            return next(ApiError.badRequest("Пост не знайдено"))
        }
        return await blog_repository.deletePost(post)
    }
    async getAllPosts(){
        return await blog_repository.getAllPosts()
    }
    async getFullPost(id){
        return await blog_repository.getFullPost(id)
    }
}

module.exports = new BlogService()
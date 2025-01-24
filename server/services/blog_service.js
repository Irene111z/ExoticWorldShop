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
}

module.exports = new BlogService()
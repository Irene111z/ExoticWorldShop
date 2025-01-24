const {Author, Post, PostAuthor} = require('../models/models')

class BlogRepository{
    async createPost(title, preview, content, authorIds){
        const post = await Post.create({title, preview, content})
        const authors = await Author.findAll({
            where: {
                id: authorIds
            }
        });
        await post.addAuthors(authors);
        return post;
    }
    async getPostByTitle(title){
       return await Post.findOne({where:{title}})
    }
}

module.exports = new BlogRepository()
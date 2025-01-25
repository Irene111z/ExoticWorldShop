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
    async getPostById(id){
        return await Post.findByPk(id)
     }
    async updatePost(post, data){
        const {title, authorIds} = data
        if(title && title !== post.title){
            const existingPost = await this.getPostByTitle(title)
            if(existingPost){
                throw new Error("Пост з такою назвою вже існує, оберіть іншу назву")
            }
        }
        if(authorIds && authorIds.length <1){
            throw new Error("Пост має мати принаймні одного автора")
        }
        Object.assign(post, data);
        return await post.save();
    }   
    async deletePost(post){
        return await post.destroy()
    }
    async getAllPosts(){
        return await Post.findAndCountAll({attributes: ['title', 'preview']})
    }
    async getFullPost(id){
        const post = await Post.findOne({where:{id},
            attributes: ['title', 'preview', 'content', 'createdAt'],
            include: [
                {
                    model: Author,
                    attributes: ['name', 'lastname', 'occupation', 'workplace', 'sity'],
                    through: { attributes: [] }
                }
            ]
        })
        const formattedPost = post.get({ plain: true });
        formattedPost.createdAt = new Date(formattedPost.createdAt).toISOString().split('T')[0];
        return formattedPost;
    }
}

module.exports = new BlogRepository()
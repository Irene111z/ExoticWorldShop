const blog_repository = require('../repositories/blog_repository')
const uuid = require('uuid')
const path = require('path')
const { cloudinary } = require('../utils/cloudinary');
const streamifier = require('streamifier');

class BlogService {
    async createPost(title, files, content, authorIds) {
        const existingPost = await blog_repository.getPostByTitle(title);
        if (existingPost) {
            throw new Error("Пост з таким заголовком вже існує");
        }

        const { preview } = files;
        if (!preview) {
            throw new Error("Фото попереднього перегляду обов'язкове");
        }

        // Завантаження preview-зображення на Cloudinary
        const uploadStream = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'posts',
                        resource_type: 'image'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(preview.data).pipe(stream);
            });
        };

        const result = await uploadStream();

        // Створення посту
        return await blog_repository.createPost(title, result.secure_url, content, authorIds);
    }
    async editPost(id, data, previewFile) {
        const post = await blog_repository.getPostById(id);
        if (!post) {
            throw new Error("Пост не знайдено");
        }
    
        const { title, content, authorIds } = data;
    
        
        // Оновлення заголовка посту
        if (title && title !== post.title) {
            const existingPost = await blog_repository.getPostByTitle(title);
            if (existingPost) {
                throw new Error("Пост з таким заголовком вже існує");
            }
            post.title = title;
        }
    
        // Оновлення контенту посту
        if (content !== undefined) {
            post.content = content;
        }
    
        // Оновлення авторів
        if (authorIds && authorIds.length > 0) {
            // Оновлюємо авторів посту
            await post.setAuthors(authorIds);
        }
    
        // Якщо потрібно оновити зображення прев'ю
        if (previewFile) {
            // Видалення старого зображення з Cloudinary
            const publicId = post.preview.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`posts/${publicId}`);
    
            // Завантаження нового зображення на Cloudinary
            const uploadStream = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'posts',
                            resource_type: 'image',
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    streamifier.createReadStream(previewFile.data).pipe(stream);
                });
            };
    
            const result = await uploadStream();
            // Оновлення URL прев'ю
            post.preview = result.secure_url;
        }
    
        // Оновлення посту в базі даних
        await post.save();
        return post;
    }
    

    async deletePost(id) {
        const post = await blog_repository.getPostById(id)
        if (!post) {
            return next(ApiError.badRequest("Пост не знайдено"))
        }
        return await blog_repository.deletePost(post)
    }
    async getAllPosts(page, limit) {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        return await blog_repository.getAllPosts(pageNumber, limitNumber)
    }
    async getFullPost(id) {
        try {
            const post = await blog_repository.getFullPost(id);
            if (!post) {
                throw new Error('Пост не знайдено.');
            }
            return post;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new BlogService()
const product_repository = require('../repositories/product_repository')
const uuid = require('uuid')
const path = require('path')
const { Op } = require('sequelize');
const { Review } = require('../models/models');

class ProductService {
    async createProduct(data, files){
        const { name, price, disc_price, description, quantity, categoryId, brandId, productFeatures } = data;
        const { img } = files;
        const fileName = uuid.v4()+".jpg"
        img.mv(path.resolve(__dirname, '..','static',fileName))

        const product = await product_repository.createProduct({
            name, price, disc_price, description, quantity, categoryId, brandId, img: fileName
        });
        if (productFeatures) {
            const features = JSON.parse(productFeatures);
            for (const feature of features) {
                await product_repository.addProductFeature({
                    name: feature.name,
                    description: feature.description,
                    productId: product.id,
                });
            }
        }
        return product;
    }

    async deleteProduct(id){
        const product = await product_repository.getProductById(id);
        if (!product) {
            throw new Error("Товару не існує");
        }
        await product_repository.deleteProduct(id)
    }

    async getAllProducts(query) {
        const { brandId, categoryId, limit = 12, page = 1 } = query
        const offset = page * limit - limit
    
        let filter = {};
        if (brandId) filter.brandId = brandId
    
        if (categoryId) {
            const subcategoryIds = await product_repository.getSubcategories(categoryId);
            filter.categoryId = { [Op.in]: [categoryId, ...subcategoryIds] }
        }
    
        return await product_repository.getAllProducts(filter, limit, offset)
    }
    async getProduct(id) {
        return await product_repository.getProduct(id);
    }
    async searchProductByName(query){
        const { name, limit = 12, page = 1 } = query
        const offset = page * limit - limit
        return await product_repository.searchByName(name, limit, offset)

    }
    async changeProduct(id, data) {
        return await product_repository.updateProduct(id, data);
    }
    async getProductReviews(productId){
        const product = await product_repository.getProductById(productId)
        if(!product){
            throw new Error("Товар не знайдено")
        }
        return await product_repository.getProductReviews(productId)
    }
    async createProductReview(userId, productId, data){
        const product = await product_repository.getProductById(productId)
        if(!product){
            throw new Error("Товар не знайдено")
        }
        const hasReviewed = await product_repository.hasUserReviewedProduct(userId, productId)
        if(hasReviewed){
            throw new Error("Ви вже залишали відгук для цього товару")
        }
        const {rate, comment} = data
        if(!rate){
            throw new Error("Оцінка товару обов'язкова для залишення відгуку")
        }
        if(rate > 5 || rate < 1){
            throw new Error("Оцінка товару обов'язкова (1-5)")
        }
        return await product_repository.createProductReview({userId, productId, rate, comment})
    }
    async deleteProductReview(userId, reviewId){
        const review = await product_repository.getReviewById(reviewId)
        if(!review){
            throw new Error("Відгук не знайдено")
        }
        if(userId !== review.userId){
            throw new Error("Недостатньо прав для видалення чужого відгуку")
        }
        return await product_repository.deleteProductReview(review)
    }
    async findProductByReviewId(reviewId){
        return await product_repository.findProductByReviewId(reviewId)
    }
}

module.exports = new ProductService();
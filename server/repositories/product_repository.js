const {Product, ProductFeatures, Category, Review, ProductImage} = require('../models/models')
const { Op } = require("sequelize");

class ProductRepository{
    async createProduct(data) {
        return await Product.create(data);
    }
    async addProductImage({ productId, img, isPreview }) {
        return await ProductImage.create({ productId, img, isPreview });
    }
    async addProductFeature({ name, description, productId }) {
        return await ProductFeatures.create({ name, description, productId });
    }
    async deleteProduct(id){
        const product = await Product.findByPk(id)
        if(product){
            product.destroy()
        }
    }
    async getProduct(id) {
        const product = await Product.findOne({
            where: { id },
            include: [
                { model: ProductFeatures },
                { model: Review, attributes: ['rate'] },
                { model: ProductImage, attributes: ['img', 'isPreview'] }
            ]
        });
    
        if (!product) throw new Error("Товар не знайдено");
    
        const ratings = product.reviews.map(r => r.rate);
        const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    
        return { ...product.toJSON(), averageRating: parseFloat(avgRating.toFixed(2)) };
    }
    async getAllProducts(filter, limit, offset) {
        return await Product.findAndCountAll({
            where: filter,
            limit,
            offset,
            include: [
                {
                  model: ProductImage,
                  as: 'images',
                  required: false
                }
              ]
        });
    }
    async getProductById(id) {
        return await Product.findByPk(id);
    }
    async searchByName(name, limit, offset) {
        if (!name) return { count: 0, rows: [] };
        return await Product.findAndCountAll({
            where: { name: { [Op.iLike]: `%${name}%` } },
            limit,
            offset,
        });
    }
    
    async getSubcategories(parentId) {
        const subcategories = await Category.findAll({ where: { parentId } });
        let ids = subcategories.map(sub => sub.id);

        for (const subcategory of subcategories) {
            const childIds = await this.getSubcategories(subcategory.id);
            ids = ids.concat(childIds);
        }

        return ids;
    }
    async updateProduct(id, data) {
        const product = await this.getProductById(id);
        if (!product) {
            throw new Error("Товар не знайдено");
        }

        Object.assign(product, data);
        return await product.save();
    }
    async getProductReviews(productId){
        return await Review.findAndCountAll({where:{productId}})
    }
    async createProductReview(data){
        return await Review.create(data)
    }
    async findProductByReviewId(reviewId){
        reviewId = Number(reviewId)
        const review = await Review.findByPk(reviewId)
        if(!review){
            throw new Error("Відгук не знайдено")
        }
        return await Product.findOne({where:{id:review.productId}})
    }
    async getReviewById(reviewId){
        return await Review.findByPk(reviewId)
    }
    async deleteProductReview(review){
        return await review.destroy()
    }
    async hasUserReviewedProduct(userId, productId){
        return await Review.findOne({where:{userId, productId}})
    }
}

module.exports = new ProductRepository()
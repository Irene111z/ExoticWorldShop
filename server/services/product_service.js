const product_repository = require('../repositories/product_repository')
const uuid = require('uuid')
const path = require('path')
const { Op } = require('sequelize');

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
        return await product_repository.getProductById(id);
    }
    async searchProductByName(query){
        const { name, limit = 12, page = 1 } = query
        const offset = page * limit - limit
        return await product_repository.searchByName(name, limit, offset)

    }
    async changeProduct(id, data) {
        return await product_repository.updateProduct(id, data);
    }
}

module.exports = new ProductService();
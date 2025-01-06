const {Product, ProductFeatures, Category} = require('../models/models')
const { Op } = require("sequelize");

class ProductRepository{
    async createProduct(data){
        return await Product.create(data)
    }
    async deleteProduct(id){
        const product = await Product.findByPk(id)
        if(product){
            product.destroy()
        }
    }
    async getProduct(id) {
        return await Product.findOne({
            where: { id },
            include: [{ model: ProductFeatures }],
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
    async getAllProducts(filter, limit, offset) {
        return await Product.findAndCountAll({
            where: filter,
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
}

module.exports = new ProductRepository()
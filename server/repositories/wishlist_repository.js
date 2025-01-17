const {Product, Wishlist, WishlistProduct} = require('../models/models')

class WishlistRepository{
    async createWishlist(userId) {
        return await Wishlist.create({ userId });
    }
    async getWishlistProducts(userId){
        const wishlist = await Wishlist.findOne({
            where: { userId },
            include: [
                {
                    model: Product,
                    through: { attributes: [] },
                },
            ],
        });
        if (!wishlist) {
            throw new Error("Списку бажань не знайдено");
        }
        return wishlist
    }
    async getWishlistByUserId(userId){
        return await Wishlist.findOne({where:{userId}})
    }
    async addProduct(wishlistId, productId){
        const product = await Product.findByPk(productId)
        if(!product){
            throw new Error("Товар не знайдено")
        }
        const wishlistProduct = await WishlistProduct.findOne({where:{wishlistId, productId}})
        if(wishlistProduct){
            throw new Error("Товар вже додано до списку бажань")
        }
        return await WishlistProduct.create({wishlistId, productId})
    }
    async removeProduct(wishlistId, productId){
        const product = await Product.findByPk(productId)
        if(!product){
            throw new Error("Товар не знайдено")
        }
        const wishlistProduct = await WishlistProduct.findOne({where:{wishlistId, productId}})
        if(!wishlistProduct){
            throw new Error("Товар не знайдено в списку бажань")
        }
        return await WishlistProduct.destroy({ where: { wishlistId, productId } });
    }
    async clearWishlist(wishlistId){
        await WishlistProduct.destroy({ where: { wishlistId }});
    }
}

module.exports = new WishlistRepository()
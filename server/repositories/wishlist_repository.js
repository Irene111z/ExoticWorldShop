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
        return await WishlistProduct.create({wishlistId, productId})
    }
    async removeProduct(wishlistId, productId){
        return await WishlistProduct.destroy({ where: { wishlistId, productId } });
    }
    async clearWishlist(wishlistId){
        await WishlistProduct.destroy({ where: { wishlistId }});
    }
}

module.exports = new WishlistRepository()
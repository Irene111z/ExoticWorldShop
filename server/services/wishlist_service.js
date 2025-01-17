const wishlist_repository = require('../repositories/wishlist_repository')

class WishlistService{
    async getWishlist(userId){
        return await wishlist_repository.getWishlistProducts(userId)
    }
    async addProduct(userId, productId){
        await wishlist_repository.addProduct(userId, productId)
        return await wishlist_repository.getWishlistProducts(userId)
    }
    async removeProduct(userId, productId){
        await wishlist_repository.removeProduct(userId, productId)
        return await wishlist_repository.getWishlistProducts(userId)
    }
    async clearWishlist(userId){
        await wishlist_repository.clearWishlist(userId)
        return await wishlist_repository.getWishlistProducts(userId)
    }
}

module.exports = new WishlistService()
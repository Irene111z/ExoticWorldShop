const wishlist_repository = require('../repositories/wishlist_repository')

class WishlistService{
    async getWishlist(userId){
        return await wishlist_repository.getWishlistProducts(userId)
    }
    async addProduct(userId, productId){
        const wishlist = await wishlist_repository.getWishlistByUserId(userId)
        await wishlist_repository.addProduct(wishlist.id, productId)
        return await wishlist_repository.getWishlistProducts(userId)
    }
    async removeProduct(userId, productId){
        const wishlist = await wishlist_repository.getWishlistByUserId(userId)
        await wishlist_repository.removeProduct(wishlist.id, productId)
        return await wishlist_repository.getWishlistProducts(userId)
    }
    async clearWishlist(userId){
        const wishlist = await wishlist_repository.getWishlistByUserId(userId)
        await wishlist_repository.clearWishlist(wishlist.id)
        return await wishlist_repository.getWishlistProducts(userId)
    }
}

module.exports = new WishlistService()
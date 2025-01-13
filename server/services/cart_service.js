const cart_repository = require('../repositories/cart_repository')

class CartService{
    async getCart(userId){
        const cart = await cart_repository.getUserCart(userId)
        return await cart_repository.getUserCart(cart.id)
    }
    async addProductToCart(userId, data){
        const {productId, quantity} = data
        const cart = await cart_repository.getUserCart(userId)
        return await cart_repository.addCartItem(cart.id, productId, quantity)
    }
    async removeProductFromCart(userId, productId){
        const cart = await cart_repository.getUserCart(userId)
        return await cart_repository.deleteCartItem(cart.id, productId)
    }
    async incCartItem(userId, productId){
        const cart = await cart_repository.getUserCart(userId)
        return await cart_repository.incCartItem(cart.id, productId)
    }
    async decCartItem(userId, productId){
       const cart = await cart_repository.getUserCart(userId)
       return await cart_repository.decCartItem(cart.id, productId)
    }
    async clearCart(userId){
        const cart = await cart_repository.getUserCart(userId)
        return await cart_repository.clearCart(cart.id)
    }
}

module.exports = new CartService()
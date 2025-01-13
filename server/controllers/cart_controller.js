const ApiError = require('../errors/ApiError')
const { query } = require('../database')
const cart_service = require('../services/cart_service')

class CartController{
    async getCart(req, res, next){
        try {
            const cart = await cart_service.getUserCart(req.user.id)
            return res.status(200).json(cart)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async addProductToCart(req, res, next){
        try {
            const cartItem = await cart_service.addProductToCart(req.user.id, req.body)
            return res.status(200).json(cartItem)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async deleteProductFromCart(req, res, next){
        try {
            await cart_service.removeProductFromCart(req.user.id)
            return res.status(200).json({message:"Товар був видалений з кошику"})
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async increaseCartItem(req, res, next){
        try {
            const cartItem = await cart_service.incCartItem(req.user.id, req.body)
            return res.status(200).json(cartItem)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async decreaseCartItem(req, res, next){
        try {
            const cartItem = await cart_service.decCartItem(req.user.id, req.body)
            return res.status(200).json(cartItem)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async clearCart(req, res, next){
        try {
            await cart_service.clearCart(req.user.id)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
}

module.exports = new CartController()
const {Product, Cart, CartItem} = require('../models/models')

class CartRepository{
    async getCart(cartId){
        return await Cart.findOne({
            where: { id: cartId },
            include: [
                {
                    model: CartItem,
                    include: [Product],
                },
            ],
        })
    }
    async addCartItem(cartId, productId, quantity){
        const cartItem = await CartItem.findOne({where:{cartId, productId}})
        const product = await Product.findOne({ where: { id: productId } })
        if(!product){
            throw new Error("Товар не знайдено")
        }
        if (product.quantity < quantity) {
            throw new Error(`Недостатньо товару на складі, усього залишилося ${quantity} од.`);
        }
        if(cartItem){
            cartItem.quantity += quantity
            if (product.quantity < cartItem.quantity) {
                throw new Error('Недостатньо товару на складі');
            }
            await cartItem.save()
        }
        else{
            await CartItem.create({cartId, productId, quantity})
        }
    }
    async deleteCartItem(cartId, productId){
        await CartItem.destroy({where:{cartId, productId}})
    }
    async incCartItem(cartId, productId){
        const cartItem = await CartItem.findOne({where:{cartId, productId}})
        const product = await Product.findOne({ where: { id: productId } });
        if (product.quantity <= cartItem.quantity) {
            throw new Error('Недостатньо товару на складі');
        }
        cartItem.quantity +=1
        await cartItem.save()
    }
    async decCartItem(cartId, productId){
        const cartItem = await CartItem.findOne({where:{cartId, productId}})
        if (cartItem.quantity <= 1) {
            await cartItem.destroy();
        }
        else{
            cartItem.quantity -=1
            await cartItem.save()
        }
        
    }
    async clearCart(cartId){
        await CartItem.destroy({ where: { cartId } });
    }
}

module.exports = new CartRepository()
const {Product, Order, OrderItem, CartItem, Cart} = require('../models/models')

class OrderRepository{
    async createOrderFromCart(userId, data){

        const {delivery_method, delivery_address, payment_method, recipient_name, recipient_lastname, recipient_phone, recipient_email, comment} = data

        if(delivery_method !== "Самовивіз" && !delivery_address){
            throw new Error('Вкажіть адресу доставки')
        }

        const cart = await Cart.findOne({where:{userId}})
        if (!cart) {
            throw new Error('Кошик не знайдений')
        }
        
        const cartItems = await CartItem.findAndCountAll({where: {cartId:cart.id}})
        if (cartItems.count === 0) {
            throw new Error('Кошик порожній')
        }

        //count total
        let total = 0
        const products = await Promise.all(cartItems.rows.map(item => Product.findByPk(item.productId)));
        for (let i=0; i<cartItems.rows.length; i++) {
            total += cartItems.rows[i].quantity * products[i].price
        }

        //create an order
        const order = await Order.create({userId, total, delivery_method, delivery_address, payment_method, recipient_name, recipient_lastname, recipient_phone, recipient_email, comment})

        //create order items and delete this items from cart
        for(let item of cartItems.rows){
            await OrderItem.create({quantity:item.quantity, productId:item.productId, orderId:order.id})
            await item.destroy()
        }

        return order
    }
}

module.exports = new OrderRepository()
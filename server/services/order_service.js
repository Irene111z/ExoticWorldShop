const order_repository = require("../repositories/order_repository")

class OrderService{
    async createOrder(userId, data){
        return await order_repository.createOrderFromCart(userId, data)
    }
}

module.exports = new OrderService()
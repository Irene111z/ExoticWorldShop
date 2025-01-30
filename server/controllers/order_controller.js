const order_service = require("../services/order_service")
const ApiError = require('../errors/ApiError')

class OrderController{
    async createOrder(req, res, next){
        try {
            const order = await order_service.createOrder(req.user.id, req.body)
            return res.status(200).json(order)
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(err => {
                    switch (err.path) {
                        case 'recipient_phone':
                            return 'Введіть коректний номер телефону';
                        case 'recipient_email':
                            return 'Введіть коректну електронну пошту';
                        default:
                            return err.message;
                    }
                });
                return res.status(400).json({message: validationErrors.join(', ')});
            }
            next(ApiError.badRequest(error.message)) 
        }
    }
}

module.exports = new OrderController()
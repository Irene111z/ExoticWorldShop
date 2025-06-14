const { model } = require('../database')
const { Product, Order, OrderItem, CartItem, Cart, ProductImage } = require('../models/models')
const sequelize = require('../database');

class OrderRepository {
    async createOrderFromCart(userId, data) {
        const {
            delivery_method, delivery_address, payment_method,
            recipient_name, recipient_lastname, recipient_phone, recipient_email, comment
        } = data;

        if (delivery_method !== "Самовивіз" && !delivery_address) {
            throw new Error('Вкажіть адресу доставки');
        }

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            throw new Error('Кошик не знайдений');
        }

        const cartItems = await CartItem.findAndCountAll({ where: { cartId: cart.id } });
        if (cartItems.count === 0) {
            throw new Error('Кошик порожній');
        }

        const transaction = await sequelize.transaction();

        try {
            let total = 0;
            const products = await Promise.all(
                cartItems.rows.map(item => Product.findByPk(item.productId, { transaction }))
            );

            for (let i = 0; i < cartItems.rows.length; i++) {
                const price = products[i].disc_price ?? products[i].price;
                total += cartItems.rows[i].quantity * price;
            }

            const order = await Order.create({
                userId,
                total,
                delivery_method,
                delivery_address,
                payment_method,
                recipient_name,
                recipient_lastname,
                recipient_phone,
                recipient_email,
                comment
            }, { transaction });

            for (let item of cartItems.rows) {
                await OrderItem.create({
                    quantity: item.quantity,
                    productId: item.productId,
                    orderId: order.id
                }, { transaction });

                await item.destroy({ transaction });

                const product = await Product.findByPk(item.productId, { transaction });
                if (product) {
                    product.quantity -= item.quantity;
                    if (product.quantity < 0) product.quantity = 0;
                    await product.save({ transaction });
                }
            }

            await transaction.commit();
            return order;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getUserOrders(userId) {
        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    attributes: ['quantity'],
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'price', 'disc_price'],
                            include: [
                                {
                                    model: ProductImage,
                                    as: 'images',
                                    attributes: ['img'],
                                    where: { isPreview: true },
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (!orders) {
            throw new Error("Ваша історія замовлень поки пуста.");
        }

        return orders;
    }

    async cancelOrder(userId, orderId) {
        const order = await Order.findOne({ where: { userId: userId, id: orderId } })
        if (!order) {
            throw new Error("Замовлення не знайдено")
        }
        if (["Відправлено", "Виконано", "Скасовано"].includes(order.status)) {
            throw new Error('Скасування замовлення на даному етапі неможливе');
        }
        await order.update({ status: "Скасовано" })
    }
    async getAllOrders() {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    attributes: ['quantity'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price', 'disc_price'],
                            include: [
                                {
                                    model: ProductImage,
                                    as: 'images',
                                    attributes: ['img'],
                                    where: { isPreview: true },
                                    required: false
                                }
                            ]
                        }
                    ]
                }],
            order: [['createdAt', 'DESC']]
        })

        if (!orders) {
            throw new Error("Замовлення не знайдені")
        }
        return orders
    }
    async changeOrderStatus(orderId, status) {
        const order = await Order.findOne({ where: { id: orderId } })
        if (!order) {
            throw new Error("Замовлення не знайдено")
        }
        await order.update({ status: status })
    }

}

module.exports = new OrderRepository()
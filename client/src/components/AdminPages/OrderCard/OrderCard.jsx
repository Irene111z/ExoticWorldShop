import { useState } from 'react'
import './OrderCard.css'
import moment from 'moment'
import 'moment/locale/uk'
import { changeOrderStatus } from '../../../http/orderAPI'

const statuses = [
    "Очікує підтвердження",
    "Підтвержено",
    "Відправлено",
    "Виконано",
    "Скасовано"
]

const OrderCard = ({ id, order, onStatusChange }) => {
    const accordionId = `accordionFlush-${id}`
    const headingId = `flush-heading-${id}`
    const collapseId = `flush-collapse-${id}`

    const fullName = `${order.recipient_name} ${order.recipient_lastname}`
    const formattedDate = moment(order.createdAt).format('DD.MM.YYYY')
    const formattedTime = moment(order.createdAt).format('HH:mm')

    const [status, setStatus] = useState(order.status)

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value
        setStatus(newStatus)

        try {
            const updatedOrder = await changeOrderStatus(order.id, newStatus)
            if (onStatusChange) {
                onStatusChange(updatedOrder)
            }
        } catch (error) {
            console.error('Помилка зміни статусу:', error)
            setStatus(order.status)
        }
    }

    return (
        <div className="accordion accordion-flush my-2" id={accordionId}>
            <div className="accordion-item">
                <h2 className="accordion-header" id={headingId}>
                    <button className="order-card collapsed w-100 p-3" type="button" data-bs-toggle="collapse" data-bs-target={`#${collapseId}`} aria-expanded="false" aria-controls={collapseId}>
                        <div className="d-flex flex-column w-100">
                            <div className="d-flex justify-content-between">
                                <p className='order-card-semibold mb-2'>№{order.id}</p>
                                <select
                                    className='order-status-select'
                                    value={status}
                                    onChange={handleStatusChange}
                                >
                                    {statuses.map(s => (
                                        <option key={s} value={s}>{s.toLowerCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column align-items-start">
                                    <p className='mb-0'><span className='order-card-gray-text'>Отримувач: </span>{fullName}</p>
                                    <p className='mb-0'><span className='order-card-gray-text'>Номер тел.: </span>{order.recipient_phone}</p>
                                    <p className='mb-0'><span className='order-card-gray-text'>Спосіб доставки: </span>{order.delivery_method}</p>
                                    {order.delivery_method === 'Самовивіз' ? <span></span> : <p className='mb-0'><span className='order-card-gray-text'>Адреса доставки: </span>{order.delivery_address}</p>}
                                    <p className='mb-0'><span className='order-card-gray-text'>Спосіб оплати: </span>{order.payment_method}</p>
                                    {order.comment ? <p className='mb-0'><span className='order-card-gray-text'>Коментар: </span>{order.comment}</p> : <span />}
                                </div>
                                <div className="d-flex flex-column justify-content-between align-items-end">
                                    <div className="d-flex flex-column">
                                        <p className='order-card-gray-text mb-0'>Дата замовлення:</p>
                                        <div className="d-flex justify-content-between">
                                            <p>{formattedDate}</p>
                                            <p>{formattedTime}</p>
                                        </div>
                                    </div>
                                    <div className="order-card-toggle"></div>
                                </div>
                            </div>
                        </div>
                    </button>
                </h2>
                <div id={collapseId} className="accordion-collapse collapse" aria-labelledby={headingId} data-bs-parent={`#${accordionId}`}>
                    <hr className='m-0' />
                    <div className="accordion-body order-card">
                        <table className='order-card-items'>
                            <tbody>
                                {order.order_items.map(item => {
                                    const { product, quantity } = item
                                    const price = parseFloat(product.disc_price || product.price)
                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                <img src={product.images?.[0]?.img} alt="" className='order-card-item-img' />
                                            </td>
                                            <td className='text-left'>
                                                <p className='mb-0'>{product.name}</p>
                                                <p className='order-card-gray-text mb-0'>код: {product.id}</p>
                                            </td>
                                            <td className='text-end'>
                                                <p className='mb-0'>{price} грн.</p>
                                            </td>
                                            <td className='text-end'>
                                                <p className='mb-0'>{quantity} шт.</p>
                                            </td>
                                            <td className='text-end'>
                                                <p className='mb-0'>{price * quantity} грн.</p>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <p className='mb-0 text-end order-card-semibold'>Сума до сплати: {parseInt(order.total)} грн.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderCard

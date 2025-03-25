import React from 'react';
import './OrderCard.css';

const OrderCard = () => {
    return (
        <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOne">
                    <button class="order-card collapsed w-100 p-3" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        <div className="d-flex flex-column w-100">
                            <div className="d-flex justify-content-between">
                                <p>№19394</p>
                                <p className=' order-card-medium'>очікує підтвердження</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column align-items-start">
                                    <p className='mb-0'><span className='order-card-gray-text'>Отримувач: </span>Сохненко Аліна Віталіївна</p>
                                    <p className='mb-0'><span className='order-card-gray-text'>Номер тел.: </span>+38068364926</p>
                                    <p className='mb-0'><span className='order-card-gray-text'>Адреса доставки: </span>Львів, відділення НП №36</p>
                                    <p className='mb-0'><span className='order-card-gray-text'>Спосіб оплати: </span>на реквізити</p>
                                </div>
                                <div className="d-flex flex-column justify-content-between align-items-end">
                                    <div className="d-flex flex-column">
                                        <p className='order-card-gray-text mb-0'>Дата замовлення:</p>
                                        <div className="d-flex justify-content-between">
                                            <p>12.06.2025</p>
                                            <p>14:28</p>
                                        </div>
                                    </div>
                                    <div className="order-card-toggle mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </button>
                    
                </h2>
                <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <hr className='m-0'/>
                    <div class="accordion-body order-card">
                        <table className='order-card-items'>
                            <tbody>
                                <tr>
                                    <td>
                                        <img src="https://i.pinimg.com/736x/06/46/72/06467202ed20a8b09afe2610e2e7fe31.jpg" alt="" className='order-card-item-img' />
                                    </td>
                                    <td className='text-left'>
                                        <p className='mb-0'>Корм для пацюків Beaphar RatCare</p>
                                        <p className='order-card-gray-text mb-0'>код: 139042</p>
                                    </td>
                                    <td className='text-end'>
                                        <p className='mb-0'>700 грн.</p>
                                    </td>
                                    <td className='text-end'>
                                        <p className='mb-0'>3 шт.</p>
                                    </td>
                                    <td className='text-end'>
                                        <p className='mb-0'>2100 грн.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <img src="https://i.pinimg.com/736x/06/46/72/06467202ed20a8b09afe2610e2e7fe31.jpg" alt="" className='order-card-item-img' />
                                    </td>
                                    <td>
                                        <p className='mb-0'>Корм для пацюків Beaphar RatCare Корм для пацюків Beaphar RatCare</p>
                                        <p className='order-card-gray-text mb-0'>код: 139042</p>
                                    </td>
                                    <td className='text-end'>
                                        <p className='mb-0'>700 грн.</p>
                                    </td>
                                    <td className='text-end'>
                                        <p className='mb-0'>3 шт.</p>
                                    </td>
                                    <td className='text-end'>
                                        <p className='mb-0'>2100 грн.</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className='mb-0 text-end order-card-medium'>Сума до сплати: 6200 грн.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;

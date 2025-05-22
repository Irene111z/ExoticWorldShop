import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react';
import OrderCard from '../../components/AdminPages/OrderCard/OrderCard';
import './OrdersManagement.css'
import InputMask from "react-input-mask";
import { fetchAllOrders } from '../../http/orderAPI'

const OrdersManagement = observer(() => {
  const [orders, setOrders] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('Очікує підтвердження');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 9;

  useEffect(() => {
    fetchAllOrders().then(data => setOrders(data)).catch(console.error)
  }, [])

  const filteredOrders = orders.filter(order => {
    if (order.status !== selectedStatus) return false;
    const orderPhone = order.recipient_phone.replace(/\D/g, '');
    const filterPhone = phoneFilter.replace(/\D/g, '');
    return orderPhone.includes(filterPhone);
  });

  // Пагінація
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // При зміні фільтра або номера — скидати на 1 сторінку
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus, phoneFilter])

  return (
    <div className='container-fluid container-xxl order-page'>
      <p className='order-list-title mt-3'>Замовлення</p>
      <div className="d-flex justify-content-between mb-4">
        <InputMask
          mask="+38 099-999-99-99"
          className="search-order-by-phone"
          placeholder="+38 0XX-XXX-XX-XX"
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
        />

        <div className="d-flex">
          <select
            className='order-filter-select'
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Очікує підтвердження">Очікує підтвердження</option>
            <option value="Підтвержено">Підтвержено</option>
            <option value="Відправлено">Відправлено</option>
            <option value="Виконано">Виконано</option>
            <option value="Скасовано">Скасовано</option>
          </select>
        </div>
      </div>

      {currentOrders.length === 0 ? (
        <p>Замовлення відсутні</p>
      ) : (
        currentOrders.map((order, index) => (
          <OrderCard
            key={order.id}
            id={index}
            order={order}
            onStatusChange={() => {
              fetchAllOrders().then(data => setOrders(data)).catch(console.error)
            }}
          />
        ))
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          <span className="align-self-center">
            Сторінка {currentPage} з {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  )
})

export default OrdersManagement

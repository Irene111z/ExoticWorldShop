import { useEffect, useState } from 'react';
import { fetchCart } from '../../http/productAPI';
import { createOrder } from '../../http/orderAPI'
import { fetchUserProfile } from '../../http/userAPI';
import './OrderPage.css';
import { useNavigate } from 'react-router-dom';
import {PROFILE_ROUTE} from '../../utils/path'

const OrderPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [userData, setUserData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    delivery_info: '',
    delivery_method: '',
    payment_method: '',
    comment: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCart()
      .then(data => {
        const items = data.cart_items || [];
        setCartItems(items);

        const total = items.reduce((sum, item) => {
          const price = item.product.disc_price || item.product.price;
          return sum + price * item.quantity;
        }, 0);

        setTotalPrice(total);
      })
      .catch(() => alert('Не вдалося завантажити кошик'));

    fetchUserProfile()
      .then(data => {
        const updatedData = {
          name: data.name || '',
          lastname: data.lastname || '',
          email: data.email || '',
          phone: data.phone || '',
          delivery_info: data.delivery_info || '',
          delivery_method: '',
          payment_method: '',
          comment: '',
        };
        setUserData(updatedData);

        const initialErrors = {};
        Object.entries(updatedData).forEach(([key, value]) => {
          const error = validateField(key, value);
          if (error) initialErrors[key] = error;
        });
        setErrors(initialErrors);
      })
      .catch(() => alert('Не вдалося завантажити профіль'));
  }, []);


  const validateField = (name, value) => {
    switch (name) {
      case 'name':
      case 'lastname':
        if (!value.trim() || /\d/.test(value)) return 'Лише літери, без цифр';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Невірний email';
        break;
      case 'phone':
        if (!/^\+?\d{10,}$/.test(value)) return 'Невірний номер';
        break;
      case 'delivery_info':
        if (!value.trim()) return 'Поле обовʼязкове';
        break;
      case 'delivery_method':
        if (!value) return 'Оберіть спосіб доставки';
        break;
      case 'payment_method':
        if (!value) return 'Оберіть спосіб оплати';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};
    Object.entries(userData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) formErrors[key] = error;
    });
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    try {
      const payload = {
        recipient_name: userData.name,
        recipient_lastname: userData.lastname,
        recipient_email: userData.email,
        recipient_phone: userData.phone,
        delivery_method: userData.delivery_method,
        delivery_address: userData.delivery_info,
        payment_method: userData.payment_method,
        comment: userData.comment
      };

      await createOrder(payload);
      navigate(PROFILE_ROUTE);
      alert('Замовлення успішно оформлено!');
    } catch (error) {
      alert(error.response?.data?.message || 'Помилка при створенні замовлення');
    }
  };

  const requiredFields = ['name', 'lastname', 'email', 'phone', 'delivery_info', 'delivery_method', 'payment_method'];
  const isFormValid = requiredFields.every(field => userData[field]?.trim() && !errors[field]);

  return (
    <div className="order-page container-fluid container-xxl mt-5">
      <div className="d-flex row py-5">
        <form className="order-form d-flex flex-column col-4 offset-1" onSubmit={handleSubmit}>
          <h5 className='mb-3'>Оформлення замовлення</h5>
          <h6><strong>Дані для відправки:</strong></h6>
          <input
            name="name"
            type="text"
            placeholder="Ім’я"
            className='mb-2'
            value={userData.name}
            onChange={handleChange}
          />
          {errors.name && <small className="text-danger mb-2">{errors.name}</small>}
          <input
            name="lastname"
            type="text"
            placeholder="Прізвище"
            className='mb-2'
            value={userData.lastname}
            onChange={handleChange}
          />
          {errors.lastname && <small className="text-danger mb-2">{errors.lastname}</small>}
          <input
            name="email"
            type="email"
            placeholder='Email'
            className='mb-2'
            value={userData.email}
            onChange={handleChange}
          />
          {errors.email && <small className="text-danger mb-2">{errors.email}</small>}
          <input
            name="phone"
            type="tel"
            placeholder="Телефон"
            className='mb-0'
            value={userData.phone}
            onChange={handleChange}
          />
          {errors.phone && <small className="text-danger mt-2">{errors.phone}</small>}

          <h6 className='mt-4'><strong>Спосіб доставки:</strong></h6>
          <select
            name="delivery_method"
            className='mb-2 text-start'
            value={userData.delivery_method}
            onChange={handleChange}
          >
            <option value="" disabled hidden>Оберіть спосіб доставки</option>
            <option value="Нова пошта">Нова Пошта</option>
            <option value="Укрпошта">Укрпошта</option>
            <option value="Самовивіз">Самовивіз</option>
          </select>
          {errors.delivery_method && <small className="text-danger mb-2">{errors.delivery_method}</small>}
          <input
            name="delivery_info"
            type="text"
            placeholder="Адреса доставки"
            className='mb-0'
            value={userData.delivery_info}
            onChange={handleChange}
          />
          {errors.delivery_info && <small className="text-danger mt-2">{errors.delivery_info}</small>}

          <h6 className='mt-4'><strong>Спосіб оплати:</strong></h6>
          <select
            name="payment_method"
            className='mb-0 text-start'
            value={userData.payment_method}
            onChange={handleChange}
          >
            <option value="" disabled hidden>Оберіть спосіб оплати</option>
            <option value="Накладний платіж">Накладний платіж</option>
            <option value="Оплата на рахунок ФОП">Оплата на рахунок ФОП</option>
          </select>
          {errors.payment_method && <small className="text-danger mt-2">{errors.payment_method}</small>}
          <h6 className='mt-4'><strong>Коментар:</strong></h6>
          <textarea placeholder='Коментар до замовлення' className='mb-4' name="comment" value={userData.comment}
            onChange={handleChange}></textarea>

          <button type="submit" className='confirm-order-btn' disabled={!isFormValid}>Підтвердити замовлення</button>
        </form>
        <div className="order-cart-items col-5 offset-1">
          <h5 className='mb-3'>Товари до замовлення</h5>
          {cartItems.length === 0 ? (
            <p>Кошик порожній</p>
          ) : (
            cartItems.map(({ id, product, quantity }) => (
              <div key={id} className="order-item d-flex">
                <img
                  src={product.images?.[0]?.img}
                  alt={product.name}
                  className="order-item-img me-4"
                />
                <div>
                  <p className='mb-0'><strong>{product.name}</strong></p>
                  <p className='mb-0'>Кількість: {quantity}</p>
                  <p>Ціна: {product.disc_price * quantity || product.price * quantity} грн
                    {product.disc_price ? (<span className='order-item-old-price ms-2'>{product.price * quantity} грн</span>) : (<span />)}</p>
                </div>
              </div>
            ))
          )}
          <div className="mt-3">
            <h6 className=''>Усього товарів на суму: {totalPrice} грн</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

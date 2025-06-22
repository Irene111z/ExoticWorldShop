import React, { useState, useEffect, useRef, useContext } from 'react';
import { fetchUserProfile, updateUserProfile } from '../../http/userAPI';
import { fetchUserOrders } from '../../http/orderAPI';
import './UserProfile.css';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../components/AdminPages/OrderCard/OrderCard';
import InputMask from "react-input-mask";

const UserProfile = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const logout = () => {
    user.setUser({});
    user.setIsAuth(false);
    user.setIsAdmin(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  const [userData, setUserData] = useState({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    delivery_info: '',
    img: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUserData({
          name: profile.name || '',
          lastname: profile.lastname || '',
          phone: profile.phone || '',
          email: profile.email || '',
          delivery_info: profile.delivery_info || '',
          img: profile.img || '',
        });
        setPreviewUrl(profile.img || '');
      } catch (error) {
        console.error('Помилка завантаження профілю:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    fetchUserOrders().then(setOrders).catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImgFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Будь ласка, виберіть зображення');
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
      case 'lastname':
        if (!value.trim() || /\d/.test(value)) return 'Лише літери';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Невірний email';
        break;
      case 'phone': {
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 12) return 'Невірний номер';
        break;
      }
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    for (const key in userData) {
      if (key !== 'img') {
        const error = validateField(key, userData[key]);
        if (error) errors[key] = error;
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return alert('Будь ласка, виправте помилки у формі');
    }

    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('lastname', userData.lastname);
    formData.append('email', userData.email);
    formData.append('delivery_info', userData.delivery_info);
    const cleanedPhone = userData.phone.replace(/[^\d+]/g, '');
    formData.append('phone', cleanedPhone);
    if (imgFile) {
      formData.append('img', imgFile);
    }

    try {
      const updated = await updateUserProfile(formData);
      setUserData((prev) => ({ ...prev, img: updated.img }));
      setPreviewUrl(updated.img);
      setIsEditing(false);
    } catch (error) {
      console.error('Помилка оновлення профілю:', error);
      alert('Не вдалося оновити профіль');
    }
  };


  return loading ? (
    <div>Завантаження профілю...</div>
  ) : (
    <div className="container-fluid container-xxl d-flex">
      <div className="d-flex flex-column me-5">
        <form onSubmit={handleSubmit} className="user-profile-form mt-4">
          <div className="d-flex mb-3 flex-row-reverse user-profile-icons">
            <img src="/static/edit-icon-white.svg" alt="" className="edit-profile-icon" onClick={() => setIsEditing(true)} />
            <img src="/static/log-out-icon.svg" className="edit-profile-icon me-3" alt="" onClick={logout} />
          </div>

          <div className="text-center">
            <img
              src={previewUrl}
              alt="img"
              onClick={handleAvatarClick}
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '50%',
                cursor: isEditing ? 'pointer' : 'default',
                marginBottom: '1.5rem',
              }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="d-flex">
            <div className="d-flex flex-column me-3">
              <label>Прізвище:</label>
              <input
                type="text"
                name="lastname"
                value={userData.lastname}
                onChange={handleChange}
                disabled={!isEditing}
              />
              {validationErrors.lastname && <small className="mt-1 ms-3" style={{ color: '	#FFC1A1' }}>{validationErrors.lastname}</small>}
            </div>
            <div className="d-flex flex-column">
              <label>Ім'я:</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
              {validationErrors.name && <small className="mt-1 ms-3" style={{ color: '	#FFC1A1' }}>{validationErrors.name}</small>}
            </div>
          </div>

          <div className="d-flex flex-column mt-2">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              className='mb-0'
              onChange={handleChange}
              disabled={!isEditing}
            />
            {validationErrors.email && <small className="mt-1 ms-3" style={{ color: '	#FFC1A1' }}>{validationErrors.email}</small>}
          </div>

          <div className="d-flex flex-column mt-2">
            <label>Телефон:</label>
            <InputMask
              mask="+38 099-999-99-99"
              className="auth-form-input mb-0"
              placeholder="+38 0XX-XXX-XX-XX"
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
            {validationErrors.phone && <small className="mt-1 ms-3" style={{ color: '	#FFC1A1' }}>{validationErrors.phone}</small>}
          </div>

          <div className="d-flex flex-column mt-2">
            <label>Адреса доставки:</label>
            <input
              type="text"
              name="delivery_info"
              value={userData.delivery_info}
              className='mb-2'
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div>
              <button type="submit" className="btn-save-profile-changes mt-2">
                Зберегти
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="d-flex flex-column mt-4 w-100">
        {orders.length === 0 ? (
          <p style={{ color: '	#FFC1A1' }}>Замовлення відсутні</p>
        ) : (
          orders.map((order, index) => (
            <OrderCard key={order.id} id={index} order={order} />
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfile;

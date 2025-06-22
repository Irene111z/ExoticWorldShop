import './AuthForm.css';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ORDERS_MANAGEMENT_ROUTE } from '../../utils/path';
import { registration, login, fetchDefaultAvatars } from '../../http/userAPI';
import InputMask from "react-input-mask";

const AuthForm = observer(({ onClose }) => {
    const { user } = useContext(Context);
    const [loginForm, setLoginForm] = useState(true);
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        lastname: '',
        phone: '',
    });

    const [errors, setErrors] = useState({});
    const [avatarList, setAvatarList] = useState([]);
    const [randomAvatar, setRandomAvatar] = useState(null);

    useEffect(() => {
        fetchDefaultAvatars()
            .then(data => {
                setAvatarList(data);
                if (data.length > 0) {
                    const random = data[Math.floor(Math.random() * data.length)];
                    setRandomAvatar(random);
                }
            })
            .catch(err => console.error('Помилка завантаження аватарів:', err));
    }, []);

    const toggleForm = () => setLoginForm(!loginForm);
    const togglePassword = () => setPasswordShown(!passwordShown);

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
            case 'lastname':
                if (!value.trim() || /\d/.test(value)) return 'Лише літери, без цифр';
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Невірний email';
                break;
            case 'password':
                if (value.length < 6) return 'Мінімум 6 символів';
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
        setFormData(prev => ({ ...prev, [name]: value }));

        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleValidation = () => {
        const newErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key, value);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const signIn = async (e) => {
        e.preventDefault();
        if (!randomAvatar || !handleValidation()) return;

        const cleanedPhone = formData.phone.replace(/[^\d+]/g, '');

        try {
            const data = await registration(
                formData.email,
                formData.password,
                formData.name,
                formData.lastname,
                cleanedPhone,
                randomAvatar
            );

            console.log('Розкодований токен:', data); // це вже user-обʼєкт

            user.setUser(data);
            user.setIsAuth(true);
            user.setIsAdmin(data.role === "admin");

            localStorage.setItem("userData", JSON.stringify({
                user: data,
                isAuth: true,
                isAdmin: data.role === "admin"
            }));

            const redirectUrl = localStorage.getItem('redirectUrl') || '/';
            navigate(data.role === "admin" ? ORDERS_MANAGEMENT_ROUTE : redirectUrl);
            localStorage.removeItem('redirectUrl');
            onClose();
        } catch (error) {
            console.error('Помилка під час реєстрації:', error);
            alert('Не вдалося зареєструватися');
        }
    };


    const logIn = async (e) => {
        e.preventDefault();
        const requiredFields = ['email', 'password'];
        const newErrors = {};
        requiredFields.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const data = await login(formData.email, formData.password);
            user.setUser(data);
            user.setIsAuth(true);
            user.setIsAdmin(data.user.role === "admin");

            localStorage.setItem('token', data.token);
            localStorage.setItem("userData", JSON.stringify({
                user: data,
                isAuth: true,
                isAdmin: data.user.role === "admin"
            }));
            onClose();
            const redirectUrl = localStorage.getItem('redirectUrl') || '/';
            navigate(data.user.role === "admin" ? ORDERS_MANAGEMENT_ROUTE : redirectUrl);
            localStorage.removeItem('redirectUrl');
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                password: 'Невірний email або пароль'
            }));
        }
    };

    return (
        <div className="auth-modal">
            <div className="auth-overlay" onClick={onClose}></div>
            <div className="auth-container">
                <div className="auth-background">
                    <img src="/static/auth-bg.jpg" alt="" />
                </div>
                <div className={`auth-box ${loginForm ? 'login-active' : 'register-active'}`}>
                    <div className="moving-block"></div>

                    {/* Вхід */}
                    <div className="auth-panel auth-left" style={{ opacity: loginForm ? 1 : 0, visibility: loginForm ? "visible" : "hidden" }}>
                        <form className="auth-form" onSubmit={logIn}>
                            <h2 className='auth-form-title'>Вхід</h2>
                            <input
                                type="email"
                                name="email"
                                className="auth-form-input mb-0"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <small className="text-danger ms-3">{errors.email}</small>}

                            <div className="password-container d-flex justify-content-between mt-3 mb-0">
                                <input
                                    type={passwordShown ? "text" : "password"}
                                    name="password"
                                    placeholder="Пароль"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button type="button" className="btn-show-hide-password" onClick={togglePassword}>
                                    <img src={passwordShown ? "/static/show-password-monkey.svg" : "/static/hide-password-monkey.svg"} />
                                </button>
                            </div>
                            {errors.password && <small className="text-danger ms-3">{errors.password}</small>}

                            <button className='btn-submit mt-3' type='submit'>Увійти</button>
                            <div className="d-flex flex-row mt-2 align-self-center">
                                <p className='m-0 p-0 me-3'>Ще не зареєстровані?</p>
                                <p className="m-0 p-0 form-switch" onClick={toggleForm}>Реєстрація</p>
                            </div>
                        </form>
                    </div>

                    {/* Реєстрація */}
                    <div className="auth-panel auth-right" style={{ opacity: loginForm ? 0 : 1, visibility: loginForm ? "hidden" : "visible" }}>
                        <form className="auth-form" onSubmit={signIn}>
                            <h2 className='auth-form-title'>Реєстрація</h2>

                            <input
                                type="text"
                                name="lastname"
                                className="auth-form-input mb-0"
                                placeholder="Прізвище"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                            {errors.lastname && <small className="text-danger ms-3">{errors.lastname}</small>}

                            <input
                                type="text"
                                name="name"
                                className="auth-form-input mb-0 mt-3"
                                placeholder="Ім'я"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <small className="text-danger ms-3">{errors.name}</small>}

                            <InputMask
                                mask="+38 099-999-99-99"
                                name="phone"
                                className="auth-form-input mb-0 mt-3"
                                placeholder="+38 0XX-XXX-XX-XX"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <small className="text-danger ms-3">{errors.phone}</small>}

                            <input
                                type="email"
                                name="email"
                                className="auth-form-input mb-0 mt-3"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <small className="text-danger ms-3">{errors.email}</small>}

                            <div className="password-container d-flex justify-content-between mb-0 mt-3">
                                <input
                                    type={passwordShown ? "text" : "password"}
                                    name="password"
                                    placeholder="Пароль"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button type="button" className="btn-show-hide-password" onClick={togglePassword}>
                                    <img src={passwordShown ? "/static/show-password-monkey.svg" : "/static/hide-password-monkey.svg"} />
                                </button>
                            </div>
                            {errors.password && <small className="text-danger ms-3">{errors.password}</small>}

                            <button className='btn-submit mt-3' type='submit'>Зареєструватися</button>
                            <div className="d-flex flex-row mt-2 align-self-center">
                                <p className='m-0 p-0 me-3'>Вже маєте акаунт?</p>
                                <p className='m-0 p-0 form-switch' onClick={toggleForm}>Увійти</p>
                            </div>
                        </form>
                    </div>

                    <div className="bg-btn-close">
                        <button className="close-auth-modal btn-close" onClick={onClose}></button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AuthForm;
import './AuthForm.css';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ORDERS_MANAGEMENT_ROUTE } from '../../utils/path';
import { registration, login } from '../../http/userAPI';

const AuthForm = observer(({ onClose }) => {

    const {user} = useContext(Context)
    const [loginForm, setLoginForm] = useState(true);
    const [passwordShown, setPasswordShown] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [phone, setPhone] = useState('')
    const navigate = useNavigate();

    const toggleForm = () => {
        setLoginForm(!loginForm);
    };
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };
    
    const signIn = async(e) => {
        e.preventDefault();
        let data;
        data = await registration(email, password, name, lastname, phone)
        user.setUser(user)
        user.setIsAuth(true)
        onClose();
        const redirectUrl = localStorage.getItem('redirectUrl') || '/';
        navigate(data.isAdmin ? ORDERS_MANAGEMENT_ROUTE : redirectUrl);
        localStorage.removeItem('redirectUrl');
    }
    const logIn = async(e) => {
        e.preventDefault();
        let data;
        data = await login(email, password)
        user.setUser(user)
        user.setIsAuth(true)
        onClose();
        const redirectUrl = localStorage.getItem('redirectUrl') || '/';
        navigate(data.isAdmin ? ORDERS_MANAGEMENT_ROUTE : redirectUrl);
        localStorage.removeItem('redirectUrl');
    }

    return (
        <div className="auth-modal">
            <div className="auth-overlay" onClick={onClose}></div>
            <div className="auth-container">
                <div className="auth-background">
                    <img src="/static/auth-bg.jpg" alt="" />
                </div>
                <div className={`auth-box ${loginForm ? 'login-active' : 'register-active'}`}>
                    <div className="moving-block"></div>
                    <div className="auth-panel auth-left" style={{ opacity: loginForm ? 1 : 0, visibility: loginForm ? "visible" : "hidden" }}>
                        <form className="auth-form" onSubmit={logIn}>
                            <h2 className='auth-form-title'>Вхід</h2>
                            <input type="email" className="auth-form-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                            <div className="password-container d-flex justify-content-between">
                                <input type={passwordShown ? "text" : "password"}placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)}/>
                                <button type="button" className="btn-show-hide-password" onClick={togglePassword}>
                                    <img src={passwordShown ? "/static/show-password-monkey.svg" : "/static/hide-password-monkey.svg"}/>
                                </button>
                            </div>
                            <button className='btn-submit' type='submit'>Увійти</button>
                            <div className="d-flex flex-row mt-2 align-self-center">
                                <p className='m-0 p-0 me-3'>Ще не зареєстровані?</p>
                                <p className="m-0 p-0 form-switch" onClick={toggleForm}>Реєстрація</p>
                            </div>
                        </form>
                    </div>
                    <div className="auth-panel auth-right" style={{ opacity: loginForm ? 0 : 1, visibility: loginForm ? "hidden" : "visible" }}>
                        <form className="auth-form" onSubmit={signIn}>
                            <h2 className='auth-form-title'>Реєстрація</h2>
                            <input type="text" className="auth-form-input" placeholder="Прізвище"  value={lastname} onChange={e => setLastname(e.target.value)}/>
                            <input type="text" className="auth-form-input" placeholder="Ім'я"  value={name} onChange={e => setName(e.target.value)}/>
                            <input type="text" className="auth-form-input" placeholder="Номер тел."  value={phone} onChange={e => setPhone(e.target.value)}/>
                            <input type="email" className="auth-form-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                            <div className="password-container d-flex justify-content-between">
                                <input type={passwordShown ? "text" : "password"}placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)}/>
                                <button type="button" className="btn-show-hide-password" onClick={togglePassword}>
                                    <img src={passwordShown ? "/static/show-password-monkey.svg" : "/static/hide-password-monkey.svg"}/>
                                </button>
                            </div>
                            <button className='btn-submit' type='submit'>Зареєструватися</button>
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

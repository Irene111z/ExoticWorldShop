import { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ onClose }) => {

    const [isLogin, setIsLogin] = useState(true);
    const [passwordShown, setPasswordShown] = useState(false);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="auth-modal">
            <div className="auth-overlay" onClick={onClose}></div>
            <div className="auth-container">
                <div className="auth-background">
                    <img src="/static/auth-bg.jpg" alt="" />
                </div>
                <div className={`auth-box ${isLogin ? 'login-active' : 'register-active'}`}>
                    <div className="moving-block"></div>
                    <div className="auth-panel auth-left" style={{ opacity: isLogin ? 1 : 0, visibility: isLogin ? "visible" : "hidden" }}>
                        <form className="auth-form">
                            <h2 className='auth-form-title'>Вхід</h2>
                            <input type="email" className="auth-form-input" placeholder="Email" />
                            <div className="password-container d-flex justify-content-between">
                                <input type={passwordShown ? "text" : "password"}placeholder="Пароль"/>
                                <button type="button" className="btn-show-hide-password" onClick={togglePassword}>
                                    <img src={passwordShown ? "/static/show-password-monkey.svg" : "/static/hide-password-monkey.svg"}/>
                                </button>
                            </div>
                            <button type="submit" className='btn-submit'>Увійти</button>
                            <div className="d-flex flex-row mt-2 align-self-center">
                                <p className='m-0 p-0 me-3'>Ще не зареєстровані?</p>
                                <p className="m-0 p-0 form-switch" onClick={toggleForm}>Реєстрація</p>
                            </div>
                        </form>
                    </div>
                    <div className="auth-panel auth-right" style={{ opacity: isLogin ? 0 : 1, visibility: isLogin ? "hidden" : "visible" }}>
                        <form className="auth-form">
                            <h2 className='auth-form-title'>Реєстрація</h2>
                            <input type="text" className="auth-form-input" placeholder="Прізвище" />
                            <input type="text" className="auth-form-input" placeholder="Ім'я" />
                            <input type="text" className="auth-form-input" placeholder="Номер тел." />
                            <input type="email" className="auth-form-input" placeholder="Email" />
                            <div className="password-container d-flex justify-content-between">
                                <input type={passwordShown ? "text" : "password"}placeholder="Пароль"/>
                                <button type="button" className="btn-show-hide-password" onClick={togglePassword}>
                                    <img src={passwordShown ? "/static/show-password-monkey.svg" : "/static/hide-password-monkey.svg"}/>
                                </button>
                            </div>
                            <button type="submit" className='btn-submit'>Зареєструватися</button>
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
};

export default AuthForm;

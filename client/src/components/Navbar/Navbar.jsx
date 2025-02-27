import './Navbar.css'
import { Link } from 'react-router-dom';
import { HOMEPAGE_ROUTE, WISHLIST_ROUTE, PROFILE_ROUTE, BLOG_ROUTE, BOOKMARKS_ROUTE, CATALOG_ROUTE } from '../../utils/path'
import { useContext, useState } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'

const Navbar = observer(({ isHomePage }) => {
    const { user } = useContext(Context);
    const [showLoginDropdown, setShowLoginDropdown] = useState(false); // Стейт для дропдауну

    const handleLogin = (event) => {
        event.preventDefault();
        const loginData = new FormData(event.target);
        const username = loginData.get('username');
        const password = loginData.get('password');
        
        // Тут потрібно реалізувати логіку авторизації
        console.log('Username:', username, 'Password:', password);

        // Після успішної авторизації потрібно оновити статус user.isAuth
        user.isAuth = true; // Це має бути результатом реальної авторизації
        setShowLoginDropdown(false); // Закриваємо форму після авторизації
    };

    const toggleLoginDropdown = () => {
        setShowLoginDropdown(!showLoginDropdown); // Змінюємо стан на протилежний (відкриваємо/закриваємо)
    };

    return (
        <header className={`${isHomePage ? 'transparent-header' : 'header'}`}>
            <nav className='header-navbar d-flex container-xxl py-3 align-items-end'>
                <div className="me-auto">
                    <Link to={HOMEPAGE_ROUTE} className="d-flex align-items-center navbar-title">
                        <img src="/static/logo.png" alt="" className='navbar-logo me-2' />
                        <div className="d-flex flex-column">
                            <p className="m-0" style={{ fontWeight: '600' }}>ExoWorld</p>
                            <p className="m-0" style={{ fontSize: '13px', fontWeight: '400' }}>зоомагазин</p>
                        </div>
                    </Link>
                </div>
                <div className="position-absolute start-50 translate-middle-x">
                    <div className="d-flex flex-row align-items-end">
                        <p className='me-5 my-0'><Link to='' className="navbar-links">Про нас</Link></p>
                        <p className='me-5 my-0'><Link to={BLOG_ROUTE} className="navbar-links">Блог</Link></p>
                        <p className='my-0'><Link to='' className="navbar-links">Контакти</Link></p>
                    </div>
                </div>
                <div className="ms-auto d-flex align-items-end">
                    {user.isAuth ? (
                        <Link to={PROFILE_ROUTE} className='me-4'>
                            <img src="/static/navbar-profile.svg" alt="" />
                        </Link>
                    ) : (
                        <div className='me-4' onClick={toggleLoginDropdown}> {/* Тепер при натисканні буде змінюватись стан */}
                            <img src="/static/navbar-profile.svg" alt="" />
                        </div>
                    )}
                    <div className="d-flex flex-column me-4">
                        <div className="header-wishlist-count">38</div>
                        {user.isAuth ? (
                            <Link to={WISHLIST_ROUTE} className='text-center py-0'>
                                <img src="/static/navbar-wishlist.svg" alt="" />
                            </Link>
                        ) : (
                            <div className='text-center py-0' onClick={toggleLoginDropdown}> {/* Тепер при натисканні буде змінюватись стан */}
                                <img src="/static/navbar-wishlist.svg" alt="" />
                            </div>
                        )}
                    </div>
                    <div className="d-flex flex-column me-4">
                        <div className="header-saving-count">12</div>
                        {user.isAuth ? (
                            <Link to={BOOKMARKS_ROUTE} className='text-center py-0'>
                                <img src="/static/navbar-saving.svg" alt="" />
                            </Link>
                        ) : (
                            <div className='text-center py-0' onClick={toggleLoginDropdown}> {/* Тепер при натисканні буде змінюватись стан */}
                                <img src="/static/navbar-saving.svg" alt="" />
                            </div>
                        )}
                    </div>
                    <div className="d-flex flex-column">
                        <div className="header-cart-count">2</div>
                        <img
                            src="/static/navbar-cart.svg"
                            className='text-center py-0'
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            alt=""
                        />
                    </div>
                </div>
            </nav>
            <div className="header-cats text-uppercase d-flex flex-row justify-content-center py-1">
                <p className='me-5 my-0'><Link to='/rodents' className='header-cat'>Гризунам</Link></p>
                <p className='me-5 my-0'><Link to='/mammals' className='header-cat'>Ссавцям</Link></p>
                <p className='me-5 my-0'><Link to='/reptiles' className='header-cat'>Рептиліям</Link></p>
                <p className='my-0'><Link to='/birds' className='header-cat'>Птахам</Link></p>
            </div>

            {/* Dropdown для авторизації */}
            {showLoginDropdown && (
                <div className="login-dropdown">
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Логін</label>
                            <input type="text" id="username" name="username" required className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Пароль</label>
                            <input type="password" id="password" name="password" required className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary">Увійти</button>
                    </form>
                </div>
            )}
        </header>
    );
});

export default Navbar;

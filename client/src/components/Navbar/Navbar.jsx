import './Navbar.css';
import { Link } from 'react-router-dom';
import { HOMEPAGE_ROUTE, WISHLIST_ROUTE, PROFILE_ROUTE, BLOG_ROUTE, BOOKMARKS_ROUTE } from '../../utils/path';
import { useContext, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import AuthForm from '../AuthForm/AuthForm';
import { useNavigate } from 'react-router-dom';

const Navbar = observer(({ isHomePage }) => {
    const { user } = useContext(Context);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const openAuthModal = () => {
        setShowAuthModal(true);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    const handleProtectedClick = (redirectPath) => {
        localStorage.setItem('redirectUrl', redirectPath);
        openAuthModal();
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
                        <div className='me-4' onClick={() => handleProtectedClick(PROFILE_ROUTE)}>
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
                            <div className='text-center py-0' onClick={() => handleProtectedClick(WISHLIST_ROUTE)}>
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
                            <div className='text-center py-0' onClick={() => handleProtectedClick(BOOKMARKS_ROUTE)}>
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

            {showAuthModal && <AuthForm onClose={closeAuthModal} />}
        </header>
    );
});

export default Navbar;

import './Navbar.css'
import { Link } from 'react-router-dom';
import { HOMEPAGE_ROUTE, WISHLIST_ROUTE, PROFILE_ROUTE, BLOG_ROUTE, BOOKMARKS_ROUTE, CATALOG_ROUTE } from '../../utils/path'
import { useContext } from 'react'
import { Context } from '../../index'
import {observer} from 'mobx-react-lite'

const Navbar = observer(() => {
    const { user } = useContext(Context)
    return (
        <header className='header'>
            <nav className='header-navbar d-flex container-fluid container-xxl py-3 align-items-end'>
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
                    {user.isAuth ?
                        <Link to={PROFILE_ROUTE} className='me-4'><img src="/static/navbar-profile.svg" alt="" /></Link>
                        :
                        <div className='me-4'><img src="/static/navbar-profile.svg" alt="" /></div>
                    }
                    <div className="d-flex flex-column me-4">
                        <div className="header-wishlist-count">38</div>
                        <Link to={WISHLIST_ROUTE} className='text-center py-0'><img src="/static/navbar-wishlist.svg" alt="" /></Link>
                    </div>
                    <div className="d-flex flex-column me-4">
                        <div className="header-saving-count">12</div>
                        <Link to={BOOKMARKS_ROUTE} className='text-center py-0'><img src="/static/navbar-saving.svg" alt="" /></Link>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="header-cart-count">2</div>
                        <img src="/static/navbar-cart.svg" className='text-center py-0' data-bs-toggle="modal" data-bs-target="#exampleModal" alt="" />
                    </div>
                </div>
            </nav>
            <div className="header-cats text-uppercase d-flex flex-row justify-content-center py-1">
                <p className='me-5 my-0'><Link to='/rodents' className='header-cat'>Гризунам</Link></p>
                <p className='me-5 my-0'><Link to='/mammals' className='header-cat'>Ссавцям</Link></p>
                <p className='me-5 my-0'><Link to='/reptiles' className='header-cat'>Рептиліям</Link></p>
                <p className='my-0'><Link to='/birds' className='header-cat'>Птахам</Link></p>
            </div>
        </header>
    )
})

export default Navbar
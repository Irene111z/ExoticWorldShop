import React, { useEffect, useState, useContext } from 'react';
import './Sales.css';
import ProductCard from '../../ProductCard/ProductCard';
import { observer } from 'mobx-react-lite';
import { fetchProducts, fetchWishlist, fetchCart } from '../../../http/productAPI';
import Slider from 'react-slick';
import { Context } from '../../../';

const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
        <img
            src="/static/right-arrow-round.svg"
            alt="next"
            onClick={onClick}
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                cursor: 'pointer',
                width: 40,
                height: 40,
                zIndex: 10,
            }}
        />
    );
};

const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
        <img
            src="/static/left-arrow-round.svg"
            alt="prev"
            onClick={onClick}
            style={{
                position: 'absolute',
                top: 0,
                right: 60,
                cursor: 'pointer',
                width: 40,
                height: 40,
                zIndex: 10,
            }}
        />
    );
};

const Sales = observer(() => {
    const { user } = useContext(Context);

    const [products, setProducts] = useState([]);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchProducts()
            .then(data => {
                const discounted = data.rows.filter(product => product.disc_price);
                setProducts(discounted);
            })
            .catch(err => console.error('Помилка при завантаженні товарів:', err));
    }, []);

    useEffect(() => {
        if (user?.isAuth) {
            fetchWishlist()
                .then(items => setWishlistIds(items.rows.map(item => item.productId)))
                .catch(() => setWishlistIds([]));

            fetchCart()
                .then(data => setCartItems(data?.cart_items || []))
                .catch(() => setCartItems([]));
        } else {
            setWishlistIds([]);
            setCartItems([]);
        }
    }, [user?.isAuth]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 4, slidesToScroll: 4 } },
            { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    return (
        <div className="sales-home container-xxl mt-5" style={{ position: 'relative' }}>
            <div className="d-flex flex-row justify-content-between mb-4">
                <p className="text-uppercase sales-home-title m-0 align-self-end">Зустрічайте знижки!</p>
            </div>
            <Slider {...settings}>
                {products.map(product => (
                    <div key={product.id} className="slider-card-wrapper">
                        <ProductCard product={product} wishlistIds={wishlistIds} cartItems={cartItems} />
                    </div>
                ))}
            </Slider>
        </div>
    );
});

export default Sales;

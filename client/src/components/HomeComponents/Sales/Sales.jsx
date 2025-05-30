import React, { useEffect, useState, useContext } from 'react';
import './Sales.css';
import ProductCard from '../../ProductCard/ProductCard';
import { observer } from 'mobx-react-lite';
import { fetchProducts, fetchWishlist, fetchCart  } from '../../../http/productAPI';
import Slider from 'react-slick';
import { Context } from '../../../';

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
          fetchWishlist().then(items => setWishlistIds(items.rows.map(item => item.productId)));
          fetchCart().then(data => setCartItems(data?.cart_items || []));
        } else {
          setWishlistIds([]);
          setCartItems([]);
        }
      }, [user]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1400,
                settings: { slidesToShow: 4 }
            },
            {
                breakpoint: 1200,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 576,
                settings: { slidesToShow: 1 }
            }
        ],
        nextArrow: <img src="/static/right-arrow-round.svg" alt="next" className="custom-arrow next" />,
        prevArrow: <img src="/static/left-arrow-round.svg" alt="prev" className="custom-arrow prev" />
    };

    return (
        <div className='sales-home container-xxl mt-5'>
            <div className="d-flex flex-row justify-content-between mb-4">
                <p className='text-uppercase sales-home-title m-0 align-self-end'>Зустрічайте знижки!</p>
            </div>
            <Slider {...settings}>
                {products.map(product => (
                    <div key={product.id} className="slider-card-wrapper">
                        <ProductCard product={product} wishlistIds={wishlistIds} cartItems={cartItems}/>
                    </div>
                ))}
            </Slider>
        </div>
    );
});

export default Sales;

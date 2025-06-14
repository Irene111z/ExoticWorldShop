import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../..';
import './ProductCard.css'
import { useNavigate } from "react-router-dom";
import { PRODUCT_ROUTE } from '../../utils/path'
import { addProductToWishlist, deleteProductFromWishlist, addProductToCart } from '../../http/productAPI';
import {useToast} from '../../context/ToastContext'
import CartModal from '../CartModal/CartModal';

const ProductCard = ({ product, wishlistIds = [], onRemoveFromWishlist, cartItems = [] }) => {

  const navigate = useNavigate();

  const [isInWishlist, setIsInWishlist] = useState(wishlistIds.includes(product.id));
  const [isInCart, setIsInCart] = useState(cartItems.includes(product.id))
  const { showToast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { user } = useContext(Context);

  useEffect(() => {
    setIsInWishlist(wishlistIds.includes(product.id));
    setIsInCart(cartItems.includes(product.id))
  }, [wishlistIds, cartItems, product.id]);

  const handleToggleWishlist = async () => {
    try {
      if (!user.isAuth) {
        showToast('Увійдіть, щоб додавати товари до списку бажань.');
        return;
      }
      else {
        if (isInWishlist) {
          await deleteProductFromWishlist(product.id);
          setIsInWishlist(false);
          if (onRemoveFromWishlist) {
            onRemoveFromWishlist(product.id);
          }
        } else {
          await addProductToWishlist(product.id);
          setIsInWishlist(true);
        }
        user.updateWishlistCount();
      }
    } catch (error) {
      console.error(error);
      showToast('Помилка при додаванні в список бажань.');
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!user.isAuth) {
        showToast('Увійдіть, щоб додавати товари до кошику.');
        return;
      }
      else{
        if (isInCart) {
        setIsCartOpen(true)
      }
      else {
        await addProductToCart(product.id);
        setIsInCart(true);
      }
      }
      user.updateCartCount();
    } catch (error) {
      console.error(error);
      showToast('Помилка при додаванні в кошик.');
    }
  };

  return (
    <div className="col mb-4 product-card">
      <div className="d-flex flex-column justify-content-between product-card-content">
        <div className="d-flex flex-column">
          <p style={{ color: "#858585", fontSize: '14px' }} className='mb-1'>Код: {product.id}</p>
          <div className="d-flex flex-column align-items-center">
            <img
              className={`d-flex product-card-img ${product.quantity === 0 ? 'img-out-of-stock' : ''}`}
              src={product.images?.find(img => img.isPreview)?.img}
              alt="..."
              onClick={() => navigate(`${PRODUCT_ROUTE}/${product.id}`)}
            />
            <div className='d-flex product-card-rating d-flex mt-1'>
              {[...Array(5)].map((_, idx) => (
                <img
                  key={idx}
                  src={
                    idx < Math.round(Number(product.averageRating || 0))

                      ? '/static/star-filled.svg'
                      : '/static/star-empty.svg'
                  }
                  alt="Зірка"
                />
              ))}
            </div>
            <p className="product-card-name mt-2 mb-0" onClick={() => navigate(`${PRODUCT_ROUTE}/${product.id}`)}>{product.name}</p>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-column">
            <div className="d-flex me-0 align-items-end" style={{ fontSize: '12px' }}>
              <p className={product.quantity > 0 ? 'text-uppercase me-2 my-0 product-card-price' : 'text-uppercase me-2 my-0 product-card-price-disabled'}>Ціна</p>
              {product.disc_price ?
                (
                  <p className="product-card-old-price my-0">
                    {Number(product.disc_price).toFixed(2).includes(".00")
                      ? Math.round(product.disc_price)
                      : product.disc_price.toFixed(2)} ₴
                  </p>
                )
                :
                (<span></span>)}
            </div>
            <p className={product.quantity > 0 ? "my-0 product-card-price" : "my-0 product-card-price-disabled"}>
              {Number(product.price).toFixed(2).includes(".00")
                ? Math.round(product.price)
                : product.price.toFixed(2)} ₴
            </p>
          </div>
          <div className="d-flex product-card-btns">
            <button className="product-card-btn-add-to-cart" onClick={handleToggleWishlist}><img
              src={
                product.quantity > 0
                  ? (isInWishlist ? '/static/wishlist-filled.svg' : '/static/wishlist-empty.svg')
                  : (isInWishlist ? '/static/wishlist-filled-gray.svg' : '/static/wishlist-empty-gray.svg')
              }

              alt=""
              className='me-0'
            /></button>
            {product.quantity > 0 ?
              (<button className="product-card-btn-add-to-cart" onClick={handleAddToCart}><img src={isInCart ? '/static/cart-filled.svg' : '/static/cart-empty.svg'} alt="" /></button>)
              :
              (<button className="product-card-btn-add-to-cart" disabled><img src='/static/cart-empty-gray.svg' alt="" /></button>)}
          </div>
        </div>
      </div>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}

export default ProductCard
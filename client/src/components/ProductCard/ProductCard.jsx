import React from 'react'
import './ProductCard.css'
import { useNavigate } from "react-router-dom";
import { PRODUCT_ROUTE } from '../../utils/path'

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
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
              <img src='/static/star-filled.svg' alt="" />
              <img src='/static/star-filled.svg' alt="" />
              <img src='/static/star-filled.svg' alt="" />
              <img src='/static/star-filled.svg' alt="" />
              <img src='/static/star-filled.svg' alt="" />
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
            <button className="product-card-btn-add-to-cart"><img src={product.quantity > 0 ? '/static/wishlist-empty.svg' : '/static/wishlist-empty-gray.svg'} alt="" className='me-0' /></button>
            {product.quantity > 0 ?
              (<button className="product-card-btn-add-to-cart" ><img src='/static/cart-empty.svg' alt="" /></button>)
              :
              (<button className="product-card-btn-add-to-cart" disabled><img src='/static/cart-empty-gray.svg' alt="" /></button>)}
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProductCard
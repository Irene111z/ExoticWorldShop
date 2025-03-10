import React from 'react'
import './ProductCard.css'
import { useNavigate } from "react-router-dom";
import { PRODUCT_ROUTE } from '../../utils/path'

const ProductCard = ({product}) => {
  const navigate = useNavigate();
  return (
    <div className="col mb-4 product-card">
      <div className="d-flex flex-column justify-content-between product-card-content">
        <div className="d-flex flex-column">
          <p style={{color:"#858585", fontSize:'12px'}} className='mb-1'>Код: {product.id}</p>
          <div className="d-flex flex-column align-items-center">
            <img className="d-flex" src={product.img} alt="..." onClick={() => navigate(`${PRODUCT_ROUTE}/${product.id}`)}/>
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
          <div className="d-flex flex-column product-card-price">
            <div className="d-flex me-0" style={{fontSize:'12px'}}>
              <p className='text-uppercase me-2 my-0' style={{color:'#FF7A00', fontWeight:'700'}}>Ціна</p>
              <p className="text-decoration-line-through my-0" style={{color:'#5F6368'}}>{product.price} ₴</p>
            </div>
            <p className="my-0"style={{color:'#FF7A00', fontWeight:'700', fontSize:'16px'}}>{product.price} ₴</p>
          </div>
          <div className="d-flex product-card-btns">
            <img src='/static/wishlist-empty.svg' alt="" className='me-0'/>
            {/* <button onClick={()=>{addToCart(product.id)}} className="product-card-btn-add-to-cart"><img src='/static/cart-empty.svg' alt="" /></button> */}
            <button className="product-card-btn-add-to-cart"><img src='/static/cart-empty.svg' alt="" /></button> 
          </div>
        </div>
      </div>
        
    </div>
  )
}

export default ProductCard
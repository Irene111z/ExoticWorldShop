import React from 'react'
import Product from '../components/ProductPageComponents/Product/Product'

const ProductPage = () => {
  return (
    <div
      className='product-page d-flex flex-column justify-content-between container-fluid container-xxl mt-5'style={{ backgroundColor: '#fff', borderRadius: '20px' }}>
      {/* <div className="d-flex justify-content-center mt-2">
        <BreadCrumb product={product}/>
      </div> */}
      <Product />
    </div>
  )
}

export default ProductPage
import React, { useState } from 'react';
import './ProductsManagement.css'
import ProductList from '../../components/AdminPages/ProductList/ProductList'
import { CREATE_PRODUCT_ROUTE } from '../../utils/path'
import { useNavigate } from "react-router-dom"

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='container-fluid container-xxl'>
      <p className='mt-3 admin-products-title'>Товари</p>
      <div className="d-flex justify-content-between">
        <input
          type="text"
          placeholder='Пошук за назвою або кодом'
          className='search-product-admin'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='add-product-link' onClick={() => navigate(`${CREATE_PRODUCT_ROUTE}`)}>Додати товар</button>
      </div>
      <ProductList searchTerm={searchTerm} />
    </div>
  )
}

export default ProductsManagement;

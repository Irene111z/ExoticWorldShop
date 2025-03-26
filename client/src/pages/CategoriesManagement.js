import React from 'react'
import CategoryList from '../components/AdminPages/Categories/CategoryList'
import './CategoriesManagement.css'

const CategoriesManagement = () => {
  return (
    <div className='container-fluid container-xxl'>
      <div className="d-flex">
        <p className='category-list-title mt-3 me-3'>Категорії</p>
        <img src="/static/edit-icon.svg" alt="" className='category-edit-icon'/>
      </div>
      <CategoryList/>
    </div>
  )
}

export default CategoriesManagement
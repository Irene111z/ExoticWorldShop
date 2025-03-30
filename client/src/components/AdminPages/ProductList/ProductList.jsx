import React from 'react'
import './ProductList.css'
import { useContext } from 'react'
import { Context } from '../../../index'
import { observer } from 'mobx-react-lite'
import { useNavigate } from "react-router-dom"
import { EDIT_PRODUCT_ROUTE } from '../../../utils/path'
import './ProductList.css'

const ProductList = observer(() => {
    const {product}=useContext(Context)
    const navigate = useNavigate();
    return (
        <div className='my-4'>
            <table className='product-list-table'>
                <thead>
                    <tr className='product-list-thead'>
                        <td>Фото</td>
                        <td>Код товару</td>
                        <td>Назва</td>
                        <td>Кількість на складі</td>
                        <td>Ціна</td>
                        <td>Ціна зі знижкою</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {product.products.map(product=>
                    <tr>
                        <td><img className='product-list-img' src={product.img} alt="" /></td>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.quantity} шт.</td>
                        <td>{product.price} грн.</td>
                        <td>{product.disc_price} грн.</td>
                        <td><img src="/static/edit-icon.svg" className='product-edit-icon' alt="" onClick={() => navigate(`${EDIT_PRODUCT_ROUTE}/${product.id}`)}/></td>
                    </tr>
                    )} 
                </tbody>
            </table>
        </div>
    )
})

export default ProductList
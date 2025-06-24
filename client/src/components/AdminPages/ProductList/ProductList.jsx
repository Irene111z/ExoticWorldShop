import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { useNavigate } from "react-router-dom";
import { EDIT_PRODUCT_ROUTE } from '../../../utils/path';
import { fetchProducts } from '../../../http/productAPI';

const ProductList = ({ searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 12;
    const navigate = useNavigate();

    const loadProducts = async (page, search) => {
        const data = await fetchProducts({ limit, page, search });
        setProducts(data.rows);
        setTotalPages(Math.ceil(data.count / limit));
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        loadProducts(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

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
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>
                                <img
                                    className='product-list-img'
                                    src={product.images?.find(img => img.isPreview)?.img}
                                    alt="product"
                                />
                            </td>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity} шт.</td>
                            <td>{product.price} грн.</td>
                            <td>{product.disc_price} грн.</td>
                            <td>
                                <img
                                    src="/static/edit-icon.svg"
                                    className='product-edit-icon'
                                    alt="edit"
                                    onClick={() => navigate(`${EDIT_PRODUCT_ROUTE}/${product.id}`)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>&laquo;</button>
                        </li>
                        {[...Array(totalPages)].map((_, idx) => (
                            <li key={idx + 1} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(idx + 1)}>{idx + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>&raquo;</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default ProductList;

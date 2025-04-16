import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import './ProductsManagement.css'

const EditProduct = observer(() => {
    const { product } = useContext(Context);
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        disc_price: '',
        img: '',
        description: ''
    });
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        const selectedProduct = product.products.find(p => p.id === Number(id));
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name,
                quantity: selectedProduct.quantity,
                price: selectedProduct.price,
                disc_price: selectedProduct.disc_price,
                img: selectedProduct.img,
                description: selectedProduct.description
            });
            const productFeatures = product.getFeatures(selectedProduct.id);
            setFeatures(productFeatures);
        }
    }, [id, product.products]);

    useEffect(() => {
        const textarea = document.getElementById('description');
        if (textarea) {
            // Оновлюємо висоту textarea після рендеру сторінки
            textarea.style.height = 'auto'; // Спочатку скидаємо висоту
            textarea.style.height = `${textarea.scrollHeight}px`; // Оновлюємо висоту в залежності від вмісту
        }
    }, [formData.description]); // Оновлюється, коли змінюється опис товару

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleFeatureChange = (e, featureId) => {
        const newFeatures = features.map(feature =>
            feature.id === featureId ? { ...feature, description: e.target.value } : feature
        );
        setFeatures(newFeatures);
    };
    const handleBrandChange = (e, featureId) => {
        const newFeatures = features.map(feature =>
            feature.id === featureId ? { ...feature, description: e.target.value } : feature
        );
        setFeatures(newFeatures);
    };

    return (
        <div className='container-fluid container-xxl mb-5'>
            <p className='mt-3 admin-products-title'>Редагування товару</p>
            <form className='d-flex flex-column edit-product-form'>
                <div className="d-flex flex-column mb-2">
                    <label htmlFor="name">Назва</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="d-flex mb-2">
                    <div className="d-flex flex-column me-5">
                        <label htmlFor="price">Ціна</label>
                        <div className="d-flex align-items-center">
                            <input className='edit-product-price me-2' type="text" name="price" id="price" value={formData.price} onChange={handleChange} />
                            <p className='m-0'>грн.</p>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <label htmlFor="disc_price">Ціна зі знижкою</label>
                        <div className="d-flex align-items-center">
                            <input className='edit-product-price me-2' type="text" name="disc_price" id='disc_price' value={formData.disc_price} onChange={handleChange} />
                            <p className='m-0'>грн.</p>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column mb-2">
                    <label htmlFor="quantity">Кількість товару на складі</label>
                    <div className="d-flex align-items-center">
                        <input className='me-2 edit-product-quantity' type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} />
                        <p className='m-0'>шт.</p>
                    </div>
                </div>
                <div className='mb-2'>
                    <label>Характеристики</label>
                    {features.map((feature) => (
                        <div key={feature.id} className="d-flex align-items-center mb-2">
                            <div className='edit-product-feature me-2'>
                                <label className='me-2'>{feature.name}:</label>
                                {feature.name === 'Бренд' ? (
                                    <select
                                        value={feature.description}
                                        onChange={(e) => handleBrandChange(e, feature.id)}
                                    >
                                        {product.brands.map((brand) => (
                                            <option key={brand.id} value={brand.name}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={feature.description}
                                        onChange={(e) => handleFeatureChange(e, feature.id)}
                                    />
                                )}
                            </div>
                            <img src="/static/delete-icon.svg" alt="" className='m-0' />
                        </div>
                    ))}
                    <label>Додати характеристику</label>
                    <div className="d-flex mb-2">
                        <input type="text" placeholder='Характеристика' className='me-4'/>
                        <input type="text" placeholder='Значення'/>
                    </div>
                    <button className='add-product-feature-btn'>Додати характеристику</button>
                </div>

                <div className="d-flex flex-column mb-2 ">
                    <label htmlFor="description">Опис товару</label>
                    <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        style={{
                            resize: 'none',
                            overflowY: 'hidden',
                            width: '100%',
                            minHeight: '40px',
                        }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                    />
                </div>
                <button type="submit" className='btn-save-product-changes'>Застосувати усі зміни</button>
            </form>
        </div>
    );
});

export default EditProduct;

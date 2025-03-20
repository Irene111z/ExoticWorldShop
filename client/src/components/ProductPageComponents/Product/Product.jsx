import { useContext, useState } from 'react'
import { Context } from '../../../index'
import { observer } from 'mobx-react-lite'
import './Product.css'
import ProductCard from '../../ProductCard/ProductCard'
import AuthForm from '../../AuthForm/AuthForm';

const Product = observer(() => {
    const { product } = useContext(Context)
    const prod = {
        id: 1,
        name: 'корм для пацючків',
        description: 'слалваллмлавп',
        new_price: 700,
        old_price: 1000,
        quantity: 5,
        brandId: 1,
        categoryId: 1,
        img: [
            "https://i.pinimg.com/736x/59/33/75/593375c87ad6e1381d1f4817b1cfa687.jpg",
            "https://i.pinimg.com/736x/c1/a0/46/c1a046b58414e1ada466e3d188587225.jpg",
            "https://i.pinimg.com/736x/a5/2a/c8/a52ac8b35a7b033f58db9286aafc6254.jpg",
            "https://i.pinimg.com/736x/83/a0/54/83a054b7377bacc0614845290029cce4.jpg"
        ]
    };
    const product_features = [
        { id: 1, name: 'Бренд', description: 'Ferplast' },
        { id: 2, name: 'Висота', description: '80 см' },
        { id: 3, name: 'Ширина', description: '70 см' },
        { id: 4, name: 'Довжина', description: '120 см' },
        { id: 5, name: 'Колір', description: 'сірий' },
    ]
    const [activeImage, setActiveImage] = useState(prod.img[0]);

    const similar = product.products.filter((e) => e.categoryId === prod.categoryId && e.id !== prod.id)

    const { user } = useContext(Context);

    const [showAuthModal, setShowAuthModal] = useState(false);

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const handleReviewSubmit = () => {
        if (!reviewText.trim()) return;
        console.log('Відгук:', { rating, text: reviewText });
        setReviewText('');
        setRating(0);
    };

    const openAuthModal = () => {
        setShowAuthModal(true);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    return (
        <div className='d-flex flex-column mt-5'>
            <div className="row">
                <div className="col-4 offset-1 product-slider flex-column">
                    <div className="active mb-3">
                        <img src={activeImage} alt="" className='' />
                        <div className="product-sale">
                            -{(((prod.old_price - prod.new_price) / prod.old_price) * 100).toFixed(0)}%
                        </div>
                    </div>
                    <div className="controls d-flex justify-content-between">
                        {prod.img.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt=""
                                className={activeImage === image ? 'selected' : ''}
                                onClick={() => setActiveImage(image)}
                            />
                        ))}
                    </div>
                </div>
                <div className="col-5 offset-1 d-flex flex-column product-base-info">
                    <p className='product-name mb-2'>{prod.name}</p>
                    <div className="d-flex justify-content-between align-items-end mb-2">
                        <div className="">
                            <img src='/static/star-filled.svg' alt="" />
                            <img src='/static/star-filled.svg' alt="" />
                            <img src='/static/star-filled.svg' alt="" />
                            <img src='/static/star-filled.svg' alt="" />
                            <img src='/static/star-filled.svg' alt="" />
                        </div>
                        <p className='product-id mb-0'>Код товару: {prod.id}</p>
                    </div>
                    <hr className='my-2' />
                    <div className="d-flex align-items-end">
                        <p className='me-3 product-new-price mb-0'>{prod.new_price} ₴</p>
                        <p className='product-old-price mb-1'>{prod.old_price} ₴</p>
                    </div>
                    <hr className='my-2' />
                    <p className='product-availible mb-2'>В наявності</p>
                    <div className="d-flex mb-2">
                        <button className="btn-add-to-cart me-3" >
                            {/* onClick={()=>{addToCart(prod.id)}} */}
                            Купити
                        </button>
                        <img src='/static/product-page-wishlist.svg' alt="" />
                    </div>
                    <hr className='my-2' />
                    <p className='product-delivery-title mb-2'>Доставка</p>
                    <div className="d-flex flex-column mb-3">
                        <div className="d-flex mb-1">
                            <div className="product-page-delivery-icon">
                                <img src='/static/delivery-store.svg' alt="" />
                            </div>
                            <p className='my-0 ms-3 product-delivery-text'>Самовивіз безкоштовно</p>
                        </div>
                        <div className="d-flex mb-1">
                            <div className="product-page-delivery-icon">
                                <img src='/static/delivery-nova-poshta.svg' alt="" />
                            </div>
                            <p className='my-0 ms-3 product-delivery-text'>Нова Пошта від 70 грн</p>
                        </div>
                        <div className="d-flex">
                            <div className="product-page-delivery-icon">
                                <img src='/static/delivery-ukr-poshta.svg' alt="" />
                            </div>
                            <p className='my-0 ms-3 product-delivery-text'>Укрпошта від 40 грн</p>
                        </div>
                    </div>
                    <p className='product-delivery-title mb-2'>Оплата</p>
                    <p className='product-delivery-text mb-1'>Онлайн на реквізити</p>
                    <p className='product-delivery-text m-0'>Оплата при отриманні</p>
                </div>
            </div>
            <div className="row my-5">
                <div className="col-10 offset-1">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="features-tab" data-bs-toggle="tab" data-bs-target="#features" type="button" role="tab" aria-controls="features" aria-selected="true">Характеристики</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="false">Опис товару</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-controls="reviews" aria-selected="false">Відгуки</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="similar-tab" data-bs-toggle="tab" data-bs-target="#similar" type="button" role="tab" aria-controls="similar" aria-selected="false">Схожі товари</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="features" role="tabpanel" aria-labelledby="features-tab">
                            <div className="d-flex flex-column mt-4 mb-3">
                                {product_features.map((feature) => (
                                    <p key={feature.id} className='features-title mb-2'>
                                        {feature.name}: <span style={{ fontWeight: '400', color: "#858585" }}>{feature.description}</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="tab-pane fade" id="description" role="tabpanel" aria-labelledby="description-tab">
                            <div className="mt-4 mb-4">
                                <p>Простора триповерхнева клітка від італійського бренду Ferplast створена для максимального комфорту ваших улюбленців. Ідеально підходить для утримання хом'яків, мишей або інших дрібних гризунів. Завдяки кільком рівням, тварини можуть активно рухатися, що забезпечує їм додаткову фізичну активність.
                                    Особливості клітки:
                                    Просторий дизайн: три рівні для ігор, відпочинку та активності.
                                    Висока якість матеріалів: стійка до зносу, нетоксична пластмаса та міцні металеві прути.
                                    Інтуїтивна збірка: клітка легко збирається та розбирається для зручного чищення.
                                    Це ідеальний вибір для тих, хто шукає надійне та комфортне місце для своїх гризунів!</p>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                            <div className="d-flex flex-column">
                                {user.isAuth ? (
                                    <div className="review-form mt-3">
                                        <p className="mb-2">Ваш відгук:</p>
                                        <div className="d-flex mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <img
                                                    key={star}
                                                    src={star <= rating ? '/static/star-filled.svg' : '/static/star-empty.svg'}
                                                    alt=""
                                                    onClick={() => setRating(star)}
                                                    style={{ cursor: 'pointer', width: '24px', marginRight: '5px' }}
                                                />
                                            ))}
                                        </div>
                                        <textarea
                                            className="form-control textarea-review mb-2"
                                            rows="3"
                                            placeholder="Опишіть ваші враження про продукт."
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                        />
                                        <button className="btn-add-review" onClick={handleReviewSubmit}>
                                            Надіслати відгук
                                        </button>
                                    </div>
                                ) : (
                                    <div className="">
                                        Щоб залишити відгук <span onClick={openAuthModal} className='auth-link'>увійдіть в акаунт</span>.
                                    </div>
                                )}
                                {showAuthModal && <AuthForm onClose={closeAuthModal} />}
                                <div className="d-flex flex-column mt-4">
                                    <hr className='mt-0' />
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex">
                                            <img src='/static/review-img.png' alt="" className='review-person-img me-3' />
                                            <div className="mt-3">
                                                <p className='review-person-name mb-0'>Мая Мишківна</p>
                                                <div className="">
                                                    <img src='/static/star-filled.svg' alt="" />
                                                    <img src='/static/star-filled.svg' alt="" />
                                                    <img src='/static/star-filled.svg' alt="" />
                                                    <img src='/static/star-filled.svg' alt="" />
                                                    <img src='/static/star-filled.svg' alt="" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className='mt-3'>20.10.2024</p>
                                    </div>
                                    <p className='mt-3'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem ad commodi, nemo delectus inventore reiciendis obcaecati quibusdam harum libero nam illum. Unde soluta quaerat iste quo tenetur voluptatibus harum ad.</p>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="similar" role="tabpanel" aria-labelledby="similar-tab">
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-row justify-content-between mb-4">
                                    <div className="d-flex flex-row similar-home-arrows">
                                        <img src='/static/left-arrow-round-gray.svg' alt="" className='me-4' />
                                        <img src='/static/right-arrow-round-gray.svg' alt="" />
                                    </div>
                                </div>
                                <div className="row row-cols-1 row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 g-4">
                                    {similar.map((product) => {
                                        return <ProductCard key={product.id} product={product} />
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
})

export default Product

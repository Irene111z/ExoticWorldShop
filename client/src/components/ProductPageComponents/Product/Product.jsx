import { useContext } from 'react'
import { Context } from '../../../index'
import { observer } from 'mobx-react-lite'
import './Product.css'
import ProductCard from '../../ProductCard/ProductCard'

const Product = observer(() => {
    const { product } = useContext(Context)
    const prod = {id:1, name:'корм для пацючків', description: 'слалваллмлавп', price:700, quantity:5, brandId:1, categoryId:1, img:"https://i.pinimg.com/736x/59/33/75/593375c87ad6e1381d1f4817b1cfa687.jpg"}
    const similar = product.products.filter((e) => e.categoryId === prod.categoryId && e.id !== prod.id)
    return (
        <div className='d-flex flex-column mt-5'>
            <div className="row">
                <div className="col-4 offset-1 product-slider flex-column">
                    <div className="active">
                        <img src={prod.img} alt="" className='' />
                        <div className="product-sale">
                            -{(((prod.old_price - prod.new_price) / prod.old_price) * 100).toFixed(0)}%
                        </div>
                    </div>
                    <div className="controls d-flex justify-content-between">
                        <img src={prod.img} alt="" />
                        <img src={prod.img} alt="" />
                        <img src={prod.img} alt="" />
                        <img src={prod.img} alt="" />
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
                                <p className='features-title mb-2'>Бренд: <span style={{ fontWeight: '400', color:"#858585"}}>Ferplast</span></p>
                                <p className='features-title mb-2'>Висота: <span style={{ fontWeight: '400', color:"#858585"}}>120 см</span></p>
                                <p className='features-title mb-2'>Ширина: <span style={{ fontWeight: '400', color:"#858585"}}>56 см</span></p>
                                <p className='features-title mb-2'>Довжина: <span style={{ fontWeight: '400', color:"#858585"}}>90 см</span></p>
                                <p className='features-title mb-2'>Призначення: <span style={{ fontWeight: '400', color:"#858585"}}>для гризунів</span></p>
                                <p className='features-title mb-2'>Колір: <span style={{ fontWeight: '400', color:"#858585"}}>сірий</span></p>
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
                                <button className='btn-add-review mt-3'>
                                    Залишити відгук
                                </button>
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
                                        return <ProductCard key={product.id} product={product}/>
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

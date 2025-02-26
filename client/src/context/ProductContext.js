import {makeAutoObservable} from 'mobx'

export default class ProductContext{
    constructor(){
        this._categories = [
            {id:1, name:'гризуни'},
            {id:2, name:'птахи'}
        ]
        this._brands = [
            {id:1, name:'vitacraft'},
            {id:2, name:'beaphar'}
        ]
        this._products = [
            {id:1, name:'корм для пацючків', description: 'слалваллмлавп', price:700, quantity:5, brandId:1, categoryId:1, img:"https://ru.pinterest.com/pin/6685099430253643/"},
            {id:2, name:'корм для папуг', description: 'ававаааааа', price:350, quantity:5, brandId:2, categoryId:2, img:"https://ru.pinterest.com/pin/652388696058430805/"},
            {id:3, name:'іграшка для папуг', description: 'ававаааааа', price:120, quantity:5, brandId:1, categoryId:2, img:"https://ru.pinterest.com/pin/28429041392081342/"},
            {id:4, name:'будинок для гризунів', description: 'будиночок повоаопвп', price:410, quantity:5, brandId:2, categoryId:1, img:"https://ru.pinterest.com/pin/340021840640399093/"},
        ]
        makeAutoObservable(this)
    }

    setBrands(brands){
        this._brands = brands
    }

    setCategories(categories){
        this._categories = categories
    }
    setProducts(products){
        this._products = products
    }

    get brands(){
        return this._brands
    }

    get categories(){
        return this._categories
    }

    get products(){
        return this._products
    }
}
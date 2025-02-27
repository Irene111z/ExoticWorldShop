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
            {id:1, name:'корм для пацючків', description: 'слалваллмлавп', price:700, quantity:5, brandId:1, categoryId:1, img:"https://i.pinimg.com/736x/59/33/75/593375c87ad6e1381d1f4817b1cfa687.jpg"},
            {id:2, name:'корм для папуг', description: 'ававаааааа', price:350, quantity:5, brandId:2, categoryId:2, img:"https://i.pinimg.com/736x/a7/34/ef/a734ef69083428b6a44d7d6888ccf307.jpg"},
            {id:3, name:'іграшка для папуг', description: 'ававаааааа', price:120, quantity:5, brandId:1, categoryId:2, img:"https://i.pinimg.com/736x/fe/48/7b/fe487b92a65b55a0e8665e55e6d623f2.jpg"},
            {id:4, name:'будинок для гризунів', description: 'будиночок повоаопвп', price:410, quantity:5, brandId:2, categoryId:1, img:"https://i.pinimg.com/736x/8a/fc/7d/8afc7d8c95dfff307b17035a92b68514.jpg"},
            {id:5, name:'будинок для змії', description: 'будиночок повоаопвп', price:358, quantity:5, brandId:2, categoryId:1, img:"https://i.pinimg.com/736x/d7/4c/01/d74c01e99bae4991c6a085ccc35b9aa2.jpg"}
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
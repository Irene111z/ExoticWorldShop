import {makeAutoObservable} from 'mobx'

export default class UserContext{
    constructor(){
        this._isAuth = false
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(auth){
        this._isAuth = auth
    }

    setUser(user){
        this._user = user
    }

    get isAuth(){
        return this._isAuth
    }

    get user(){
        return this._user
    }
}
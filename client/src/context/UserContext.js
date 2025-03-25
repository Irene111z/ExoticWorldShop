import {makeAutoObservable} from 'mobx'

export default class UserContext{
    constructor(){
        this._isAuth = true
        this._isAdmin = true
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(isAuth){
        this._isAuth = isAuth
    }

    setIsAdmin(isAdmin){
        this._isAdmin = isAdmin
    }

    setUser(user){
        this._user = user
    }

    get isAuth(){
        return this._isAuth
    }

    get isAdmin(){
        return this._isAdmin
    }

    get user(){
        return this._user
    }
}
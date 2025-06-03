import { makeAutoObservable } from 'mobx'

export default class UserContext {
    user = {};
    isAuth = false;
    isAdmin = false;

    constructor() {
        makeAutoObservable(this);

        const savedData = JSON.parse(localStorage.getItem("userData"));
        if (savedData) {
            this.user = savedData.user;
            this.isAuth = savedData.isAuth;
            this.isAdmin = savedData.isAdmin;
        }
    }

    setIsAuth(isAuth) {
        this.isAuth = isAuth;
    }

    setIsAdmin(isAdmin) {
        this.isAdmin = isAdmin;
    }

    setUser(user) {
        this.user = user;
    }

    get userId() {
        return this.user?.id;
    }
}

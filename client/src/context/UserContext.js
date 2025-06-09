import { makeAutoObservable } from 'mobx';
import { get_bookmarks_count, get_wishlist_count, get_cart_count } from '../http/userAPI';

export default class UserContext {
    user = {};
    isAuth = false;
    isAdmin = false;

    cartCount = 0;
    wishlistCount = 0;
    bookmarksCount = 0;

    constructor() {
        makeAutoObservable(this);

        const savedData = JSON.parse(localStorage.getItem("userData"));
        const token = localStorage.getItem("token");

        if (savedData && token) {
            this.user = savedData.user;
            this.isAuth = savedData.isAuth;
            this.isAdmin = savedData.isAdmin;

            this.updateCartCount();
            this.updateWishlistCount();
            this.updateBookmarksCount();
        } else {
            this.user = {};
            this.isAuth = false;
            this.isAdmin = false;
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

    async updateWishlistCount() {
        if (!this.isAuth) return;
        try {
            this.wishlistCount = await get_wishlist_count();
        } catch (e) {
            console.error('Помилка під час оновлення лічильників:', e);
        }
    }
    async updateCartCount() {
        if (!this.isAuth) return;
        try {
            this.cartCount = await get_cart_count();
        } catch (e) {
            console.error('Помилка під час оновлення лічильників:', e);
        }
    }
    async updateBookmarksCount() {
        if (!this.isAuth) return;
        try {
            this.bookmarksCount = await get_bookmarks_count();
        } catch (e) {
            console.error('Помилка під час оновлення лічильників:', e);
        }
    }
}

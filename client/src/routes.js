import { Admin, Wishlist, Bookmarks, HomePage, Auth, Blog, OrderPage, Catalog, PostPage, ProductPage, UserProfile } from './pages';
import * as path from '../src/utils/path'

export const authRoutes = [
    {   path: path.ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: path.WISHLIST_ROUTE,
        Component: Wishlist
    },
    {
        path: path.BOOKMARKS_ROUTE,
        Component: Bookmarks
    }
]
export const publicRoutes = [

    {
        path: path.HOMEPAGE_ROUTE,
        Component: HomePage
    },
    {
        path: path.CATALOG_ROUTE,
        Component: Catalog
    },
    {
        path: path.PRODUCT_ROUTE + '/:id',
        Component: ProductPage
    },
    {
        path: path.LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: path.REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: path.REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: path.ORDER_ROUTE,
        Component: OrderPage
    },
    {
        path: path.POST_ROUTE,
        Component: PostPage
    },

]
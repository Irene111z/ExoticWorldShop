import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../index';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const { user } = useContext(Context);

    useEffect(() => {
        // Якщо користувач не авторизований, зберігаємо поточний URL в localStorage
        if (!user.isAuth) {
            localStorage.setItem('redirectUrl', location.pathname);
        }
    }, [location, user.isAuth]);

    // Логіка для перевірки, чи користувач авторизований
    if (!user.isAuth) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;

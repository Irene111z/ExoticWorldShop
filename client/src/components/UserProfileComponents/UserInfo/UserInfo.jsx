import React from "react";
import './UserInfo.css'
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../index';
import { HOMEPAGE_ROUTE } from "../../../utils/path";
import { useContext } from "react";

const UserInfo = ({ userData, onEditClick }) => {

    const { user } = useContext(Context)

    const navigate = useNavigate();
    const logout = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token');
        navigate(HOMEPAGE_ROUTE);
    }

    if (!userData) return null;

    const { name, lastname, phone, email, delivery_info, img } = userData;

    return (
        <div className="user-profile-card p-4 mt-4">
            <div className="d-flex flex-column align-items-center mb-3">
                <div className="d-flex align-content-end mb-3">
                    <p className="user-profile-card-title mb-0 me-3">Профіль користувача</p>
                    <img src="/static/edit-icon.svg" alt="" onClick={onEditClick} className="edit-user-profile-icon" />
                </div>
                <img
                    src={
                        img
                            ? (img.startsWith('http') || img.startsWith('/uploads')) 
                                ? `${process.env.REACT_APP_API_URL}${img}`
                                : `/static/${img}`  // якщо це файл із /static/
                            : '/static/tiktok.svg'
                    }
                    alt="Profile"
                    className="user-profile-card-img"
                />
            </div>
            <div className="d-dlex flex-column">
                <p className="my-2">Ім'я: {name}</p>
                <p className="mb-2">Прізвище: {lastname}</p>
                <p className="mb-2">Телефон: {phone}</p>
                <p className="mb-2">Email: {email}</p>
                <p className="mb-2">Адреса доставки: {delivery_info}</p>
            </div>
            <button className="logout-user-btn p-1 mt-2" onClick={() => logout()} >Вийти</button>
        </div>
    );
};

export default UserInfo;

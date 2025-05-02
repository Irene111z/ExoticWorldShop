import React from "react";
import './UserInfo.css'

const UserInfo = ({ userData, onEditClick }) => {
    if (!userData) return null;

    const { name, lastname, phone, email, delivery_info, img } = userData;

    return (
        <div className="user-profile-card p-4 mt-4">
            <div className="d-flex flex-column align-items-center mb-3">
            <p className="user-profile-card-title mb-3">Профіль користувача</p>
                <img
                    src={img ? `${process.env.REACT_APP_API_URL}${img}` : '/static/tiktok.svg'}
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
            <button className="edit-user-profile-btn p-1"  onClick={onEditClick} >Редагувати</button>
        </div>
    );
};

export default UserInfo;

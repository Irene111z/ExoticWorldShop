import React, { useRef, useState} from "react";
import './UserInfoForm.css';

const UserInfoForm = ({ formData, onChange, onSubmit }) => {

    const [tempImage, setTempImage] = useState(null); // Стан для тимчасового зображення
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setTempImage(reader.result); // Зберігаємо тимчасове зображення
                onChange({
                    target: {
                        name: "img",
                        value: reader.result,
                    },
                });
            };

            reader.readAsDataURL(file);
            onChange({
                target: {
                    name: "imgFile",
                    value: file,
                },
            });
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="user-profile-card p-4 mt-4">
                <div className="d-flex flex-column align-items-center mb-3">
                    <p className="user-profile-card-title mb-3">Редагувати профіль</p>
                    <img
                        src={tempImage || (formData.img ? `${process.env.REACT_APP_API_URL}${formData.img}` : '/static/tiktok.svg')}
                        alt="Profile"
                        className="user-profile-card-img"
                        onClick={handleImageClick}
                        title="Натисніть, щоб змінити фото"
                    />
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-between mb-2">
                        <label>Ім'я:</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            className="user-profile-form-input"
                        />
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <label>Прізвище:</label>
                        <input
                            name="lastname"
                            value={formData.lastname}
                            onChange={onChange}
                            className="user-profile-form-input"
                        />
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <label>Телефон:</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={onChange}
                            className="user-profile-form-input"
                        />
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <label>Email:</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            className="user-profile-form-input"
                        />
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <label>Адреса доставки:</label>
                        <input
                            name="delivery_info"
                            value={formData.delivery_info}
                            onChange={onChange}
                            className="user-profile-form-input"
                        />
                    </div>

                    <button type="submit" className="save-user-profile-changes-btn p-1">Зберегти</button>
                </div>
            </div>
        </form>
    );
};

export default UserInfoForm;

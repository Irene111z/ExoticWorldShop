import React, { useState, useEffect } from "react";
import { $authHost } from "../../http";
import UserInfo from "../../components/UserProfileComponents/UserInfo/UserInfo";
import UserInfoForm from "../../components/UserProfileComponents/UserInfoForm/UserInfoForm";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    delivery_info: "",
    img: "",
    imgFile: null,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const { data } = await $authHost.get("api/user/profile");
            console.log("Завантажено userData:", data);
            setUserData(data);
            setFormData({
                name: data.name || "",
                lastname: data.lastname || "",
                phone: data.phone || "",
                email: data.email || "",
                delivery_info: data.delivery_info || "",
                img: data.img || "", // Завантажуємо старе зображення з профілю
            });
        } catch (error) {
            console.error("Не вдалося отримати профіль:", error);
        }
    };
    fetchUserProfile();
}, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = new FormData();
    
    if (formData.name !== userData.name) {
      form.append("name", formData.name);
    }
    if (formData.lastname !== userData.lastname) {
      form.append("lastname", formData.lastname);
    }
    if (formData.phone !== userData.phone) {
      form.append("phone", formData.phone);
    }
    if (formData.email !== userData.email) {
      form.append("email", formData.email);
    }
    if (formData.delivery_info !== userData.delivery_info) {
      form.append("delivery_info", formData.delivery_info);
    }
    
    if (formData.imgFile) {
      form.append("img", formData.imgFile);
    }
    
    try {
      const { data } = await $authHost.put("api/user/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUserData(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Помилка при редагуванні профілю:", error.response || error);
    }
  };
  
  
  
  

  if (!userData) return <div>Завантаження...</div>;

  return (
    <div className="container-fluid container-xxl">
      <div className="d-flex">
        {isEditing ? (
          <UserInfoForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
        ) : (
          <UserInfo userData={userData} onEditClick={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;

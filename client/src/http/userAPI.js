import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode"

export const registration = async (email, password, name, lastname, phone, img) => {
  const { data } = await $host.post('api/user/reg', { email, password, name, lastname, phone, img })
  localStorage.setItem('token', data.jwt_token)
  return jwtDecode(data.jwt_token)
}
export const fetchDefaultAvatars = async () => {
  try {
    const res = await $host.get('api/user/default-avatars');
    return res.data;
  } catch (error) {
    console.error('Помилка отримання аватарів:', error);
    throw error;
  }
};
export const login = async (email, password) => {
  const { data } = await $host.post('api/user/login', { email, password })
  localStorage.setItem('token', data.jwt_token)
  return jwtDecode(data.jwt_token)
}
export const check_token = async () => {
  const { data } = await $authHost.get('api/user/check_token')
  localStorage.setItem('token', data.jwt_token)
  return jwtDecode(data.jwt_token)
}
export const get_bookmarks_count = async () =>{
  const res = await $authHost.get('api/bookmarks/count');
  return res.data;
}
export const get_wishlist_count = async () =>{
  const res = await $authHost.get('api/wishlist/count');
  return res.data;
}
export const get_cart_count = async () =>{
  const res = await $authHost.get('api/cart/count');
  return res.data;
}
export const fetchUserProfile = async () => {
  const { data } = await $authHost.get('api/user/profile');
  return data;
};

export const updateUserProfile = async (formData) => {
  const res = await $authHost.put('api/user/profile', formData);
  return res.data;
};
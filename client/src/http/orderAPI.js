import { $authHost, $host } from './index';

// Створити замовлення
export const createOrder = async (data) => {
  const response = await $authHost.post('/api/order', data);
  return response.data;
}
// Отримати список замовлень користувача
export const fetchUserOrders = async () => {
  const { data } = await $authHost.get('/api/order');
  return data;
}
//Скасувати замовлення (для користувача)
export const cancelOrder = async (id) => {
  const { data } = await $authHost.patch(`/api/order/${id}/cancel`);
  return data;
}
//Отримати усі замовлення (для адміну)
export const fetchAllOrders = async () => {
  const { data } = await $authHost.get('/api/order/all');
  return data;
}
//Змінити статус замовлення (для адміну)
export const changeOrderStatus = async (id, status) => {
  const { data } = await $authHost.patch(`/api/order/${id}/status`, { status });
  return data;
}
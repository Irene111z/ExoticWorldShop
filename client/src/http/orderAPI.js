import { $authHost, $host } from './index';

// Створити замовлення
export const createOrder = async (data) => {
  const response = await $authHost.post('/api/order', data);
  return response.data;
}
import {$authHost, $host} from './index';

// Отримати всі категорії
export const fetchCategories = async () => {
    const {data} = await $host.get('/api/category');
    return data;
};

// Створити нову категорію
export const createCategory = async (category) => {
    const {data} = await $authHost.post('/api/category', category);
    return data;
};

// Оновити категорію
export const updateCategory = async (id, body) => {
    const {data} = await $authHost.put(`/api/category/${id}`, body);
    return data;
};

// Видалити категорію
export const deleteCategory = async (id) => {
    const {data} = await $authHost.delete(`/api/category/${id}`);
    return data;
};

import React from "react";
import CategoryList from "../components/AdminPages/Categories/CategoryList";
import categoryStore from "../context/CategoryContext";
import { observer } from "mobx-react-lite";
import "./CategoriesManagement.css";

// Функція для отримання повного шляху категорії
const getCategoryPath = (category, categories) => {
  const path = [];
  let current = category;

  while (current) {
    path.unshift(current.name); // Додаємо назву на початок
    current = categories.find((c) => c.id === current.parentId); // Шукаємо батьківську категорію
  }

  return path.join(" > "); // Формуємо рядок "Гризуни > Аксесуари > Гамаки"
};

const CategoriesManagement = observer(() => {
  return (
    <div className="container-fluid container-xxl">
      <div className="d-flex justify-content-between">
        <div>
          <div className="d-flex">
            <p className="category-list-title mt-3">Категорії</p>
          </div>
          <CategoryList />
        </div>
        <div className="d-flex flex-column mt-3">
          {/* Додавання категорії */}
          <form className="d-flex flex-column mb-5">
            <p className="category-form-title">Додати категорію</p>
            <input type="text" placeholder="Назва категорії" className="mb-2 category-input" />
            <select className="mb-2 category-input">
              <option value="" selected disabled hidden>Батьківська категорія</option>
              {categoryStore.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryPath(category, categoryStore.categories)}
                </option>
              ))}
            </select>
            <button className="btn-category-create">Додати категорію</button>
          </form>

          {/* Зміна назви категорії */}
          <form className="d-flex flex-column mb-5">
            <p className="category-form-title">Змінити назву категорії</p>
            <select className="mb-2 category-input">
              <option value="" selected disabled hidden>Категорія</option>
              {categoryStore.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryPath(category, categoryStore.categories)}
                </option>
              ))}
            </select>
            <input type="text" placeholder="Нова назва категорії" className="mb-2 category-input" />
            <button className="btn-category-change">Застосувати зміни</button>
          </form>

          {/* Видалення категорії */}
          <form className="d-flex flex-column">
            <p className="category-form-title">Видалити категорію</p>
            <select className="mb-2 category-input">
              <option value="" selected disabled hidden>Категорія</option>
              {categoryStore.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryPath(category, categoryStore.categories)}
                </option>
              ))}
            </select>
            <button className="btn-category-delete">Видалити</button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default CategoriesManagement;

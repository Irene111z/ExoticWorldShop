import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProducts } from '../http/productAPI';
import ProductCard from '../components/ProductCard/ProductCard';

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProducts({ categoryId })
      .then((data) => {
        console.log("Відповідь від API:", data);
        const products = data.rows || [];  // Отримуємо масив товарів з 'rows'
        if (Array.isArray(products)) {
          setProducts(products);
        } else {
          setError("Щось пішло не так, отримано неправильні дані.");
        }
      })
      .catch((err) => setError("Помилка при завантаженні товарів"))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-xxl py-4">
      <h2 className="mb-4">Товари категорії</h2>
      <div className="row row-cols-1 row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Товарів не знайдено.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;

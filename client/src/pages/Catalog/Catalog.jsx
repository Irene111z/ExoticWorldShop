import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { fetchProducts, fetchCategories, fetchWishlist, fetchCart } from '../../http/productAPI';
import ProductCard from '../../components/ProductCard/ProductCard';
import { CATALOG_ROUTE, HOMEPAGE_ROUTE } from '../../utils/path';
import './Catalog.css'
import { Context } from '../..';

const Catalog = () => {
  const { user } = useContext(Context);
  const { categoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryPath, setCategoryPath] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [filters, setFilters] = useState({}); // { featureName: [value1, value2] }
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  useEffect(() => {
    if (user?.isAuth) {
      fetchWishlist().then(items => setWishlistIds(items.rows.map(item => item.productId)));
      fetchCart().then(data => setCartItems(data?.cart_items || []));
    } else {
      setWishlistIds([]);
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      const [productData, allCategories] = await Promise.all([
        fetchProducts({ categoryId }),
        fetchCategories(),
      ]);

      const prods = productData.rows || [];
      const sorted = [...prods]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .sort((a, b) => (b.quantity > 0 ? 1 : -1) - (a.quantity > 0 ? 1 : -1));

      setProducts(sorted);

      // Категорії
      const buildPath = (id, cats, path = []) => {
        const cat = cats.find(c => String(c.id) === String(id));
        if (!cat) return path;
        path.unshift({ id: cat.id, name: cat.name });
        return cat.parentId ? buildPath(cat.parentId, cats, path) : path;
      };
      setCategoryPath(buildPath(categoryId, allCategories));

      // Ціна
      const prices = prods.map(p => parseFloat(p.price));
      setMinPrice(Math.min(...prices));
      setMaxPrice(Math.max(...prices));
      setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
    };

    loadData();
  }, [categoryId]);

  const brandOptions = [
    ...new Map(
      products
        .filter(p => p.brand && p.brand.id && p.brand.name)
        .map(p => [p.brand.id, p.brand])
    ).values()
  ];

  const allFeatures = {};
  products.forEach(p =>
    p.productFeatures.forEach(f => {
      if (!allFeatures[f.name]) allFeatures[f.name] = new Set();
      allFeatures[f.name].add(f.description);
    })
  );

  // Фільтрація
  useEffect(() => {
    const result = products.filter(p =>

      Object.entries(filters).every(([name, descriptions]) =>
        p.productFeatures.some(f => f.name === name && descriptions.includes(f.description))
      ) &&

      (selectedBrands.length === 0 || selectedBrands.includes(p.brand.id)) &&

      parseFloat(p.price) >= priceRange.min && parseFloat(p.price) <= priceRange.max
    );
    setFilteredProducts(result);
  }, [filters, priceRange, selectedBrands, products]);

  const toggleFilter = (name, description) => {
    setFilters(prev => {
      const prevDescriptions = prev[name] || [];
      const newDescriptions = prevDescriptions.includes(description)
        ? prevDescriptions.filter(v => v !== description)
        : [...prevDescriptions, description];

      const updatedFilters = { ...prev, [name]: newDescriptions };

      if (updatedFilters[name].length === 0) {
        delete updatedFilters[name];
      }

      return updatedFilters;
    });
  };

  const toggleBrand = (id) => {
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(brand => brand !== id) : [...prev, id]
    );
  };

  const lastCategory = categoryPath.at(-1);

  return (
    <div className="container-xxl py-4">
      <p className="mb-2 catalog-current-category">{lastCategory?.name}</p>
      <div className="mb-4">
        <span className='catalog-breadcrumbs'><Link to={HOMEPAGE_ROUTE}>ExoWorld</Link>{' > '}</span>
        {categoryPath.map((cat, i) => (
          <span key={cat.id} className='catalog-breadcrumbs'>
            {i === categoryPath.length - 1
              ? <span className='catalog-breadcrumbs-disabled'>{cat.name}</span>
              : <Link to={`${CATALOG_ROUTE}/${cat.id}`}>{cat.name}</Link>}
            {i < categoryPath.length - 1 && ' > '}
          </span>
        ))}
      </div>

      {/* --- Фільтри --- */}
      <div className="mb-4">
        <h5>Фільтри</h5>

        <div className='d-flex flex-column'>
          <strong>Ціна:</strong>
          <div className="">
            <input type="number" value={priceRange.min} min={minPrice}
              onChange={e => setPriceRange({ ...priceRange, min: +e.target.value || 0 })}
              style={{ width: '80px' }}
            />
            —
            <input type="number" value={priceRange.max} max={maxPrice}
              onChange={e => setPriceRange({ ...priceRange, max: +e.target.value || 0 })}
              style={{ width: '80px' }}
            />
          </div>
        </div>

        <div className='d-flex flex-column'>
          <strong>Бренд:</strong>
          {brandOptions.map(brand => (
            <label key={brand.id} style={{ marginRight: '10px' }}>
              <input type="checkbox" checked={selectedBrands.includes(brand.id)} onChange={() => toggleBrand(brand.id)} />
              {brand.name}
            </label>
          ))}
        </div>

        {Object.entries(allFeatures).map(([name, values]) => (
          <div key={name} className='d-flex flex-column'>
            <strong>{name}</strong>
            {[...values].map(val => (
              <label key={val} style={{ marginRight: '10px' }}>
                <input
                  type="checkbox"
                  checked={filters[name]?.includes(val) || false}
                  onChange={() => toggleFilter(name, val)}
                />
                {val}
              </label>
            ))}
          </div>
        ))}
      </div>

      <div className="row row-cols-1 row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} wishlistIds={wishlistIds} cartItems={cartItems} />
          ))
        ) : (
          <p>Нічого не знайдено за заданими фільтрами.</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;

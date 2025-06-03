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
  const [filters, setFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

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

      setCurrentPage(1);
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
    setCurrentPage(1);
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

  // Обчислюємо товари поточної сторінки
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Визначаємо загальну кількість сторінок
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-xxl py-4 ">
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

      <div className="row">
        {currentItems.length > 0 ?
          (<div className="col-12 col-md-2 mb-4 catalog-filters">
            <div className="d-flex flex-column mb-3">
              <h6>Ціна:</h6>
              <div className="d-flex justify-content-between" style={{ color: '#fff' }}>
                <span>{priceRange.min} ₴</span>
                <span>{priceRange.max} ₴</span>
              </div>
              <div style={{ position: 'relative', height: '30px' }}>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange.min}
                  onChange={e => {
                    const val = +e.target.value;
                    setPriceRange(prev => ({
                      ...prev,
                      min: Math.min(val, prev.max),
                    }));
                  }}
                  className="range-slider"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={e => {
                    const val = +e.target.value;
                    setPriceRange(prev => ({
                      ...prev,
                      max: Math.max(val, prev.min),
                    }));
                  }}
                  className="range-slider"
                />
              </div>
            </div>

            <div className='d-flex flex-column mb-3'>
              <h6>Бренд:</h6>
              {brandOptions.map(brand => (
                <label key={brand.id} style={{ marginRight: '10px' }}>
                  <input type="checkbox" className="custom-checkbox" checked={selectedBrands.includes(brand.id)} onChange={() => toggleBrand(brand.id)} />
                  <span className="ms-2">{brand.name}</span>
                </label>
              ))}
            </div>

            {Object.entries(allFeatures).map(([name, values]) => (
              <div key={name} className='d-flex flex-column mb-3'>
                <h6>{name}</h6>
                {[...values].map(val => (
                  <label key={val} >
                    <input
                      type="checkbox" className="custom-checkbox"
                      checked={filters[name]?.includes(val) || false}
                      onChange={() => toggleFilter(name, val)}
                    />
                    <span className="ms-2">{val}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
          ) :
          <span />
        }
        <div className="col-12 col-md-10">
          <div className="row row-cols-1 row-cols-xxl-4 row-cols-xl-3 row-cols-lg-3 row-cols-md-2 g-4">
            {currentItems.length > 0 ? (
              currentItems.map(product => (
                <ProductCard key={product.id} product={product} wishlistIds={wishlistIds} cartItems={cartItems} />
              ))
            ) : (
              <span/>
            )}
          </div>
          {currentItems.length <= 0 ? (
            <p style={{color: '#fff'}}>Товарів не знайдено :(</p>
            ) : (
            <span/>
            )}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>&laquo;</button>
                </li>
                {[...Array(totalPages)].map((_, idx) => (
                  <li key={idx + 1} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(idx + 1)}>{idx + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>&raquo;</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>

  );
};

export default Catalog;

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { API_ENDPOINTS } from '../config/api';
import './ProductList.css';

const PKR = new Intl.NumberFormat('en-PK');
const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'clothes', label: 'Clothes' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'mobiles', label: 'Mobiles' },
];
const GENDER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
];
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

function filterProducts(products, filters) {
  let filtered = [...products];
  if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
  if (filters.gender) filtered = filtered.filter(p => (p.gender === filters.gender));
  if (filters.featured) filtered = filtered.filter(p => p.featured);
  if (filters.sale) filtered = filtered.filter(p => p.sale);
  if (filters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (filters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  return filtered;
}

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ category: '', gender: '', featured: false, sale: false, sort: '' });
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(API_ENDPOINTS.products)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);

  const handleFilterChange = e => {
    const { name, value, type, checked } = e.target;
    setFilters(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const filteredProducts = filterProducts(products, filters);

  if (loading) return <div className="productlist-loading">Loading products...</div>;
  if (error) return <div className="productlist-empty">{error}</div>;
  if (!products.length) return <div className="productlist-empty">No products found.</div>;

  return (
    <>
      <div className="productlist-filters">
        <select name="category" value={filters.category} onChange={handleFilterChange} className="productlist-filter-select">
          {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select name="gender" value={filters.gender} onChange={handleFilterChange} className="productlist-filter-select">
          {GENDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <label className="productlist-filter-checkbox">
          <input type="checkbox" name="featured" checked={filters.featured} onChange={handleFilterChange} /> Featured
        </label>
        <label className="productlist-filter-checkbox">
          <input type="checkbox" name="sale" checked={filters.sale} onChange={handleFilterChange} /> Sale
        </label>
        <select name="sort" value={filters.sort} onChange={handleFilterChange} className="productlist-filter-select">
          {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div className="productlist-grid">
        {filteredProducts.length === 0 ? (
          <div className="productlist-empty">No products found for selected filters.</div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
              </div>
              <h2 className="product-title">{product.name}</h2>
              <p className="product-category">{product.category}</p>
              {product.gender && <p className="product-gender">{product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}</p>}
              {product.featured && <span className="product-badge product-badge-featured">Featured</span>}
              {product.sale && <span className="product-badge product-badge-sale">Sale</span>}
              <p className="product-price">PKR {PKR.format(product.price)}</p>
              <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
                <Link to={`/product/${product._id}`} className="product-details-btn">View Details</Link>
                <button
                  className="product-details-btn"
                  style={{ background: '#388e3c' }}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ProductList;
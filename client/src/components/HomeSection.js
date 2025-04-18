import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { API_ENDPOINTS } from '../config/api';
import './ProductList.css';
import '../pages/Home.css';

const PKR = new Intl.NumberFormat('en-PK');

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const ALL_SECTIONS = [
  { key: 'new', label: 'New Arrivals', description: 'Check out the latest additions to our collection.' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'clothes', label: 'Clothes' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'mobiles', label: 'Mobiles' },
];

const getSectionProducts = (products, sectionKey) => {
  if (sectionKey === 'new') {
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
  }
  return products.filter(p => p.category === sectionKey);
};

// Reusable ProductCard component
const ProductCard = ({ product, addToCart }) => (
  <div className="product-card home-carousel-card" key={product._id}>
    <div className="product-image-container">
      <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
    </div>
    <h3 className="product-title">{product.name}</h3>
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
);

// ProductsSection component to render a section with title and products
const ProductsSection = ({ title, description, products, addToCart, isFirst }) => (
  <div style={{ marginTop: isFirst ? 0 : 48 }}>
    <h2 className="home-section-title">{title}</h2>
    {description && <div className="home-section-desc">{description}</div>}
    <div className="home-carousel">
      {products.map(product => (
        <ProductCard key={product._id} product={product} addToCart={addToCart} />
      ))}
    </div>
  </div>
);

const HomeSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(API_ENDPOINTS.products)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  let sortedProducts = [...products];
  if (sort === 'price-asc') sortedProducts.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') sortedProducts.sort((a, b) => b.price - a.price);

  if (loading) return null;
  if (!products.length) return null;

  return (
    <section className="home-section-modern" id="products">
      {/* Sort controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select value={sort} onChange={e => setSort(e.target.value)} className="productlist-filter-select">
          {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      
      {/* All product sections */}
      {ALL_SECTIONS.map((section, index) => {
        const sectionProducts = getSectionProducts(sortedProducts, section.key);
        if (!sectionProducts.length) return null;
        return (
          <ProductsSection 
            key={section.key} 
            title={section.label}
            description={section.description}
            products={sectionProducts}
            addToCart={addToCart}
            isFirst={index === 0}
          />
        );
      })}
    </section>
  );
};

export default HomeSection;

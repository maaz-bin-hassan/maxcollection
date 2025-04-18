import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContext } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './ProductList.css';
import '../pages/Home.css';

const PKR = new Intl.NumberFormat('en-PK');

const categorySections = [
  { key: 'featured', label: 'Featured', filter: p => p.featured },
  { key: 'men', label: 'Men', filter: p => p.gender === 'men' },
  { key: 'women', label: 'Women', filter: p => p.gender === 'women' },
  { key: 'electronics', label: 'Electronics', filter: p => p.category === 'electronics' },
];

const HomeProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(API_ENDPOINTS.products)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="home-section">Loading products...</div>;
  if (!products.length) return <div className="home-section">No products found.</div>;

  return (
    <>
      {categorySections.map(section => {
        const sectionProducts = products.filter(section.filter);
        if (!sectionProducts.length) return null;
        return (
          <section className="home-section" id={section.key} key={section.key}>
            <h2 className="home-section-title">{section.label} Products</h2>
            <div className="home-carousel">
              {sectionProducts.map(product => (
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
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
};

export default HomeProductsSection;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
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

  if (loading) return <div className="productlist-loading">Loading products...</div>;
  if (error) return <div className="productlist-empty">{error}</div>;
  if (!products.length) return <div className="productlist-empty">No products found.</div>;

  return (
    <div className="productlist-grid">
      {products.map(product => (
        <div key={product._id} className="product-card">
          <div className="product-image-container">
            <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
          </div>
          <h2 className="product-title">{product.name}</h2>
          <p className="product-category">{product.category}</p>
          <p className="product-price">${product.price}</p>
          <Link to={`/product/${product._id}`} className="product-details-btn">View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="productdetail-loading">Loading...</div>;
  if (!product) return <div className="productdetail-empty">Product not found.</div>;

  return (
    <div className="productdetail-container">
      <div className="productdetail-flex">
        <div className="productdetail-gallery">
          <div className="productdetail-image-main">
            <img src={product.imageUrls[selectedImg]} alt={product.name} className="productdetail-image" />
          </div>
          <div className="productdetail-thumbs">
            {product.imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt=""
                className={`productdetail-thumb${selectedImg === idx ? ' selected' : ''}`}
                onClick={() => setSelectedImg(idx)}
              />
            ))}
          </div>
        </div>
        <div className="productdetail-info">
          <h1 className="productdetail-title">{product.name}</h1>
          <p className="productdetail-desc">{product.description}</p>
          <p className="productdetail-category">Category: {product.category}</p>
          <p className="productdetail-price">${product.price}</p>
          <button onClick={() => addToCart(product)} className="productdetail-add-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
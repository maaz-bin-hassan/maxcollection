import React from 'react';
import ProductList from '../components/ProductList';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Welcome to Max Collection</h1>
        <p className="home-subtitle">Discover our featured products and categories.</p>
        <div className="home-divider" />
      </div>
      <ProductList />
    </div>
  );
};

export default Home;
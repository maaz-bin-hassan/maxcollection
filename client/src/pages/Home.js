import React from 'react';
import './Home.css';
import HomeProductsSection from '../components/HomeProductsSection';
import HomeSection from '../components/HomeSection';

const Home = () => {
  return (
    <div className="home-modern-container">
      <section className="home-hero-bar">
        <div className="home-hero-content">
          <h1 className="home-hero-title">Welcome to Max Collection</h1>
          <p className="home-hero-subtitle">Discover the latest trends and premium products for everyone. Shop by category below.</p>
        </div>
      </section>
      <HomeSection sectionKey="new" title="New Arrivals" description="Check out the latest additions to our collection." />
      <HomeSection sectionKey="featured" title="Featured" description="Handpicked products just for you." />
      <HomeSection sectionKey="men" title="Men" description="Trending styles and essentials for men." />
      <HomeSection sectionKey="women" title="Women" description="Latest fashion and accessories for women." />
      <HomeSection sectionKey="electronics" title="Electronics" description="Top gadgets and electronics." />
    </div>
  );
};

export default Home;
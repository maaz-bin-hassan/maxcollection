import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import logo from './assets/logo.jpg';
import ProductDetail from './components/ProductDetail';
import { CartProvider, CartContext } from './context/CartContext';
import { FaShoppingCart, FaFacebook, FaInstagram, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';
import Admin from './pages/Admin';
import './App.css';

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Max Collection Logo" className="logo-img" />
            <span className="logo-text">Max Collection</span>
          </Link>
          <button 
            className="menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/cart" className="cart-link">
              <FaShoppingCart className="cart-icon" />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
          </nav>
        </div>
        {isMenuOpen && (
          <nav className="nav-mobile">
            <div className="nav-mobile-list">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMenuOpen(false)}>
                <FaShoppingCart /> Cart
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>
            </div>
          </nav>
        )}
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social"><FaFacebook size={24} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social"><FaInstagram size={24} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social"><FaTwitter size={24} /></a>
          </div>
          <div className="footer-copy">&copy; {new Date().getFullYear()} Max Collection. All rights reserved.</div>
          <div className="footer-desc">Premium quality products for everyone</div>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;

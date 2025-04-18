import React, { useState } from 'react';
import ProductUpload from '../components/ProductUpload';
import OrderAdmin from '../components/OrderAdmin';
import { API_ENDPOINTS } from '../config/api';
import './Admin.css';

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [input, setInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showOrders, setShowOrders] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(API_ENDPOINTS.products, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${input}`
        },
        body: JSON.stringify({ name: 'test', description: 'test', category: 'test', price: 1, quantity: 1, images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn8B9pQn1wAAAABJRU5ErkJggg=="] })
      });
      if (res.status === 401) {
        setLoginError('Invalid admin token.');
        return;
      }
      localStorage.setItem('adminToken', input);
      setToken(input);
    } catch {
      setLoginError('Network error.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  if (!token) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1 className="admin-title">Admin Login</h1>
          <form onSubmit={handleLogin} className="admin-login-form">
            <label className="admin-label" htmlFor="admin-token">Admin Token</label>
            <input
              id="admin-token"
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter admin token"
              className="admin-input"
              autoFocus
            />
            <button type="submit" className="admin-btn admin-btn-primary">Login</button>
            {loginError && <div className="admin-error">{loginError}</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header">
        <h1 className="admin-title">Admin Panel</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowOrders(true)} className="admin-btn admin-btn-secondary">See Orders</button>
          <button onClick={handleLogout} className="admin-btn admin-btn-danger">Logout</button>
        </div>
      </div>
      <div className="admin-panel-content">
        <div className="admin-panel-section">
          <ProductUpload token={token} />
        </div>
      </div>
      {showOrders && (
        <div className="admin-orders-modal">
          <div className="admin-orders-modal-content">
            <button className="admin-orders-modal-close" onClick={() => setShowOrders(false)}>&times;</button>
            <OrderAdmin token={token} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { API_ENDPOINTS } from '../config/api';
import './Checkout.css';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    number: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setStatus('Cart is empty.');
      return;
    }
    setStatus('Submitting order...');
    try {
      const res = await fetch(API_ENDPOINTS.orders, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo: form, cartItems: cart.map(({ _id, name, price, quantity }) => ({ productId: _id, name, price, quantity })) }),
      });
      if (res.ok) {
        setStatus('Order submitted successfully!');
        clearCart();
        setForm({ name: '', email: '', number: '', address: '', city: '', province: '', postalCode: '' });
      } else {
        setStatus('Order submission failed.');
      }
    } catch {
      setStatus('Order submission failed.');
    }
  };

  return (
    <div className="checkout-main-container">
      <div className="checkout-card">
        <div className="checkout-form-section">
          <h1 className="checkout-title">Checkout</h1>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-fields">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="checkout-input" />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="checkout-input" />
              <input name="number" value={form.number} onChange={handleChange} placeholder="Phone Number" required className="checkout-input" />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required className="checkout-input" />
              <div className="checkout-row">
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="checkout-input" />
                <input name="province" value={form.province} onChange={handleChange} placeholder="Province" required className="checkout-input" />
                <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" required className="checkout-input" />
              </div>
            </div>
            <button type="submit" className="checkout-btn">Submit Order</button>
            {status && <div className="checkout-status">{status}</div>}
          </form>
        </div>
        <div className="checkout-summary-section">
          <div className="checkout-summary-card">
            <h2 className="summary-title">Order Summary</h2>
            {cart.length === 0 ? (
              <div className="summary-empty">Your cart is empty.</div>
            ) : (
              <ul className="summary-list">
                {cart.map(item => (
                  <li key={item._id} className="summary-item">
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-qty">x{item.quantity}</span>
                    </div>
                    <div className="summary-item-price">PKR {(item.price * item.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            )}
            <div className="summary-total-row">
              <span className="summary-total-label">Total:</span>
              <span className="summary-total-value">PKR {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
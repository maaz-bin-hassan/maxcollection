import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setStatus('Cart is empty.');
      return;
    }
    setStatus('Submitting order...');
    try {
      const res = await fetch('/api/orders', {
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
    <div className="checkout-container">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto grid gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="border p-2" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="border p-2" />
          <input name="number" value={form.number} onChange={handleChange} placeholder="Phone Number" required className="border p-2" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required className="border p-2" />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="border p-2" />
          <input name="province" value={form.province} onChange={handleChange} placeholder="Province" required className="border p-2" />
          <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" required className="border p-2" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Order</button>
        </form>
        {status && <div className="mt-4">{status}</div>}
      </div>
    </div>
  );
};

export default Checkout;
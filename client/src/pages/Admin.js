import React, { useState } from 'react';
import ProductUpload from '../components/ProductUpload';
import OrderAdmin from '../components/OrderAdmin';

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [input, setInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    // Try to access a protected endpoint to validate token
    try {
      const res = await fetch('/api/products', {
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
      // If not unauthorized, assume token is valid (test product will fail for other reasons, but not 401)
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
      <div className="container mx-auto py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="password" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter admin token" className="border p-2" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
          {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button onClick={handleLogout} className="text-red-600">Logout</button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <ProductUpload token={token} />
        <OrderAdmin token={token} />
      </div>
    </div>
  );
};

export default Admin;
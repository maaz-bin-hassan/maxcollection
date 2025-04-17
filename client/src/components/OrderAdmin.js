import React, { useEffect, useState } from 'react';

const OrderAdmin = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const contentType = res.headers.get('content-type');
          let errMsg = 'Failed to fetch orders.';
          if (contentType && contentType.includes('application/json')) {
            const err = await res.json();
            errMsg = err.message || errMsg;
          } else {
            const text = await res.text();
            if (text) errMsg = text;
          }
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
          setError('');
        } else {
          setOrders([]);
          setError('Unexpected response from server.');
        }
        setLoading(false);
      })
      .catch(err => {
        setOrders([]);
        setError(err.message || 'Failed to fetch orders.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const markDelivered = async id => {
    setStatus('Updating...');
    await fetch(`/api/orders/${id}/deliver`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    setStatus('Order updated.');
    fetchOrders();
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div className="bg-white p-6 rounded shadow max-h-[70vh] overflow-auto">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <ul className="divide-y">
        {orders.map(order => (
          <li key={order._id} className="py-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{order.userInfo.name} ({order.userInfo.email})</div>
                <div className="text-gray-500 text-sm">{order.userInfo.address}, {order.userInfo.city}, {order.userInfo.province}, {order.userInfo.postalCode}</div>
                <div className="text-gray-500 text-sm">Phone: {order.userInfo.number}</div>
                <div className="text-gray-700 mt-1">Items: {order.cartItems.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>
                <div className="text-xs text-gray-400">Status: {order.status}</div>
              </div>
              {order.status === 'pending' && (
                <button onClick={() => markDelivered(order._id)} className="bg-green-600 text-white px-3 py-1 rounded">Mark Delivered</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {status && <div className="mt-2">{status}</div>}
    </div>
  );
};

export default OrderAdmin;
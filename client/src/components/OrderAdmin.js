import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './OrderAdmin.css';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const OrderAdmin = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    fetch(API_ENDPOINTS.orders, {
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

  const updateStatus = async (id, newStatus) => {
    setStatus('Updating...');
    await fetch(`${API_ENDPOINTS.orders}/${id}/deliver`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    setStatus('Order updated.');
    fetchOrders();
  };

  if (loading) return <div className="orderadmin-fullpage"><div className="orderadmin-card">Loading orders...</div></div>;
  if (error) return <div className="orderadmin-fullpage"><div className="orderadmin-card orderadmin-error">{error}</div></div>;
  if (!orders.length) return <div className="orderadmin-fullpage"><div className="orderadmin-card orderadmin-empty">No orders found.</div></div>;

  return (
    <div className="orderadmin-fullpage">
      <h1 className="orderadmin-title orderadmin-title-lg">Order Management</h1>
      <div className="orderadmin-orders-list">
        {orders.map(order => (
          <div key={order._id} className="orderadmin-order-block">
            <div className="orderadmin-order-header">
              <div>
                <span className="orderadmin-list-name">{order.userInfo.name}</span>
                <span className="orderadmin-list-email">({order.userInfo.email})</span>
              </div>
              <div className="orderadmin-order-status-row">
                <span className={`orderadmin-status orderadmin-status-${order.status}`}>{order.status}</span>
                <select
                  value={order.status}
                  onChange={e => updateStatus(order._id, e.target.value)}
                  className="orderadmin-status-select orderadmin-status-select-lg"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="orderadmin-order-body">
              <div className="orderadmin-order-section">
                <ul className="orderadmin-customer-bullet">
                  <li><strong>Name:</strong> {order.userInfo.name}</li>
                  <li><strong>Email:</strong> {order.userInfo.email}</li>
                  <li><strong>Contact:</strong> {order.userInfo.number}</li>
                </ul>
              </div>
              <div className="orderadmin-order-section">
                <strong>Address:</strong> {order.userInfo.address}, {order.userInfo.city}, {order.userInfo.province}, {order.userInfo.postalCode}
              </div>
              <div className="orderadmin-order-section">
                <strong>Items:</strong>
                <ul className="orderadmin-product-list-bullet">
                  {order.cartItems.map((item, idx) => (
                    <li key={idx} className="orderadmin-product-list-bullet-item">
                      <div className="orderadmin-product-bullet-flex">
                        <img
                          src={item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : (item.imageUrl ? item.imageUrl : "/logo192.png")}
                          alt={item.name}
                          className="orderadmin-product-img-lg"
                        />
                        <div className="orderadmin-product-bullet-info">
                          <div><strong>{item.name}</strong></div>
                          <ul className="orderadmin-product-bullet-details">
                            <li>Category: {item.category || '-'}</li>
                            <li>Price: PKR {item.price}</li>
                            <li>Shipping: PKR {item.shippingPrice || '-'}</li>
                            <li>Qty: {item.quantity}</li>
                            {item.size && <li>Size: {item.size}</li>}
                          </ul>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      {status && <div className="orderadmin-status-msg">{status}</div>}
    </div>
  );
};

export default OrderAdmin;
import React, { useState, useEffect } from 'react';
import './ProductUpload.css';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select Category' },
  { value: 'clothes', label: 'Clothes' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'mobiles', label: 'Mobiles' },
];

const ProductUpload = ({ token }) => {
  const [form, setForm] = useState({
    name: '', description: '', category: '', price: '', quantity: '', shippingPrice: '', images: [], imageUrls: []
  });
  const [status, setStatus] = useState('');
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = e => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(images => setForm(f => ({ ...f, images })));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.images.length && !editingId) {
      setStatus('Please select at least one image.');
      return;
    }
    setStatus(editingId ? 'Updating...' : 'Uploading...');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        shippingPrice: Number(form.shippingPrice)
      };
      if (editingId) {
        if (form.images.length) {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ ...form, price: Number(form.price), quantity: Number(form.quantity), shippingPrice: Number(form.shippingPrice) })
          });
          if (res.ok) {
            setStatus('Product updated!');
            setForm({ name: '', description: '', category: '', price: '', quantity: '', shippingPrice: '', images: [], imageUrls: [] });
            setEditingId(null);
            fetchProducts();
            return;
          } else {
            setStatus('Update failed.');
            return;
          }
        }
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setStatus('Product updated!');
          setForm({ name: '', description: '', category: '', price: '', quantity: '', shippingPrice: '', images: [], imageUrls: [] });
          setEditingId(null);
          fetchProducts();
        } else {
          setStatus('Update failed.');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setStatus('Product uploaded!');
          setForm({ name: '', description: '', category: '', price: '', quantity: '', shippingPrice: '', images: [], imageUrls: [] });
          fetchProducts();
        } else {
          let errMsg = 'Upload failed.';
          try {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const err = await res.json();
              errMsg = err.message || errMsg;
            } else {
              const text = await res.text();
              if (text) errMsg = text;
            }
          } catch {}
          setStatus(errMsg);
        }
      }
    } catch (e) {
      setStatus(e.message || 'Upload failed.');
    }
  };

  const handleEdit = product => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      shippingPrice: product.shippingPrice,
      images: [],
      imageUrls: product.imageUrls
    });
  };

  const handleDelete = async id => {
    setStatus('Deleting...');
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStatus('Product deleted.');
        fetchProducts();
      } else {
        let errMsg = 'Delete failed.';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const err = await res.json();
            errMsg = err.message || errMsg;
          } else {
            const text = await res.text();
            if (text) errMsg = text;
          }
        } catch {}
        setStatus(errMsg);
      }
    } catch (e) {
      setStatus(e.message || 'Delete failed.');
    }
  };

  return (
    <div className="product-upload-card">
      <h2 className="product-upload-title">{editingId ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit} className="product-upload-form">
        <div className="product-upload-fields">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required className="product-upload-input" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="product-upload-input" rows={3} />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="product-upload-input"
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="product-upload-row">
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price (PKR)" type="number" required className="product-upload-input" />
            <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" required className="product-upload-input" />
            <input name="shippingPrice" value={form.shippingPrice} onChange={handleChange} placeholder="Shipping (PKR)" type="number" required className="product-upload-input" />
          </div>
          <label htmlFor="product-images" style={{ fontWeight: 500 }}>Select Images (you can select multiple)</label>
          <input id="product-images" type="file" accept="image/*" multiple onChange={handleFiles} className="product-upload-input" />
          <small style={{ color: '#888', marginTop: 2 }}>Hold Ctrl (Windows) or Cmd (Mac) to select multiple images.</small>
        </div>
        <div className="product-upload-actions">
          <button type="submit" className="product-upload-btn product-upload-btn-primary">{editingId ? 'Update' : 'Upload'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', category: '', price: '', quantity: '', shippingPrice: '', images: [], imageUrls: [] }); }} className="product-upload-btn product-upload-btn-secondary">Cancel</button>}
        </div>
        {status && <div className="product-upload-status">{status}</div>}
      </form>
      <hr className="product-upload-divider" />
      <h3 className="product-upload-list-title">All Products</h3>
      <ul className="product-upload-list">
        {products.map(product => (
          <li key={product._id} className="product-upload-list-item">
            <div>
              <span className="product-upload-list-name">{product.name}</span> (PKR {product.price}) | Shipping: PKR {product.shippingPrice}
            </div>
            <div className="product-upload-list-actions">
              <button onClick={() => handleEdit(product)} className="product-upload-list-btn product-upload-list-btn-edit">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="product-upload-list-btn product-upload-list-btn-delete">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductUpload;
import React, { useState, useEffect } from 'react';

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
      .then(setProducts);
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
        // If new images are uploaded, upload to Cloudinary first
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
        // Otherwise, just update fields
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
    if (!window.confirm('Delete this product?')) return;
    setStatus('Deleting...');
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setStatus('Product deleted.');
    fetchProducts();
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="border p-2" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border p-2" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="border p-2" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required className="border p-2" />
        <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" required className="border p-2" />
        <input name="shippingPrice" value={form.shippingPrice} onChange={handleChange} placeholder="Shipping Price" type="number" required className="border p-2" />
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Upload'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', category: '', price: '', quantity: '', shippingPrice: '', images: [], imageUrls: [] }); }} className="text-gray-600">Cancel</button>}
      </form>
      {status && <div className="mt-2">{status}</div>}
      <hr className="my-6" />
      <h3 className="font-bold mb-2">All Products</h3>
      <ul className="divide-y max-h-64 overflow-auto">
        {products.map(product => (
          <li key={product._id} className="py-2 flex items-center justify-between">
            <div>
              <span className="font-semibold">{product.name}</span> (${product.price}) | Shipping: ${product.shippingPrice}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(product)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductUpload;
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="cart-empty">Your cart is empty.</div>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map(item => (
              <li key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <img src={item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : "/logo192.png"} alt={item.name} className="cart-item-img" />
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-qty">x {item.quantity}</div>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <span className="cart-item-price">PKR {item.price * item.quantity}</span>
                  <button onClick={() => removeFromCart(item._id)} className="cart-item-remove"><FaTrash /></button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <div className="cart-total">Total: PKR {total}</div>
            <div>
              <Link to="/checkout" className="cart-checkout-btn">Proceed to Checkout</Link>
              <button onClick={clearCart} className="cart-clear-btn">Clear Cart</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
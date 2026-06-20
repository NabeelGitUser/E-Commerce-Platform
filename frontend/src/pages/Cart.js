// ===========================================
// FILE: src/pages/Cart.js - REPLACE ENTIRE FILE
// ===========================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';
import { getCartItems, removeFromCart, createOrder, updateCartItem } from '../services/api';
import { Trash2, ShoppingBag, Loader, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await getCartItems();
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      showMessage('Item removed from cart');
      fetchCartItems();
    } catch (error) {
      showMessage('Failed to remove item', true);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
      fetchCartItems();
    } catch (error) {
      showMessage('Failed to update quantity', true);
    }
  };

  const handleBuyItem = (item) => {
    setSelectedItem(item);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async (paymentData) => {
    try {
      await createOrder({
        productId: selectedItem.productId,
        quantity: paymentData.quantity,
        paymentMethod: paymentData.paymentMethod,
        paymentCode: paymentData.paymentCode,
      });
      await removeFromCart(selectedItem.id);
      showMessage('Order placed successfully!');
      setShowPaymentModal(false);
      fetchCartItems();
      setTimeout(() => navigate('/orders'), 1500);
    } catch (error) {
      showMessage(error.response?.data?.message || 'Order failed', true);
    }
  };

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(''), 3000);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} items in your cart</p>
        </div>

        {message && (
          <div className={`message ${message.isError ? 'error' : 'success'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <Loader className="spinner" size={48} />
            <p>Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.productImage || 'https://via.placeholder.com/100'} alt={item.productName} />
                  
                  <div className="cart-item-details">
                    <h3>{item.productName}</h3>
                    <p className="cart-item-price">₹{item.price.toFixed(2)} each</p>
                  </div>

                  <div className="cart-item-quantity">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <strong>₹{item.total.toFixed(2)}</strong>
                  </div>

                  <div className="cart-item-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleBuyItem(item)}>
                      Buy Now
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Cart Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPaymentModal && selectedItem && (
        <PaymentModal
          product={{ 
            id: selectedItem.productId,
            name: selectedItem.productName, 
            price: selectedItem.price, 
            imageUrl: selectedItem.productImage,
            stock: 100
          }}
          quantity={selectedItem.quantity}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default Cart;
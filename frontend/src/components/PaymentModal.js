// ===========================================
// FILE: src/components/PaymentModal.js - REPLACE ENTIRE FILE
// ===========================================
import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Code, Plus, Minus } from 'lucide-react';

const PaymentModal = ({ product, quantity: initialQuantity, onClose, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [paymentCode, setPaymentCode] = useState('');
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [error, setError] = useState('');

  const totalPrice = product.price * quantity;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
      setError('');
    } else if (newQuantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`);
    }
  };

  const handlePayment = () => {
    setError('');
    
    if (quantity < 1) {
      setError('Please select at least 1 item');
      return;
    }

    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`);
      return;
    }
    
    if (paymentMethod === 'CODE') {
      if (!paymentCode.trim()) {
        setError('Please enter payment code');
        return;
      }
      if (paymentCode.toLowerCase() !== 'buy') {
        setError('Invalid payment code');
        return;
      }
    }

    onConfirm({ paymentMethod, paymentCode, quantity });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>Complete Your Purchase</h2>

        <div className="order-summary">
          <img src={product.imageUrl || 'https://via.placeholder.com/100'} alt={product.name} />
          <div>
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price.toFixed(2)} each</p>
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button type="button" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Minus size={16} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button type="button" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <p className="total-price">Total: ₹{totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          
          <label className={`payment-option ${paymentMethod === 'CARD' ? 'selected' : ''}`}>
            <input
              type="radio"
              value="CARD"
              checked={paymentMethod === 'CARD'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <CreditCard size={24} />
            <span>Credit/Debit Card</span>
          </label>

          <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
            <input
              type="radio"
              value="UPI"
              checked={paymentMethod === 'UPI'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Smartphone size={24} />
            <span>UPI Payment</span>
          </label>

          <label className={`payment-option ${paymentMethod === 'CODE' ? 'selected' : ''}`}>
            <input
              type="radio"
              value="CODE"
              checked={paymentMethod === 'CODE'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Code size={24} />
            <span>Payment Code</span>
          </label>
        </div>

        {paymentMethod === 'CODE' && (
          <div className="code-input">
            <label>Enter Payment Code:</label>
            <input
              type="text"
              placeholder="Enter code"
              value={paymentCode}
              onChange={(e) => setPaymentCode(e.target.value)}
            />
            <small>Hint: Use code "buy" to place order</small>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handlePayment}>
            Confirm Payment - ₹{totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
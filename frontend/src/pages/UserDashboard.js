// FILE: src/pages/UserDashboard.js - REPLACE ENTIRE FILE
// ===========================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import PaymentModal from '../components/PaymentModal';
import { getAllProducts, searchProducts, addToCart, createOrder } from '../services/api';
import { Loader } from 'lucide-react';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      fetchProducts();
      return;
    }

    setLoading(true);
    try {
      const response = await searchProducts(query);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      showMessage('Added to cart successfully!');
    } catch (error) {
      showMessage('Failed to add to cart', true);
    }
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async (paymentData) => {
    try {
      await createOrder({
        productId: selectedProduct.id,
        quantity: paymentData.quantity,
        paymentMethod: paymentData.paymentMethod,
        paymentCode: paymentData.paymentCode,
      });
      showMessage('Order placed successfully!');
      setShowPaymentModal(false);
      fetchProducts();
      setTimeout(() => navigate('/orders'), 1500);
    } catch (error) {
      showMessage(error.response?.data?.message || 'Order failed', true);
    }
  };

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="dashboard">
      <Navbar onSearch={handleSearch} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Discover Amazing Products</h1>
        </div>

        {message && (
          <div className={`message ${message.isError ? 'error' : 'success'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <Loader className="spinner" size={48} />
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal
          product={selectedProduct}
          quantity={1}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default UserDashboard;
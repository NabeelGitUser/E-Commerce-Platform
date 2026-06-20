// FILE: src/pages/AdminDashboard.js
// ===========================================
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import EditProductModal from '../components/EditProductModal';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { Plus, Loader } from 'lucide-react';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

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

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        showMessage('Product updated successfully!');
      } else {
        await createProduct(productData);
        showMessage('Product added successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      showMessage('Operation failed', true);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      showMessage('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      showMessage('Delete failed', true);
    }
  };

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="dashboard admin-dashboard">
      <Navbar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Product Management</h1>
            <p>Manage your product inventory</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddProduct}>
            <Plus size={20} />
            Add Product
          </button>
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
            <h2>No products yet</h2>
            <p>Click "Add Product" to create your first product</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={true}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
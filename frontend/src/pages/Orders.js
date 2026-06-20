// ===========================================
// FILE: src/pages/Orders.js - REPLACE ENTIRE FILE
// ===========================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUserOrders, cancelOrder, getAllOrders, updateOrderStatus, deleteOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, Loader, X, CheckCircle, Clock, Truck } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = isAdmin ? await getAllOrders() : await getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showMessage(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      showMessage('Failed to update status', true);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteOrder(orderId);
      showMessage('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      showMessage('Failed to delete order', true);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await cancelOrder(orderId);
      showMessage('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to cancel order', true);
    }
  };

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ORDER_PLACED':
        return <Clock size={16} />;
      case 'SHIPPED':
        return <Truck size={16} />;
      case 'DELIVERED':
        return <CheckCircle size={16} />;
      case 'CANCELLED':
        return <X size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>{isAdmin ? 'All Orders' : 'My Orders'}</h1>
          <p>{orders.length} {isAdmin ? 'total' : ''} orders</p>
        </div>

        {message && (
          <div className={`message ${message.isError ? 'error' : 'success'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <Loader className="spinner" size={48} />
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h2>No orders yet</h2>
            <p>{isAdmin ? 'No orders have been placed' : 'Start shopping to see your orders here'}</p>
            {!isAdmin && (
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="order-header-actions">
                    <span className={`order-status ${order.status.toLowerCase().replace('_', '-')}`}>
                      {getStatusIcon(order.status)}
                      {order.status.replace('_', ' ')}
                    </span>
                    <button 
                      className="delete-order-btn" 
                      onClick={() => handleDeleteOrder(order.id)}
                      title="Delete order"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="order-content">
                  <img src={order.productImage || 'https://via.placeholder.com/100'} alt={order.productName} />
                  
                  <div className="order-details">
                    <h4>{order.productName}</h4>
                    <p>Quantity: {order.quantity}</p>
                    <p>Payment: {order.paymentMethod}</p>
                    {isAdmin && (
                      <p className="order-customer">
                        Customer: {order.userName} ({order.userEmail})
                      </p>
                    )}
                  </div>

                  <div className="order-price">
                    <strong>₹{order.totalPrice.toFixed(2)}</strong>
                  </div>

                  <div className="order-actions">
                    {isAdmin ? (
                      <select 
                        className="status-dropdown"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="ORDER_PLACED">Order Placed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    ) : (
                      order.status === 'ORDER_PLACED' && (
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel Order
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
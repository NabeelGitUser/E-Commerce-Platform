// ===========================================
// FILE: src/pages/AdminLogin.js - REPLACE ENTIRE FILE
// ===========================================
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminLogin } from '../services/api';
import { Mail, Lock, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(formData);
      loginUser(response.data.token, response.data.email, response.data.fullName, response.data.role);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container admin-bg">
      <div className="auth-card admin-card">
        <div className="auth-header">
          <Shield size={48} className="admin-icon" />
          <div className="navbar-logo">
            <img src="/logo.png" alt="Amazoff" className="logo-image" style={{marginLeft:"120px"}}/>
          </div>
          <h2>Admin Portal</h2>
          <p>Secure admin access only</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <Mail size={18} />
              Admin Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter admin email"
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              Admin Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter admin password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            <Shield size={18} />
            {loading ? 'Authenticating...' : 'Admin Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p><Link to="/login">User Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
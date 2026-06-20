// FILE: src/components/Navbar.js - REPLACE ENTIRE FILE
// ===========================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Package, User, LogOut, Search } from 'lucide-react';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')}>
          <img src="/logo.png" alt="Amazoff" className="logo-image" />
        </div>

        {onSearch && (
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <Search size={20} />
            </button>
          </form>
        )}

        <div className="navbar-actions">
          {user?.role === 'USER' && (
            <>
              <button className="nav-btn" onClick={() => navigate('/cart')}>
                <ShoppingCart size={22} />
                <span>Cart</span>
              </button>
              <button className="nav-btn" onClick={() => navigate('/orders')}>
                <Package size={22} />
                <span>Orders</span>
              </button>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <button className="nav-btn" onClick={() => navigate('/admin/orders')}>
              <Package size={22} />
              <span>Orders</span>
            </button>
          )}

          <div className="profile-dropdown">
            <button className="nav-btn" onClick={() => setShowDropdown(!showDropdown)}>
              <User size={22} />
              <span>{user?.name}</span>
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item user-info">
                  <strong>{user?.name}</strong>
                  <small>{user?.email}</small>
                </div>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
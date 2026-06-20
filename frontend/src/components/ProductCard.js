// ===========================================
// FILE: src/components/ProductCard.js - REPLACE ENTIRE FILE
// ===========================================
import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onBuyNow, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
        {product.stock < 10 && product.stock > 0 && (
          <span className="stock-badge low">Only {product.stock} left</span>
        )}
        {product.stock === 0 && (
          <span className="stock-badge out">Out of Stock</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-details">
          <div className="product-price">
            <span>₹{product.price.toFixed(2)}</span>
          </div>
          <div className="product-stock">
            <Package size={16} />
            <span>{product.stock} in stock</span>
          </div>
        </div>

        {!isAdmin && (
          <div className="product-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => onBuyNow(product)}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>
        )}

        {isAdmin && (
          <div className="product-actions">
            <button className="btn btn-secondary" onClick={() => onEdit(product)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(product.id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
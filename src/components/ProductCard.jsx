import React, { useState, useEffect } from 'react';
import { IndianRupee } from 'lucide-react';

export default function ProductCard({ product, onViewDetails, onAddToCartQuick }) {
  const isOutOfStock = product.stock <= 0;
  
  // State for robust image loading and fallback
  const [imgSrc, setImgSrc] = useState(product.image_url || product.image);

  useEffect(() => {
    setImgSrc(product.image_url || product.image);
  }, [product]);

  const handleImageError = () => {
    // Try the secondary image key
    if (imgSrc !== product.image && product.image) {
      setImgSrc(product.image);
      return;
    }

    // Category generic fallback URLs
    const fallbacks = {
      furniture: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      appliances: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80'
    };

    const fallbackUrl = fallbacks[product.category] || fallbacks.furniture;
    if (imgSrc !== fallbackUrl) {
      setImgSrc(fallbackUrl);
    }
  };

  return (
    <div className={`product-card glass-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="product-image-container">
        <img 
          src={imgSrc} 
          alt={product.name} 
          className="product-card-image" 
          onError={handleImageError}
        />
        <span className="product-category-tag">{product.subcategory || product.category}</span>
        {isOutOfStock && <span className="sold-out-badge">Out of Stock</span>}
      </div>
      
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        
        {/* Rating and Reviews */}
        <div className="product-card-rating" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.85rem',
          color: '#d4af37', // Gold stars
          margin: '0.25rem 0 0.5rem 0'
        }}>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600, marginLeft: '0.25rem' }}>
            {product.rating || 4.7}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            ({product.reviews || 128})
          </span>
        </div>

        <p className="product-card-description">{product.description}</p>
        
        <div className="product-card-pricing">
          <div className="price-item">
            <span className="price-label">Rent / mo</span>
            <span className="price-value">
              <IndianRupee size={14} className="rupee-icon" />
              {product.monthly_rent || product.pricePerMonth}
            </span>
          </div>
          <div className="price-item">
            <span className="price-label">Deposit</span>
            <span className="price-value deposit">
              <IndianRupee size={12} className="rupee-icon" />
              {product.security_deposit || 1000}
            </span>
          </div>
        </div>

        <div className="product-card-stock-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem'
        }}>
          <span>{product.stock} items left</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            📍 {product.location || 'New Delhi'}
          </span>
        </div>

        <div className="product-card-footer" style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <button 
            type="button"
            className="btn-secondary card-action-btn"
            onClick={() => onViewDetails(product)}
            disabled={isOutOfStock}
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
          >
            Details
          </button>
          <button 
            type="button"
            className="btn-primary card-action-btn"
            onClick={() => {
              if (onAddToCartQuick) onAddToCartQuick(product);
            }}
            disabled={isOutOfStock}
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
          >
            + Rent Now
          </button>
        </div>
      </div>
    </div>
  );
}

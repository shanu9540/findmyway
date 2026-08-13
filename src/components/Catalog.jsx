import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search, ArrowUpDown } from 'lucide-react';

export default function Catalog({ products, onViewDetails, onAddToCart, isLoading, error, onRetry }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcat, setSelectedSubcat] = useState('all');
  const [sortBy, setSortBy] = useState('popular'); // price-low, price-high, deposit-low

  // Categories & Subcategories Config
  const categories = ['all', 'furniture', 'appliances'];
  const subcategories = useMemo(() => {
    const list = new Set(['all']);
    products.forEach(p => {
      if (selectedCategory === 'all' || p.category === selectedCategory) {
        if (p.subcategory) {
          list.add(p.subcategory.trim().toLowerCase());
        }
      }
    });
    return Array.from(list);
  }, [products, selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(term)) ||
        (p.location && p.location.toLowerCase().includes(term))
      );
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Subcategory
    if (selectedSubcat !== 'all') {
      result = result.filter(p => p.subcategory?.toLowerCase() === selectedSubcat.toLowerCase());
    }

    // Sort Products
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.monthly_rent || a.pricePerMonth) - (b.monthly_rent || b.pricePerMonth));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.monthly_rent || b.pricePerMonth) - (a.monthly_rent || a.pricePerMonth));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    return result;
  }, [products, searchTerm, selectedCategory, selectedSubcat, sortBy]);

  return (
    <div className="catalog-container">
      {/* Hero section */}
      <div className="catalog-hero-card glass-card">
        <h2 className="hero-title">Flexible Rentals for Modern Living</h2>
        <p className="hero-subtitle">High-quality furniture and smart appliances without the commitment or high upfront costs.</p>
        
        {/* Search Bar */}
        <div className="search-bar-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search for beds, sofas, smart TVs, fridges..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Catalog Filters Bar */}
      <div className="filters-row glass-card">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcat('all'); // Reset subcategory filter when category changes
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="sorting-controls">
          <div className="sort-wrapper">
            <ArrowUpDown size={14} className="sort-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
               <option value="popular">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subcategory Pill Row */}
      {subcategories.length > 1 && (
        <div className="subcategory-pills-row">
          {subcategories.map(sub => (
            <button
              key={sub}
              className={`subcat-pill-btn ${selectedSubcat === sub ? 'active' : ''}`}
              onClick={() => setSelectedSubcat(sub)}
            >
              {sub.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {error ? (
        <div className="empty-catalog glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--color-primary)' }}>Failed to load products</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn-primary" onClick={onRetry}>Retry Connection</button>
        </div>
      ) : isLoading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="product-card glass-card skeleton-card" style={{ height: '440px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', opacity: 0.7 }}>
              <div className="skeleton-image" style={{ width: '100%', height: '220px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}></div>
              <div className="skeleton-line" style={{ width: '70%', height: '18px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}></div>
              <div className="skeleton-line" style={{ width: '40%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}></div>
              <div className="skeleton-line" style={{ width: '90%', height: '40px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}></div>
              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}></div>
                <div style={{ flex: 1, height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={onViewDetails} 
              onAddToCartQuick={(p) => onAddToCart(p, 12, p.monthly_rent - Math.round(p.monthly_rent * 0.1))}
            />
          ))}
        </div>
      ) : (
        <div className="empty-catalog glass-card">
          <h3>No products match your criteria</h3>
          <p>Try resetting filters or changing your search term.</p>
          <button 
            className="btn-primary" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedSubcat('all');
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

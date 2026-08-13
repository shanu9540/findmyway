import React from 'react';
import { ShoppingCart, LogOut, Shield, User, Package, MapPin, Grid } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, cart, currentUser, onLogout, onRoleSwitch, onBackToPortfolio }) {
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <nav className="navbar glass-card">
      <div className="nav-brand" onClick={() => setActiveView('catalog')}>
        <div className="brand-logo">
          <Package size={22} color="#fff" />
        </div>
        <span className="brand-name">RentEase</span>
      </div>

      <div className="nav-links-row">
        {onBackToPortfolio && (
          <button 
            className="nav-link-btn"
            onClick={onBackToPortfolio}
            style={{ 
              marginRight: '0.75rem', 
              color: 'var(--color-primary)', 
              fontWeight: 700 
            }}
          >
            <span>← Portfolio</span>
          </button>
        )}
        <button 
          className={`nav-link-btn ${activeView === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveView('catalog')}
        >
          <Grid size={16} />
          <span>Browse Catalog</span>
        </button>
        
        {currentUser && currentUser.role === 'user' && (
          <button 
            className={`nav-link-btn ${activeView === 'user-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('user-dashboard')}
          >
            <User size={16} />
            <span>My Rentals</span>
          </button>
        )}

        {currentUser && currentUser.role === 'vendor' && (
          <button 
            className={`nav-link-btn ${activeView === 'vendor-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('vendor-dashboard')}
          >
            <Package size={16} />
            <span>Vendor Console</span>
          </button>
        )}

        {currentUser && currentUser.role === 'admin' && (
          <button 
            className={`nav-link-btn ${activeView === 'admin-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('admin-dashboard')}
          >
            <Shield size={16} />
            <span>Admin Console</span>
          </button>
        )}
      </div>

      <div className="nav-actions">
        {currentUser && currentUser.role === 'user' && (
          <button 
            className={`nav-cart-btn ${activeView === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveView('cart')}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </button>
        )}

        <div className="nav-user-pill">
          {currentUser ? (
            <>
              <div className="user-details">
                <span className="user-name">{currentUser.name}</span>
                <span className="user-role-badge">{currentUser.role.toUpperCase()}</span>
              </div>
              
              {/* Service Area Badge */}
              <div className="user-area-badge">
                <MapPin size={12} />
                <span>{currentUser.service_area}</span>
              </div>

              {/* Role Quick Switcher for Demo testing */}
              <select 
                value={currentUser.role} 
                onChange={(e) => onRoleSwitch(e.target.value)}
                className="role-switcher-select"
                title="Quick Switch Role (Demo Mode)"
              >
                <option value="user">User Demo</option>
                <option value="vendor">Vendor Demo</option>
                <option value="admin">Admin Demo</option>
              </select>

              <button className="logout-btn" onClick={onLogout} title="Log Out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setActiveView('login')}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

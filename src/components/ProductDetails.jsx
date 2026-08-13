import React, { useState, useEffect } from 'react';
import { ArrowLeft, IndianRupee, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function ProductDetails({ product, onAddToCart, onBackToCatalog }) {
  const [tenure, setTenure] = useState(12); // Default to 12 months
  const [activeImage, setActiveImage] = useState(product.image_url);

  // Sync active image when product details changes
  useEffect(() => {
    setActiveImage(product.image_url);
  }, [product]);

  const tenureOptions = [
    { months: 3, discount: 0, label: '3 Months (Standard)' },
    { months: 6, discount: 5, label: '6 Months (5% Off)' },
    { months: 12, discount: 10, label: '12 Months (10% Off)' },
    { months: 24, discount: 15, label: '24 Months (15% Off)' },
  ];

  const currentOption = tenureOptions.find(o => o.months === tenure) || tenureOptions[0];
  const discountAmount = Math.round(product.monthly_rent * (currentOption.discount / 100));
  const finalMonthlyRent = product.monthly_rent - discountAmount;
  const initialPayment = finalMonthlyRent + product.security_deposit;

  const handleAddToCart = () => {
    onAddToCart(product, tenure, finalMonthlyRent);
  };

  // Helper to fetch multiple images of the product type for e-commerce gallery
  const getProductGallery = (prod) => {
    if (prod.gallery && prod.gallery.length > 0) {
      return prod.gallery;
    }

    // Curated high quality closeup product images (exactly 6 images per category)
    const fallbacks = {
      tv: [
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1577979749830-f1d7565d4b1a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
      ],
      refrigerator: [
        'https://images.unsplash.com/photo-1571175432247-5c314053c29b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1622363529407-36001d22e7b8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571175432247-5c314053c29b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
      ],
      sofa: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80'
      ],
      bed: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505693395321-883724634266?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
      ],
      table: [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1530018607912-eff2df114f1f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
      ],
      juicer: [
        'https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80'
      ],
      'vacuum cleaner': [
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1563161404-ee5f6236a285?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1563161404-ee5f6236a285?auto=format&fit=crop&w=800&q=80'
      ],
      washing_machine: [
        'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80'
      ],
      ac: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1608930264026-6114f274d24f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1614631446501-abcf76b47ec9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1608930264026-6114f274d24f?auto=format&fit=crop&w=800&q=80'
      ],
      air_purifier: [
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&w=800&q=80'
      ],
      microwave: [
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571175432247-5c314053c29b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
      ],
      chair: [
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589384267710-7a259678a59a?auto=format&fit=crop&w=800&q=80'
      ]
    };

    const sub = prod.subcategory?.toLowerCase().replace(/\s+/g, '_') || '';
    const cat = prod.category?.toLowerCase() || '';

    if (fallbacks[sub]) return fallbacks[sub];
    if (fallbacks[cat]) return fallbacks[cat];

    return [
      prod.image_url,
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    ];
  };

  const gallery = getProductGallery(product);

  return (
    <div className="product-details-container">
      <button className="back-btn-pill" onClick={onBackToCatalog}>
        <ArrowLeft size={16} />
        <span>Back to Catalog</span>
      </button>

      <div className="details-layout-grid">
        {/* Left Side: Product Gallery */}
        <div className="details-gallery-card glass-card">
          <img src={activeImage} alt={product.name} className="details-main-image" />
          
          {/* Thumbnails row selector */}
          {gallery.length > 1 && (
            <div className="details-gallery-thumbnails" style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              marginTop: '1rem',
              marginBottom: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {gallery.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activeImage === img ? '2px solid var(--color-water)' : '1px solid var(--border-glass)',
                    boxShadow: activeImage === img ? '0 0 10px rgba(0, 242, 254, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                    opacity: activeImage === img ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => {
                    if (activeImage !== img) e.currentTarget.style.opacity = '0.6';
                  }}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          <div className="details-trust-badges">
            <div className="trust-badge">
              <Truck size={18} />
              <span>Free Delivery & Setup</span>
            </div>
            <div className="trust-badge">
              <RefreshCw size={18} />
              <span>Free Relocation Benefit</span>
            </div>
            <div className="trust-badge">
              <ShieldCheck size={18} />
              <span>Deep Cleaned & Sanitized</span>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration & Pricing */}
        <div className="details-content-card glass-card">
          <div className="details-header">
            <span className="details-category-tag">{product.subcategory || product.category}</span>
            <h1 className="details-title">{product.name}</h1>
            <p className="details-description">{product.description}</p>
          </div>

          {/* Flexible Tenure Plan Selector */}
          <div className="details-tenure-section">
            <h3 className="section-subtitle">Choose Rental Tenure</h3>
            <div className="tenure-selector-grid">
              {tenureOptions.map((opt) => (
                <button
                  key={opt.months}
                  className={`tenure-opt-btn ${tenure === opt.months ? 'active' : ''}`}
                  onClick={() => setTenure(opt.months)}
                >
                  <span className="opt-months">{opt.months} Months</span>
                  <span className="opt-discount">
                    {opt.discount > 0 ? `${opt.discount}% Discount` : 'Standard Price'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="details-pricing-summary">
            <h3 className="section-subtitle">Pricing Breakdown</h3>
            
            <div className="pricing-table">
              <div className="pricing-row">
                <span>Base Monthly Rent</span>
                <span className="price-strike">
                  <IndianRupee size={12} />
                  {product.monthly_rent} / mo
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="pricing-row discount-row">
                  <span>Tenure Discount ({currentOption.discount}%)</span>
                  <span>
                    - <IndianRupee size={12} />
                    {discountAmount} / mo
                  </span>
                </div>
              )}

              <div className="pricing-row highlight-row">
                <span className="label-bold">Final Monthly Rent</span>
                <span className="value-bold">
                  <IndianRupee size={12} />
                  {finalMonthlyRent} / mo
                </span>
              </div>

              <div className="pricing-divider"></div>

              <div className="pricing-row">
                <span>Refundable Security Deposit</span>
                <span>
                  <IndianRupee size={12} />
                  {product.security_deposit}
                </span>
              </div>

              <div className="pricing-divider"></div>

              <div className="pricing-row total-row">
                <span className="total-label">Payable First Month</span>
                <span className="total-value text-glow">
                  <IndianRupee size={14} />
                  {initialPayment}
                </span>
              </div>
            </div>
          </div>

          <button className="btn-primary buy-btn" onClick={handleAddToCart}>
            <span>Add to Rental Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, IndianRupee, ShieldAlert, Check, Truck, ClipboardList, Package } from 'lucide-react';

export default function VendorDashboard({ 
  products, 
  rentals, 
  maintenanceRequests, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onUpdateRentalStatus, 
  onUpdateMaintenanceStatus 
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, delivery, maintenance
  
  // Product Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('furniture');
  const [prodSubcat, setProdSubcat] = useState('bed');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodRent, setProdRent] = useState('');
  const [prodDeposit, setProdDeposit] = useState('');
  const [prodStock, setProdStock] = useState('');

  // Damage Claim Modal states
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedRentalForReturn, setSelectedRentalForReturn] = useState(null);
  const [claimAmount, setClaimAmount] = useState('0');
  const [claimReason, setClaimReason] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('furniture');
    setProdSubcat('bed');
    setProdDesc('');
    setProdImg('');
    setProdRent('');
    setProdDeposit('');
    setProdStock('');
    setShowProductModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdSubcat(p.subcategory || '');
    setProdDesc(p.description);
    setProdImg(p.image_url);
    setProdRent(p.monthly_rent);
    setProdDeposit(p.security_deposit);
    setProdStock(p.stock);
    setShowProductModal(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name: prodName,
      category: prodCategory,
      subcategory: prodSubcat.trim().toLowerCase(),
      description: prodDesc,
      image_url: prodImg || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      monthly_rent: Number(prodRent),
      security_deposit: Number(prodDeposit),
      stock: Number(prodStock)
    };

    if (editingProduct) {
      onEditProduct(editingProduct.id, productData);
    } else {
      onAddProduct(productData);
    }
    setShowProductModal(false);
  };

  const handleReturnInspectionSubmit = (e) => {
    e.preventDefault();
    onUpdateRentalStatus(selectedRentalForReturn.id, 'returned', {
      damage_claim_amount: Number(claimAmount),
      damage_claim_reason: claimReason
    });
    setShowClaimModal(false);
    setClaimAmount('0');
    setClaimReason('');
  };

  const getMaintBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-badge pending';
      case 'assigned': return 'status-badge assigned';
      case 'dispatched': return 'status-badge dispatched';
      case 'resolved': return 'status-badge resolved';
      default: return 'status-badge';
    }
  };

  return (
    <div className="vendor-dashboard-container animate-fade-in">
      {/* Tabs */}
      <div className="tab-menu-row glass-card">
        <button 
          className={`tab-menu-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={16} style={{ marginRight: '0.4rem' }} />
          <span>Manage Inventory</span>
        </button>
        <button 
          className={`tab-menu-btn ${activeTab === 'delivery' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivery')}
        >
          <Truck size={16} style={{ marginRight: '0.4rem' }} />
          <span>Delivery & Return Schedules</span>
        </button>
        <button 
          className={`tab-menu-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          <ClipboardList size={16} style={{ marginRight: '0.4rem' }} />
          <span>Maintenance Tickets</span>
        </button>
      </div>

      {/* Tab: Inventory */}
      {activeTab === 'inventory' && (
        <div className="vendor-tab-content">
          <div className="section-header-row">
            <div>
              <h2>Product Catalog Inventory ({products.length})</h2>
              <p>Add new products, adjust monthly rent/deposit multipliers, and restock units.</p>
            </div>
            <button className="btn-primary" onClick={openAddModal}>
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="inventory-table-card glass-card">
            <table className="maint-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Monthly Rent</th>
                  <th>Deposit</th>
                  <th>Stock Available</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-product-cell">
                        <img src={p.image_url} alt={p.name} className="table-product-thumb" />
                        <div>
                          <strong>{p.name}</strong>
                          <span className="subtext">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="category-label-sub">{p.subcategory || p.category}</span></td>
                    <td>
                      <div className="currency-cell">
                        <IndianRupee size={12} />
                        {p.monthly_rent} / mo
                      </div>
                    </td>
                    <td>
                      <div className="currency-cell">
                        <IndianRupee size={12} />
                        {p.security_deposit}
                      </div>
                    </td>
                    <td>
                      <span className={`stock-level-label ${p.stock <= 2 ? 'low' : 'ok'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <div className="table-action-buttons">
                        <button className="icon-btn edit" onClick={() => openEditModal(p)} title="Edit Product">
                          <Edit size={14} />
                        </button>
                        <button className="icon-btn delete" onClick={() => onDeleteProduct(p.id)} title="Delete Product">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Delivery & Pickup Schedules */}
      {activeTab === 'delivery' && (
        <div className="vendor-tab-content">
          <h2>Delivery & Pickup Tracker</h2>
          <p>Dispatch logistics for new rentals and verify inspection details upon return pickups.</p>

          <div className="rentals-schedule-grid" style={{ marginTop: '1.5rem' }}>
            {rentals.map(rental => (
              <div key={rental.id} className="schedule-card glass-card">
                <div className="schedule-card-header">
                  <div>
                    <h3 className="schedule-product-title">{rental.product_name}</h3>
                    <span className="schedule-id-sub">Order ID: {rental.id}</span>
                  </div>
                  <span className={`status-badge ${rental.status.replace('_', '-')}`}>
                    {rental.status === 'dispatched' ? 'DISPATCHED' : rental.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="schedule-address-block">
                  <div className="schedule-address-line">
                    <Calendar size={14} />
                    <span>Schedule Date: <strong>{rental.delivery_date}</strong></span>
                  </div>
                  <div className="schedule-address-line">
                    <Clock size={14} />
                    <span>Time Slot: {rental.delivery_time_slot}</span>
                  </div>
                  <div className="schedule-address-line">
                    <MapPin size={14} />
                    <span className="address-text">{rental.delivery_address}</span>
                  </div>
                </div>

                <div className="schedule-actions-row">
                  {rental.status === 'scheduled' && (
                    <button 
                      className="btn-secondary" 
                      onClick={() => onUpdateRentalStatus(rental.id, 'dispatched')}
                    >
                      <Truck size={14} style={{ marginRight: '0.3rem' }} />
                      <span>Dispatch Crew</span>
                    </button>
                  )}

                  {rental.status === 'dispatched' && (
                    <button 
                      className="btn-success"
                      style={{ color: '#fff' }}
                      onClick={() => onUpdateRentalStatus(rental.id, 'active')}
                    >
                      <Check size={14} style={{ marginRight: '0.3rem' }} />
                      <span>Confirm Delivered</span>
                    </button>
                  )}

                  {rental.status === 'active' && (
                    <span className="status-note success-green">✓ Active Lease with User</span>
                  )}

                  {rental.status === 'return_pending' && (
                    <button 
                      className="btn-danger-outline" 
                      onClick={() => {
                        setSelectedRentalForReturn(rental);
                        setShowClaimModal(true);
                      }}
                    >
                      <ShieldAlert size={14} style={{ marginRight: '0.3rem' }} />
                      <span>Inspect & Refund Deposit</span>
                    </button>
                  )}

                  {rental.status === 'returned' && (
                    <div className="returned-summary-note">
                      <span>✓ Returned & Closed</span>
                      {rental.damage_claim_amount > 0 && (
                        <span className="claim-warning">Claim Deducted: <IndianRupee size={10} />{rental.damage_claim_amount}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Maintenance Tickets */}
      {activeTab === 'maintenance' && (
        <div className="vendor-tab-content">
          <h2>Maintenance Service Requests</h2>
          <p>Assign technicians, track repairs, and complete tickets for wobbly furniture or appliance issues.</p>

          <div className="maintenance-table-card glass-card" style={{ marginTop: '1.5rem' }}>
            <table className="maint-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Product</th>
                  <th>Issue Category</th>
                  <th>Description</th>
                  <th>Preferred Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRequests.map(req => (
                  <tr key={req.id}>
                    <td><code>{req.id}</code></td>
                    <td><strong>{req.product_name}</strong></td>
                    <td>{req.issue_type}</td>
                    <td><span className="table-desc-text" title={req.description}>{req.description || 'No description'}</span></td>
                    <td>{req.scheduled_date}</td>
                    <td>
                      <span className={getMaintBadgeClass(req.status)}>
                        {req.status === 'dispatched' ? 'EN ROUTE' : req.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="table-action-buttons">
                        {req.status === 'pending' && (
                          <button 
                            className="btn-secondary btn-table-action"
                            onClick={() => onUpdateMaintenanceStatus(req.id, 'assigned')}
                          >
                            Assign Tech
                          </button>
                        )}
                        {req.status === 'assigned' && (
                          <button 
                            className="btn-primary btn-table-action"
                            style={{ background: 'linear-gradient(135deg, var(--color-warning), var(--color-secondary))', color: '#fff' }}
                            onClick={() => onUpdateMaintenanceStatus(req.id, 'dispatched')}
                          >
                            Dispatch Tech
                          </button>
                        )}
                        {req.status === 'dispatched' && (
                          <button 
                            className="btn-success btn-table-action"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#white' }}
                            onClick={() => onUpdateMaintenanceStatus(req.id, 'resolved')}
                          >
                            <Check size={12} />
                            <span>Resolve</span>
                          </button>
                        )}
                        {req.status === 'resolved' && (
                          <span className="success-green text-sm">✓ Resolved</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-scale-in">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Inventory Product' : 'Add New Inventory Product'}</h3>
              <button className="modal-close" onClick={() => setShowProductModal(false)}>✕</button>
            </div>

            <form onSubmit={handleProductSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Deluxe Oak Wood Study Desk"
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    value={prodCategory} 
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="form-control select-control"
                  >
                    <option value="furniture">Furniture</option>
                    <option value="appliances">Appliances</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subcategory / Tag</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={prodSubcat}
                    onChange={(e) => setProdSubcat(e.target.value)}
                    placeholder="e.g. bed, TV, fridge, table, AC"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control text-control" 
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Detailed specifications, dimensions, features..."
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input 
                  type="url" 
                  className="form-control" 
                  value={prodImg}
                  onChange={(e) => setProdImg(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Monthly Rent (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={prodRent}
                    onChange={(e) => setProdRent(e.target.value)}
                    min="1"
                    placeholder="e.g. 499"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Security Deposit (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={prodDeposit}
                    onChange={(e) => setProdDeposit(e.target.value)}
                    min="1"
                    placeholder="e.g. 1500"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Inventory Units</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    min="1"
                    placeholder="e.g. 10"
                    required 
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Inspection Modal */}
      {showClaimModal && selectedRentalForReturn && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-scale-in">
            <div className="modal-header">
              <h3>Confirm Return & Inspect Item</h3>
              <button className="modal-close" onClick={() => setShowClaimModal(false)}>✕</button>
            </div>

            <form onSubmit={handleReturnInspectionSubmit} className="modal-form">
              <div className="claim-alert-card" style={{
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.2)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <ShieldAlert size={20} color="var(--color-warning)" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                  Inspect <strong>{selectedRentalForReturn.product_name}</strong>. If there are no structural/functional damages, leave the claim amount as 0 to refund the full deposit.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Damage Claim Amount (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  min="0"
                  max={selectedRentalForReturn.security_deposit}
                  placeholder="e.g. 500 (Max equals deposit amount)"
                  required 
                />
              </div>

              {Number(claimAmount) > 0 && (
                <div className="form-group">
                  <label className="form-label">Reason for Damage Claim</label>
                  <textarea 
                    className="form-control text-control" 
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    placeholder="Describe cracks, permanent stains, electrical shorts, missing parts..."
                    rows={3}
                    required
                  />
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowClaimModal(false)}>Cancel</button>
                <button type="submit" className="btn-danger" style={{ flexGrow: 1 }}>Complete Return & Settle Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

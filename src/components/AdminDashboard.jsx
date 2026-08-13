import React, { useState, useMemo } from 'react';
import { ShieldAlert, Users, MapPin, IndianRupee, TrendingUp, Grid, ShieldCheck, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function AdminDashboard({ 
  users, 
  rentals, 
  serviceAreas, 
  adminStats, 
  onUpdateUserRole, 
  onAddServiceArea, 
  onDeleteServiceArea 
}) {
  const [activeSubTab, setActiveSubTab] = useState('analytics'); // analytics, users, services, disputes
  const [newArea, setNewArea] = useState('');

  const handleAddAreaSubmit = (e) => {
    e.preventDefault();
    if (!newArea.trim()) return;
    onAddServiceArea(newArea.trim());
    setNewArea('');
  };

  // Find rentals that have active damage claims
  const disputedRentals = useMemo(() => {
    return rentals.filter(r => r.damage_claim_amount > 0);
  }, [rentals]);

  // Chart Data Helpers
  const categoryChartData = useMemo(() => {
    if (!adminStats || !adminStats.categoryDistribution) return [];
    return Object.entries(adminStats.categoryDistribution).map(([name, value]) => ({ name, value }));
  }, [adminStats]);

  const totalProductsCount = useMemo(() => {
    return categoryChartData.reduce((sum, item) => sum + item.value, 0) || 1;
  }, [categoryChartData]);

  const maxVal = Math.max(...categoryChartData.map(d => d.value), 1);

  return (
    <div className="admin-dashboard-container animate-fade-in">
      {/* Sub tabs */}
      <div className="tab-menu-row glass-card">
        <button 
          className={`tab-menu-btn ${activeSubTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('analytics')}
        >
          Operations Analytics
        </button>
        <button 
          className={`tab-menu-btn ${activeSubTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('users')}
        >
          User Role Registry
        </button>
        <button 
          className={`tab-menu-btn ${activeSubTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('services')}
        >
          Logistics Coverage
        </button>
        <button 
          className={`tab-menu-btn ${activeSubTab === 'disputes' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('disputes')}
        >
          Damage Claims
        </button>
      </div>

      {/* Tab Content: Analytics */}
      {activeSubTab === 'analytics' && adminStats && (
        <div className="admin-tab-content">
          <div style={{ marginBottom: '2rem' }}>
            <h2>Platform Performance Analytics</h2>
            <p style={{ color: 'var(--text-muted)' }}>Real-time overview of monthly recurring revenues, lease counts, demand, and logistics throughput.</p>
          </div>

          {/* Quick Metrics grid */}
          <div className="admin-metrics-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            <div className="metric-card glass-card">
              <div className="metric-icon" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--color-primary)' }}>
                <TrendingUp size={22} />
              </div>
              <div className="metric-details">
                <span className="metric-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recurring Revenue (MRR)</span>
                <span className="metric-value text-glow" style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                  <IndianRupee size={16} />
                  {adminStats.monthlyRecurringRevenue} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>/ mo</span>
                </span>
              </div>
            </div>

            <div className="metric-card glass-card">
              <div className="metric-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }}>
                <Grid size={22} />
              </div>
              <div className="metric-details">
                <span className="metric-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Rental Leases</span>
                <span className="metric-value" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                  {adminStats.activeRentalsCount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>active</span>
                </span>
              </div>
            </div>

            <div className="metric-card glass-card">
              <div className="metric-icon" style={{ background: 'rgba(255,140,0,0.1)', color: 'var(--color-secondary)' }}>
                <Users size={22} />
              </div>
              <div className="metric-details">
                <span className="metric-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Users / Vendors</span>
                <span className="metric-value" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                  {adminStats.totalUsers} / {adminStats.totalVendors}
                </span>
              </div>
            </div>

            <div className="metric-card glass-card">
              <div className="metric-icon" style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--color-danger)' }}>
                <ShieldAlert size={22} />
              </div>
              <div className="metric-details">
                <span className="metric-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gross Revenue Booked</span>
                <span className="metric-value text-glow" style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                  <IndianRupee size={16} />
                  {adminStats.totalRevenue}
                </span>
              </div>
            </div>
          </div>

          <div className="analytics-details-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
            {/* Category Demand Visualization using Custom SVGs */}
            <div className="chart-card glass-card">
              <h3>Demand Share by Category</h3>
              <p className="subtext" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Proportion of products uploaded by vendors</p>
              
              <div className="custom-chart-wrapper">
                {categoryChartData.length > 0 ? (
                  <div className="bar-chart-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {categoryChartData.map(data => {
                      const percentage = Math.round((data.value / totalProductsCount) * 100);
                      const isFurniture = data.name.toLowerCase() === 'furniture';
                      return (
                        <div key={data.name} className="chart-bar-row">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                            <span style={{ fontWeight: 700, letterSpacing: '0.5px' }}>{data.name.toUpperCase()}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{data.value} items ({percentage}%)</span>
                          </div>
                          <div className="bar-track" style={{
                            height: '14px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-glass)'
                          }}>
                            <div 
                              className="bar-fill"
                              style={{
                                height: '100%',
                                width: `${(data.value / maxVal) * 100}%`,
                                background: isFurniture 
                                  ? 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' 
                                  : 'linear-gradient(to right, #00f2fe, #4facfe)',
                                borderRadius: '10px',
                                boxShadow: isFurniture 
                                  ? '0 0 10px rgba(212,175,55,0.3)' 
                                  : '0 0 10px rgba(79,172,254,0.3)',
                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No inventory details to plot.</p>
                )}
              </div>
            </div>

            {/* Logistics Health summary */}
            <div className="chart-card glass-card">
              <h3>Operational Throughput</h3>
              <p className="subtext" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Status metrics of customer orders</p>
              
              <div className="throughput-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Object.entries(adminStats.rentalStatuses || {}).map(([status, count]) => (
                  <div key={status} className="throughput-item" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px'
                  }}>
                    <span className={`status-badge ${status.replace('_', '-')}`} style={{ margin: 0 }}>
                      {status === 'dispatched' ? 'EN ROUTE' : status.replace('_', ' ').toUpperCase()}
                    </span>
                    <strong style={{ fontSize: '0.95rem' }}>{count} orders</strong>
                  </div>
                ))}
                {(!adminStats.rentalStatuses || Object.keys(adminStats.rentalStatuses).length === 0) && (
                  <p style={{ color: 'var(--text-muted)' }}>No active orders currently tracked.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Manage Users */}
      {activeSubTab === 'users' && (
        <div className="admin-tab-content animate-fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h2>User Role registry</h2>
            <p style={{ color: 'var(--text-muted)' }}>Configure user access credentials, authorize vendors, and promote administrators.</p>
          </div>

          <div className="inventory-table-card glass-card">
            <table className="maint-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Assigned Location</th>
                  <th>Access Permission Role</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><code>{u.id}</code></td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.service_area}</td>
                    <td>
                      <span className={`role-badge ${u.role}`} style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.7rem',
                        borderRadius: '6px',
                        fontWeight: 700,
                        background: u.role === 'admin' ? 'rgba(244,63,94,0.1)' : u.role === 'vendor' ? 'rgba(255,140,0,0.1)' : 'rgba(16,185,129,0.1)',
                        color: u.role === 'admin' ? 'var(--color-danger)' : u.role === 'vendor' ? 'var(--color-secondary)' : 'var(--color-success)'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="table-action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <select
                          value={u.role}
                          onChange={(e) => onUpdateUserRole(u.id, e.target.value)}
                          className="role-selector-dropdown"
                          style={{
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--border-glass)',
                            color: 'var(--text-main)',
                            padding: '0.35rem 0.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="user">User (Customer)</option>
                          <option value="vendor">Vendor (Seller)</option>
                          <option value="admin">Admin (Staff)</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Manage Service Areas */}
      {activeSubTab === 'services' && (
        <div className="admin-tab-content animate-fade-in">
          <div className="section-header-row" style={{ marginBottom: '2rem' }}>
            <div>
              <h2>Logistics Coverage Cities</h2>
              <p style={{ color: 'var(--text-muted)' }}>Expand logistics coverage by inserting new delivery hubs.</p>
            </div>
            
            <form onSubmit={handleAddAreaSubmit} className="inline-add-form" style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="e.g. Pune" 
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="form-control inline-input"
                required
                style={{ width: '180px' }}
              />
              <button type="submit" className="btn-primary inline-btn" style={{ padding: '0.65rem 1.25rem' }}>
                <Plus size={16} />
                <span>Add City</span>
              </button>
            </form>
          </div>

          <div className="service-areas-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.25rem'
          }}>
            {serviceAreas.map(area => (
              <div key={area} className="area-pill-card glass-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.25rem'
              }}>
                <div className="area-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--color-primary)" />
                  <span style={{ fontWeight: 600 }}>{area}</span>
                </div>
                <button 
                  className="area-delete-btn" 
                  onClick={() => onDeleteServiceArea(area)}
                  title={`Stop servicing ${area}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dark)',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dark)'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Disputes & Claims */}
      {activeSubTab === 'disputes' && (
        <div className="admin-tab-content animate-fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h2>Security Deposit Damage Claims</h2>
            <p style={{ color: 'var(--text-muted)' }}>Review and audit vendor deductions from customer security deposits during returns.</p>
          </div>

          <div className="disputes-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {disputedRentals.length > 0 ? (
              disputedRentals.map(rental => (
                <div key={rental.id} className="dispute-card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="dispute-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{rental.product_name}</h3>
                      <span className="order-id" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order ID: {rental.id}</span>
                    </div>
                    <span className="claim-amount-badge" style={{
                      background: 'rgba(244,63,94,0.1)',
                      color: 'var(--color-danger)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      Claim: <IndianRupee size={12} />
                      {rental.damage_claim_amount}
                    </span>
                  </div>

                  <div className="dispute-body" style={{
                    padding: '0.85rem 1rem',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                  }}>
                    <strong style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Vendor Damage Assessment:</strong>
                    <p style={{ margin: 0, fontStyle: 'italic' }}>"{rental.damage_claim_reason || 'No description provided'}"</p>
                    
                    <div className="pricing-mini-summary" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      marginTop: '0.85rem',
                      paddingTop: '0.65rem',
                      borderTop: '1px solid var(--border-glass)',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Held Security Deposit:</span>
                        <span>₹{rental.security_deposit}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-danger)' }}>
                        <span>Deducted Claim:</span>
                        <span>-₹{rental.damage_claim_amount}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontWeight: 600 }}>
                        <span>Refunded to Customer:</span>
                        <span>₹{rental.security_deposit - rental.damage_claim_amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="dispute-actions" style={{ marginTop: 'auto' }}>
                    <span className="settled-label-icon" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-success)',
                      fontWeight: 600
                    }}>
                      <ShieldCheck size={16} color="var(--color-success)" />
                      <span>Authorized (Deduction Settled)</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-disputes-card glass-card" style={{
                gridColumn: '1 / -1',
                padding: '3rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}>
                <ShieldCheck size={48} color="var(--color-success)" />
                <h3>No damage claims or active disputes found</h3>
                <p style={{ color: 'var(--text-muted)' }}>All returned units have been inspected, approved, and full security deposits refunded.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

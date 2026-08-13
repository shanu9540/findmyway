import React, { useState } from 'react';
import { ShieldAlert, Calendar, Clock, MapPin, IndianRupee, CheckCircle, ChevronDown, ChevronUp, User, Phone, Star, ClipboardList } from 'lucide-react';

export default function UserDashboard({ rentals, maintenanceRequests, onCreateMaintenance, onScheduleReturn, currentUser }) {
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [issueType, setIssueType] = useState('General Maintenance / Tuning');
  const [description, setDescription] = useState('');
  const [maintDate, setMaintDate] = useState('');

  // Accordion states
  const [expandedMaintId, setExpandedMaintId] = useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  const activeRentals = rentals.filter(r => r.status !== 'returned');
  const pastRentals = rentals.filter(r => r.status === 'returned');

  const handleMaintSubmit = (e) => {
    e.preventDefault();
    if (!maintDate) {
      alert("Please select a preferred maintenance date.");
      return;
    }
    onCreateMaintenance({
      rental_id: selectedRental.id,
      product_name: selectedRental.product_name,
      issue_type: issueType,
      description,
      scheduled_date: maintDate
    });
    setShowMaintModal(false);
    setDescription('');
    setMaintDate('');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled': return 'status-badge scheduled';
      case 'active': return 'status-badge active';
      case 'return_pending': return 'status-badge return-pending';
      case 'returned': return 'status-badge returned';
      default: return 'status-badge';
    }
  };

  // Mock technician generator based on ticket id
  const getMockTechnician = (id) => {
    const techs = [
      { name: "Rohan Verma", phone: "+91-98765 43210", rating: "4.9", role: "Senior Appliance Engineer" },
      { name: "Suresh Kumar", phone: "+91-91234 56789", rating: "4.7", role: "Furniture Assembly Expert" },
      { name: "Amit Pal", phone: "+91-95432 10987", rating: "4.8", role: "AC & Cooling Specialist" }
    ];
    // deterministic index using sum of character codes of id
    const index = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % techs.length;
    return techs[index];
  };

  const getMaintProgressStep = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'assigned': return 2;
      case 'dispatched': return 3;
      case 'resolved': return 4;
      default: return 1;
    }
  };

  const getDeliveryProgressStep = (status) => {
    switch (status) {
      case 'scheduled': return 1;
      case 'dispatched': return 3;
      case 'active': return 4;
      case 'return_pending': return 4;
      default: return 1;
    }
  };

  return (
    <div className="user-dashboard-container animate-fade-in">
      {/* Active Rentals section */}
      <div className="dashboard-section-header">
        <h2>Active & Scheduled Rentals ({activeRentals.length})</h2>
        <p>Manage active leases, request professional upkeep, or schedule relocation returns.</p>
      </div>

      {activeRentals.length > 0 ? (
        <div className="rentals-grid">
          {activeRentals.map((rental) => (
            <div key={rental.id} className="rental-card glass-card">
              <div className="rental-card-header">
                <div className="rental-product-info">
                  <img src={rental.product_image} alt={rental.product_name} className="rental-thumbnail" />
                  <div>
                    <h3 className="rental-title">{rental.product_name}</h3>
                    <span className="rental-id-label">ID: {rental.id}</span>
                  </div>
                </div>
                <span className={getStatusBadgeClass(rental.status)}>
                  {rental.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="rental-card-details">
                <div className="detail-item">
                  <span className="detail-label">Monthly Rent</span>
                  <span className="detail-value text-glow">
                    <IndianRupee size={12} />
                    {rental.monthly_rent} / mo
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Security Deposit</span>
                  <span className="detail-value">
                    <IndianRupee size={12} />
                    {rental.security_deposit}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tenure Term</span>
                  <span className="detail-value">{rental.tenure_months} Months</span>
                </div>
              </div>

              {/* Delivery Tracking Progress Timeline */}
              <div className="delivery-tracking-timeline" style={{
                margin: '1rem 0',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Delivery tracking:</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    color: rental.status === 'active' ? 'var(--color-steps)' : 'var(--color-water)',
                    textTransform: 'uppercase'
                  }}>
                    {rental.status === 'scheduled' && '📦 Order Confirmed'}
                    {rental.status === 'dispatched' && '🚚 Out for Delivery'}
                    {rental.status === 'active' && '✓ Assembled & Active'}
                    {rental.status === 'return_pending' && '📦 Relocation Return Pending'}
                  </span>
                </div>

                <div className="ticket-timeline-row" style={{ margin: '0', padding: '0.25rem 0' }}>
                  <div className="timeline-track" style={{ height: '3px', background: 'rgba(255,255,255,0.05)', position: 'relative', marginBottom: '1.25rem' }}>
                    <div className="timeline-track-fill" style={{ 
                      width: `${((getDeliveryProgressStep(rental.status) - 1) / 3) * 100}%`,
                      background: 'linear-gradient(to right, var(--color-water), var(--color-primary))',
                      height: '100%'
                    }}></div>
                  </div>
                  <div className="timeline-nodes" style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', top: '-15px' }}>
                    <div className={`timeline-node ${getDeliveryProgressStep(rental.status) >= 1 ? 'completed' : ''}`}>
                      <div className="node-dot" style={{ width: '8px', height: '8px', margin: '0 auto' }}></div>
                      <span className="node-label" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>Ordered</span>
                    </div>
                    <div className={`timeline-node ${getDeliveryProgressStep(rental.status) >= 2 ? 'completed' : ''}`}>
                      <div className="node-dot" style={{ width: '8px', height: '8px', margin: '0 auto' }}></div>
                      <span className="node-label" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>Packed</span>
                    </div>
                    <div className={`timeline-node ${getDeliveryProgressStep(rental.status) >= 3 ? 'completed' : ''}`}>
                      <div className="node-dot" style={{ width: '8px', height: '8px', margin: '0 auto' }}></div>
                      <span className="node-label" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>Dispatched</span>
                    </div>
                    <div className={`timeline-node ${getDeliveryProgressStep(rental.status) >= 4 ? 'completed' : ''}`}>
                      <div className="node-dot" style={{ width: '8px', height: '8px', margin: '0 auto' }}></div>
                      <span className="node-label" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>Delivered</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="rental-card-schedule-info">
                <div className="info-line">
                  <Calendar size={14} />
                  <span>
                    {rental.status === 'scheduled' ? 'Scheduled Delivery' : 'Delivered on'}: {rental.delivery_date}
                  </span>
                </div>
                <div className="info-line">
                  <Clock size={14} />
                  <span>Slot: {rental.delivery_time_slot}</span>
                </div>
                <div className="info-line">
                  <MapPin size={14} />
                  <span className="truncate-text">{rental.delivery_address}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="rental-card-actions">
                {rental.status === 'active' && (
                  <>
                    <button 
                      className="btn-secondary maint-request-btn"
                      onClick={() => {
                        setSelectedRental(rental);
                        setShowMaintModal(true);
                      }}
                    >
                      Request Maintenance
                    </button>
                    <button 
                      className="btn-danger-outline return-schedule-btn"
                      onClick={() => onScheduleReturn(rental.id)}
                    >
                      Schedule Return
                    </button>
                  </>
                )}
                
                {rental.status === 'scheduled' && (
                  <span className="action-hint-text">
                    🚚 Setup crew will contact you on the scheduled date for assembly.
                  </span>
                )}

                {rental.status === 'return_pending' && (
                  <span className="action-hint-text return-status-alert">
                    📦 Return pickup scheduled. Crew will inspect items for security refunds.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-dashboard-state glass-card">
          <h3>No active rentals</h3>
          <p>Browse our catalog and rent premium furniture & appliances with zero purchase cost.</p>
        </div>
      )}

      {/* Maintenance Request Logs */}
      <div className="dashboard-section-header" style={{ marginTop: '3.5rem' }}>
        <h2>Maintenance Support Tickets ({maintenanceRequests.length})</h2>
        <p>Monitor real-time progress timelines and details of technician visits.</p>
      </div>

      <div className="maint-tickets-stack">
        {maintenanceRequests.length > 0 ? (
          maintenanceRequests.map((req) => {
            const isExpanded = expandedMaintId === req.id;
            const progressStep = getMaintProgressStep(req.status);
            const tech = getMockTechnician(req.id);

            return (
              <div key={req.id} className="maint-ticket-card glass-card animate-fade-in" style={{ marginBottom: '1.25rem' }}>
                <div className="ticket-card-header" onClick={() => setExpandedMaintId(isExpanded ? null : req.id)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className={`ticket-icon-box ${req.status}`}>
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <h4 className="ticket-item-title">{req.product_name}</h4>
                      <div className="ticket-meta-tags">
                        <span className="ticket-id-tag">ID: <code>{req.id}</code></span>
                        <span className="ticket-cat-tag">{req.issue_type}</span>
                        <span className="ticket-date-tag">Visit: {req.scheduled_date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`status-badge ${req.status}`}>
                      {req.status === 'dispatched' ? 'EN ROUTE' : req.status.toUpperCase()}
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Interactive Status Timeline */}
                <div className="ticket-timeline-row">
                  <div className="timeline-track">
                    <div className="timeline-track-fill" style={{ width: `${((progressStep - 1) / 3) * 100}%` }}></div>
                  </div>
                  <div className="timeline-nodes">
                    <div className={`timeline-node ${progressStep >= 1 ? 'completed' : ''}`}>
                      <div className="node-dot"></div>
                      <span className="node-label">Raised</span>
                    </div>
                    <div className={`timeline-node ${progressStep >= 2 ? 'completed' : ''}`}>
                      <div className="node-dot"></div>
                      <span className="node-label">Assigned</span>
                    </div>
                    <div className={`timeline-node ${progressStep >= 3 ? 'completed' : ''}`}>
                      <div className="node-dot"></div>
                      <span className="node-label">En Route</span>
                    </div>
                    <div className={`timeline-node ${progressStep >= 4 ? 'completed' : ''}`}>
                      <div className="node-dot"></div>
                      <span className="node-label">Resolved</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Panel */}
                {isExpanded && (
                  <div className="ticket-expanded-panel animate-slide-down">
                    <div className="ticket-desc-box">
                      <h5>User Issue Description</h5>
                      <p>"{req.description || 'No additional details provided.'}"</p>
                    </div>

                    {/* Technician details for Assigned/Dispatched states */}
                    {(req.status === 'assigned' || req.status === 'dispatched') && (
                      <div className="technician-profile-box">
                        <div className="tech-avatar">
                          <User size={18} color="#000" />
                        </div>
                        <div className="tech-details">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <h5 className="tech-name">{tech.name}</h5>
                            <span className="tech-eta">
                              {req.status === 'dispatched' ? '🔴 Live Status: En Route' : '✓ Scheduled to arrive'}
                            </span>
                          </div>
                          <p className="tech-role">{tech.role}</p>
                          <div className="tech-meta">
                            <span className="tech-rating">
                              <Star size={12} fill="var(--color-primary)" color="var(--color-primary)" />
                              <span>{tech.rating} Rating</span>
                            </span>
                            <span className="tech-phone">
                              <Phone size={12} />
                              <span>{tech.phone}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-table-state glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <CheckCircle size={44} color="var(--color-success)" style={{ marginBottom: '0.75rem' }} />
            <h4>No active support tickets</h4>
            <p style={{ color: 'var(--text-muted)' }}>All rented furniture and appliances are functioning in peak condition.</p>
          </div>
        )}
      </div>

      {/* Complete Order History */}
      {rentals.length > 0 && (
        <>
          <div className="dashboard-section-header" style={{ marginTop: '3.5rem' }}>
            <h2>Complete Order History & Receipts ({rentals.length})</h2>
            <p>Review billing details of all your active leases, pending deliveries, and past completed orders.</p>
          </div>

          <div className="history-stack">
            {rentals.map((rental) => {
              const isExpanded = expandedHistoryId === rental.id;
              const totalAmountPaid = rental.monthly_rent * rental.tenure_months;

              return (
                <div key={rental.id} className="history-card glass-card" style={{ marginBottom: '1rem', padding: '1.25rem 1.75rem' }}>
                  <div className="history-header" onClick={() => setExpandedHistoryId(isExpanded ? null : rental.id)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <CheckCircle size={18} color={rental.status === 'returned' ? 'var(--text-muted)' : 'var(--color-success)'} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{rental.product_name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lease ID: {rental.id}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span className={getStatusBadgeClass(rental.status)}>
                        {rental.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="history-rent-paid" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        Rent: <IndianRupee size={12} />{rental.monthly_rent} / mo
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="history-expanded-invoice animate-slide-down" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                      <div className="invoice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.85rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Lease Details</strong>
                          <p style={{ margin: '0.25rem 0' }}>Tenure Term: {rental.tenure_months} Months</p>
                          <p style={{ margin: '0.25rem 0' }}>Total Contract Value: ₹{totalAmountPaid}</p>
                          <p style={{ margin: '0.25rem 0' }}>Start/Delivery: {rental.delivery_date}</p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Security Deposit</strong>
                          <p style={{ margin: '0.25rem 0' }}>Refundable Deposit: ₹{rental.security_deposit}</p>
                          {rental.status === 'returned' && (
                            <p style={{ margin: '0.25rem 0' }}>Claim Deduction: ₹{rental.damage_claim_amount || 0}</p>
                          )}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Delivery Address</strong>
                          <p style={{ margin: '0.25rem 0', lineHeight: 1.4 }}>{rental.delivery_address}</p>
                          <p style={{ margin: '0.25rem 0', fontStyle: 'italic' }}>Slot: {rental.delivery_time_slot}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Maintenance Request Modal */}
      {showMaintModal && selectedRental && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-scale-in">
            <div className="modal-header">
              <h3>File Maintenance Ticket</h3>
              <button className="modal-close" onClick={() => setShowMaintModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleMaintSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Rental Item</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={selectedRental.product_name}
                  disabled 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category of Issue</label>
                <select 
                  value={issueType} 
                  onChange={(e) => setIssueType(e.target.value)}
                  className="form-control select-control"
                >
                  <option value="Wobbly Legs / Structure Check">Wobbly Legs / Structure Check</option>
                  <option value="Dull Varnish / Surface Scratches">Dull Varnish / Surface Scratches</option>
                  <option value="Cooling / Thermostat Calibration">Cooling / Thermostat Calibration</option>
                  <option value="Drum Vibration / Wash Noise Check">Drum Vibration / Wash Noise Check</option>
                  <option value="Display / Screen Flickering">Display / Screen Flickering</option>
                  <option value="Deep Cleaning & Sanitation Service">Deep Cleaning & Sanitation Service</option>
                  <option value="Other Functionality Fault">Other Functionality Fault</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea 
                  className="form-control text-control" 
                  placeholder="Describe the issue in detail to help our technicians bring the right tools..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Visit Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={maintDate}
                  onChange={(e) => setMaintDate(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Min tomorrow
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowMaintModal(false)}
                >Cancel</button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

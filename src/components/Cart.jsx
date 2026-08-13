import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, Clock, MapPin, IndianRupee, CreditCard, ShoppingBag, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';

export default function Cart({ cart, onUpdateQty, onRemoveItem, onPlaceOrder, serviceAreas, currentUser, onRequireLogin }) {
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 02:00 PM');
  const [selectedArea, setSelectedArea] = useState(serviceAreas[0] || 'New Delhi');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking', 'wallet'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('sbi');
  const [selectedWallet, setSelectedWallet] = useState('paytm');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success'
  const [processingStep, setProcessingStep] = useState(0);

  const totalMonthlyRent = cart.reduce((sum, item) => sum + (item.finalMonthlyRent * item.quantity), 0);
  const totalSecurityDeposit = cart.reduce((sum, item) => sum + (item.security_deposit * item.quantity), 0);
  const totalDueNow = totalMonthlyRent + totalSecurityDeposit;

  const processingMessages = [
    "Establishing secure 256-bit payment link...",
    "Authorizing security deposit hold with issuing bank...",
    "Registering recurring monthly rental lease agreement..."
  ];

  useEffect(() => {
    let timer;
    if (paymentStatus === 'processing') {
      timer = setInterval(() => {
        setProcessingStep(prev => {
          if (prev >= 2) {
            clearInterval(timer);
            setPaymentStatus('success');
            // Finalize order after success animation
            setTimeout(() => {
              onPlaceOrder({
                delivery_address: `${address}, ${selectedArea}`,
                delivery_date: deliveryDate,
                delivery_time_slot: timeSlot,
              });
              setShowPaymentModal(false);
              setPaymentStatus('idle');
              setProcessingStep(0);
            }, 2000);
            return 2;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in or register an account to schedule delivery and complete checkout.");
      onRequireLogin();
      return;
    }
    if (!address.trim() || !deliveryDate) {
      alert("Please fill in the delivery address and date.");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    const formatted = value.length > 2 ? `${value.substring(0, 2)}/${value.substring(2, 4)}` : value;
    setCardExpiry(formatted);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCvv(value);
  };

  const executePayment = (e) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3 || !cardName.trim()) {
        alert("Please complete all card details correctly.");
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (upiId.trim() !== '') {
        if (!upiId.includes('@')) {
          alert("Please enter a valid UPI ID (e.g. username@bank).");
          return;
        }
      }
    }
    setPaymentStatus('processing');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-state glass-card">
        <ShoppingBag size={64} className="empty-cart-icon" />
        <h2>Your Rental Cart is Empty</h2>
        <p>Browse our catalog and choose flexible plans for furniture & appliances.</p>
      </div>
    );
  }

  return (
    <div className="cart-container-grid">
      {/* Left Column: Cart Items list */}
      <div className="cart-left-column">
        <h2 className="section-title">Rental Items</h2>
        
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={`${item.id}-${item.tenure}`} className="cart-item-card glass-card animate-fade-in">
              <img src={item.image_url} alt={item.name} className="cart-item-image" />
              
              <div className="cart-item-details">
                <div className="cart-item-header">
                  <h3 className="cart-item-title">{item.name}</h3>
                  <button 
                    className="cart-item-remove-btn" 
                    onClick={() => onRemoveItem(item.id, item.tenure)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="cart-item-meta">
                  <span className="meta-badge">Tenure: {item.tenure} Months</span>
                  <span className="meta-badge">Deposit: <IndianRupee size={10} />{item.security_deposit}</span>
                </div>

                <div className="cart-item-pricing-row">
                  <div className="qty-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => onUpdateQty(item.id, item.tenure, item.quantity - 1)}
                    >-</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => onUpdateQty(item.id, item.tenure, item.quantity + 1)}
                    >+</button>
                  </div>

                  <div className="cart-item-price-sum">
                    <span className="item-price-each">
                      <IndianRupee size={10} />
                      {item.finalMonthlyRent} / mo
                    </span>
                    <span className="item-price-total">
                      <IndianRupee size={12} />
                      {item.finalMonthlyRent * item.quantity} / mo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Checkout & Schedule Form */}
      <div className="cart-right-column">
        <div className="checkout-summary-card glass-card">
          <h2 className="section-title">Order Summary</h2>
          
          <div className="checkout-totals">
            <div className="total-item">
              <span>Total Monthly Rent</span>
              <span>
                <IndianRupee size={12} />
                {totalMonthlyRent} / mo
              </span>
            </div>
            <div className="total-item">
              <span>Refundable Security Deposit</span>
              <span>
                <IndianRupee size={12} />
                {totalSecurityDeposit}
              </span>
            </div>
            <div className="total-divider"></div>
            <div className="total-item due-now">
              <span>Payable Now (1st Month + Deposit)</span>
              <span>
                <IndianRupee size={14} />
                {totalDueNow}
              </span>
            </div>
          </div>
        </div>

        <div className="checkout-form-card glass-card">
          <h2 className="section-title">Schedule Delivery</h2>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label className="form-label">Service Area</label>
              <div className="form-select-wrapper">
                <MapPin size={16} className="input-icon" />
                <select 
                  value={selectedArea} 
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="form-control select-control"
                >
                  {serviceAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <textarea 
                className="form-control text-control" 
                placeholder="Flat No, House No, Building Name, Street..." 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Delivery Date</label>
                <div className="form-input-wrapper">
                  <Calendar size={16} className="input-icon" />
                  <input 
                    type="date" 
                    className="form-control" 
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Min tomorrow
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <div className="form-select-wrapper">
                  <Clock size={16} className="input-icon" />
                  <select 
                    value={timeSlot} 
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="form-control select-control"
                  >
                    <option value="10:00 AM - 02:00 PM">10 AM - 2 PM (Morning)</option>
                    <option value="02:00 PM - 06:00 PM">2 PM - 6 PM (Afternoon)</option>
                    <option value="06:00 PM - 09:00 PM">6 PM - 9 PM (Evening)</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary checkout-submit-btn"
            >
              <CreditCard size={18} />
              <span>Proceed to Checkout</span>
            </button>
          </form>
        </div>
      </div>

      {/* Payment Gateway Modal Overlay */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card payment-modal animate-scale-in" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0 }}>RentEase Secure Checkout</h3>
              </div>
              {paymentStatus === 'idle' && (
                <button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
              )}
            </div>

            {paymentStatus === 'idle' && (
              <form onSubmit={executePayment} className="modal-form">
                <div className="due-summary-bar">
                  <span>Payable Amount:</span>
                  <strong className="text-glow">
                    <IndianRupee size={14} />
                    {totalDueNow}
                  </strong>
                </div>

                {/* Tabs */}
                <div className="payment-tabs" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '10px',
                  padding: '4px',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--border-glass)',
                  gap: '4px'
                }}>
                  {['card', 'upi', 'netbanking', 'wallet'].map(method => (
                    <button
                      key={method}
                      type="button"
                      className={`payment-tab-btn ${paymentMethod === method ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(method)}
                      style={{
                        background: paymentMethod === method ? 'var(--bg-glass-active)' : 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        textTransform: 'capitalize'
                      }}
                    >
                      {method === 'upi' ? 'UPI' : method === 'netbanking' ? 'Bank' : method === 'wallet' ? 'Wallet' : 'Card'}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="card-fields-wrapper animate-fade-in">
                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <div className="form-input-wrapper">
                        <CreditCard size={16} className="input-icon" />
                        <input 
                          type="text" 
                          className="form-control" 
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="0000 0000 0000 0000"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          value={cardCvv}
                          onChange={handleCvvChange}
                          placeholder="•••"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="upi-fields-wrapper animate-fade-in" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    padding: '0.25rem',
                    gap: '1rem'
                  }}>
                    <div className="form-group">
                      <label className="form-label">Enter UPI ID (VPA)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="username@bank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR SCAN QR</span>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="qr-container" style={{
                        padding: '12px',
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '140px',
                        height: '140px'
                      }}>
                        <svg width="120" height="120" viewBox="0 0 100 100">
                          <rect x="0" y="0" width="22" height="22" fill="#070a13" />
                          <rect x="3" y="3" width="16" height="16" fill="#fff" />
                          <rect x="6" y="6" width="10" height="10" fill="#070a13" />
                          
                          <rect x="78" y="0" width="22" height="22" fill="#070a13" />
                          <rect x="81" y="3" width="16" height="16" fill="#fff" />
                          <rect x="84" y="6" width="10" height="10" fill="#070a13" />
                          
                          <rect x="0" y="78" width="22" height="22" fill="#070a13" />
                          <rect x="3" y="81" width="16" height="16" fill="#fff" />
                          <rect x="6" y="84" width="10" height="10" fill="#070a13" />
                          
                          <rect x="30" y="4" width="8" height="4" fill="#070a13" />
                          <rect x="42" y="10" width="12" height="6" fill="#070a13" />
                          <rect x="60" y="4" width="6" height="14" fill="#070a13" />
                          <rect x="32" y="24" width="16" height="8" fill="#070a13" />
                          <rect x="54" y="22" width="20" height="4" fill="#070a13" />
                          <rect x="24" y="40" width="10" height="12" fill="#070a13" />
                          <rect x="40" y="44" width="22" height="6" fill="#070a13" />
                          <rect x="68" y="38" width="10" height="16" fill="#070a13" />
                          
                          <rect x="24" y="64" width="18" height="6" fill="#070a13" />
                          <rect x="52" y="60" width="12" height="12" fill="#070a13" />
                          <rect x="76" y="62" width="20" height="8" fill="#070a13" />
                          <rect x="30" y="82" width="16" height="12" fill="#070a13" />
                          <rect x="54" y="80" width="12" height="16" fill="#070a13" />
                          <rect x="76" y="78" width="20" height="6" fill="#070a13" />
                        </svg>
                      </div>

                      <div className="qr-timer" style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        background: 'rgba(212,175,55,0.08)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px'
                      }}>
                        🕒 QR active for 04:59 mins
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="netbanking-fields-wrapper animate-fade-in" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.25rem',
                    gap: '1rem'
                  }}>
                    <div className="form-group">
                      <label className="form-label">Select Bank</label>
                      <select 
                        value={selectedBank} 
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="form-control select-control"
                        style={{ width: '100%' }}
                      >
                        <option value="sbi">State Bank of India (SBI)</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="pnb">Punjab National Bank (PNB)</option>
                      </select>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      You will be redirected to your selected bank secure portal to authorize this lease transaction.
                    </p>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="wallet-fields-wrapper animate-fade-in" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.25rem',
                    gap: '1rem'
                  }}>
                    <div className="form-group">
                      <label className="form-label">Select Wallet Provider</label>
                      <select 
                        value={selectedWallet} 
                        onChange={(e) => setSelectedWallet(e.target.value)}
                        className="form-control select-control"
                        style={{ width: '100%' }}
                      >
                        <option value="paytm">Paytm Wallet</option>
                        <option value="phonepe">PhonePe Wallet</option>
                        <option value="amazon">Amazon Pay Wallet</option>
                        <option value="mobikwik">Mobikwik Wallet</option>
                      </select>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      Make sure your wallet balance is sufficient. Direct verification will trigger upon simulation submit.
                    </p>
                  </div>
                )}

                <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>
                    {paymentMethod === 'card' ? `Pay ₹${totalDueNow} Securely` : `Proceed with ${paymentMethod.toUpperCase()}`}
                  </button>
                </div>
              </form>
            )}

            {paymentStatus === 'processing' && (
              <div className="payment-processing-wrapper" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                gap: '1.5rem'
              }}>
                <div className="loading-spinner-wrapper">
                  <div className="payment-spinner"></div>
                </div>
                
                <div className="processing-log">
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Authorizing Transaction</h4>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-primary)',
                    minHeight: '20px',
                    transition: 'all 0.3s ease'
                  }}>
                    {processingMessages[processingStep]}
                  </p>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="payment-success-wrapper" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                gap: '1.25rem'
              }}>
                <CheckCircle size={56} color="var(--color-success)" className="scale-pulse" />
                
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-success)' }}>Payment Confirmed</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lease ID: TXN_{Math.floor(1000000000 + Math.random()*9000000000)}</p>
                </div>

                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-glass)',
                  paddingTop: '0.75rem',
                  width: '100%'
                }}>
                  Generating active rental logistics tickets and routing to your user dashboard...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

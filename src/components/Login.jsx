import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, MapPin, Key, Shield, ArrowRight } from 'lucide-react';

export default function Login({ onLogin, onRegister, serviceAreas, onBrowseGuest, currentUser }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [selectedArea, setSelectedArea] = useState(serviceAreas[0] || 'New Delhi');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock OAuth Overlay States
  const [socialModal, setSocialModal] = useState({ show: false, platform: '', step: 'choose' });

  // Autocomplete Suggestions States
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedSessions, setSavedSessions] = useState(() => {
    return JSON.parse(localStorage.getItem('rentease_saved_sessions')) || [];
  });

  // Handle click outside to close suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = () => setShowSuggestions(false);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name || !email || !password) {
          setErrorMsg('Please fill in all fields.');
          setLoading(false);
          return;
        }
        await onRegister({ email, password, name, role, service_area: selectedArea });
      } else {
        if (!email || !password) {
          setErrorMsg('Please enter email and password.');
          setLoading(false);
          return;
        }
        await onLogin(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (platform) => {
    setSocialModal({ show: true, platform, step: 'choose' });
  };

  const handleSelectSocialAccount = (selectedEmail, selectedName) => {
    setSocialModal(prev => ({ ...prev, step: 'loading' }));
    
    // Simulate OAuth Delay
    setTimeout(async () => {
      try {
        // Try logging in with the social email (default password is 'password' for seeded demo users)
        await onLogin(selectedEmail, 'password');
        setSocialModal({ show: false, platform: '', step: 'choose' });
      } catch (err) {
        // User not found in database - Auto-register them on-the-fly (Real OAuth behavior!)
        try {
          await onRegister({
            email: selectedEmail,
            password: 'password',
            name: selectedName,
            role: 'user',
            service_area: 'New Delhi'
          });
          setSocialModal({ show: false, platform: '', step: 'choose' });
        } catch (regErr) {
          setErrorMsg('Social authentication connection failed.');
          setSocialModal({ show: false, platform: '', step: 'choose' });
        }
      }
    }, 1500);
  };

  return (
    <div className="login-split-container animate-fade-in">
      {/* Left Panel - Branding & Benefits Showcase */}
      <div className="login-image-panel">
        <div className="image-overlay"></div>
        <div className="panel-content">
          <div className="brand-badge">
            <Key size={18} />
            <span>RentEase Platform</span>
          </div>
          <h1 className="showcase-title">Rent Premium Furniture & Smart Appliances</h1>
          <p className="showcase-subtitle">Upgrade your home lifestyle with zero purchasing hassle. Flexible monthly plans, free relocation, and door-step maintenance.</p>
          
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-text">
                <h5>Zero Upfront Cost</h5>
                <p>Pay only a minimal deposit and cheap monthly rent.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-text">
                <h5>Free Setup & Relocation</h5>
                <p>We handle transport, delivery, and setup for free.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-text">
                <h5>24-Hour Maintenance</h5>
                <p>Free deep cleaning & technical service within 1 day.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Interactive Login/Register Form */}
      <div className="login-form-panel">
        <div className="login-card glass-card">
          <div className="login-header">
            <h2>{isRegistering ? 'Create Rental Account' : 'Welcome to RentEase'}</h2>
            <p>{isRegistering ? 'Sign up to rent top-quality furniture & appliances' : 'Access your active leases, schedules & maintenance logs'}</p>
          </div>

          {currentUser && (
            <div className="logged-in-session-banner animate-fade-in" style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              marginBottom: '1.25rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <span>You are already signed in as {currentUser.name} ({currentUser.role}).</span>
              <button 
                type="button"
                onClick={onBrowseGuest}
                className="btn-primary" 
                style={{ padding: '0.35rem 1rem', fontSize: '0.75rem', borderRadius: '6px' }}
              >
                Return to Catalog
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="auth-error-card animate-slide-down">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegistering && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input-wrapper">
                  <User size={16} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-control" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email" 
                  className="form-control" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="e.g. user@rentease.com"
                  required
                />
              </div>

              {/* Autocomplete email suggestions with masked password previews */}
              {showSuggestions && savedSessions.length > 0 && (
                <div className="autocomplete-dropdown glass-card animate-fade-in" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'rgba(13, 18, 32, 0.96)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  marginTop: '0.25rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 50,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)'
                }}>
                  {savedSessions
                    .filter(s => s.email.toLowerCase().includes(email.toLowerCase()))
                    .map((s, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setEmail(s.email);
                          setPassword(s.password);
                          setShowSuggestions(false);
                        }}
                        style={{
                          padding: '0.65rem 1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8rem',
                          borderBottom: idx < savedSessions.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                          color: 'var(--text-main)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span style={{ fontWeight: 600 }}>{s.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontSize: '0.7rem' }}>
                          <Lock size={10} />
                          <span>••••••••</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <Lock size={16} className="input-icon" />
                <input 
                  type="password" 
                  className="form-control" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isRegistering && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Register as</label>
                  <div className="form-select-wrapper">
                    <Shield size={16} className="input-icon" />
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                      className="form-control select-control"
                    >
                      <option value="user">Customer / Renter</option>
                      <option value="vendor">Vendor Shop Owner</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Service Area City</label>
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
              </div>
            )}

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : isRegistering ? 'Register Account' : 'Sign In'}
            </button>
          </form>

          {/* Social Logins Section */}
          <div className="social-login-section">
            <div className="social-divider">
              <span>Or connect with</span>
            </div>
            <div className="social-buttons-row">
              {/* Google Button */}
              <button className="social-btn google-btn" onClick={() => handleSocialClick('Google')} title="Sign in with Google">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </button>

              {/* Facebook Button */}
              <button className="social-btn facebook-btn" onClick={() => handleSocialClick('Facebook')} title="Sign in with Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              {/* Twitter Button */}
              <button className="social-btn twitter-btn" onClick={() => handleSocialClick('Twitter')} title="Sign in with Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="auth-footer">
            {isRegistering ? (
              <p>Already have an account? <span className="auth-toggle-link" onClick={() => { setIsRegistering(false); setErrorMsg(''); }}>Sign In</span></p>
            ) : (
              <p>Don't have an account yet? <span className="auth-toggle-link" onClick={() => { setIsRegistering(true); setErrorMsg(''); }}>Register</span></p>
            )}
            
            {/* Guest Browsing Trigger */}
            {onBrowseGuest && (
              <button onClick={onBrowseGuest} className="btn-guest-browse">
                <span>Browse Catalog as Guest</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Demo Credentials Box */}
          {!isRegistering && (
            <div className="demo-credentials-helper">
              <h4>Quick Demo Logins:</h4>
              <ul>
                <li>Customer: <code>user@rentease.com</code> / <code>password</code></li>
                <li>Vendor: <code>vendor@rentease.com</code> / <code>password</code></li>
                <li>Admin: <code>admin@rentease.com</code> / <code>password</code></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mock Social OAuth Modal Overlay */}
      {socialModal.show && (
        <div className="modal-overlay" style={{ zIndex: 999 }}>
          <div className="modal-content animate-scale-in" style={{
            maxWidth: '400px',
            background: socialModal.platform === 'Google' ? '#ffffff' : socialModal.platform === 'Facebook' ? '#1877F2' : '#000000',
            color: socialModal.platform === 'Google' ? '#1f2937' : '#ffffff',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: socialModal.platform === 'Google' ? '1px solid #e5e7eb' : 'none'
          }}>
            {socialModal.step === 'choose' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                    {socialModal.platform === 'Google' && 'Sign in with Google'}
                    {socialModal.platform === 'Facebook' && 'Log in with Facebook'}
                    {socialModal.platform === 'Twitter' && 'Authorize X / Twitter'}
                  </h4>
                  <button 
                    onClick={() => setSocialModal({ show: false, platform: '', step: 'choose' })}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: socialModal.platform === 'Google' ? '#9ca3af' : 'rgba(255,255,255,0.7)',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >✕</button>
                </div>

                {socialModal.platform === 'Google' && (
                  <div className="google-chooser-panel">
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>to continue to <strong>RentEase</strong></p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {/* Aarav Sharma Default */}
                      <div 
                        onClick={() => handleSelectSocialAccount('user@rentease.com', 'Aarav Sharma')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#d4af37', display: 'flex', alignItems: 'center', justifySpace: 'center', color: '#000', fontWeight: 'bold', fontSize: '0.9rem', justifyContent: 'center' }}>A</div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Aarav Sharma</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>user@rentease.com</div>
                        </div>
                      </div>

                      {/* Sameer Sharma (Shanu) */}
                      <div 
                        onClick={() => handleSelectSocialAccount('sharmashanu9540@gmail.com', 'Sameer Sharma (Shanu)')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifySpace: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', justifyContent: 'center' }}>S</div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Sameer Sharma (Shanu)</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>sharmashanu9540@gmail.com</div>
                        </div>
                      </div>

                      {/* Sameer Sharma (CS) */}
                      <div 
                        onClick={() => handleSelectSocialAccount('sameer.cs299@gmail.com', 'Sameer Sharma (CS)')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifySpace: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', justifyContent: 'center' }}>S</div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Sameer Sharma (CS)</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>sameer.cs299@gmail.com</div>
                        </div>
                      </div>

                      {/* Sameer Coders */}
                      <div 
                        onClick={() => handleSelectSocialAccount('sameercoders@gmail.com', 'Sameer Coders')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff8c00', display: 'flex', alignItems: 'center', justifySpace: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', justifyContent: 'center' }}>S</div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Sameer Coders</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>sameercoders@gmail.com</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {socialModal.platform === 'Facebook' && (
                  <div className="facebook-auth-panel" style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', color: '#ffffff' }}>
                      <strong>RentEase</strong> is requesting access to your public profile and email address.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <button 
                        onClick={() => handleSelectSocialAccount('user@rentease.com', 'Aarav Sharma')}
                        style={{
                          background: '#ffffff',
                          color: '#1877F2',
                          border: 'none',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >Continue as Aarav Sharma</button>
                      <button 
                        onClick={() => setSocialModal({ show: false, platform: '', step: 'choose' })}
                        style={{
                          background: 'transparent',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.3)',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >Cancel</button>
                    </div>
                  </div>
                )}

                {socialModal.platform === 'Twitter' && (
                  <div className="twitter-auth-panel" style={{ textAlign: 'left', padding: '0.5rem 0' }}>
                    <h5 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Authorize RentEase?</h5>
                    <p style={{ fontSize: '0.8rem', lineHeight: 1.4, color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                      This application will be able to read posts, see who you follow, and view your profile email.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={() => handleSelectSocialAccount('user@rentease.com', 'Aarav Sharma')}
                        style={{
                          flex: 1,
                          background: '#ffffff',
                          color: '#000000',
                          border: 'none',
                          padding: '0.65rem',
                          borderRadius: '20px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >Authorize App</button>
                      <button 
                        onClick={() => setSocialModal({ show: false, platform: '', step: 'choose' })}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.3)',
                          padding: '0.65rem',
                          borderRadius: '20px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 0',
                gap: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  border: socialModal.platform === 'Google' ? '3px solid #e5e7eb' : '3px solid rgba(255,255,255,0.1)',
                  borderTop: socialModal.platform === 'Google' ? '3px solid #4285F4' : '3px solid #ffffff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 0.85s linear infinite'
                }}></div>
                <h4 style={{ margin: 0 }}>Connecting to {socialModal.platform}...</h4>
                <p style={{ fontSize: '0.8rem', color: socialModal.platform === 'Google' ? '#6b7280' : 'rgba(255,255,255,0.7)', margin: 0 }}>Verifying secure token authorization</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

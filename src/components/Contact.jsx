import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Check, AlertCircle, Download } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { personalInfo } from '../data/portfolioData';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | success | error
  const [submittedData, setSubmittedData] = useState(null);

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.message.trim()) tempErrors.message = 'Message is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitStatus('loading');

    // Simulate API request (e.g. EmailJS / Formspree service integration point)
    setTimeout(() => {
      // Structuring so Sameer can plug a backend or serverless email service here later
      const simulateSuccess = true; // Set to false to test error boundary

      if (simulateSuccess) {
        setSubmittedData({ name: formData.name, email: formData.email });
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    }, 1500);
  };

  return (
    <section id="contact" className="contact" style={{ paddingTop: '50px' }}>
      <div className="container">
        
        {/* Recruiter Resume CTA Banner */}
        <div className="resume-cta" style={{ marginBottom: '80px' }}>
          <div className="resume-cta-content">
            <h2>Want to know more about me?</h2>
            <p>
              Take a look at my resume to explore my education, technical skills, projects and development journey.
            </p>
            <a 
              href={personalInfo.resumePath} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <Download size={18} />
              <span>Download Resume</span>
            </a>
          </div>
        </div>

        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">Get in Touch</span>
          <h2 className="section-title">Let's Build Something Together</h2>
          <p className="section-desc">
            I'm currently looking for internship and job opportunities where I can apply my technical skills, contribute to projects and continue growing as a developer.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details Left */}
          <div className="contact-info">
            <div className="contact-header-block">
              <h3>Contact Details</h3>
              <p>Feel free to reach out directly through email, phone, or connect on social platforms.</p>
            </div>

            <div className="contact-details">
              <div className="contact-card">
                <div className="contact-card-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-card-details">
                  <h4>Email</h4>
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-card-details">
                  <h4>Phone</h4>
                  <a href={`tel:${personalInfo.phone.replace(/[^+\d]/g, '')}`}>{personalInfo.phone}</a>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-card-details">
                  <h4>Location</h4>
                  <p>{personalInfo.location}</p>
                </div>
              </div>
            </div>

            {/* Quick Links on Contact Page */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a 
                href={personalInfo.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
              <a 
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Contact Form Right */}
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="John Doe"
                    disabled={submitStatus === 'loading'}
                  />
                  {errors.name && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="john@example.com"
                    disabled={submitStatus === 'loading'}
                  />
                  {errors.email && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Internship Inquiry"
                  disabled={submitStatus === 'loading'}
                />
                {errors.subject && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Write your message here..."
                  disabled={submitStatus === 'loading'}
                ></textarea>
                {errors.message && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.message}</span>}
              </div>

              {/* Status Alert Panels */}
              {submitStatus === 'success' && (
                <div className="form-alert form-alert-success">
                  <Check size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Validation passed!</strong> Message verified locally.
                    <div style={{ fontSize: '0.75rem', opacity: 0.95, marginTop: '0.25rem' }}>
                      (Note: The form is structured to connect to EmailJS or Formspree. Name: "{submittedData?.name}", Email: "{submittedData?.email}" was captured.)
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-alert form-alert-error">
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Sending Failed.</strong> There was a problem simulated. Please try emailing directly at {personalInfo.email}.
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitStatus === 'loading'}
                style={{ alignSelf: 'flex-start', minWidth: '160px', height: '48px' }}
              >
                {submitStatus === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
      
      {/* Dynamic Keyframe style sheet for Loader Spinner rotation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

export default Contact;

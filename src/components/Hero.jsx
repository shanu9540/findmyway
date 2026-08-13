import { Mail, Phone, ArrowRight, Download, Terminal } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { personalInfo } from '../data/portfolioData';

function Hero() {
  const handleScrollToProjects = (e) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-greeting">Hi, my name is</span>
            <h1 className="hero-name">{personalInfo.name}</h1>
            <h2 className="hero-headline">{personalInfo.headline}</h2>
            <p className="hero-desc">{personalInfo.description}</p>
            
            <div className="hero-ctas">
              <a href="#projects" className="btn btn-primary" onClick={handleScrollToProjects}>
                <span>View Projects</span>
                <ArrowRight size={18} />
              </a>
              <a 
                href={personalInfo.resumePath} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
              >
                <span>Download Resume</span>
                <Download size={18} />
              </a>
            </div>

            <div className="hero-socials">
              <a 
                href={personalInfo.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a 
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href={`mailto:${personalInfo.email}`} 
                className="social-link" 
                aria-label="Send Email"
              >
                <Mail size={20} />
              </a>
              <a 
                href={`tel:${personalInfo.phone.replace(/[^+\d]/g, '')}`} 
                className="social-link" 
                aria-label="Call Phone"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>

          <div className="hero-img-wrapper">
            <div className="hero-img-container">
              <img 
                src="/profile.jpg" 
                alt={personalInfo.name} 
                className="hero-profile-img" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

import { Mail } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { personalInfo } from '../data/portfolioData';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-socials">
            <a 
              href={personalInfo.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-link"
              aria-label="GitHub Profile"
            >
              <Github size={18} />
            </a>
            <a 
              href={personalInfo.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-link"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href={`mailto:${personalInfo.email}`} 
              className="footer-social-link"
              aria-label="Send Email"
            >
              <Mail size={18} />
            </a>
          </div>

          <div className="footer-copyright">
            &copy; {currentYear} {personalInfo.name}. All rights reserved.
          </div>

          <div className="footer-tagline">
            Built with passion for technology and continuous learning.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

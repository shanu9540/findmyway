import { GraduationCap, Building, Calendar, Award } from 'lucide-react';
import { aboutInfo } from '../data/portfolioData';

// Map icons to Lucide components
const iconMap = {
  GraduationCap: GraduationCap,
  Building: Building,
  Calendar: Calendar,
  Award: Award
};

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Get to Know Me</span>
          <h2 className="section-title">About Me</h2>
          <p className="section-desc">
            A developer in training, driven by learning new stacks and deploying practical systems.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-left">
            <div className="about-bio">
              <p style={{ marginBottom: '1.25rem' }}>{aboutInfo.paragraph}</p>
              <p>
                My academic path has grounded me in core computer science disciplines, while my independent projects
                enable me to experiment with practical software development workflows—from layout sketching to API routing
                and deployment configuration.
              </p>
            </div>
          </div>

          <div className="about-right">
            <div className="about-cards-grid">
              {aboutInfo.cards.map((card, idx) => {
                const IconComponent = iconMap[card.icon] || Award;
                return (
                  <div key={idx} className="about-stat-card">
                    <div className="stat-icon-wrapper">
                      <IconComponent size={20} />
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;

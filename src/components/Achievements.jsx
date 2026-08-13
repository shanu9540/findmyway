import { CheckCircle2 } from 'lucide-react';
import { achievementsData } from '../data/portfolioData';

function Achievements() {
  return (
    <section id="achievements" className="achievements" style={{ paddingBottom: '50px' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Milestones</span>
          <h2 className="section-title">Achievements &amp; Activities</h2>
          <p className="section-desc">
            Highlights of my independent learning, open-source interests, and community engagement.
          </p>
        </div>

        <div className="achievements-list">
          {achievementsData.map((item, idx) => (
            <div key={idx} className="achievement-item">
              <div className="achievement-icon">
                <CheckCircle2 size={22} />
              </div>
              <p className="achievement-text">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Achievements;

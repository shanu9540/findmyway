import { educationData } from '../data/portfolioData';

function Education() {
  return (
    <section id="education" className="education">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Academic History</span>
          <h2 className="section-title">Education</h2>
          <p className="section-desc">
            Details of my formal schooling, degrees, and core computer science coursework.
          </p>
        </div>

        <div className="timeline">
          {educationData.map((item, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h3>{item.degree}</h3>
                    <div className="timeline-institution">{item.institution}</div>
                  </div>
                  <div className="timeline-meta">
                    <div className="timeline-period">{item.period}</div>
                    <div className="timeline-score">{item.score}</div>
                  </div>
                </div>

                {item.coursework && item.coursework.length > 0 && (
                  <div className="timeline-body">
                    <h4>Relevant Coursework</h4>
                    <div className="timeline-coursework">
                      {item.coursework.map((course, courseIdx) => (
                        <span key={courseIdx} className="coursework-badge">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;

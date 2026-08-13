import { Cloud, Server, Network, ShieldCheck, Key, GitBranch, Settings, Terminal, Info } from 'lucide-react';
import { devOpsJourney } from '../data/portfolioData';

// Map icons to DevOps/AWS items
const journeyIconMap = {
  "AWS": <Cloud size={20} />,
  "EC2": <Server size={20} />,
  "VPC": <Network size={20} />,
  "Subnets": <Network size={20} />,
  "Route Tables": <Network size={20} />,
  "Security Groups": <ShieldCheck size={20} />,
  "IAM": <Key size={20} />,
  "Jenkins": <Settings size={20} />,
  "CI/CD": <GitBranch size={20} />,
  "Git": <GitBranch size={20} />,
  "GitHub": <GitBranch size={20} />,
  "Linux": <Terminal size={20} />,
  "Ubuntu": <Terminal size={20} />
};

function AWSJourney() {
  return (
    <section id="aws-devops" className="aws-journey">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Infrastructure &amp; Pipelines</span>
          <h2 className="section-title">Cloud &amp; DevOps Journey</h2>
          <p className="section-desc">
            Exploring scalable architectures, virtual networks, and deployment pipelines.
          </p>
        </div>

        <div className="journey-container">
          <div className="journey-content">
            <div className="journey-left">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Building Hands-On Knowledge
              </h3>
              <p className="journey-desc">{devOpsJourney.description}</p>
              
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
                  <span>Configuring custom AWS VPC networks with public/private subnets and route tables.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
                  <span>Provisioning and securing virtual compute nodes using AWS EC2 and security groups.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
                  <span>Scripting automated build steps and CI/CD pipelines via Jenkins.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
                  <span>Managing Linux environments using Ubuntu CLI, SSH tools, and basic bash commands.</span>
                </li>
              </ul>

              <div className="journey-disclaimer">
                <Info size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>
                  <strong>Note:</strong> This represents active learning, home lab work, and academic projects, not enterprise or professional production-level employment.
                </span>
              </div>
            </div>

            <div className="journey-right">
              {devOpsJourney.technologies.map((tech, idx) => {
                const icon = journeyIconMap[tech.name] || <Cloud size={20} />;
                return (
                  <div key={idx} className="journey-badge-card">
                    <div className="journey-badge-icon">{icon}</div>
                    <h4>{tech.name}</h4>
                    <span>{tech.category}</span>
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

export default AWSJourney;

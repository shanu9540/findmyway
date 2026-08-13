import { Code2, Laptop, Server, Database, Cloud, GitBranch, Brain, Wrench } from 'lucide-react';
import { skillsData } from '../data/portfolioData';

// Map categories to visual icons
const categoryIconMap = {
  "Programming Languages": <Code2 size={18} />,
  "Frontend Development": <Laptop size={18} />,
  "Backend & Web Development": <Server size={18} />,
  "Databases": <Database size={18} />,
  "Cloud & AWS": <Cloud size={18} />,
  "DevOps & CI/CD": <GitBranch size={18} />,
  "AI & Data": <Brain size={18} />,
  "Development Tools": <Wrench size={18} />
};

function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Technical Stack</span>
          <h2 className="section-title">Skills &amp; Expertise</h2>
          <p className="section-desc">
            A comprehensive overview of programming languages, tools, frameworks, and deployment practices I have explored.
          </p>
        </div>

        <div className="skills-grid">
          {skillsData.categories.map((category, catIdx) => {
            const categoryIcon = categoryIconMap[category.title] || <Code2 size={18} />;
            return (
              <div key={catIdx} className="skill-category-card">
                <h3 className="skill-category-title">
                  <span>{category.title}</span>
                  <span style={{ color: 'var(--primary)' }}>{categoryIcon}</span>
                </h3>
                <div className="skills-list">
                  {category.skills.map((skill, skillIdx) => {
                    const isPriority = skillsData.priorities.includes(skill.name);
                    return (
                      <div
                        key={skillIdx}
                        className={`skill-badge ${isPriority ? 'priority' : ''}`}
                        title={`${skill.name} - ${skill.level}`}
                      >
                        <span>{skill.name}</span>
                        <span className="skill-level">({skill.level})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;

import { useState } from 'react';
import { ExternalLink, FolderGit2 } from 'lucide-react';
import { Github } from './Icons';
import { projectsData } from '../data/portfolioData';

function Projects({ onLaunchRentEase }) {
  const [activeFilter, setActiveFilter] = useState('All');

  // Allowed categories requested: All | Web Development | React | JavaScript | Cloud & DevOps
  const allPossibleCategories = [
    { label: 'All', value: 'All' },
    { label: 'Web Development', value: 'Web Development' },
    { label: 'React', value: 'React' },
    { label: 'JavaScript', value: 'JavaScript' },
    { label: 'Cloud & DevOps', value: 'Cloud & DevOps' }
  ];

  // Helper to check if project matches category or has corresponding technology
  const projectMatchesCategory = (project, categoryValue) => {
    if (categoryValue === 'All') return true;
    
    // Check if category matches direct project category
    if (project.category.toLowerCase() === categoryValue.toLowerCase()) return true;

    // Check if category exists as a technology (e.g. "React" matching "React.js" or "JavaScript" matching "JavaScript")
    return project.technologies.some(tech => 
      tech.toLowerCase().includes(categoryValue.toLowerCase()) || 
      categoryValue.toLowerCase().includes(tech.toLowerCase())
    );
  };

  // Only show filters when relevant projects exist
  const visibleCategories = allPossibleCategories.filter(cat => {
    if (cat.value === 'All') return true;
    return projectsData.some(project => projectMatchesCategory(project, cat.value));
  });

  // Filter projects list based on selection
  const filteredProjects = projectsData.filter(project => 
    projectMatchesCategory(project, activeFilter)
  );

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">My Work</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-desc">
            Some of the projects I've built while developing my technical and problem-solving skills.
          </p>
        </div>

        {/* Dynamic Project Filters */}
        {visibleCategories.length > 1 && (
          <div className="projects-filters">
            {visibleCategories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveFilter(cat.value)}
                className={`filter-btn ${activeFilter === cat.value ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Projects Cards Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-img-wrapper">
                <img 
                  src={project.image} 
                  alt={`${project.name} preview`} 
                  className="project-img"
                  loading="lazy" 
                />
                <span className="project-category">{project.category}</span>
              </div>

              <div className="project-info">
                <h3 className="project-title">{project.name}</h3>
                <p className="project-desc">{project.description}</p>
                
                <div className="project-tech-list">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="project-tech-badge">{tech}</span>
                  ))}
                </div>

                <div className="project-links">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ flexGrow: 1 }}
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={project.liveDemoUrl}
                    onClick={(e) => {
                      if (project.liveDemoUrl === '#rentease') {
                        e.preventDefault();
                        if (onLaunchRentEase) onLaunchRentEase();
                      }
                    }}
                    target={project.liveDemoUrl === '#rentease' ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ flexGrow: 1 }}
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;

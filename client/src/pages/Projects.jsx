import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectContext } from '../context/ProjectContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Plus, MoreVertical, FolderKanban } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const { projects, fetchProjects, createProject, loading } = useContext(ProjectContext);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;
    
    try {
      await createProject(newProject);
      setNewProject({ name: '', description: '' });
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="layout-with-sidebar">
        <Sidebar />
        <main className="main-content">
          <div className="projects-header animate-fade-in">
            <div>
              <h1>Projects</h1>
              <p>Manage all your team's projects</p>
            </div>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              New Project
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading projects...</div>
          ) : (
            <div className="projects-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {projects.length === 0 ? (
                <div className="empty-state glass-panel" style={{ gridColumn: '1 / -1' }}>
                  <FolderKanban size={48} className="empty-icon" />
                  <h3>No Projects Yet</h3>
                  <p>Create your first project to get started.</p>
                  <button className="btn-primary mt-4" onClick={() => setShowModal(true)}>
                    Create Project
                  </button>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project._id} className="project-card glass-panel" onClick={() => navigate(`/projects/${project._id}/board`)}>
                    <div className="project-card-header">
                      <h3>{project.name}</h3>
                      <button className="icon-btn" onClick={(e) => { e.stopPropagation(); /* TODO: Options */ }}>
                        <MoreVertical size={18} />
                      </button>
                    </div>
                    <p className="project-desc">{project.description || 'No description'}</p>
                    <div className="project-footer">
                      <div className="members-avatars">
                        <div className="avatar-mini bg-indigo">O</div>
                        {project.members.map((m, i) => i < 3 && (
                          <div key={m._id || i} className="avatar-mini bg-gray">M</div>
                        ))}
                        {project.members.length > 3 && <div className="avatar-mini more">+{project.members.length - 3}</div>}
                      </div>
                      <span className="updated-at">Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content glass-panel animate-fade-in">
                <h2>Create New Project</h2>
                <form onSubmit={handleCreateProject}>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="e.g. Website Redesign"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="What is this project about?"
                      rows={3}
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Projects;

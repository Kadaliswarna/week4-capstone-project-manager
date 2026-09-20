import React, { useContext, useEffect, useState } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { AuthContext } from '../context/AuthContext';
import { FolderKanban, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { projects, fetchProjects, loading } = useContext(ProjectContext);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriority: 0,
    overdueTasks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const calculateStats = async () => {
      if (!projects.length) {
        setStatsLoading(false);
        return;
      }
      
      setStatsLoading(true);
      try {
        let totalTasks = 0;
        let completed = 0;
        let pending = 0;
        let highPriority = 0;
        let overdue = 0;

        // In a real production app, you'd have a specific /api/stats endpoint
        // For this capstone, we'll fetch boards and lists for each project to calculate
        for (const project of projects) {
          const boardsRes = await api.get(`/projects/${project._id}/boards`);
          
          for (const board of boardsRes.data) {
            const listsRes = await api.get(`/boards/${board._id}/lists`);
            
            for (const list of listsRes.data) {
              const cardsRes = await api.get(`/lists/${list._id}/cards`);
              
              totalTasks += cardsRes.data.length;
              
              const isCompletedList = list.name.toLowerCase().includes('complete') || list.name.toLowerCase().includes('done');
              
              cardsRes.data.forEach(card => {
                if (isCompletedList) {
                  completed++;
                } else {
                  pending++;
                  if (card.dueDate && new Date(card.dueDate) < new Date()) {
                    overdue++;
                  }
                }
                
                if (card.priority === 'High' && !isCompletedList) {
                  highPriority++;
                }
              });
            }
          }
        }

        setStats({
          totalProjects: projects.length,
          totalTasks,
          completedTasks: completed,
          pendingTasks: pending,
          highPriority,
          overdueTasks: overdue,
        });
      } catch (err) {
        console.error("Error calculating stats", err);
      } finally {
        setStatsLoading(false);
      }
    };

    if (projects.length > 0) {
      calculateStats();
    } else {
      setStatsLoading(false);
    }
  }, [projects]);

  return (
    <>
      <Navbar />
      <div className="layout-with-sidebar">
        <Sidebar />
        <main className="main-content">
          <div className="dashboard-header animate-fade-in">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Here's what's happening with your projects today.</p>
          </div>

          {(loading || statsLoading) ? (
            <div className="loading-spinner">Loading dashboard data...</div>
          ) : (
            <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="stat-card glass-panel">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                  <FolderKanban size={24} />
                </div>
                <div className="stat-details">
                  <h3>Total Projects</h3>
                  <p className="stat-value">{stats.totalProjects}</p>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                  <CheckCircle size={24} />
                </div>
                <div className="stat-details">
                  <h3>Total Tasks</h3>
                  <p className="stat-value">{stats.totalTasks}</p>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-icon" style={{ backgroundColor: 'var(--priority-low-bg)', color: 'var(--priority-low-text)' }}>
                  <CheckCircle size={24} />
                </div>
                <div className="stat-details">
                  <h3>Completed Tasks</h3>
                  <p className="stat-value">{stats.completedTasks}</p>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                  <Clock size={24} />
                </div>
                <div className="stat-details">
                  <h3>Pending Tasks</h3>
                  <p className="stat-value">{stats.pendingTasks}</p>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-icon" style={{ backgroundColor: 'var(--priority-medium-bg)', color: 'var(--priority-medium-text)' }}>
                  <AlertTriangle size={24} />
                </div>
                <div className="stat-details">
                  <h3>High Priority</h3>
                  <p className="stat-value">{stats.highPriority}</p>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-icon" style={{ backgroundColor: 'var(--priority-high-bg)', color: 'var(--priority-high-text)' }}>
                  <Clock size={24} />
                </div>
                <div className="stat-details">
                  <h3>Overdue Tasks</h3>
                  <p className="stat-value">{stats.overdueTasks}</p>
                </div>
              </div>
            </div>
          )}

          <div className="dashboard-recent animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2>Your Projects</h2>
            <div className="recent-projects-list">
              {projects.length === 0 ? (
                <div className="empty-state glass-panel">
                  <p>You don't have any projects yet.</p>
                </div>
              ) : (
                projects.slice(0, 3).map(project => (
                  <div key={project._id} className="recent-project-card glass-panel">
                    <h3>{project.name}</h3>
                    <p>{project.description || 'No description provided.'}</p>
                    <div className="project-meta">
                      <span>{project.members.length + 1} Members</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;

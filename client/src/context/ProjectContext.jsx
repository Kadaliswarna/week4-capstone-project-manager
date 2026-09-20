import React, { createContext, useState, useCallback, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchProjectById = useCallback(async (id) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get(`/projects/${id}`);
      setCurrentProject(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      setProjects([...projects, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      setProjects(projects.map(p => p._id === id ? response.data : p));
      if (currentProject?._id === id) {
        setCurrentProject(response.data);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      if (currentProject?._id === id) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        error,
        fetchProjects,
        fetchProjectById,
        createProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

import { useState, useEffect, useCallback } from 'react';
import { getProjects, createProject, deleteProject } from '../services/api.js';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (projectData) => {
    const project = await createProject(projectData);
    setProjects(prev => [project, ...prev]);
    return project;
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    setProjects(prev => prev.filter(p => p._id !== id));
  };

  return { projects, loading, error, fetchProjects, addProject, removeProject };
}

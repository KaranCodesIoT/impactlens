import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

// ─── Projects ─────────────────────────────────────────────────────────────

export const getProjects = () => api.get('/projects').then(r => r.data);

export const getProject = (id) => api.get(`/projects/${id}`).then(r => r.data);

export const createProject = (data) => api.post('/projects', data).then(r => r.data);

export const updateProject = (id, data) => api.put(`/projects/${id}`, data).then(r => r.data);

export const deleteProject = (id) => api.delete(`/projects/${id}`).then(r => r.data);

// ─── Media ────────────────────────────────────────────────────────────────

export const getProjectMedia = (projectId, params = {}) =>
  api.get(`/projects/${projectId}/media`, { params }).then(r => r.data);

export const registerMedia = (projectId, cloudinaryData) =>
  api.post(`/projects/${projectId}/media`, cloudinaryData).then(r => r.data);

export const getMedia = (mediaId) => api.get(`/media/${mediaId}`).then(r => r.data);

export const updateMedia = (mediaId, data) => api.put(`/media/${mediaId}`, data).then(r => r.data);

export const deleteMedia = (mediaId) => api.delete(`/media/${mediaId}`).then(r => r.data);

// ─── AI Analysis ──────────────────────────────────────────────────────────

export const analyzeMedia = (mediaId) =>
  api.post(`/analysis/media/${mediaId}/analyze`).then(r => r.data);

export const queryProject = (projectId, question) =>
  api.post(`/analysis/projects/${projectId}/query`, { question }).then(r => r.data);

export const compareMedia = (projectId, beforeId, afterId) =>
  api.post(`/analysis/projects/${projectId}/compare`, { beforeId, afterId }).then(r => r.data);

// ─── Reports ──────────────────────────────────────────────────────────────

export const generateReport = (projectId, options = {}) =>
  api.post(`/reports/projects/${projectId}/report`, options, {
    responseType: options.format === 'pdf' ? 'blob' : 'text'
  }).then(r => r.data);

export default api;

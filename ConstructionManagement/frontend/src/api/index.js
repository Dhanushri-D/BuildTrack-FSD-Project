import axios from 'axios';

const api = axios.create({ baseURL: 'https://buildtrack-fsd-project-production.up.railway.app' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const projectApi = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const taskApi = {
  getAll: (projectId) => api.get(`/projects/${projectId}/tasks`),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  update: (projectId, id, data) => api.put(`/projects/${projectId}/tasks/${id}`, data),
  delete: (projectId, id) => api.delete(`/projects/${projectId}/tasks/${id}`),
};

export const expenseApi = {
  getAll: (projectId) => api.get(`/projects/${projectId}/expenses`),
  getAnalytics: (projectId) => api.get(`/projects/${projectId}/expenses/analytics`),
  create: (projectId, data) => api.post(`/projects/${projectId}/expenses`, data),
  update: (projectId, id, data) => api.put(`/projects/${projectId}/expenses/${id}`, data),
  delete: (projectId, id) => api.delete(`/projects/${projectId}/expenses/${id}`),
};

export const contractorApi = {
  getAll: (projectId) => api.get(`/projects/${projectId}/contractors`),
  create: (projectId, data) => api.post(`/projects/${projectId}/contractors`, data),
  update: (projectId, id, data) => api.put(`/projects/${projectId}/contractors/${id}`, data),
  delete: (projectId, id) => api.delete(`/projects/${projectId}/contractors/${id}`),
};

export const siteUpdateApi = {
  getAll: (projectId) => api.get(`/projects/${projectId}/site-updates`),
  create: (projectId, data) => api.post(`/projects/${projectId}/site-updates`, data),
  delete: (projectId, id) => api.delete(`/projects/${projectId}/site-updates/${id}`),
};

export const documentApi = {
  getAll: (projectId) => api.get(`/projects/${projectId}/documents`),
  upload: (projectId, formData) => api.post(`/projects/${projectId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (projectId, id) => api.delete(`/projects/${projectId}/documents/${id}`),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAllRead: () => api.put('/notifications/mark-all-read'),
};

export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getProjectSummary: (id) => api.get(`/analytics/projects/${id}/summary`),
};

export const userApi = {
  getAll: () => api.get('/users'),
  getMe: () => api.get('/users/me'),
};

export default api;

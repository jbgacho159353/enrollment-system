import axios from 'axios';
import demoMode from './demoMode';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, Promise.reject);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No response (network error) OR proxy failure 5xx = backend offline → use demo mode
    if (!error.response || error.response.status >= 500) {
      return demoMode.handleRequest(error.config);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

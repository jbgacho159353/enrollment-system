import axios from 'axios';
import demoMode from './demoMode';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// On non-localhost (Netlify, GitHub Pages, etc.) there is no backend — always use demo mode
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
if (!isLocalhost) {
  api.defaults.adapter = (config) => demoMode.handleRequest(config);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, Promise.reject);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error or proxy failure on localhost → fall back to demo mode
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

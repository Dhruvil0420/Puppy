import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach admin token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('teddypups_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track recent error toast messages to prevent duplicate spam
const recentErrors = new Set();

// Normalize responses or errors and show global error toast when unhandled
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip 401 errors since AuthContext handles redirection/logout
    const status = error.response?.status;
    const msg = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Request timed out' : 'Something went wrong');

    if (status !== 401 && msg && !recentErrors.has(msg)) {
      recentErrors.add(msg);
      toast.error(msg);
      setTimeout(() => {
        recentErrors.delete(msg);
      }, 2500);
    }

    return Promise.reject(error);
  }
);

export default api;

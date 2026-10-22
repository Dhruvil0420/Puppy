import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('teddypups_admin_token'));
  const [loading, setLoading] = useState(true);

  // Auto-logout on 401 interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  // Fetch current admin profile if token exists
  useEffect(() => {
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    api.get('/auth/me')
      .then((res) => {
        if (isMounted && res.data?.data) {
          setAdmin(res.data.data);
        }
      })
      .catch(() => {
        if (isMounted) logout();
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success && res.data.data?.token) {
      const newToken = res.data.data.token;
      localStorage.setItem('teddypups_admin_token', newToken);
      setToken(newToken);
      setAdmin(res.data.data.admin);
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('teddypups_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: Boolean(token), loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import api from './api';

export const authService = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  verifyToken: (token) => {
    return api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: (token, password) => {
    return api.post('/auth/reset-password', { token, password });
  },

  updateProfile: (userData) => {
    return api.put('/auth/profile', userData);
  },
};

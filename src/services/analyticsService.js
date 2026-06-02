import api from './api';

export const analyticsService = {
  getDashboardStats: () => {
    return api.get('/analytics/dashboard');
  },

  getTaskAnalytics: (period = '7d') => {
    return api.get('/analytics/tasks', { params: { period } });
  },

  getUserAnalytics: (period = '7d') => {
    return api.get('/analytics/users', { params: { period } });
  },

  getReports: (type, period = '30d') => {
    return api.get('/analytics/reports', {
      params: { type, period }
    });
  },

  exportReport: (type, format = 'pdf', period = '30d') => {
    return api.get('/analytics/export', {
      params: { type, format, period },
      responseType: 'blob'
    });
  },
};

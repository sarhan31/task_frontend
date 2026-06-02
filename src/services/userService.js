import api from './api';

export const userService = {
  getUsers: (filters = {}) => {
    return api.get('/users', { params: filters });
  },

  getUserById: (userId) => {
    return api.get(`/users/${userId}`);
  },

  createUser: (userData) => {
    return api.post('/users', userData);
  },

  updateUser: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },

  deleteUser: (userId) => {
    return api.delete(`/users/${userId}`);
  },

  updateUserRole: (userId, role) => {
    return api.patch(`/users/${userId}/role`, { role });
  },

  fireUser: (userId, reason) => {
    return api.patch(`/users/${userId}/fire`, { reason });
  },

  getUserStats: (userId) => {
    return api.get(`/users/${userId}/stats`);
  },
};

import api from './api';

export const teamService = {
  // Admin only
  getTeams: () => {
    return api.get('/teams');
  },

  getTeamById: (teamId) => {
    return api.get(`/teams/${teamId}`);
  },

  createTeam: (teamData) => {
    return api.post('/teams', teamData);
  },

  updateTeam: (teamId, teamData) => {
    return api.put(`/teams/${teamId}`, teamData);
  },

  deleteTeam: (teamId) => {
    return api.delete(`/teams/${teamId}`);
  },

  getTeamAnalytics: () => {
    return api.get('/teams/stats/analytics');
  },

  // Both Admin and Members
  getTeamTasks: (teamId) => {
    return api.get(`/teams/${teamId}/tasks`);
  },

  // User specifically
  getMyTeams: () => {
    return api.get('/teams/user/my-teams');
  }
};

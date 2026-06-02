import api from './api';

export const taskService = {
  getTasks: (filters = {}) => {
    return api.get('/tasks', { params: filters });
  },

  getTaskById: (taskId) => {
    return api.get(`/tasks/${taskId}`);
  },

  createTask: (taskData) => {
    return api.post('/tasks', taskData);
  },

  updateTask: (taskId, taskData) => {
    return api.put(`/tasks/${taskId}`, taskData);
  },

  deleteTask: (taskId) => {
    return api.delete(`/tasks/${taskId}`);
  },

  uploadAttachment: (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteAttachment: (taskId, attachmentId) => {
    return api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
  },

  updateTaskStatus: (taskId, status) => {
    return api.patch(`/tasks/${taskId}/status`, { status });
  },

  startTask: (taskId) => {
    return api.post(`/tasks/${taskId}/start`);
  },

  submitProgressUpdate: (taskId, percentage, note, file) => {
    const formData = new FormData();
    formData.append('percentage', percentage);
    formData.append('note', note);
    if (file) {
      formData.append('file', file);
    }
    return api.post(`/tasks/${taskId}/progress`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  requestTaskReview: (taskId) => {
    return api.post(`/tasks/${taskId}/request-review`);
  },

  approveTask: (taskId) => {
    return api.post(`/tasks/${taskId}/approve`);
  },

  rejectTask: (taskId, feedback) => {
    return api.post(`/tasks/${taskId}/reject`, { feedback });
  },

  getTaskUpdates: (taskId) => {
    return api.get(`/tasks/${taskId}/updates`);
  },

  // New: Task Assignment Accept/Deny
  acceptTaskAssignment: (taskId) => {
    return api.post(`/tasks/${taskId}/accept`);
  },

  denyTaskAssignment: (taskId, reason) => {
    return api.post(`/tasks/${taskId}/deny`, { reason });
  },

  // New: Status Change Request and Approval
  requestStatusChange: (taskId, newStatus) => {
    return api.post(`/tasks/${taskId}/request-status-change`, { newStatus });
  },

  approveStatusChange: (taskId) => {
    return api.post(`/tasks/${taskId}/approve-status-change`);
  },

  rejectStatusChange: (taskId, feedback) => {
    return api.post(`/tasks/${taskId}/reject-status-change`, { feedback });
  },

  getPendingApprovals: () => {
    return api.get('/tasks/pending-approvals');
  },
};

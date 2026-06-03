import { create } from 'zustand';
import { taskService } from './taskService';
import { demoTaskStore } from './demoTaskStore';

const TASKS_STORAGE_KEY = 'task_suite_tasks';
const ACTIVITIES_STORAGE_KEY = 'task_suite_activities';

const isDemoToken = () => {
  const t = localStorage.getItem('token');
  return !t || t.startsWith('demo-token:');
};

const initialMockTasks = [];

const initialActivities = [
  { id: 1, text: 'Workspace session initialized successfully', time: 'Just now', color: '#13856f' }
];

const loadFromStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Failed to load key: ${key}`, e);
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save key: ${key}`, e);
  }
};

const mapApiTaskToStoreTask = (apiTask) => {
  if (!apiTask) return null;
  return {
    ...apiTask,
    id: apiTask._id,
    assignee: apiTask.assignedTo?.name || 'Unassigned',
    assigneeEmail: apiTask.assignedTo?.email || '',
    creatorName: apiTask.creator?.name || 'System',
    dueDate: apiTask.dueDate || new Date().toISOString().split('T')[0]
  };
};

export const useTaskStore = create((set, get) => ({
  tasks: [],
  taskUpdates: {},
  searchQuery: '',
  activities: loadFromStorage(ACTIVITIES_STORAGE_KEY, initialActivities),
  loading: false,
  error: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearchQuery: () => set({ searchQuery: '' }),

  // Fetch Tasks from Backend
  fetchTasks: async (filters = {}) => {
    set({ loading: true });
    try {
      if (isDemoToken()) throw new Error('demo');
      const res = await taskService.getTasks(filters);
      const mapped = res.data.map(mapApiTaskToStoreTask);
      set({ tasks: mapped, loading: false, error: null });
    } catch (e) {
      // fallback: load from demo store
      const currentUser = (() => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return null;
          const email = token.replace('demo-token:', '');
          const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
          return users.find(u => u.email === email) || null;
        } catch { return null; }
      })();
      const demoTasks = demoTaskStore.getTasks(currentUser);
      const mapped = demoTasks.map(t => ({ ...t, id: t._id, assignee: t.assignedToName || 'Unassigned' }));
      set({ tasks: mapped, loading: false, error: null });
    }
  },

  // Add Task
  addTask: async (taskData) => {
    set({ loading: true });
    try {
      if (isDemoToken()) throw new Error('demo');
      const res = await taskService.createTask({
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        progress: taskData.status === 'completed' ? 100 : (taskData.progress || 0),
        tags: taskData.tags || [],
        assignedToEmail: taskData.assigneeEmail,
        assignToAll: taskData.assignToAll
      });
      const newTask = mapApiTaskToStoreTask(res.data);
      const updatedTasks = [...get().tasks, newTask];
      const logActivity = { id: Date.now() + 1, text: `New task "${newTask.title}" created`, time: 'Just now', color: '#13856f' };
      const updatedActivities = [logActivity, ...get().activities];
      saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);
      set({ tasks: updatedTasks, activities: updatedActivities, loading: false, error: null });
    } catch (e) {
      // demo fallback
      const currentUser = (() => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return { id: 'admin', name: 'Admin', role: 'admin' };
          const email = token.replace('demo-token:', '');
          const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
          return users.find(u => u.email === email) || { id: 'admin', name: 'Admin', role: 'admin' };
        } catch { return { id: 'admin', name: 'Admin', role: 'admin' }; }
      })();
      const newTask = demoTaskStore.createTask({
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        tags: taskData.tags || [],
        assignedToEmail: taskData.assigneeEmail,
        assignToAll: taskData.assignToAll,
      }, currentUser);
      const mapped = { ...newTask, id: newTask._id, assignee: newTask.assignedToName || 'Unassigned' };
      const updatedTasks = [mapped, ...get().tasks];
      const logActivity = { id: Date.now(), text: `Task "${newTask.title}" created (demo)`, time: 'Just now', color: '#13856f' };
      const updatedActivities = [logActivity, ...get().activities];
      saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);
      set({ tasks: updatedTasks, activities: updatedActivities, loading: false, error: null });
    }
  },

  // Update Task
  updateTask: async (taskId, updatedFields) => {
    set({ loading: true });
    try {
      // Find current task in local store
      const localTask = get().tasks.find(t => t.id === taskId);
      if (!localTask) throw new Error('Task not found in store');

      // Prep update payload
      const payload = { ...updatedFields };
      if (updatedFields.assigneeEmail !== undefined) {
        payload.assignedToEmail = updatedFields.assigneeEmail;
      }
      if (updatedFields.assignToAll !== undefined) {
        payload.assignToAll = updatedFields.assignToAll;
      }

      // If comments were modified locally, preserve them
      if (updatedFields.comments) {
        payload.comments = updatedFields.comments;
      }

      const res = await taskService.updateTask(taskId, payload);
      const updated = mapApiTaskToStoreTask(res.data);

      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));

      if (updatedFields.status) {
        const logActivity = {
          id: Date.now(),
          text: `Task "${updated.title}" updated to status: ${updated.status.replace('_', ' ')}`,
          time: 'Just now',
          color: '#efbf91'
        };
        const updatedActivities = [logActivity, ...get().activities];
        saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);
        set({ activities: updatedActivities });
      }

      set({ tasks: updatedTasks, loading: false, error: null });
    } catch (e) {
      console.error('Failed to update task:', e);
      set({ error: e.message || 'Failed to update task', loading: false });
    }
  },

  // Delete Task
  deleteTask: async (taskId) => {
    set({ loading: true });
    try {
      if (isDemoToken()) throw new Error('demo');
      const taskToDelete = get().tasks.find((t) => t.id === taskId);
      await taskService.deleteTask(taskId);

      const updatedTasks = get().tasks.filter((t) => t.id !== taskId);

      if (taskToDelete) {
        const logActivity = {
          id: Date.now(),
          text: `Task "${taskToDelete.title}" was deleted`,
          time: 'Just now',
          color: '#8d514f'
        };
        const updatedActivities = [logActivity, ...get().activities];
        saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);
        set({ activities: updatedActivities });
      }

      set({ tasks: updatedTasks, loading: false, error: null });
      return { success: true };
    } catch (e) {
      try {
        const taskToDelete = get().tasks.find((t) => t.id === taskId);
        demoTaskStore.deleteTask(taskId);
        const updatedTasks = get().tasks.filter((t) => t.id !== taskId);
        const logActivity = {
          id: Date.now(),
          text: `Task "${taskToDelete?.title || 'Untitled task'}" was deleted (demo)`,
          time: 'Just now',
          color: '#8d514f'
        };
        const updatedActivities = [logActivity, ...get().activities];
        saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);
        set({ tasks: updatedTasks, activities: updatedActivities, loading: false, error: null });
        return { success: true };
      } catch (demoError) {
        console.error('Failed to delete task:', demoError);
        set({ error: demoError.message || 'Failed to delete task', loading: false });
        return { success: false, error: demoError.message };
      }
    }
  },

  // Add Comment
  addComment: async (taskId, commentText, userName = 'You') => {
    try {
      const localTask = get().tasks.find(t => t.id === taskId);
      if (!localTask) return;

      const newComment = {
        id: `comment-${Date.now()}`,
        user: userName,
        text: commentText,
        time: 'Just now'
      };

      const updatedComments = [...(localTask.comments || []), newComment];
      
      // Update comments via task update
      await get().updateTask(taskId, { comments: updatedComments });

      const logActivity = {
        id: Date.now(),
        text: `${userName} commented on "${localTask.title}"`,
        time: 'Just now',
        color: '#f3b59e'
      };
      const updatedActivities = [logActivity, ...get().activities];
      saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);
      set({ activities: updatedActivities });
    } catch (e) {
      console.error('Failed to add comment:', e);
    }
  },

  // Add Attachment
  addAttachment: async (taskId, fileObject) => {
    set({ loading: true });
    try {
      const res = await taskService.uploadAttachment(taskId, fileObject);
      const updatedTask = mapApiTaskToStoreTask(res.data.task);

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        loading: false,
        error: null
      }));
    } catch (e) {
      console.error('Failed to upload attachment:', e);
      set({ error: e.message || 'Failed to upload attachment', loading: false });
    }
  },

  // Delete Attachment
  deleteAttachment: async (taskId, attId) => {
    set({ loading: true });
    try {
      const res = await taskService.deleteAttachment(taskId, attId);
      const updatedTask = mapApiTaskToStoreTask(res.data.task);

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        loading: false,
        error: null
      }));
    } catch (e) {
      console.error('Failed to delete attachment:', e);
      set({ error: e.message || 'Failed to delete attachment', loading: false });
    }
  },

  // Start Task
  startTask: async (taskId) => {
    set({ loading: true });
    try {
      const res = await taskService.startTask(taskId);
      const updated = mapApiTaskToStoreTask(res.data);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));

      const logActivity = {
        id: Date.now(),
        text: `You started the task: "${updated.title}"`,
        time: 'Just now',
        color: '#13856f'
      };
      const updatedActivities = [logActivity, ...get().activities];
      saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);

      set({ tasks: updatedTasks, activities: updatedActivities, loading: false, error: null });
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to start task:', e);
      set({ error: e.message || 'Failed to start task', loading: false });
      return { success: false, error: e.message };
    }
  },

  // Submit Progress Update
  submitProgressUpdate: async (taskId, percentage, note, file) => {
    set({ loading: true });
    try {
      const res = await taskService.submitProgressUpdate(taskId, percentage, note, file);
      const updated = mapApiTaskToStoreTask(res.data.task);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));

      // Append to local activities feed
      const logActivity = {
        id: Date.now(),
        text: `Progress updated on "${updated.title}" to ${percentage}% - "${note}"`,
        time: 'Just now',
        color: '#efbf91'
      };
      const updatedActivities = [logActivity, ...get().activities];
      saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);

      // Re-fetch updates for this task to sync
      const updatesRes = await taskService.getTaskUpdates(taskId);

      set((state) => ({
        tasks: updatedTasks,
        activities: updatedActivities,
        taskUpdates: {
          ...state.taskUpdates,
          [taskId]: updatesRes.data
        },
        loading: false,
        error: null
      }));
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to submit progress update:', e);
      set({ error: e.message || 'Failed to submit progress update', loading: false });
      return { success: false, error: e.message };
    }
  },

  // Request Task Review
  requestTaskReview: async (taskId) => {
    set({ loading: true });
    try {
      const res = await taskService.requestTaskReview(taskId);
      const updated = mapApiTaskToStoreTask(res.data);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));

      const logActivity = {
        id: Date.now(),
        text: `You requested review for: "${updated.title}"`,
        time: 'Just now',
        color: '#8d514f'
      };
      const updatedActivities = [logActivity, ...get().activities];
      saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);

      set({ tasks: updatedTasks, activities: updatedActivities, loading: false, error: null });
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to request task review:', e);
      set({ error: e.message || 'Failed to request task review', loading: false });
      return { success: false, error: e.message };
    }
  },

  // Approve Task
  approveTask: async (taskId) => {
    set({ loading: true });
    try {
      const res = await taskService.approveTask(taskId);
      const updated = mapApiTaskToStoreTask(res.data);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));

      const logActivity = {
        id: Date.now(),
        text: `Task approved: "${updated.title}"`,
        time: 'Just now',
        color: '#13856f'
      };
      const updatedActivities = [logActivity, ...get().activities];
      saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);

      set({ tasks: updatedTasks, activities: updatedActivities, loading: false, error: null });
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to approve task:', e);
      set({ error: e.message || 'Failed to approve task', loading: false });
      return { success: false, error: e.message };
    }
  },

  // Reject Task
  rejectTask: async (taskId, feedback) => {
    set({ loading: true });
    try {
      const res = await taskService.rejectTask(taskId, feedback);
      const updated = mapApiTaskToStoreTask(res.data);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));

      const logActivity = {
        id: Date.now(),
        text: `Task rejected: "${updated.title}" with feedback`,
        time: 'Just now',
        color: '#8d514f'
      };
      const updatedActivities = [logActivity, ...get().activities];
      saveToStorage(ACTIVITIES_STORAGE_KEY, updatedActivities);

      set({ tasks: updatedTasks, activities: updatedActivities, loading: false, error: null });
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to reject task:', e);
      set({ error: e.message || 'Failed to reject task', loading: false });
      return { success: false, error: e.message };
    }
  },

  // Fetch Task Updates
  fetchTaskUpdates: async (taskId) => {
    try {
      const res = await taskService.getTaskUpdates(taskId);
      set((state) => ({
        taskUpdates: {
          ...state.taskUpdates,
          [taskId]: res.data
        }
      }));
      return res.data;
    } catch (e) {
      console.error('Failed to fetch task updates:', e);
      return [];
    }
  },

  // Accept task assignment
  acceptAssignment: async (taskId) => {
    set({ loading: true });
    try {
      const res = await taskService.acceptTaskAssignment(taskId);
      const updated = mapApiTaskToStoreTask(res.data);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));
      
      const logActivity = {
        id: Date.now(),
        text: `You accepted the task assignment: "${updated.title}"`,
        time: 'Just now',
        color: '#13856f'
      };
      set({ tasks: updatedTasks, activities: [logActivity, ...get().activities], loading: false, error: null });
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to accept assignment:', e);
      set({ error: e.message || 'Failed to accept assignment', loading: false });
      return { success: false, error: e.message };
    }
  },

  // Deny task assignment
  denyAssignment: async (taskId, reason) => {
    set({ loading: true });
    try {
      const res = await taskService.denyTaskAssignment(taskId, reason);
      const updated = mapApiTaskToStoreTask(res.data);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));
      
      const logActivity = {
        id: Date.now(),
        text: `You denied the task assignment: "${updated.title}". Reason: ${reason}`,
        time: 'Just now',
        color: '#8d514f'
      };
      set({ tasks: updatedTasks, activities: [logActivity, ...get().activities], loading: false, error: null });
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to deny assignment:', e);
      set({ error: e.message || 'Failed to deny assignment', loading: false });
      return { success: false, error: e.message };
    }
  },

  // Request status change
  requestStatusChange: async (taskId, newStatus) => {
    set({ loading: true });
    try {
      const res = await taskService.requestStatusChange(taskId, newStatus);
      const updated = mapApiTaskToStoreTask(res.data);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));
      
      const logActivity = {
        id: Date.now(),
        text: `You requested status change to "${newStatus}" for task: "${updated.title}"`,
        time: 'Just now',
        color: '#efbf91'
      };
      set({ tasks: updatedTasks, activities: [logActivity, ...get().activities], loading: false, error: null });
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to request status change:', e);
      set({ error: e.message || 'Failed to request status change', loading: false });
      return { success: false, error: e.message };
    }
  },

  // Approve status change (Admin only)
  approveStatusChange: async (taskId) => {
    set({ loading: true });
    try {
      const res = await taskService.approveStatusChange(taskId);
      const updated = mapApiTaskToStoreTask(res.data);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));
      
      const logActivity = {
        id: Date.now(),
        text: `You approved status change for task: "${updated.title}"`,
        time: 'Just now',
        color: '#13856f'
      };
      set({ tasks: updatedTasks, activities: [logActivity, ...get().activities], loading: false, error: null });
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to approve status change:', e);
      set({ error: e.message || 'Failed to approve status change', loading: false });
      return { success: false, error: e.message };
    }
  },

  // Reject status change (Admin only)
  rejectStatusChange: async (taskId, feedback) => {
    set({ loading: true });
    try {
      const res = await taskService.rejectStatusChange(taskId, feedback);
      const updated = mapApiTaskToStoreTask(res.data);
      const updatedTasks = get().tasks.map((t) => (t.id === taskId ? updated : t));
      
      const logActivity = {
        id: Date.now(),
        text: `You rejected status change for task: "${updated.title}". Feedback: ${feedback}`,
        time: 'Just now',
        color: '#8d514f'
      };
      set({ tasks: updatedTasks, activities: [logActivity, ...get().activities], loading: false, error: null });
      return { success: true, task: updated };
    } catch (e) {
      console.error('Failed to reject status change:', e);
      set({ error: e.message || 'Failed to reject status change', loading: false });
      return { success: false, error: e.message };
    }
  }
}));

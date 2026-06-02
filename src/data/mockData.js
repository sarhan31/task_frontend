export const mockTasks = [
  {
    id: 1,
    title: 'Design new landing page',
    description: 'Create a modern landing page design for the new product launch',
    status: 'in_progress',
    priority: 'high',
    assignee: 'John Doe',
    dueDate: '2024-03-15',
    createdAt: '2024-03-01',
    tags: ['design', 'ui/ux'],
  },
  {
    id: 2,
    title: 'Implement authentication',
    description: 'Add JWT authentication to the backend API',
    status: 'completed',
    priority: 'urgent',
    assignee: 'Jane Smith',
    dueDate: '2024-03-10',
    createdAt: '2024-02-28',
    tags: ['backend', 'security'],
  },
  {
    id: 3,
    title: 'Write documentation',
    description: 'Create comprehensive API documentation',
    status: 'todo',
    priority: 'medium',
    assignee: 'Bob Johnson',
    dueDate: '2024-03-20',
    createdAt: '2024-03-05',
    tags: ['documentation'],
  },
];

export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    avatar: null,
    status: 'active',
    tasksCompleted: 45,
    joinedDate: '2023-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    avatar: null,
    status: 'active',
    tasksCompleted: 32,
    joinedDate: '2023-02-20',
  },
];

export const mockDashboardStats = {
  totalTasks: 156,
  completedTasks: 89,
  inProgressTasks: 45,
  pendingTasks: 22,
  totalUsers: 24,
  activeUsers: 18,
  taskCompletionRate: 57,
  averageTaskTime: '3.5 days',
};

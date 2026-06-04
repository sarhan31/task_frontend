// Demo task store — mirrors the real API but uses localStorage
// Used automatically when the backend is unreachable (demo mode)

const TASKS_KEY = 'demo_tasks';
const USERS_KEY = 'demo_users';

// ─── helpers ────────────────────────────────────────────────────────────────

const readTasks = () => {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'); }
  catch { return []; }
};

const writeTasks = (tasks) =>
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

const readUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
};

const makeId = () => `demo-task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Resolve a user object by id or email from demo_users
const resolveUser = (idOrEmail) => {
  if (!idOrEmail) return null;
  const users = readUsers();
  return users.find(u => (u.id === idOrEmail || u.email === idOrEmail) && u.status !== 'fired') || null;
};

const resolveTeam = (teamId) => {
  if (!teamId) return null;
  try {
    const teams = JSON.parse(localStorage.getItem('demo_teams') || localStorage.getItem('teams') || '[]');
    return teams.find(t => t._id === teamId || t.id === teamId) || null;
  } catch {
    return null;
  }
};

const getUserTeamIds = (userId) => {
  if (!userId) return [];
  try {
    const teams = JSON.parse(localStorage.getItem('demo_teams') || localStorage.getItem('teams') || '[]');
    return teams
      .filter((team) =>
        (team.members || []).some((member) => {
          const memberId = typeof member === 'object' ? (member._id || member.id) : member;
          return memberId === userId;
        })
      )
      .map((team) => team._id || team.id)
      .filter(Boolean);
  } catch {
    return [];
  }
};

// ─── public API ─────────────────────────────────────────────────────────────

export const demoTaskStore = {

  // GET /tasks  — returns tasks visible to this user
  getTasks(currentUser) {
    const tasks = readTasks();
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return tasks;
    const userId = currentUser._id || currentUser.id;
    const teamIds = getUserTeamIds(userId);
    return tasks.filter(t =>
      t.assignedToAll ||
      t.assignedTo === userId ||
      t.creator === userId ||
      (t.assignedToTeam && teamIds.includes(t.assignedToTeam))
    );
  },

  // POST /tasks  — admin creates a task
  createTask(data, currentUser) {
    const tasks = readTasks();
    const isAll = data.assignToAll === true || data.assignToAll === 'true';

    let assignedUser = null;
    if (!isAll && data.assignedToEmail) {
      assignedUser = resolveUser(data.assignedToEmail);
    } else if (!isAll && data.assignedTo) {
      assignedUser = resolveUser(data.assignedTo);
    }

    const assignedTeam = !isAll ? resolveTeam(data.assignedToTeam) : null;
    const responsibleUser = !isAll ? resolveUser(data.responsibleUser) : null;
    const assignedToName = (() => {
      if (isAll) return 'All Members';
      if (data.assignedType === 'team_member' && data.assignedToTeam) {
        return `${responsibleUser?.name || data.responsibleUserName || 'Team Member'} (${assignedTeam?.teamName || data.assignedToTeamName || 'Team'})`;
      }
      if (data.assignedType === 'team' && data.assignedToTeam) {
        return assignedTeam?.teamName || data.assignedToTeamName || 'Team';
      }
      return assignedUser ? assignedUser.name : 'Unassigned';
    })();

    const task = {
      _id: makeId(),
      title: data.title,
      description: data.description || '',
      assignedTo: isAll ? null : (assignedUser ? (assignedUser._id || assignedUser.id) : null),
      assignedType: data.assignedType || 'individual',
      assignedToTeam: data.assignedToTeam || null,
      assignedToTeamName: assignedTeam?.teamName || data.assignedToTeamName || '',
      responsibleUser: data.responsibleUser || null,
      responsibleUserName: responsibleUser?.name || data.responsibleUserName || '',
      assignedToAll: isAll,
      assignedToName,
      priority: data.priority || 'medium',
      status: 'Assigned',
      assignmentStatus: 'pending',
      dueDate: data.dueDate,
      progress: 0,
      tags: data.tags || [],
      creator: currentUser.id,
      creatorName: currentUser.name,
      pendingStatusChange: null,
      activityTimeline: [
        { action: 'Task Created', details: `Created by ${currentUser.name}`, user: currentUser.name, date: new Date().toISOString() },
        { action: 'Task Assigned', details: assignedToName === 'Unassigned' ? 'Created without an assignee' : `Assigned to ${assignedToName}`, user: currentUser.name, date: new Date().toISOString() },
      ],
      createdAt: new Date().toISOString(),
    };

    writeTasks([task, ...tasks]);
    return task;
  },

  // POST /tasks/:id/accept
  acceptTask(taskId, currentUser) {
    const tasks = readTasks();
    const idx = tasks.findIndex(t => t._id === taskId);
    if (idx === -1) throw new Error('Task not found');

    const task = tasks[idx];
    const canAccept = task.assignedToAll || task.assignedTo === currentUser.id;
    if (!canAccept) throw new Error('This task is not assigned to you');
    if (task.assignmentStatus === 'accepted') throw new Error('Already accepted');

    tasks[idx] = {
      ...task,
      assignmentStatus: 'accepted',
      status: 'Accepted',
      assignedTo: task.assignedToAll && !task.assignedTo ? currentUser.id : task.assignedTo,
      assignedToName: task.assignedToAll && !task.assignedToName ? currentUser.name : task.assignedToName,
      activityTimeline: [
        ...(task.activityTimeline || []),
        { action: 'Task Accepted', details: `${currentUser.name} accepted the task`, user: currentUser.name, date: new Date().toISOString() },
      ],
    };

    writeTasks(tasks);
    return tasks[idx];
  },

  // POST /tasks/:id/deny
  denyTask(taskId, currentUser, reason) {
    const tasks = readTasks();
    const idx = tasks.findIndex(t => t._id === taskId);
    if (idx === -1) throw new Error('Task not found');

    const task = tasks[idx];
    const canDeny = task.assignedToAll || task.assignedTo === currentUser.id;
    if (!canDeny) throw new Error('This task is not assigned to you');

    tasks[idx] = {
      ...task,
      assignmentStatus: 'denied',
      status: 'Denied',
      denialReason: reason || 'No reason provided',
      activityTimeline: [
        ...(task.activityTimeline || []),
        { action: 'Task Denied', details: `${currentUser.name} denied: ${reason || 'No reason'}`, user: currentUser.name, date: new Date().toISOString() },
      ],
    };

    writeTasks(tasks);
    return tasks[idx];
  },

  // POST /tasks/:id/request-status-change
  requestStatusChange(taskId, currentUser, newStatus) {
    const tasks = readTasks();
    const idx = tasks.findIndex(t => t._id === taskId);
    if (idx === -1) throw new Error('Task not found');

    const task = tasks[idx];
    if (task.assignmentStatus !== 'accepted') throw new Error('Accept the task first');

    tasks[idx] = {
      ...task,
      pendingStatusChange: {
        newStatus,
        requestedBy: currentUser.id,
        requestedByName: currentUser.name,
        requestedAt: new Date().toISOString(),
        approved: false,
      },
      activityTimeline: [
        ...(task.activityTimeline || []),
        { action: 'Status Change Requested', details: `${currentUser.name} requested → "${newStatus}"`, user: currentUser.name, date: new Date().toISOString() },
      ],
    };

    writeTasks(tasks);
    return tasks[idx];
  },

  // GET /tasks/pending-approvals  — admin only
  getPendingApprovals() {
    return readTasks().filter(
      t => t.pendingStatusChange && !t.pendingStatusChange.approved
    );
  },

  // POST /tasks/:id/approve-status-change  — admin only
  approveStatusChange(taskId, currentUser) {
    const tasks = readTasks();
    const idx = tasks.findIndex(t => t._id === taskId);
    if (idx === -1) throw new Error('Task not found');

    const task = tasks[idx];
    if (!task.pendingStatusChange) throw new Error('No pending change');

    const newStatus = task.pendingStatusChange.newStatus;
    tasks[idx] = {
      ...task,
      status: newStatus,
      pendingStatusChange: null,
      activityTimeline: [
        ...(task.activityTimeline || []),
        { action: 'Status Approved', details: `Admin ${currentUser.name} approved → "${newStatus}"`, user: currentUser.name, date: new Date().toISOString() },
      ],
    };

    writeTasks(tasks);
    return tasks[idx];
  },

  // POST /tasks/:id/reject-status-change  — admin only
  rejectStatusChange(taskId, currentUser, feedback) {
    const tasks = readTasks();
    const idx = tasks.findIndex(t => t._id === taskId);
    if (idx === -1) throw new Error('Task not found');

    const task = tasks[idx];
    if (!task.pendingStatusChange) throw new Error('No pending change');

    tasks[idx] = {
      ...task,
      pendingStatusChange: null,
      activityTimeline: [
        ...(task.activityTimeline || []),
        { action: 'Status Rejected', details: `Admin ${currentUser.name} rejected. Feedback: ${feedback || 'None'}`, user: currentUser.name, date: new Date().toISOString() },
      ],
    };

    writeTasks(tasks);
    return tasks[idx];
  },

  // DELETE /tasks/:id  — admin only
  deleteTask(taskId) {
    const tasks = readTasks().filter(t => t._id !== taskId);
    writeTasks(tasks);
  },

  // Seed some demo tasks so the user sees something on first load
  seedIfEmpty(adminUser) {
    if (readTasks().length > 0) return;
    const seeds = [
      {
        _id: makeId(),
        title: 'Design Homepage Mockup',
        description: 'Create a modern homepage design with hero section and feature highlights.',
        assignedToAll: true,
        assignedTo: null,
        assignedToName: 'All Members',
        priority: 'high',
        status: 'Assigned',
        assignmentStatus: 'pending',
        dueDate: '2025-07-30',
        progress: 0,
        tags: ['design', 'ui'],
        creator: adminUser?.id || 'admin',
        creatorName: adminUser?.name || 'Admin',
        pendingStatusChange: null,
        activityTimeline: [],
        createdAt: new Date().toISOString(),
      },
      {
        _id: makeId(),
        title: 'Write API Documentation',
        description: 'Document all REST API endpoints with request/response examples.',
        assignedToAll: false,
        assignedTo: null,
        assignedToName: 'Unassigned',
        priority: 'medium',
        status: 'Assigned',
        assignmentStatus: 'pending',
        dueDate: '2025-08-15',
        progress: 0,
        tags: ['docs'],
        creator: adminUser?.id || 'admin',
        creatorName: adminUser?.name || 'Admin',
        pendingStatusChange: null,
        activityTimeline: [],
        createdAt: new Date().toISOString(),
      },
    ];
    writeTasks(seeds);
  },
};

import { format, formatDistanceToNow, isValid, parseISO, startOfDay } from 'date-fns';

/**
 * Format date to readable string
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return String(date);
  return format(dateObj, formatStr);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return String(date);
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

const COMPLETED_TASK_STATUSES = new Set(['completed', 'Completed', 'Approved']);

export const parseTaskDate = (date) => {
  if (!date || date === 'No due date') return null;

  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) ? parsed : null;
};

export const isTaskOverdue = (task, now = new Date()) => {
  if (!task) return false;
  if (COMPLETED_TASK_STATUSES.has(task.status)) return false;

  const dueDate = parseTaskDate(task.dueDate);
  if (!dueDate) return false;

  return startOfDay(dueDate).getTime() < startOfDay(now).getTime();
};

export const getTaskDueLabel = (task, now = new Date()) => {
  const dueDate = parseTaskDate(task?.dueDate);
  if (!dueDate) return task?.dueDate || '';

  const base = format(dueDate, 'MMM dd, yyyy');
  return isTaskOverdue(task, now) ? `${base} • Overdue` : base;
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

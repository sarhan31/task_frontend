import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flag,
  Hourglass,
  ListFilter,
  ListTodo,
  Loader2,
  RefreshCw,
  Rocket,
  SearchCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { demoTaskStore } from '@services/demoTaskStore';
import { taskService } from '@services/taskService';
import { useTaskStore } from '@services/taskStore';
import { cn } from '@utils/cn';
import toast from '@utils/toast';
import Button from "@components/ui/Button";

const isDemoToken = () => {
  const t = localStorage.getItem('token');
  return !t || t.startsWith('demo-token:');
};

const STATUS_COLOR = {
  Assigned: 'bg-blue-100 text-blue-700 border-blue-200',
  Accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Denied: 'bg-red-100 text-red-700 border-red-200',
  Started: 'bg-violet-100 text-violet-700 border-violet-200',
  'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
  'Pending Approval': 'bg-orange-100 text-orange-700 border-orange-200',
  'Under Review': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
};

const PRIORITY_DOT = {
  low: 'bg-slate-400',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

const PRIORITY_LABEL = {
  low: 'text-slate-500',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  urgent: 'text-red-600',
};

const STATUS_OPTIONS = [
  { value: 'Started', icon: Rocket, desc: 'Begin active execution on this task.' },
  { value: 'In Progress', icon: TrendingUp, desc: 'Share that work is actively underway.' },
  { value: 'Under Review', icon: SearchCheck, desc: 'Send the task for review and validation.' },
  { value: 'Completed', icon: CheckCircle2, desc: 'Mark the task ready for final confirmation.' },
];

const FILTER_TABS = [
  { value: 'all', label: 'All Tasks', icon: ListTodo },
  { value: 'pending', label: 'Pending', icon: Clock3 },
  { value: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { value: 'in-progress', label: 'In Progress', icon: TrendingUp },
  { value: 'completed', label: 'Completed', icon: CheckCircle },
];

const STATS_META = [
  {
    key: 'all',
    label: 'Total Tasks',
    note: 'Current workload',
    icon: ListTodo,
    color: 'bg-gradient-to-br from-[#13856f] to-[#1b9b82]',
  },
  {
    key: 'pending',
    label: 'Pending Tasks',
    note: 'Waiting for response',
    icon: Hourglass,
    color: 'bg-gradient-to-br from-[#ef9f51] to-[#e08934]',
  },
  {
    key: 'in-progress',
    label: 'In Progress',
    note: 'Execution underway',
    icon: TrendingUp,
    color: 'bg-gradient-to-br from-violet-500 to-indigo-600',
  },
  {
    key: 'completed',
    label: 'Completed Tasks',
    note: 'Delivered milestones',
    icon: CheckCircle2,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  },
];

const Overlay = ({ children, onClose }) => createPortal(
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  </AnimatePresence>,
  document.body
);

const StatCard = ({ icon: Icon, label, value, color, note }) => (
  <div className="rounded-[24px] border border-white/65 bg-white/88 p-5 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(90,55,20,0.12)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        <p className="mt-2 text-xs font-medium text-slate-500">{note}</p>
      </div>
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg shadow-black/5', color)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

const MyTasks = () => {
  const { user } = useAuth();
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [acceptTask, setAcceptTask] = useState(null);
  const [statusTask, setStatusTask] = useState(null);
  const [denyReason, setDenyReason] = useState('');
  const [showDenyForm, setShowDenyForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemoToken()) {
        demoTaskStore.seedIfEmpty(user);
        setTasks(demoTaskStore.getTasks(user));
      } else {
        const res = await taskService.getTasks();
        setTasks(res.data);
      }
    } catch {
      demoTaskStore.seedIfEmpty(user);
      setTasks(demoTaskStore.getTasks(user));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAccept = async () => {
    if (!acceptTask) return;
    setBusy(true);
    try {
      isDemoToken()
        ? demoTaskStore.acceptTask(acceptTask._id, user)
        : await taskService.acceptTaskAssignment(acceptTask._id);
      toast.success('Task accepted!');
      fetchTasks();
      setAcceptTask(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDeny = async () => {
    if (!denyReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    setBusy(true);
    try {
      isDemoToken()
        ? demoTaskStore.denyTask(acceptTask._id, user, denyReason)
        : await taskService.denyTaskAssignment(acceptTask._id, denyReason);
      toast.success('Task denied');
      fetchTasks();
      setAcceptTask(null);
      setShowDenyForm(false);
      setDenyReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const handleStatusRequest = async (newStatus) => {
    if (!statusTask) return;
    setBusy(true);
    try {
      isDemoToken()
        ? demoTaskStore.requestStatusChange(statusTask._id, user, newStatus)
        : await taskService.requestStatusChange(statusTask._id, newStatus);
      toast.success('Request sent - awaiting admin approval');
      fetchTasks();
      setStatusTask(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const filtered = tasks.filter((t) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      t.title?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.assignee?.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (filter === 'pending') return t.assignmentStatus === 'pending';
    if (filter === 'accepted') return t.assignmentStatus === 'accepted';
    if (filter === 'in-progress') return t.status === 'In Progress' || t.status === 'Started';
    if (filter === 'completed') return t.status === 'Completed';
    return true;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.assignmentStatus === 'pending').length,
    accepted: tasks.filter((t) => t.assignmentStatus === 'accepted').length,
    'in-progress': tasks.filter((t) => t.status === 'In Progress' || t.status === 'Started').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
  };

  return (
    <div className="relative z-10 space-y-6 pb-6">
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[30px] border border-white/65 bg-white/88 p-6 shadow-[0_8px_40px_rgba(90,55,20,0.12)] backdrop-blur-sm sm:p-7"
      >
        <div className="absolute left-0 top-7 bottom-7 w-1.5 rounded-full bg-[#13856f]" />
        <div className="pointer-events-none absolute right-8 top-4 h-32 w-32 rounded-full bg-[#efbf91]/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-28 h-24 w-24 rounded-full bg-[#13856f]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 pl-5 sm:pl-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#13856f]">
              Teammate Portal
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-slate-900 sm:text-[2rem]">
              My Active Backlog
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your assigned work, respond to new requests, and send polished progress updates while staying aligned with the workspace theme.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f6f2] px-3 py-1.5 text-xs font-semibold text-[#13856f]">
                <Sparkles className="h-3.5 w-3.5" />
                Personal task center
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff8ef] px-3 py-1.5 text-xs font-semibold text-[#b5722a]">
                <ListFilter className="h-3.5 w-3.5" />
                {counts.pending} awaiting response
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fdf0ef] px-3 py-1.5 text-xs font-semibold text-[#8d514f]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {counts.completed} completed
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="hidden rounded-[22px] border border-[#f4ddd0] bg-[#fffaf6] px-4 py-3 text-right shadow-sm md:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Workspace Pulse
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {counts['in-progress']} active in motion
              </p>
            </div>
            <Button variant="custom" size="none"
              onClick={fetchTasks}
              disabled={loading}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ead8cb] bg-white text-slate-600 shadow-sm transition hover:border-[#13856f]/30 hover:bg-[#e8f6f2] hover:text-[#13856f] active:scale-95 disabled:opacity-50"
              aria-label="Refresh tasks"
            >
              <RefreshCw className={cn('h-4.5 w-4.5', loading && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS_META.map((stat) => (
          <StatCard
            key={stat.key}
            icon={stat.icon}
            label={stat.label}
            value={counts[stat.key]}
            note={stat.note}
            color={stat.color}
          />
        ))}
      </div>

      <section className="rounded-[26px] border border-white/65 bg-white/72 p-3 shadow-[0_4px_24px_rgba(90,55,20,0.06)] backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = filter === tab.value;
            return (
              <Button variant="custom" size="none"
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-95',
                  isActive
                    ? 'border border-[#13856f] bg-[#13856f] text-white shadow-[0_6px_18px_rgba(19,133,111,0.24)]'
                    : 'border border-[#ead8cb] bg-white/95 text-slate-600 hover:border-[#13856f]/30 hover:bg-[#e8f6f2] hover:text-[#13856f]'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-bold',
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {counts[tab.value]}
                </span>
              </Button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-[28px] border border-white/60 bg-white/55 backdrop-blur-sm">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#13856f] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[#ead8cb] bg-white/50 px-6 py-20 text-center shadow-inner"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ead8cb]/60 bg-white shadow-sm">
            <CheckCircle className="h-8 w-8 text-[#13856f]" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-800">Clear Workspace</h3>
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
            {filter === 'all' ? 'No tasks are currently assigned to you.' : `No ${filter.replace('-', ' ')} tasks found.`}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((task, i) => {
            const hasPendingStatusChange = task.pendingStatusChange && task.pendingStatusChange.newStatus;
            const isCompleted = task.status === 'Completed' && task.assignmentStatus !== 'denied';

            return (
              <motion.article
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-[28px] border border-white/65 bg-white/92 shadow-[0_6px_28px_rgba(90,55,20,0.09)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(90,55,20,0.14)]"
              >
                <div
                  className={cn('h-1.5 w-full', {
                    'bg-slate-300': task.priority === 'low',
                    'bg-blue-400': task.priority === 'medium',
                    'bg-orange-400': task.priority === 'high',
                    'bg-red-500': task.priority === 'urgent',
                  })}
                />

                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#efbf91]/10 blur-3xl transition duration-300 group-hover:bg-[#efbf91]/20" />

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold', STATUS_COLOR[task.status] || 'border-gray-200 bg-gray-100 text-gray-700')}>
                          {task.status}
                        </span>
                        {task.assignedToAll && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700">
                            <Users className="h-3 w-3" />
                            Team task
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-bold leading-6 text-slate-900 transition-colors duration-200 group-hover:text-[#13856f]">
                        {task.title}
                      </h3>
                    </div>

                    {task.assignmentStatus === 'pending' && (
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 ring-1 ring-amber-200">
                        <AlertCircle className="h-4.5 w-4.5 text-amber-600" />
                      </span>
                    )}
                  </div>

                  <p className="mb-5 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-500">
                    {task.description || 'No description provided.'}
                  </p>

                  <div className="mb-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#f4ddd0] bg-[#fffaf6] px-3.5 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Priority
                      </p>
                      <div className={cn('mt-2 inline-flex items-center gap-2 text-sm font-semibold capitalize', PRIORITY_LABEL[task.priority])}>
                        <span className={cn('h-2.5 w-2.5 rounded-full', PRIORITY_DOT[task.priority])} />
                        {task.priority}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[#f4ddd0] bg-[#fffaf6] px-3.5 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Due Date
                      </p>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Calendar className="h-4 w-4 text-[#13856f]" />
                        {task.dueDate}
                      </div>
                    </div>
                  </div>

                  {hasPendingStatusChange && (
                    <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50/80 p-3.5 shadow-inner">
                      <div className="flex items-start gap-2">
                        <Hourglass className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                        <p className="text-xs leading-5 text-orange-900">
                          <span className="font-bold">Awaiting approval:</span>{' '}
                          Move to{' '}
                          <span className="rounded-md bg-orange-100 px-1.5 py-0.5 font-bold">
                            {task.pendingStatusChange.newStatus}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto">
                    {task.assignmentStatus === 'pending' && (
                      <Button variant="custom" size="none"
                        onClick={() => {
                          setAcceptTask(task);
                          setShowDenyForm(false);
                          setDenyReason('');
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#13856f] to-[#1b9b82] px-4 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(19,133,111,0.2)] transition hover:from-[#0f7260] hover:to-[#17856f] active:scale-[0.98]"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Review Assignment
                      </Button>
                    )}

                    {task.assignmentStatus === 'accepted' && !hasPendingStatusChange && !isCompleted && (
                      <Button variant="custom" size="none"
                        onClick={() => setStatusTask(task)}
                        className="flex w-full items-center gap-2 rounded-2xl border border-[#13856f]/70 bg-[#e8f6f2]/55 px-4 py-3 text-sm font-semibold text-[#13856f] transition hover:bg-[#e8f6f2] active:scale-[0.98]"
                      >
                        <TrendingUp className="h-4 w-4" />
                        Update Status
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    )}

                    {task.assignmentStatus === 'accepted' && hasPendingStatusChange && (
                      <div className="flex items-center justify-center gap-2 rounded-2xl border border-orange-200/80 bg-orange-50/80 px-4 py-3 text-xs font-bold text-orange-700">
                        <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                        Waiting for admin approval
                      </div>
                    )}

                    {task.assignmentStatus === 'denied' && (
                      <div className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
                        <X className="h-4 w-4" />
                        Task Denied
                      </div>
                    )}

                    {isCompleted && (
                      <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                        <CheckCircle className="h-4 w-4" />
                        Task Completed
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {acceptTask && (
        <Overlay
          onClose={() => {
            setAcceptTask(null);
            setShowDenyForm(false);
            setDenyReason('');
          }}
        >
          <div className="relative bg-gradient-to-br from-[#13856f] to-[#0f7260] px-6 py-5">
            <div className="absolute inset-0 bg-white/5 opacity-10" />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200">
                  System Command
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-white">
                  Review Task Assignment
                </h2>
              </div>
              <Button variant="custom" size="none"
                onClick={() => {
                  setAcceptTask(null);
                  setShowDenyForm(false);
                  setDenyReason('');
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="space-y-3 rounded-[24px] border border-[#ead8cb] bg-[#fffaf6] p-5 shadow-sm">
              <h3 className="font-display text-lg font-bold leading-snug text-slate-800">
                {acceptTask.title}
              </h3>
              <p className="text-sm leading-6 text-slate-500">
                {acceptTask.description || 'No description provided.'}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[#f4ddd0] pt-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Flag className="h-3.5 w-3.5 text-orange-500" />
                  Priority:
                  <strong className={cn('capitalize font-bold', PRIORITY_LABEL[acceptTask.priority])}>
                    {acceptTask.priority}
                  </strong>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Calendar className="h-3.5 w-3.5 text-[#13856f]" />
                  Due Date:
                  <strong className="font-bold text-slate-700">{acceptTask.dueDate}</strong>
                </span>
              </div>
            </div>

            {!showDenyForm ? (
              <>
                <p className="text-center text-sm leading-6 text-slate-500">
                  Accepting this task moves it into your active backlog so you can start sharing execution updates.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button variant="custom" size="none"
                    onClick={handleAccept}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#13856f] to-[#1b9b82] py-3.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(19,133,111,0.25)] transition hover:from-[#0f7260] hover:to-[#17856f] hover:shadow-[0_6px_16px_rgba(19,133,111,0.3)] active:scale-[0.98] disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Accept Task
                  </Button>
                  <Button variant="custom" size="none"
                    onClick={() => setShowDenyForm(true)}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50/40 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.98] disabled:opacity-60"
                  >
                    <X className="h-4 w-4" />
                    Deny Assignment
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Reason for Denial <span className="font-bold text-red-500">*</span>
                  </label>
                  <textarea
                    value={denyReason}
                    onChange={(e) => setDenyReason(e.target.value)}
                    placeholder="Provide a clear reason for rejecting this assignment."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all duration-200 placeholder:text-slate-400 focus:border-[#13856f] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#13856f]/30"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button variant="custom" size="none"
                    onClick={() => {
                      setShowDenyForm(false);
                      setDenyReason('');
                    }}
                    disabled={busy}
                    className="rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Back
                  </Button>
                  <Button variant="custom" size="none"
                    onClick={handleDeny}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98] disabled:opacity-60"
                  >
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Overlay>
      )}

      {statusTask && (
        <Overlay onClose={() => setStatusTask(null)}>
          <div className="relative bg-[#141b2e] px-6 py-5 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-wide text-white">
              Status Change Request
            </h2>
            <Button variant="custom" size="none"
              onClick={() => setStatusTask(null)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between rounded-[24px] border border-[#ead8cb] bg-[#fffaf6] px-5 py-4 shadow-sm">
              <span className="text-sm font-semibold text-slate-500">Current Status</span>
              <span className="rounded-xl bg-[#ccfbf1] px-3 py-1.5 text-xs font-bold text-[#115e59] border border-[#99f6e4]">
                {statusTask.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
              <p className="text-sm leading-relaxed text-blue-700/90">
                Your update request will be routed to the administrator and will appear on the task once approved.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Select target status</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {STATUS_OPTIONS.map((s) => {
                  const Icon = s.icon;
                  const isCurrent = s.value === statusTask.status;

                  return (
                    <Button variant="custom" size="none"
                      key={s.value}
                      onClick={() => handleStatusRequest(s.value)}
                      disabled={busy || isCurrent}
                      className={cn(
                        'flex flex-col items-start rounded-[24px] border p-5 text-left transition-all duration-200',
                        isCurrent
                          ? 'border-[#ead8cb]/50 bg-slate-50 opacity-60 cursor-not-allowed'
                          : 'border-[#ead8cb] bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:border-[#13856f]/40 hover:bg-[#fffaf6] hover:shadow-md cursor-pointer'
                      )}
                    >
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f8f9fa] text-[#13856f]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {s.label || s.value} {isCurrent && <span className="ml-1 text-[10px] font-normal text-slate-400">(Current)</span>}
                      </h4>
                      <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-slate-500">
                        {s.desc}
                      </p>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button variant="custom" size="none"
              onClick={() => setStatusTask(null)}
              disabled={busy}
              className="mt-2 w-full rounded-[20px] border border-gray-200 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-gray-50 focus:outline-none disabled:opacity-50"
            >
              Cancel Process
            </Button>
          </div>
        </Overlay>
      )}
    </div>
  );
};

export default MyTasks;

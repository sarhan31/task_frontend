import { useState, useEffect } from "react";
import {
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Check,
  Circle,
  MoreHorizontal,
  Flame,
  Star,
  Calendar,
  Users,
  Target,
  Paperclip,
  Bell,
  TimerReset,
  AlertTriangle,
  ShieldX,
  BadgeCheck,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@components/cards/StatCard";
import TaskChart from "@components/charts/TaskChart";
import { useAuth } from "@hooks/useAuth";
import { useTaskStore } from "@services/taskStore";
import { analyticsService } from "@services/analyticsService";
import Drawer from "@components/ui/Drawer";
import TaskForm from "@components/forms/TaskForm";
import { formatDate, isTaskOverdue } from "@utils/formatters";

const priorities = {
  high: { label: "High", cls: "bg-[#fdf0ef] text-[#8d514f] border-[#f4c5c1]" },
  medium: {
    label: "Medium",
    cls: "bg-[#fff8ef] text-[#b5722a] border-[#f0d9be]",
  },
  low: { label: "Low", cls: "bg-[#e8f6f2] text-[#13856f] border-[#b8e0d8]" },
};

const statuses = {
  completed: { label: "Done", dot: "#13856f" },
  in_progress: { label: "In Progress", dot: "#efbf91" },
  todo: { label: "To Do", dot: "#f3b59e" },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] },
});

const getHiredBackNoticeKey = (user) => {
  const userId = user?.id || user?._id || user?.email;
  if (!userId || !user?.rehiredAt) return null;

  return `hired_back_notice_seen:${userId}:${user.rehiredAt}`;
};

const UserDashboard = () => {
  const { user } = useAuth();
  const { tasks, addTask } = useTaskStore();
  
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getTaskAnalytics()
        ]);

        if (statsRes.data?.recentActivities) {
          const mapped = statsRes.data.recentActivities.map(act => {
            let icon = Check;
            let color = "#13856f";
            if (act.text.includes('started') || act.text.includes('Progress')) {
              icon = Flame;
              color = "#f3b59e";
            } else if (act.text.includes('assigned') || act.text.includes('new')) {
              icon = Star;
              color = "#efbf91";
            }
            return {
              id: act.id || act._id || Math.random().toString(),
              text: act.text,
              time: act.time,
              icon,
              color
            };
          });
          setActivities(mapped);
        }

        if (chartRes.data) {
          setChartData(chartRes.data);
        }
      } catch (err) {
        console.error('Failed to load user dashboard analytics:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // Derive dynamic metrics from user tasks list — support both legacy lowercase and capitalized backend statuses
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) =>
    ['completed', 'Completed', 'Approved'].includes(t.status)
  ).length;
  const inProgressTasks = tasks.filter((t) =>
    ['in_progress', 'In Progress', 'Started', 'Under Review'].includes(t.status)
  ).length;
  const todoTasks = tasks.filter((t) =>
    ['todo', 'Assigned', 'Accepted'].includes(t.status)
  ).length;
  const totalAttachments = tasks.reduce((sum, t) => sum + (t.attachments?.length || 0), 0);

  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const circ = 2 * Math.PI * 36;

  const statusGroups = {
    in_progress: ['in_progress', 'In Progress', 'Started', 'Under Review'],
    todo: ['todo', 'Assigned', 'Accepted'],
    completed: ['completed', 'Completed', 'Approved'],
  };

  const currentTasksFiltered = activeFilter === "all"
    ? tasks.slice(0, 5)
    : tasks.filter((t) =>
        statusGroups[activeFilter]?.includes(t.status)
      ).slice(0, 5);

  const handleCreateTask = (taskData) => {
    addTask({ ...taskData, assignee: user?.name || 'You', assigneeEmail: user?.email });
    setCreateOpen(false);
  };

  const [showHiredBackNotice, setShowHiredBackNotice] = useState(false);
  const isFired = user?.status === 'fired';
  const isHiredBack = !isFired && Boolean(user?.rehiredAt) && showHiredBackNotice;

  useEffect(() => {
    if (!user?.rehiredAt || user?.status === 'fired') {
      setShowHiredBackNotice(false);
      return undefined;
    }

    const noticeKey = getHiredBackNoticeKey(user);
    if (noticeKey && localStorage.getItem(noticeKey) === 'true') {
      setShowHiredBackNotice(false);
      return undefined;
    }

    if (noticeKey) {
      localStorage.setItem(noticeKey, 'true');
    }

    setShowHiredBackNotice(true);
    const timer = window.setTimeout(() => {
      setShowHiredBackNotice(false);
    }, 12000);

    return () => window.clearTimeout(timer);
  }, [user]);

  return (
    <div className="space-y-6 pb-6">
      {isFired && (
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[28px] border border-red-300 bg-gradient-to-br from-red-950 via-red-800 to-[#8d514f] p-6 text-white shadow-[0_18px_48px_rgba(127,29,29,0.35)]"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-red-300" />
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                <ShieldX className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-100">
                  Account Terminated
                </p>
                <h2 className="mt-2 font-display text-2xl font-black leading-tight">
                  Your access has been revoked by administration.
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-red-50">
                  This is a final notice. Your workspace status has changed to fired, and active task ownership has been removed.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    'Read the reason carefully.',
                    'Contact administration if clarification is needed.',
                    'Wait for admin action before resuming work.'
                  ].map((step) => (
                    <div key={step} className="rounded-2xl border border-white/15 bg-white/10 p-3">
                      <p className="text-xs font-bold leading-5 text-red-50">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/12 p-4 md:max-w-sm">
              <div className="mb-2 flex items-center gap-2 text-red-100">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">Reason</span>
              </div>
              <p className="text-sm font-semibold leading-6">
                {user?.firedReason || 'Administration did not provide a detailed reason.'}
              </p>
              {user?.firedAt && (
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-100">
                  Effective {new Date(user.firedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
      {isHiredBack && (
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-700 via-[#13856f] to-slate-900 p-6 text-white shadow-[0_18px_48px_rgba(19,133,111,0.28)]"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-emerald-200" />
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                <BadgeCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-100">
                  Access Restored
                </p>
                <h2 className="mt-2 font-display text-2xl font-black leading-tight">
                  You are hired back.
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50">
                  {user?.rehireMessage || 'Your account has been restored by administration. You can return to your workspace now.'}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    'Check your active tasks.',
                    'Reconnect with your admin or manager.',
                    'Resume work with the latest priorities.'
                  ].map((step) => (
                    <div key={step} className="rounded-2xl border border-white/15 bg-white/10 p-3">
                      <p className="text-xs font-bold leading-5 text-emerald-50">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/12 p-4 md:max-w-xs">
              <div className="mb-2 flex items-center gap-2 text-emerald-100">
                <RotateCcw className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">Restored</span>
              </div>
              <p className="text-sm font-semibold leading-6">
                Your previous fired notice is closed. Your current status is active again.
              </p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-100">
                Effective {new Date(user.rehiredAt).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <motion.div
            {...fadeUp(0)}
            className="relative overflow-hidden rounded-[28px] border border-white/65 bg-white/88 p-7 shadow-[0_8px_40px_rgba(90,55,20,0.12)] backdrop-blur-sm"
          >
            <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-full bg-[#13856f]" />
            <div className="absolute right-8 top-4 h-32 w-32 rounded-full bg-[#efbf91]/20 blur-2xl pointer-events-none" />
            <div className="absolute right-32 bottom-2 h-20 w-20 rounded-full bg-[#13856f]/10 blur-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-4 pl-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#13856f]">
                  {greeting()},
                </p>
                <h1 className="font-display mt-1 text-3xl font-bold text-slate-900 leading-tight">
                  {user?.name || "Welcome back"} 👋
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  You have{" "}
                  <span className="font-semibold text-[#13856f]">{todoTasks} tasks</span>{" "}
                  todo. Let’s keep momentum high.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 80 80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="#f4ddd0"
                      strokeWidth="7"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="#13856f"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      initial={{ strokeDashoffset: circ }}
                      animate={{ strokeDashoffset: circ - (circ * pct) / 100 }}
                      transition={{
                        duration: 1.2,
                        delay: 0.4,
                        ease: "easeOut",
                      }}
                    />
                  </svg>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800 leading-none">
                      {pct}%
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wide">
                      Done
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {user?.role === 'admin' && (
  <button
    onClick={() => setCreateOpen(true)}
    className="inline-flex items-center gap-2 rounded-2xl bg-[#13856f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(19,133,111,0.28)] transition hover:bg-[#0f7260] hover:shadow-[0_12px_32px_rgba(19,133,111,0.36)]"
  >
    <Plus className="h-4 w-4" />
    New Task
  </button>
)}
<div className="mt-5 flex flex-wrap gap-2 pl-6">
              {[
                {
                  label: `${todoTasks} To Do`,
                  bg: "bg-[#fdf0ef]",
                  text: "text-[#8d514f]",
                },
                {
                  label: `${inProgressTasks} In Progress`,
                  bg: "bg-[#fff8ef]",
                  text: "text-[#b5722a]",
                },
                {
                  label: `${completedTasks} Completed`,
                  bg: "bg-[#e8f6f2]",
                  text: "text-[#13856f]",
                },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${pill.bg} ${pill.text}`}
                >
                  {pill.label}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Total Tasks",
                value: totalTasks,
                icon: Target,
                color: "teal",
                trend: { positive: true, value: "Assigned tasks" },
                progress: Math.min(100, totalTasks * 10),
                subtitle: "Across all projects",
              },
              {
                title: "In Progress",
                value: inProgressTasks,
                icon: Clock,
                color: "amber",
                trend: { positive: true, value: "Active items" },
                progress: totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0,
                subtitle: "Active right now",
              },
              {
                title: "Completed",
                value: completedTasks,
                icon: TrendingUp,
                color: "peach",
                trend: { positive: true, value: `${pct}% rate` },
                progress: pct,
                subtitle: "Successfully closed",
              },
              {
                title: "Attachments",
                value: totalAttachments,
                icon: Paperclip,
                color: "rose",
                trend: { positive: true, value: "Shared resources" },
                progress: Math.min(100, totalAttachments * 20),
                subtitle: "Shared files",
              },
            ].map((card, i) => (
              <motion.div key={card.title} {...fadeUp(0.08 * i)}>
                <StatCard {...card} />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <motion.div
              {...fadeUp(0.18)}
              className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Weekly Overview
                  </p>
                  <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">
                    Productivity Chart
                  </h2>
                </div>
              </div>
              <TaskChart data={chartData.length ? chartData : [
                { name: "Mon", completed: 0, inProgress: 0, todo: 0 },
                { name: "Tue", completed: 0, inProgress: 0, todo: 0 }
              ]} />
            </motion.div>

            <motion.div
              {...fadeUp(0.24)}
              className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Current Progress
                  </p>
                  <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">
                    This Sprint
                  </h2>
                </div>
                <TimerReset className="h-4 w-4 text-[#13856f]" />
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Completed tasks",
                    value: `${completedTasks} / ${totalTasks}`,
                    width: `${pct}%`,
                    tone: "bg-[#13856f]",
                  },
                  {
                    label: "On-time delivery",
                    value: "92%",
                    width: "92%",
                    tone: "bg-[#efbf91]",
                  },
                  {
                    label: "Task execution rate",
                    value: `${pct}%`,
                    width: `${pct}%`,
                    tone: "bg-[#8d514f]",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">
                        {item.label}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#f4ddd0]">
                      <div
                        className={`h-full rounded-full ${item.tone}`}
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-[#fffaf6] p-4 border border-[#f4ddd0]">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Focus note
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  {pct >= 70
                    ? "Exceptional velocity! You have closed more than 70% of your current sprints. Maintain the flow."
                    : "Focus on closing your active in-progress items. Bringing your completion above 70% accelerates total team velocity."}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            {...fadeUp(0.3)}
            className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f4ddd0] px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Tasks
                </p>
                <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">
                  Current Tasks
                </h2>
              </div>

              <div className="flex gap-1.5">
                {[
                  { key: "all", label: "All" },
                  { key: "in_progress", label: "In Progress" },
                  { key: "todo", label: "To Do" },
                  { key: "completed", label: "Done" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeFilter === f.key
                        ? "bg-[#13856f] text-white shadow-[0_4px_12px_rgba(19,133,111,0.25)]"
                        : "border border-[#e6d6ca] text-slate-500 hover:border-[#13856f] hover:text-[#13856f]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#f4ddd0]">
              {currentTasksFiltered.length > 0 ? (
                currentTasksFiltered.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.34 + i * 0.06, duration: 0.3 }}
                    className="flex flex-col gap-4 px-6 py-4 transition-colors hover:bg-[#fffaf6] md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: (statuses[task.status] || statuses.todo).dot }}
                        />
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {task.title}
                        </p>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${(priorities[task.priority] || priorities.medium).cls}`}
                        >
                          {(priorities[task.priority] || priorities.medium).label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className={`inline-flex items-center gap-1 ${isTaskOverdue(task) ? 'font-semibold text-rose-600' : ''}`}>
                          {isTaskOverdue(task) ? <AlertTriangle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                          {formatDate(task.dueDate)}
                          {isTaskOverdue(task) && (
                            <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                              Overdue
                            </span>
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Paperclip className="h-3.5 w-3.5" /> {task.attachments?.length || 0} files
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {task.assignee}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#fffaf6] px-3 py-1 text-xs font-semibold text-slate-600 border border-[#f4ddd0]">
                        {(statuses[task.status] || statuses.todo).label}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-400 py-8">No matching tasks active.</p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div
            {...fadeUp(0.14)}
            className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Profile
                </p>
                <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">
                  Personal Panel
                </h2>
              </div>
              <Bell className="h-4 w-4 text-[#13856f]" />
            </div>

            <div className="rounded-2xl border border-[#f4ddd0] bg-[#fffaf6] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8d514f] text-white text-lg font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    Role: {user?.role || "standard"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Total", value: totalTasks },
                { label: "Done", value: completedTasks },
                { label: "Due", value: todoTasks },
                { label: "Files", value: totalAttachments },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#f4ddd0] bg-white p-3 text-center"
                >
                  <p className="text-lg font-bold text-slate-800">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.22)}
            className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Recent
                </p>
                <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">
                  Activity
                </h2>
              </div>
              <TrendingUp className="h-4 w-4 text-[#13856f]" />
            </div>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.28 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: item.color + "18" }}
                    >
                      <item.icon
                        className="h-4 w-4"
                        style={{ color: item.color }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs leading-5 text-slate-700">
                        {item.text}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {item.time}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No recent activities.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Drawer isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Task" size="lg">
        <TaskForm onSave={handleCreateTask} onCancel={() => setCreateOpen(false)} />
      </Drawer>
    </div>
  );
};

export default UserDashboard;

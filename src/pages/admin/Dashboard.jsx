import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckSquare,
  TrendingUp,
  Activity,
  Search,
  Bell,
  UserPlus,
  ClipboardCheck,
  Clock3,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import StatCard from "@components/cards/StatCard";
import TaskChart from "@components/charts/TaskChart";
import { useTaskStore } from "@services/taskStore";
import { analyticsService } from "@services/analyticsService";
import { useAuth } from "@hooks/useAuth";
import { formatDate, isTaskOverdue } from "@utils/formatters";
import { getTaskAssigneeLabel } from "@utils/taskAssignment";

const statusClasses = {
  Assigned: "bg-[#fdf0ef] text-warm border-[#f4c5c1]",
  assigned: "bg-[#fdf0ef] text-warm border-[#f4c5c1]",
  Accepted: "bg-surface-hover text-warm-accent border-warm-pale",
  accepted: "bg-surface-hover text-warm-accent border-warm-pale",
  Started: "bg-surface-hover text-warm-accent border-warm-pale",
  started: "bg-surface-hover text-warm-accent border-warm-pale",
  Rejected: "bg-[#fdf0ef] text-warm border-[#f4c5c1]",
  rejected: "bg-[#fdf0ef] text-warm border-[#f4c5c1]",
  Denied: "bg-[#fdf0ef] text-warm border-[#f4c5c1]",
  denied: "bg-[#fdf0ef] text-warm border-[#f4c5c1]",
  completed: "bg-brand-light text-brand border-brand-muted",
  Completed: "bg-brand-light text-brand border-brand-muted",
  in_progress: "bg-surface-hover text-warm-accent border-warm-pale",
  "In Progress": "bg-surface-hover text-warm-accent border-warm-pale",
  todo: "bg-[#fdf0ef] text-warm border-[#f4c5c1]",
  Pending: "bg-[#fdf0ef] text-warm border-[#f4c5c1]",
  in_review: "bg-surface-muted text-[#c26a44] border-[#f1d3c7]",
  "In Review": "bg-surface-muted text-[#c26a44] border-[#f1d3c7]",
};

const priorityClasses = {
  urgent: "text-warm",
  Urgent: "text-warm",
  high: "text-[#c26a44]",
  High: "text-[#c26a44]",
  medium: "text-warm-accent",
  Medium: "text-warm-accent",
  low: "text-brand",
  Low: "text-brand"
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] },
});

const isNonAdminContributor = (member) => (member?.role || "").toLowerCase() !== "admin";
const sortContributors = (items = []) =>
  [...items].sort((a, b) => {
    const taskDelta = (b.tasksCount || 0) - (a.tasksCount || 0);
    if (taskDelta !== 0) return taskDelta;
    return (a.name || "").localeCompare(b.name || "");
  });
const normalizeTask = (task) => {
  const title = task?.title || task?.task || "Untitled task";
  const assignee = getTaskAssigneeLabel(task);
  const progressRaw = task?.progressPercentage ?? task?.progress;
  const status = task?.status || "Assigned";

  return {
    ...task,
    title,
    assignee,
    status,
    priority: task?.priority || "medium",
    progress: Number.isFinite(Number(progressRaw))
      ? Number(progressRaw)
      : (['Completed', 'completed', 'Approved'].includes(status) ? 100 : 0),
    dueDate: task?.dueDate || "No due date",
    attachmentCount: task?.attachments?.length || 0,
  };
};
const formatStatusLabel = (status) =>
  String(status || "Assigned")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
const formatPriorityLabel = (priority) =>
  String(priority || "medium").replace(/\b\w/g, (char) => char.toUpperCase());

const AdminDashboard = () => {
  const { user } = useAuth();
  const { tasks } = useTaskStore();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    totalUsers: 0,
    activeUsers: 0,
    taskCompletionRate: 0,
    activeUserRatio: 75,
    resolvedAlerts: 91
  });
  
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartRes, contributorsRes] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getTaskAnalytics(),
          analyticsService.getUserAnalytics()
        ]);

        const userContributors = (contributorsRes.data || []).filter(isNonAdminContributor);
        const orderedContributors = sortContributors(userContributors);

        if (statsRes.data?.stats) {
          setStats(prev => ({
            ...prev,
            ...statsRes.data.stats,
            taskCompletionRate: statsRes.data.stats.completionRate || 0,
            // Grab total/active users dynamically or from system contributors res
            totalUsers: orderedContributors.length || statsRes.data.stats.totalUsers || 0,
            activeUsers: orderedContributors.filter(c => c.tasksCount > 0).length || statsRes.data.stats.activeUsers || 0,
          }));
        }

        if (statsRes.data?.recentActivities) {
          const mappedActivities = statsRes.data.recentActivities.map(act => {
            let icon = UserPlus;
            let tone = "bg-brand-light text-brand";
            if (act.text.includes('task') || act.text.includes('assignment')) {
              icon = ClipboardCheck;
              tone = "bg-surface-hover text-warm-accent";
            } else if (act.text.includes('analytics') || act.text.includes('report')) {
              icon = BarChart3;
              tone = "bg-[#fdf0ef] text-warm";
            }
            return {
              id: act.id || act._id || Math.random().toString(),
              title: act.text,
              time: act.time,
              icon,
              tone
            };
          });
          setActivities(mappedActivities);
        } else {
          setActivities([
            { id: 1, title: "Database reporting pipeline loaded", time: "Just now", icon: ShieldCheck, tone: "bg-brand-light text-brand" }
          ]);
        }

        if (chartRes.data) {
          setChartData(chartRes.data);
        }

        if (contributorsRes.data) {
          setContributors(orderedContributors);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard stats:', err);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter tasks based on Search box
  const recentTasksFiltered = tasks
    .map(normalizeTask)
    .filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <motion.div
            {...fadeUp(0)}
            className="relative overflow-hidden rounded-[28px] border border-white/65 bg-white/88 p-7 shadow-[0_8px_40px_rgba(90,55,20,0.12)] backdrop-blur-sm"
          >
            <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-full bg-brand" />
            <div className="pointer-events-none absolute right-6 top-6 h-28 w-28 rounded-full bg-warm-light/20 blur-2xl" />
            <div className="pointer-events-none absolute right-24 bottom-1 h-20 w-20 rounded-full bg-brand/10 blur-2xl" />

            <div className="flex flex-col gap-5 pl-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
                  Admin overview
                </p>
                <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-slate-900">
                  Command center for your workspace
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Monitor users, task performance, and daily operations from one
                  premium control panel.
                </p>
              </div>

              <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row lg:w-auto">
                <div className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-sm sm:min-w-[220px]">
                  <Search className="h-4 w-4 text-brand" />
                  <input
                    type="text"
                    placeholder="Search users or tasks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 pl-6">
              {[
                {
                  label: `${stats.activeUsers} Active Users`,
                  cls: "bg-brand-light text-brand",
                },
                {
                  label: `${stats.pendingTasks} Pending Reviews`,
                  cls: "bg-surface-hover text-warm-accent",
                },
                { label: "Platform Secure", cls: "bg-[#fdf0ef] text-warm" },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${pill.cls}`}
                >
                  {pill.label}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Total Users",
                value: stats.totalUsers,
                icon: Users,
                color: "teal",
                trend: { value: "Registered accounts", positive: true },
                subtitle: "Across all teams",
                progress: Math.min(100, stats.totalUsers * 10),
              },
              {
                title: "Total Tasks",
                value: stats.totalTasks,
                icon: CheckSquare,
                color: "amber",
                trend: { value: "MongoDB Sync active", positive: true },
                subtitle: "Tracked in system",
                progress: Math.min(100, stats.totalTasks * 5),
              },
              {
                title: "Completed",
                value: stats.completedTasks,
                icon: TrendingUp,
                color: "peach",
                trend: { value: `${stats.taskCompletionRate}% rate`, positive: true },
                subtitle: "Closed successfully",
                progress: stats.taskCompletionRate,
              },
              {
                title: "Pending Tasks",
                value: stats.pendingTasks,
                icon: Clock3,
                color: "rose",
                trend: { value: "Needs attention", positive: false },
                subtitle: "Awaiting action",
                progress: stats.totalTasks > 0 ? Math.round((stats.pendingTasks / stats.totalTasks) * 100) : 0,
              },
            ].map((card, index) => (
              <motion.div key={card.title} {...fadeUp(0.08 * (index + 1))}>
                <StatCard {...card} />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <motion.div
              {...fadeUp(0.18)}
              className="min-w-0 overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Analytics
                  </p>
                  <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                    Task Performance
                  </h2>
                </div>
              </div>
              <TaskChart data={chartData.length ? chartData : [
                { name: "Jan", completed: 0, inProgress: 0, todo: 0 },
                { name: "Feb", completed: 0, inProgress: 0, todo: 0 }
              ]} />
            </motion.div>

            <motion.div
              {...fadeUp(0.24)}
              className="min-w-0 overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Progress
                  </p>
                  <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                    System Health
                  </h2>
                </div>
                <ShieldCheck className="h-5 w-5 text-brand" />
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Completion rate",
                    value: `${stats.taskCompletionRate}%`,
                    width: `${stats.taskCompletionRate}%`,
                    tone: "bg-brand",
                  },
                  {
                    label: "Active user ratio",
                    value: `${stats.activeUserRatio}%`,
                    width: `${stats.activeUserRatio}%`,
                    tone: "bg-warm-light",
                  },
                  {
                    label: "Resolved alerts",
                    value: `${stats.resolvedAlerts}%`,
                    width: `${stats.resolvedAlerts}%`,
                    tone: "bg-warm",
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
                    <div className="h-2 w-full overflow-hidden rounded-full bg-border-light">
                      <div
                        className={`h-full rounded-full ${item.tone}`}
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-border-light bg-surface-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Quick insight
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Platform integration fully validated. Task metrics are synchronized directly with your MongoDB database collections.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            {...fadeUp(0.3)}
            className="min-w-0 overflow-hidden rounded-[24px] border border-white/65 bg-white/88 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-light px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Operations
                </p>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                  Recent Task Table
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              {recentTasksFiltered.length > 0 ? (
                <table className="min-w-full divide-y divide-border-light text-left">
                  <thead className="bg-surface-card">
                    <tr className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      <th className="px-6 py-4 font-semibold">Task</th>
                      <th className="px-6 py-4 font-semibold">Assignee</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Priority</th>
                      <th className="px-6 py-4 font-semibold">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light bg-white/60">
                    {recentTasksFiltered.map((task) => (
                      <tr
                        key={task.id}
                        className="transition-colors hover:bg-surface-card"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800">
                            {task.title}
                          </p>
                          <p className={`mt-1 inline-flex items-center gap-1 text-xs ${isTaskOverdue(task) ? 'font-semibold text-rose-600' : 'text-slate-400'}`}>
                            {isTaskOverdue(task) ? <AlertTriangle className="h-3.5 w-3.5" /> : null}
                            Due {formatDate(task.dueDate)}
                            {isTaskOverdue(task) && (
                              <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                Overdue
                              </span>
                            )}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {task.assignee}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[task.status] || statusClasses.todo}`}
                          >
                            {formatStatusLabel(task.status)}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 text-sm font-semibold ${priorityClasses[task.priority] || priorityClasses.medium}`}
                        >
                          {formatPriorityLabel(task.priority)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-28 overflow-hidden rounded-full bg-border-light">
                              <div
                                className="h-full rounded-full bg-brand"
                                style={{ width: `${Math.max(0, Math.min(100, task.progress))}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-600">
                              {Math.max(0, Math.min(100, task.progress))}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-xs text-slate-400 py-8">No tasks recorded in database yet.</p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.aside {...fadeUp(0.14)} className="min-w-0 space-y-4">
          <div className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Profile
                </p>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                  Admin Panel
                </h2>
              </div>
              <Bell className="h-4 w-4 text-brand" />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border-light bg-surface-card p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {user?.name || "Admin Workspace"}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || "Full access permissions"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Total Tasks", value: stats.totalTasks },
                { label: "Completed", value: stats.completedTasks },
                { label: "In Progress", value: stats.inProgressTasks },
                { label: "Reviews", value: stats.pendingTasks },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border-light bg-white p-3 text-center"
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
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Updates
                </p>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                  Recent Activity
                </h2>
              </div>
              <Activity className="h-4 w-4 text-brand" />
            </div>

            <div className="space-y-3.5">
              {activities.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${item.tone}`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-5 text-slate-700">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Users
                </p>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                  Top Contributors
                </h2>
              </div>
              <Users className="h-4 w-4 text-brand" />
            </div>
            <div className="space-y-3">
              {contributors.length > 0 ? (
                contributors.map((member, index) => (
                  <div
                    key={member.id || member._id}
                    className="flex items-center gap-3 rounded-2xl border border-border-light bg-surface-card p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm text-sm font-semibold text-white">
                      {member.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {member.name}
                      </p>
                      <p className="truncate text-xs capitalize text-slate-500">
                        {member.role || 'User'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-brand">
                      {member.tasksCount} tasks
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No team contributors active.</p>
              )}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default AdminDashboard;

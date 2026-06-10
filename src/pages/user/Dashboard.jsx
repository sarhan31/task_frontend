import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  TrendingUp,
  Plus,
  Target,
  Paperclip,
  Bell,
  AlertTriangle,
  ShieldX,
  BadgeCheck,
  RotateCcw,
  Flame,
  AlertCircle,
  FileCheck
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@components/cards/StatCard";
import { useAuth } from "@hooks/useAuth";
import { useTaskStore } from "@services/taskStore";
import { analyticsService } from "@services/analyticsService";
import { teamService } from "@services/teamService";
import Drawer from "@components/ui/Drawer";
import TaskForm from "@components/forms/TaskForm";
import { formatDate, isTaskOverdue } from "@utils/formatters";
import Button from "@components/ui/Button";

// New Components
import DeadlineCard from "@components/ui/DeadlineCard";
import ResponsibilityCard from "@components/ui/ResponsibilityCard";
import ActivityTimeline from "@components/ui/ActivityTimeline";

const priorities = {
  high: { label: "High", cls: "bg-[#fdf0ef] text-warm border-[#f4c5c1]" },
  medium: { label: "Medium", cls: "bg-surface-hover text-warm-accent border-warm-pale" },
  low: { label: "Low", cls: "bg-brand-light text-brand border-brand-muted" },
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
  const { tasks, addTask, activities } = useTaskStore();
  
  const [teams, setTeams] = useState([]);
  const [activeTaskTab, setActiveTaskTab] = useState("myTasks"); // 'myTasks' or 'teamTasks'
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const teamsRes = await teamService.getMyTeams();
        setTeams(teamsRes.data);
      } catch (err) {
        console.error('Failed to load user teams:', err);
      }
    };
    fetchDashboardData();
  }, []);

  const [showHiredBackNotice, setShowHiredBackNotice] = useState(false);
  const isFired = user?.status === 'fired';
  const isHiredBack = !isFired && Boolean(user?.rehiredAt) && showHiredBackNotice;

  useEffect(() => {
    if (!user?.rehiredAt || user?.status === 'fired') {
      setShowHiredBackNotice(false);
      return;
    }
    const noticeKey = getHiredBackNoticeKey(user);
    if (noticeKey && localStorage.getItem(noticeKey) === 'true') {
      setShowHiredBackNotice(false);
      return;
    }
    if (noticeKey) localStorage.setItem(noticeKey, 'true');
    setShowHiredBackNotice(true);
    const timer = window.setTimeout(() => setShowHiredBackNotice(false), 12000);
    return () => window.clearTimeout(timer);
  }, [user]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // Task Classification
  const myTasks = useMemo(() => tasks.filter(t => t.assignedType !== 'team' && t.assignedType !== 'team_member' && !t.assignedToAll), [tasks]);
  const teamTasks = useMemo(() => tasks.filter(t => t.assignedType === 'team' || t.assignedType === 'team_member' || t.assignedToAll), [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => ['completed', 'Completed', 'Approved'].includes(t.status)).length;
  const inProgressTasks = tasks.filter((t) => ['in_progress', 'In Progress', 'Started', 'Under Review'].includes(t.status)).length;
  const todoTasks = tasks.filter((t) => ['todo', 'Assigned', 'Accepted'].includes(t.status)).length;
  const totalAttachments = tasks.reduce((sum, t) => sum + (t.attachments?.length || 0), 0);
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const circ = 2 * Math.PI * 36;

  // Responsibilities
  const highPriorityTasks = useMemo(() => myTasks.filter(t => (t.priority === 'high' || t.priority === 'urgent') && !['completed', 'Approved', 'Completed'].includes(t.status)), [myTasks]);
  const dueSoonTasks = useMemo(() => myTasks.filter(t => {
    if (!t.dueDate || ['completed', 'Approved', 'Completed'].includes(t.status)) return false;
    const days = (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= -1 && days <= 3; // overdue by 1 day or due in 3 days
  }), [myTasks]);
  const reviewTasks = useMemo(() => myTasks.filter(t => ['under_review', 'Under Review', 'in_review'].includes(t.status)), [myTasks]);

  // Deadlines (All active tasks sorted by due date)
  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter(t => t.dueDate && !['completed', 'Approved', 'Completed'].includes(t.status))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  const displayedTasks = activeTaskTab === "myTasks" ? myTasks.slice(0, 10) : teamTasks.slice(0, 10);

  const handleCreateTask = (taskData) => {
    addTask({ ...taskData, assignee: user?.name || 'You', assigneeEmail: user?.email });
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Notices */}
      {isFired && (
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] border border-red-300 bg-gradient-to-br from-red-950 via-red-800 to-warm p-6 text-white shadow-[0_18px_48px_rgba(127,29,29,0.35)]"
        >
          {/* Fired logic ... (unchanged structure) */}
          <div className="absolute inset-x-0 top-0 h-1 bg-red-300" />
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                <ShieldX className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-100">Account Terminated</p>
                <h2 className="mt-2 font-display text-2xl font-black leading-tight">Your access has been revoked by administration.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-red-50">This is a final notice. Your workspace status has changed to fired, and active task ownership has been removed.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        
        {/* Left Column - Core Dash */}
        <div className="min-w-0 space-y-6">
          {/* Welcome Banner */}
          <motion.div
            {...fadeUp(0)}
            className="relative overflow-hidden rounded-[28px] border border-white/65 bg-white/88 p-7 shadow-[0_8px_40px_rgba(90,55,20,0.12)] backdrop-blur-sm"
          >
            <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-full bg-brand" />
            <div className="absolute right-8 top-4 h-32 w-32 rounded-full bg-warm-light/20 blur-2xl pointer-events-none" />
            <div className="flex flex-wrap items-center justify-between gap-4 pl-6">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">{greeting()},</p>
                <h1 className="font-display mt-1 text-3xl font-bold text-slate-900 leading-tight">{user?.name || "Welcome back"} 👋</h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  You have <span className="font-semibold text-brand">{todoTasks} tasks</span> todo.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="#f4ddd0" strokeWidth="7" />
                    <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#13856f" strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - (circ * pct) / 100 }} transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }} />
                  </svg>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800 leading-none">{pct}%</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wide">Done</p>
                  </div>
                </div>
              </div>
            </div>
            {user?.role === 'admin' && (
              <Button variant="custom" size="none" onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(19,133,111,0.28)] transition hover:bg-brand-dark mt-4 ml-6">
                <Plus className="h-4 w-4" /> New Task
              </Button>
            )}
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Tasks" value={totalTasks} icon={Target} color="teal" trend={{ positive: true, value: "Assigned tasks" }} progress={Math.min(100, totalTasks * 10)} subtitle="Across all projects" />
            <StatCard title="In Progress" value={inProgressTasks} icon={Clock} color="amber" trend={{ positive: true, value: "Active items" }} progress={totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0} subtitle="Active right now" />
            <StatCard title="Completed" value={completedTasks} icon={TrendingUp} color="peach" trend={{ positive: true, value: `${pct}% rate` }} progress={pct} subtitle="Successfully closed" />
            <StatCard title="Attachments" value={totalAttachments} icon={Paperclip} color="rose" trend={{ positive: true, value: "Shared resources" }} progress={Math.min(100, totalAttachments * 20)} subtitle="Shared files" />
          </div>

          {/* My Responsibilities */}
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div {...fadeUp(0.1)}>
              <ResponsibilityCard title="High Priority" icon={Flame} count={highPriorityTasks.length} tasks={highPriorityTasks} colorClass="text-rose-600" bgClass="bg-rose-100" />
            </motion.div>
            <motion.div {...fadeUp(0.15)}>
              <ResponsibilityCard title="Due Soon" icon={AlertCircle} count={dueSoonTasks.length} tasks={dueSoonTasks} colorClass="text-amber-600" bgClass="bg-amber-100" linkTo="/dashboard/tasks" />
            </motion.div>
            <motion.div {...fadeUp(0.2)}>
              <ResponsibilityCard title="Awaiting Review" icon={FileCheck} count={reviewTasks.length} tasks={reviewTasks} colorClass="text-brand" bgClass="bg-brand-light" />
            </motion.div>
          </div>

          {/* Task Lists (My Tasks / Team Tasks) */}
          <motion.div {...fadeUp(0.25)} className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-light px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Classification</p>
                <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">Task Board</h2>
              </div>
              <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
                <button onClick={() => setActiveTaskTab('myTasks')} className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${activeTaskTab === 'myTasks' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  My Tasks ({myTasks.length})
                </button>
                <button onClick={() => setActiveTaskTab('teamTasks')} className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${activeTaskTab === 'teamTasks' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  Team Tasks ({teamTasks.length})
                </button>
              </div>
            </div>
            <div className="divide-y divide-border-light">
              {displayedTasks.length > 0 ? (
                displayedTasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-4 px-6 py-4 transition-colors hover:bg-surface-card md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: (statuses[task.status] || statuses.todo).dot }} />
                        <p className="truncate text-sm font-semibold text-slate-800">{task.title}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span className={`inline-flex items-center gap-1 ${isTaskOverdue(task) ? 'text-rose-600 font-bold' : ''}`}>
                          <AlertTriangle className="h-3.5 w-3.5" /> {formatDate(task.dueDate)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Target className="h-3.5 w-3.5" /> {task.assignedType === 'individual' ? 'Personal' : 'Team'}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-surface-card px-3 py-1 text-xs font-semibold text-slate-600 border border-border-light">
                      {(statuses[task.status] || statuses.todo).label}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-slate-400">No tasks found in this category.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Side Panel */}
        <div className="min-w-0 space-y-6">
          {/* Personal Panel */}
          <motion.div {...fadeUp(0.1)} className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Profile</p>
                <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">Personal Panel</h2>
              </div>
              <Bell className="h-4 w-4 text-brand" />
            </div>
            <div className="rounded-2xl border border-border-light bg-surface-card p-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warm text-white text-lg font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500 capitalize">Role: {user?.role || "standard"}</p>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div {...fadeUp(0.2)} className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Schedule</p>
                <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">Upcoming Deadlines</h2>
              </div>
              <Clock className="h-4 w-4 text-brand" />
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map(task => <DeadlineCard key={task.id} task={task} />)
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No upcoming deadlines.</p>
              )}
            </div>
          </motion.div>

          {/* Team Progress Overview */}
          <motion.div {...fadeUp(0.3)} className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Collaborations</p>
                <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">Team Progress</h2>
              </div>
            </div>
            <div className="space-y-4">
              {teams.length > 0 ? (
                teams.map(team => {
                  const teamTotal = team.stats?.totalTasks || 0;
                  const teamComp = team.stats?.completedTasks || 0;
                  const teamPct = teamTotal > 0 ? Math.round((teamComp / teamTotal) * 100) : 0;
                  return (
                    <div key={team._id} className="rounded-xl border border-slate-100 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-700">{team.teamName}</h4>
                        <span className="text-xs font-bold text-brand">{teamPct}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full bg-brand transition-all" style={{ width: `${teamPct}%` }} />
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        {teamComp} / {teamTotal} Tasks Completed
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No teams assigned.</p>
              )}
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div {...fadeUp(0.4)} className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">History</p>
              <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">Activity Timeline</h2>
            </div>
            <ActivityTimeline activities={activities} limit={5} />
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

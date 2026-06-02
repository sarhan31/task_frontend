import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  CheckSquare,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Activity,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  MessageSquare,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import PremiumSidebar from "@components/layout/PremiumSidebar";
import TaskChart from "@components/charts/TaskChart";
import { cn } from "@utils/cn";
import { useState } from "react";

const PremiumDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats = [
    {
      title: "Total Tasks",
      value: "156",
      icon: CheckSquare,
      tone: "teal",
      note: "+12% this month",
      progress: 76,
    },
    {
      title: "In Progress",
      value: "45",
      icon: Clock,
      tone: "amber",
      note: "9 need review",
      progress: 58,
    },
    {
      title: "Completed",
      value: "89",
      icon: TrendingUp,
      tone: "peach",
      note: "+23% this week",
      progress: 83,
    },
    {
      title: "Pending",
      value: "22",
      icon: AlertCircle,
      tone: "rose",
      note: "Needs attention",
      progress: 34,
    },
  ];

  const chartData = [
    { name: "Jan", completed: 38, inProgress: 24, todo: 12 },
    { name: "Feb", completed: 45, inProgress: 22, todo: 14 },
    { name: "Mar", completed: 52, inProgress: 25, todo: 10 },
    { name: "Apr", completed: 49, inProgress: 20, todo: 16 },
    { name: "May", completed: 61, inProgress: 18, todo: 11 },
    { name: "Jun", completed: 68, inProgress: 16, todo: 9 },
  ];

  const recentTasks = [
    {
      id: 1,
      title: "Design new landing page",
      status: "In Progress",
      priority: "High",
      assignee: "John Doe",
      progress: 65,
    },
    {
      id: 2,
      title: "Implement authentication",
      status: "Completed",
      priority: "Urgent",
      assignee: "Jane Smith",
      progress: 100,
    },
    {
      id: 3,
      title: "Write documentation",
      status: "Pending",
      priority: "Medium",
      assignee: "Bob Johnson",
      progress: 20,
    },
    {
      id: 4,
      title: "Fix responsive issues",
      status: "In Review",
      priority: "High",
      assignee: "Alice Brown",
      progress: 40,
    },
  ];

  const updates = [
    {
      id: 1,
      text: "4 tasks moved to completed",
      time: "14 min ago",
      icon: ClipboardCheck,
      tone: "bg-[#e8f6f2] text-[#13856f]",
    },
    {
      id: 2,
      text: "New client message received",
      time: "32 min ago",
      icon: MessageSquare,
      tone: "bg-[#fff4ef] text-[#c26a44]",
    },
    {
      id: 3,
      text: "Weekly analytics exported",
      time: "1 hr ago",
      icon: BarChart3,
      tone: "bg-[#fff8ef] text-[#b5722a]",
    },
  ];

  const contributors = ["John Doe", "Jane Smith", "Bob Johnson"];

  const statToneMap = {
    teal: {
      icon: "bg-[#13856f] text-white",
      pill: "bg-[#e8f6f2] text-[#13856f]",
      bar: "bg-[#13856f]",
    },
    amber: {
      icon: "bg-[#efbf91] text-white",
      pill: "bg-[#fff8ef] text-[#b5722a]",
      bar: "bg-[#efbf91]",
    },
    peach: {
      icon: "bg-[#f3b59e] text-white",
      pill: "bg-[#fff4ef] text-[#c26a44]",
      bar: "bg-[#f3b59e]",
    },
    rose: {
      icon: "bg-[#8d514f] text-white",
      pill: "bg-[#fdf0ef] text-[#8d514f]",
      bar: "bg-[#8d514f]",
    },
  };

  const statusClasses = {
    Completed: "bg-[#e8f6f2] text-[#13856f] border-[#b8e0d8]",
    "In Progress": "bg-[#fff8ef] text-[#b5722a] border-[#f0d9be]",
    Pending: "bg-[#fdf0ef] text-[#8d514f] border-[#f4c5c1]",
    "In Review": "bg-[#fff4ef] text-[#c26a44] border-[#f1d3c7]",
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] },
  });

  return (
    <div className="min-h-screen bg-[#f7e3cf]">
      <PremiumSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72",
        )}
      >
        <div className="sticky top-0 z-40 border-b border-[#ead8cb] bg-[#fff8f3]/90 backdrop-blur-sm">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 max-w-xl items-center gap-3 rounded-2xl border border-[#ead8cb] bg-white px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-[#13856f]" />
              <input
                type="text"
                placeholder="Search tasks, projects, or team members..."
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="ml-4 flex items-center gap-3">

              <div className="hidden items-center gap-2 rounded-2xl border border-[#ead8cb] bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm sm:flex">
                <Calendar className="h-4 w-4 text-[#13856f]" />
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <motion.div
                {...fadeUp(0)}
                className="relative overflow-hidden rounded-[28px] border border-white/65 bg-white/88 p-7 shadow-[0_8px_40px_rgba(90,55,20,0.12)] backdrop-blur-sm"
              >
                <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-full bg-[#13856f]" />
                <div className="pointer-events-none absolute right-8 top-5 h-28 w-28 rounded-full bg-[#efbf91]/20 blur-2xl" />
                <div className="pointer-events-none absolute right-28 bottom-2 h-20 w-20 rounded-full bg-[#13856f]/10 blur-2xl" />

                <div className="flex flex-col gap-5 pl-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#13856f]">
                      Premium workspace
                    </p>
                    <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-slate-900">
                      A cleaner view of today’s work
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Track project momentum, review task activity, and keep
                      your team aligned without losing the current style.
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#13856f] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(19,133,111,0.28)] transition hover:bg-[#0f7260] hover:shadow-[0_12px_32px_rgba(19,133,111,0.36)]">
                    <Sparkles className="h-4 w-4" />
                    Assign Task
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 pl-6">
                  {[
                    "18 active projects",
                    "6 pending approvals",
                    "3 new messages",
                  ].map((item, index) => (
                    <span
                      key={item}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        index === 0 && "bg-[#e8f6f2] text-[#13856f]",
                        index === 1 && "bg-[#fff8ef] text-[#b5722a]",
                        index === 2 && "bg-[#fdf0ef] text-[#8d514f]",
                      )}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, index) => {
                  const tone = statToneMap[stat.tone];
                  return (
                    <motion.div
                      key={stat.title}
                      {...fadeUp(0.08 * (index + 1))}
                      className="rounded-[24px] border border-white/65 bg-white/88 p-5 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {stat.title}
                          </p>
                          <h3 className="mt-1 text-3xl font-bold text-slate-900">
                            {stat.value}
                          </h3>
                          <span
                            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone.pill}`}
                          >
                            {stat.note}
                          </span>
                        </div>
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone.icon}`}
                        >
                          <stat.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#f4ddd0]">
                        <div
                          className={`h-full rounded-full ${tone.bar}`}
                          style={{ width: `${stat.progress}%` }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                <motion.div
                  {...fadeUp(0.18)}
                  className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Analytics
                      </p>
                      <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                        Task Performance
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      {["7d", "30d", "90d"].map((range, index) => (
                        <button
                          key={range}
                          className={cn(
                            "rounded-xl px-3 py-1.5 text-xs font-semibold transition",
                            index === 1
                              ? "bg-[#13856f] text-white shadow-[0_4px_12px_rgba(19,133,111,0.25)]"
                              : "border border-[#e6d6ca] text-slate-500 hover:border-[#13856f] hover:text-[#13856f]",
                          )}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  <TaskChart data={chartData} />
                </motion.div>

                <motion.div
                  {...fadeUp(0.24)}
                  className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Health
                      </p>
                      <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                        Workspace Status
                      </h2>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-[#13856f]" />
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Completion rate",
                        value: "72%",
                        width: "72%",
                        tone: "bg-[#13856f]",
                      },
                      {
                        label: "Team utilization",
                        value: "64%",
                        width: "64%",
                        tone: "bg-[#efbf91]",
                      },
                      {
                        label: "Client satisfaction",
                        value: "91%",
                        width: "91%",
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
                </motion.div>
              </div>

              <motion.div
                {...fadeUp(0.3)}
                className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
              >
                <div className="flex items-center justify-between border-b border-[#f4ddd0] px-6 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Tasks
                    </p>
                    <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                      Recent Tasks
                    </h2>
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#13856f] transition-colors hover:text-[#0c6c59]">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-0 divide-y divide-[#f4ddd0]">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-4 px-6 py-4 transition-colors hover:bg-[#fffaf6] md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {task.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Assigned to {task.assignee}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[task.status]}`}
                        >
                          {task.status}
                        </span>
                        <div className="flex min-w-[120px] items-center gap-2">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#f4ddd0]">
                            <div
                              className="h-full rounded-full bg-[#13856f]"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                      Workspace Admin
                    </h2>
                  </div>
                  <Users className="h-4 w-4 text-[#13856f]" />
                </div>
                <div className="rounded-2xl border border-[#f4ddd0] bg-[#fffaf6] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#13856f] text-lg font-bold text-white">
                      J
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        John Doe
                      </p>
                      <p className="text-xs text-slate-500">
                        Project administrator
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...fadeUp(0.22)}
                className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Updates
                    </p>
                    <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                      Recent Activity
                    </h2>
                  </div>
                  <Activity className="h-4 w-4 text-[#13856f]" />
                </div>
                <div className="space-y-3.5">
                  {updates.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${item.tone}`}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm leading-5 text-slate-700">
                          {item.text}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                {...fadeUp(0.28)}
                className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Team
                    </p>
                    <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                      Contributors
                    </h2>
                  </div>
                  <Users className="h-4 w-4 text-[#13856f]" />
                </div>
                <div className="space-y-3">
                  {contributors.map((name, i) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 rounded-2xl border border-[#f4ddd0] bg-[#fffaf6] p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8d514f] text-sm font-semibold text-white">
                        {name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          Active teammate
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[#13856f]">
                        #{i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;

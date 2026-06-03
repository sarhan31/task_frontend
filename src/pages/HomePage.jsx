import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlarmClock,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Cpu,
  FileCheck2,
  Gauge,
  Layers3,
  LayoutDashboard,
  LockKeyhole,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users2,
  Workflow,
  Zap,
} from 'lucide-react';
import { cn } from '@utils/cn';
import { toast } from '@components/ui/Toaster';
import { useAuth } from '@hooks/useAuth';
import BrandLogo from '@components/ui/BrandLogo';

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Templates', href: '#templates' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

const workflowGroups = [
  { name: 'Triggers', count: '6 nodes', tone: 'bg-emerald-100 text-emerald-700' },
  { name: 'Logic', count: '8 nodes', tone: 'bg-violet-100 text-violet-700' },
  { name: 'Actions', count: '12 nodes', tone: 'bg-amber-100 text-amber-700' },
  { name: 'Approvals', count: '4 nodes', tone: 'bg-rose-100 text-rose-700' },
  { name: 'AI', count: '5 nodes', tone: 'bg-sky-100 text-sky-700' },
];

const featurePills = ['30+ automation nodes', 'No-code setup', 'Real-time approvals'];

const heroStats = [
  { value: '42%', label: 'Faster handoffs' },
  { value: '18h', label: 'Saved weekly' },
  { value: '99.9%', label: 'Workflow uptime' },
];

const trustedTeams = ['Ops Desk', 'SprintLab', 'Northstar HR', 'LaunchWorks'];

const proofPoints = [
  { icon: Gauge, label: 'Live workload balancing' },
  { icon: LockKeyhole, label: 'Role-based approvals' },
  { icon: Cpu, label: 'AI-assisted summaries' },
];

const footerLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', href: '#' },
];

const workflowTemplates = [
  {
    icon: FileCheck2,
    title: 'Task Assignment Flow',
    description: 'Capture requests, assign owners, and route approvals in minutes.',
    tag: 'Operations',
  },
  {
    icon: AlarmClock,
    title: 'Deadline Protection',
    description: 'Escalate overdue work automatically before a task slips.',
    tag: 'Escalation',
  },
  {
    icon: BrainCircuit,
    title: 'AI Task Summaries',
    description: 'Generate updates, summaries, and action points without extra effort.',
    tag: 'AI Assist',
  },
];

const platformFeatures = [
  {
    icon: Play,
    title: 'Event-Based Actions',
    description: 'Trigger automations when tasks are created, reassigned, approved, or completed.',
  },
  {
    icon: Clock3,
    title: 'Recurring Schedules',
    description: 'Run daily standups, weekly reminders, and monthly reporting on autopilot.',
  },
  {
    icon: Users2,
    title: 'Team Routing Logic',
    description: 'Direct work to the right owner based on status, priority, department, or workload.',
  },
  {
    icon: ShieldCheck,
    title: 'Approval and Audit Trail',
    description: 'Track every decision, comment, and handoff with a clean activity history.',
  },
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'Free',
    detail: 'For small teams validating a workflow setup.',
  },
  {
    name: 'Growth',
    price: '$19',
    detail: 'Per user/month for automation, boards, analytics, and approvals.',
  },
  {
    name: 'Scale',
    price: 'Custom',
    detail: 'Advanced controls, AI usage, and tailored implementation support.',
  },
];

const workflowNodes = [
  {
    title: 'Request Intake',
    subtitle: 'Trigger',
    className: 'left-[8%] top-[45%] border-emerald-200 bg-emerald-50',
    iconWrap: 'bg-emerald-600',
  },
  {
    title: 'Budget Check',
    subtitle: 'Logic',
    className: 'left-[34%] top-[45%] border-violet-200 bg-violet-50',
    iconWrap: 'bg-violet-600',
  },
  {
    title: 'Finance Approval',
    subtitle: 'Approval',
    className: 'left-[54%] top-[17%] border-orange-300 bg-white',
    iconWrap: 'bg-orange-500',
  },
  {
    title: 'Auto Approve',
    subtitle: 'Logic',
    className: 'left-[54%] top-[70%] border-sky-200 bg-sky-50',
    iconWrap: 'bg-sky-500',
  },
  {
    title: 'Notify Team',
    subtitle: 'Action',
    className: 'left-[76%] top-[45%] border-amber-200 bg-amber-50',
    iconWrap: 'bg-amber-500',
  },
];

const connectionLines = [
  'left-[22%] top-[52%] h-[2px] w-[15%]',
  'left-[49%] top-[33%] h-[20%] w-[2px]',
  'left-[49%] top-[52%] h-[2px] w-[11%]',
  'left-[49%] top-[53%] h-[22%] w-[2px]',
  'left-[62%] top-[52%] h-[2px] w-[14%]',
];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [nodeLibraryExpanded, setNodeLibraryExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';
  const currentYear = new Date().getFullYear();

  const visibleWorkflowNodes = useMemo(() => {
    if (!nodeLibraryExpanded) return workflowNodes;

    return [
      ...workflowNodes,
      {
        title: 'AI Summary',
        subtitle: 'Action',
        className: 'left-[76%] top-[18%] border-emerald-200 bg-emerald-50',
        iconWrap: 'bg-emerald-500',
      },
    ];
  }, [nodeLibraryExpanded]);

  const visibleConnectionLines = useMemo(() => {
    if (!nodeLibraryExpanded) return connectionLines;
    return [...connectionLines, 'left-[63%] top-[26%] h-[2px] w-[13%]'];
  }, [nodeLibraryExpanded]);

  const handleTestRun = () => {
    if (isRunningDemo) return;

    setIsRunningDemo(true);
    toast.info('Running a sample approval workflow...');

    window.setTimeout(() => {
      setIsRunningDemo(false);
      toast.success('Demo run finished. All workflow steps completed successfully.');
    }, 1600);
  };

  const handleDeploy = () => {
    if (isDeploying) return;

    setIsDeploying(true);
    toast.success('Workflow deployed. Future task events will now trigger this automation.');

    window.setTimeout(() => {
      setIsDeploying(false);
    }, 1400);
  };

  const handleNodeToggle = () => {
    const nextValue = !nodeLibraryExpanded;
    setNodeLibraryExpanded(nextValue);
    toast.info(
      nextValue
        ? 'AI Summary node added to the canvas preview.'
        : 'Node preview reset to the default workflow layout.'
    );
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full overflow-x-clip bg-[#f5f7f2] text-slate-900 flex flex-col justify-between">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(15,108,87,0.12)_0%,_rgba(255,255,255,0)_36%,_rgba(236,185,111,0.18)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[760px] bg-[linear-gradient(180deg,_#ffffff_0%,_rgba(255,255,255,0.62)_54%,_rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.045)_1px,_transparent_1px),linear-gradient(90deg,_rgba(15,23,42,0.045)_1px,_transparent_1px)] bg-[size:72px_72px] opacity-50" />
      </div>

      <div className="relative z-10 mx-auto flex flex-1 w-full max-w-[1320px] flex-col px-4 pb-3 pt-3 sm:px-6 lg:px-8 lg:overflow-hidden">
        <div className="sticky top-3 z-40 mb-3 flex justify-center sm:top-4">
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full rounded-[22px] border border-white/80 bg-white/92 px-3 py-2.5 shadow-[0_12px_36px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:rounded-[28px] sm:px-5 sm:py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap">
              <Link to="/" className="flex min-w-0 items-center">
                <BrandLogo size="sm" />
              </Link>

              <nav className="hidden items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-2 lg:flex">
                {navItems.map((item) => {
                  const tabId = item.label.toLowerCase();
                  const isActive = activeTab === tabId;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(isActive ? 'builder' : tabId)}
                      className={cn(
                        "flex items-center gap-1 text-xs font-bold transition px-3.5 py-1.5 rounded-xl",
                        isActive 
                          ? "bg-[#0f6c57] text-white" 
                          : "text-slate-600 hover:text-[#0f6c57]"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="flex w-full items-center justify-end gap-2 sm:gap-3 lg:w-auto">
                <Link
                  to={isAuthenticated ? dashboardPath : '/login'}
                  className="hidden rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f6efe8] sm:inline-flex"
                >
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Link>
                <Link
                  to={isAuthenticated ? dashboardPath : '/signup'}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#0f6c57] px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(15,108,87,0.2)] transition hover:bg-[#0c5d4b] sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  {isAuthenticated ? 'Open Workspace' : 'Start Free'}
                </Link>
              </div>
            </div>
          </motion.header>
        </div>

        <main className="flex-1 flex flex-col justify-center overflow-y-auto lg:overflow-hidden px-2 py-1">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(500px,1.08fr)] items-center">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex min-w-0 max-w-2xl flex-col justify-center lg:py-2"
            >
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#b7d8ce] bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0f6c57] shadow-[0_8px_20px_rgba(15,108,87,0.06)]">
                <Sparkles className="h-3.5 w-3.5" />
                Automation Engine
              </div>

              <h1 className="mt-3 font-display text-[1.85rem] font-black leading-[1.05] text-[#07111f] sm:text-[2.8rem] sm:leading-[1.02] xl:text-[3.55rem]">
                Run every task like a
                <br />
                <span className="bg-[linear-gradient(90deg,_#0f6c57,_#158f78,_#b77728)] bg-clip-text text-transparent">
                  world-class workflow.
                </span>
              </h1>

              <p className="mt-3 max-w-lg text-xs leading-relaxed text-slate-600 sm:text-sm lg:text-base lg:leading-normal">
                Tasky Studio brings task assignment, approvals, AI summaries, deadline protection, and team routing into one sharp operating system for work.
              </p>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  to={isAuthenticated ? dashboardPath : '/signup'}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f6c57] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,108,87,0.18)] transition hover:bg-[#0c5d4b] sm:px-6 sm:py-3.5 sm:text-base"
                >
                  {isAuthenticated ? 'Open Workspace' : 'Explore Workflows'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={isAuthenticated ? dashboardPath : '/login'}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e8e1] bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0f6c57]/30 hover:text-[#0f6c57] sm:px-6 sm:py-3.5 sm:text-base"
                >
                  <Play className="h-4 w-4" />
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {featurePills.map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 sm:text-sm">
                    <Check className="h-3.5 w-3.5 text-[#0f6c57]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid max-w-lg grid-cols-3 overflow-hidden rounded-[20px] border border-white/80 bg-white/80 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="border-r border-slate-200/80 px-3 py-2.5 last:border-r-0 sm:py-3 text-center sm:text-left">
                    <p className="font-display text-lg font-black text-slate-950 sm:text-2xl">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider leading-none">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex min-w-0 items-center justify-center lg:py-2"
            >
              <div className="relative w-full min-w-0 overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.1)] h-[460px] lg:h-[490px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {activeTab === 'builder' && (
                    <motion.div
                      key="builder"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col h-full"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-white">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0f6c57] text-white">
                              <Workflow className="h-4 w-4" />
                            </span>
                            <span className="truncate">Workflow Builder</span>
                            <span className="text-slate-300 font-normal">/</span>
                            <span className="truncate font-medium text-slate-500 text-xs sm:text-sm">Task Approval Pipeline</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#e8f6f2] px-2 py-1 text-xs font-semibold text-[#0f6c57]">
                            <span className="h-2 w-2 rounded-full bg-[#22b573]" />
                            Saved
                          </span>
                          <button
                            onClick={handleTestRun}
                            className="rounded-xl border border-[#e6ddd3] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#0f6c57]/30 hover:text-[#0f6c57]"
                          >
                            {isRunningDemo ? 'Running...' : 'Test Run'}
                          </button>
                          <button
                            onClick={handleDeploy}
                            className="rounded-xl bg-[#0f6c57] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0c5d4b]"
                          >
                            {isDeploying ? 'Deploying...' : 'Deploy'}
                          </button>
                        </div>
                      </div>

                      {/* Proof points */}
                      <div className="grid gap-2 border-b border-slate-200 bg-[#f8fbf8] px-5 py-2.5 grid-cols-3">
                        {proofPoints.map((point) => {
                          const Icon = point.icon;
                          return (
                            <div key={point.label} className="flex items-center gap-2 rounded-xl border border-white bg-white px-2.5 py-1.5 shadow-sm">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#edf5f1] text-[#0f6c57]">
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="text-[10px] font-bold text-slate-700 truncate">{point.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Canvas and Sidebar */}
                      <div className="flex-1 grid grid-cols-[140px_minmax(0,1fr)] overflow-hidden">
                        {/* Sidebar */}
                        <aside className="border-r border-slate-200 bg-[#fbf8f2] p-3 flex flex-col justify-between overflow-y-auto">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                              Node Library
                            </p>
                            <div className="space-y-2">
                              {workflowGroups.map((group, index) => (
                                <div
                                  key={group.name}
                                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0f6c57]/30"
                                >
                                  <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', group.tone)}>
                                    {index === 0 && <Play className="h-3.5 w-3.5" />}
                                    {index === 1 && <Workflow className="h-3.5 w-3.5" />}
                                    {index === 2 && <Layers3 className="h-3.5 w-3.5" />}
                                    {index === 3 && <CheckCircle2 className="h-3.5 w-3.5" />}
                                    {index === 4 && <Bot className="h-3.5 w-3.5" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate leading-none">{group.name}</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{group.count}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={handleNodeToggle}
                            className="mt-3 w-full rounded-xl bg-[#eef4ef] py-2 text-xs font-semibold text-[#0f6c57] transition hover:bg-[#e2f1eb]"
                          >
                            {nodeLibraryExpanded ? 'Reset Canvas' : '+ Add Node'}
                          </button>
                        </aside>

                        {/* Canvas */}
                        <div className="relative overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbf9_100%)] p-4">
                          {/* SLA Box */}
                          <div className="absolute right-3 top-3 z-10 rounded-xl border border-[#d9ebe4] bg-white/95 px-3 py-1.5 shadow-sm">
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-700">
                              <Clock3 className="h-3 w-3 text-[#0f6c57]" />
                              SLA
                            </div>
                            <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">4h 12m</p>
                          </div>

                          {/* Active automations */}
                          <div className="absolute bottom-3 left-3 z-10 rounded-xl border border-[#f0d8ba] bg-[#fff7ec] px-3 py-1.5 shadow-sm">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-[#9a5b12] leading-none">
                              <Zap className="h-3 w-3 shrink-0" />
                              7 active
                            </div>
                          </div>

                          {/* Connection Lines */}
                          {visibleConnectionLines.map((line) => (
                            <div key={line} className={cn('absolute rounded-full bg-[#dbe7f7]', line)} />
                          ))}

                          {/* Nodes */}
                          {visibleWorkflowNodes.map((node) => (
                            <div
                              key={node.title}
                              className={cn(
                                'absolute w-[94px] rounded-xl border px-2 py-2.5 shadow-sm transition hover:shadow-md bg-white',
                                node.className
                              )}
                            >
                              <div className={cn('mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg text-white', node.iconWrap)}>
                                {node.subtitle === 'Trigger' && <Play className="h-3.5 w-3.5" />}
                                {node.subtitle === 'Logic' && <Workflow className="h-3.5 w-3.5" />}
                                {node.subtitle === 'Approval' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                {node.subtitle === 'Action' && <Layers3 className="h-3.5 w-3.5" />}
                              </div>
                              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                                {node.subtitle}
                              </p>
                              <p className="mt-0.5 text-xs font-semibold leading-tight text-slate-800 truncate">
                                {node.title}
                              </p>
                            </div>
                          ))}

                          <div className="absolute left-[50%] top-[42%] flex -translate-x-1/2 items-center justify-center rounded-full border border-[#dbe7f7] bg-white px-1.5 py-0.5 text-[8px] font-bold text-slate-500 shadow-sm leading-none">
                            {'>'} 10L
                          </div>
                          <div className="absolute left-[50%] top-[64%] flex -translate-x-1/2 items-center justify-center rounded-full border border-[#dbe7f7] bg-white px-1.5 py-0.5 text-[8px] font-bold text-slate-500 shadow-sm leading-none">
                            {'<'}= 10L
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'platform' && (
                    <motion.div
                      key="platform"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col h-full bg-[#fbfdfb] p-5"
                    >
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f6c57] leading-none">
                            Built For Task Management
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-900 mt-1">Platform Capabilities</h3>
                        </div>
                        <button
                          onClick={() => setActiveTab('builder')}
                          className="text-xs font-semibold text-slate-500 hover:text-[#0f6c57] flex items-center gap-1 transition"
                        >
                          ← Back to Canvas
                        </button>
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto pr-1">
                        {platformFeatures.map((feature) => {
                          const Icon = feature.icon;
                          return (
                            <div
                              key={feature.title}
                              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:border-[#0f6c57]/30 transition"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f6c57] text-white shrink-0">
                                <Icon className="h-4 w-4" />
                              </div>
                              <h4 className="mt-2 text-sm font-bold text-slate-900 leading-tight">{feature.title}</h4>
                              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 flex-1">{feature.description}</p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0f6c57] bg-[#edf5f1] px-2 py-0.5 rounded-full">
                          Live workflow capability
                        </span>
                        <Link
                          to="/signup"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0f6c57] hover:underline"
                        >
                          Sign Up to Try <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'templates' && (
                    <motion.div
                      key="templates"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col h-full bg-[#fbfdfb] p-5"
                    >
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f6c57] leading-none">
                            Ready-to-launch templates
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-900 mt-1">SaaS Workflow Layouts</h3>
                        </div>
                        <button
                          onClick={() => setActiveTab('builder')}
                          className="text-xs font-semibold text-slate-500 hover:text-[#0f6c57] flex items-center gap-1 transition"
                        >
                          ← Back to Canvas
                        </button>
                      </div>

                      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                        {workflowTemplates.map((template) => {
                          const Icon = template.icon;
                          return (
                            <div
                              key={template.title}
                              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:border-[#0f6c57]/30 transition animate-fade-in"
                            >
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f6f2] text-[#0f6c57]">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-sm font-bold text-slate-900 truncate leading-tight">{template.title}</h4>
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#0f6c57] bg-[#edf5f1] px-1.5 py-0.5 rounded">
                                    {template.tag}
                                  </span>
                                </div>
                                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 truncate sm:whitespace-normal sm:line-clamp-2">
                                  {template.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="text-[11px] text-slate-500">
                          Launch speed: <strong className="text-slate-900">5 min</strong> average setup.
                        </div>
                        <Link
                          to="/signup"
                          className="inline-flex items-center gap-1 rounded-xl bg-[#0f6c57] px-3.5 py-1.5 font-bold text-white shadow-sm hover:bg-[#0c5d4b] transition"
                        >
                          Use Template <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'pricing' && (
                    <motion.div
                      key="pricing"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col h-full bg-[#fbfdfb] p-5"
                    >
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f6c57] leading-none">
                            Flexible Tiering
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-900 mt-1">Simple Pricing Options</h3>
                        </div>
                        <button
                          onClick={() => setActiveTab('builder')}
                          className="text-xs font-semibold text-slate-500 hover:text-[#0f6c57] flex items-center gap-1 transition"
                        >
                          ← Back to Canvas
                        </button>
                      </div>

                      <div className="flex-1 grid grid-cols-3 gap-2.5 items-stretch overflow-y-auto pr-1">
                        {pricingTiers.map((tier) => (
                          <div
                            key={tier.name}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#fffaf6] p-3 shadow-sm hover:border-[#0f6c57]/30 transition"
                          >
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{tier.name}</p>
                              <p className="mt-1 text-xl font-extrabold text-slate-950 leading-none">{tier.price}</p>
                              <p className="mt-2 text-[10px] leading-relaxed text-slate-500 leading-normal">{tier.detail}</p>
                            </div>
                            <Link
                              to="/signup"
                              className="mt-3 w-full text-center rounded-xl bg-[#0f6c57] py-1.5 text-[10px] font-bold text-white hover:bg-[#0c5d4b] transition block"
                            >
                              Select
                            </Link>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-semibold text-[#0f6c57]">No credit card required to start</span>
                        <Link
                          to="/signup"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0f6c57] hover:underline"
                        >
                          Create Workspace <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'about' && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col h-full bg-[#fbfdfb] p-5"
                    >
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f6c57] leading-none">
                            About Tasky Studio
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-900 mt-1">Our Core Value</h3>
                        </div>
                        <button
                          onClick={() => setActiveTab('builder')}
                          className="text-xs font-semibold text-slate-500 hover:text-[#0f6c57] flex items-center gap-1 transition"
                        >
                          ← Back to Canvas
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col justify-between gap-3 overflow-y-auto pr-1">
                        <div className="rounded-xl border border-[#e7ddd2] bg-[#fffaf6] p-3 text-xs leading-relaxed text-slate-700">
                          <p className="font-semibold text-slate-900 mb-1">A cleaner way to run work across teams</p>
                          We combine task tracking, approvals, automation, and AI assistance so your team can move faster with fewer manual follow-ups.
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-[#eadfd4] bg-white p-2.5 shadow-sm text-center">
                            <p className="text-lg font-black text-[#0f6c57] leading-none">30+</p>
                            <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Workflow nodes</p>
                          </div>
                          <div className="rounded-xl border border-[#eadfd4] bg-white p-2.5 shadow-sm text-center">
                            <p className="text-lg font-black text-[#0f6c57] leading-none">4</p>
                            <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Execution layers</p>
                          </div>
                          <div className="rounded-xl border border-[#eadfd4] bg-white p-2.5 shadow-sm text-center">
                            <p className="text-lg font-black text-[#0f6c57] leading-none">AI</p>
                            <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Assistance</p>
                          </div>
                          <div className="rounded-xl border border-[#eadfd4] bg-white p-2.5 shadow-sm text-center">
                            <p className="text-lg font-black text-[#0f6c57] leading-none">24/7</p>
                            <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Coverage</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-500 font-medium">Empowering operations and managers</span>
                        <Link
                          to="/signup"
                          className="inline-flex items-center gap-1 font-bold text-[#0f6c57] hover:underline"
                        >
                          Learn More <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          </section>
        </main>

        <footer className="mt-auto py-3.5 border-t border-slate-200/60 w-full shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 px-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0f6c57]">Tasky Studio</span>
              <span>© {currentYear}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">Automate the work behind the work.</span>
            </div>
            <nav className="flex gap-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label.toLowerCase())}
                  className={cn(
                    "transition hover:text-[#0f6c57] font-semibold",
                    activeTab === item.label.toLowerCase() ? "text-[#0f6c57]" : ""
                  )}
                >
                  {item.label}
                </button>
              ))}
              {footerLinks.map((item) => (
                <a key={item.label} href={item.href} className="transition hover:text-[#0f6c57] font-semibold">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;

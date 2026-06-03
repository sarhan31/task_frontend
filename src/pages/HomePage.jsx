import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen w-full overflow-x-clip bg-[#f5f7f2] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(15,108,87,0.12)_0%,_rgba(255,255,255,0)_36%,_rgba(236,185,111,0.18)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[760px] bg-[linear-gradient(180deg,_#ffffff_0%,_rgba(255,255,255,0.62)_54%,_rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.045)_1px,_transparent_1px),linear-gradient(90deg,_rgba(15,23,42,0.045)_1px,_transparent_1px)] bg-[size:72px_72px] opacity-50" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="fixed inset-x-0 top-4 z-40 flex justify-center px-4 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-[1320px] rounded-[22px] border border-white/80 bg-white/90 px-3 py-3 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:rounded-[28px] sm:px-5 sm:py-4"
          >
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex min-w-0 items-center">
                <BrandLogo size="sm" />
              </Link>

              <nav className="hidden items-center gap-8 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-5 py-2.5 lg:flex">
                {navItems.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-[#0f6c57]"
                  >
                    {item.label}
                    {index === 0 && <ChevronDown className="h-4 w-4" />}
                  </a>
                ))}
              </nav>

              <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
                <Link
                  to={isAuthenticated ? dashboardPath : '/login'}
                  className="hidden rounded-2xl px-4 py-2.5 text-base font-semibold text-slate-700 transition hover:bg-[#f6efe8] sm:inline-flex"
                >
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Link>
                <Link
                  to={isAuthenticated ? dashboardPath : '/signup'}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#0f6c57] px-3 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,108,87,0.24)] transition hover:bg-[#0c5d4b] sm:px-5 sm:py-3 sm:text-base"
                >
                  {isAuthenticated ? 'Open Workspace' : 'Start Free'}
                </Link>
              </div>
            </div>
          </motion.header>
        </div>

        <main className="flex-1 overflow-x-clip px-2 pb-10 pt-28 lg:pt-32">
          <section className="grid min-h-[calc(100vh-8rem)] gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(540px,1.05fr)] xl:items-center">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex min-w-0 max-w-2xl flex-col justify-center"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#b7d8ce] bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.22em] text-[#0f6c57] shadow-[0_10px_30px_rgba(15,108,87,0.10)]">
                <Sparkles className="h-4 w-4" />
                Automation Engine
              </div>

              <h1 className="mt-6 font-display text-[2.45rem] font-black leading-[0.98] text-[#07111f] sm:text-[4.35rem] sm:leading-[0.94] xl:text-[5.1rem]">
                Run every task like a
                <br />
                <span className="bg-[linear-gradient(90deg,_#0f6c57,_#158f78,_#b77728)] bg-clip-text text-transparent">
                  world-class workflow.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-9 text-slate-600 sm:text-[1.35rem] sm:leading-[1.55] xl:text-[1.48rem]">
                Tasky Studio brings task assignment, approvals, AI summaries, deadline protection, and team routing into one sharp operating system for work.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to={isAuthenticated ? dashboardPath : '/signup'}
                  className="inline-flex items-center justify-center gap-3 rounded-[24px] bg-[#0f6c57] px-8 py-5 text-lg font-semibold text-white shadow-[0_16px_34px_rgba(15,108,87,0.24)] transition hover:bg-[#0c5d4b]"
                >
                  {isAuthenticated ? 'Open Workspace' : 'Explore Workflows'}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to={isAuthenticated ? dashboardPath : '/login'}
                  className="inline-flex items-center justify-center gap-3 rounded-[24px] border border-[#d9e8e1] bg-white/85 px-8 py-5 text-lg font-semibold text-slate-700 transition hover:border-[#0f6c57]/30 hover:text-[#0f6c57]"
                >
                  <Play className="h-5 w-5" />
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
                {featurePills.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-base font-medium text-slate-600">
                    <Check className="h-4 w-4 text-[#0f6c57]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-1 overflow-hidden rounded-[28px] border border-white/80 bg-white/80 shadow-[0_16px_40px_rgba(15,23,42,0.07)] backdrop-blur sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="border-b border-slate-200/80 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:py-5 sm:last:border-r-0">
                    <p className="font-display text-2xl font-black text-slate-950 sm:text-3xl">{stat.value}</p>
                    <p className="mt-1 text-xs font-bold uppercase text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex min-w-0 items-center"
            >
              <div className="relative w-full min-w-0 overflow-hidden rounded-[34px] border border-white/90 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.14)]">
                <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-900">
                      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0f6c57] text-white">
                        <Workflow className="h-5 w-5" />
                      </span>
                      Workflow Builder
                      <span className="text-slate-400">/</span>
                      <span className="truncate font-medium text-slate-500">Task Approval Pipeline</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f6f2] px-3 py-1.5 text-sm font-semibold text-[#0f6c57]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#22b573]" />
                      Saved
                    </span>
                    <button
                      onClick={handleTestRun}
                      className="rounded-2xl border border-[#e6ddd3] bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#0f6c57]/30 hover:text-[#0f6c57]"
                    >
                      {isRunningDemo ? 'Running...' : 'Test Run'}
                    </button>
                    <button
                      onClick={handleDeploy}
                      className="rounded-2xl bg-[#0f6c57] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0c5d4b]"
                    >
                      {isDeploying ? 'Deploying...' : 'Deploy'}
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 border-b border-slate-200 bg-[#f8fbf8] px-6 py-4 md:grid-cols-3">
                  {proofPoints.map((point) => {
                    const Icon = point.icon;
                    return (
                      <div key={point.label} className="flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5f1] text-[#0f6c57]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-bold text-slate-700">{point.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid min-h-[520px] md:grid-cols-[180px_minmax(0,1fr)] xl:min-h-[560px]">
                  <aside className="border-r border-slate-200 bg-[#fbf8f2] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Node Library
                    </p>
                    <div className="mt-5 space-y-3">
                      {workflowGroups.map((group, index) => (
                        <div
                          key={group.name}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0f6c57]/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', group.tone)}>
                              {index === 0 && <Play className="h-4 w-4" />}
                              {index === 1 && <Workflow className="h-4 w-4" />}
                              {index === 2 && <Layers3 className="h-4 w-4" />}
                              {index === 3 && <CheckCircle2 className="h-4 w-4" />}
                              {index === 4 && <Bot className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{group.name}</p>
                              <p className="text-xs text-slate-400">{group.count}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleNodeToggle}
                      className="mt-5 w-full rounded-2xl bg-[#eef4ef] px-4 py-3 text-sm font-semibold text-[#0f6c57] transition hover:bg-[#e2f1eb]"
                    >
                      {nodeLibraryExpanded ? 'Reset preview' : '+ Add node'}
                    </button>
                  </aside>

                  <div className="relative overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbf9_100%)] p-5">
                    <div className="absolute right-10 top-10 z-10 rounded-2xl border border-[#d9ebe4] bg-white/95 px-4 py-3 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Clock3 className="h-4 w-4 text-[#0f6c57]" />
                        Approval SLA
                      </div>
                      <p className="mt-1 text-2xl font-bold text-slate-900">4h 12m</p>
                    </div>

                    <div className="absolute bottom-8 left-8 z-10 rounded-2xl border border-[#f0d8ba] bg-[#fff7ec] px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#9a5b12]">
                        <Zap className="h-4 w-4" />
                        7 automations active
                      </div>
                    </div>

                    {visibleConnectionLines.map((line) => (
                      <div key={line} className={cn('absolute rounded-full bg-[#dbe7f7]', line)} />
                    ))}

                    {visibleWorkflowNodes.map((node) => (
                      <div
                        key={node.title}
                        className={cn(
                          'absolute w-[118px] rounded-[22px] border px-3 py-4 shadow-[0_8px_20px_rgba(90,55,20,0.08)]',
                          node.className
                        )}
                      >
                        <div className={cn('mb-3 flex h-9 w-9 items-center justify-center rounded-2xl text-white', node.iconWrap)}>
                          {node.subtitle === 'Trigger' && <Play className="h-4 w-4" />}
                          {node.subtitle === 'Logic' && <Workflow className="h-4 w-4" />}
                          {node.subtitle === 'Approval' && <CheckCircle2 className="h-4 w-4" />}
                          {node.subtitle === 'Action' && <Layers3 className="h-4 w-4" />}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          {node.subtitle}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-4 text-slate-800">
                          {node.title}
                        </p>
                      </div>
                    ))}

                    <div className="absolute left-[50%] top-[42%] flex -translate-x-1/2 items-center justify-center rounded-full border border-[#dbe7f7] bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
                      {'>'} 10L
                    </div>
                    <div className="absolute left-[50%] top-[64%] flex -translate-x-1/2 items-center justify-center rounded-full border border-[#dbe7f7] bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
                      {'<'}= 10L
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-[30px] border border-white/80 bg-white/82 px-6 py-5 shadow-[0_18px_46px_rgba(15,23,42,0.07)] backdrop-blur"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
                Trusted by teams that move fast
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {trustedTeams.map((team) => (
                  <div
                    key={team}
                    className="flex min-h-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-black text-slate-700"
                  >
                    {team}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            id="platform"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-16 rounded-[36px] border border-white/80 bg-white px-6 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:px-8 lg:px-12 lg:py-14"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#0f6c57]">
                Built For Task Management
              </p>
              <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Assign, automate, approve, and follow through.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 sm:text-xl">
                Everything in Tasky Studio is designed around real team execution, from intake to approval to delivery.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {platformFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex min-h-[280px] flex-col rounded-[28px] border border-slate-200 bg-[#fbfdfb] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-[#0f6c57]/35 hover:shadow-[0_20px_44px_rgba(15,108,87,0.12)]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f6c57] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-4 text-base leading-8 text-slate-600">{feature.description}</p>
                    <div className="mt-auto pt-6">
                      <span className="inline-flex rounded-full bg-[#edf5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f6c57]">
                        Live workflow capability
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            id="templates"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-20 rounded-[34px] border border-white/80 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8 lg:grid lg:grid-cols-[minmax(340px,0.88fr)_minmax(0,1.12fr)] lg:gap-10"
          >
            <div className="flex h-full flex-col rounded-[30px] border border-[#deece5] bg-[linear-gradient(180deg,_#f7fbf9_0%,_#eef7f3_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#edf5f1] px-4 py-2 text-sm font-semibold text-[#0f6c57]">
                <LayoutDashboard className="h-4 w-4" />
                Ready-to-launch templates
              </div>
              <h2 className="mt-8 max-w-md font-display text-[3.15rem] font-bold leading-[1.02] tracking-[-0.03em] text-slate-900">
                Start from flows your team will actually use.
              </h2>
              <p className="mt-6 max-w-lg text-[1.15rem] leading-9 text-slate-600">
                Instead of generic automation blocks, Tasky Studio helps teams launch workflows for assignments, escalations, status changes, and reporting.
              </p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[24px] border border-[#dcebe4] bg-white p-5 shadow-[0_10px_24px_rgba(15,108,87,0.04)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f6c57]">Template speed</p>
                  <p className="mt-3 text-[2.2rem] font-bold leading-none text-slate-900">5 min</p>
                  <p className="mt-3 text-sm leading-7 text-slate-500">Average time to launch a workflow from a starter layout.</p>
                </div>
                <div className="rounded-[24px] border border-[#ece1d7] bg-white p-5 shadow-[0_10px_24px_rgba(90,55,20,0.04)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Best for</p>
                  <p className="mt-3 text-xl font-bold leading-8 text-slate-900">Ops, managers, and fast-moving teams</p>
                </div>
              </div>
              <Link
                to="/signup"
                className="mt-10 inline-flex w-fit items-center gap-2 rounded-[20px] bg-[#0f6c57] px-7 py-4 text-base font-semibold text-white shadow-[0_14px_30px_rgba(15,108,87,0.18)] transition hover:bg-[#0c5d4b]"
              >
                Start with a template
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 lg:mt-0">
              {workflowTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.title}
                    className="group grid min-w-0 gap-5 rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#fff8ef_100%)] p-6 shadow-[0_14px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-[#0f6c57]/30 hover:shadow-[0_20px_44px_rgba(15,23,42,0.10)] md:grid-cols-[88px_minmax(0,1fr)_auto] md:items-start"
                  >
                    <div className="flex items-start justify-between gap-4 md:block">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#e8f6f2] text-[#0f6c57] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[#d8e9e2] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0f6c57] md:hidden">
                          Live
                        </span>
                        <span className="rounded-full bg-[#edf5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f6c57] md:hidden">
                          {template.tag}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-slate-900 md:mt-1">
                        {template.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-slate-500">
                        {template.description}
                      </p>
                    </div>
                    <div className="hidden items-start justify-end gap-3 md:flex">
                      <span className="rounded-full border border-[#d8e9e2] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0f6c57]">
                        Live
                      </span>
                      <span className="inline-flex rounded-full bg-[#edf5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f6c57]">
                        {template.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            id="pricing"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-20 rounded-[34px] border border-white/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-[#0f6c57]">
                  <BarChart3 className="h-4 w-4" />
                  Pricing Direction
                </p>
                <h2 className="mt-4 font-display text-4xl font-bold text-slate-900">
                  Flexible for teams growing from simple tasks to automated operations.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
                  Clear tiers, no visual clutter, and enough flexibility to support teams from first launch to scaled delivery.
                </p>
              </div>
              <div className="rounded-[28px] border border-[#dcebe4] bg-[#f3faf7] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0f6c57]">Get started</p>
                <p className="mt-3 text-lg font-semibold leading-8 text-slate-800">
                  Launch your workspace and shape the plan around your team size.
                </p>
                <Link
                  to="/signup"
                  className="mt-6 inline-flex items-center gap-2 rounded-[18px] bg-[#0f6c57] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#0c5d4b]"
                >
                  Create your workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className="flex min-h-[220px] flex-col rounded-[26px] border border-slate-200 bg-[#fffaf6] p-7 transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.08)]"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">{tier.name}</p>
                  <p className="mt-4 font-display text-4xl font-bold text-slate-900">{tier.price}</p>
                  <p className="mt-4 text-base leading-8 text-slate-500">{tier.detail}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="about"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-20 overflow-hidden rounded-[34px] border border-white/80 bg-white px-5 py-7 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.09)] sm:px-8 sm:py-10"
          >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0f6c57]">
                  About Tasky Studio
                </p>
                <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-900">
                  A cleaner way to run work across teams, not just track tasks.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  We combine task tracking, approvals, automation, and AI assistance so your team can move faster with fewer manual follow-ups.
                </p>
                <div className="mt-8 rounded-[24px] border border-[#e7ddd2] bg-[#fffaf6] p-5 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Why teams choose it</p>
                  <p className="mt-3 text-xl font-semibold leading-9 text-slate-800">
                    One place to plan work, move approvals, automate follow-ups, and keep everyone aligned.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[#eadfd4] bg-[#fffaf6] p-6 shadow-sm">
                  <p className="text-4xl font-bold text-slate-900">30+</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">Workflow nodes</p>
                </div>
                <div className="rounded-[24px] border border-[#eadfd4] bg-[#fffaf6] p-6 shadow-sm">
                  <p className="text-4xl font-bold text-slate-900">4</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">Core execution layers</p>
                </div>
                <div className="rounded-[24px] border border-[#eadfd4] bg-[#fffaf6] p-6 shadow-sm">
                  <p className="text-4xl font-bold text-slate-900">AI</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">Built into workflows</p>
                </div>
                <div className="rounded-[24px] border border-[#eadfd4] bg-[#fffaf6] p-6 shadow-sm">
                  <p className="text-4xl font-bold text-slate-900">24/7</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">Automation coverage</p>
                </div>
              </div>
            </div>
          </motion.section>
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
            className="my-10 overflow-hidden rounded-[34px] bg-[#071f1a] px-7 py-8 text-white shadow-[0_28px_70px_rgba(7,31,26,0.26)] sm:px-10 lg:px-12"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-[#bce9dc]">
                  <Rocket className="h-4 w-4" />
                  Ready when your team is
                </div>
                <h2 className="mt-5 max-w-3xl font-display text-3xl font-black leading-tight sm:text-5xl">
                  Launch a cleaner task workflow before the next status meeting.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
                  Start with templates, invite your team, and automate the recurring handoffs that slow everyone down.
                </p>
              </div>
              <Link
                to={isAuthenticated ? dashboardPath : '/signup'}
                className="inline-flex items-center justify-center gap-3 rounded-[22px] bg-white px-7 py-4 text-base font-black text-[#071f1a] shadow-[0_18px_36px_rgba(0,0,0,0.18)] transition hover:bg-[#e8f6f2]"
              >
                {isAuthenticated ? 'Open Workspace' : 'Start Free'}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.section>
        </main>

        <footer className="px-2 py-8">
          <div className="flex flex-col gap-6 rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:flex-row md:items-center md:justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-10 w-10 grid-cols-2 gap-1 rounded-2xl bg-[#0f6c57] p-2 text-white shadow-[0_8px_18px_rgba(15,108,87,0.22)]">
                <span className="rounded-[5px] bg-white/95" />
                <span className="rounded-[5px] bg-white/75" />
                <span className="rounded-[5px] bg-white/75" />
                <span className="rounded-[5px] bg-white/95" />
              </div>
              <div>
                <p className="font-display text-xl font-bold tracking-tight text-slate-950">
                  Tasky Studio
                </p>
                <p className="text-sm text-slate-500">
                  Automate the work behind the work.
                </p>
              </div>
            </Link>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-600">
                {navItems.map((item) => (
                  <a key={item.label} href={item.href} className="transition hover:text-[#0f6c57]">
                    {item.label}
                  </a>
                ))}
                {footerLinks.map((item) => (
                  <a key={item.label} href={item.href} className="transition hover:text-[#0f6c57]">
                    {item.label}
                  </a>
                ))}
              </nav>
              <p className="text-sm font-medium text-slate-500">
                (c) {currentYear} Tasky Studio. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;

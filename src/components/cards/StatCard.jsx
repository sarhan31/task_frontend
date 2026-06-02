import { motion } from 'framer-motion';
import { cn } from '@utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  teal: {
    icon: 'bg-[#13856f] text-white',
    glow: 'shadow-[0_8px_24px_rgba(19,133,111,0.22)]',
    badge: 'bg-[#e8f6f2] text-[#13856f]',
    bar: 'bg-[#13856f]',
    ring: 'ring-[#13856f]/10',
  },
  peach: {
    icon: 'bg-[#f3b59e] text-white',
    glow: 'shadow-[0_8px_24px_rgba(243,181,158,0.35)]',
    badge: 'bg-[#fff4ef] text-[#c26a44]',
    bar: 'bg-[#f3b59e]',
    ring: 'ring-[#f3b59e]/10',
  },
  amber: {
    icon: 'bg-[#efbf91] text-white',
    glow: 'shadow-[0_8px_24px_rgba(239,191,145,0.4)]',
    badge: 'bg-[#fff8ef] text-[#b5722a]',
    bar: 'bg-[#efbf91]',
    ring: 'ring-[#efbf91]/10',
  },
  rose: {
    icon: 'bg-[#8d514f] text-white',
    glow: 'shadow-[0_8px_24px_rgba(141,81,79,0.25)]',
    badge: 'bg-[#fdf0ef] text-[#8d514f]',
    bar: 'bg-[#8d514f]',
    ring: 'ring-[#8d514f]/10',
  },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'teal',
  trend,
  subtitle,
  progress,
}) => {
  const c = colorMap[color] || colorMap.teal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-5 backdrop-blur-sm',
        'shadow-[0_4px_24px_rgba(90,55,20,0.09)] hover:shadow-[0_12px_40px_rgba(90,55,20,0.15)]',
        'transition-shadow duration-300 ring-4',
        c.ring
      )}
    >
      {/* Soft corner glow */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-current opacity-5 blur-2xl" />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </p>
          <h3 className="font-display text-3xl font-bold text-slate-900 leading-none">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <div className={cn('mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', c.badge)}>
              {trend.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}
            </div>
          )}
        </div>

        <div className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl', c.icon, c.glow)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4ddd0]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className={cn('h-full rounded-full', c.bar)}
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-slate-400">{progress}% of target</p>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;

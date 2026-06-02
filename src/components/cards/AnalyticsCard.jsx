import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@utils/cn';

const AnalyticsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'primary',
  delay = 0 
}) => {
  const colors = {
    primary: {
      bg: 'from-primary-500 to-primary-600',
      light: 'bg-primary-100',
      text: 'text-primary-600',
    },
    secondary: {
      bg: 'from-secondary-500 to-secondary-600',
      light: 'bg-secondary-100',
      text: 'text-secondary-600',
    },
    accent: {
      bg: 'from-accent-500 to-accent-600',
      light: 'bg-accent-100',
      text: 'text-accent-600',
    },
    success: {
      bg: 'from-green-500 to-green-600',
      light: 'bg-green-100',
      text: 'text-green-600',
    },
    warning: {
      bg: 'from-yellow-500 to-yellow-600',
      light: 'bg-yellow-100',
      text: 'text-yellow-600',
    },
  };

  const colorScheme = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="premium-card p-6 relative overflow-hidden group"
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl transition-opacity group-hover:opacity-20",
        colorScheme.bg
      )} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            colorScheme.light
          )}>
            <Icon className={cn("w-6 h-6", colorScheme.text)} />
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
              trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}>
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-display font-bold text-gray-900">{value}</p>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

export default AnalyticsCard;

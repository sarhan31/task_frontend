import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const GlassCard = ({ 
  children, 
  className, 
  hover = true,
  gradient = false,
  dark = false,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        dark 
          ? 'bg-dark-900/70 backdrop-blur-xl border border-white/10 shadow-glass'
          : 'bg-white/70 backdrop-blur-xl border border-white/20 shadow-glass',
        gradient && 'bg-gradient-to-br from-white/80 to-white/40',
        hover && 'hover:shadow-glow-lg',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

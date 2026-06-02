import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@utils/cn';

const AdvancedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  loading,
  icon: Icon,
  fullWidth,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-glow focus:ring-primary-500 hover:scale-105',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:shadow-glow focus:ring-secondary-500 hover:scale-105',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-glow focus:ring-accent-500 hover:scale-105',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-glow focus:ring-red-500 hover:scale-105',
    glass: 'bg-white/20 backdrop-blur-lg text-white border border-white/30 hover:bg-white/30',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        baseStyles, 
        variants[variant], 
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Glow effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      
      {Icon && !loading && (
        <Icon className="mr-2 h-4 w-4" />
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default AdvancedButton;

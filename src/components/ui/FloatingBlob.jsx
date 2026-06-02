import { motion } from 'framer-motion';

const FloatingBlob = ({ color = 'primary', size = 'md', delay = 0, className = '' }) => {
  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[32rem] h-[32rem]',
  };

  const colors = {
    primary: 'bg-primary-400',
    secondary: 'bg-secondary-400',
    accent: 'bg-accent-400',
    purple: 'bg-purple-400',
    pink: 'bg-pink-400',
  };

  return (
    <motion.div
      className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-70 ${sizes[size]} ${colors[color]} ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default FloatingBlob;

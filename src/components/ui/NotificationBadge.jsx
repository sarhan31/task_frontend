import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const NotificationBadge = ({ count, className }) => {
  if (!count || count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg',
        className
      )}
    >
      {count > 9 ? '9+' : count}
    </motion.div>
  );
};

export default NotificationBadge;

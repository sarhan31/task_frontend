import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@utils/cn';

const Drawer = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[4px]"
          />

          {/* Drawer Slide-out Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className={cn(
              'fixed inset-y-0 right-0 z-50 w-full bg-[#fff8f3] border-l border-[#ead8cb] shadow-[0_-8px_48px_rgba(90,55,20,0.18)] flex flex-col',
              sizes[size],
              className
            )}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#f4ddd0] bg-white/60 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
              <h2 className="min-w-0 truncate text-base font-bold text-slate-800 font-display sm:text-lg">
                {title || 'Details'}
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#e6d6ca] bg-white text-slate-500 shadow-sm transition hover:border-[#13856f]/40 hover:bg-[#e8f6f2] hover:text-[#13856f]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="relative z-0 flex-1 overflow-y-auto px-4 py-4 custom-scrollbar sm:px-6 sm:py-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;

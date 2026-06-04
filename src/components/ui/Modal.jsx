import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@utils/cn';
import Button from "@components/ui/Button";

const Modal = ({ isOpen, onClose, title, children, size = 'md', hideHeader = false, noPadding = false, className = '' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-2 sm:items-center sm:p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  'max-h-[calc(100vh-1rem)] w-full overflow-y-auto rounded-t-[24px] bg-white shadow-xl sm:max-h-[calc(100vh-2rem)] sm:rounded-[24px]',
                  sizes[size],
                  className
                )}
              >
                {!hideHeader && (
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-6">
                    <h3 className="min-w-0 truncate text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
                    <Button variant="custom" size="none"
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full p-2"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
                <div className={cn(!noPadding && "p-4 sm:p-6")}>{children}</div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

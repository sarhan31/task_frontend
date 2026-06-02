import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@utils/cn';

const Textarea = ({
  label,
  error,
  success,
  className,
  value: externalValue,
  onChange,
  placeholder,
  rows = 4,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const value = externalValue ?? '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 pl-0.5">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 resize-y',
            'bg-gray-50 focus:bg-white text-slate-800 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            error
              ? 'border-red-300 focus:border-red-500'
              : success
              ? 'border-green-300 focus:border-green-500'
              : 'border-gray-200 focus:border-primary-500',
            isFocused && !error && !success && 'shadow-[0_0_0_4px_rgba(99,102,241,0.1)]',
            className
          )}
          {...props}
        />
      </div>

      <AnimatePresence>
        {(error || success) && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={cn('mt-1.5 text-sm font-medium', error ? 'text-red-600' : 'text-green-600')}
          >
            {error || success}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Textarea;

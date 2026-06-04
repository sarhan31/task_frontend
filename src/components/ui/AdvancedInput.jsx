import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { cn } from '@utils/cn';
import Button from "@components/ui/Button";

const AdvancedInput = ({
  label,
  error,
  success,
  className,
  type = 'text',
  icon: Icon,
  showPasswordToggle,
  validation,
  value: externalValue,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fully controlled — no internal state
  const value = externalValue ?? '';
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasValue = value.length > 0 || isFocused;

  const baseClasses = cn(
    'w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200',
    'bg-gray-50 focus:bg-white',
    'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
    Icon && 'pl-12',
    (showPasswordToggle || validation) && 'pr-12',
    error
      ? 'border-red-300 focus:border-red-500'
      : success
      ? 'border-green-300 focus:border-green-500'
      : 'border-gray-200 focus:border-primary-500',
    isFocused && !error && !success && 'shadow-[0_0_0_4px_rgba(99,102,241,0.1)]',
    className
  );

  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-4 z-10 pointer-events-none">
            <Icon className={cn(
              'h-5 w-5 transition-colors duration-200',
              isFocused ? 'text-primary-600' : 'text-gray-400'
            )} />
          </div>
        )}

        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={rows}
            className={cn(baseClasses, 'resize-none')}
            {...props}
          />
        ) : (
          <input
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={baseClasses}
            {...props}
          />
        )}

        {showPasswordToggle && type === 'password' && !multiline && (
          <Button variant="custom" size="none"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        )}

        {validation && value && !showPasswordToggle && !multiline && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {validation(value) ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-red-400" />
            )}
          </div>
        )}
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

export default AdvancedInput;

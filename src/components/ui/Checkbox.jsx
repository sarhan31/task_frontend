import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const Checkbox = ({
  id,
  checked,
  onChange,
  label,
  className,
  disabled,
  ...props
}) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center gap-2.5 cursor-pointer select-none text-slate-700 font-medium text-sm',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        
        {/* Border and background outline */}
        <motion.div
          animate={{
            backgroundColor: checked ? '#13856f' : '#f8fafc',
            borderColor: checked ? '#13856f' : '#cbd5e1',
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            'h-5 w-5 rounded-md border-2 flex items-center justify-center transition-shadow',
            !disabled && 'hover:border-[#13856f]/60'
          )}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="h-3 w-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </motion.div>
      </div>

      {label && <span className="text-slate-700">{label}</span>}
    </label>
  );
};

export default Checkbox;

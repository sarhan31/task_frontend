import { cn } from '@utils/cn';
import { User } from 'lucide-react';

const Avatar = ({ src, alt, size = 'md', className }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-gray-200 flex items-center justify-center',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <User className="h-1/2 w-1/2 text-gray-500" />
      )}
    </div>
  );
};

export default Avatar;

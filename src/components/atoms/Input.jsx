import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  type = 'text',
  error,
  icon,
  iconPosition = 'left',
  className = '',
  placeholder,
  ...props 
}, ref) => {
  const baseClasses = 'block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200 focus:border-primary focus:ring-primary focus:ring-1';
  const errorClasses = error ? 'border-error focus:border-error focus:ring-error' : '';
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
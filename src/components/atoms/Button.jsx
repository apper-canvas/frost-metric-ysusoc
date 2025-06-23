import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm hover:shadow-md',
    secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-sm hover:shadow-md',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error shadow-sm hover:shadow-md',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary',
    link: 'text-primary hover:text-primary/80 focus:ring-primary underline-offset-4 hover:underline'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  const buttonContent = (
    <>
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`${iconSizes[size]} animate-spin`}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className={iconSizes[size]} />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className={iconSizes[size]} />
      )}
    </>
  );

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;
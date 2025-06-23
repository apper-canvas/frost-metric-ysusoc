import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  clickable = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverClasses = hover || clickable ? 'hover:shadow-md transition-shadow duration-200' : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  const CardComponent = clickable ? motion.div : 'div';
  const motionProps = clickable ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <CardComponent
      className={classes}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
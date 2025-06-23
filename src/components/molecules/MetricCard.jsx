import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon, 
  gradient = false,
  className = '' 
}) => {
  const changeColor = changeType === 'positive' ? 'text-success' : 'text-error';
  const changeIcon = changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';

  return (
    <Card className={`p-6 ${gradient ? 'bg-gradient-surface' : ''} ${className}`} hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <motion.p 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-gray-900"
          >
            {value}
          </motion.p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${changeColor}`}>
              <ApperIcon name={changeIcon} className="w-4 h-4" />
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="w-6 h-6 text-primary" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
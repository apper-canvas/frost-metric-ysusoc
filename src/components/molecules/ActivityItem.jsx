import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const ActivityItem = ({ activity, contact, showContact = true }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return 'Phone';
      case 'email': return 'Mail';
      case 'meeting': return 'Users';
      case 'note': return 'FileText';
      default: return 'Activity';
    }
  };

const getActivityColor = (type, direction = null) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600';
      case 'email': 
        if (direction === 'sent') return 'bg-green-100 text-green-600';
        if (direction === 'received') return 'bg-blue-100 text-blue-600';
        return 'bg-green-100 text-green-600';
      case 'meeting': return 'bg-purple-100 text-purple-600';
      case 'note': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors"
>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type, activity.direction)}`}>
        <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">
              {activity.subject}
            </h4>
{showContact && contact && (
              <p className="text-sm text-gray-600 mt-1">
                with {contact.firstName} {contact.lastName}
              </p>
            )}

            {activity.type === 'email' && (activity.sender || activity.recipient) && (
              <div className="text-sm text-gray-600 mt-1">
                {activity.direction === 'sent' ? (
                  <span>To: {activity.recipient}</span>
                ) : (
                  <span>From: {activity.sender}</span>
                )}
              </div>
            )}

            {activity.notes && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {activity.notes}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
            <time className="text-xs text-gray-500">
              {format(new Date(activity.date), 'MMM dd, yyyy')}
            </time>
            <time className="text-xs text-gray-500">
              {format(new Date(activity.date), 'h:mm a')}
            </time>
            {activity.duration && (
              <span className="text-xs text-gray-500">
                {formatDuration(activity.duration)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityItem;
import { motion } from 'framer-motion';
import { format, isAfter } from 'date-fns';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TaskItem = ({ task, contact, onComplete, onEdit, onDelete }) => {
  const isOverdue = task.status !== 'completed' && isAfter(new Date(), new Date(task.dueDate));
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const handleComplete = () => {
    onComplete(task);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleComplete}
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.status === 'completed'
              ? 'bg-success border-success text-white'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {task.status === 'completed' && (
            <ApperIcon name="Check" className="w-3 h-3" />
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-medium ${
              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            <div className="flex gap-1 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
              >
                <ApperIcon name="Edit2" className="w-3 h-3" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-error hover:bg-error/10 rounded transition-colors"
              >
                <ApperIcon name="Trash2" className="w-3 h-3" />
              </motion.button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Badge 
              variant={getPriorityColor(task.priority)}
              size="sm"
              icon="Flag"
            >
              {task.priority}
            </Badge>
            
            <Badge 
              variant={getStatusColor(task.status)}
              size="sm"
            >
              {task.status}
            </Badge>

            {contact && (
              <Badge variant="default" size="sm" icon="User">
                {contact.firstName} {contact.lastName}
              </Badge>
            )}

            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-error' : 'text-gray-500'
            }`}>
              <ApperIcon name="Calendar" className="w-3 h-3" />
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              {isOverdue && (
                <Badge variant="error" size="sm">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
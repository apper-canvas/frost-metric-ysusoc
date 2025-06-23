import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const DealCard = ({ deal, contact, draggable = true, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return 'success';
    if (probability >= 50) return 'warning';
    return 'error';
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(deal);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(deal);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="p-4 border-l-4 border-l-primary">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {deal.title}
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

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(deal.value)}
            </span>
            <Badge 
              variant={getProbabilityColor(deal.probability)}
              size="sm"
            >
              {deal.probability}%
            </Badge>
          </div>

          {contact && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <ApperIcon name="User" className="w-3 h-3" />
              <span className="truncate">
                {contact.firstName} {contact.lastName}
              </span>
            </div>
          )}

          {deal.expectedCloseDate && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <ApperIcon name="Calendar" className="w-3 h-3" />
              {format(new Date(deal.expectedCloseDate), 'MMM dd, yyyy')}
            </div>
          )}
        </div>

        {deal.notes && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {deal.notes}
          </p>
        )}
      </Card>
    </motion.div>
  );
};

export default DealCard;
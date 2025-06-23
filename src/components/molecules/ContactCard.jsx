import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ContactCard = ({ contact, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/contacts/${contact.Id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(contact);
  };

  const handleDelete = (e) => {
    e.stopPropagation();  
    onDelete(contact);
  };

  return (
    <Card clickable onClick={handleClick} className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">
                {contact.firstName?.[0]}{contact.lastName?.[0]}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {contact.firstName} {contact.lastName}
              </h3>
              <p className="text-sm text-gray-500 truncate">{contact.position}</p>
            </div>
          </div>
          
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Building2" className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{contact.company}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Mail" className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Phone" className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{contact.phone}</span>
              </div>
            )}
          </div>

          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {contact.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {tag}
                </Badge>
              ))}
              {contact.tags.length > 2 && (
                <Badge variant="default" size="sm">
                  +{contact.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 ml-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-error hover:bg-error/10 rounded-md transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;
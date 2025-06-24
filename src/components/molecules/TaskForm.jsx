import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const TaskForm = ({ task, contacts, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contactId: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        contactId: task.contactId || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedTo: task.assignedTo || ''
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assigned to is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        contactId: formData.contactId ? parseInt(formData.contactId, 10) : null,
        dueDate: new Date(formData.dueDate).toISOString()
      };
      
      await onSubmit(submitData);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-success' },
    { value: 'medium', label: 'Medium', color: 'text-warning' },
    { value: 'high', label: 'High', color: 'text-error' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Enter task title"
          icon="Type"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200 focus:border-primary focus:ring-primary focus:ring-1"
            placeholder="Enter task description (optional)"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Contact
          </label>
          <select
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200 focus:border-primary focus:ring-primary focus:ring-1"
          >
            <option value="">Select a contact (optional)</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.firstName} {contact.lastName} - {contact.company}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200 focus:border-primary focus:ring-primary focus:ring-1"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 shadow-sm transition-all duration-200 focus:border-primary focus:ring-primary focus:ring-1"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
          icon="Calendar"
        />

        <Input
          label="Assigned To"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          error={errors.assignedTo}
          placeholder="Enter assignee name"
          icon="User"
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            icon={loading ? "Loader2" : "Check"}
            className="flex-1"
          >
            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            icon="X"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
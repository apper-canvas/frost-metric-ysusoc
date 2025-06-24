import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const DealForm = ({ deal, contacts, stages, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'Lead',
    contactId: '',
    probability: 25,
    expectedCloseDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        value: deal.value || '',
        stage: deal.stage || 'Lead',
        contactId: deal.contactId || '',
        probability: deal.probability || 25,
        expectedCloseDate: deal.expectedCloseDate ? 
          new Date(deal.expectedCloseDate).toISOString().split('T')[0] : '',
        notes: deal.notes || ''
      });
    }
  }, [deal]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required';
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }

    if (!formData.contactId) {
      newErrors.contactId = 'Contact is required';
    }

    if (formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
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
    
    if (!validateForm()) return;

    const submitData = {
      title: formData.title.trim(),
      value: parseFloat(formData.value),
      stage: formData.stage,
      contactId: parseInt(formData.contactId, 10),
      probability: parseInt(formData.probability, 10),
      expectedCloseDate: formData.expectedCloseDate ? 
        new Date(formData.expectedCloseDate).toISOString() : null,
      notes: formData.notes.trim()
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const probabilityOptions = [
    { value: 25, label: '25% - Low' },
    { value: 50, label: '50% - Medium' },
    { value: 75, label: '75% - High' },
    { value: 90, label: '90% - Very High' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {deal ? 'Edit Deal' : 'Create New Deal'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter deal title"
                error={errors.title}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Value *
              </label>
              <Input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                error={errors.value}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stage
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              >
                {stages?.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact *
              </label>
              <select
                name="contactId"
                value={formData.contactId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.contactId ? 'border-error' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select a contact</option>
                {contacts?.map((contact) => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.firstName} {contact.lastName} - {contact.company}
                  </option>
                ))}
              </select>
              {errors.contactId && (
                <p className="mt-1 text-sm text-error">{errors.contactId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Probability (%)
              </label>
              <select
                name="probability"
                value={formData.probability}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              >
                {probabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Close Date
              </label>
              <Input
                type="date"
                name="expectedCloseDate"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Add any additional notes about this deal..."
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default DealForm;
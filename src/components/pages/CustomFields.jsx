import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import customFieldService, { fieldTypes, entityTypes } from '@/services/api/customFieldService';

const CustomFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    type: 'text',
    entityType: 'contacts',
    required: false,
    defaultValue: '',
    placeholder: '',
    helpText: '',
    options: [],
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load fields
  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      const data = await customFieldService.getAll();
      setFields(data);
      setError(null);
    } catch (err) {
      setError('Failed to load custom fields');
      toast.error('Failed to load custom fields');
    } finally {
      setLoading(false);
    }
  };

  // Filter fields
  const filteredFields = fields.filter(field => {
    const matchesEntity = selectedEntity === 'all' || field.entityType === selectedEntity;
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEntity && matchesSearch;
  });

  // Form handlers
  const handleOpenModal = (field = null) => {
    if (field) {
      setEditingField(field);
      setFormData({
        name: field.name,
        label: field.label,
        type: field.type,
        entityType: field.entityType,
        required: field.required,
        defaultValue: field.defaultValue || '',
        placeholder: field.placeholder || '',
        helpText: field.helpText || '',
        options: field.options || [],
        isActive: field.isActive
      });
    } else {
      setEditingField(null);
      setFormData({
        name: '',
        label: '',
        type: 'text',
        entityType: 'contacts',
        required: false,
        defaultValue: '',
        placeholder: '',
        helpText: '',
        options: [],
        isActive: true
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingField(null);
    setFormData({
      name: '',
      label: '',
      type: 'text',
      entityType: 'contacts',
      required: false,
      defaultValue: '',
      placeholder: '',
      helpText: '',
      options: [],
      isActive: true
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleOptionAdd = () => {
    const newOption = prompt('Enter option value:');
    if (newOption && newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
    }
  };

  const handleOptionRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingField) {
        await customFieldService.update(editingField.Id, formData);
        toast.success('Field updated successfully');
      } else {
        await customFieldService.create(formData);
        toast.success('Field created successfully');
      }
      
      await loadFields();
      handleCloseModal();
    } catch (err) {
      try {
        const errors = JSON.parse(err.message);
        setFormErrors(errors);
        toast.error('Please fix the form errors');
      } catch {
        toast.error(err.message || 'Failed to save field');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (field) => {
    if (!confirm(`Are you sure you want to delete the field "${field.label}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await customFieldService.delete(field.Id);
      toast.success('Field deleted successfully');
      await loadFields();
    } catch (err) {
      toast.error('Failed to delete field');
    }
  };

  const getFieldTypeIcon = (type) => {
    const icons = {
      text: 'Type',
      number: 'Hash',
      email: 'Mail',
      phone: 'Phone',
      date: 'Calendar',
      select: 'ChevronDown',
      checkbox: 'CheckSquare',
      textarea: 'FileText'
    };
    return icons[type] || 'Type';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading custom fields...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Fields</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadFields} icon="RefreshCw">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Custom Fields</h1>
            <p className="text-gray-600 mt-1">
              Create and manage custom fields for contacts, deals, and tasks.
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} icon="Plus">
            Add Field
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedEntity === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedEntity('all')}
            >
              All
            </Button>
            {Object.entries(entityTypes).map(([key, type]) => (
              <Button
                key={key}
                variant={selectedEntity === key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedEntity(key)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Fields List */}
      {filteredFields.length === 0 ? (
        <Card className="p-8 text-center">
          <ApperIcon name="Database" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Fields Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedEntity !== 'all' 
              ? 'No fields match your current filters.'
              : 'Get started by creating your first custom field.'
            }
          </p>
          {!searchTerm && selectedEntity === 'all' && (
            <Button onClick={() => handleOpenModal()} icon="Plus">
              Add Your First Field
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFields.map((field, index) => (
            <motion.div
              key={field.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name={getFieldTypeIcon(field.type)} className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{field.label}</h3>
                        {field.required && (
                          <Badge variant="error" size="sm">Required</Badge>
                        )}
                        {!field.isActive && (
                          <Badge variant="secondary" size="sm">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Name:</span> {field.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span> {fieldTypes[field.type]?.label}
                        </p>
                        <Badge variant="secondary" size="sm">
                          {entityTypes[field.entityType]?.label}
                        </Badge>
                      </div>
                      {field.helpText && (
                        <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => handleOpenModal(field)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(field)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                
                {field.type === 'select' && field.options && field.options.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
                    <div className="flex flex-wrap gap-1">
                      {field.options.map((option, idx) => (
                        <Badge key={idx} variant="secondary" size="sm">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Field Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingField ? 'Edit Field' : 'Create Field'}
                </h2>
                <Button variant="ghost" size="sm" icon="X" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Name <span className="text-error">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., company_size"
                      error={formErrors.name}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used in code (lowercase, underscores only)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Label <span className="text-error">*</span>
                    </label>
                    <Input
                      value={formData.label}
                      onChange={(e) => handleInputChange('label', e.target.value)}
                      placeholder="e.g., Company Size"
                      error={formErrors.label}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Displayed to users
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Type <span className="text-error">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {Object.entries(fieldTypes).map(([key, type]) => (
                        <option key={key} value={key}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entity Type <span className="text-error">*</span>
                    </label>
                    <select
                      value={formData.entityType}
                      onChange={(e) => handleInputChange('entityType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {Object.entries(entityTypes).map(([key, type]) => (
                        <option key={key} value={key}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder Text
                  </label>
                  <Input
                    value={formData.placeholder}
                    onChange={(e) => handleInputChange('placeholder', e.target.value)}
                    placeholder="Enter placeholder text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Help Text
                  </label>
                  <textarea
                    value={formData.helpText}
                    onChange={(e) => handleInputChange('helpText', e.target.value)}
                    placeholder="Optional description for users"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={2}
                  />
                </div>

                {formData.type === 'select' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Options <span className="text-error">*</span>
                    </label>
                    <div className="space-y-2">
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...formData.options];
                              newOptions[index] = e.target.value;
                              handleInputChange('options', newOptions);
                            }}
                            placeholder="Option value"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon="X"
                            onClick={() => handleOptionRemove(index)}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        icon="Plus"
                        onClick={handleOptionAdd}
                      >
                        Add Option
                      </Button>
                    </div>
                    {formErrors.options && (
                      <p className="text-error text-sm mt-1">{formErrors.options}</p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.required}
                      onChange={(e) => handleInputChange('required', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Required field</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={submitting}
                    icon={editingField ? "Save" : "Plus"}
                  >
                    {editingField ? 'Update Field' : 'Create Field'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomFields;
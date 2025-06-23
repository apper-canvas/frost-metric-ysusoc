import mockCustomFields from '@/services/mockData/customFields.json';

// Mock data storage
let customFields = [...mockCustomFields];
let nextId = Math.max(...customFields.map(f => f.Id)) + 1;

// Field type definitions
export const fieldTypes = {
  text: { label: 'Text', inputType: 'text', validation: { maxLength: 255 } },
  number: { label: 'Number', inputType: 'number', validation: { min: 0 } },
  email: { label: 'Email', inputType: 'email', validation: { format: 'email' } },
  phone: { label: 'Phone', inputType: 'tel', validation: { format: 'phone' } },
  date: { label: 'Date', inputType: 'date', validation: {} },
  select: { label: 'Select', inputType: 'select', validation: { options: [] } },
  checkbox: { label: 'Checkbox', inputType: 'checkbox', validation: {} },
  textarea: { label: 'Textarea', inputType: 'textarea', validation: { maxLength: 1000 } }
};

export const entityTypes = {
  contacts: { label: 'Contacts', value: 'contacts' },
  deals: { label: 'Deals', value: 'deals' },
  tasks: { label: 'Tasks', value: 'tasks' }
};

// Validation functions
const validateField = (field) => {
  const errors = {};
  
  if (!field.name || field.name.trim().length === 0) {
    errors.name = 'Field name is required';
  }
  
  if (!field.label || field.label.trim().length === 0) {
    errors.label = 'Field label is required';
  }
  
  if (!field.type || !fieldTypes[field.type]) {
    errors.type = 'Valid field type is required';
  }
  
  if (!field.entityType || !entityTypes[field.entityType]) {
    errors.entityType = 'Valid entity type is required';
  }
  
  if (field.type === 'select' && (!field.options || field.options.length === 0)) {
    errors.options = 'Select fields must have at least one option';
  }
  
  // Check for duplicate field names within the same entity
  const existingField = customFields.find(f => 
    f.name === field.name && 
    f.entityType === field.entityType && 
    f.Id !== field.Id
  );
  
  if (existingField) {
    errors.name = 'Field name must be unique within the entity type';
  }
  
  return errors;
};

// Service functions
export const getAll = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...customFields];
};

export const getById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const field = customFields.find(f => f.Id === parseInt(id));
  return field ? { ...field } : null;
};

export const getByEntity = async (entityType) => {
  await new Promise(resolve => setTimeout(resolve, 250));
  return customFields.filter(f => f.entityType === entityType).map(f => ({ ...f }));
};

export const create = async (fieldData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newField = {
    ...fieldData,
    Id: nextId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const errors = validateField(newField);
  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }
  
  customFields.push(newField);
  return { ...newField };
};

export const update = async (id, fieldData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = customFields.findIndex(f => f.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Field not found');
  }
  
  const updatedField = {
    ...customFields[index],
    ...fieldData,
    Id: parseInt(id), // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  const errors = validateField(updatedField);
  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }
  
  customFields[index] = updatedField;
  return { ...updatedField };
};

export const deleteField = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = customFields.findIndex(f => f.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Field not found');
  }
  
  const deletedField = customFields[index];
  customFields.splice(index, 1);
  return { ...deletedField };
};

// Utility functions
export const getFieldsByType = async (type) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return customFields.filter(f => f.type === type).map(f => ({ ...f }));
};

export const validateFieldValue = (field, value) => {
  if (field.required && (value === null || value === undefined || value === '')) {
    return `${field.label} is required`;
  }
  
  if (!value && !field.required) {
    return null;
  }
  
  const fieldType = fieldTypes[field.type];
  if (!fieldType) {
    return 'Invalid field type';
  }
  
  // Type-specific validation
  switch (field.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
      break;
      
    case 'phone':
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        return 'Please enter a valid phone number';
      }
      break;
      
    case 'number':
      if (isNaN(value)) {
        return 'Please enter a valid number';
      }
      break;
      
    case 'select':
      if (field.options && !field.options.includes(value)) {
        return 'Please select a valid option';
      }
      break;
      
    case 'text':
    case 'textarea':
      if (fieldType.validation.maxLength && value.length > fieldType.validation.maxLength) {
        return `Maximum length is ${fieldType.validation.maxLength} characters`;
      }
      break;
  }
  
  return null;
};

export default {
  getAll,
  getById,
  getByEntity,
  create,
  update,
  delete: deleteField,
  getFieldsByType,
  validateFieldValue,
  fieldTypes,
  entityTypes
};
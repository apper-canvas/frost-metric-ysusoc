import { toast } from 'react-toastify';

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

class CustomFieldService {
  constructor() {
    this.tableName = 'custom_field';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  ensureClient() {
    if (!this.apperClient) {
      this.initializeClient();
    }
    if (!this.apperClient) {
      throw new Error('ApperClient not initialized');
    }
  }

  async getAll() {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "label" } },
        { field: { Name: "type" } },
        { field: { Name: "entity_type" } },
        { field: { Name: "required" } },
        { field: { Name: "options" } },
        { field: { Name: "default_value" } },
        { field: { Name: "placeholder" } },
        { field: { Name: "help_text" } },
        { field: { Name: "order" } },
        { field: { Name: "is_active" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(field => ({
      Id: field.Id,
      name: field.Name || '',
      label: field.label || '',
      type: field.type || 'text',
      entityType: field.entity_type || 'contacts',
      required: field.required || false,
      options: field.options ? field.options.split(',').map(o => o.trim()).filter(o => o) : [],
      defaultValue: field.default_value || '',
      placeholder: field.placeholder || '',
      helpText: field.help_text || '',
      order: field.order || 0,
      isActive: field.is_active || true,
      createdAt: field.created_at,
      updatedAt: field.updated_at
    })) || [];
  }

  async getById(id) {
    this.ensureClient();

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "label" } },
        { field: { Name: "type" } },
        { field: { Name: "entity_type" } },
        { field: { Name: "required" } },
        { field: { Name: "options" } },
        { field: { Name: "default_value" } },
        { field: { Name: "placeholder" } },
        { field: { Name: "help_text" } },
        { field: { Name: "order" } },
        { field: { Name: "is_active" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ]
    };

    const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      return null;
    }

    const field = response.data;
    return {
      Id: field.Id,
      name: field.Name || '',
      label: field.label || '',
      type: field.type || 'text',
      entityType: field.entity_type || 'contacts',
      required: field.required || false,
      options: field.options ? field.options.split(',').map(o => o.trim()).filter(o => o) : [],
      defaultValue: field.default_value || '',
      placeholder: field.placeholder || '',
      helpText: field.help_text || '',
      order: field.order || 0,
      isActive: field.is_active || true,
      createdAt: field.created_at,
      updatedAt: field.updated_at
    };
  }

  async getByEntity(entityType) {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "label" } },
        { field: { Name: "type" } },
        { field: { Name: "entity_type" } },
        { field: { Name: "required" } },
        { field: { Name: "options" } },
        { field: { Name: "default_value" } },
        { field: { Name: "placeholder" } },
        { field: { Name: "help_text" } },
        { field: { Name: "order" } },
        { field: { Name: "is_active" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      where: [{
        FieldName: "entity_type",
        Operator: "EqualTo",
        Values: [entityType]
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(field => ({
      Id: field.Id,
      name: field.Name || '',
      label: field.label || '',
      type: field.type || 'text',
      entityType: field.entity_type || 'contacts',
      required: field.required || false,
      options: field.options ? field.options.split(',').map(o => o.trim()).filter(o => o) : [],
      defaultValue: field.default_value || '',
      placeholder: field.placeholder || '',
      helpText: field.help_text || '',
      order: field.order || 0,
      isActive: field.is_active || true,
      createdAt: field.created_at,
      updatedAt: field.updated_at
    })) || [];
  }

  async create(fieldData) {
    this.ensureClient();

    const params = {
      records: [
        {
          Name: fieldData.name || '',
          label: fieldData.label || '',
          type: fieldData.type || 'text',
          entity_type: fieldData.entityType || 'contacts',
          required: fieldData.required || false,
          options: Array.isArray(fieldData.options) ? fieldData.options.join(',') : '',
          default_value: fieldData.defaultValue || '',
          placeholder: fieldData.placeholder || '',
          help_text: fieldData.helpText || '',
          order: fieldData.order || 0,
          is_active: fieldData.isActive !== undefined ? fieldData.isActive : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    };

    const response = await this.apperClient.createRecord(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        const created = successfulRecords[0].data;
        return {
          Id: created.Id,
          name: created.Name || '',
          label: created.label || '',
          type: created.type || 'text',
          entityType: created.entity_type || 'contacts',
          required: created.required || false,
          options: created.options ? created.options.split(',').map(o => o.trim()).filter(o => o) : [],
          defaultValue: created.default_value || '',
          placeholder: created.placeholder || '',
          helpText: created.help_text || '',
          order: created.order || 0,
          isActive: created.is_active || true,
          createdAt: created.created_at,
          updatedAt: created.updated_at
        };
      }
    }

    throw new Error('Failed to create custom field');
  }

  async update(id, fieldData) {
    this.ensureClient();

    const params = {
      records: [
        {
          Id: parseInt(id),
          Name: fieldData.name || '',
          label: fieldData.label || '',
          type: fieldData.type || 'text',
          entity_type: fieldData.entityType || 'contacts',
          required: fieldData.required || false,
          options: Array.isArray(fieldData.options) ? fieldData.options.join(',') : '',
          default_value: fieldData.defaultValue || '',
          placeholder: fieldData.placeholder || '',
          help_text: fieldData.helpText || '',
          order: fieldData.order || 0,
          is_active: fieldData.isActive !== undefined ? fieldData.isActive : true,
          updated_at: new Date().toISOString()
        }
      ]
    };

    const response = await this.apperClient.updateRecord(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        const updated = successfulRecords[0].data;
        return {
          Id: updated.Id,
          name: updated.Name || '',
          label: updated.label || '',
          type: updated.type || 'text',
          entityType: updated.entity_type || 'contacts',
          required: updated.required || false,
          options: updated.options ? updated.options.split(',').map(o => o.trim()).filter(o => o) : [],
          defaultValue: updated.default_value || '',
          placeholder: updated.placeholder || '',
          helpText: updated.help_text || '',
          order: updated.order || 0,
          isActive: updated.is_active || true,
          createdAt: updated.created_at,
          updatedAt: updated.updated_at
        };
      }
    }

    throw new Error('Failed to update custom field');
  }

  async delete(id) {
    this.ensureClient();

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await this.apperClient.deleteRecord(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        
        throw new Error('Failed to delete custom field');
      }
    }

    return true;
  }

  async getFieldsByType(type) {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "label" } },
        { field: { Name: "type" } },
        { field: { Name: "entity_type" } },
        { field: { Name: "required" } },
        { field: { Name: "options" } },
        { field: { Name: "default_value" } },
        { field: { Name: "placeholder" } },
        { field: { Name: "help_text" } },
        { field: { Name: "order" } },
        { field: { Name: "is_active" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      where: [{
        FieldName: "type",
        Operator: "EqualTo",
        Values: [type]
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(field => ({
      Id: field.Id,
      name: field.Name || '',
      label: field.label || '',
      type: field.type || 'text',
      entityType: field.entity_type || 'contacts',
      required: field.required || false,
      options: field.options ? field.options.split(',').map(o => o.trim()).filter(o => o) : [],
      defaultValue: field.default_value || '',
      placeholder: field.placeholder || '',
      helpText: field.help_text || '',
      order: field.order || 0,
      isActive: field.is_active || true,
      createdAt: field.created_at,
      updatedAt: field.updated_at
    })) || [];
  }

  validateFieldValue(field, value) {
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
  }
}

const customFieldService = new CustomFieldService();

// Service functions for compatibility
export const getAll = async () => customFieldService.getAll();
export const getById = async (id) => customFieldService.getById(id);
export const getByEntity = async (entityType) => customFieldService.getByEntity(entityType);
export const create = async (fieldData) => customFieldService.create(fieldData);
export const update = async (id, fieldData) => customFieldService.update(id, fieldData);
export const deleteField = async (id) => customFieldService.delete(id);
export const getFieldsByType = async (type) => customFieldService.getFieldsByType(type);
export const validateFieldValue = (field, value) => customFieldService.validateFieldValue(field, value);

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
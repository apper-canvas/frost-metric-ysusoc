import { toast } from 'react-toastify';

class ContactService {
  constructor() {
    this.tableName = 'app_contact';
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
        { field: { Name: "first_name" } },
        { field: { Name: "last_name" } },
        { field: { Name: "email" } },
        { field: { Name: "phone" } },
        { field: { Name: "company" } },
        { field: { Name: "position" } },
        { field: { Name: "notes" } },
        { field: { Name: "Tags" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(contact => ({
      Id: contact.Id,
      firstName: contact.first_name || '',
      lastName: contact.last_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      notes: contact.notes || '',
      tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      createdAt: contact.created_at,
      updatedAt: contact.updated_at
    })) || [];
  }

  async getById(id) {
    this.ensureClient();

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "first_name" } },
        { field: { Name: "last_name" } },
        { field: { Name: "email" } },
        { field: { Name: "phone" } },
        { field: { Name: "company" } },
        { field: { Name: "position" } },
        { field: { Name: "notes" } },
        { field: { Name: "Tags" } },
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
      throw new Error('Contact not found');
    }

    const contact = response.data;
    return {
      Id: contact.Id,
      firstName: contact.first_name || '',
      lastName: contact.last_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      notes: contact.notes || '',
      tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      createdAt: contact.created_at,
      updatedAt: contact.updated_at
    };
  }

async create(contactData) {
    this.ensureClient();

    // Validate required fields before sending to API
    if (!contactData.firstName || !contactData.firstName.trim()) {
      throw new Error('First name is required');
    }
    if (!contactData.lastName || !contactData.lastName.trim()) {
      throw new Error('Last name is required');
    }
    if (!contactData.email || !contactData.email.trim()) {
      throw new Error('Email is required');
    }

    // Ensure proper field mapping from camelCase to database snake_case
    const params = {
      records: [
        {
          Name: `${contactData.firstName.trim()} ${contactData.lastName.trim()}`,
          first_name: contactData.firstName.trim(),
          last_name: contactData.lastName.trim(),
          email: contactData.email.trim(),
          phone: contactData.phone?.trim() || '',
          company: contactData.company?.trim() || '',
          position: contactData.position?.trim() || '',
          notes: contactData.notes?.trim() || '',
          Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || ''),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    };

try {
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || 'Failed to create contact');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          // Collect all error messages for user feedback
          let errorMessages = [];
          failedRecords.forEach(record => {
            if (record.errors && Array.isArray(record.errors)) {
              record.errors.forEach(error => {
                const fieldLabel = error.fieldLabel || 'Field';
                const message = error.message || 'Validation error';
                errorMessages.push(`${fieldLabel}: ${message}`);
                toast.error(`${fieldLabel}: ${message}`);
              });
            }
            if (record.message) {
              errorMessages.push(record.message);
              toast.error(record.message);
            }
          });
          
          throw new Error(errorMessages.length > 0 ? errorMessages[0] : 'Failed to create contact');
        }
        
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data;
          return {
            Id: created.Id,
            firstName: created.first_name || '',
            lastName: created.last_name || '',
            email: created.email || '',
            phone: created.phone || '',
            company: created.company || '',
            position: created.position || '',
            notes: created.notes || '',
            tags: created.Tags ? created.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            createdAt: created.created_at,
            updatedAt: created.updated_at
          };
        }
      }

      throw new Error('No successful records returned from create operation');
    } catch (error) {
      // Re-throw validation errors with original message
      if (error.message.includes('required') || 
          error.message.includes('Field:') ||
          error.message.includes('validation') ||
          error.message.toLowerCase().includes('email')) {
        throw error;
      }
      
      // For network or API errors, provide a more helpful message
      console.error('Contact creation error:', error);
      if (error.message.includes('fetch') || error.message.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw new Error('Failed to create contact. Please check your input and try again.');
    }
  }

  async update(id, contactData) {
    this.ensureClient();

    const params = {
      records: [
        {
          Id: parseInt(id),
          Name: `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim(),
          first_name: contactData.firstName || '',
          last_name: contactData.lastName || '',
          email: contactData.email || '',
          phone: contactData.phone || '',
          company: contactData.company || '',
          position: contactData.position || '',
          notes: contactData.notes || '',
          Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : '',
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
          firstName: updated.first_name || '',
          lastName: updated.last_name || '',
          email: updated.email || '',
          phone: updated.phone || '',
          company: updated.company || '',
          position: updated.position || '',
          notes: updated.notes || '',
          tags: updated.Tags ? updated.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          createdAt: updated.created_at,
          updatedAt: updated.updated_at
        };
      }
    }

    throw new Error('Failed to update contact');
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
        
        throw new Error('Failed to delete contact');
      }
    }

    return true;
  }

  async search(query) {
    if (!query) return this.getAll();
    
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "first_name" } },
        { field: { Name: "last_name" } },
        { field: { Name: "email" } },
        { field: { Name: "phone" } },
        { field: { Name: "company" } },
        { field: { Name: "position" } },
        { field: { Name: "notes" } },
        { field: { Name: "Tags" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      whereGroups: [{
        operator: "OR",
        subGroups: [
          {
            conditions: [{
              fieldName: "first_name",
              operator: "Contains",
              values: [query]
            }],
            operator: "OR"
          },
          {
            conditions: [{
              fieldName: "last_name", 
              operator: "Contains",
              values: [query]
            }],
            operator: "OR"
          },
          {
            conditions: [{
              fieldName: "email",
              operator: "Contains", 
              values: [query]
            }],
            operator: "OR"
          },
          {
            conditions: [{
              fieldName: "company",
              operator: "Contains",
              values: [query]
            }],
            operator: "OR"
          }
        ]
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(contact => ({
      Id: contact.Id,
      firstName: contact.first_name || '',
      lastName: contact.last_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      notes: contact.notes || '',
      tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      createdAt: contact.created_at,
      updatedAt: contact.updated_at
    })) || [];
  }

  async advancedFilter(filterConfig) {
    if (!filterConfig || !filterConfig.conditions || filterConfig.conditions.length === 0) {
      return this.getAll();
    }

    // For now, return all contacts as advanced filtering would require complex query building
    return this.getAll();
  }

  async getFilterFields() {
    return [
      { key: 'firstName', label: 'First Name', type: 'text' },
      { key: 'lastName', label: 'Last Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'position', label: 'Position', type: 'text' },
      { key: 'tags', label: 'Tags', type: 'array' },
      { key: 'notes', label: 'Notes', type: 'text' },
      { key: 'createdAt', label: 'Created Date', type: 'date' },
      { key: 'updatedAt', label: 'Updated Date', type: 'date' }
    ];
  }
}

export default new ContactService();
import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    this.tableName = 'task';
    this.statuses = ['pending', 'in-progress', 'completed', 'overdue'];
    this.priorities = ['low', 'medium', 'high'];
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
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "assigned_to" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "created_at" } }
      ],
      orderBy: [{
        fieldName: "due_date",
        sorttype: "ASC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(task => ({
      Id: task.Id,
      title: task.title || task.Name || '',
      description: task.description || '',
      assignedTo: task.assigned_to || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.due_date,
      contactId: task.contact_id,
      dealId: task.deal_id,
      createdAt: task.created_at
    })) || [];
  }

  async getById(id) {
    this.ensureClient();

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "assigned_to" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "created_at" } }
      ]
    };

    const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error('Task not found');
    }

    const task = response.data;
    return {
      Id: task.Id,
      title: task.title || task.Name || '',
      description: task.description || '',
      assignedTo: task.assigned_to || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.due_date,
      contactId: task.contact_id,
      dealId: task.deal_id,
      createdAt: task.created_at
    };
  }

  async getByContactId(contactId) {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "assigned_to" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "created_at" } }
      ],
      where: [{
        FieldName: "contact_id",
        Operator: "EqualTo",
        Values: [parseInt(contactId)]
      }],
      orderBy: [{
        fieldName: "due_date",
        sorttype: "ASC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(task => ({
      Id: task.Id,
      title: task.title || task.Name || '',
      description: task.description || '',
      assignedTo: task.assigned_to || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.due_date,
      contactId: task.contact_id,
      dealId: task.deal_id,
      createdAt: task.created_at
    })) || [];
  }

  async getByDealId(dealId) {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "assigned_to" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "created_at" } }
      ],
      where: [{
        FieldName: "deal_id",
        Operator: "EqualTo",
        Values: [parseInt(dealId)]
      }],
      orderBy: [{
        fieldName: "due_date",
        sorttype: "ASC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(task => ({
      Id: task.Id,
      title: task.title || task.Name || '',
      description: task.description || '',
      assignedTo: task.assigned_to || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.due_date,
      contactId: task.contact_id,
      dealId: task.deal_id,
      createdAt: task.created_at
    })) || [];
  }

  async create(taskData) {
    this.ensureClient();

    const params = {
      records: [
        {
          Name: taskData.title || '',
          title: taskData.title || '',
          description: taskData.description || '',
          assigned_to: taskData.assignedTo || '',
          priority: taskData.priority || 'medium',
          status: taskData.status || 'pending',
          due_date: taskData.dueDate || null,
          contact_id: taskData.contactId ? parseInt(taskData.contactId) : null,
          deal_id: taskData.dealId ? parseInt(taskData.dealId) : null,
          created_at: new Date().toISOString()
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
          title: created.title || created.Name || '',
          description: created.description || '',
          assignedTo: created.assigned_to || '',
          priority: created.priority || 'medium',
          status: created.status || 'pending',
          dueDate: created.due_date,
          contactId: created.contact_id,
          dealId: created.deal_id,
          createdAt: created.created_at
        };
      }
    }

    throw new Error('Failed to create task');
  }

  async update(id, taskData) {
    this.ensureClient();

    const params = {
      records: [
        {
          Id: parseInt(id),
          Name: taskData.title || '',
          title: taskData.title || '',
          description: taskData.description || '',
          assigned_to: taskData.assignedTo || '',
          priority: taskData.priority || 'medium',
          status: taskData.status || 'pending',
          due_date: taskData.dueDate || null,
          contact_id: taskData.contactId ? parseInt(taskData.contactId) : null,
          deal_id: taskData.dealId ? parseInt(taskData.dealId) : null
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
          title: updated.title || updated.Name || '',
          description: updated.description || '',
          assignedTo: updated.assigned_to || '',
          priority: updated.priority || 'medium',
          status: updated.status || 'pending',
          dueDate: updated.due_date,
          contactId: updated.contact_id,
          dealId: updated.deal_id,
          createdAt: updated.created_at
        };
      }
    }

    throw new Error('Failed to update task');
  }

  async updateStatus(id, status) {
    return this.update(id, { status });
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
        
        throw new Error('Failed to delete task');
      }
    }

    return true;
  }

  async getStatuses() {
    return [...this.statuses];
  }

  async getPriorities() {
    return [...this.priorities];
  }

  async getUpcoming(days = 7) {
    this.ensureClient();
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "assigned_to" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "created_at" } }
      ],
      whereGroups: [{
        operator: "AND",
        subGroups: [
          {
            conditions: [{
              fieldName: "status",
              operator: "NotEqualTo",
              values: ["completed"]
            }],
            operator: "AND"
          },
          {
            conditions: [{
              fieldName: "due_date",
              operator: "LessThanOrEqualTo",
              values: [futureDate.toISOString()]
            }],
            operator: "AND"
          }
        ]
      }],
      orderBy: [{
        fieldName: "due_date",
        sorttype: "ASC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(task => ({
      Id: task.Id,
      title: task.title || task.Name || '',
      description: task.description || '',
      assignedTo: task.assigned_to || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.due_date,
      contactId: task.contact_id,
      dealId: task.deal_id,
      createdAt: task.created_at
    })) || [];
  }

  async getOverdue() {
    this.ensureClient();
    
    const now = new Date();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "assigned_to" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "created_at" } }
      ],
      whereGroups: [{
        operator: "AND",
        subGroups: [
          {
            conditions: [{
              fieldName: "status",
              operator: "NotEqualTo",
              values: ["completed"]
            }],
            operator: "AND"
          },
          {
            conditions: [{
              fieldName: "due_date",
              operator: "LessThan",
              values: [now.toISOString()]
            }],
            operator: "AND"
          }
        ]
      }],
      orderBy: [{
        fieldName: "due_date",
        sorttype: "ASC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(task => ({
      Id: task.Id,
      title: task.title || task.Name || '',
      description: task.description || '',
      assignedTo: task.assigned_to || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.due_date,
      contactId: task.contact_id,
      dealId: task.deal_id,
      createdAt: task.created_at
    })) || [];
  }
}

export default new TaskService();
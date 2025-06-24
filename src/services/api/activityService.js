import { toast } from 'react-toastify';

class ActivityService {
  constructor() {
    this.tableName = 'app_Activity';
    this.types = ['call', 'email', 'meeting', 'note'];
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
        { field: { Name: "type" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "subject" } },
        { field: { Name: "notes" } },
        { field: { Name: "date" } },
        { field: { Name: "duration" } },
        { field: { Name: "direction" } },
        { field: { Name: "sender" } },
        { field: { Name: "recipient" } }
      ],
      orderBy: [{
        fieldName: "date",
        sorttype: "DESC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(activity => ({
      Id: activity.Id,
      type: activity.type || 'note',
      contactId: activity.contact_id,
      dealId: activity.deal_id,
      subject: activity.subject || activity.Name || '',
      notes: activity.notes || '',
      date: activity.date,
      duration: activity.duration || 0,
      direction: activity.direction || '',
      sender: activity.sender || '',
      recipient: activity.recipient || ''
    })) || [];
  }

  async getById(id) {
    this.ensureClient();

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "subject" } },
        { field: { Name: "notes" } },
        { field: { Name: "date" } },
        { field: { Name: "duration" } },
        { field: { Name: "direction" } },
        { field: { Name: "sender" } },
        { field: { Name: "recipient" } }
      ]
    };

    const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error('Activity not found');
    }

    const activity = response.data;
    return {
      Id: activity.Id,
      type: activity.type || 'note',
      contactId: activity.contact_id,
      dealId: activity.deal_id,
      subject: activity.subject || activity.Name || '',
      notes: activity.notes || '',
      date: activity.date,
      duration: activity.duration || 0,
      direction: activity.direction || '',
      sender: activity.sender || '',
      recipient: activity.recipient || ''
    };
  }

  async getByContactId(contactId) {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "subject" } },
        { field: { Name: "notes" } },
        { field: { Name: "date" } },
        { field: { Name: "duration" } },
        { field: { Name: "direction" } },
        { field: { Name: "sender" } },
        { field: { Name: "recipient" } }
      ],
      where: [{
        FieldName: "contact_id",
        Operator: "EqualTo",
        Values: [parseInt(contactId)]
      }],
      orderBy: [{
        fieldName: "date",
        sorttype: "DESC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(activity => ({
      Id: activity.Id,
      type: activity.type || 'note',
      contactId: activity.contact_id,
      dealId: activity.deal_id,
      subject: activity.subject || activity.Name || '',
      notes: activity.notes || '',
      date: activity.date,
      duration: activity.duration || 0,
      direction: activity.direction || '',
      sender: activity.sender || '',
      recipient: activity.recipient || ''
    })) || [];
  }

  async getByDealId(dealId) {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "subject" } },
        { field: { Name: "notes" } },
        { field: { Name: "date" } },
        { field: { Name: "duration" } },
        { field: { Name: "direction" } },
        { field: { Name: "sender" } },
        { field: { Name: "recipient" } }
      ],
      where: [{
        FieldName: "deal_id",
        Operator: "EqualTo",
        Values: [parseInt(dealId)]
      }],
      orderBy: [{
        fieldName: "date",
        sorttype: "DESC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(activity => ({
      Id: activity.Id,
      type: activity.type || 'note',
      contactId: activity.contact_id,
      dealId: activity.deal_id,
      subject: activity.subject || activity.Name || '',
      notes: activity.notes || '',
      date: activity.date,
      duration: activity.duration || 0,
      direction: activity.direction || '',
      sender: activity.sender || '',
      recipient: activity.recipient || ''
    })) || [];
  }

  async create(activityData) {
    this.ensureClient();

    const params = {
      records: [
        {
          Name: activityData.subject || '',
          type: activityData.type || 'note',
          contact_id: activityData.contactId ? parseInt(activityData.contactId) : null,
          deal_id: activityData.dealId ? parseInt(activityData.dealId) : null,
          subject: activityData.subject || '',
          notes: activityData.notes || '',
          date: activityData.date || new Date().toISOString(),
          duration: activityData.duration || 0,
          direction: activityData.direction || '',
          sender: activityData.sender || '',
          recipient: activityData.recipient || ''
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
          type: created.type || 'note',
          contactId: created.contact_id,
          dealId: created.deal_id,
          subject: created.subject || created.Name || '',
          notes: created.notes || '',
          date: created.date,
          duration: created.duration || 0,
          direction: created.direction || '',
          sender: created.sender || '',
          recipient: created.recipient || ''
        };
      }
    }

    throw new Error('Failed to create activity');
  }

  async update(id, activityData) {
    this.ensureClient();

    const params = {
      records: [
        {
          Id: parseInt(id),
          Name: activityData.subject || '',
          type: activityData.type || 'note',
          contact_id: activityData.contactId ? parseInt(activityData.contactId) : null,
          deal_id: activityData.dealId ? parseInt(activityData.dealId) : null,
          subject: activityData.subject || '',
          notes: activityData.notes || '',
          date: activityData.date || new Date().toISOString(),
          duration: activityData.duration || 0,
          direction: activityData.direction || '',
          sender: activityData.sender || '',
          recipient: activityData.recipient || ''
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
          type: updated.type || 'note',
          contactId: updated.contact_id,
          dealId: updated.deal_id,
          subject: updated.subject || updated.Name || '',
          notes: updated.notes || '',
          date: updated.date,
          duration: updated.duration || 0,
          direction: updated.direction || '',
          sender: updated.sender || '',
          recipient: updated.recipient || ''
        };
      }
    }

    throw new Error('Failed to update activity');
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
        
        throw new Error('Failed to delete activity');
      }
    }

    return true;
  }

  async getTypes() {
    return [...this.types];
  }

  async getRecent(limit = 10) {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "subject" } },
        { field: { Name: "notes" } },
        { field: { Name: "date" } },
        { field: { Name: "duration" } },
        { field: { Name: "direction" } },
        { field: { Name: "sender" } },
        { field: { Name: "recipient" } }
      ],
      orderBy: [{
        fieldName: "date",
        sorttype: "DESC"
      }],
      pagingInfo: {
        limit: limit,
        offset: 0
      }
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(activity => ({
      Id: activity.Id,
      type: activity.type || 'note',
      contactId: activity.contact_id,
      dealId: activity.deal_id,
      subject: activity.subject || activity.Name || '',
      notes: activity.notes || '',
      date: activity.date,
      duration: activity.duration || 0,
      direction: activity.direction || '',
      sender: activity.sender || '',
      recipient: activity.recipient || ''
    })) || [];
  }

  async createEmailActivity(emailData) {
    const emailActivity = {
      type: 'email',
      subject: emailData.subject,
      notes: emailData.body || '',
      contactId: emailData.contactId,
      dealId: emailData.dealId || null,
      direction: emailData.direction, // 'sent' or 'received'
      sender: emailData.sender,
      recipient: emailData.recipient,
      date: emailData.date || new Date().toISOString(),
      duration: 0
    };
    return this.create(emailActivity);
  }

  async getEmailActivities(contactId = null) {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "subject" } },
        { field: { Name: "notes" } },
        { field: { Name: "date" } },
        { field: { Name: "duration" } },
        { field: { Name: "direction" } },
        { field: { Name: "sender" } },
        { field: { Name: "recipient" } }
      ],
      where: contactId ? [
        {
          FieldName: "type",
          Operator: "EqualTo",
          Values: ["email"]
        },
        {
          FieldName: "contact_id",
          Operator: "EqualTo", 
          Values: [parseInt(contactId)]
        }
      ] : [{
        FieldName: "type",
        Operator: "EqualTo",
        Values: ["email"]
      }],
      orderBy: [{
        fieldName: "date",
        sorttype: "DESC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(activity => ({
      Id: activity.Id,
      type: activity.type || 'note',
      contactId: activity.contact_id,
      dealId: activity.deal_id,
      subject: activity.subject || activity.Name || '',
      notes: activity.notes || '',
      date: activity.date,
      duration: activity.duration || 0,
      direction: activity.direction || '',
      sender: activity.sender || '',
      recipient: activity.recipient || ''
    })) || [];
  }

  async getEmailsByDirection(direction, contactId = null) {
    this.ensureClient();
    
    const whereConditions = [
      {
        FieldName: "type",
        Operator: "EqualTo",
        Values: ["email"]
      },
      {
        FieldName: "direction",
        Operator: "EqualTo",
        Values: [direction]
      }
    ];

    if (contactId) {
      whereConditions.push({
        FieldName: "contact_id",
        Operator: "EqualTo",
        Values: [parseInt(contactId)]
      });
    }
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "type" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "deal_id" } },
        { field: { Name: "subject" } },
        { field: { Name: "notes" } },
        { field: { Name: "date" } },
        { field: { Name: "duration" } },
        { field: { Name: "direction" } },
        { field: { Name: "sender" } },
        { field: { Name: "recipient" } }
      ],
      where: whereConditions,
      orderBy: [{
        fieldName: "date",
        sorttype: "DESC"
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(activity => ({
      Id: activity.Id,
      type: activity.type || 'note',
      contactId: activity.contact_id,
      dealId: activity.deal_id,
      subject: activity.subject || activity.Name || '',
      notes: activity.notes || '',
      date: activity.date,
      duration: activity.duration || 0,
      direction: activity.direction || '',
      sender: activity.sender || '',
      recipient: activity.recipient || ''
    })) || [];
  }
}

export default new ActivityService();
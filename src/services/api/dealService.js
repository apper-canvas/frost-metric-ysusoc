import { toast } from 'react-toastify';

class DealService {
  constructor() {
    this.tableName = 'deal';
    this.stages = ['Lead', 'Qualified', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
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
        { field: { Name: "value" } },
        { field: { Name: "stage" } },
        { field: { Name: "probability" } },
        { field: { Name: "expected_close_date" } },
        { field: { Name: "notes" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(deal => ({
      Id: deal.Id,
      title: deal.title || deal.Name || '',
      value: deal.value || 0,
      stage: deal.stage || 'Lead',
      contactId: deal.contact_id,
      probability: deal.probability || 0,
      expectedCloseDate: deal.expected_close_date,
      notes: deal.notes || '',
      createdAt: deal.created_at,
      updatedAt: deal.updated_at
    })) || [];
  }

  async getById(id) {
    this.ensureClient();

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "value" } },
        { field: { Name: "stage" } },
        { field: { Name: "probability" } },
        { field: { Name: "expected_close_date" } },
        { field: { Name: "notes" } },
        { field: { Name: "contact_id" } },
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
      throw new Error('Deal not found');
    }

    const deal = response.data;
    return {
      Id: deal.Id,
      title: deal.title || deal.Name || '',
      value: deal.value || 0,
      stage: deal.stage || 'Lead',
      contactId: deal.contact_id,
      probability: deal.probability || 0,
      expectedCloseDate: deal.expected_close_date,
      notes: deal.notes || '',
      createdAt: deal.created_at,
      updatedAt: deal.updated_at
    };
  }

  async getByContactId(contactId) {
    this.ensureClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "value" } },
        { field: { Name: "stage" } },
        { field: { Name: "probability" } },
        { field: { Name: "expected_close_date" } },
        { field: { Name: "notes" } },
        { field: { Name: "contact_id" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      where: [{
        FieldName: "contact_id",
        Operator: "EqualTo",
        Values: [parseInt(contactId)]
      }]
    };

    const response = await this.apperClient.fetchRecords(this.tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(deal => ({
      Id: deal.Id,
      title: deal.title || deal.Name || '',
      value: deal.value || 0,
      stage: deal.stage || 'Lead',
      contactId: deal.contact_id,
      probability: deal.probability || 0,
      expectedCloseDate: deal.expected_close_date,
      notes: deal.notes || '',
      createdAt: deal.created_at,
      updatedAt: deal.updated_at
    })) || [];
  }

  async create(dealData) {
    this.ensureClient();

    const params = {
      records: [
        {
          Name: dealData.title || '',
          title: dealData.title || '',
          value: dealData.value || 0,
          stage: dealData.stage || 'Lead',
          probability: dealData.probability || 0,
          expected_close_date: dealData.expectedCloseDate || null,
          notes: dealData.notes || '',
          contact_id: dealData.contactId ? parseInt(dealData.contactId) : null,
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
          title: created.title || created.Name || '',
          value: created.value || 0,
          stage: created.stage || 'Lead',
          contactId: created.contact_id,
          probability: created.probability || 0,
          expectedCloseDate: created.expected_close_date,
          notes: created.notes || '',
          createdAt: created.created_at,
          updatedAt: created.updated_at
        };
      }
    }

    throw new Error('Failed to create deal');
  }

  async update(id, dealData) {
    this.ensureClient();

    const params = {
      records: [
        {
          Id: parseInt(id),
          Name: dealData.title || '',
          title: dealData.title || '',
          value: dealData.value || 0,
          stage: dealData.stage || 'Lead',
          probability: dealData.probability || 0,
          expected_close_date: dealData.expectedCloseDate || null,
          notes: dealData.notes || '',
          contact_id: dealData.contactId ? parseInt(dealData.contactId) : null,
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
          title: updated.title || updated.Name || '',
          value: updated.value || 0,
          stage: updated.stage || 'Lead',
          contactId: updated.contact_id,
          probability: updated.probability || 0,
          expectedCloseDate: updated.expected_close_date,
          notes: updated.notes || '',
          createdAt: updated.created_at,
          updatedAt: updated.updated_at
        };
      }
    }

    throw new Error('Failed to update deal');
  }

  async updateStage(id, newStage) {
    return this.update(id, { stage: newStage });
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
        
        throw new Error('Failed to delete deal');
      }
    }

    return true;
  }

  async getStages() {
    return [...this.stages];
  }

  async getDealsByStage() {
    const deals = await this.getAll();
    const dealsByStage = {};
    this.stages.forEach(stage => {
      dealsByStage[stage] = deals.filter(d => d.stage === stage);
    });
    return dealsByStage;
  }
}

export default new DealService();
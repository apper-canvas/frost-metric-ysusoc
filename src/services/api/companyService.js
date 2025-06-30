import { toast } from 'react-toastify';

// Helper function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'company_detail';

// Updateable fields only (excluding System fields)
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags', 
  'Owner',
  'address',
  'industry',
  'size',
  'app_contact'
];

// All fields for fetch operations
const ALL_FIELDS = [
  { field: { Name: "Name" } },
  { field: { Name: "Tags" } },
  { field: { Name: "Owner" } },
  { field: { Name: "CreatedOn" } },
  { field: { Name: "CreatedBy" } },
  { field: { Name: "ModifiedOn" } },
  { field: { Name: "ModifiedBy" } },
  { field: { Name: "address" } },
  { field: { Name: "industry" } },
  { field: { Name: "size" } },
  { field: { Name: "app_contact" } }
];

export const getAll = async () => {
  try {
    await delay(300);
    
    const apperClient = getApperClient();
    
    const params = {
      fields: ALL_FIELDS,
      orderBy: [
        {
          fieldName: "Name",
          sorttype: "ASC"
        }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    toast.error("Failed to fetch companies");
    return [];
  }
};

export const getById = async (companyId) => {
  try {
    await delay(200);
    
    const apperClient = getApperClient();
    
    const params = {
      fields: ALL_FIELDS
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, companyId, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching company with ID ${companyId}:`, error);
    toast.error("Failed to fetch company");
    return null;
  }
};

export const create = async (companyData) => {
  try {
    await delay(400);
    
    // Filter to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (companyData[field] !== undefined) {
        filteredData[field] = companyData[field];
      }
    });
    
    const apperClient = getApperClient();
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} companies:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        return successfulRecords[0].data;
      }
    }
    
    throw new Error('No data returned from create operation');
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

export const update = async (companyId, companyData) => {
  try {
    await delay(400);
    
    // Filter to only include updateable fields and add Id
    const filteredData = { Id: companyId };
    UPDATEABLE_FIELDS.forEach(field => {
      if (companyData[field] !== undefined) {
        filteredData[field] = companyData[field];
      }
    });
    
    const apperClient = getApperClient();
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} companies:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        return successfulUpdates[0].data;
      }
    }
    
    throw new Error('No data returned from update operation');
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const deleteCompany = async (companyIds) => {
  try {
    await delay(300);
    
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: Array.isArray(companyIds) ? companyIds : [companyIds]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} companies:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulDeletions.length === params.RecordIds.length;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting companies:", error);
    throw error;
  }
};

// Export delete with standard name for consistency
export const delete_ = deleteCompany;
export { deleteCompany as delete };
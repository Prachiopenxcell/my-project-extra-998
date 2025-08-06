import axios from 'axios';
import { EntityFormData, IndustryDetail, FinancialRecord, Creditor, BankDocument } from "@/components/entity";
import { API_CONFIG } from '@/config/api.config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  config => {
    // Get token from storage (implement your auth strategy here)
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      // Handle unauthorized
      if (error.response.status === 401) {
        // Redirect to login or refresh token
        console.error('Unauthorized access. Redirecting to login...');
        // window.location.href = '/login';
      }
      
      // Handle forbidden
      if (error.response.status === 403) {
        console.error('Access forbidden');
      }
      
      // Handle server errors
      if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    }
    
    return Promise.reject(error);
  }
);

// Real API service implementation
export const entityApiService = {
  // Get all entities
  async getAllEntities(): Promise<EntityFormData[]> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ENTITIES);
      return response.data;
    } catch (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }
  },
  
  // Get entity by ID
  async getEntityById(id: string): Promise<EntityFormData> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ENTITY_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching entity ${id}:`, error);
      throw error;
    }
  },
  
  // Create new entity
  async createEntity(entity: EntityFormData): Promise<EntityFormData> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.ENTITIES, entity);
      return response.data;
    } catch (error) {
      console.error('Error creating entity:', error);
      throw error;
    }
  },
  
  // Update entity
  async updateEntity(id: string, entity: EntityFormData): Promise<EntityFormData> {
    try {
      const response = await apiClient.put(API_CONFIG.ENDPOINTS.ENTITY_BY_ID(id), entity);
      return response.data;
    } catch (error) {
      console.error(`Error updating entity ${id}:`, error);
      throw error;
    }
  },
  
  // Delete entity
  async deleteEntity(id: string): Promise<boolean> {
    try {
      await apiClient.delete(API_CONFIG.ENDPOINTS.ENTITY_BY_ID(id));
      return true;
    } catch (error) {
      console.error(`Error deleting entity ${id}:`, error);
      throw error;
    }
  },
  
  // Verify entity with MCA API
  async verifyEntityWithMCA(cinNumber: string): Promise<Partial<EntityFormData>> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.VERIFY_ENTITY, { cinNumber });
      return response.data;
    } catch (error) {
      console.error(`Error verifying entity ${cinNumber}:`, error);
      throw error;
    }
  },
  
  // Get industry details for an entity
  async getIndustryDetails(entityId: string): Promise<IndustryDetail[]> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.INDUSTRY_DETAILS(entityId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching industry details for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Update industry details for an entity
  async updateIndustryDetails(entityId: string, industryDetails: IndustryDetail[]): Promise<IndustryDetail[]> {
    try {
      const response = await apiClient.put(API_CONFIG.ENDPOINTS.INDUSTRY_DETAILS(entityId), industryDetails);
      return response.data;
    } catch (error) {
      console.error(`Error updating industry details for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Get financial records for an entity
  async getFinancialRecords(entityId: string): Promise<FinancialRecord[]> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.FINANCIAL_RECORDS(entityId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching financial records for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Add a financial record
  async addFinancialRecord(entityId: string, record: FinancialRecord): Promise<FinancialRecord> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.FINANCIAL_RECORDS(entityId), record);
      return response.data;
    } catch (error) {
      console.error(`Error adding financial record for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Update a financial record
  async updateFinancialRecord(
    entityId: string, 
    recordId: string, 
    updates: Partial<FinancialRecord>
  ): Promise<FinancialRecord> {
    try {
      const response = await apiClient.patch(
        API_CONFIG.ENDPOINTS.FINANCIAL_RECORD_BY_ID(entityId, recordId), 
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating financial record ${recordId} for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Get creditors for an entity
  async getCreditors(entityId: string): Promise<Creditor[]> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CREDITORS(entityId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching creditors for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Add a creditor
  async addCreditor(entityId: string, creditor: Creditor): Promise<Creditor> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CREDITORS(entityId), creditor);
      return response.data;
    } catch (error) {
      console.error(`Error adding creditor for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Update a creditor
  async updateCreditor(
    entityId: string, 
    creditorId: string, 
    updates: Partial<Creditor>
  ): Promise<Creditor> {
    try {
      const response = await apiClient.patch(
        API_CONFIG.ENDPOINTS.CREDITOR_BY_ID(entityId, creditorId), 
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating creditor ${creditorId} for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Get bank documents for an entity
  async getBankDocuments(entityId: string): Promise<BankDocument[]> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.BANK_DOCUMENTS(entityId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching bank documents for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Add a bank document
  async addBankDocument(entityId: string, document: BankDocument): Promise<BankDocument> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.BANK_DOCUMENTS(entityId), document);
      return response.data;
    } catch (error) {
      console.error(`Error adding bank document for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Update a bank document
  async updateBankDocument(
    entityId: string, 
    documentId: string, 
    updates: Partial<BankDocument>
  ): Promise<BankDocument> {
    try {
      const response = await apiClient.patch(
        API_CONFIG.ENDPOINTS.BANK_DOCUMENT_BY_ID(entityId, documentId), 
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating bank document ${documentId} for entity ${entityId}:`, error);
      throw error;
    }
  },
  
  // Upload document file
  async uploadDocument(file: File): Promise<{ url: string, fileName: string }> {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Check file size
      if (file.size > API_CONFIG.MAX_UPLOAD_SIZE) {
        throw new Error(`File size exceeds maximum allowed size (${API_CONFIG.MAX_UPLOAD_SIZE / (1024 * 1024)}MB)`);
      }
      
      // Upload file
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.UPLOAD_DOCUMENT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
};

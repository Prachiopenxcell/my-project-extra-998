/**
 * API Configuration
 * 
 * This file contains configuration for API endpoints and related settings.
 * Update these values when switching from mock to real API endpoints.
 */

export const API_CONFIG = {
  // Base API URL - change this when moving to production
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.example.com/v1' 
    : 'http://localhost:3000/api',
  
  // Feature flags for API integration
  FEATURES: {
    // Set to true to use real API endpoints, false to use mock data
    USE_REAL_API: false,
    
    // Enable/disable specific API features
    ENABLE_MCA_VERIFICATION: true,
    ENABLE_DOCUMENT_UPLOAD: true,
    ENABLE_EXPORT: true
  },
  
  // API endpoints
  ENDPOINTS: {
    // Entity endpoints
    ENTITIES: '/entities',
    ENTITY_BY_ID: (id: string) => `/entities/${id}`,
    
    // Industry details endpoints
    INDUSTRY_DETAILS: (entityId: string) => `/entities/${entityId}/industries`,
    
    // Financial records endpoints
    FINANCIAL_RECORDS: (entityId: string) => `/entities/${entityId}/financial-records`,
    FINANCIAL_RECORD_BY_ID: (entityId: string, recordId: string) => 
      `/entities/${entityId}/financial-records/${recordId}`,
    
    // Creditors endpoints
    CREDITORS: (entityId: string) => `/entities/${entityId}/creditors`,
    CREDITOR_BY_ID: (entityId: string, creditorId: string) => 
      `/entities/${entityId}/creditors/${creditorId}`,
    
    // Bank documents endpoints
    BANK_DOCUMENTS: (entityId: string) => `/entities/${entityId}/bank-documents`,
    BANK_DOCUMENT_BY_ID: (entityId: string, documentId: string) => 
      `/entities/${entityId}/bank-documents/${documentId}`,
    
    // Verification endpoints
    VERIFY_ENTITY: '/verify/entity',
    
    // Upload endpoints
    UPLOAD_DOCUMENT: '/upload/document'
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Maximum file upload size in bytes (5MB)
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024
};

import { EntityFormData, IndustryDetail, FinancialRecord, Creditor, BankDocument } from "@/components/entity";
import { entityService as mockEntityService } from "./entityService";

// Define the entity service interface
export interface IEntityService {
  // Entity CRUD operations
  getAllEntities(): Promise<EntityFormData[]>;
  getEntityById(id: string): Promise<EntityFormData | undefined>;
  createEntity(entity: EntityFormData): Promise<EntityFormData>;
  updateEntity(id: string, entity: EntityFormData): Promise<EntityFormData>;
  deleteEntity(id: string): Promise<boolean>;
  
  // Verification
  verifyEntityWithMCA(cinNumber: string): Promise<Partial<EntityFormData>>;
  
  // Industry details
  getIndustryDetails(entityId: string): Promise<IndustryDetail[]>;
  updateIndustryDetails(entityId: string, industryDetails: IndustryDetail[]): Promise<IndustryDetail[]>;
  
  // Financial records
  getFinancialRecords(entityId: string): Promise<FinancialRecord[]>;
  addFinancialRecord(entityId: string, record: FinancialRecord): Promise<FinancialRecord>;
  updateFinancialRecord(entityId: string, recordId: string, updates: Partial<FinancialRecord>): Promise<FinancialRecord>;
  
  // Creditors
  getCreditors(entityId: string): Promise<Creditor[]>;
  addCreditor(entityId: string, creditor: Creditor): Promise<Creditor>;
  updateCreditor(entityId: string, creditorId: string, updates: Partial<Creditor>): Promise<Creditor>;
  
  // Bank documents
  getBankDocuments(entityId: string): Promise<BankDocument[]>;
  addBankDocument(entityId: string, document: BankDocument): Promise<BankDocument>;
  updateBankDocument(entityId: string, documentId: string, updates: Partial<BankDocument>): Promise<BankDocument>;
  
  // VDR specific operations
  updateEntityVDRData(entity: EntityFormData): Promise<EntityFormData>;
}

// Export the mock service directly
export const entityService = mockEntityService;

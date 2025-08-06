import { ReactNode } from 'react';

// Address interface
export interface Address {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

// Entity form data types
export interface EntityFormData {
  // System fields
  id?: string;
  
  // Basic Details
  entityType: string;
  cinNumber: string;
  entityName: string;
  registrationNo: string;
  rocName: string;
  category: string;
  subcategory: string;
  lastAgmDate: string;
  balanceSheetDate: string;
  companyStatus: string;
  indexOfCharges: string;
  directors: Director[];
  pan: string;
  gstn: {
    available: boolean;
    number: string;
  };
  msme: {
    available: boolean;
    number: string;
  };
  shopEstablishment: {
    available: boolean;
    number: string;
  };
  bankAccounts: BankAccount[];
  
  // Address & Contact
  registeredOffice: Address;
  factoryOffice?: string;
  corporateOffice?: Address;
  correspondenceAddress?: string;
  sameAddress: boolean;
  businessLocations: string[];
  email?: string;
  phone?: string;
  registeredEmail: string;
  alternateEmail: string;
  correspondenceEmail: string;
  phoneNumber: string;
  
  // Key Personnel
  keyPersonnel: Personnel[];
  
  // Industry & Operational Details
  industries?: string[];
  industryDetails?: IndustryDetail[];
  businessActivity?: string;
  keywords?: string[];
  turnover?: string;
  employeeCount?: number;
  maleEmployeeCount?: number;
  femaleEmployeeCount?: number;
  operationalStatus?: string;
  complianceRating?: string;
  riskCategory?: string;
  additionalNotes?: string;
  
  // Records & Financial Details
  financialRecords?: FinancialRecord[];
  financialYears?: string[];
  auditStatus?: string;
  auditRemarks?: string;
  taxFilingStatus?: string;
  taxRemarks?: string;
  
  // Creditors in Class
  creditors?: Creditor[];
  totalClaimAmount?: number;
  creditorsClassification?: string;
  
  // Bank & Investment Documents
  bankDocuments?: BankDocument[];
  investmentSummary?: string;
}

export interface Director {
  name: string;
  designation: string;
  din: string;
  dob: string;
  email: string;
  contact: string;
}

export interface BankAccount {
  accountNo: string;
  ifscCode: string;
  bankName: string;
  branch: string;
  isMain: boolean;
}

export interface Personnel {
  id: number;
  name: string;
  designation: string;
  identityNo: string;
  din: string;
  email: string;
  contact: string;
}

export interface IndustryDetail {
  industry: string;
  subIndustry?: string;
  products?: string[];
  installedCapacity?: number;
  salesQuantity?: number;
  salesValue?: number;
}

export interface FinancialRecord {
  id: string;
  documentType: string;
  financialYear: string;
  fileName: string;
  fileUrl?: string;
  uploadDate?: string;
  status: string;
  remarks?: string;
  isVerified?: boolean;
}

export interface Creditor {
  id: string;
  name: string;
  class: string;
  subClass?: string;
  amount: number;
  claimDate?: string;
  status: string;
  remarks?: string;
  documentUrl?: string;
  documentName?: string;
}

export interface BankDocument {
  id: string;
  bankName: string;
  documentType: string;
  documentDate: string;
  fileName?: string;
  fileUrl?: string;
  uploadDate?: string;
  status: string;
  remarks?: string;
  isVerified?: boolean;
}

export interface StepComponentProps {
  formData: EntityFormData;
  updateFormData: (data: Partial<EntityFormData>) => void;
}

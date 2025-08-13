import { ReactNode } from 'react';

// Address interface
export interface Address {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

// Factory/Branch Office Address interface
export interface FactoryBranchAddress {
  type: 'factory' | 'branch';
  address: string;
  city: string;
  state: string;
  pincode: string;
  isMain?: boolean;
}

// Additional Business Location interface
export interface BusinessLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: 'office' | 'warehouse' | 'factory' | 'branch' | 'other';
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
  entityStatus: 'pending' | 'active' | 'suspended' | 'inactive';
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
  factoryBranchOffices?: FactoryBranchAddress[];
  additionalBusinessLocations?: BusinessLocation[];
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
  employeesForVDR?: number;
  installedCapacity?: string;
  salesQuantity?: string;
  salesValue?: string;
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
  
  // Team Management
  teamMembers?: TeamMember[];
  entityAllocation?: EntityAllocation[];
  activityLog?: ActivityLogEntry[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  assignedDate: string;
  status: 'active' | 'inactive' | 'pending';
  lastActivity?: string;
  journey?: JourneyStep[];
}

export interface EntityAllocation {
  id: string;
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  userEmail: string;
  allocationType: 'primary' | 'secondary' | 'viewer';
  allocatedDate: string;
  allocatedBy: string;
  permissions: string[];
  status: 'active' | 'inactive';
  department: string;
  workload: string;
}

export interface ActivityLogEntry {
  id: string;
  entityId: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface JourneyStep {
  id: string;
  step: string;
  description: string;
  completedDate?: string;
  status: 'completed' | 'in-progress' | 'pending';
  assignedBy?: string;
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
  installedCapacity?: string;
  salesQuantity?: string;
  salesValue?: string;
  employeesForVDR?: number;
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

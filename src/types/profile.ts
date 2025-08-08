// Profile Management Types

export enum PersonType {
  PUBLIC_LIMITED = 'public_limited',
  PRIVATE_LIMITED = 'private_limited',
  LIMITED_LIABILITY_PARTNERSHIP = 'limited_liability_partnership',
  REGISTERED_PARTNERSHIP = 'registered_partnership'
}

export enum IdentityDocumentType {
  PAN = 'pan',
  AADHAR = 'aadhar',
  PASSPORT = 'passport',
  VOTER_ID = 'voter_id',
  DRIVING_LICENSE = 'driving_license'
}

export enum AccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
  BUSINESS = 'business'
}

export enum LanguageProficiency {
  LOW = 'L',
  MEDIUM = 'M',
  HIGH = 'H'
}

export enum ServiceLevel {
  ENTRANT = 'entrant',
  EXPERIENCED = 'experienced',
  EXPERT = 'expert'
}

export enum ServiceSector {
  MANUFACTURING = 'mfg',
  MSME = 'msme',
  INDUSTRIAL = 'industrial',
  MINING = 'mining',
  LOGISTICS = 'logistics',
  SERVICES = 'services',
  REALTY = 'realty',
  IT = 'it'
}

export enum ServiceIndustry {
  CHEMICALS = 'chemicals',
  ENGINEERING = 'engineering',
  PHARMA = 'pharma',
  STEEL = 'steel',
  CEMENT = 'cement'
}

export interface IdentityDocument {
  type: IdentityDocumentType;
  number: string;
  uploadedFile?: File | string;
}

export interface BankingDetails {
  beneficiaryName: string;
  accountType: AccountType;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  isDefault?: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country?: string;
}

export interface AlternateContact {
  email?: string;
  mobile?: string;
}

export interface LanguageSkill {
  language: string;
  speak: LanguageProficiency;
  read: LanguageProficiency;
  write: LanguageProficiency;
}

export interface WorkLocation {
  city: string;
  location: string;
  pinCode: string;
}

export interface BillingDetails {
  tradeName: string;
  address: Address;
  gstState: string;
  gstRegistrationNumber?: string;
  gstCopy?: File | string;
  panNumber: string;
  panCopy?: File | string;
  tanNumber?: string;
  tanCopy?: File | string;
  isDefault?: boolean;
}

export interface MembershipDetails {
  bodyInstitute: string;
  membershipNumber: string;
  memberSince: string;
  uploadedCopy?: File | string;
  practiceLicenseNumber?: string;
  licenseValidity?: string;
  licenseCopy?: File | string;
}

export interface ServiceOffering {
  category: string;
  level: ServiceLevel;
  sector: ServiceSector;
  industry: ServiceIndustry;
  services: string[];
  hashtags: string[];
}

export interface AuthorizedRepresentative {
  name: string;
  designation: string;
  email: string;
  contactNumber: string;
  address: Address;
  identityDocument: IdentityDocument;
}

export interface Partner {
  name: string;
  professionalProfileLink?: string;
}

export interface ResourceInfra {
  numberOfPartners?: number;
  partners?: Partner[];
  numberOfProfessionalStaff: number;
  numberOfOtherStaff: number;
  numberOfInternsArticledClerks: number;
}

// Base Profile Interface
export interface BaseProfile {
  id?: string;
  userId: string;
  completionPercentage: number;
  permanentRegistrationNumber?: string;
  isCompleted: boolean;
  lastUpdated: Date;
}

// Service Seeker Individual/Partner Profile
export interface ServiceSeekerIndividualProfile extends BaseProfile {
  personType?: PersonType;
  clientLogo?: File | string;
  name: string;
  identityDocument: IdentityDocument;
  email: string;
  contactNumber: string;
  address: Address;
  panNumber?: string;
  panCopy?: File | string;
  tanNumber?: string;
  tanCopy?: File | string;
  gstNumber?: string;
  gstCopy?: File | string;
  billingAddress: Address;
  bankingDetails: BankingDetails[];
}

// Service Seeker Entity Admin Profile
export interface ServiceSeekerEntityProfile extends ServiceSeekerIndividualProfile {
  authorizedRepresentative: AuthorizedRepresentative;
  resourceInfra: ResourceInfra;
}

// Service Provider Individual/Partner Profile
export interface ServiceProviderIndividualProfile extends BaseProfile {
  // Personal Details
  title: string; // Mr./Mrs./Ms.
  name: string;
  companyName?: string;
  companyLogo?: File | string;
  
  // User Details
  email: string;
  mobile: string;
  alternateContacts: AlternateContact[];
  dateOfBirth?: string;
  dateOfIncorporation?: string;
  
  // Identity Document
  identityDocument: IdentityDocument;
  
  // Qualifications
  qualifications: string; // B.Com, CA, CMA, CGMA, IP
  
  // Membership Details
  membershipDetails: MembershipDetails[];
  
  // Language Skills
  languageSkills: LanguageSkill[];
  
  // Resources and Infrastructure
  resourceInfra: ResourceInfra;
  
  // Work Locations
  workLocations: WorkLocation[];
  openToRemoteWork: boolean;
  
  // Billing Details
  billingDetails: BillingDetails[];
  
  // Banking Details
  bankingDetails: BankingDetails[];
  
  // Services Offered
  servicesOffered: ServiceOffering[];
}

// Service Provider Entity Admin Profile
export interface ServiceProviderEntityProfile extends ServiceProviderIndividualProfile {
  personType: PersonType;
  dateOfIncorporation: string;
  incorporationCertificate?: File | string;
  authorizedRepresentative: AuthorizedRepresentative;
}

// Team Member Profile (simplified)
export interface TeamMemberProfile extends BaseProfile {
  name: string;
  identityDocument: IdentityDocument;
  email: string;
  contactNumber: string;
  address: Address;
}

// Union type for all profiles
export type UserProfile = 
  | ServiceSeekerIndividualProfile 
  | ServiceSeekerEntityProfile 
  | ServiceProviderIndividualProfile 
  | ServiceProviderEntityProfile 
  | TeamMemberProfile;

// Profile completion calculation
export interface ProfileSection {
  name: string;
  weight: number;
  isCompleted: boolean;
  requiredFields: string[];
  completedFields: string[];
}

export interface ProfileCompletionStatus {
  overallPercentage: number;
  sections: ProfileSection[];
  missingMandatoryFields: string[];
  canGetPermanentNumber: boolean;
}

// Profile form step interface
export interface ProfileFormStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isCompleted: boolean;
  isRequired: boolean;
}

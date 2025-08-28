// Service Request and Bid Submission Types

export enum ServiceRequestStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  BID_RECEIVED = 'bid_received',
  UNDER_NEGOTIATION = 'under_negotiation',
  BID_ACCEPTED = 'bid_accepted',
  PAYMENT_PENDING = 'payment_pending',
  WORK_ORDER_ISSUED = 'work_order_issued',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CLOSED = 'closed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  AWARDED_TO_ANOTHER = 'awarded_to_another',
  SUBMISSION_TIME_PASSED = 'submission_time_passed',
  WON_BUT_NO_WORK_ORDER = 'won_but_no_work_order',
  NOT_INTERESTED = 'not_interested'
}

export enum BidStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  UNDER_NEGOTIATION = 'under_negotiation',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired'
}

export enum ProfessionalType {
  LAWYER = 'lawyer',
  CHARTERED_ACCOUNTANT = 'chartered_accountant',
  COMPANY_SECRETARY = 'company_secretary',
  COST_MANAGEMENT_ACCOUNTANT = 'cost_management_accountant',
  VALUER = 'valuer',
  INSOLVENCY_PROFESSIONAL = 'insolvency_professional'
}

export enum MainServiceType {
  INCORPORATION_BUSINESS_SETUP = 'incorporation_business_setup',
  SECRETARIAL_COMPLIANCE_FILINGS = 'secretarial_compliance_filings',
  BOARD_SHAREHOLDER_MEETING_COMPLIANCES = 'board_shareholder_meeting_compliances'
}

export enum ServiceType {
  // Incorporation & Business Set-Up
  INCORPORATION_PRIVATE_LIMITED = 'incorporation_private_limited',
  INCORPORATION_PUBLIC_LIMITED = 'incorporation_public_limited',
  INCORPORATION_OPC = 'incorporation_opc',
  INCORPORATION_LLP = 'incorporation_llp',
  INCORPORATION_PRODUCER_COMPANY = 'incorporation_producer_company',
  SECTION_8_COMPANY = 'section_8_company',
  CONVERSION_PROPRIETORSHIP_PARTNERSHIP = 'conversion_proprietorship_partnership',
  CONVERSION_COMPANY_TYPES = 'conversion_company_types',
  DIN_OBTAINING = 'din_obtaining',
  DSC_FACILITATION = 'dsc_facilitation',
  NAME_RESERVATION_CHANGE = 'name_reservation_change',
  DRAFTING_MOA_AOA = 'drafting_moa_aoa',
  COMMENCEMENT_BUSINESS_FILINGS = 'commencement_business_filings',
  
  // Secretarial Compliance & Filings
  ANNUAL_RETURN_FILING = 'annual_return_filing',
  FINANCIAL_STATEMENT_FILING = 'financial_statement_filing',
  DIRECTOR_APPOINTMENT_RESIGNATION = 'director_appointment_resignation',
  AUDITOR_APPOINTMENT_RESIGNATION = 'auditor_appointment_resignation',
  FILING_OF_CHARGES = 'filing_of_charges',
  STATUTORY_REGISTERS_MAINTENANCE = 'statutory_registers_maintenance',
  SHARE_ISSUE_ALLOTMENT_TRANSFER = 'share_issue_allotment_transfer',
  BUYBACK_REDUCTION_SHARE_CAPITAL = 'buyback_reduction_share_capital',
  INCREASE_AUTHORISED_SHARE_CAPITAL = 'increase_authorised_share_capital',
  LISTED_COMPANIES_COMPLIANCE = 'listed_companies_compliance',
  RESOLUTIONS_FILING_ROC = 'resolutions_filing_roc',
  RETURN_OF_DEPOSITS_FILING = 'return_of_deposits_filing',
  MSME_RETURN_FILING = 'msme_return_filing',
  EVENT_BASED_COMPLIANCES = 'event_based_compliances',
  LIQUIDATOR_DOCUMENTS_FILING = 'liquidator_documents_filing',
  COMPOUNDING_OF_OFFENCES = 'compounding_of_offences',
  
  // Board & Shareholder Meeting Compliances
  DRAFTING_CIRCULATION_NOTICE_AGENDA = 'drafting_circulation_notice_agenda',
  CONDUCTING_MEETINGS = 'conducting_meetings',
  DRAFTING_MINUTES = 'drafting_minutes',
  ASSISTANCE_EVOTING_POSTAL_BALLOT = 'assistance_evoting_postal_ballot',
  PREPARATION_FILING_RESOLUTIONS_ROC = 'preparation_filing_resolutions_roc',
  DRAFTING_SHAREHOLDER_AGREEMENTS_POLICIES = 'drafting_shareholder_agreements_policies',
  SECRETARIAL_STANDARDS_COMPLIANCE = 'secretarial_standards_compliance',
  
  // Compliance Management
  COMPLIANCE_MANAGEMENT = 'compliance_management'
}

export enum PaymentStructure {
  LUMP_SUM = 'lump_sum',
  MILESTONE_BASED = 'milestone_based',
  MONTHLY_RETAINER = 'monthly_retainer',
  USAGE_BASED = 'usage_based'
}

export enum NegotiationReason {
  REVISE_TIMELINE = 'revise_timeline',
  REQUEST_INFO = 'request_info',
  REQUEST_DOCUMENTS = 'request_documents',
  ADJUST_FEE = 'adjust_fee',
  CHANGE_PAYMENT_STRUCTURE = 'change_payment_structure',
  PRICING = 'pricing',
  TIMELINE = 'timeline',
  SCOPE = 'scope'
}

export interface ServiceRequestDocument {
  id: string;
  name: string;
  label: string;
  url: string;
  uploadedAt: Date;
  size: number;
  type: string;
}

export interface ServiceQuestionnaire {
  id: string;
  question: string;
  answer?: string;
  isRequired: boolean;
  isSkipped: boolean;
}

export interface ServiceRequest {
  id: string;
  srnNumber: string;
  title: string;
  description: string;
  serviceCategory: ProfessionalType[];
  serviceTypes: ServiceType[];
  scopeOfWork: string;
  budgetRange?: {
    min: number;
    max: number;
  };
  budgetNotClear: boolean;
  documents: ServiceRequestDocument[];
  questionnaire: ServiceQuestionnaire[];
  workRequiredBy?: Date;
  preferredLocations: string[];
  invitedProfessionals: string[];
  repeatPastProfessionals: string[];
  status: ServiceRequestStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deadline: Date;
  isAIAssisted: boolean;
  aiSuggestions?: {
    professionals: ProfessionalType[];
    services: ServiceType[];
    scopeOfWork: string;
    documents: string[];
  };
  // For missed opportunities
  missedReason?: 'awarded_to_another' | 'submission_time_passed' | 'marked_not_interested' | 'won_but_no_work_order' | 'not_interested';
  winningBidId?: string;
  winningBidAmount?: number;
  awardedDate?: Date;
  currentAssignee?: {
    id: string;
    name: string;
    role: string;
    assignedAt?: Date;
  };
  lastEditedBy?: {
    userId: string;
    userName: string;
    timestamp: Date;
  };
  // Client profile information for service providers
  clientProfile?: {
    organizationName?: string;
    industry?: string;
    location?: string;
    companySize?: string;
  };
  // Additional information from client
  additionalInformation?: string;
  // Stage details for project breakdown
  stageDetails?: {
    stage: string;
    stageNumber: number;
    description: string;
    isOptional: boolean;
  }[];
}

export interface BidMilestone {
  id: string;
  stageLabel: string;
  paymentAmount: number;
  dueDate?: Date;
  description?: string;
}

export interface BidReimbursements {
  regulatoryStatutoryPayouts: number;
  opeProfessionalTeam: number;
}

export interface BidFinancials {
  professionalFee: number;
  platformFee: number;
  gst: number;
  reimbursements: BidReimbursements;
  totalBidAmount: number;
  paymentStructure: PaymentStructure;
  milestones?: BidMilestone[];
}

export interface BidDocument {
  id: string;
  name: string;
  label: string;
  url: string;
  uploadedAt: Date;
  size: number;
  type: string;
}

export interface AdditionalClientInput {
  id: string;
  description: string;
  documents: BidDocument[];
  documentLabel: string;
}

export interface Bid {
  id: string;
  bidNumber: string;
  serviceRequestId: string;
  providerId: string;
  providerName: string;
  providerProfile?: {
    rating: number;
    completedProjects: number;
    expertise: string[];
    location: string;
  };
  financials: BidFinancials;
  deliveryDate: Date;
  additionalInputs: string;
  additionalClientInputs: AdditionalClientInput[];
  documents: BidDocument[];
  status: BidStatus;
  isInvited: boolean;
  submittedAt: Date;
  updatedAt: Date;
  lastEditDate: Date;
  negotiationThread?: NegotiationThreadDetailed;
  // For missed opportunities - winning bid information
  isWinningBid?: boolean;
  awardedAmount?: number;
  awardedDate?: Date;
}

export interface NegotiationMessage {
  id: string;
  senderId: string;
  senderType: 'seeker' | 'provider';
  message: string;
  timestamp: Date;
  isPrivate: boolean;
  attachments?: string[];
}

export interface NegotiationThread {
  id: string;
  serviceRequestId: string;
  bidId: string;
  seekerId: string;
  providerId: string;
  reasons: NegotiationReason[];
  messages: NegotiationMessage[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface NegotiationThreadDetailed {
  id: string;
  bidId: string;
  serviceRequestId: string;
  status: 'active' | 'completed' | 'cancelled';
  initiatedBy: 'seeker' | 'provider';
  initiatedAt: Date;
  lastActivity: Date;
  inputs: NegotiationInputDetailed[];
}

export interface NegotiationInputDetailed {
  id: string;
  senderId: string;
  senderType: 'seeker' | 'provider';
  timestamp: Date;
  reason: NegotiationReason;
  message: string;
  proposedChanges?: {
    financials?: Partial<BidFinancials>;
    milestones?: Partial<BidMilestone>[];
    deliveryDate?: Date;
    additionalInputs?: string;
  };
  attachments?: {
    id: string;
    name: string;
    url: string;
    uploadedAt: Date;
  }[];
}

export interface NegotiationInput {
  reason: NegotiationReason;
  data: {
    revisedTimeline?: {
      newCompletionDate: Date;
      reasonForChange: string;
    };
    requestInfo?: {
      clarificationNeeded: string;
    };
    requestDocuments?: {
      documentType: string;
      purpose: string;
    };
    adjustFee?: {
      suggestedFee: number;
      justification: string;
    };
    changePaymentStructure?: {
      preferredModel: PaymentStructure;
      proposedTerms: string;
      reason: string;
    };
  };
}

export interface OpportunityStats {
  total: number;
  open: number;
  bidSubmitted: number;
  won: number;
  missed: number;
}

export interface ServiceRequestStats {
  total: number;
  open: number;
  closed: number;
  draft: number;
  bidsReceived: number;
}

export interface QueryClarification {
  id: string;
  serviceRequestId: string;
  // Optional association to a specific bid for per-bid queries
  bidId?: string;
  senderId: string;
  senderType: 'seeker' | 'provider';
  message: string;
  isPublic: boolean;
  recipients?: string[];
  timestamp: Date;
  responses: QueryClarification[];
}

// Professional matching criteria for round-robin
export interface ProfessionalCriteria {
  category: ProfessionalType;
  location: string;
  rating: number;
  availability: boolean;
  workload: number;
  pastPerformance: number;
  qualificationMatch: number;
  fraternityInteraction: number;
  disciplinaryStatus: 'active' | 'suspended' | 'revoked';
  lastAssignedDate?: Date;
}

export interface TeamMemberAllocation {
  opportunityId: string;
  teamMemberId: string;
  allocatedBy: string;
  allocatedAt: Date;
  status: 'allocated' | 'reassigned' | 'completed';
}

// Filter and search interfaces
export interface ServiceRequestFilters {
  status?: ServiceRequestStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  srnNumber?: string;
  serviceType?: ServiceType[];
  budgetRange?: {
    min: number;
    max: number;
  };
}

export interface BidFilters {
  status?: BidStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  paymentStructure?: PaymentStructure[];
  invitedOnly?: boolean;
  eventType?: string;
}

export interface OpportunityFilters {
  status?: ServiceRequestStatus[];
  search?: string;
  srnNumber?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
  serviceType?: ServiceType[];
  location?: string[];
  assignee?: string;
}

// Pagination interface
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// API Response interfaces
export interface ServiceRequestResponse {
  data: ServiceRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BidResponse {
  data: Bid[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OpportunityResponse {
  data: ServiceRequest[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

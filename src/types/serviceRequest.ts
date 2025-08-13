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
  CANCELLED = 'cancelled'
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

export enum ServiceType {
  VALUATION_COMPANIES_ACT = 'valuation_companies_act',
  VALUATION_INCOME_TAX_ACT = 'valuation_income_tax_act',
  VALUATION_LB_IBC = 'valuation_lb_ibc',
  VALUATION_PM_IBC = 'valuation_pm_ibc',
  VALUATION_SFA_IBC = 'valuation_sfa_ibc',
  PUBLICATION_COMPANIES_ACT = 'publication_companies_act',
  PUBLICATION_IBC = 'publication_ibc',
  PUBLICATION_SEBI = 'publication_sebi',
  PUBLICATION_OTHER_LAWS = 'publication_other_laws',
  GST_COMPLIANCE = 'gst_compliance',
  LEGAL_NOTICE = 'legal_notice',
  ANNUAL_COMPLIANCE = 'annual_compliance',
  OTHERS = 'others'
}

export enum PaymentStructure {
  LUMP_SUM = 'lump_sum',
  MILESTONE_BASED = 'milestone_based',
  MONTHLY_RETAINER = 'monthly_retainer',
  USAGE_BASED = 'usage_based'
}

export enum NegotiationReason {
  REVISED_TIMELINE = 'revised_timeline',
  REQUEST_INFO = 'request_info',
  REQUEST_DOCUMENTS = 'request_documents',
  ADJUST_FEE = 'adjust_fee',
  CHANGE_PAYMENT_STRUCTURE = 'change_payment_structure'
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
}

export interface BidMilestone {
  id: string;
  label: string;
  amount: number;
  dueDate?: Date;
  description?: string;
}

export interface BidFinancials {
  professionalFee: number;
  platformFee: number;
  gst: number;
  reimbursements: number;
  regulatoryPayouts: number;
  ope: number;
  totalAmount: number;
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
  documents: BidDocument[];
  status: BidStatus;
  isInvited: boolean;
  submittedAt: Date;
  updatedAt: Date;
  lastEditDate: Date;
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
}

export interface OpportunityFilters {
  status?: string[];
  dateRange?: {
    from: Date;
    to: Date;
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
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

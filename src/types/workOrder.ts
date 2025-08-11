// Work Order Types and Interfaces

export enum WorkOrderStatus {
  PROFORMA = 'proforma',
  PAYMENT_PENDING = 'payment_pending',
  INFORMATION_SOUGHT = 'information_sought',
  INFORMATION_PENDING = 'information_pending',
  PROFORMA_ACCEPTANCE_PENDING = 'proforma_acceptance_pending',
  SIGNATURE_PENDING = 'signature_pending',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  DISPUTED = 'disputed',
  COMPLETED = 'completed',
  PAYMENT_PENDING_COMPLETION = 'payment_pending_completion',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum WorkOrderType {
  SERVICE_SEEKER_INITIATED = 'service_seeker_initiated',
  SERVICE_PROVIDER_INITIATED = 'service_provider_initiated'
}

export enum SignatureType {
  DIGITAL_SIGNATURE = 'digital_signature',
  E_SIGN = 'e_sign',
  PRINT_SIGN_UPLOAD = 'print_sign_upload'
}

export enum DisputeReason {
  MISSED_DEADLINE = 'missed_deadline',
  UNSATISFACTORY_DELIVERABLE = 'unsatisfactory_deliverable',
  UNRESPONSIVE_PROVIDER = 'unresponsive_provider',
  NON_RESPONSIVE_SEEKER = 'non_responsive_seeker',
  UNJUSTIFIED_DELAY = 'unjustified_delay',
  PAYMENT_NOT_RELEASED = 'payment_not_released',
  SCOPE_CREEP = 'scope_creep',
  UNPROFESSIONAL_CONDUCT = 'unprofessional_conduct',
  INVALID_FEE_ADVICE = 'invalid_fee_advice',
  WORK_REJECTION = 'work_rejection',
  EXCESSIVE_REVISIONS = 'excessive_revisions',
  OTHER = 'other'
}

export enum FeeAdviceStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PAID = 'paid',
  BALANCE_DUE = 'balance_due'
}

export enum PaymentTermStatus {
  PAID = 'paid',
  BALANCE_DUE = 'balance_due',
  OVERDUE = 'overdue'
}

export enum ActivityType {
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_DOWNLOADED = 'document_downloaded',
  DOCUMENT_DELETED = 'document_deleted',
  COMMENT_ADDED = 'comment_added',
  STATUS_CHANGED = 'status_changed',
  PAYMENT_MADE = 'payment_made',
  FEE_ADVICE_RAISED = 'fee_advice_raised',
  DISPUTE_RAISED = 'dispute_raised',
  FEEDBACK_PROVIDED = 'feedback_provided',
  TEAM_MEMBER_ALLOCATED = 'team_member_allocated',
  SIGNATURE_COMPLETED = 'signature_completed',
  WORK_ORDER_CREATED = 'work_order_created',
  WORK_ORDER_ACCEPTED = 'work_order_accepted',
  WORK_ORDER_REJECTED = 'work_order_rejected'
}

export enum WorkOrderTabAccess {
  WO_OVERVIEW = 'wo_overview',
  TRACK_TASK = 'track_task',
  RAISE_DISPUTE = 'raise_dispute',
  PROVIDE_FEEDBACK = 'provide_feedback',
  PAYMENT_AND_FEE_ADVICES = 'payment_and_fee_advices',
  GENERATE_FEE_ADVICES = 'generate_fee_advices',
  ACTIVITY_LOG = 'activity_log',
  WO_ALLOCATION = 'wo_allocation',
  FEEDBACK = 'feedback'
}

// Document interfaces
export interface WorkOrderDocument {
  id: string;
  name: string;
  label: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  size: number;
  type: string;
  category: 'draft' | 'final' | 'supporting' | 'signature';
  version?: number;
}

// Financial interfaces
export interface PaymentTerm {
  id: string;
  stageLabel: string;
  amountPercentage: number;
  amount: number;
  dueDate?: Date;
  status: PaymentTermStatus;
  paidDate?: Date;
}

export interface MoneyReceipt {
  id: string;
  receiptNumber: string;
  date: Date;
  amount: number;
  status: PaymentTermStatus;
  uploadedBy?: string;
  documentUrl?: string;
}

export interface FeeAdvice {
  id: string;
  requestNumber: string;
  workOrderId: string;
  date: Date;
  amount: number;
  description: string;
  status: FeeAdviceStatus;
  taskDescription?: string;
  deliverables?: string[];
  createdBy: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
}

export interface WorkOrderFinancials {
  professionalFee: number;
  platformFee: number;
  gst: number;
  reimbursements: number;
  regulatoryPayouts: number;
  ope: number;
  totalAmount: number;
  paymentTerms: PaymentTerm[];
  moneyReceipts: MoneyReceipt[];
  feeAdvices: FeeAdvice[];
}

// Task and collaboration interfaces
export interface TaskMilestone {
  id: string;
  title: string;
  description: string;
  deliveryDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  documents: WorkOrderDocument[];
  comments: TaskComment[];
}

export interface TaskComment {
  id: string;
  message: string;
  author: string;
  authorType: 'seeker' | 'provider';
  timestamp: Date;
  attachments?: WorkOrderDocument[];
}

export interface InformationRequest {
  id: string;
  type: 'text' | 'document';
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: Date;
  response?: string;
  responseDocuments?: WorkOrderDocument[];
  respondedAt?: Date;
  status: 'pending' | 'responded' | 'overdue';
}

// Dispute interfaces
export interface DisputeMessage {
  id: string;
  message: string;
  author: string;
  authorType: 'seeker' | 'provider' | 'admin';
  timestamp: Date;
  attachments?: WorkOrderDocument[];
}

export interface WorkOrderDispute {
  id: string;
  workOrderId: string;
  raisedBy: string;
  raisedByType: 'seeker' | 'provider';
  reason: DisputeReason;
  description: string;
  supportingDocuments: WorkOrderDocument[];
  messages: DisputeMessage[];
  status: 'active' | 'resolved' | 'escalated';
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: string;
  adminNotes?: string;
}

// Feedback interfaces
export interface WorkOrderFeedback {
  id: string;
  workOrderId: string;
  providedBy: string;
  providedByType: 'seeker' | 'provider';
  stage: 'during_execution' | 'on_completion';
  rating: number; // 1-5 stars
  reviewSummary: string;
  suggestions?: string;
  concerns?: string[];
  timestamp: Date;
}

// Team allocation interfaces
export interface TeamMemberAccess {
  memberId: string;
  memberName: string;
  memberEmail: string;
  accessTabs: WorkOrderTabAccess[];
  allocatedBy: string;
  allocatedAt: Date;
  status: 'active' | 'inactive';
}

// Activity log interface
export interface WorkOrderActivity {
  id: string;
  workOrderId: string;
  type: ActivityType;
  description: string;
  performedBy: string;
  performedByType: 'seeker' | 'provider' | 'system';
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Main Work Order interface
export interface WorkOrder {
  id: string;
  woNumber: string;
  referenceNumber?: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  
  // Related entities
  serviceRequestId?: string;
  bidId?: string;
  
  // Parties
  serviceSeeker: {
    id: string;
    name: string;
    email: string;
    address: string;
    pan?: string;
    gst?: string;
  };
  
  serviceProvider: {
    id: string;
    name: string;
    email: string;
    address: string;
    pan?: string;
    gst?: string;
  };
  
  // Work details
  title: string;
  scopeOfWork: string;
  deliverables: string[];
  timeline: {
    startDate: Date;
    expectedCompletionDate: Date;
    actualCompletionDate?: Date;
  };
  
  // Financial details
  financials: WorkOrderFinancials;
  
  // Documents and collaboration
  documents: WorkOrderDocument[];
  milestones: TaskMilestone[];
  informationRequests: InformationRequest[];
  
  // Feedback and disputes
  feedbacks: WorkOrderFeedback[];
  disputes: WorkOrderDispute[];
  
  // Team allocation
  teamMembers: TeamMemberAccess[];
  
  // Activity tracking
  activities: WorkOrderActivity[];
  
  // Signature details
  signatures: {
    seekerSigned: boolean;
    seekerSignedAt?: Date;
    seekerSignatureType?: SignatureType;
    providerSigned: boolean;
    providerSignedAt?: Date;
    providerSignatureType?: SignatureType;
  };
  
  // Metadata
  createdBy: string;
  createdByType: 'seeker' | 'provider';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  
  // AI features
  aiGenerated?: boolean;
  aiSuggestions?: {
    milestones: string[];
    deliverables: string[];
    timeline: number; // days
  };
}

// Statistics interfaces
export interface WorkOrderStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  disputed: number;
  overdue: number;
  pendingPayment: number;
}

// Filter interfaces
export interface WorkOrderFilters {
  status?: WorkOrderStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  woNumber?: string;
  referenceNumber?: string;
  type?: WorkOrderType[];
  createdBy?: string;
  amountRange?: {
    min: number;
    max: number;
  };
}

// Pagination and response interfaces
export interface WorkOrderResponse {
  data: WorkOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Create Work Order interfaces
export interface CreateWorkOrderRequest {
  clientEmail: string;
  clientName?: string;
  title: string;
  scopeOfWork: string;
  deliverables: string[];
  timeline: {
    startDate: Date;
    expectedCompletionDate: Date;
  };
  milestones: Omit<TaskMilestone, 'id' | 'documents' | 'comments' | 'status'>[];
  financials: {
    professionalFee: number;
    reimbursements?: number;
    regulatoryPayouts?: number;
    ope?: number;
  };
  documents: File[];
  referenceNumber?: string;
}

export interface WorkOrderCreationResponse {
  workOrder: WorkOrder;
  proformaUrl: string;
  invitationSent: boolean;
}

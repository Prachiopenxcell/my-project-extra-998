export enum FeedbackStage {
  DURING_EXECUTION = 'during_execution',
  FINAL_COMPLETION = 'final_completion'
}

export enum FeedbackStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  DISPUTED = 'disputed',
  RESOLVED = 'resolved'
}

export enum DisputeStatus {
  NONE = 'none',
  RAISED = 'raised',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved'
}

export enum WorkOrderStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

export interface RatingBreakdown {
  timelyDeliverables: number;
  qualityOfWork: number;
  communicationSkills: number;
  clientFeedback: number;
}

export interface FeedbackItem {
  id: string;
  workOrderNumber: string;
  serviceType: string;
  overallRating: number;
  status: WorkOrderStatus;
  feedbackDate: string;
  serviceSeekerName: string;
  serviceSeekerCompany: string;
  writtenReview: string;
  ratingBreakdown: RatingBreakdown;
  feedbackStage: FeedbackStage;
  hasAdditionalComments: boolean;
  concernsFlagged?: string[];
  disputeStatus: DisputeStatus;
  adminReview?: string;
}

export interface FeedbackStats {
  overallRating: number;
  totalReviews: number;
  recentMonthRating: number;
  improvementTrend: 'up' | 'down' | 'stable';
  completedFeedbacks: number;
  pendingFeedbacks: number;
  disputedFeedbacks: number;
  inProgressFeedbacks: number;
}

export interface FeedbackFilters {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  rating: string;
  workOrderStatus: string;
  serviceType: string;
  feedbackStage: string;
  disputeStatus: string;
}

export interface FeedbackAnalytics {
  performanceTrends: {
    month: string;
    rating: number;
  }[];
  strengths: {
    category: string;
    rating: number;
  }[];
  areasForImprovement: {
    category: string;
    rating: number;
  }[];
}

export interface FeedbackResponse {
  feedbacks: FeedbackItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  stats: FeedbackStats;
  analytics: FeedbackAnalytics;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

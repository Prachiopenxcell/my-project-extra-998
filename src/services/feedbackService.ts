import { 
  FeedbackItem, 
  FeedbackStats, 
  FeedbackFilters, 
  FeedbackResponse, 
  FeedbackAnalytics,
  PaginationOptions,
  FeedbackStage,
  WorkOrderStatus,
  DisputeStatus,
  RatingBreakdown
} from '@/types/feedback';

// Mock data for feedback items
const mockFeedbacks: FeedbackItem[] = [
  {
    id: '1',
    workOrderNumber: 'WO#2024-001',
    serviceType: 'Valuation Services',
    overallRating: 5.0,
    status: WorkOrderStatus.COMPLETED,
    feedbackDate: '2024-11-15',
    serviceSeekerName: 'John Smith',
    serviceSeekerCompany: 'ABC Corp Ltd',
    writtenReview: 'Outstanding work quality and timely delivery. Highly professional approach and excellent communication throughout the project.',
    ratingBreakdown: {
      timelyDeliverables: 5.0,
      qualityOfWork: 5.0,
      communicationSkills: 5.0,
      clientFeedback: 5.0
    },
    feedbackStage: FeedbackStage.FINAL_COMPLETION,
    hasAdditionalComments: true,
    disputeStatus: DisputeStatus.NONE
  },
  {
    id: '2',
    workOrderNumber: 'WO#2024-002',
    serviceType: 'Publication Services',
    overallRating: 4.2,
    status: WorkOrderStatus.IN_PROGRESS,
    feedbackDate: '2024-11-08',
    serviceSeekerName: 'Sarah Johnson',
    serviceSeekerCompany: 'XYZ Enterprises',
    writtenReview: 'Good progress so far. Some minor delays but professional is responsive to queries. Looking forward to completion.',
    ratingBreakdown: {
      timelyDeliverables: 4.0,
      qualityOfWork: 5.0,
      communicationSkills: 4.0,
      clientFeedback: 4.0
    },
    feedbackStage: FeedbackStage.DURING_EXECUTION,
    hasAdditionalComments: true,
    concernsFlagged: ['Delay'],
    disputeStatus: DisputeStatus.NONE
  },
  {
    id: '3',
    workOrderNumber: 'WO#2024-003',
    serviceType: 'Legal Advisory',
    overallRating: 4.8,
    status: WorkOrderStatus.COMPLETED,
    feedbackDate: '2024-11-02',
    serviceSeekerName: 'Michael Brown',
    serviceSeekerCompany: 'DEF Industries',
    writtenReview: 'Excellent legal expertise. Minor concern about initial response time but overall very satisfied with the outcome and professionalism.',
    ratingBreakdown: {
      timelyDeliverables: 4.5,
      qualityOfWork: 5.0,
      communicationSkills: 5.0,
      clientFeedback: 4.8
    },
    feedbackStage: FeedbackStage.FINAL_COMPLETION,
    hasAdditionalComments: true,
    disputeStatus: DisputeStatus.RESOLVED,
    adminReview: 'Completed'
  },
  {
    id: '4',
    workOrderNumber: 'WO#2024-004',
    serviceType: 'Financial Advisory',
    overallRating: 4.6,
    status: WorkOrderStatus.COMPLETED,
    feedbackDate: '2024-10-28',
    serviceSeekerName: 'Emily Davis',
    serviceSeekerCompany: 'GHI Solutions',
    writtenReview: 'Very thorough analysis and professional presentation. Delivered on time with excellent documentation.',
    ratingBreakdown: {
      timelyDeliverables: 4.8,
      qualityOfWork: 4.7,
      communicationSkills: 4.5,
      clientFeedback: 4.4
    },
    feedbackStage: FeedbackStage.FINAL_COMPLETION,
    hasAdditionalComments: false,
    disputeStatus: DisputeStatus.NONE
  },
  {
    id: '5',
    workOrderNumber: 'WO#2024-005',
    serviceType: 'Tax Consultation',
    overallRating: 3.8,
    status: WorkOrderStatus.COMPLETED,
    feedbackDate: '2024-10-25',
    serviceSeekerName: 'Robert Wilson',
    serviceSeekerCompany: 'JKL Corp',
    writtenReview: 'Service was adequate but could have been more proactive in communication. Final deliverable was satisfactory.',
    ratingBreakdown: {
      timelyDeliverables: 3.5,
      qualityOfWork: 4.0,
      communicationSkills: 3.5,
      clientFeedback: 4.2
    },
    feedbackStage: FeedbackStage.FINAL_COMPLETION,
    hasAdditionalComments: true,
    concernsFlagged: ['Communication'],
    disputeStatus: DisputeStatus.NONE
  }
];

const mockStats: FeedbackStats = {
  overallRating: 4.3,
  totalReviews: 47,
  recentMonthRating: 4.6,
  improvementTrend: 'up',
  completedFeedbacks: 42,
  pendingFeedbacks: 3,
  disputedFeedbacks: 1,
  inProgressFeedbacks: 1
};

const mockAnalytics: FeedbackAnalytics = {
  performanceTrends: [
    { month: 'Jun', rating: 4.1 },
    { month: 'Jul', rating: 4.2 },
    { month: 'Aug', rating: 4.0 },
    { month: 'Sep', rating: 4.3 },
    { month: 'Oct', rating: 4.4 },
    { month: 'Nov', rating: 4.6 }
  ],
  strengths: [
    { category: 'Quality Work', rating: 4.7 },
    { category: 'Professionalism', rating: 4.6 },
    { category: 'Communication', rating: 4.5 }
  ],
  areasForImprovement: [
    { category: 'Timely Delivery', rating: 4.1 },
    { category: 'Initial Response Time', rating: 4.0 }
  ]
};

class FeedbackService {
  async getFeedbacks(
    filters: Partial<FeedbackFilters> = {},
    pagination: Partial<PaginationOptions> = {}
  ): Promise<FeedbackResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredFeedbacks = [...mockFeedbacks];

    // Apply filters
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredFeedbacks = filteredFeedbacks.filter(feedback =>
        feedback.workOrderNumber.toLowerCase().includes(searchLower) ||
        feedback.serviceType.toLowerCase().includes(searchLower) ||
        feedback.serviceSeekerCompany.toLowerCase().includes(searchLower) ||
        feedback.writtenReview.toLowerCase().includes(searchLower)
      );
    }

    if (filters.rating && filters.rating !== 'all') {
      const ratingFilter = parseFloat(filters.rating);
      filteredFeedbacks = filteredFeedbacks.filter(feedback => {
        if (filters.rating === '5') return feedback.overallRating >= 4.5;
        if (filters.rating === '4') return feedback.overallRating >= 3.5 && feedback.overallRating < 4.5;
        if (filters.rating === '3') return feedback.overallRating >= 2.5 && feedback.overallRating < 3.5;
        if (filters.rating === '2') return feedback.overallRating >= 1.5 && feedback.overallRating < 2.5;
        if (filters.rating === '1') return feedback.overallRating < 1.5;
        return true;
      });
    }

    if (filters.workOrderStatus && filters.workOrderStatus !== 'all') {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => 
        feedback.status === filters.workOrderStatus
      );
    }

    if (filters.serviceType && filters.serviceType !== 'all') {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => 
        feedback.serviceType === filters.serviceType
      );
    }

    if (filters.disputeStatus && filters.disputeStatus !== 'all') {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => 
        feedback.disputeStatus === filters.disputeStatus
      );
    }

    // Apply date filters
    if (filters.dateFrom) {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => 
        new Date(feedback.feedbackDate) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => 
        new Date(feedback.feedbackDate) <= new Date(filters.dateTo!)
      );
    }

    // Apply sorting
    const sortBy = pagination.sortBy || 'feedbackDate';
    const sortOrder = pagination.sortOrder || 'desc';
    
    filteredFeedbacks.sort((a, b) => {
      let aValue: any = a[sortBy as keyof FeedbackItem];
      let bValue: any = b[sortBy as keyof FeedbackItem];
      
      if (sortBy === 'feedbackDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

    return {
      feedbacks: paginatedFeedbacks,
      totalCount: filteredFeedbacks.length,
      currentPage: page,
      totalPages: Math.ceil(filteredFeedbacks.length / limit),
      stats: mockStats,
      analytics: mockAnalytics
    };
  }

  async getFeedbackById(id: string): Promise<FeedbackItem | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFeedbacks.find(feedback => feedback.id === id) || null;
  }

  async getServiceTypes(): Promise<string[]> {
    const serviceTypes = [...new Set(mockFeedbacks.map(f => f.serviceType))];
    return serviceTypes;
  }

  async exportFeedbacks(format: 'excel' | 'pdf'): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `feedback-report-${Date.now()}.${format}`;
  }

  async shareFeedbackSummary(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'feedback-summary-shared';
  }
}

export const feedbackService = new FeedbackService();

// Service Request and Bid Management Service

import {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceRequestFilters,
  ServiceRequestResponse,
  ServiceRequestStats,
  Bid,
  BidStatus,
  BidFilters,
  BidResponse,
  OpportunityResponse,
  OpportunityFilters,
  OpportunityStats,
  PaginationOptions,
  NegotiationThread,
  NegotiationInput,
  QueryClarification,
  TeamMemberAllocation,
  ProfessionalType,
  ServiceType,
  PaymentStructure,
  NegotiationReason
} from '@/types/serviceRequest';

class ServiceRequestService {
  private baseUrl = '/api/service-requests';

  // Mock data for development
  private mockServiceRequests: ServiceRequest[] = [
    {
      id: 'sr-001',
      srnNumber: 'SRN2024001',
      title: 'Company Valuation for Merger',
      description: 'Need comprehensive valuation of manufacturing company for merger proceedings',
      serviceCategory: [ProfessionalType.VALUER, ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.VALUATION_COMPANIES_ACT],
      scopeOfWork: 'Comprehensive valuation including asset valuation, financial analysis, and market comparison for merger proceedings. Detailed report required within 30 days.',
      budgetRange: { min: 50000, max: 100000 },
      budgetNotClear: false,
      documents: [
        {
          id: 'doc-001',
          name: 'Financial_Statements_2023.pdf',
          label: 'Annual Financial Statements',
          url: '/documents/financial-statements-2023.pdf',
          uploadedAt: new Date('2024-01-15'),
          size: 2048000,
          type: 'application/pdf'
        }
      ],
      questionnaire: [
        {
          id: 'q-001',
          question: 'What is the primary purpose of this valuation?',
          answer: 'Merger and acquisition proceedings',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-02-15'),
      preferredLocations: ['Mumbai', 'Delhi'],
      invitedProfessionals: ['prof-001'],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.BID_RECEIVED,
      createdBy: 'user-001',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      deadline: new Date('2024-02-10'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.VALUER],
        services: [ServiceType.VALUATION_COMPANIES_ACT],
        scopeOfWork: 'AI-generated scope based on merger valuation requirements',
        documents: ['Financial Statements', 'Asset Register', 'Market Analysis']
      }
    },
    {
      id: 'sr-002',
      srnNumber: 'SRN2024002',
      title: 'IBC Publication Notice',
      description: 'Publication of corporate insolvency resolution process notice in newspapers',
      serviceCategory: [ProfessionalType.INSOLVENCY_PROFESSIONAL],
      serviceTypes: [ServiceType.PUBLICATION_IBC],
      scopeOfWork: 'Publication of CIRP notice in leading national and regional newspapers as per IBC requirements.',
      budgetRange: { min: 15000, max: 25000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [
        {
          id: 'q-002',
          question: 'Which newspapers should the publication appear in?',
          answer: 'Economic Times, Business Standard, and regional newspaper',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-01-25'),
      preferredLocations: ['Pan India'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'user-002',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      deadline: new Date('2024-01-22'),
      isAIAssisted: false
    }
  ];

  private mockBids: Bid[] = [
    {
      id: 'bid-001',
      bidNumber: 'BID2024001',
      serviceRequestId: 'sr-001',
      providerId: 'provider-001',
      providerName: 'Valuation Experts Ltd.',
      providerProfile: {
        rating: 4.8,
        completedProjects: 156,
        expertise: ['Company Valuation', 'Asset Valuation', 'Financial Analysis'],
        location: 'Mumbai'
      },
      financials: {
        professionalFee: 75000,
        platformFee: 7500,
        gst: 14850,
        reimbursements: 5000,
        regulatoryPayouts: 2000,
        ope: 3000,
        totalAmount: 107350,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-001',
            label: 'Initial Assessment',
            amount: 35000,
            dueDate: new Date('2024-01-20'),
            description: 'Preliminary valuation and data collection'
          },
          {
            id: 'milestone-002',
            label: 'Final Report',
            amount: 40000,
            dueDate: new Date('2024-02-10'),
            description: 'Complete valuation report delivery'
          }
        ]
      },
      deliveryDate: new Date('2024-02-10'),
      additionalInputs: 'We will provide comprehensive valuation with market analysis and peer comparison.',
      documents: [
        {
          id: 'bid-doc-001',
          name: 'Sample_Valuation_Report.pdf',
          label: 'Sample Work Portfolio',
          url: '/documents/sample-valuation.pdf',
          uploadedAt: new Date('2024-01-13'),
          size: 1024000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.SUBMITTED,
      isInvited: true,
      submittedAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
      lastEditDate: new Date('2024-01-13')
    }
  ];

  // Service Request Management
  async createServiceRequest(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    // Mock implementation
    const newRequest: ServiceRequest = {
      id: `sr-${Date.now()}`,
      srnNumber: `SRN${new Date().getFullYear()}${String(Date.now()).slice(-3)}`,
      title: data.title || '',
      description: data.description || '',
      serviceCategory: data.serviceCategory || [],
      serviceTypes: data.serviceTypes || [],
      scopeOfWork: data.scopeOfWork || '',
      budgetRange: data.budgetRange,
      budgetNotClear: data.budgetNotClear || false,
      documents: data.documents || [],
      questionnaire: data.questionnaire || [],
      workRequiredBy: data.workRequiredBy,
      preferredLocations: data.preferredLocations || [],
      invitedProfessionals: data.invitedProfessionals || [],
      repeatPastProfessionals: data.repeatPastProfessionals || [],
      status: ServiceRequestStatus.DRAFT,
      createdBy: data.createdBy || 'current-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: data.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isAIAssisted: data.isAIAssisted || false,
      aiSuggestions: data.aiSuggestions
    };

    this.mockServiceRequests.push(newRequest);
    return newRequest;
  }

  async getServiceRequests(
    filters: ServiceRequestFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<ServiceRequestResponse> {
    // Mock implementation with filtering
    let filteredRequests = [...this.mockServiceRequests];

    if (filters.status) {
      filteredRequests = filteredRequests.filter(req => 
        filters.status!.includes(req.status)
      );
    }

    if (filters.srnNumber) {
      filteredRequests = filteredRequests.filter(req => 
        req.srnNumber.toLowerCase().includes(filters.srnNumber!.toLowerCase())
      );
    }

    if (filters.serviceType) {
      filteredRequests = filteredRequests.filter(req => 
        req.serviceTypes.some(type => filters.serviceType!.includes(type))
      );
    }

    // Pagination
    const total = filteredRequests.length;
    const totalPages = Math.ceil(total / pagination.limit);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const data = filteredRequests.slice(startIndex, endIndex);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages
    };
  }

  async getServiceRequestById(id: string): Promise<ServiceRequest | null> {
    return this.mockServiceRequests.find(req => req.id === id) || null;
  }

  async updateServiceRequest(id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const index = this.mockServiceRequests.findIndex(req => req.id === id);
    if (index === -1) {
      throw new Error('Service request not found');
    }

    this.mockServiceRequests[index] = {
      ...this.mockServiceRequests[index],
      ...data,
      updatedAt: new Date()
    };

    return this.mockServiceRequests[index];
  }

  async deleteServiceRequest(id: string): Promise<boolean> {
    const index = this.mockServiceRequests.findIndex(req => req.id === id);
    if (index === -1) {
      return false;
    }

    this.mockServiceRequests.splice(index, 1);
    return true;
  }

  async getServiceRequestStats(userId: string): Promise<ServiceRequestStats> {
    const userRequests = this.mockServiceRequests.filter(req => req.createdBy === userId);
    
    return {
      total: userRequests.length,
      open: userRequests.filter(req => 
        [ServiceRequestStatus.OPEN, ServiceRequestStatus.BID_RECEIVED].includes(req.status)
      ).length,
      closed: userRequests.filter(req => 
        [ServiceRequestStatus.CLOSED, ServiceRequestStatus.WORK_ORDER_ISSUED].includes(req.status)
      ).length,
      draft: userRequests.filter(req => req.status === ServiceRequestStatus.DRAFT).length,
      bidsReceived: userRequests.filter(req => req.status === ServiceRequestStatus.BID_RECEIVED).length
    };
  }

  // Bid Management
  async submitBid(data: Partial<Bid>): Promise<Bid> {
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      bidNumber: `BID${new Date().getFullYear()}${String(Date.now()).slice(-3)}`,
      serviceRequestId: data.serviceRequestId || '',
      providerId: data.providerId || 'current-provider',
      providerName: data.providerName || 'Current Provider',
      providerProfile: data.providerProfile,
      financials: data.financials || {
        professionalFee: 0,
        platformFee: 0,
        gst: 0,
        reimbursements: 0,
        regulatoryPayouts: 0,
        ope: 0,
        totalAmount: 0,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: data.deliveryDate || new Date(),
      additionalInputs: data.additionalInputs || '',
      documents: data.documents || [],
      status: BidStatus.SUBMITTED,
      isInvited: data.isInvited || false,
      submittedAt: new Date(),
      updatedAt: new Date(),
      lastEditDate: new Date()
    };

    this.mockBids.push(newBid);
    return newBid;
  }

  async getBidsForServiceRequest(serviceRequestId: string): Promise<Bid[]> {
    return this.mockBids.filter(bid => bid.serviceRequestId === serviceRequestId);
  }

  async getBidById(id: string): Promise<Bid | null> {
    return this.mockBids.find(bid => bid.id === id) || null;
  }

  async updateBid(id: string, data: Partial<Bid>): Promise<Bid> {
    const index = this.mockBids.findIndex(bid => bid.id === id);
    if (index === -1) {
      throw new Error('Bid not found');
    }

    this.mockBids[index] = {
      ...this.mockBids[index],
      ...data,
      updatedAt: new Date(),
      lastEditDate: new Date()
    };

    return this.mockBids[index];
  }

  async withdrawBid(id: string): Promise<boolean> {
    const index = this.mockBids.findIndex(bid => bid.id === id);
    if (index === -1) {
      return false;
    }

    this.mockBids[index].status = BidStatus.WITHDRAWN;
    this.mockBids[index].updatedAt = new Date();
    return true;
  }

  // Opportunities Management (for Service Providers)
  async getOpportunities(
    providerId: string,
    filters: OpportunityFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<OpportunityResponse> {
    // Mock implementation - in real app, this would filter based on provider qualifications
    let opportunities = [...this.mockServiceRequests];

    // Filter by status, service type, etc.
    if (filters.status) {
      opportunities = opportunities.filter(opp => 
        filters.status!.includes(opp.status)
      );
    }

    if (filters.serviceType) {
      opportunities = opportunities.filter(opp => 
        opp.serviceTypes.some(type => filters.serviceType!.includes(type))
      );
    }

    // Pagination
    const total = opportunities.length;
    const totalPages = Math.ceil(total / pagination.limit);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const data = opportunities.slice(startIndex, endIndex);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages
    };
  }

  async getOpportunityStats(providerId: string): Promise<OpportunityStats> {
    // Mock implementation
    return {
      total: 25,
      open: 8,
      bidSubmitted: 12,
      won: 3,
      missed: 2
    };
  }

  async markOpportunityNotInterested(opportunityId: string, providerId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  // Negotiation Management
  async initiateNegotiation(
    serviceRequestId: string,
    bidId: string,
    reasons: NegotiationReason[]
  ): Promise<NegotiationThread> {
    // Mock implementation
    const negotiation: NegotiationThread = {
      id: `neg-${Date.now()}`,
      serviceRequestId,
      bidId,
      seekerId: 'current-seeker',
      providerId: 'current-provider',
      reasons,
      messages: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return negotiation;
  }

  async submitNegotiationInput(
    negotiationId: string,
    input: NegotiationInput
  ): Promise<boolean> {
    // Mock implementation
    return true;
  }

  // Query and Clarification Management
  async postQuery(
    serviceRequestId: string,
    message: string,
    isPublic: boolean,
    recipients?: string[]
  ): Promise<QueryClarification> {
    // Mock implementation
    const query: QueryClarification = {
      id: `query-${Date.now()}`,
      serviceRequestId,
      senderId: 'current-user',
      senderType: 'seeker',
      message,
      isPublic,
      recipients,
      timestamp: new Date(),
      responses: []
    };

    return query;
  }

  async getQueriesForServiceRequest(serviceRequestId: string): Promise<QueryClarification[]> {
    // Mock implementation
    return [];
  }

  // Team Management (for Entity Admins)
  async allocateOpportunityToTeamMember(
    opportunityId: string,
    teamMemberId: string
  ): Promise<TeamMemberAllocation> {
    // Mock implementation
    const allocation: TeamMemberAllocation = {
      opportunityId,
      teamMemberId,
      allocatedBy: 'current-admin',
      allocatedAt: new Date(),
      status: 'allocated'
    };

    return allocation;
  }

  async bulkAllocateOpportunities(
    allocations: { opportunityId: string; teamMemberId: string }[]
  ): Promise<TeamMemberAllocation[]> {
    // Mock implementation
    return allocations.map(allocation => ({
      ...allocation,
      allocatedBy: 'current-admin',
      allocatedAt: new Date(),
      status: 'allocated' as const
    }));
  }

  // AI Assistance
  async getAISuggestions(description: string): Promise<{
    professionals: ProfessionalType[];
    services: ServiceType[];
    scopeOfWork: string;
    documents: string[];
  }> {
    // Mock AI suggestions based on keywords
    const suggestions = {
      professionals: [ProfessionalType.LAWYER, ProfessionalType.CHARTERED_ACCOUNTANT],
      services: [ServiceType.VALUATION_COMPANIES_ACT],
      scopeOfWork: 'AI-generated scope of work based on your requirements...',
      documents: ['Financial Statements', 'Legal Documents', 'Asset Register']
    };

    return suggestions;
  }

  // Export functionality
  async exportServiceRequests(
    filters: ServiceRequestFilters = {},
    format: 'excel' | 'csv' = 'excel'
  ): Promise<string> {
    // Mock implementation - would return download URL
    return '/downloads/service-requests-export.xlsx';
  }

  async exportBids(
    serviceRequestId: string,
    format: 'excel' | 'csv' = 'excel'
  ): Promise<string> {
    // Mock implementation - would return download URL
    return '/downloads/bids-export.xlsx';
  }
}

export const serviceRequestService = new ServiceRequestService();

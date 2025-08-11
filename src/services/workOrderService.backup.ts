// Work Order Service

import {
  WorkOrder,
  WorkOrderStatus,
  WorkOrderType,
  WorkOrderFilters,
  WorkOrderResponse,
  WorkOrderStats,
  PaginationOptions,
  CreateWorkOrderRequest,
  WorkOrderCreationResponse,
  FeeAdvice,
  FeeAdviceStatus,
  WorkOrderDispute,
  DisputeReason,
  WorkOrderFeedback,
  TeamMemberAccess,
  WorkOrderTabAccess,
  WorkOrderActivity,
  ActivityType,
  TaskMilestone,
  InformationRequest,
  SignatureType,
  PaymentTermStatus
} from '@/types/workOrder';

class WorkOrderService {
  private baseUrl = '/api/work-orders';

  // Mock data for development - Comprehensive test data for all scenarios
  private mockWorkOrders: WorkOrder[] = [
    {
      id: 'wo-001',
      woNumber: 'WO2024001',
      referenceNumber: 'REF-001',
      type: WorkOrderType.SERVICE_SEEKER_INITIATED,
      status: WorkOrderStatus.IN_PROGRESS,
      serviceRequestId: 'sr-001',
      bidId: 'bid-001',
      serviceSeeker: {
        id: 'seeker-001',
        name: 'ABC Manufacturing Ltd',
        email: 'admin@abcmfg.com',
        address: '123 Industrial Area, Mumbai, Maharashtra 400001',
        pan: 'ABCDE1234F',
        gst: '27ABCDE1234F1Z5'
      },
      serviceProvider: {
        id: 'provider-001',
        name: 'CA Rajesh Kumar & Associates',
        email: 'rajesh@cakumar.com',
        address: '456 Business District, Mumbai, Maharashtra 400002',
        pan: 'FGHIJ5678K',
        gst: '27FGHIJ5678K1Z5'
      },
      title: 'Annual Financial Audit 2024',
      scopeOfWork: 'Complete annual financial audit including statutory compliance, tax audit, and management letter preparation.',
      deliverables: ['Audit Report', 'Management Letter', 'Tax Audit Report', 'Compliance Certificate'],
      timeline: {
        startDate: new Date('2024-01-15'),
        expectedCompletionDate: new Date('2024-03-15'),
        actualCompletionDate: new Date('2024-03-10')
      },
      financials: {
        professionalFee: 150000,
        platformFee: 15000,
        gst: 29700,
        reimbursements: 5000,
        regulatoryPayouts: 2000,
        ope: 1000,
        totalAmount: 202700,
        paymentTerms: [
          {
            id: 'pt-001',
            stageLabel: 'Advance Payment',
            amountPercentage: 50,
            amount: 101350,
            status: PaymentTermStatus.PAID,
            dueDate: new Date('2024-01-15'),
            paidDate: new Date('2024-01-14')
          },
          {
            id: 'pt-002',
            stageLabel: 'Final Payment',
            amountPercentage: 50,
            amount: 101350,
            status: PaymentTermStatus.PAID,
            dueDate: new Date('2024-03-15'),
            paidDate: new Date('2024-03-12')
          }
        ],
        moneyReceipts: [],
        feeAdvices: []
      },
      documents: [
        {
          id: 'doc-001',
          name: 'Audit Report Final.pdf',
          label: 'Final Audit Report',
          url: '/documents/audit-report-final.pdf',
          uploadedAt: new Date('2024-03-10'),
          uploadedBy: 'provider-001',
          size: 2048000,
          type: 'application/pdf',
          category: 'final'
        },
        {
          id: 'doc-002',
          name: 'Management Letter.pdf',
          label: 'Management Letter',
          url: '/documents/management-letter.pdf',
          uploadedAt: new Date('2024-03-08'),
          uploadedBy: 'provider-001',
          size: 1024000,
          type: 'application/pdf',
          category: 'final'
        }
      ],
      milestones: [
        {
          id: 'ms-001',
          title: 'Initial Documentation Review',
          description: 'Review and verify all financial documents',
          deliveryDate: new Date('2024-02-01'),
          status: 'completed',
          documents: [],
          comments: []
        },
        {
          id: 'ms-002',
          title: 'Field Work Completion',
          description: 'Complete on-site audit procedures',
          deliveryDate: new Date('2024-02-28'),
          status: 'completed',
          documents: [],
          comments: []
        }
      ],
      informationRequests: [],
      feedbacks: [
        {
          id: 'fb-001',
          workOrderId: 'wo-001',
          providedBy: 'seeker-001',
          providedByType: 'seeker',
          stage: 'on_completion',
          rating: 5,
          reviewSummary: 'Excellent work! Very thorough audit and timely delivery.',
          timestamp: new Date('2024-03-12')
        }
      ],
      disputes: [],
      teamMembers: [],
      activities: [
        {
          id: 'act-001',
          workOrderId: 'wo-001',
          type: ActivityType.WORK_ORDER_CREATED,
          description: 'Work Order created from accepted bid',
          performedBy: 'seeker-001',
          performedByType: 'seeker',
          timestamp: new Date('2024-01-10')
        },
        {
          id: 'act-002',
          workOrderId: 'wo-001',
          type: ActivityType.STATUS_CHANGED,
          description: 'Status changed to In Progress',
          performedBy: 'provider-001',
          performedByType: 'provider',
          timestamp: new Date('2024-01-15')
        }
      ],
      signatures: {
        seekerSigned: true,
        seekerSignedAt: new Date('2024-01-12'),
        seekerSignatureType: SignatureType.DIGITAL_SIGNATURE,
        providerSigned: true,
        providerSignedAt: new Date('2024-01-13'),
        providerSignatureType: SignatureType.DIGITAL_SIGNATURE
      },
      createdBy: 'seeker-001',
      createdByType: 'seeker',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-12'),
      completedAt: new Date('2024-03-10')
    },
    {
      id: 'wo-002',
      woNumber: 'WO2024002',
      referenceNumber: 'REF-002',
      type: WorkOrderType.SERVICE_PROVIDER_INITIATED,
      status: WorkOrderStatus.DISPUTED,
      serviceSeeker: {
        id: 'seeker-002',
        name: 'XYZ Retail Chain',
        email: 'finance@xyzretail.com',
        address: '789 Commercial Street, Delhi, Delhi 110001',
        pan: 'KLMNO9012P',
        gst: '07KLMNO9012P1Z5'
      },
      serviceProvider: {
        id: 'provider-002',
        name: 'Legal Associates LLP',
        email: 'contact@legalassoc.com',
        address: '321 Law Street, Delhi, Delhi 110002',
        pan: 'PQRST3456U',
        gst: '07PQRST3456U1Z5'
      },
      title: 'Contract Review and Legal Advisory',
      scopeOfWork: 'Review of vendor contracts and legal compliance advisory for retail operations.',
      deliverables: ['Contract Analysis Report', 'Legal Compliance Checklist', 'Risk Assessment'],
      timeline: {
        startDate: new Date('2024-02-01'),
        expectedCompletionDate: new Date('2024-02-28')
      },
      financials: {
        professionalFee: 75000,
        platformFee: 7500,
        gst: 14850,
        reimbursements: 0,
        regulatoryPayouts: 0,
        ope: 0,
        totalAmount: 97350,
        paymentTerms: [
          {
            id: 'pt-003',
            stageLabel: 'Full Payment',
            amountPercentage: 100,
            amount: 97350,
            status: PaymentTermStatus.BALANCE_DUE,
            dueDate: new Date('2024-02-28')
          }
        ],
        moneyReceipts: [],
        feeAdvices: []
      },
      documents: [],
      milestones: [],
      informationRequests: [],
      feedbacks: [],
      disputes: [
        {
          id: 'disp-001',
          workOrderId: 'wo-002',
          raisedBy: 'seeker-002',
          raisedByType: 'seeker',
          reason: DisputeReason.UNSATISFACTORY_DELIVERABLE,
          description: 'The contract analysis provided was incomplete and did not cover all vendor agreements as specified.',
          supportingDocuments: [],
          messages: [],
          status: 'active',
          createdAt: new Date('2024-02-25')
        }
      ],
      teamMembers: [],
      activities: [],
      signatures: {
        seekerSigned: true,
        seekerSignedAt: new Date('2024-01-30'),
        seekerSignatureType: SignatureType.E_SIGN,
        providerSigned: true,
        providerSignedAt: new Date('2024-01-31'),
        providerSignatureType: SignatureType.E_SIGN
      },
      createdBy: 'provider-002',
      createdByType: 'provider',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-02-25')
    },
    {
      id: 'wo-003',
      woNumber: 'WO2024003',
      type: WorkOrderType.SERVICE_SEEKER_INITIATED,
      status: WorkOrderStatus.PAYMENT_PENDING,
      serviceSeeker: {
        id: 'seeker-003',
        name: 'Tech Innovations Pvt Ltd',
        email: 'admin@techinnovations.com',
        address: '456 Tech Park, Bangalore, Karnataka 560001'
      },
      serviceProvider: {
        id: 'provider-003',
        name: 'IP Law Consultants',
        email: 'info@iplawconsult.com',
        address: '789 Legal Complex, Bangalore, Karnataka 560002'
      },
      title: 'Intellectual Property Registration',
      scopeOfWork: 'Patent filing and trademark registration for new technology products.',
      deliverables: ['Patent Application', 'Trademark Registration', 'IP Strategy Document'],
      timeline: {
        startDate: new Date('2024-03-01'),
        expectedCompletionDate: new Date('2024-04-30')
      },
      financials: {
        professionalFee: 120000,
        platformFee: 12000,
        gst: 23760,
        reimbursements: 15000,
        regulatoryPayouts: 25000,
        ope: 2000,
        totalAmount: 197760,
        paymentTerms: [
          {
            id: 'pt-004',
            stageLabel: 'Advance Payment',
            amountPercentage: 60,
            amount: 118656,
            status: PaymentTermStatus.BALANCE_DUE,
            dueDate: new Date('2024-03-01')
          },
          {
            id: 'pt-005',
            stageLabel: 'Final Payment',
            amountPercentage: 40,
            amount: 79104,
            status: PaymentTermStatus.BALANCE_DUE,
            dueDate: new Date('2024-04-30')
          }
        ],
        moneyReceipts: [
          {
            id: 'mr-003',
            receiptNumber: 'MR2024003',
            amount: 50000,
            date: new Date('2024-03-05'),
            paymentMode: 'Bank Transfer',
            description: 'Partial payment for IP registration services'
          },
          {
            id: 'mr-004',
            receiptNumber: 'MR2024004',
            amount: 25000,
            date: new Date('2024-03-10'),
            paymentMode: 'UPI',
            description: 'Additional payment for trademark search'
          }
        ],
        feeAdvices: [
          {
            id: 'fa-003',
            workOrderId: 'wo-003',
            title: 'Additional Patent Search Fee',
            description: 'Additional comprehensive patent search required for international filing',
            amount: 15000,
            status: FeeAdviceStatus.PENDING,
            requestedBy: 'provider-003',
            requestedAt: new Date('2024-03-12'),
            justification: 'International patent search requires additional databases and expertise'
          },
          {
            id: 'fa-004',
            workOrderId: 'wo-003',
            title: 'Expedited Filing Fee',
            description: 'Fast-track processing for urgent trademark registration',
            amount: 8000,
            status: FeeAdviceStatus.ACCEPTED,
            requestedBy: 'provider-003',
            requestedAt: new Date('2024-03-08'),
            acceptedAt: new Date('2024-03-09'),
            justification: 'Client requested expedited processing for market launch'
          }
        ]
      },
      documents: [
        {
          id: 'doc-005',
          name: 'Patent Application Draft v1.pdf',
          label: 'Patent Application Draft',
          url: '/documents/patent-application-draft-v1.pdf',
          uploadedAt: new Date('2024-03-05'),
          uploadedBy: 'provider-003',
          size: 1024000,
          type: 'application/pdf',
          category: 'draft'
        },
        {
          id: 'doc-006',
          name: 'Trademark Search Report.pdf',
          label: 'Comprehensive Trademark Search',
          url: '/documents/trademark-search-report.pdf',
          uploadedAt: new Date('2024-03-08'),
          uploadedBy: 'provider-003',
          size: 512000,
          type: 'application/pdf',
          category: 'supporting'
        }
      ],
      milestones: [
        {
          id: 'ms-005',
          title: 'Patent Application Preparation',
          description: 'Prepare comprehensive patent application with technical specifications',
          deliveryDate: new Date('2024-03-15'),
          status: 'completed',
          documents: [],
          comments: []
        },
        {
          id: 'ms-006',
          title: 'Trademark Registration Filing',
          description: 'File trademark registration with appropriate authorities',
          deliveryDate: new Date('2024-04-01'),
          status: 'in_progress',
          documents: [],
          comments: []
        }
      ],
      informationRequests: [
        {
          id: 'ir-003',
          workOrderId: 'wo-003',
          title: 'Technical Specifications Required',
          description: 'Need detailed technical specifications and drawings for patent application',
          requestedBy: 'provider-003',
          requestedAt: new Date('2024-03-02'),
          dueDate: new Date('2024-03-10'),
          status: 'fulfilled',
          response: 'Technical specifications and CAD drawings provided',
          respondedAt: new Date('2024-03-08')
        },
        {
          id: 'ir-004',
          workOrderId: 'wo-003',
          title: 'Market Research Data',
          description: 'Require market analysis and competitive landscape for trademark strategy',
          requestedBy: 'provider-003',
          requestedAt: new Date('2024-03-06'),
          dueDate: new Date('2024-03-15'),
          status: 'pending',
          response: null,
          respondedAt: null
        }
      ],
      feedbacks: [
        {
          id: 'fb-003',
          workOrderId: 'wo-003',
          providedBy: 'seeker-003',
          providedByType: 'seeker',
          stage: 'during_execution',
          rating: 4,
          reviewSummary: 'Good progress on patent application. Communication could be improved.',
          timestamp: new Date('2024-03-10')
        },
        {
          id: 'fb-004',
          workOrderId: 'wo-003',
          providedBy: 'provider-003',
          providedByType: 'provider',
          stage: 'during_execution',
          rating: 5,
          reviewSummary: 'Client is very responsive and provides clear requirements. Excellent collaboration.',
          timestamp: new Date('2024-03-12')
        }
      ],
      disputes: [],
      teamMembers: [
        {
          id: 'tm-003',
          workOrderId: 'wo-003',
          userId: 'team-member-005',
          name: 'Priya Sharma',
          email: 'priya.sharma@iplawconsult.com',
          role: 'Patent Attorney',
          accessLevel: [WorkOrderTabAccess.OVERVIEW, WorkOrderTabAccess.TRACK_TASK, WorkOrderTabAccess.DOCUMENTS],
          assignedAt: new Date('2024-03-01')
        },
        {
          id: 'tm-004',
          workOrderId: 'wo-003',
          userId: 'team-member-006',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@iplawconsult.com',
          role: 'Trademark Specialist',
          accessLevel: [WorkOrderTabAccess.OVERVIEW, WorkOrderTabAccess.TRACK_TASK, WorkOrderTabAccess.ACTIVITY_LOG],
          assignedAt: new Date('2024-03-03')
        }
      ],
      activities: [
        {
          id: 'act-005',
          workOrderId: 'wo-003',
          type: ActivityType.WORK_ORDER_CREATED,
          description: 'Work Order created for IP registration services',
          performedBy: 'seeker-003',
          performedByType: 'seeker',
          timestamp: new Date('2024-02-28')
        },
        {
          id: 'act-006',
          workOrderId: 'wo-003',
          type: ActivityType.DOCUMENT_UPLOADED,
          description: 'Patent application draft uploaded',
          performedBy: 'provider-003',
          performedByType: 'provider',
          timestamp: new Date('2024-03-05')
        },
        {
          id: 'act-007',
          workOrderId: 'wo-003',
          type: ActivityType.MILESTONE_COMPLETED,
          description: 'Patent Application Preparation milestone completed',
          performedBy: 'provider-003',
          performedByType: 'provider',
          timestamp: new Date('2024-03-15')
        }
      ],
      signatures: {
        seekerSigned: false,
        providerSigned: false
      },
      createdBy: 'seeker-003',
      createdByType: 'seeker',
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-02-28')
    }
  ];

  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get work orders for service seeker
  async getWorkOrdersForSeeker(
    seekerId: string,
    filters?: WorkOrderFilters,
    pagination?: PaginationOptions
  ): Promise<WorkOrderResponse> {
    await this.delay(500);

    // For demo purposes, return all work orders for any authenticated user
    // In production, this would filter by actual seekerId
    let filteredOrders = this.mockWorkOrders;

    // Apply filters
    if (filters?.status && filters.status.length > 0) {
      filteredOrders = filteredOrders.filter(wo => filters.status!.includes(wo.status));
    }

    if (filters?.woNumber) {
      filteredOrders = filteredOrders.filter(wo => 
        wo.woNumber.toLowerCase().includes(filters.woNumber!.toLowerCase())
      );
    }

    if (filters?.dateRange) {
      filteredOrders = filteredOrders.filter(wo => 
        wo.createdAt >= filters.dateRange!.from && wo.createdAt <= filters.dateRange!.to
      );
    }

    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: filteredOrders.slice(startIndex, endIndex),
      total: filteredOrders.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOrders.length / limit)
    };
  }

  // Get work orders for service provider
  async getWorkOrdersForProvider(
    providerId: string,
    filters?: WorkOrderFilters,
    pagination?: PaginationOptions
  ): Promise<WorkOrderResponse> {
    await this.delay(500);

    // For demo purposes, return all work orders for any authenticated user
    // In production, this would filter by actual providerId
    let filteredOrders = this.mockWorkOrders;

    // Apply filters (same logic as seeker)
    if (filters?.status && filters.status.length > 0) {
      filteredOrders = filteredOrders.filter(wo => filters.status!.includes(wo.status));
    }

    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: filteredOrders.slice(startIndex, endIndex),
      total: filteredOrders.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOrders.length / limit)
    };
  }

  // Get work order by ID
  async getWorkOrderById(id: string): Promise<WorkOrder | null> {
    await this.delay(300);
    return this.mockWorkOrders.find(wo => wo.id === id) || null;
  }

  // Get work order statistics
  async getWorkOrderStats(userId: string, userType: 'seeker' | 'provider'): Promise<WorkOrderStats> {
    await this.delay(200);

    // For demo purposes, return stats for all work orders for any authenticated user
    // In production, this would filter by actual userId
    const userOrders = this.mockWorkOrders;

    return {
      total: userOrders.length,
      open: userOrders.filter(wo => [WorkOrderStatus.PROFORMA, WorkOrderStatus.PAYMENT_PENDING, WorkOrderStatus.SIGNATURE_PENDING].includes(wo.status)).length,
      inProgress: userOrders.filter(wo => wo.status === WorkOrderStatus.IN_PROGRESS).length,
      completed: userOrders.filter(wo => wo.status === WorkOrderStatus.COMPLETED).length,
      disputed: userOrders.filter(wo => wo.status === WorkOrderStatus.DISPUTED).length,
      overdue: userOrders.filter(wo => {
        const now = new Date();
        return wo.timeline.expectedCompletionDate < now && wo.status !== WorkOrderStatus.COMPLETED;
      }).length,
      pendingPayment: userOrders.filter(wo => wo.status === WorkOrderStatus.PAYMENT_PENDING).length
    };
  }

  // Create work order from bid
  async createWorkOrderFromBid(bidId: string, serviceRequestId: string): Promise<WorkOrder> {
    await this.delay(1000);

    // Mock work order creation
    const newWorkOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      woNumber: `WO${new Date().getFullYear()}${String(Date.now()).slice(-3)}`,
      type: WorkOrderType.SERVICE_SEEKER_INITIATED,
      status: WorkOrderStatus.PROFORMA,
      serviceRequestId,
      bidId,
      serviceSeeker: {
        id: 'seeker-001',
        name: 'Mock Service Seeker',
        email: 'seeker@example.com',
        address: 'Mock Address'
      },
      serviceProvider: {
        id: 'provider-001',
        name: 'Mock Service Provider',
        email: 'provider@example.com',
        address: 'Mock Provider Address'
      },
      title: 'Mock Work Order',
      scopeOfWork: 'Mock scope of work',
      deliverables: ['Mock Deliverable 1', 'Mock Deliverable 2'],
      timeline: {
        startDate: new Date(),
        expectedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      financials: {
        professionalFee: 50000,
        platformFee: 5000,
        gst: 9900,
        reimbursements: 0,
        regulatoryPayouts: 0,
        ope: 0,
        totalAmount: 64900,
        paymentTerms: [],
        moneyReceipts: [],
        feeAdvices: []
      },
      documents: [],
      milestones: [],
      informationRequests: [],
      feedbacks: [],
      disputes: [],
      teamMembers: [],
      activities: [],
      signatures: {
        seekerSigned: false,
        providerSigned: false
      },
      createdBy: 'seeker-001',
      createdByType: 'seeker',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock data
    this.mockWorkOrders.push(newWorkOrder);
    return newWorkOrder;
  }

  // Create work order
  async createWorkOrder(request: CreateWorkOrderRequest): Promise<WorkOrderCreationResponse> {
    await this.delay(1000);

    const newWorkOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      woNumber: `@TEMP-${Date.now()}`, // Temporary until payment
      referenceNumber: request.referenceNumber,
      type: WorkOrderType.SERVICE_PROVIDER_INITIATED,
      status: WorkOrderStatus.PROFORMA,
      serviceSeeker: {
        id: 'temp-seeker',
        name: request.clientName || 'Client Name',
        email: request.clientEmail,
        address: 'Client Address'
      },
      serviceProvider: {
        id: 'current-provider',
        name: 'Current Provider',
        email: 'provider@example.com',
        address: 'Provider Address'
      },
      title: request.title,
      scopeOfWork: request.scopeOfWork,
      deliverables: request.deliverables,
      timeline: request.timeline,
      financials: {
        professionalFee: request.financials.professionalFee,
        platformFee: Math.round(request.financials.professionalFee * 0.1),
        gst: Math.round((request.financials.professionalFee + Math.round(request.financials.professionalFee * 0.1)) * 0.18),
        reimbursements: request.financials.reimbursements || 0,
        regulatoryPayouts: request.financials.regulatoryPayouts || 0,
        ope: request.financials.ope || 0,
        totalAmount: request.financials.professionalFee + 
                    Math.round(request.financials.professionalFee * 0.1) + 
                    Math.round((request.financials.professionalFee + Math.round(request.financials.professionalFee * 0.1)) * 0.18) +
                    (request.financials.reimbursements || 0) +
                    (request.financials.regulatoryPayouts || 0) +
                    (request.financials.ope || 0),
        paymentTerms: [],
        moneyReceipts: [],
        feeAdvices: []
      },
      documents: [],
      milestones: request.milestones.map((ms, index) => ({
        id: `ms-${Date.now()}-${index}`,
        title: ms.title,
        description: ms.description,
        deliveryDate: ms.deliveryDate,
        status: 'pending' as const,
        documents: [],
        comments: []
      })),
      informationRequests: [],
      feedbacks: [],
      disputes: [],
      teamMembers: [],
      activities: [{
        id: `act-${Date.now()}`,
        workOrderId: `wo-${Date.now()}`,
        type: ActivityType.WORK_ORDER_CREATED,
        description: 'Work Order created by service provider',
        performedBy: 'current-provider',
        performedByType: 'provider',
        timestamp: new Date()
      }],
      signatures: {
        seekerSigned: false,
        providerSigned: false
      },
      createdBy: 'current-provider',
      createdByType: 'provider',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockWorkOrders.push(newWorkOrder);

    return {
      workOrder: newWorkOrder,
      proformaUrl: `/proforma/${newWorkOrder.id}`,
      invitationSent: true
    };
  }

  // Make payment
  async makePayment(workOrderId: string, amount: number): Promise<boolean> {
    await this.delay(800);

    const workOrder = this.mockWorkOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) return false;

    // Update status and add activity
    workOrder.status = WorkOrderStatus.SIGNATURE_PENDING;
    workOrder.updatedAt = new Date();

    return true;
  }

  // Sign work order
  async signWorkOrder(
    workOrderId: string, 
    signatureType: SignatureType, 
    userType: 'seeker' | 'provider'
  ): Promise<boolean> {
    await this.delay(600);

    const workOrder = this.mockWorkOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) return false;

    if (userType === 'seeker') {
      workOrder.signatures.seekerSigned = true;
      workOrder.signatures.seekerSignedAt = new Date();
      workOrder.signatures.seekerSignatureType = signatureType;
    } else {
      workOrder.signatures.providerSigned = true;
      workOrder.signatures.providerSignedAt = new Date();
      workOrder.signatures.providerSignatureType = signatureType;
    }

    // If both signed, move to in progress
    if (workOrder.signatures.seekerSigned && workOrder.signatures.providerSigned) {
      workOrder.status = WorkOrderStatus.IN_PROGRESS;
    }

    workOrder.updatedAt = new Date();
    return true;
  }

  // Additional methods for completeness
  async markComplete(workOrderId: string): Promise<boolean> {
    await this.delay(500);
    const workOrder = this.mockWorkOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) return false;
    
    workOrder.status = WorkOrderStatus.COMPLETED;
    workOrder.completedAt = new Date();
    workOrder.updatedAt = new Date();
    return true;
  }

  async raiseDispute(workOrderId: string, dispute: Partial<WorkOrderDispute>): Promise<boolean> {
    await this.delay(700);
    const workOrder = this.mockWorkOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) return false;
    
    const newDispute: WorkOrderDispute = {
      id: `disp-${Date.now()}`,
      workOrderId,
      raisedBy: dispute.raisedBy || 'user',
      raisedByType: dispute.raisedByType || 'seeker',
      reason: dispute.reason || DisputeReason.OTHER,
      description: dispute.description || '',
      supportingDocuments: [],
      messages: [],
      status: 'active',
      createdAt: new Date()
    };
    
    workOrder.disputes.push(newDispute);
    workOrder.status = WorkOrderStatus.DISPUTED;
    workOrder.updatedAt = new Date();
    return true;
  }

  async provideFeedback(workOrderId: string, feedback: Partial<WorkOrderFeedback>): Promise<boolean> {
    await this.delay(400);
    const workOrder = this.mockWorkOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) return false;
    
    const newFeedback: WorkOrderFeedback = {
      id: `fb-${Date.now()}`,
      workOrderId,
      providedBy: feedback.providedBy || 'user',
      providedByType: feedback.providedByType || 'seeker',
      stage: feedback.stage || 'on_completion',
      rating: feedback.rating || 5,
      reviewSummary: feedback.reviewSummary || '',
      timestamp: new Date()
    };
    
    workOrder.feedbacks.push(newFeedback);
    workOrder.updatedAt = new Date();
    return true;
  }
}

export const workOrderService = new WorkOrderService();

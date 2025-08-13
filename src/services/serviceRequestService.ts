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
        },
        {
          id: 'doc-002',
          name: 'Asset_Register.xlsx',
          label: 'Complete Asset Register',
          url: '/documents/asset-register.xlsx',
          uploadedAt: new Date('2024-01-16'),
          size: 1536000,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ],
      questionnaire: [
        {
          id: 'q-001',
          question: 'What is the primary purpose of this valuation?',
          answer: 'Merger and acquisition proceedings',
          isRequired: true,
          isSkipped: false
        },
        {
          id: 'q-002',
          question: 'What is the expected timeline for completion?',
          answer: '30-45 days from commencement',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-02-15'),
      preferredLocations: ['Mumbai', 'Delhi'],
      invitedProfessionals: ['prof-001', 'prof-002'],
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
      documents: [
        {
          id: 'doc-003',
          name: 'CIRP_Notice_Draft.pdf',
          label: 'Draft CIRP Notice',
          url: '/documents/cirp-notice-draft.pdf',
          uploadedAt: new Date('2024-01-12'),
          size: 512000,
          type: 'application/pdf'
        }
      ],
      questionnaire: [
        {
          id: 'q-003',
          question: 'Which newspapers should the publication appear in?',
          answer: 'Economic Times, Business Standard, and regional newspaper',
          isRequired: true,
          isSkipped: false
        },
        {
          id: 'q-004',
          question: 'What is the preferred publication date?',
          answer: 'Within 7 days of approval',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-01-25'),
      preferredLocations: ['Pan India'],
      invitedProfessionals: ['prof-003'],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.IN_PROGRESS,
      createdBy: 'user-002',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-15'),
      deadline: new Date('2024-01-22'),
      isAIAssisted: false
    },
    {
      id: 'sr-003',
      srnNumber: 'SRN2024003',
      title: 'GST Compliance Audit',
      description: 'Comprehensive GST audit for FY 2023-24 including return filing and compliance check',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.GST_COMPLIANCE],
      scopeOfWork: 'Complete GST audit including review of all returns, input tax credit reconciliation, and compliance assessment. Preparation of audit report with recommendations.',
      budgetRange: { min: 25000, max: 40000 },
      budgetNotClear: false,
      documents: [
        {
          id: 'doc-004',
          name: 'GST_Returns_2023.zip',
          label: 'GST Returns for FY 2023-24',
          url: '/documents/gst-returns-2023.zip',
          uploadedAt: new Date('2024-01-18'),
          size: 5120000,
          type: 'application/zip'
        },
        {
          id: 'doc-005',
          name: 'Purchase_Invoices.pdf',
          label: 'Purchase Invoice Register',
          url: '/documents/purchase-invoices.pdf',
          uploadedAt: new Date('2024-01-18'),
          size: 3072000,
          type: 'application/pdf'
        }
      ],
      questionnaire: [
        {
          id: 'q-005',
          question: 'What is the annual turnover of the company?',
          answer: '₹2.5 Crores',
          isRequired: true,
          isSkipped: false
        },
        {
          id: 'q-006',
          question: 'Are there any pending GST notices or assessments?',
          answer: 'No pending notices',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-02-28'),
      preferredLocations: ['Bangalore', 'Chennai'],
      invitedProfessionals: ['prof-004', 'prof-005'],
      repeatPastProfessionals: ['prof-004'],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'user-003',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      deadline: new Date('2024-02-25'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.CHARTERED_ACCOUNTANT],
        services: [ServiceType.GST_COMPLIANCE],
        scopeOfWork: 'AI-suggested comprehensive GST audit scope',
        documents: ['GST Returns', 'Purchase Register', 'Sales Register']
      }
    },
    {
      id: 'sr-004',
      srnNumber: 'SRN2024004',
      title: 'Legal Notice Drafting',
      description: 'Drafting legal notice for breach of contract and recovery of dues',
      serviceCategory: [ProfessionalType.LAWYER],
      serviceTypes: [ServiceType.LEGAL_NOTICE],
      scopeOfWork: 'Draft comprehensive legal notice for breach of contract, include all relevant legal provisions, and provide guidance on next steps.',
      budgetRange: { min: 5000, max: 15000 },
      budgetNotClear: false,
      documents: [
        {
          id: 'doc-006',
          name: 'Contract_Agreement.pdf',
          label: 'Original Contract Agreement',
          url: '/documents/contract-agreement.pdf',
          uploadedAt: new Date('2024-01-20'),
          size: 1024000,
          type: 'application/pdf'
        },
        {
          id: 'doc-007',
          name: 'Email_Communications.pdf',
          label: 'Email Trail with Defaulting Party',
          url: '/documents/email-communications.pdf',
          uploadedAt: new Date('2024-01-20'),
          size: 768000,
          type: 'application/pdf'
        }
      ],
      questionnaire: [
        {
          id: 'q-007',
          question: 'What is the nature of the breach?',
          answer: 'Non-payment of dues amounting to ₹2,50,000',
          isRequired: true,
          isSkipped: false
        },
        {
          id: 'q-008',
          question: 'What is the desired outcome?',
          answer: 'Recovery of dues with interest and costs',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-02-05'),
      preferredLocations: ['Delhi', 'Gurgaon'],
      invitedProfessionals: ['prof-006'],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.COMPLETED,
      createdBy: 'user-004',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-25'),
      deadline: new Date('2024-02-02'),
      isAIAssisted: false
    },
    {
      id: 'sr-005',
      srnNumber: 'SRN2024005',
      title: 'Company Secretary Services',
      description: 'Annual compliance services including board meetings, AGM, and ROC filings',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.ANNUAL_COMPLIANCE],
      scopeOfWork: 'Complete annual compliance including conducting board meetings, AGM, preparation of annual returns, and all necessary ROC filings.',
      budgetRange: { min: 30000, max: 50000 },
      budgetNotClear: false,
      documents: [
        {
          id: 'doc-008',
          name: 'Company_Details.pdf',
          label: 'Company Registration Details',
          url: '/documents/company-details.pdf',
          uploadedAt: new Date('2024-01-22'),
          size: 1536000,
          type: 'application/pdf'
        }
      ],
      questionnaire: [
        {
          id: 'q-009',
          question: 'What is the company type?',
          answer: 'Private Limited Company',
          isRequired: true,
          isSkipped: false
        },
        {
          id: 'q-010',
          question: 'How many directors are there?',
          answer: '3 Directors',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-03-31'),
      preferredLocations: ['Mumbai', 'Pune'],
      invitedProfessionals: ['prof-007', 'prof-008'],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.DRAFT,
      createdBy: 'user-005',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-22'),
      deadline: new Date('2024-03-25'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.COMPANY_SECRETARY],
        services: [ServiceType.ANNUAL_COMPLIANCE],
        scopeOfWork: 'AI-generated compliance checklist based on company type',
        documents: ['MOA', 'AOA', 'Board Resolutions']
      }
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
    },
    {
      id: 'bid-002',
      bidNumber: 'BID2024002',
      serviceRequestId: 'sr-001',
      providerId: 'provider-002',
      providerName: 'Mumbai Valuers & Associates',
      providerProfile: {
        rating: 4.6,
        completedProjects: 89,
        expertise: ['Asset Valuation', 'Business Valuation', 'Merger Support'],
        location: 'Mumbai'
      },
      financials: {
        professionalFee: 85000,
        platformFee: 8500,
        gst: 16830,
        reimbursements: 3000,
        regulatoryPayouts: 2500,
        ope: 2500,
        totalAmount: 118330,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-003',
            label: 'Data Collection & Analysis',
            amount: 42500,
            dueDate: new Date('2024-01-25'),
            description: 'Comprehensive data collection and preliminary analysis'
          },
          {
            id: 'milestone-004',
            label: 'Final Valuation Report',
            amount: 42500,
            dueDate: new Date('2024-02-08'),
            description: 'Complete valuation report with recommendations'
          }
        ]
      },
      deliveryDate: new Date('2024-02-08'),
      additionalInputs: 'Our team has extensive experience in merger valuations. We will provide detailed market analysis and peer comparison.',
      documents: [
        {
          id: 'bid-doc-002',
          name: 'Company_Profile.pdf',
          label: 'Company Profile & Past Work',
          url: '/documents/company-profile.pdf',
          uploadedAt: new Date('2024-01-14'),
          size: 2048000,
          type: 'application/pdf'
        },
        {
          id: 'bid-doc-003',
          name: 'Sample_Merger_Valuation.pdf',
          label: 'Sample Merger Valuation Report',
          url: '/documents/sample-merger-valuation.pdf',
          uploadedAt: new Date('2024-01-14'),
          size: 1536000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.UNDER_REVIEW,
      isInvited: true,
      submittedAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
      lastEditDate: new Date('2024-01-14')
    },
    {
      id: 'bid-003',
      bidNumber: 'BID2024003',
      serviceRequestId: 'sr-002',
      providerId: 'provider-003',
      providerName: 'IBC Publications & Services',
      providerProfile: {
        rating: 4.9,
        completedProjects: 234,
        expertise: ['IBC Publications', 'Legal Notices', 'Regulatory Compliance'],
        location: 'Delhi'
      },
      financials: {
        professionalFee: 18000,
        platformFee: 1800,
        gst: 3564,
        reimbursements: 2000,
        regulatoryPayouts: 500,
        ope: 1000,
        totalAmount: 26864,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2024-01-20'),
      additionalInputs: 'We have published over 500 IBC notices across all major newspapers. Quick turnaround guaranteed.',
      documents: [
        {
          id: 'bid-doc-004',
          name: 'Publication_Portfolio.pdf',
          label: 'Past Publication Portfolio',
          url: '/documents/publication-portfolio.pdf',
          uploadedAt: new Date('2024-01-13'),
          size: 3072000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.ACCEPTED,
      isInvited: false,
      submittedAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-16'),
      lastEditDate: new Date('2024-01-13')
    },
    {
      id: 'bid-004',
      bidNumber: 'BID2024004',
      serviceRequestId: 'sr-003',
      providerId: 'provider-004',
      providerName: 'GST Compliance Solutions',
      providerProfile: {
        rating: 4.7,
        completedProjects: 178,
        expertise: ['GST Compliance', 'Tax Audits', 'Return Filing'],
        location: 'Bangalore'
      },
      financials: {
        professionalFee: 32000,
        platformFee: 3200,
        gst: 6336,
        reimbursements: 2500,
        regulatoryPayouts: 1000,
        ope: 1500,
        totalAmount: 46536,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-005',
            label: 'Initial Review & Assessment',
            amount: 16000,
            dueDate: new Date('2024-02-05'),
            description: 'Review of GST returns and initial assessment'
          },
          {
            id: 'milestone-006',
            label: 'Final Audit Report',
            amount: 16000,
            dueDate: new Date('2024-02-20'),
            description: 'Complete audit report with recommendations'
          }
        ]
      },
      deliveryDate: new Date('2024-02-20'),
      additionalInputs: 'We specialize in GST compliance for mid-size companies. Our team will ensure complete compliance review.',
      documents: [
        {
          id: 'bid-doc-005',
          name: 'GST_Audit_Sample.pdf',
          label: 'Sample GST Audit Report',
          url: '/documents/gst-audit-sample.pdf',
          uploadedAt: new Date('2024-01-19'),
          size: 1024000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.SUBMITTED,
      isInvited: true,
      submittedAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19'),
      lastEditDate: new Date('2024-01-19')
    },
    {
      id: 'bid-005',
      bidNumber: 'BID2024005',
      serviceRequestId: 'sr-003',
      providerId: 'provider-005',
      providerName: 'Chennai Tax Consultants',
      providerProfile: {
        rating: 4.5,
        completedProjects: 145,
        expertise: ['GST Compliance', 'Income Tax', 'Audit Services'],
        location: 'Chennai'
      },
      financials: {
        professionalFee: 28000,
        platformFee: 2800,
        gst: 5544,
        reimbursements: 1500,
        regulatoryPayouts: 800,
        ope: 1200,
        totalAmount: 39844,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2024-02-25'),
      additionalInputs: 'We offer comprehensive GST audit services with detailed compliance assessment and recommendations.',
      documents: [
        {
          id: 'bid-doc-006',
          name: 'Firm_Credentials.pdf',
          label: 'Firm Credentials & Experience',
          url: '/documents/firm-credentials.pdf',
          uploadedAt: new Date('2024-01-19'),
          size: 768000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.SUBMITTED,
      isInvited: true,
      submittedAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19'),
      lastEditDate: new Date('2024-01-19')
    },
    {
      id: 'bid-006',
      bidNumber: 'BID2024006',
      serviceRequestId: 'sr-004',
      providerId: 'provider-006',
      providerName: 'Delhi Legal Associates',
      providerProfile: {
        rating: 4.8,
        completedProjects: 267,
        expertise: ['Legal Notices', 'Contract Law', 'Recovery Matters'],
        location: 'Delhi'
      },
      financials: {
        professionalFee: 8000,
        platformFee: 800,
        gst: 1584,
        reimbursements: 500,
        regulatoryPayouts: 200,
        ope: 400,
        totalAmount: 11484,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2024-01-30'),
      additionalInputs: 'We have extensive experience in drafting legal notices for breach of contract and recovery matters.',
      documents: [
        {
          id: 'bid-doc-007',
          name: 'Legal_Notice_Samples.pdf',
          label: 'Sample Legal Notices',
          url: '/documents/legal-notice-samples.pdf',
          uploadedAt: new Date('2024-01-21'),
          size: 512000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.ACCEPTED,
      isInvited: false,
      submittedAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-01-23'),
      lastEditDate: new Date('2024-01-21')
    },
    {
      id: 'bid-007',
      bidNumber: 'BID2024007',
      serviceRequestId: 'sr-005',
      providerId: 'provider-007',
      providerName: 'Mumbai Corporate Services',
      providerProfile: {
        rating: 4.6,
        completedProjects: 198,
        expertise: ['Company Secretary Services', 'ROC Compliance', 'Board Meetings'],
        location: 'Mumbai'
      },
      financials: {
        professionalFee: 35000,
        platformFee: 3500,
        gst: 6930,
        reimbursements: 2000,
        regulatoryPayouts: 1500,
        ope: 1800,
        totalAmount: 50730,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-007',
            label: 'Board Meetings & Resolutions',
            amount: 17500,
            dueDate: new Date('2024-02-15'),
            description: 'Conduct board meetings and prepare resolutions'
          },
          {
            id: 'milestone-008',
            label: 'AGM & Annual Returns',
            amount: 17500,
            dueDate: new Date('2024-03-15'),
            description: 'Conduct AGM and file annual returns'
          }
        ]
      },
      deliveryDate: new Date('2024-03-20'),
      additionalInputs: 'We provide end-to-end company secretary services with complete ROC compliance support.',
      documents: [
        {
          id: 'bid-doc-008',
          name: 'CS_Services_Portfolio.pdf',
          label: 'Company Secretary Services Portfolio',
          url: '/documents/cs-services-portfolio.pdf',
          uploadedAt: new Date('2024-01-23'),
          size: 1536000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.DRAFT,
      isInvited: true,
      submittedAt: new Date('2024-01-23'),
      updatedAt: new Date('2024-01-23'),
      lastEditDate: new Date('2024-01-23')
    },
    {
      id: 'bid-008',
      bidNumber: 'BID2024008',
      serviceRequestId: 'sr-005',
      providerId: 'provider-008',
      providerName: 'Pune Corporate Consultants',
      providerProfile: {
        rating: 4.4,
        completedProjects: 134,
        expertise: ['Corporate Compliance', 'Annual Filings', 'Secretarial Audits'],
        location: 'Pune'
      },
      financials: {
        professionalFee: 38000,
        platformFee: 3800,
        gst: 7524,
        reimbursements: 1800,
        regulatoryPayouts: 1200,
        ope: 1500,
        totalAmount: 53824,
        paymentStructure: PaymentStructure.MONTHLY_RETAINER
      },
      deliveryDate: new Date('2024-03-25'),
      additionalInputs: 'We offer comprehensive corporate compliance services with monthly retainer model for ongoing support.',
      documents: [
        {
          id: 'bid-doc-009',
          name: 'Corporate_Compliance_Guide.pdf',
          label: 'Corporate Compliance Service Guide',
          url: '/documents/corporate-compliance-guide.pdf',
          uploadedAt: new Date('2024-01-23'),
          size: 2048000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.SUBMITTED,
      isInvited: true,
      submittedAt: new Date('2024-01-23'),
      updatedAt: new Date('2024-01-23'),
      lastEditDate: new Date('2024-01-23')
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

  // Get bids for a specific service request
  async getBidsForServiceRequest(serviceRequestId: string): Promise<Bid[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockBids.filter(bid => bid.serviceRequestId === serviceRequestId);
  }

  // Accept a bid
  async acceptBid(bidId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const bidIndex = this.mockBids.findIndex(bid => bid.id === bidId);
    if (bidIndex !== -1) {
      this.mockBids[bidIndex].status = BidStatus.ACCEPTED;
      this.mockBids[bidIndex].updatedAt = new Date();
      
      // Reject all other bids for the same service request
      const serviceRequestId = this.mockBids[bidIndex].serviceRequestId;
      this.mockBids.forEach((bid, index) => {
        if (bid.serviceRequestId === serviceRequestId && bid.id !== bidId && 
            (bid.status === BidStatus.SUBMITTED || bid.status === BidStatus.UNDER_REVIEW)) {
          this.mockBids[index].status = BidStatus.REJECTED;
          this.mockBids[index].updatedAt = new Date();
        }
      });
    }
  }

  // Reject a bid
  async rejectBid(bidId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const bidIndex = this.mockBids.findIndex(bid => bid.id === bidId);
    if (bidIndex !== -1) {
      this.mockBids[bidIndex].status = BidStatus.REJECTED;
      this.mockBids[bidIndex].updatedAt = new Date();
    }
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

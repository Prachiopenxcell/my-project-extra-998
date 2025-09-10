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

  // Mock data for development - Service Seeker data
  private mockServiceSeekerRequests: ServiceRequest[] = [
    {
      id: 'sr-001',
      srnNumber: 'SRN2024001',
      title: 'Company Valuation for Merger',
      description: 'Need comprehensive valuation of manufacturing company for merger proceedings',
      serviceCategory: [ProfessionalType.VALUER, ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.ANNUAL_RETURN_FILING],
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
      status: ServiceRequestStatus.AWARDED_TO_ANOTHER,
      missedReason: 'awarded_to_another',
      winningBidId: 'bid-003',
      winningBidAmount: 75000,
      awardedDate: new Date('2024-01-20'),
      currentAssignee: {
        id: 'tm-001',
        name: 'Rajesh Kumar',
        role: 'Senior Team Member',
        assignedAt: new Date('2024-01-10')
      },
      clientProfile: {
        organizationName: 'TechCorp Manufacturing Ltd.',
        industry: 'Manufacturing',
        location: 'Mumbai, Maharashtra',
        companySize: '500-1000 employees'
      },
      additionalInformation: 'The valuation is required for a strategic merger with another manufacturing company. Please ensure compliance with SEBI regulations and include market comparables from similar transactions in the manufacturing sector.',
      lastEditedBy: {
        userId: 'user-001',
        userName: 'Service Seeker Admin',
        timestamp: new Date('2024-01-12T10:30:00Z')
      },
      createdBy: '1',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      deadline: new Date('2024-02-10'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.VALUER],
        services: [ServiceType.ANNUAL_RETURN_FILING],
        scopeOfWork: 'AI-generated scope based on merger valuation requirements',
        documents: ['Financial Statements', 'Asset Register', 'Market Analysis']
      }
    },
    {
      id: 'sr-115',
      srnNumber: 'SRN2024115',
      title: 'Regulatory Compliance Review',
      description: 'Complete regulatory compliance review including RBI, SEBI, and other applicable regulations.',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT, ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.COMPLIANCE_MANAGEMENT],
      scopeOfWork: 'Complete regulatory compliance review including RBI, SEBI, and other applicable regulations.',
      budgetRange: { min: 75000, max: 150000 },
      budgetNotClear: false,
      documents: [
        {
          id: 'doc-115-001',
          name: 'Current_Compliance_Framework.pdf',
          label: 'Current Compliance Framework',
          url: '/documents/current-compliance-framework.pdf',
          uploadedAt: new Date('2024-01-15'),
          size: 4200000,
          type: 'application/pdf'
        },
        {
          id: 'doc-115-002',
          name: 'Previous_Audit_Reports.pdf',
          label: 'Previous Audit Reports',
          url: '/documents/previous-audit-reports.pdf',
          uploadedAt: new Date('2024-01-15'),
          size: 3800000,
          type: 'application/pdf'
        },
        {
          id: 'doc-115-003',
          name: 'Regulatory_Correspondence.pdf',
          label: 'Regulatory Correspondence',
          url: '/documents/regulatory-correspondence.pdf',
          uploadedAt: new Date('2024-01-15'),
          size: 2100000,
          type: 'application/pdf'
        },
        {
          id: 'doc-115-004',
          name: 'Internal_Policy_Documents.pdf',
          label: 'Internal Policy Documents',
          url: '/documents/internal-policy-documents.pdf',
          uploadedAt: new Date('2024-01-15'),
          size: 5500000,
          type: 'application/pdf'
        },
        {
          id: 'doc-115-005',
          name: 'Risk_Assessment_Matrix.xlsx',
          label: 'Risk Assessment Matrix',
          url: '/documents/risk-assessment-matrix.xlsx',
          uploadedAt: new Date('2024-01-16'),
          size: 1200000,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        {
          id: 'doc-115-006',
          name: 'Compliance_Calendar.xlsx',
          label: 'Compliance Calendar',
          url: '/documents/compliance-calendar.xlsx',
          uploadedAt: new Date('2024-01-16'),
          size: 800000,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ],
      questionnaire: [
        {
          id: 'q-115-001',
          question: 'What specific regulatory frameworks need to be reviewed?',
          answer: 'RBI guidelines, SEBI regulations, FEMA compliance, and other applicable financial regulations',
          isRequired: true,
          isSkipped: false
        },
        {
          id: 'q-115-002',
          question: 'What is the scope of the compliance review?',
          answer: 'Comprehensive review of current compliance status, gap analysis, and remediation recommendations',
          isRequired: true,
          isSkipped: false
        },
        {
          id: 'q-115-003',
          question: 'Are there any specific compliance concerns or issues?',
          answer: 'Recent regulatory changes and their impact on current operations need assessment',
          isRequired: false,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-03-15'),
      preferredLocations: ['Mumbai', 'Delhi', 'Bangalore'],
      invitedProfessionals: ['prof-001', 'prof-002', 'prof-003'],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      currentAssignee: {
        id: 'tm-115',
        name: 'Priya Sharma',
        role: 'Compliance Manager',
        assignedAt: new Date('2024-01-15')
      },
      clientProfile: {
        organizationName: 'FinServ Solutions Pvt Ltd',
        industry: 'Financial Services',
        location: 'Mumbai, Maharashtra',
        companySize: '200-500 employees'
      },
      additionalInformation: 'Any additional information shared by the client will be displayed here. This may include specific requirements, preferences, or clarifications that are important for understanding the project scope.',
      stageDetails: [
        {
          stage: 'Requirement Gathering',
          stageNumber: 1,
          description: 'Initial consultation and requirement analysis',
          isOptional: false
        },
        {
          stage: 'Case Analysis',
          stageNumber: 2,
          description: 'Detailed case study and research',
          isOptional: false
        },
        {
          stage: 'First Draft',
          stageNumber: 3,
          description: 'Preliminary documentation and review',
          isOptional: false
        },
        {
          stage: 'Final Draft',
          stageNumber: 4,
          description: 'Final deliverable preparation',
          isOptional: false
        }
      ],
      lastEditedBy: {
        userId: 'user-115',
        userName: 'Priya Sharma',
        timestamp: new Date('2024-01-16T14:30:00Z')
      },
      createdBy: '115',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      deadline: new Date('2024-03-15'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.CHARTERED_ACCOUNTANT, ProfessionalType.COMPANY_SECRETARY],
        services: [ServiceType.COMPLIANCE_MANAGEMENT],
        scopeOfWork: 'AI-generated scope based on regulatory compliance requirements',
        documents: ['Compliance Framework', 'Audit Reports', 'Policy Documents', 'Risk Matrix']
      }
    },
    {
      id: 'sr-002',
      srnNumber: 'SRN2024002',
      title: 'IBC Publication Notice',
      description: 'Publication of corporate insolvency resolution process notice in newspapers',
      serviceCategory: [ProfessionalType.INSOLVENCY_PROFESSIONAL],
      serviceTypes: [ServiceType.FILING_OF_CHARGES],
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
      createdBy: '1',
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
      serviceTypes: [ServiceType.FINANCIAL_STATEMENT_FILING],
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
      status: ServiceRequestStatus.WON_BUT_NO_WORK_ORDER,
      missedReason: 'won_but_no_work_order',
      currentAssignee: {
        id: 'tm-003',
        name: 'Amit Patel',
        role: 'Team Lead'
      },
      lastEditedBy: {
        userId: 'user-003',
        userName: 'Entity Admin',
        timestamp: new Date('2024-01-18T16:45:00Z')
      },
      createdBy: '1',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      deadline: new Date('2024-02-25'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.CHARTERED_ACCOUNTANT],
        services: [ServiceType.FINANCIAL_STATEMENT_FILING],
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
      serviceTypes: [ServiceType.COMPOUNDING_OF_OFFENCES],
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
      createdBy: '1',
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
      serviceTypes: [ServiceType.STATUTORY_REGISTERS_MAINTENANCE],
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
      createdBy: '1',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-22'),
      deadline: new Date('2024-03-25'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.COMPANY_SECRETARY],
        services: [ServiceType.STATUTORY_REGISTERS_MAINTENANCE],
        scopeOfWork: 'AI-generated compliance checklist based on company type',
        documents: ['MOA', 'AOA', 'Board Resolutions']
      }
    },
    // Additional Open Service Requests for seeker-001
    {
      id: 'sr-006',
      srnNumber: 'SRN2024006',
      title: 'Annual Tax Filing and GST Compliance',
      description: 'Complete annual tax filing and GST compliance for FY 2023-24',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.ANNUAL_RETURN_FILING, ServiceType.FINANCIAL_STATEMENT_FILING],
      scopeOfWork: 'Prepare and file annual tax returns, GST returns, and ensure complete tax compliance.',
      budgetRange: { min: 25000, max: 40000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [
        {
          id: 'q-013',
          question: 'What is your annual turnover?',
          answer: 'Rs. 2.5 Crores',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-03-31'),
      preferredLocations: ['Mumbai', 'Pune'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: '1',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      deadline: new Date('2024-03-25'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.CHARTERED_ACCOUNTANT],
        services: [ServiceType.ANNUAL_RETURN_FILING],
        scopeOfWork: 'Annual tax compliance and GST filing',
        documents: ['Financial Statements', 'GST Records']
      }
    },
    {
      id: 'sr-007',
      srnNumber: 'SRN2024007',
      title: 'Legal Notice for Contract Breach',
      description: 'Draft and send legal notice for breach of contract by vendor',
      serviceCategory: [ProfessionalType.LAWYER],
      serviceTypes: [ServiceType.FILING_OF_CHARGES],
      scopeOfWork: 'Draft legal notice for contract breach and handle legal proceedings if required.',
      budgetRange: { min: 10000, max: 20000 },
      budgetNotClear: false,
      documents: [
        {
          id: 'doc-009',
          name: 'Contract_Agreement.pdf',
          label: 'Original Contract',
          url: '/documents/contract-agreement.pdf',
          uploadedAt: new Date('2024-01-22'),
          size: 1024000,
          type: 'application/pdf'
        }
      ],
      questionnaire: [
        {
          id: 'q-014',
          question: 'What is the nature of the breach?',
          answer: 'Non-delivery of goods as per agreed timeline',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-02-15'),
      preferredLocations: ['Delhi', 'Gurgaon'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: '1',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-22'),
      deadline: new Date('2024-02-10'),
      isAIAssisted: false
    },
    // Additional Closed Service Requests for seeker-001
    {
      id: 'sr-008',
      srnNumber: 'SRN2024008',
      title: 'Company Registration and Incorporation',
      description: 'Complete incorporation of private limited company with all compliance',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY, ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.INCORPORATION_PRIVATE_LIMITED, ServiceType.DIN_OBTAINING],
      scopeOfWork: 'Complete company incorporation including name reservation, DIN obtaining, and initial compliance.',
      budgetRange: { min: 15000, max: 25000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [
        {
          id: 'q-015',
          question: 'What is the proposed company name?',
          answer: 'TechVenture Solutions Private Limited',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2023-12-15'),
      preferredLocations: ['Bangalore', 'Chennai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.COMPLETED,
      createdBy: '1',
      createdAt: new Date('2023-11-10'),
      updatedAt: new Date('2023-12-20'),
      deadline: new Date('2023-12-10'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.COMPANY_SECRETARY],
        services: [ServiceType.INCORPORATION_PRIVATE_LIMITED],
        scopeOfWork: 'Complete company incorporation process',
        documents: ['Identity Proof', 'Address Proof', 'MOA/AOA']
      }
    },
    {
      id: 'sr-009',
      srnNumber: 'SRN2024009',
      title: 'Trademark Registration',
      description: 'Register trademark for brand name and logo',
      serviceCategory: [ProfessionalType.LAWYER],
      serviceTypes: [ServiceType.FILING_OF_CHARGES],
      scopeOfWork: 'Complete trademark search, application filing, and registration process.',
      budgetRange: { min: 8000, max: 15000 },
      budgetNotClear: false,
      documents: [
        {
          id: 'doc-010',
          name: 'Brand_Logo.png',
          label: 'Brand Logo',
          url: '/documents/brand-logo.png',
          uploadedAt: new Date('2023-10-15'),
          size: 256000,
          type: 'image/png'
        }
      ],
      questionnaire: [
        {
          id: 'q-016',
          question: 'In which class do you want to register the trademark?',
          answer: 'Class 35 - Business services',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2023-11-30'),
      preferredLocations: ['Mumbai', 'Delhi'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.CLOSED,
      createdBy: '1',
      createdAt: new Date('2023-10-10'),
      updatedAt: new Date('2023-12-05'),
      deadline: new Date('2023-11-25'),
      isAIAssisted: false
    },
    // Additional Draft Service Requests for seeker-001
    {
      id: 'sr-010',
      srnNumber: 'SRN2024010',
      title: 'Audit and Assurance Services',
      description: 'Internal audit and financial assurance for compliance',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.STATUTORY_REGISTERS_MAINTENANCE],
      scopeOfWork: 'Conduct internal audit and provide assurance on financial controls and compliance.',
      budgetRange: { min: 40000, max: 60000 },
      budgetNotClear: true,
      documents: [],
      questionnaire: [
        {
          id: 'q-017',
          question: 'What is the scope of audit required?',
          answer: 'Financial and operational audit',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-03-15'),
      preferredLocations: ['Mumbai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.DRAFT,
      createdBy: '1',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      deadline: new Date('2024-03-10'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.CHARTERED_ACCOUNTANT],
        services: [ServiceType.STATUTORY_REGISTERS_MAINTENANCE],
        scopeOfWork: 'Comprehensive audit and compliance review',
        documents: ['Financial Statements', 'Internal Controls Documentation']
      }
    },
    {
      id: 'sr-011',
      srnNumber: 'SRN2024011',
      title: 'MSME Registration and Compliance',
      description: 'Register for MSME and ensure ongoing compliance',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.MSME_RETURN_FILING],
      scopeOfWork: 'Complete MSME registration process and setup compliance framework.',
      budgetRange: { min: 5000, max: 12000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [
        {
          id: 'q-018',
          question: 'What is your business category?',
          answer: 'Manufacturing',
          isRequired: true,
          isSkipped: false
        }
      ],
      workRequiredBy: new Date('2024-02-28'),
      preferredLocations: ['Delhi', 'Noida'],
      invitedProfessionals: [],
      status: ServiceRequestStatus.DRAFT,
      createdBy: '1',
      createdAt: new Date('2024-01-26'),
      updatedAt: new Date('2024-01-26'),
      deadline: new Date('2024-02-15'),
      isAIAssisted: false
    },
    {
      id: 'sr-007',
      srnNumber: 'SRN2024007',
      title: 'Internal Financial Controls Review',
      description: 'Review and certify internal financial controls for FY 2023-24',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.FINANCIAL_STATEMENT_FILING],
      scopeOfWork: 'Perform IFC review and provide report with recommendations.',
      budgetRange: { min: 50000, max: 90000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-01-15'),
      preferredLocations: ['Mumbai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.CLOSED,
      createdBy: 'other-seeker-004',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-20'),
      deadline: new Date('2024-01-12'),
      isAIAssisted: false
    },
    {
      id: 'sr-105',
      srnNumber: 'SRN2024105',
      title: 'Share Transfer Compliance',
      description: 'Assist with share transfer compliance and ROC filings',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.SHARE_ISSUE_ALLOTMENT_TRANSFER],
      scopeOfWork: 'Verify documents, draft resolutions, and file necessary forms.',
      budgetRange: { min: 20000, max: 40000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-02-10'),
      preferredLocations: ['Delhi'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.AWARDED_TO_ANOTHER,
      missedReason: 'awarded_to_another',
      winningBidId: 'bid-105',
      winningBidAmount: 35000,
      awardedDate: new Date('2024-02-03'),
      createdBy: 'other-seeker-005',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-02-05'),
      deadline: new Date('2024-02-08'),
      isAIAssisted: false
    },
    {
      id: 'sr-106',
      srnNumber: 'SRN2024106',
      title: 'LLP Incorporation Assistance',
      description: 'Complete LLP incorporation including name reservation and filings',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.INCORPORATION_LLP],
      scopeOfWork: 'End-to-end LLP incorporation support.',
      budgetRange: { min: 12000, max: 20000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-01-25'),
      preferredLocations: ['Bangalore'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.SUBMISSION_TIME_PASSED,
      missedReason: 'submission_time_passed',
      createdBy: 'other-seeker-006',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-26'),
      deadline: new Date('2024-01-24'),
      isAIAssisted: false
    }
  ];

  // Mock data for Service Providers - Opportunities they can bid on
  private mockServiceProviderOpportunities: ServiceRequest[] = [
    {
      id: 'sr-101',
      srnNumber: 'SRN2024101',
      title: 'IT Infrastructure Audit',
      description: 'Comprehensive IT infrastructure audit for compliance and security assessment',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.AUDITOR_APPOINTMENT_RESIGNATION],
      scopeOfWork: 'Complete IT infrastructure audit including network security, data protection, and compliance assessment.',
      budgetRange: { min: 80000, max: 120000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-03-15'),
      preferredLocations: ['Bangalore', 'Hyderabad'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'other-seeker-001',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      deadline: new Date('2024-03-10'),
      isAIAssisted: false
    },
    // Missed Opportunity - Awarded to Another
    {
      id: 'sr-201',
      srnNumber: 'SRN2024201',
      title: 'Corporate Valuation for Merger',
      description: 'Professional valuation services for merger and acquisition',
      serviceCategory: [ProfessionalType.VALUER, ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.ANNUAL_RETURN_FILING],
      scopeOfWork: 'Complete corporate valuation including asset assessment and market analysis.',
      budgetRange: { min: 75000, max: 125000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-01-20'),
      preferredLocations: ['Mumbai', 'Delhi'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.AWARDED_TO_ANOTHER,
      missedReason: 'awarded_to_another',
      winningBidId: 'bid-201',
      winningBidAmount: 95000,
      awardedDate: new Date('2024-01-15'),
      createdBy: 'seeker-201',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-16'),
      deadline: new Date('2024-01-12'),
      isAIAssisted: false
    },
    // Missed Opportunity - Submission Time Passed
    {
      id: 'sr-202',
      srnNumber: 'SRN2024202',
      title: 'GST Registration and Compliance',
      description: 'GST registration and ongoing compliance support',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.RETURN_OF_DEPOSITS_FILING],
      scopeOfWork: 'GST registration, return filing, and compliance management.',
      budgetRange: { min: 25000, max: 40000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-01-10'),
      preferredLocations: ['Bangalore', 'Chennai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.SUBMISSION_TIME_PASSED,
      missedReason: 'submission_time_passed',
      createdBy: 'seeker-202',
      createdAt: new Date('2023-12-28'),
      updatedAt: new Date('2024-01-11'),
      deadline: new Date('2024-01-08'),
      isAIAssisted: false
    },
    // Missed Opportunity - Won but No Work Order
    {
      id: 'sr-203',
      srnNumber: 'SRN2024203',
      title: 'Legal Documentation Review',
      description: 'Review and verification of legal documents for compliance',
      serviceCategory: [ProfessionalType.LAWYER],
      serviceTypes: [ServiceType.FILING_OF_CHARGES],
      scopeOfWork: 'Comprehensive legal document review and compliance verification.',
      budgetRange: { min: 50000, max: 80000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-01-25'),
      preferredLocations: ['Delhi', 'Gurgaon'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.WON_BUT_NO_WORK_ORDER,
      missedReason: 'won_but_no_work_order',
      winningBidId: 'bid-203',
      winningBidAmount: 65000,
      awardedDate: new Date('2024-01-18'),
      createdBy: 'seeker-203',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-26'),
      deadline: new Date('2024-01-15'),
      isAIAssisted: false
    },
    // Missed Opportunity - Not Interested
    {
      id: 'sr-204',
      srnNumber: 'SRN2024205',
      title: 'Company Secretary Services',
      description: 'Ongoing company secretary services for compliance and board meetings',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.ANNUAL_RETURN_FILING],
      scopeOfWork: 'Complete company secretary services including board meeting management, compliance filing, and statutory requirements.',
      budgetRange: { min: 30000, max: 50000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-02-15'),
      preferredLocations: ['Delhi', 'Mumbai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.NOT_INTERESTED,
      missedReason: 'marked_not_interested',
      createdBy: 'seeker-204',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      deadline: new Date('2024-02-01'),
      isAIAssisted: false
    },
    {
      id: 'sr-102',
      srnNumber: 'SRN2024102',
      title: 'Tax Return Filing Services',
      description: 'Individual and corporate tax return filing for FY 2023-24',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.RETURN_OF_DEPOSITS_FILING],
      scopeOfWork: 'Complete tax return filing services including computation, documentation, and e-filing.',
      budgetRange: { min: 15000, max: 25000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-03-31'),
      preferredLocations: ['Mumbai', 'Pune'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'other-seeker-002',
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date('2024-01-28'),
      deadline: new Date('2024-03-25'),
      isAIAssisted: true,
      aiSuggestions: {
        professionals: [ProfessionalType.CHARTERED_ACCOUNTANT],
        services: [ServiceType.RETURN_OF_DEPOSITS_FILING],
        scopeOfWork: 'AI-suggested tax filing scope',
        documents: ['Income Statements', 'Investment Proofs']
      }
    },
    // Open Opportunities - More entries for pagination
    {
      id: 'sr-103',
      srnNumber: 'SRN2024103',
      title: 'Annual Financial Audit',
      description: 'Comprehensive annual financial audit for manufacturing company',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.AUDITOR_APPOINTMENT_RESIGNATION],
      scopeOfWork: 'Complete annual financial audit including internal controls assessment.',
      budgetRange: { min: 100000, max: 150000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-04-15'),
      preferredLocations: ['Delhi', 'Gurgaon'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-103',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      deadline: new Date('2024-04-10'),
      isAIAssisted: false
    },
    {
      id: 'sr-104',
      srnNumber: 'SRN2024104',
      title: 'ROC Compliance Filing',
      description: 'Annual ROC compliance filing and form submissions',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.ANNUAL_RETURN_FILING],
      scopeOfWork: 'Complete ROC compliance including annual return, board resolutions, and statutory filings.',
      budgetRange: { min: 35000, max: 55000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-03-30'),
      preferredLocations: ['Mumbai', 'Thane'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-104',
      createdAt: new Date('2024-02-02'),
      updatedAt: new Date('2024-02-02'),
      deadline: new Date('2024-03-25'),
      isAIAssisted: true
    },
    {
      id: 'sr-105',
      srnNumber: 'SRN2024105',
      title: 'Property Valuation Services',
      description: 'Commercial property valuation for loan purposes',
      serviceCategory: [ProfessionalType.VALUER],
      serviceTypes: [ServiceType.INCORPORATION_LLP],
      scopeOfWork: 'Professional property valuation including market analysis and documentation.',
      budgetRange: { min: 45000, max: 70000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-03-20'),
      preferredLocations: ['Bangalore', 'Mysore'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-105',
      createdAt: new Date('2024-02-03'),
      updatedAt: new Date('2024-02-03'),
      deadline: new Date('2024-03-15'),
      isAIAssisted: false
    },
    {
      id: 'sr-106',
      srnNumber: 'SRN2024106',
      title: 'Legal Contract Review',
      description: 'Review and drafting of commercial contracts',
      serviceCategory: [ProfessionalType.LAWYER],
      serviceTypes: [ServiceType.FILING_OF_CHARGES],
      scopeOfWork: 'Contract review, legal opinion, and risk assessment for commercial agreements.',
      budgetRange: { min: 60000, max: 85000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-04-05'),
      preferredLocations: ['Chennai', 'Coimbatore'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-106',
      createdAt: new Date('2024-02-04'),
      updatedAt: new Date('2024-02-04'),
      deadline: new Date('2024-03-30'),
      isAIAssisted: false
    },
    {
      id: 'sr-107',
      srnNumber: 'SRN2024107',
      title: 'GST Advisory Services',
      description: 'GST compliance and advisory for e-commerce business',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.RETURN_OF_DEPOSITS_FILING],
      scopeOfWork: 'GST compliance review, advisory services, and return filing support.',
      budgetRange: { min: 40000, max: 60000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-03-25'),
      preferredLocations: ['Hyderabad', 'Secunderabad'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-107',
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05'),
      deadline: new Date('2024-03-20'),
      isAIAssisted: true
    },
    {
      id: 'sr-108',
      srnNumber: 'SRN2024108',
      title: 'Corporate Restructuring',
      description: 'Legal and financial advisory for corporate restructuring',
      serviceCategory: [ProfessionalType.LAWYER, ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.INCORPORATION_LLP],
      scopeOfWork: 'Complete corporate restructuring including legal documentation and financial planning.',
      budgetRange: { min: 200000, max: 300000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-05-15'),
      preferredLocations: ['Mumbai', 'Delhi'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-108',
      createdAt: new Date('2024-02-06'),
      updatedAt: new Date('2024-02-06'),
      deadline: new Date('2024-05-10'),
      isAIAssisted: false
    },
    {
      id: 'sr-109',
      srnNumber: 'SRN2024109',
      title: 'Trademark Registration',
      description: 'Trademark search, application, and registration services',
      serviceCategory: [ProfessionalType.LAWYER],
      serviceTypes: [ServiceType.FILING_OF_CHARGES],
      scopeOfWork: 'Complete trademark registration including search, application filing, and prosecution.',
      budgetRange: { min: 25000, max: 40000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-04-30'),
      preferredLocations: ['Pune', 'Mumbai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-109',
      createdAt: new Date('2024-02-07'),
      updatedAt: new Date('2024-02-07'),
      deadline: new Date('2024-04-25'),
      isAIAssisted: false
    },
    {
      id: 'sr-110',
      srnNumber: 'SRN2024110',
      title: 'Internal Audit Services',
      description: 'Quarterly internal audit for risk management',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.AUDITOR_APPOINTMENT_RESIGNATION],
      scopeOfWork: 'Comprehensive internal audit including process review and risk assessment.',
      budgetRange: { min: 75000, max: 100000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-04-20'),
      preferredLocations: ['Bangalore', 'Chennai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-110',
      createdAt: new Date('2024-02-08'),
      updatedAt: new Date('2024-02-08'),
      deadline: new Date('2024-04-15'),
      isAIAssisted: true
    },
    {
      id: 'sr-111',
      srnNumber: 'SRN2024111',
      title: 'Secretarial Audit',
      description: 'Annual secretarial audit for listed company',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.ANNUAL_RETURN_FILING],
      scopeOfWork: 'Complete secretarial audit including compliance verification and reporting.',
      budgetRange: { min: 50000, max: 75000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-04-10'),
      preferredLocations: ['Delhi', 'Noida'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-111',
      createdAt: new Date('2024-02-09'),
      updatedAt: new Date('2024-02-09'),
      deadline: new Date('2024-04-05'),
      isAIAssisted: false
    },
    {
      id: 'sr-112',
      srnNumber: 'SRN2024112',
      title: 'Business Valuation',
      description: 'Business valuation for investment and acquisition',
      serviceCategory: [ProfessionalType.VALUER, ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.INCORPORATION_LLP],
      scopeOfWork: 'Complete business valuation including financial analysis and market assessment.',
      budgetRange: { min: 120000, max: 180000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-05-05'),
      preferredLocations: ['Mumbai', 'Pune'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-112',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
      deadline: new Date('2024-04-30'),
      isAIAssisted: false
    },
    {
      id: 'sr-113',
      srnNumber: 'SRN2024113',
      title: 'Employment Law Advisory',
      description: 'Employment law compliance and policy review',
      serviceCategory: [ProfessionalType.LAWYER],
      serviceTypes: [ServiceType.FILING_OF_CHARGES],
      scopeOfWork: 'Employment law advisory including policy review and compliance assessment.',
      budgetRange: { min: 55000, max: 80000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-04-25'),
      preferredLocations: ['Hyderabad', 'Bangalore'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-113',
      createdAt: new Date('2024-02-11'),
      updatedAt: new Date('2024-02-11'),
      deadline: new Date('2024-04-20'),
      isAIAssisted: true
    },
    {
      id: 'sr-114',
      srnNumber: 'SRN2024114',
      title: 'Tax Planning Advisory',
      description: 'Comprehensive tax planning for high net worth individual',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.RETURN_OF_DEPOSITS_FILING],
      scopeOfWork: 'Tax planning advisory including investment structuring and compliance optimization.',
      budgetRange: { min: 80000, max: 120000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-03-31'),
      preferredLocations: ['Chennai', 'Bangalore'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-114',
      createdAt: new Date('2024-02-12'),
      updatedAt: new Date('2024-02-12'),
      deadline: new Date('2024-03-25'),
      isAIAssisted: false
    },
    {
      id: 'sr-115',
      srnNumber: 'SRN2024115',
      title: 'Regulatory Compliance Review',
      description: 'Comprehensive regulatory compliance review for fintech company',
      serviceCategory: [ProfessionalType.LAWYER, ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.ANNUAL_RETURN_FILING],
      scopeOfWork: 'Complete regulatory compliance review including RBI, SEBI, and other applicable regulations.',
      budgetRange: { min: 150000, max: 200000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-05-20'),
      preferredLocations: ['Mumbai', 'Delhi'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.OPEN,
      createdBy: 'seeker-115',
      createdAt: new Date('2024-02-13'),
      updatedAt: new Date('2024-02-13'),
      deadline: new Date('2024-05-15'),
      isAIAssisted: true
    },
    // Additional Missed Opportunities
    {
      id: 'sr-206',
      srnNumber: 'SRN2024206',
      title: 'Annual Audit Services',
      description: 'Statutory audit services for FY 2023-24',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.AUDITOR_APPOINTMENT_RESIGNATION],
      scopeOfWork: 'Complete statutory audit including financial statement review.',
      budgetRange: { min: 60000, max: 90000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-02-28'),
      preferredLocations: ['Mumbai', 'Pune'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.AWARDED_TO_ANOTHER,
      missedReason: 'awarded_to_another',
      winningBidId: 'bid-206',
      winningBidAmount: 72000,
      awardedDate: new Date('2024-02-10'),
      createdBy: 'seeker-206',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-02-11'),
      deadline: new Date('2024-02-08'),
      isAIAssisted: false
    },
    {
      id: 'sr-207',
      srnNumber: 'SRN2024207',
      title: 'Export Documentation Services',
      description: 'Export-import documentation and compliance',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.INCORPORATION_LLP],
      scopeOfWork: 'Complete export documentation including customs clearance and compliance.',
      budgetRange: { min: 35000, max: 50000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-01-25'),
      preferredLocations: ['Chennai', 'Bangalore'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.SUBMISSION_TIME_PASSED,
      missedReason: 'submission_time_passed',
      createdBy: 'seeker-207',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-26'),
      deadline: new Date('2024-01-20'),
      isAIAssisted: false
    },
    {
      id: 'sr-208',
      srnNumber: 'SRN2024208',
      title: 'Investment Advisory Services',
      description: 'Investment advisory and portfolio management',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.RETURN_OF_DEPOSITS_FILING],
      scopeOfWork: 'Investment advisory including portfolio analysis and risk assessment.',
      budgetRange: { min: 90000, max: 130000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-02-15'),
      preferredLocations: ['Delhi', 'Mumbai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.WON_BUT_NO_WORK_ORDER,
      missedReason: 'won_but_no_work_order',
      winningBidId: 'bid-208',
      winningBidAmount: 105000,
      awardedDate: new Date('2024-02-05'),
      createdBy: 'seeker-208',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-16'),
      deadline: new Date('2024-02-01'),
      isAIAssisted: false
    },
    {
      id: 'sr-209',
      srnNumber: 'SRN2024209',
      title: 'Due Diligence Services',
      description: 'Legal and financial due diligence for acquisition',
      serviceCategory: [ProfessionalType.LAWYER, ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.FILING_OF_CHARGES],
      scopeOfWork: 'Complete due diligence including legal, financial, and operational review.',
      budgetRange: { min: 180000, max: 250000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-02-20'),
      preferredLocations: ['Mumbai', 'Bangalore'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.NOT_INTERESTED,
      missedReason: 'marked_not_interested',
      createdBy: 'seeker-209',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-27'),
      deadline: new Date('2024-02-15'),
      isAIAssisted: false
    },
    {
      id: 'sr-210',
      srnNumber: 'SRN2024210',
      title: 'Intellectual Property Services',
      description: 'Patent filing and IP portfolio management',
      serviceCategory: [ProfessionalType.LAWYER],
      serviceTypes: [ServiceType.FILING_OF_CHARGES],
      scopeOfWork: 'IP services including patent search, filing, and portfolio management.',
      budgetRange: { min: 70000, max: 100000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-01-30'),
      preferredLocations: ['Hyderabad', 'Pune'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.AWARDED_TO_ANOTHER,
      missedReason: 'awarded_to_another',
      winningBidId: 'bid-210',
      winningBidAmount: 85000,
      awardedDate: new Date('2024-01-25'),
      createdBy: 'seeker-210',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-26'),
      deadline: new Date('2024-01-25'),
      isAIAssisted: false
    },
    // Missed Opportunity - Submission Time Passed (Recent)
    {
      id: 'sr-205',
      srnNumber: 'SRN2024205',
      title: 'Company Secretary Services',
      description: 'Ongoing company secretary services and compliance',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.INCORPORATION_LLP],
      scopeOfWork: 'Monthly compliance management and secretarial services.',
      budgetRange: { min: 30000, max: 50000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-02-15'),
      preferredLocations: ['Delhi', 'Noida'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.SUBMISSION_TIME_PASSED,
      missedReason: 'submission_time_passed',
      createdBy: 'seeker-205',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-02-16'),
      deadline: new Date('2024-02-12'),
      isAIAssisted: false
    },
    {
      id: 'sr-103',
      srnNumber: 'SRN2024103',
      title: 'Contract Review and Legal Opinion',
      description: 'Legal review of partnership agreement and provide legal opinion',
      serviceCategory: [ProfessionalType.LAWYER],
      serviceTypes: [ServiceType.RESOLUTIONS_FILING_ROC],
      scopeOfWork: 'Review partnership agreement, identify risks, and provide comprehensive legal opinion.',
      budgetRange: { min: 20000, max: 35000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-02-20'),
      preferredLocations: ['Chennai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.BID_RECEIVED,
      createdBy: 'other-seeker-003',
      createdAt: new Date('2024-01-30'),
      updatedAt: new Date('2024-02-01'),
      deadline: new Date('2024-02-18'),
      isAIAssisted: false
    },
    {
      id: 'sr-104',
      srnNumber: 'SRN2024104',
      title: 'Internal Financial Controls Review',
      description: 'Review and certify internal financial controls for FY 2023-24',
      serviceCategory: [ProfessionalType.CHARTERED_ACCOUNTANT],
      serviceTypes: [ServiceType.FINANCIAL_STATEMENT_FILING],
      scopeOfWork: 'Perform IFC review and provide report with recommendations.',
      budgetRange: { min: 50000, max: 90000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-01-15'),
      preferredLocations: ['Mumbai'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.CLOSED,
      createdBy: 'other-seeker-104',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-20'),
      deadline: new Date('2024-01-12'),
      isAIAssisted: false
    },
    {
      id: 'sr-105',
      srnNumber: 'SRN2024105',
      title: 'Share Transfer Compliance',
      description: 'Assist with share transfer compliance and ROC filings',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.SHARE_ISSUE_ALLOTMENT_TRANSFER],
      scopeOfWork: 'Verify documents, draft resolutions, and file necessary forms.',
      budgetRange: { min: 20000, max: 40000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-02-10'),
      preferredLocations: ['Delhi'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.CANCELLED,
      createdBy: 'other-seeker-105',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-02-05'),
      deadline: new Date('2024-02-08'),
      isAIAssisted: false
    },
    {
      id: 'sr-106',
      srnNumber: 'SRN2024106',
      title: 'LLP Incorporation Assistance',
      description: 'Complete LLP incorporation including name reservation and filings',
      serviceCategory: [ProfessionalType.COMPANY_SECRETARY],
      serviceTypes: [ServiceType.INCORPORATION_LLP],
      scopeOfWork: 'End-to-end LLP incorporation support.',
      budgetRange: { min: 12000, max: 20000 },
      budgetNotClear: false,
      documents: [],
      questionnaire: [],
      workRequiredBy: new Date('2024-01-25'),
      preferredLocations: ['Bangalore'],
      invitedProfessionals: [],
      repeatPastProfessionals: [],
      status: ServiceRequestStatus.EXPIRED,
      createdBy: 'other-seeker-106',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-26'),
      deadline: new Date('2024-01-20'),
      isAIAssisted: false
    }
  ];

  // In-memory store for queries/clarifications (mock)
  private mockQueries: QueryClarification[] = [
    // Queries for bid-013 (under negotiation)
    {
      id: 'query-bid-013-001',
      serviceRequestId: 'sr-002',
      bidId: 'bid-013',
      senderId: 'seeker-001',
      senderType: 'seeker',
      message: 'Can you provide more details about your team composition for this IBC case? We want to ensure adequate expertise is allocated.',
      isPublic: false,
      recipients: ['provider-013'],
      timestamp: new Date('2024-01-21T08:30:00'),
      responses: [
        {
          id: 'query-response-001',
          serviceRequestId: 'sr-002',
          bidId: 'bid-013',
          senderId: 'provider-013',
          senderType: 'provider',
          message: 'Our team includes: 1) Senior Partner (15+ years IBC experience), 2) Associate Partner (8 years experience), 3) Junior Associate (3 years), and 4) Paralegal for documentation. All have handled similar manufacturing sector cases.',
          isPublic: false,
          timestamp: new Date('2024-01-21T11:45:00'),
          responses: []
        }
      ]
    },
    {
      id: 'query-bid-013-002',
      serviceRequestId: 'sr-002',
      bidId: 'bid-013',
      senderId: 'provider-013',
      senderType: 'provider',
      message: 'We noticed the company has multiple manufacturing units. Do you need separate publication notices for each unit or a consolidated notice? This might affect the regulatory costs.',
      isPublic: false,
      recipients: ['seeker-001'],
      timestamp: new Date('2024-01-22T14:20:00'),
      responses: [
        {
          id: 'query-response-002',
          serviceRequestId: 'sr-002',
          bidId: 'bid-013',
          senderId: 'seeker-001',
          senderType: 'seeker',
          message: 'Good point. We need consolidated notice for the parent company only. The subsidiaries will be mentioned within the main notice. This should reduce publication costs.',
          isPublic: false,
          timestamp: new Date('2024-01-22T16:10:00'),
          responses: []
        }
      ]
    },
    // Queries for bid-014 (under negotiation)
    {
      id: 'query-bid-014-001',
      serviceRequestId: 'sr-002',
      bidId: 'bid-014',
      senderId: 'seeker-001',
      senderType: 'seeker',
      message: 'Your bid mentions NCLT hearing representation. Can you clarify what this includes? We want to understand the scope of representation.',
      isPublic: false,
      recipients: ['provider-014'],
      timestamp: new Date('2024-01-22T10:15:00'),
      responses: [
        {
          id: 'query-response-003',
          serviceRequestId: 'sr-002',
          bidId: 'bid-014',
          senderId: 'provider-014',
          senderType: 'provider',
          message: 'NCLT representation includes: 1) Attending admission hearings, 2) Filing necessary applications, 3) Representing during procedural hearings, 4) Coordination with Resolution Professional. Does not include contested matters or appeals.',
          isPublic: false,
          timestamp: new Date('2024-01-22T13:30:00'),
          responses: []
        }
      ]
    },
    {
      id: 'query-bid-014-002',
      serviceRequestId: 'sr-002',
      bidId: 'bid-014',
      senderId: 'provider-014',
      senderType: 'provider',
      message: 'We can expedite the timeline, but need to know: Are there any pending legal proceedings that might complicate the IBC filing? This will help us plan better.',
      isPublic: false,
      recipients: ['seeker-001'],
      timestamp: new Date('2024-01-23T09:45:00'),
      responses: [
        {
          id: 'query-response-004',
          serviceRequestId: 'sr-002',
          bidId: 'bid-014',
          senderId: 'seeker-001',
          senderType: 'seeker',
          message: 'There are 2 pending civil suits and 1 labor dispute. All are at preliminary stages. We have detailed case files ready to share once you are selected.',
          isPublic: false,
          timestamp: new Date('2024-01-23T11:20:00'),
          responses: []
        }
      ]
    },
    // Queries for SR sr-001, Bid bid-001
    {
      id: 'query-1001',
      serviceRequestId: 'sr-001',
      bidId: 'bid-001',
      senderId: 'seeker-001',
      senderType: 'seeker',
      message: 'Could you please provide a breakdown of the ₹5,000 reimbursements and what they cover?',
      isPublic: true,
      recipients: ['provider-001'],
      timestamp: new Date('2024-01-14T09:30:00Z'),
      responses: [
        {
          id: 'reply-1001-1',
          serviceRequestId: 'sr-001',
          bidId: 'bid-001',
          senderId: 'provider-001',
          senderType: 'provider',
          message: 'Reimbursements include travel within city (₹2,000), printing/scanning (₹1,000), and site logistics (₹2,000).',
          isPublic: true,
          timestamp: new Date('2024-01-14T11:00:00Z'),
          responses: [
            {
              id: 'reply-1001-2',
              serviceRequestId: 'sr-001',
              bidId: 'bid-001',
              senderId: 'seeker-001',
              senderType: 'seeker',
              message: 'Thanks. Can we cap reimbursements at ₹4,000 unless pre-approved?',
              isPublic: true,
              timestamp: new Date('2024-01-14T12:10:00Z'),
              responses: []
            }
          ]
        }
      ]
    },
    {
      id: 'query-1002',
      serviceRequestId: 'sr-001',
      bidId: 'bid-001',
      senderId: 'seeker-001',
      senderType: 'seeker',
      message: 'For Milestone 1 (Initial Assessment), what specific deliverables will you share?',
      isPublic: false,
      recipients: ['provider-001'],
      timestamp: new Date('2024-01-14T10:15:00Z'),
      responses: [
        {
          id: 'reply-1002-1',
          serviceRequestId: 'sr-001',
          bidId: 'bid-001',
          senderId: 'provider-001',
          senderType: 'provider',
          message: 'A preliminary findings memo, data request list, and valuation approach note.',
          isPublic: false,
          timestamp: new Date('2024-01-14T11:20:00Z'),
          responses: []
        }
      ]
    },

    // Queries for SR sr-001, Bid bid-002
    {
      id: 'query-2001',
      serviceRequestId: 'sr-001',
      bidId: 'bid-002',
      senderId: 'seeker-001',
      senderType: 'seeker',
      message: 'Your delivery date is 08 Feb. Is there any buffer for management review before final report?',
      isPublic: true,
      recipients: ['provider-002'],
      timestamp: new Date('2024-01-15T08:45:00Z'),
      responses: [
        {
          id: 'reply-2001-1',
          serviceRequestId: 'sr-001',
          bidId: 'bid-002',
          senderId: 'provider-002',
          senderType: 'provider',
          message: 'Yes, we can share a draft on 06 Feb for your review and finalize by 08 Feb.',
          isPublic: true,
          timestamp: new Date('2024-01-15T10:00:00Z'),
          responses: []
        }
      ]
    },

    // Example SR-level (no bid) query for completeness (not shown in per-bid view)
    {
      id: 'query-3001',
      serviceRequestId: 'sr-001',
      senderId: 'seeker-001',
      senderType: 'seeker',
      message: 'General clarification: Please confirm NDA execution prior to document exchange.',
      isPublic: true,
      recipients: ['provider-001', 'provider-002'],
      timestamp: new Date('2024-01-13T14:00:00Z'),
      responses: []
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
        reimbursements: {
          regulatoryStatutoryPayouts: 3000,
          opeProfessionalTeam: 2000
        },
        totalBidAmount: 107350,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-001',
            stageLabel: 'Initial Assessment',
            paymentAmount: 35000,
            dueDate: new Date('2024-01-20'),
            description: 'Preliminary valuation and data collection'
          },
          {
            id: 'milestone-002',
            stageLabel: 'Final Delivery',
            paymentAmount: 50000,
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
      status: BidStatus.REJECTED,
      isInvited: true,
      submittedAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
      lastEditDate: new Date('2024-01-13'),
      isWinningBid: false,
      negotiationThread: {
        id: 'negotiation-001',
        bidId: 'bid-001',
        serviceRequestId: 'sr-001',
        status: 'completed',
        initiatedBy: 'seeker',
        initiatedAt: new Date('2024-01-14'),
        lastActivity: new Date('2024-01-16'),
        inputs: [
          {
            id: 'neg-input-001',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-14T10:30:00'),
            reason: NegotiationReason.ADJUST_FEE,
            message: 'Your bid is competitive, but we would like to negotiate the professional fee. Can you consider reducing it to ₹65,000?',
            proposedChanges: {
              financials: {
                professionalFee: 65000,
                totalBidAmount: 97350
              }
            }
          },
          {
            id: 'neg-input-002',
            senderId: 'provider-001',
            senderType: 'provider',
            timestamp: new Date('2024-01-14T14:15:00'),
            reason: NegotiationReason.PRICING,
            message: 'Thank you for considering our proposal. We can reduce the professional fee to ₹70,000, which is our best offer considering the complexity of the valuation.',
            proposedChanges: {
              financials: {
                professionalFee: 70000,
                totalBidAmount: 102350
              }
            }
          },
          {
            id: 'neg-input-003',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-16T09:00:00'),
            reason: NegotiationReason.PRICING,
            message: 'We accept your revised offer of ₹70,000 for the professional fee. Please proceed with the updated terms.',
            proposedChanges: {
              financials: {
                professionalFee: 70000,
                totalBidAmount: 102350
              }
            }
          }
        ]
      }
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
        reimbursements: {
          regulatoryStatutoryPayouts: 2500,
          opeProfessionalTeam: 2500
        },
        totalBidAmount: 118330,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-003',
            stageLabel: 'Data Collection & Analysis',
            paymentAmount: 42500,
            dueDate: new Date('2024-01-25'),
            description: 'Comprehensive data collection and preliminary analysis'
          },
          {
            id: 'milestone-004',
            stageLabel: 'Final Valuation Report',
            paymentAmount: 42500,
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
      status: BidStatus.UNDER_NEGOTIATION,
      isInvited: true,
      submittedAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
      lastEditDate: new Date('2024-01-14'),
      isWinningBid: false,
      negotiationThread: {
        id: 'negotiation-002',
        bidId: 'bid-002',
        serviceRequestId: 'sr-001',
        status: 'active',
        initiatedBy: 'seeker',
        initiatedAt: new Date('2024-01-15'),
        lastActivity: new Date('2024-01-16'),
        inputs: [
          {
            id: 'neg-input-002-001',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-15T10:30:00'),
            reason: NegotiationReason.PRICING,
            message: 'Your expertise in merger valuations is impressive. However, the total amount of ₹1,18,330 is above our initial budget. Can you provide a breakdown and see if there\'s flexibility in the professional fee?',
            proposedChanges: {
              financials: {
                professionalFee: 75000
              }
            }
          },
          {
            id: 'neg-input-002-002',
            senderId: 'provider-002',
            senderType: 'provider',
            timestamp: new Date('2024-01-15T14:20:00'),
            reason: NegotiationReason.PRICING,
            message: 'Thank you for your feedback. Our fee reflects the complexity of merger valuations. However, we can reduce our professional fee to ₹80,000 while maintaining the same quality and timeline. This brings the total to ₹1,13,330.',
            proposedChanges: {
              financials: {
                professionalFee: 80000,
                totalBidAmount: 113330
              }
            }
          },
          {
            id: 'neg-input-002-003',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-15T16:45:00'),
            reason: NegotiationReason.TIMELINE,
            message: 'The revised pricing looks better. Can you also expedite the delivery to February 5th instead of February 8th? We have a board meeting on February 6th and need the report beforehand.',
            proposedChanges: {
              deliveryDate: new Date('2024-02-05')
            }
          },
          {
            id: 'neg-input-002-004',
            senderId: 'provider-002',
            senderType: 'provider',
            timestamp: new Date('2024-01-16T09:15:00'),
            reason: NegotiationReason.TIMELINE,
            message: 'We can accommodate the February 5th deadline. To ensure quality delivery within this compressed timeline, we\'ll assign our senior team and work over the weekend. The pricing remains at ₹80,000 professional fee.',
            proposedChanges: {
              deliveryDate: new Date('2024-02-05'),
              additionalInputs: 'Expedited delivery with senior team allocation and weekend work to meet February 5th deadline'
            }
          },
          {
            id: 'neg-input-002-005',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-16T11:30:00'),
            reason: NegotiationReason.SCOPE,
            message: 'Excellent! One final request - can you include a management presentation summarizing key findings? This would be very helpful for our board meeting.',
            proposedChanges: {
              additionalInputs: 'Includes management presentation for board meeting'
            }
          },
          {
            id: 'neg-input-002-006',
            senderId: 'provider-002',
            senderType: 'provider',
            timestamp: new Date('2024-01-16T14:00:00'),
            reason: NegotiationReason.SCOPE,
            message: 'Absolutely! We\'ll include a comprehensive management presentation with key findings, recommendations, and visual charts. This is included in our revised fee. Looking forward to working with you.',
            proposedChanges: {
              additionalInputs: 'Complete merger valuation with expedited delivery, senior team allocation, and management presentation for board meeting'
            }
          }
        ]
      }
    },
    // Additional non-invited bids for sr-001
    {
      id: 'bid-008',
      bidNumber: 'BID2024008',
      serviceRequestId: 'sr-001',
      providerId: 'provider-008',
      providerName: 'Delhi Valuation Consultants',
      providerProfile: {
        rating: 4.3,
        completedProjects: 67,
        expertise: ['Business Valuation', 'Asset Valuation', 'Due Diligence'],
        location: 'Delhi'
      },
      financials: {
        professionalFee: 65000,
        platformFee: 6500,
        gst: 12870,
        reimbursements: {
          regulatoryStatutoryPayouts: 1800,
          opeProfessionalTeam: 2200
        },
        totalBidAmount: 92370,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2024-02-15'),
      additionalInputs: 'We offer competitive pricing with quick turnaround. Our team has experience in manufacturing sector valuations.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-008',
          name: 'Valuation_Methodology.pdf',
          label: 'Our Valuation Methodology',
          url: '/documents/valuation-methodology.pdf',
          uploadedAt: new Date('2024-01-15'),
          size: 856000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.ACCEPTED,
      isInvited: false,
      submittedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      lastEditDate: new Date('2024-01-16'),
      isWinningBid: true,
      awardedAmount: 75000,
      awardedDate: new Date('2024-01-20')
    },
    {
      id: 'bid-009',
      bidNumber: 'BID2024009',
      serviceRequestId: 'sr-001',
      providerId: 'provider-009',
      providerName: 'Bangalore Asset Valuers',
      providerProfile: {
        rating: 4.1,
        completedProjects: 43,
        expertise: ['Asset Valuation', 'Plant & Machinery', 'Real Estate'],
        location: 'Bangalore'
      },
      financials: {
        professionalFee: 58000,
        platformFee: 5800,
        gst: 11484,
        reimbursements: {
          regulatoryStatutoryPayouts: 1600,
          opeProfessionalTeam: 1900
        },
        totalBidAmount: 82284,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-008',
            stageLabel: 'Site Visit & Data Collection',
            paymentAmount: 29000,
            dueDate: new Date('2024-01-28'),
            description: 'Physical verification and data collection'
          },
          {
            id: 'milestone-009',
            stageLabel: 'Valuation Report',
            paymentAmount: 29000,
            dueDate: new Date('2024-02-12'),
            description: 'Final valuation report delivery'
          }
        ]
      },
      deliveryDate: new Date('2024-02-12'),
      additionalInputs: 'We provide detailed asset-wise valuation with physical verification. Remote location not an issue.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-009',
          name: 'Asset_Valuation_Portfolio.pdf',
          label: 'Asset Valuation Portfolio',
          url: '/documents/asset-valuation-portfolio.pdf',
          uploadedAt: new Date('2024-01-16'),
          size: 1200000,
          type: 'application/pdf'
        },
        {
          id: 'bid-doc-010',
          name: 'Certifications.pdf',
          label: 'Professional Certifications',
          url: '/documents/certifications.pdf',
          uploadedAt: new Date('2024-01-16'),
          size: 450000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.SUBMITTED,
      isInvited: false,
      submittedAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      lastEditDate: new Date('2024-01-17')
    },
    {
      id: 'bid-010',
      bidNumber: 'BID2024010',
      serviceRequestId: 'sr-001',
      providerId: 'provider-010',
      providerName: 'Chennai Financial Advisors',
      providerProfile: {
        rating: 4.4,
        completedProjects: 78,
        expertise: ['Financial Analysis', 'Merger Valuation', 'Investment Advisory'],
        location: 'Chennai'
      },
      financials: {
        professionalFee: 72000,
        platformFee: 7200,
        gst: 14256,
        reimbursements: {
          regulatoryStatutoryPayouts: 2000,
          opeProfessionalTeam: 2500
        },
        totalBidAmount: 102456,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-010',
            stageLabel: 'Financial Analysis',
            paymentAmount: 36000,
            dueDate: new Date('2024-01-30'),
            description: 'Comprehensive financial analysis and modeling'
          },
          {
            id: 'milestone-011',
            stageLabel: 'Final Report & Recommendations',
            paymentAmount: 36000,
            dueDate: new Date('2024-02-14'),
            description: 'Final report with management presentation'
          }
        ]
      },
      deliveryDate: new Date('2024-02-14'),
      additionalInputs: 'We specialize in merger valuations with detailed financial modeling. Will include management presentation.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-011',
          name: 'Financial_Modeling_Sample.xlsx',
          label: 'Sample Financial Model',
          url: '/documents/financial-modeling-sample.xlsx',
          uploadedAt: new Date('2024-01-17'),
          size: 2100000,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ],
      status: BidStatus.SUBMITTED,
      isInvited: false,
      submittedAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17'),
      lastEditDate: new Date('2024-01-18')
    },
    {
      id: 'bid-011',
      bidNumber: 'BID2024011',
      serviceRequestId: 'sr-001',
      providerId: 'provider-011',
      providerName: 'Pune Valuation Services',
      providerProfile: {
        rating: 3.9,
        completedProjects: 34,
        expertise: ['Business Valuation', 'Startup Valuation', 'IPO Advisory'],
        location: 'Pune'
      },
      financials: {
        professionalFee: 55000,
        platformFee: 5500,
        gst: 10890,
        reimbursements: {
          regulatoryStatutoryPayouts: 1500,
          opeProfessionalTeam: 1800
        },
        totalBidAmount: 77690,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2024-02-18'),
      additionalInputs: 'We are a growing firm offering competitive rates. Our team includes CA and CFA professionals.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-012',
          name: 'Team_Profiles.pdf',
          label: 'Team Professional Profiles',
          url: '/documents/team-profiles.pdf',
          uploadedAt: new Date('2024-01-18'),
          size: 680000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.SUBMITTED,
      isInvited: false,
      submittedAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      lastEditDate: new Date('2024-01-19')
    },
    {
      id: 'bid-012',
      bidNumber: 'BID2024012',
      serviceRequestId: 'sr-001',
      providerId: 'provider-012',
      providerName: 'Kolkata Business Consultants',
      providerProfile: {
        rating: 4.2,
        completedProjects: 56,
        expertise: ['Business Valuation', 'Due Diligence', 'Financial Consulting'],
        location: 'Kolkata'
      },
      financials: {
        professionalFee: 68000,
        platformFee: 6800,
        gst: 13464,
        reimbursements: {
          regulatoryStatutoryPayouts: 1900,
          opeProfessionalTeam: 2300
        },
        totalBidAmount: 96664,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-012',
            stageLabel: 'Due Diligence & Analysis',
            paymentAmount: 34000,
            dueDate: new Date('2024-02-01'),
            description: 'Comprehensive due diligence and analysis'
          },
          {
            id: 'milestone-013',
            stageLabel: 'Final Valuation Report',
            paymentAmount: 31000,
            dueDate: new Date('2024-02-16'),
            description: 'Complete valuation report with recommendations'
          }
        ]
      },
      deliveryDate: new Date('2024-02-16'),
      additionalInputs: 'We provide comprehensive valuation services with detailed due diligence. Strong track record in manufacturing sector.',
      documents: [],
      status: BidStatus.UNDER_REVIEW,
      isInvited: false,
      submittedAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-15'),
      lastEditDate: new Date('2024-01-14'),
      negotiationThread: {
        id: 'negotiation-002',
        bidId: 'bid-002',
        serviceRequestId: 'sr-001',
        status: 'active',
        initiatedBy: 'seeker',
        initiatedAt: new Date('2024-01-15'),
        lastActivity: new Date('2024-01-15'),
        inputs: [
          {
            id: 'neg-input-004',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-15T11:00:00'),
            reason: NegotiationReason.REVISE_TIMELINE,
            message: 'We need the valuation completed by February 5th instead of February 8th. Can you accommodate this timeline?',
            proposedChanges: {
              deliveryDate: new Date('2024-02-05')
            }
          }
        ]
      }
    },
    // Bid under negotiation with detailed negotiation thread
    {
      id: 'bid-013',
      bidNumber: 'BID2024013',
      serviceRequestId: 'sr-002',
      providerId: 'provider-013',
      providerName: 'Legal Associates & Partners',
      providerProfile: {
        rating: 4.5,
        completedProjects: 125,
        expertise: ['IBC Proceedings', 'Corporate Law', 'Insolvency Resolution'],
        location: 'Mumbai'
      },
      financials: {
        professionalFee: 85000,
        platformFee: 8500,
        gst: 16830,
        reimbursements: {
          regulatoryStatutoryPayouts: 2500,
          opeProfessionalTeam: 3000
        },
        totalBidAmount: 115830,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-013',
            stageLabel: 'Legal Documentation',
            paymentAmount: 42500,
            dueDate: new Date('2024-02-01'),
            description: 'Complete legal documentation and filing'
          },
          {
            id: 'milestone-014',
            stageLabel: 'Final Resolution',
            paymentAmount: 42500,
            dueDate: new Date('2024-02-16'),
            description: 'Final resolution and compliance reporting'
          }
        ]
      },
      deliveryDate: new Date('2024-02-16'),
      additionalInputs: 'Specialized in IBC proceedings with extensive experience in corporate insolvency resolution.',
      documents: [],
      status: BidStatus.UNDER_REVIEW,
      isInvited: false,
      submittedAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-15'),
      lastEditDate: new Date('2024-01-14'),
      negotiationThread: {
        id: 'negotiation-002',
        bidId: 'bid-002',
        serviceRequestId: 'sr-001',
        status: 'active',
        initiatedBy: 'seeker',
        initiatedAt: new Date('2024-01-15'),
        lastActivity: new Date('2024-01-15'),
        inputs: [
          {
            id: 'neg-input-004',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-15T11:00:00'),
            reason: NegotiationReason.REVISE_TIMELINE,
            message: 'We need the valuation completed by February 5th instead of February 8th. Can you accommodate this timeline?',
            proposedChanges: {
              deliveryDate: new Date('2024-02-05')
            }
          }
        ]
      }
    },
    {
      id: 'bid-014',
      bidNumber: 'BID2024014',
      serviceRequestId: 'sr-002',
      providerId: 'provider-014',
      providerName: 'Legal Associates & Partners',
      providerProfile: {
        rating: 4.5,
        completedProjects: 125,
        expertise: ['IBC Proceedings', 'Corporate Law', 'Insolvency Resolution'],
        location: 'Mumbai'
      },
      financials: {
        professionalFee: 45000,
        platformFee: 4500,
        gst: 8910,
        reimbursements: {
          regulatoryStatutoryPayouts: 15000,
          opeProfessionalTeam: 2500
        },
        totalBidAmount: 85000,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-015',
            stageLabel: 'Notice Publication & Filing',
            paymentAmount: 25000,
            dueDate: new Date('2024-02-05'),
            description: 'Publication in newspapers and NCLT filing'
          },
          {
            id: 'milestone-016',
            stageLabel: 'Process Completion & Documentation',
            paymentAmount: 20000,
            dueDate: new Date('2024-02-20'),
            description: 'Complete process documentation and compliance'
          }
        ]
      },
      deliveryDate: new Date('2024-02-20'),
      additionalInputs: 'We have handled 50+ IBC cases with 95% success rate. Our team includes senior advocates and insolvency professionals.',
      additionalClientInputs: [
        {
          id: 'client-input-007',
          description: 'Company financial statements for last 3 years',
          documentLabel: 'Financial Statements',
          documents: []
        },
        {
          id: 'client-input-008',
          description: 'List of creditors with outstanding amounts',
          documentLabel: 'Creditor List',
          documents: []
        }
      ],
      documents: [
        {
          id: 'bid-doc-013',
          name: 'IBC_Experience_Portfolio.pdf',
          label: 'IBC Case Experience Portfolio',
          url: '/documents/ibc-experience-portfolio.pdf',
          uploadedAt: new Date('2024-01-20'),
          size: 1890000,
          type: 'application/pdf'
        },
        {
          id: 'bid-doc-014',
          name: 'Sample_Publication_Notice.pdf',
          label: 'Sample Publication Notice',
          url: '/documents/sample-publication-notice.pdf',
          uploadedAt: new Date('2024-01-20'),
          size: 456000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.UNDER_NEGOTIATION,
      isInvited: true,
      submittedAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-23'),
      lastEditDate: new Date('2024-01-22'),
      negotiationThread: {
        id: 'negotiation-013',
        bidId: 'bid-013',
        serviceRequestId: 'sr-002',
        status: 'active',
        initiatedBy: 'seeker',
        initiatedAt: new Date('2024-01-21'),
        lastActivity: new Date('2024-01-23'),
        inputs: [
          {
            id: 'neg-input-001',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-21T10:30:00'),
            reason: NegotiationReason.PRICING,
            message: 'Your bid is competitive, but we need to discuss the regulatory payouts. Can you provide a detailed breakdown of the ₹15,000 regulatory payouts? Also, is there flexibility in the professional fee?',
            proposedChanges: {
              financials: {
                professionalFee: 40000,
                regulatoryPayouts: 12000
              }
            }
          },
          {
            id: 'neg-input-002',
            senderId: 'provider-013',
            senderType: 'provider',
            timestamp: new Date('2024-01-21T14:15:00'),
            reason: NegotiationReason.PRICING,
            message: 'Thank you for considering our proposal. The regulatory payouts include: NCLT filing fees (₹10,000), newspaper publication costs (₹3,000), and miscellaneous statutory fees (₹2,000). We can reduce our professional fee to ₹42,000 but regulatory payouts are fixed costs.',
            proposedChanges: {
              financials: {
                professionalFee: 42000,
                regulatoryPayouts: 15000
              }
            },
            attachments: [
              {
                id: 'att-001',
                name: 'Regulatory_Fee_Breakdown.pdf',
                url: '/documents/regulatory-fee-breakdown.pdf',
                uploadedAt: new Date('2024-01-21T14:15:00')
              }
            ]
          },
          {
            id: 'neg-input-003',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-22T09:45:00'),
            reason: NegotiationReason.TIMELINE,
            message: 'The fee structure looks reasonable now. However, we need the first milestone completed by February 1st instead of February 5th due to urgent compliance requirements. Can you accommodate this timeline?',
            proposedChanges: {
              milestones: [
                {
                  id: 'milestone-013',
                  dueDate: new Date('2024-02-01')
                }
              ]
            }
          },
          {
            id: 'neg-input-004',
            senderId: 'provider-013',
            senderType: 'provider',
            timestamp: new Date('2024-01-22T16:20:00'),
            reason: NegotiationReason.TIMELINE,
            message: 'We can expedite the process to meet your February 1st deadline. This will require additional coordination with publication agencies and priority processing. We can accommodate this timeline.',
            proposedChanges: {
              milestones: [
                {
                  id: 'milestone-013',
                  dueDate: new Date('2024-02-01')
                }
              ],
              deliveryDate: new Date('2024-02-18')
            }
          },
          {
            id: 'neg-input-005',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-23T11:10:00'),
            reason: NegotiationReason.SCOPE,
            message: 'Perfect! One final request - can you include a compliance checklist and provide weekly status updates during the process? This will help us track progress internally.',
            proposedChanges: {
              additionalInputs: 'Includes compliance checklist and weekly status updates'
            }
          },
          {
            id: 'neg-input-006',
            senderId: 'provider-013',
            senderType: 'provider',
            timestamp: new Date('2024-01-23T15:30:00'),
            reason: NegotiationReason.SCOPE,
            message: 'Absolutely! We will provide a detailed compliance checklist at the start and send weekly progress reports every Friday. This is included in our service at no additional cost. Shall we finalize the terms?',
            proposedChanges: {
              additionalInputs: 'Comprehensive IBC process management with compliance checklist and weekly status reports'
            }
          }
        ]
      }
    },
    // Another bid under negotiation with different scenario
    {
      id: 'bid-014',
      bidNumber: 'BID2024014',
      serviceRequestId: 'sr-002',
      providerId: 'provider-014',
      providerName: 'Mumbai Corporate Law Firm',
      providerProfile: {
        rating: 4.3,
        completedProjects: 89,
        expertise: ['Corporate Law', 'IBC Proceedings', 'Legal Compliance'],
        location: 'Mumbai'
      },
      financials: {
        professionalFee: 38000,
        platformFee: 3800,
        gst: 7524,
        reimbursements: {
          regulatoryStatutoryPayouts: 15000,
          opeProfessionalTeam: 2200
        },
        totalBidAmount: 72524,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2024-02-25'),
      additionalInputs: 'Cost-effective solution with experienced team. We handle all documentation and compliance requirements.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-015',
          name: 'IBC_Success_Cases.pdf',
          label: 'IBC Success Case Studies',
          url: '/documents/ibc-success-cases.pdf',
          uploadedAt: new Date('2024-01-21'),
          size: 1234000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.UNDER_NEGOTIATION,
      isInvited: false,
      submittedAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-01-24'),
      lastEditDate: new Date('2024-01-23'),
      negotiationThread: {
        id: 'negotiation-014',
        bidId: 'bid-014',
        serviceRequestId: 'sr-002',
        status: 'active',
        initiatedBy: 'provider',
        initiatedAt: new Date('2024-01-22'),
        lastActivity: new Date('2024-01-24'),
        inputs: [
          {
            id: 'neg-input-007',
            senderId: 'provider-014',
            senderType: 'provider',
            timestamp: new Date('2024-01-22T12:00:00'),
            reason: NegotiationReason.PRICING,
            message: 'We noticed other bids might be higher. We can offer additional services like post-publication compliance monitoring and NCLT hearing representation at the same price. Would this add value to your requirements?',
            proposedChanges: {
              additionalInputs: 'Includes post-publication compliance monitoring and NCLT hearing representation'
            }
          },
          {
            id: 'neg-input-008',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-22T16:45:00'),
            reason: NegotiationReason.SCOPE,
            message: 'The additional services sound valuable. However, your timeline shows February 25th completion, which is later than our requirement. Can you match the February 20th timeline of other bidders?',
            proposedChanges: {
              deliveryDate: new Date('2024-02-20')
            }
          },
          {
            id: 'neg-input-009',
            senderId: 'provider-014',
            senderType: 'provider',
            timestamp: new Date('2024-01-23T10:30:00'),
            reason: NegotiationReason.TIMELINE,
            message: 'We can expedite to February 20th. To ensure quality delivery within this timeline, we would need to allocate senior resources, which would require a small adjustment in professional fee to ₹41,000. This still keeps us competitive.',
            proposedChanges: {
              financials: {
                professionalFee: 41000
              },
              deliveryDate: new Date('2024-02-20')
            }
          },
          {
            id: 'neg-input-010',
            senderId: 'seeker-001',
            senderType: 'seeker',
            timestamp: new Date('2024-01-24T09:15:00'),
            reason: NegotiationReason.PRICING,
            message: 'The timeline adjustment is acceptable, but ₹41,000 makes it less competitive. Can you meet the February 20th deadline at ₹39,000 professional fee? The additional services you mentioned would justify this.',
            proposedChanges: {
              financials: {
                professionalFee: 39000
              }
            }
          },
          {
            id: 'neg-input-011',
            senderId: 'provider-014',
            senderType: 'provider',
            timestamp: new Date('2024-01-24T14:20:00'),
            reason: NegotiationReason.PRICING,
            message: 'We appreciate your consideration. We can agree to ₹39,000 professional fee with February 20th delivery, including all additional services mentioned. We believe this offers excellent value. Awaiting your decision.',
            proposedChanges: {
              financials: {
                professionalFee: 39000
              },
              deliveryDate: new Date('2024-02-20'),
              additionalInputs: 'Complete IBC process with post-publication compliance monitoring, NCLT hearing representation, and expedited delivery'
            }
          }
        ]
      }
    },
    // Additional bids for other service requests
    {
      id: 'bid-015',
      bidNumber: 'BID2024015',
      serviceRequestId: 'sr-001',
      providerId: 'provider-015',
      providerName: 'Hyderabad Valuation Experts',
      providerProfile: {
        rating: 4.1,
        completedProjects: 45,
        expertise: ['Asset Valuation', 'Business Valuation', 'Real Estate Valuation'],
        location: 'Hyderabad'
      },
      financials: {
        professionalFee: 62000,
        platformFee: 6200,
        gst: 12276,
        reimbursements: {
          regulatoryStatutoryPayouts: 1700,
          opeProfessionalTeam: 2100
        },
        totalBidAmount: 88076,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-015',
            stageLabel: 'Initial Assessment',
            paymentAmount: 31000,
            dueDate: new Date('2024-01-31'),
            description: 'Initial business assessment and data analysis'
          },
          {
            id: 'milestone-016',
            stageLabel: 'Final Audit Report',
            paymentAmount: 10000,
            dueDate: new Date('2024-02-15'),
            description: 'Complete valuation report with methodology'
          }
        ]
      },
      deliveryDate: new Date('2024-02-15'),
      additionalInputs: 'We have extensive experience in manufacturing sector valuations. Our team includes registered valuers and CAs.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-016',
          name: 'Manufacturing_Valuation_Experience.pdf',
          label: 'Manufacturing Sector Experience',
          url: '/documents/manufacturing-valuation-experience.pdf',
          uploadedAt: new Date('2024-01-20'),
          size: 890000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.UNDER_REVIEW,
      isInvited: false,
      submittedAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-21'),
      lastEditDate: new Date('2024-01-21')
    },
    {
      id: 'bid-014',
      bidNumber: 'BID2024014',
      serviceRequestId: 'sr-001',
      providerId: 'provider-014',
      providerName: 'Ahmedabad Business Valuers',
      providerProfile: {
        rating: 4.0,
        completedProjects: 38,
        expertise: ['Business Valuation', 'Financial Advisory', 'M&A Support'],
        location: 'Ahmedabad'
      },
      financials: {
        professionalFee: 59000,
        platformFee: 5900,
        gst: 11682,
        reimbursements: {
          regulatoryStatutoryPayouts: 1600,
          opeProfessionalTeam: 1900
        },
        totalBidAmount: 83282,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2024-02-17'),
      additionalInputs: 'Competitive pricing with quality deliverables. We focus on detailed financial analysis and market benchmarking.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-014',
          name: 'Sample_Valuation_Report.pdf',
          label: 'Sample Valuation Report',
          url: '/documents/sample-valuation-report.pdf',
          uploadedAt: new Date('2024-01-21'),
          size: 1450000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.ACCEPTED,
      isInvited: false,
      submittedAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-01-22'),
      lastEditDate: new Date('2024-01-21')
    },
    {
      id: 'bid-015',
      bidNumber: 'BID2024015',
      serviceRequestId: 'sr-001',
      providerId: 'provider-015',
      providerName: 'Jaipur Financial Consultants',
      providerProfile: {
        rating: 3.8,
        completedProjects: 29,
        expertise: ['Financial Consulting', 'Business Valuation', 'Investment Advisory'],
        location: 'Jaipur'
      },
      financials: {
        professionalFee: 54000,
        platformFee: 5400,
        gst: 10692,
        reimbursements: {
          regulatoryStatutoryPayouts: 1400,
          opeProfessionalTeam: 1700
        },
        totalBidAmount: 75992,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-015',
            stageLabel: 'Audit Execution & Testing',
            paymentAmount: 20000,
            dueDate: new Date('2024-02-02'),
            description: 'Comprehensive data collection and preliminary analysis'
          },
          {
            id: 'milestone-016',
            stageLabel: 'Valuation Report Delivery',
            paymentAmount: 27000,
            dueDate: new Date('2024-02-18'),
            description: 'Final valuation report with executive summary'
          }
        ]
      },
      deliveryDate: new Date('2024-02-18'),
      additionalInputs: 'We offer cost-effective solutions with detailed documentation. Our approach includes peer comparison analysis.',
      additionalClientInputs: [],
      documents: [],
      status: BidStatus.REJECTED,
      isInvited: false,
      submittedAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-23'),
      lastEditDate: new Date('2024-01-22')
    },
    {
      id: 'bid-016',
      bidNumber: 'BID2024016',
      serviceRequestId: 'sr-001',
      providerId: 'provider-016',
      providerName: 'Lucknow Valuation Associates',
      providerProfile: {
        rating: 3.7,
        completedProjects: 22,
        expertise: ['Asset Valuation', 'Business Valuation', 'Audit Support'],
        location: 'Lucknow'
      },
      financials: {
        professionalFee: 51000,
        platformFee: 5100,
        gst: 10098,
        reimbursements: {
          regulatoryStatutoryPayouts: 1300,
          opeProfessionalTeam: 1600
        },
        totalBidAmount: 71598,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2024-02-20'),
      additionalInputs: 'Budget-friendly option with reliable service. We maintain transparency in our valuation methodology.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-016',
          name: 'Methodology_Overview.pdf',
          label: 'Valuation Methodology Overview',
          url: '/documents/methodology-overview.pdf',
          uploadedAt: new Date('2024-01-23'),
          size: 320000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.REJECTED,
      isInvited: false,
      submittedAt: new Date('2024-01-23'),
      updatedAt: new Date('2024-01-24'),
      lastEditDate: new Date('2024-01-23')
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
        totalBidAmount: 26864,
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
        reimbursements: {
          regulatoryStatutoryPayouts: 1000,
          opeProfessionalTeam: 1500
        },
        totalBidAmount: 46536,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-005',
            stageLabel: 'Initial Review & Assessment',
            paymentAmount: 16000,
            dueDate: new Date('2024-02-05'),
            description: 'Review of GST returns and initial assessment'
          },
          {
            id: 'milestone-006',
            stageLabel: 'Final Report Submission',
            paymentAmount: 29000,
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
        totalBidAmount: 39844,
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
        totalBidAmount: 11484,
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
        reimbursements: {
          regulatoryStatutoryPayouts: 1500,
          opeProfessionalTeam: 1800
        },
        totalBidAmount: 50730,
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
        reimbursements: {
          regulatoryStatutoryPayouts: 1200,
          opeProfessionalTeam: 1500
        },
        totalBidAmount: 53824,
        paymentStructure: PaymentStructure.MONTHLY_RETAINER
      },
      deliveryDate: new Date('2024-03-25'),
      additionalInputs: 'We offer comprehensive corporate compliance services with monthly retainer model for ongoing support.',
      additionalClientInputs: [],
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
    },
    // Completed Bids
    {
      id: 'bid-009',
      bidNumber: 'BID2024009',
      serviceRequestId: 'sr-006',
      providerId: 'provider-001',
      providerName: 'Mumbai Tax Consultants',
      providerProfile: {
        rating: 4.8,
        completedProjects: 156,
        expertise: ['Tax Planning', 'GST Compliance', 'Income Tax Returns'],
        location: 'Mumbai'
      },
      financials: {
        professionalFee: 25000,
        platformFee: 2500,
        gst: 4950,
        reimbursements: {
          regulatoryStatutoryPayouts: 800,
          opeProfessionalTeam: 1200
        },
        totalBidAmount: 35950,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2023-12-15'),
      additionalInputs: 'Comprehensive tax advisory services with GST compliance support.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-010',
          name: 'Tax_Advisory_Proposal.pdf',
          label: 'Tax Advisory Service Proposal',
          url: '/documents/tax-advisory-proposal.pdf',
          uploadedAt: new Date('2023-11-20'),
          size: 768000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.ACCEPTED,
      isInvited: false,
      submittedAt: new Date('2023-11-20'),
      updatedAt: new Date('2023-12-20'),
      lastEditDate: new Date('2023-11-20')
    },
    {
      id: 'bid-010',
      bidNumber: 'BID2024010',
      serviceRequestId: 'sr-007',
      providerId: 'provider-001',
      providerName: 'Delhi Audit Associates',
      providerProfile: {
        rating: 4.7,
        completedProjects: 89,
        expertise: ['Statutory Audit', 'Internal Audit', 'Tax Audit'],
        location: 'Delhi'
      },
      financials: {
        professionalFee: 45000,
        platformFee: 4500,
        gst: 8910,
        reimbursements: {
          regulatoryStatutoryPayouts: 1500,
          opeProfessionalTeam: 2000
        },
        totalBidAmount: 64910,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-017',
            stageLabel: 'Audit Planning & Risk Assessment',
            paymentAmount: 15000,
            dueDate: new Date('2023-11-30'),
            description: 'Initial audit planning and risk assessment phase'
          },
          {
            id: 'milestone-018',
            label: 'Detailed Audit Execution',
            amount: 22500,
            dueDate: new Date('2023-12-20'),
            description: 'Detailed audit procedures and testing'
          },
          {
            id: 'milestone-019',
            label: 'Audit Report & Compliance',
            amount: 7500,
            dueDate: new Date('2024-01-10'),
            description: 'Final audit report and regulatory compliance'
          }
        ]
      },
      deliveryDate: new Date('2024-01-10'),
      additionalInputs: 'Complete statutory audit services with detailed compliance reporting.',
      documents: [
        {
          id: 'bid-doc-011',
          name: 'Audit_Methodology.pdf',
          label: 'Audit Methodology & Approach',
          url: '/documents/audit-methodology.pdf',
          uploadedAt: new Date('2023-11-15'),
          size: 1024000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.ACCEPTED,
      isInvited: true,
      submittedAt: new Date('2023-11-15'),
      updatedAt: new Date('2024-01-15'),
      lastEditDate: new Date('2023-11-15')
    },
    {
      id: 'bid-011',
      bidNumber: 'BID2024011',
      serviceRequestId: 'sr-008',
      providerId: 'provider-001',
      providerName: 'Bangalore Legal Services',
      providerProfile: {
        rating: 4.9,
        completedProjects: 203,
        expertise: ['Contract Drafting', 'Legal Advisory', 'Compliance Review'],
        location: 'Bangalore'
      },
      financials: {
        professionalFee: 18000,
        platformFee: 1800,
        gst: 3564,
        reimbursements: {
          regulatoryStatutoryPayouts: 500,
          opeProfessionalTeam: 800
        },
        totalBidAmount: 25664,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2023-10-25'),
      additionalInputs: 'Expert contract drafting services with comprehensive legal review.',
      additionalClientInputs: [],
      documents: [
        {
          id: 'bid-doc-012',
          name: 'Contract_Templates.pdf',
          label: 'Standard Contract Templates',
          url: '/documents/contract-templates.pdf',
          uploadedAt: new Date('2023-10-05'),
          size: 512000,
          type: 'application/pdf'
        }
      ],
      status: BidStatus.ACCEPTED,
      isInvited: false,
      submittedAt: new Date('2023-10-05'),
      updatedAt: new Date('2023-10-30'),
      lastEditDate: new Date('2023-10-05')
    },
    {
      id: 'bid-115-001',
      bidNumber: 'BID2024115-001',
      serviceRequestId: 'sr-115',
      providerId: 'provider-021',
      providerName: 'Regulatory Compliance Experts',
      providerProfile: {
        rating: 4.6,
        completedProjects: 112,
        expertise: ['Regulatory Compliance', 'SEBI', 'RBI', 'Governance'],
        location: 'Mumbai'
      },
      financials: {
        professionalFee: 90000,
        platformFee: 9000,
        gst: 18900,
        reimbursements: {
          regulatoryStatutoryPayouts: 5000,
          opeProfessionalTeam: 3500
        },
        totalBidAmount: 126400,
        paymentStructure: PaymentStructure.MILESTONE_BASED,
        milestones: [
          {
            id: 'milestone-115-1',
            stageLabel: 'Kickoff & Gap Assessment',
            paymentAmount: 40000,
            dueDate: new Date('2024-02-10'),
            description: 'Initial compliance gap analysis across RBI/SEBI and key regulations'
          },
          {
            id: 'milestone-115-2',
            stageLabel: 'Remediation Plan & Final Report',
            paymentAmount: 50000,
            dueDate: new Date('2024-02-28'),
            description: 'Remediation roadmap, controls, and final compliance report'
          }
        ]
      },
      deliveryDate: new Date('2024-02-28'),
      additionalInputs: 'Includes compliance checklist, policy templates, and board presentation.',
      additionalClientInputs: [],
      documents: [],
      status: BidStatus.SUBMITTED,
      isInvited: true,
      submittedAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      lastEditDate: new Date('2024-01-25')
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

    this.mockServiceSeekerRequests.push(newRequest);
    return newRequest;
  }

  async getServiceRequests(
    filters: ServiceRequestFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' },
    userRole?: string,
    userId?: string
  ): Promise<ServiceRequestResponse> {
    // Role-based data selection
    let filteredRequests: ServiceRequest[];
    
    if (userRole && userRole.includes('SERVICE_PROVIDER')) {
      // Service providers see opportunities they can bid on
      filteredRequests = [...this.mockServiceProviderOpportunities];
    } else {
      // Service seekers see only their own requests
      filteredRequests = [...this.mockServiceSeekerRequests];
      if (userId) {
        filteredRequests = filteredRequests.filter(req => req.createdBy === userId);
      }
    }

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
    // Check both seeker and provider data
    return this.mockServiceSeekerRequests.find(req => req.id === id) || 
           this.mockServiceProviderOpportunities.find(req => req.id === id) || 
           null;
  }

  async updateServiceRequest(id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const seekerIndex = this.mockServiceSeekerRequests.findIndex(req => req.id === id);
    if (seekerIndex !== -1) {
      this.mockServiceSeekerRequests[seekerIndex] = {
        ...this.mockServiceSeekerRequests[seekerIndex],
        ...data,
        updatedAt: new Date()
      };
      return this.mockServiceSeekerRequests[seekerIndex];
    }

    const providerIndex = this.mockServiceProviderOpportunities.findIndex(req => req.id === id);
    if (providerIndex !== -1) {
      this.mockServiceProviderOpportunities[providerIndex] = {
        ...this.mockServiceProviderOpportunities[providerIndex],
        ...data,
        updatedAt: new Date()
      };
      return this.mockServiceProviderOpportunities[providerIndex];
    }

    throw new Error('Service request not found');
  }

  async deleteServiceRequest(id: string): Promise<boolean> {
    const seekerIndex = this.mockServiceSeekerRequests.findIndex(req => req.id === id);
    if (seekerIndex !== -1) {
      this.mockServiceSeekerRequests.splice(seekerIndex, 1);
      return true;
    }

    const providerIndex = this.mockServiceProviderOpportunities.findIndex(req => req.id === id);
    if (providerIndex !== -1) {
      this.mockServiceProviderOpportunities.splice(providerIndex, 1);
      return true;
    }

    return false;
  }

  async getServiceRequestStats(userId: string): Promise<ServiceRequestStats> {
    const userRequests = this.mockServiceSeekerRequests.filter(req => req.createdBy === userId);
    
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
        totalBidAmount: 0,
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

  async updateBidStatus(bidId: string, status: BidStatus): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const bidIndex = this.mockBids.findIndex(bid => bid.id === bidId);
    if (bidIndex !== -1) {
      this.mockBids[bidIndex].status = status;
      this.mockBids[bidIndex].updatedAt = new Date();
    }
  }

  // Opportunities Management (for Service Providers)
  async getOpportunities(
    filters: OpportunityFilters & Partial<PaginationOptions> = {}
  ): Promise<OpportunityResponse> {
    // Set default pagination values
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    
    // Mock implementation - in real app, this would filter based on provider qualifications
    let opportunities = [...this.mockServiceProviderOpportunities];

    // Filter by search term
    if (filters.search && typeof filters.search === 'string' && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      opportunities = opportunities.filter(opp => 
        opp.srnNumber.toLowerCase().includes(searchLower) ||
        opp.title.toLowerCase().includes(searchLower) ||
        opp.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by SRN number
    if (filters.srnNumber && typeof filters.srnNumber === 'string' && filters.srnNumber.trim()) {
      const srnLower = filters.srnNumber.toLowerCase();
      opportunities = opportunities.filter(opp => 
        opp.srnNumber.toLowerCase().includes(srnLower)
      );
    }

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

    // Filter by date range
    if (filters.dateRange?.from || filters.dateRange?.to) {
      opportunities = opportunities.filter(opp => {
        const oppDate = new Date(opp.createdAt);
        if (filters.dateRange?.from) {
          const fromDate = new Date(filters.dateRange.from);
          if (oppDate < fromDate) return false;
        }
        if (filters.dateRange?.to) {
          const toDate = new Date(filters.dateRange.to);
          if (oppDate > toDate) return false;
        }
        return true;
      });
    }

    // Sort opportunities
    opportunities.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'deadline':
          aValue = new Date(a.deadline || 0);
          bValue = new Date(b.deadline || 0);
          break;
        case 'workRequiredBy':
          aValue = new Date(a.workRequiredBy || 0);
          bValue = new Date(b.workRequiredBy || 0);
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const total = opportunities.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = opportunities.slice(startIndex, endIndex);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
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
    // Mock implementation - post a general (SR-level) query
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

    this.mockQueries.push(query);
    return query;
  }

  async getQueriesForServiceRequest(serviceRequestId: string): Promise<QueryClarification[]> {
    // Return SR-level queries (those without bidId)
    return this.mockQueries.filter(q => q.serviceRequestId === serviceRequestId && !q.bidId);
  }

  // Post a query targeted to a specific bid (per-bid query)
  async postBidQuery(
    serviceRequestId: string,
    bidId: string,
    message: string,
    isPublic: boolean,
    recipients?: string[]
  ): Promise<QueryClarification> {
    const query: QueryClarification = {
      id: `query-${Date.now()}`,
      serviceRequestId,
      bidId,
      senderId: 'current-user',
      senderType: 'seeker',
      message,
      isPublic,
      recipients,
      timestamp: new Date(),
      responses: []
    };
    this.mockQueries.push(query);
    return query;
  }

  // Fetch queries for a particular bid
  async getQueriesForBid(serviceRequestId: string, bidId: string): Promise<QueryClarification[]> {
    return this.mockQueries.filter(q => q.serviceRequestId === serviceRequestId && q.bidId === bidId);
  }

  // Post a reply to an existing query/clarification (threaded)
  async postReply(
    serviceRequestId: string,
    parentId: string,
    message: string,
    isPublic: boolean
  ): Promise<QueryClarification> {
    const parent = this.mockQueries.find(q => q.serviceRequestId === serviceRequestId && q.id === parentId);
    if (!parent) {
      throw new Error('Parent query not found');
    }
    const reply: QueryClarification = {
      id: `reply-${Date.now()}`,
      serviceRequestId,
      bidId: parent.bidId,
      senderId: 'current-user',
      senderType: 'seeker',
      message,
      isPublic,
      timestamp: new Date(),
      responses: []
    };
    parent.responses.push(reply);
    return reply;
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
      services: [ServiceType.FILING_OF_CHARGES],
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

  // Service Request Expiration Handling
  async acceptAndCloseExpiredRequest(serviceRequestId: string): Promise<void> {
    const request = this.mockServiceSeekerRequests.find(sr => sr.id === serviceRequestId);
    if (request) {
      request.status = ServiceRequestStatus.CLOSED;
      request.updatedAt = new Date();
    }
  }

  async requestExtension(serviceRequestId: string, extensionDays: number, reason: string): Promise<void> {
    const request = this.mockServiceSeekerRequests.find(sr => sr.id === serviceRequestId);
    if (request && request.deadline) {
      const newDeadline = new Date(request.deadline);
      newDeadline.setDate(newDeadline.getDate() + extensionDays);
      request.deadline = newDeadline;
      request.status = ServiceRequestStatus.OPEN;
      request.updatedAt = new Date();
    }
  }

  async initiateBiddingRound(serviceRequestId: string): Promise<void> {
    const request = this.mockServiceSeekerRequests.find(sr => sr.id === serviceRequestId);
    if (request) {
      // Reset deadline to 7 days from now
      const newDeadline = new Date();
      newDeadline.setDate(newDeadline.getDate() + 7);
      request.deadline = newDeadline;
      request.status = ServiceRequestStatus.OPEN;
      request.updatedAt = new Date();
      
      // Clear existing bids for new round
      this.mockBids = this.mockBids.filter(bid => bid.serviceRequestId !== serviceRequestId);
    }
  }

  // Mark opportunity as not interested
  async markNotInterested(serviceRequestId: string, reason: string): Promise<void> {
    // In a real implementation, this would update the user's interest status
    // For now, we'll just simulate the action
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Update allocation for service request
  async updateAllocation(serviceRequestId: string, allocationData: {
    currentAssignee: string;
    newAssignee: string;
    reason: string;
  }): Promise<void> {
    const request = this.mockServiceSeekerRequests.find(sr => sr.id === serviceRequestId);
    if (request && request.currentAssignee) {
      // Update the assignee
      request.currentAssignee = {
        id: allocationData.newAssignee,
        name: allocationData.newAssignee.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'Team Member',
        assignedAt: new Date()
      };
      request.updatedAt = new Date();
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Export opportunities to Excel
  async exportOpportunitiesToExcel(filters: OpportunityFilters = {}): Promise<void> {
    // Mock implementation - would generate and download Excel file
    const filename = `missed-opportunities-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Simulate file download
    const link = document.createElement('a');
    link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAA==';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export const serviceRequestService = new ServiceRequestService();

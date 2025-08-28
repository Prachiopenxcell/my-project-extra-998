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
    // @TEMP Work Orders for service seeker testing
    {
      id: 'wo-new-001',
      woNumber: '@TEMP-WO2024003',
      referenceNumber: 'DMS-2024-Q3',
      type: WorkOrderType.SERVICE_PROVIDER_INITIATED,
      status: WorkOrderStatus.SIGNATURE_PENDING,
      serviceRequestId: 'sr-003',
      bidId: 'bid-003',
      serviceSeeker: {
        id: 'seeker-001',
        name: 'ABC Manufacturing Ltd',
        email: 'admin@abcmfg.com',
        address: '123 Industrial Area, Mumbai, Maharashtra 400001',
        pan: 'ABCDE1234F',
        gst: '27ABCDE1234F1Z5'
      },
      serviceProvider: {
        id: 'provider-002',
        name: 'IP Law Consultants',
        email: 'contact@iplawconsultants.com',
        address: '456 Legal District, Delhi, Delhi 110001',
        pan: 'XYZAB5678C',
        gst: '07XYZAB5678C1Z3'
      },
      title: 'Digital Marketing Strategy 2024',
      scopeOfWork: 'Comprehensive digital marketing strategy development including market analysis, competitor research, and implementation roadmap.',
      deliverables: [],
      timeline: {
        startDate: new Date(2024, 7, 25),
        expectedCompletionDate: new Date(2024, 9, 25)
      },
      financials: {
        professionalFee: 150000,
        platformFee: 7500,
        gst: 28350,
        reimbursements: 0,
        regulatoryPayouts: 0,
        ope: 0,
        totalAmount: 185850,
        paymentTerms: [],
        moneyReceipts: [],
        feeAdvices: []
      },
      milestones: [
        {
          id: 'milestone-1',
          title: 'Market Research & Analysis',
          description: 'Complete market analysis and competitor research',
          deliveryDate: new Date(2024, 8, 10),
          status: 'pending' as const,
          documents: [],
          comments: []
        }
      ],
      documents: [],
      informationRequests: [],
      teamMembers: [],
      activities: [],
      feeAdvices: [],
      moneyReceipts: [],
      disputes: [],
      feedback: [],
      createdAt: new Date(2024, 7, 25),
      updatedAt: new Date(2024, 7, 25),
      createdByType: 'provider'
    },
    {
      id: 'wo-new-002',
      woNumber: '@TEMP-WO2024004',
      referenceNumber: 'IT-AUDIT-2024',
      type: WorkOrderType.SERVICE_PROVIDER_INITIATED,
      status: WorkOrderStatus.PAYMENT_PENDING,
      serviceRequestId: 'sr-004',
      bidId: 'bid-004',
      serviceSeeker: {
        id: 'seeker-001',
        name: 'ABC Manufacturing Ltd',
        email: 'admin@abcmfg.com',
        address: '123 Industrial Area, Mumbai, Maharashtra 400001',
        pan: 'ABCDE1234F',
        gst: '27ABCDE1234F1Z5'
      },
      serviceProvider: {
        id: 'provider-002',
        name: 'IP Law Consultants',
        email: 'contact@iplawconsultants.com',
        address: '456 Legal District, Delhi, Delhi 110001',
        pan: 'XYZAB5678C',
        gst: '07XYZAB5678C1Z3'
      },
      title: 'IT Infrastructure Audit',
      scopeOfWork: 'Comprehensive IT infrastructure audit including security assessment, compliance review, and recommendations.',
      deliverables: [],
      timeline: {
        startDate: new Date(2024, 7, 24),
        expectedCompletionDate: new Date(2024, 8, 24)
      },
      financials: {
        professionalFee: 200000,
        platformFee: 10000,
        gst: 37800,
        totalAmount: 247800,
        escrowBalance: 0,
        releasedAmount: 0
      },
      milestones: [
        {
          id: 'milestone-1',
          title: 'Infrastructure Assessment',
          description: 'Complete assessment of current IT infrastructure',
          deliveryDate: new Date(2024, 8, 5),
          status: 'pending' as const,
          documents: [],
          comments: []
        }
      ],
      documents: [],
      informationRequests: [],
      teamMembers: [],
      activities: [],
      feeAdvices: [],
      moneyReceipts: [],
      disputes: [],
      feedback: [],
      createdAt: new Date(2024, 7, 24),
      updatedAt: new Date(2024, 7, 24),
      createdByType: 'provider'
    },
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
        moneyReceipts: [
          {
            id: 'mr-001',
            receiptNumber: 'MR2024001',
            date: new Date('2024-01-14'),
            amount: 101350,
            status: PaymentTermStatus.PAID
          },
          {
            id: 'mr-002',
            receiptNumber: 'MR2024002',
            date: new Date('2024-03-12'),
            amount: 101350,
            status: PaymentTermStatus.PAID
          }
        ],
        feeAdvices: [
          {
            id: 'fa-001',
            requestNumber: 'FA-001',
            workOrderId: 'wo-001',
            date: new Date('2024-02-05'),
            amount: 8000,
            description: 'Expedited filing fees',
            status: FeeAdviceStatus.PAID,
            createdBy: 'provider-001'
          },
          {
            id: 'fa-002',
            requestNumber: 'FA-002',
            workOrderId: 'wo-001',
            date: new Date('2024-02-20'),
            amount: 12000,
            description: 'Additional site visit charges',
            status: FeeAdviceStatus.ACCEPTED,
            createdBy: 'provider-001'
          },
          {
            id: 'fa-003',
            requestNumber: 'FA-003',
            workOrderId: 'wo-001',
            date: new Date('2024-02-25'),
            amount: 5000,
            description: 'Extra analysis hours',
            status: FeeAdviceStatus.PENDING,
            createdBy: 'provider-001'
          }
        ]
      },
      documents: [
        // Draft/Working Documents
        {
          id: 'doc-draft-001',
          name: 'Audit_Working_Papers_Draft_v1.pdf',
          label: 'Audit Working Papers - Draft v1',
          url: '/documents/audit-working-papers-draft-v1.pdf',
          uploadedAt: new Date('2024-02-15'),
          uploadedBy: 'provider-001',
          size: 1536000,
          type: 'application/pdf',
          category: 'draft'
        },
        {
          id: 'doc-draft-002',
          name: 'Financial_Analysis_Draft.xlsx',
          label: 'Financial Analysis - Working Document',
          url: '/documents/financial-analysis-draft.xlsx',
          uploadedAt: new Date('2024-02-20'),
          uploadedBy: 'provider-001',
          size: 2048000,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          category: 'working'
        },
        {
          id: 'doc-draft-003',
          name: 'Compliance_Review_Draft_v2.pdf',
          label: 'Compliance Review - Draft v2',
          url: '/documents/compliance-review-draft-v2.pdf',
          uploadedAt: new Date('2024-02-25'),
          uploadedBy: 'provider-001',
          size: 1792000,
          type: 'application/pdf',
          category: 'draft'
        },
        {
          id: 'doc-working-001',
          name: 'Risk_Assessment_Working_Notes.docx',
          label: 'Risk Assessment Working Notes',
          url: '/documents/risk-assessment-working-notes.docx',
          uploadedAt: new Date('2024-02-28'),
          uploadedBy: 'provider-001',
          size: 1024000,
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          category: 'working'
        },
        // Final Documents
        {
          id: 'doc-final-001',
          name: 'Audit_Report_Final.pdf',
          label: 'Final Audit Report',
          url: '/documents/audit-report-final.pdf',
          uploadedAt: new Date('2024-03-10'),
          uploadedBy: 'provider-001',
          size: 2048000,
          type: 'application/pdf',
          category: 'final'
        },
        {
          id: 'doc-final-002',
          name: 'Management_Letter_Final.pdf',
          label: 'Management Letter - Final',
          url: '/documents/management-letter-final.pdf',
          uploadedAt: new Date('2024-03-08'),
          uploadedBy: 'provider-001',
          size: 1024000,
          type: 'application/pdf',
          category: 'final'
        },
        {
          id: 'doc-final-003',
          name: 'Tax_Audit_Report_Final.pdf',
          label: 'Tax Audit Report - Final',
          url: '/documents/tax-audit-report-final.pdf',
          uploadedAt: new Date('2024-03-12'),
          uploadedBy: 'provider-001',
          size: 1536000,
          type: 'application/pdf',
          category: 'final'
        },
        {
          id: 'doc-final-004',
          name: 'Compliance_Certificate_Final.pdf',
          label: 'Compliance Certificate',
          url: '/documents/compliance-certificate-final.pdf',
          uploadedAt: new Date('2024-03-14'),
          uploadedBy: 'provider-001',
          size: 512000,
          type: 'application/pdf',
          category: 'final'
        }
      ],
      milestones: [
        {
          id: 'ms-001',
          title: 'Initial Documentation Review',
          description: 'Review and verify all financial documents and accounting records',
          deliveryDate: new Date('2024-01-25'),
          status: 'completed',
          documents: ['doc-draft-001'],
          comments: [
            {
              id: 'comment-001',
              comment: 'Initial review completed. Need additional documentation for compliance verification.',
              createdAt: new Date('2024-01-25'),
              createdBy: 'provider-001'
            }
          ]
        },
        {
          id: 'ms-002',
          title: 'Detailed Financial Analysis',
          description: 'Perform detailed analysis of financial statements and ratios',
          deliveryDate: new Date('2024-02-15'),
          status: 'completed',
          documents: ['doc-draft-002'],
          comments: [
            {
              id: 'comment-002',
              text: 'Financial analysis completed. Working capital management needs attention.',
              createdAt: new Date('2024-02-15'),
              createdBy: 'provider-001'
            }
          ]
        },
        {
          id: 'ms-003',
          title: 'Compliance and Risk Assessment',
          description: 'Assess compliance with statutory requirements and identify risks',
          deliveryDate: new Date('2024-02-28'),
          status: 'completed',
          documents: ['doc-draft-003', 'doc-working-001'],
          comments: [
            {
              id: 'comment-003',
              comment: 'Compliance issues identified and documented. Recommendations provided.',
              createdAt: new Date('2024-02-28'),
              createdBy: 'provider-001'
            }
          ]
        },
        {
          id: 'ms-004',
          title: 'Final Report Preparation',
          description: 'Prepare final audit report and management letter',
          deliveryDate: new Date('2024-03-15'),
          status: 'completed',
          documents: ['doc-final-001', 'doc-final-002', 'doc-final-003', 'doc-final-004'],
          comments: [
            {
              id: 'comment-004',
              comment: 'Final reports completed and delivered. All issues addressed.',
              createdAt: new Date('2024-03-12'),
              createdBy: 'provider-001'
            }
          ]
        }
      ],
      informationRequests: [
        {
          id: 'ir-001',
          type: 'document',
          title: 'Bank Statements for Q4 2023',
          description: 'Please provide bank statements for all company accounts for the period October-December 2023. Required for cash flow verification and reconciliation.',
          requestedAt: new Date('2024-01-20'),
          requestedBy: 'provider-001',
          status: 'responded',
          response: 'Bank statements for all 3 accounts have been uploaded to the secure document portal. Please find SBI, HDFC, and ICICI statements attached.',
          respondedAt: new Date('2024-01-22')
        },
        {
          id: 'ir-002',
          type: 'document',
          title: 'Fixed Asset Register and Depreciation Schedule',
          description: 'Need complete fixed asset register with depreciation schedules for FY 2023-24. Include purchase invoices for assets acquired during the year.',
          requestedAt: new Date('2024-02-01'),
          requestedBy: 'provider-001',
          status: 'responded',
          response: 'Fixed asset register updated with all acquisitions and disposals. Depreciation schedule prepared as per Companies Act. Purchase invoices for new machinery worth ₹15L attached.',
          respondedAt: new Date('2024-02-05')
        },
        {
          id: 'ir-003',
          type: 'document',
          title: 'GST Returns and Input Tax Credit Details',
          description: 'Require all GST returns filed during FY 2023-24 and detailed ITC reconciliation. Also need explanation for any ITC reversals.',
          requestedAt: new Date('2024-02-10'),
          requestedBy: 'provider-001',
          status: 'pending',
          response: null,
          respondedAt: null
        },
        {
          id: 'ir-004',
          type: 'text',
          title: 'Related Party Transaction Details',
          description: 'Please provide complete details of all related party transactions including contracts, agreements, and pricing justification.',
          requestedAt: new Date('2024-02-15'),
          requestedBy: 'provider-001',
          status: 'overdue',
          response: null,
          respondedAt: null
        },
        {
          id: 'ir-005',
          type: 'document',
          title: 'Employee Provident Fund Compliance',
          description: 'Need PF compliance certificates, contribution details, and any pending litigations or notices from PF authorities.',
          requestedAt: new Date('2024-02-15'),
          requestedBy: 'provider-001',
          status: 'responded',
          response: 'PF compliance is up to date. All monthly contributions made on time. No pending litigations. Compliance certificate from PF consultant attached.',
          respondedAt: new Date('2024-02-25')
        }
      ],
      teamMembers: [],
      activities: [
        {
          id: 'activity-001',
          workOrderId: 'wo-001',
          type: ActivityType.DOCUMENT_UPLOADED,
          description: 'Audit Working Papers - Draft v1 uploaded',
          performedBy: 'provider-001',
          performedByType: 'provider',
          timestamp: new Date('2024-02-15'),
          metadata: { documentId: 'doc-draft-001' }
        },
        {
          id: 'activity-002',
          workOrderId: 'wo-001',
          type: ActivityType.DOCUMENT_UPLOADED,
          description: 'Requested bank statements for Q4 2023',
          performedBy: 'provider-001',
          performedByType: 'provider',
          timestamp: new Date('2024-01-20'),
          metadata: { requestId: 'ir-001' }
        },
        {
          id: 'activity-003',
          workOrderId: 'wo-001',
          type: ActivityType.DOCUMENT_UPLOADED,
          description: 'Bank statements provided by client',
          performedBy: 'seeker-001',
          performedByType: 'seeker',
          timestamp: new Date('2024-01-22'),
          metadata: { requestId: 'ir-001' }
        },
        {
          id: 'activity-004',
          workOrderId: 'wo-001',
          type: ActivityType.WORK_ORDER_CREATED,
          description: 'Initial Documentation Review milestone completed',
          performedBy: 'provider-001',
          performedByType: 'provider',
          timestamp: new Date('2024-01-25'),
          metadata: { milestoneId: 'ms-001' }
        },
        {
          id: 'activity-005',
          workOrderId: 'wo-001',
          type: ActivityType.DOCUMENT_UPLOADED,
          description: 'Financial Analysis - Working Document uploaded',
          performedBy: 'provider-001',
          performedByType: 'provider',
          timestamp: new Date('2024-02-20'),
          metadata: { documentId: 'doc-draft-002' }
        },
        {
          id: 'activity-006',
          workOrderId: 'wo-001',
          type: ActivityType.DOCUMENT_UPLOADED,
          description: 'Final Audit Report uploaded',
          performedBy: 'provider-001',
          performedByType: 'provider',
          timestamp: new Date('2024-03-10'),
          metadata: { documentId: 'doc-final-001' }
        },
        {
          id: 'activity-007',
          workOrderId: 'wo-001',
          type: ActivityType.WORK_ORDER_CREATED,
          description: 'Work order marked as completed',
          performedBy: 'provider-001',
          performedByType: 'provider',
          timestamp: new Date('2024-03-15'),
          metadata: {}
        }
      ],
      feeAdvices: [],
      moneyReceipts: [],
      disputes: [],
      feedback: [],
      signatures: {
        seekerSigned: true,
        seekerSignedAt: new Date('2024-01-15'),
        seekerSignatureType: SignatureType.DIGITAL_SIGNATURE,
        providerSigned: true,
        providerSignedAt: new Date('2024-01-13'),
        providerSignatureType: SignatureType.DIGITAL_SIGNATURE
      },
      createdBy: 'seeker-001',
      createdByType: 'seeker',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-12'),
      completedAt: new Date('2024-03-10'),
      questionnaire: [
        {
          id: 'q-001',
          question: 'What is the nature of your business and primary revenue streams?',
          answer: 'Manufacturing of automotive components with primary revenue from OEM supplies to Maruti, Tata Motors, and Mahindra. Secondary revenue from aftermarket sales.'
        },
        {
          id: 'q-002',
          question: 'Have there been any significant changes in accounting policies during FY 2023-24?',
          answer: 'No significant changes in accounting policies. Continue to follow Indian Accounting Standards (Ind AS) as applicable.'
        },
        {
          id: 'q-003',
          question: 'Are there any pending litigations or contingent liabilities?',
          answer: 'One pending labor dispute worth ₹2.5L and one GST notice under review worth ₹8.5L. Both have been disclosed in notes to accounts.'
        },
        {
          id: 'q-004',
          question: 'Details of any loans, advances, or investments made during the year?',
          answer: 'Term loan of ₹75L taken for machinery purchase. No advances to related parties. Fixed deposits of ₹30L made with SBI and HDFC.'
        }
      ]
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
    },
    // Closed work orders to match IDs used by Closed list view
    {
      id: '1',
      woNumber: 'WO/A-00111123',
      referenceNumber: 'Final Tax Filing FY23',
      type: WorkOrderType.SERVICE_PROVIDER_INITIATED,
      status: WorkOrderStatus.COMPLETED,
      serviceSeeker: {
        id: 'seeker-c1',
        name: 'Acme Industries Pvt Ltd',
        email: 'accounts@acme.com',
        address: 'Plot 21, MIDC, Pune, Maharashtra 411001'
      },
      serviceProvider: {
        id: 'provider-c1',
        name: 'IP Law Consultants',
        email: 'info@iplawconsult.com',
        address: '789 Legal Complex, Bangalore, Karnataka 560002'
      },
      title: 'Legal Due Diligence - Vendor Contracts',
      scopeOfWork: 'Review vendor contracts and prepare due diligence report.',
      deliverables: ['Due Diligence Report'],
      timeline: {
        startDate: new Date('2023-10-01'),
        expectedCompletionDate: new Date('2023-10-20'),
        actualCompletionDate: new Date('2023-10-12')
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
      signatures: { seekerSigned: true, providerSigned: true },
      createdBy: 'provider-c1',
      createdByType: 'provider',
      createdAt: new Date('2023-10-01'),
      updatedAt: new Date('2023-10-12'),
      completedAt: new Date('2023-10-12')
    },
    {
      id: '2',
      woNumber: 'WO/A-00111124',
      referenceNumber: 'ROC Annual Filing 2023',
      type: WorkOrderType.SERVICE_PROVIDER_INITIATED,
      status: WorkOrderStatus.COMPLETED,
      serviceSeeker: {
        id: 'seeker-c2',
        name: 'Blue Ocean Retail Ltd',
        email: 'finance@blueocean.com',
        address: 'Connaught Place, New Delhi 110001'
      },
      serviceProvider: {
        id: 'provider-c2',
        name: 'Legal Associates LLP',
        email: 'contact@legalassoc.com',
        address: '321 Law Street, Delhi, Delhi 110002'
      },
      title: 'ROC Annual Filing',
      scopeOfWork: 'Prepare and file annual returns and financial statements with ROC.',
      deliverables: ['AOC-4', 'MGT-7'],
      timeline: {
        startDate: new Date('2023-11-01'),
        expectedCompletionDate: new Date('2023-11-20'),
        actualCompletionDate: new Date('2023-11-19')
      },
      financials: {
        professionalFee: 30000,
        platformFee: 3000,
        gst: 5940,
        reimbursements: 0,
        regulatoryPayouts: 0,
        ope: 0,
        totalAmount: 38940,
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
      signatures: { seekerSigned: true, providerSigned: true },
      createdBy: 'provider-c2',
      createdByType: 'provider',
      createdAt: new Date('2023-11-01'),
      updatedAt: new Date('2023-11-19'),
      completedAt: new Date('2023-11-19')
    },
    {
      id: '3',
      woNumber: 'WO/A-00111125',
      referenceNumber: 'GST Advisory Q4',
      type: WorkOrderType.SERVICE_SEEKER_INITIATED,
      status: WorkOrderStatus.COMPLETED,
      serviceSeeker: {
        id: 'seeker-c3',
        name: 'Tech Innovations Pvt Ltd',
        email: 'admin@techinnovations.com',
        address: '456 Tech Park, Bangalore, Karnataka 560001'
      },
      serviceProvider: {
        id: 'provider-c3',
        name: 'CA Rajesh Kumar & Associates',
        email: 'rajesh@cakumar.com',
        address: '456 Business District, Mumbai, Maharashtra 400002'
      },
      title: 'GST Advisory',
      scopeOfWork: 'Quarterly GST advisory and compliance review.',
      deliverables: ['Advisory Report'],
      timeline: {
        startDate: new Date('2023-11-10'),
        expectedCompletionDate: new Date('2023-12-05'),
        actualCompletionDate: new Date('2023-12-01')
      },
      financials: {
        professionalFee: 40000,
        platformFee: 4000,
        gst: 7920,
        reimbursements: 0,
        regulatoryPayouts: 0,
        ope: 0,
        totalAmount: 51920,
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
      signatures: { seekerSigned: true, providerSigned: true },
      createdBy: 'seeker-c3',
      createdByType: 'seeker',
      createdAt: new Date('2023-11-10'),
      updatedAt: new Date('2023-12-01'),
      completedAt: new Date('2023-12-01')
    },
    {
      id: '4',
      woNumber: 'WO/A-00111126',
      referenceNumber: 'Compliance Advisory Setup',
      type: WorkOrderType.SERVICE_SEEKER_INITIATED,
      status: WorkOrderStatus.COMPLETED,
      serviceSeeker: {
        id: 'seeker-c4',
        name: 'Gamma Traders',
        email: 'contact@gammatraders.com',
        address: 'MG Road, Bengaluru, Karnataka 560001'
      },
      serviceProvider: {
        id: 'provider-c4',
        name: 'IP Law Consultants',
        email: 'info@iplawconsult.com',
        address: '789 Legal Complex, Bangalore, Karnataka 560002'
      },
      title: 'Compliance Advisory Setup',
      scopeOfWork: 'Set up ongoing compliance advisory framework.',
      deliverables: ['Compliance Framework Document'],
      timeline: {
        startDate: new Date('2023-12-01'),
        expectedCompletionDate: new Date('2023-12-20'),
        actualCompletionDate: new Date('2023-12-18')
      },
      financials: {
        professionalFee: 60000,
        platformFee: 6000,
        gst: 11880,
        reimbursements: 0,
        regulatoryPayouts: 0,
        ope: 0,
        totalAmount: 77880,
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
      signatures: { seekerSigned: true, providerSigned: true },
      createdBy: 'seeker-c4',
      createdByType: 'seeker',
      createdAt: new Date('2023-12-01'),
      updatedAt: new Date('2023-12-18'),
      completedAt: new Date('2023-12-18')
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

  // Update work order status
  async updateWorkOrderStatus(workOrderId: string, status: WorkOrderStatus): Promise<WorkOrder> {
    // Mock implementation - in real app, this would call API
    const workOrder = this.mockWorkOrders.find(wo => wo.id === workOrderId);
    if (workOrder) {
      workOrder.status = status;
    }
    return workOrder!;
  }

  // Get work order statistics for dashboard
  async getWorkOrderStats(userType: 'seeker' | 'provider'): Promise<WorkOrderStats> {
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

  // Fee advice management methods
  async acceptFeeAdvice(workOrderId: string, feeAdviceId: string): Promise<boolean> {
    await this.delay(500);
    const workOrder = this.mockWorkOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) return false;
    
    const feeAdvice = workOrder.financials.feeAdvices.find(fa => fa.id === feeAdviceId);
    if (!feeAdvice) return false;
    
    feeAdvice.status = FeeAdviceStatus.ACCEPTED;
    feeAdvice.reviewedAt = new Date();
    workOrder.updatedAt = new Date();
    return true;
  }

  async rejectFeeAdvice(workOrderId: string, feeAdviceId: string, rejection: { reason: string; modification?: string }): Promise<boolean> {
    await this.delay(500);
    const workOrder = this.mockWorkOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) return false;
    
    const feeAdvice = workOrder.financials.feeAdvices.find(fa => fa.id === feeAdviceId);
    if (!feeAdvice) return false;
    
    feeAdvice.status = FeeAdviceStatus.REJECTED;
    feeAdvice.rejectionReason = rejection.reason;
    feeAdvice.reviewedAt = new Date();
    workOrder.updatedAt = new Date();
    return true;
  }
}

export const workOrderService = new WorkOrderService();

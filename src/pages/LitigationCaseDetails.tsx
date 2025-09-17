import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Plus, 
  User, 
  Users,
  Search,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  Building,
  Trash,
  Pencil,
  Upload,
  FileUp,
  FileDown,
  MoreHorizontal,
  Eye,
  Download,
  Gavel, 
  BookOpen, 
  Bell, 
  MessageSquare, 
  Trash2,
  ExternalLink, 
  Copy, 
  Share, 
  Filter, 
  History, 
  Send,
  Scale,
  Edit
} from 'lucide-react';

interface CaseDetails {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  court: string;
  filedDate: string;
  nextHearing: string;
  plaintiff: string;
  defendant: string;
  lawyer: string;
  lawyerContact: string;
  amount: number;
  description: string;
  
  // AI-powered fields with override capability
  plaintiffDetails: PartyDetails;
  defendantDetails: PartyDetails[];
  adjudicatingAuthority: string;
  filedUnder: string;
  dateOfFiling: string;
  eFilingReceiptDate: string;
  hearingDates: HearingDate[];
  finalOrderDate: string | null;
  applicationParticulars: string;
  prayerReliefSought: string;
  
  // AI extraction metadata
  aiExtractionStatus: {
    plaintiff: AIExtractionStatus;
    defendant: AIExtractionStatus;
    authority: AIExtractionStatus;
    filedUnder: AIExtractionStatus;
    particulars: AIExtractionStatus;
    prayer: AIExtractionStatus;
  };
  
  // User override flags
  userOverrides: {
    plaintiff: boolean;
    defendant: boolean;
    authority: boolean;
    filedUnder: boolean;
    dateOfFiling: boolean;
    hearingDates: boolean;
    particulars: boolean;
    prayer: boolean;
  };
  
  // Stage 2 specific fields
  applicationStatus: string;
  particulars: string;
  reliefSought: string;
  interimOrders: InterimOrder[];
  finalOrder: FinalOrder | null;
  replies: Reply[];
  
  documents: Document[];
  hearings: Hearing[];
  notes: Note[];
  costs: Cost[];
  auditLog: AuditEntry[];
}

interface PartyDetails {
  name: string;
  address: string;
  contactInfo: string;
  representedBy: string;
  aiExtracted: boolean;
  lastUpdated: string;
}

interface HearingDate {
  id: string;
  date: string;
  time: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'postponed' | 'cancelled';
  outcome?: string;
  nextDate?: string;
  source: 'nclt_website' | 'manual' | 'e_filing';
}

interface AIExtractionStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidence: number;
  lastExtracted: string;
  source: 'pdf_application' | 'e_filing_receipt' | 'nclt_website';
}

interface InterimOrder {
  id: string;
  date: string;
  time: string;
  description: string;
  orderCopy: string;
  briefSummary: string;
  status: 'pending' | 'complied' | 'appealed';
  source: 'nclt_website' | 'manual_upload';
  aiGenerated: boolean;
}

interface FinalOrder {
  date: string;
  time: string;
  description: string;
  orderCopy: string;
  briefSummary: string;
  outcome: 'favorable' | 'unfavorable' | 'partial';
  source: 'nclt_website' | 'manual_upload';
  aiGenerated: boolean;
}

interface Reply {
  id: string;
  submittingParty: string;
  partyType: 'plaintiff' | 'defendant' | 'intervener' | 'other';
  document: string;
  documentType: 'reply' | 'rejoinder' | 'counter_reply' | 'affidavit' | 'other';
  date: string;
  summary: string;
  status: 'filed' | 'pending' | 'rejected';
  uploadedBy: string;
}

interface LawyerDetails {
  name: string;
  specialization: string;
  contact: string;
  email: string;
  address: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  url: string;
  category: string;
}

interface Hearing {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  outcome: string;
  nextDate: string;
  attendees: string[];
  // Added fields for view and download functionality
  noticeDocument?: string;
  orderDocument?: string;
  minutesDocument?: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  date: string;
  time: string;
}

interface Cost {
  id: string;
  type: string;
  amount: number;
  date: string;
  description: string;
}

interface AuditEntry {
  id: string;
  date: string;
  time: string;
  action: string;
  description: string; // System Comment
  actionee: string;
}

const LitigationCaseDetails = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("case-details");
  const [newNote, setNewNote] = useState("");
  // Stage 2 Application Filing Status management
  const applicationStatusOptions = [
    'Filed, under scrutiny',
    'Defects raised',
    'Defects rectified, under scrutiny',
    'Defect free, pending numbering',
    'Numbering done',
    'Pending adjudication',
    'Final hearing done'
  ] as const;
  type ApplicationStatusType = typeof applicationStatusOptions[number];
  const [thirdPartyStatus, setThirdPartyStatus] = useState<ApplicationStatusType>('Filed, under scrutiny');
  const [applicationStatusManualOverride, setApplicationStatusManualOverride] = useState<boolean>(false);
  const [lastStatusSyncedAt, setLastStatusSyncedAt] = useState<string>('');
  // Identifiers fetched from court portals
  const [portalIdentifiers, setPortalIdentifiers] = useState<{ applicationNumber: string; fileNumber: string }>({ applicationNumber: '', fileNumber: '' });

  // Mock data - replace with actual API calls
  const [caseDetails, setCaseDetails] = useState<CaseDetails>({
    id: "ac-001",
    caseNumber: "CP(IB)-123/MB/2025",
    title: "Acme Corporation Ltd vs Beta Industries Pvt Ltd",
    status: "numbered",
    court: "NCLT Mumbai",
    filedDate: "2024-12-05",
    nextHearing: "2025-02-20",
    plaintiff: "Acme Corporation Ltd",
    defendant: "Beta Industries Pvt Ltd, ABC Suppliers",
    lawyer: "Adv. Rajesh Sharma",
    lawyerContact: "+91-98765-43210",
    amount: 2500000,
    description: "Corporate insolvency resolution process under Section 7 of IBC 2016",
    
    // AI-powered fields with comprehensive data
    plaintiffDetails: {
      name: "Acme Corporation Limited",
      address: "Plot No. 45, Industrial Area, Phase-II, Chandigarh - 160002",
      contactInfo: "Phone: +91-172-2345678, Email: legal@acmecorp.com",
      representedBy: "Adv. Rajesh Sharma, Senior Advocate",
      aiExtracted: true,
      lastUpdated: "2024-12-05T10:30:00Z"
    },
    
    defendantDetails: [
      {
        name: "Beta Industries Private Limited",
        address: "Sector 18, Industrial Complex, Gurgaon, Haryana - 122015",
        contactInfo: "Phone: +91-124-4567890, Email: info@betaindustries.com",
        representedBy: "Adv. Priya Mehta, Advocate",
        aiExtracted: true,
        lastUpdated: "2024-12-05T10:30:00Z"
      },
      {
        name: "ABC Suppliers Private Limited",
        address: "Block B, Commercial Complex, Noida, UP - 201301",
        contactInfo: "Phone: +91-120-9876543, Email: legal@abcsuppliers.com",
        representedBy: "Adv. Suresh Kumar, Advocate",
        aiExtracted: true,
        lastUpdated: "2024-12-05T10:30:00Z"
      }
    ],
    
    adjudicatingAuthority: "Hon'ble Justice A.K. Sharma, NCLT Mumbai Bench",
    filedUnder: "Insolvency and Bankruptcy Code, 2016 - Section 7 (Financial Creditor)",
    dateOfFiling: "2024-12-05",
    eFilingReceiptDate: "2024-12-05",
    finalOrderDate: null,
    
    applicationParticulars: "The Applicant, Acme Corporation Limited, is a financial creditor of the Corporate Debtor, Beta Industries Private Limited. The Corporate Debtor has defaulted in repayment of financial debt amounting to Rs. 25,00,000/- (Rupees Twenty-Five Lakhs only) along with interest. Despite repeated demands and notices, the Corporate Debtor has failed to clear the outstanding dues. The Applicant seeks initiation of Corporate Insolvency Resolution Process under Section 7 of the Insolvency and Bankruptcy Code, 2016.",
    
    prayerReliefSought: "a) Admit the present application and initiate Corporate Insolvency Resolution Process against the Corporate Debtor; b) Appoint an Interim Resolution Professional; c) Declare moratorium under Section 14 of the IBC, 2016; d) Direct the Corporate Debtor to provide all books of accounts and records; e) Any other relief deemed fit and proper by this Hon'ble Tribunal.",
    
    hearingDates: [
      {
        id: "hd-001",
        date: "2024-12-20",
        time: "10:30 AM",
        purpose: "First Hearing - Admission of Application",
        status: "completed",
        outcome: "Application taken on record, notice issued to respondents",
        nextDate: "2025-01-15",
        source: "nclt_website"
      },
      {
        id: "hd-002",
        date: "2025-01-15",
        time: "11:00 AM",
        purpose: "Reply Hearing and Arguments",
        status: "completed",
        outcome: "Application admitted, IRP appointed, moratorium declared",
        nextDate: "2025-02-20",
        source: "nclt_website"
      },
      {
        id: "hd-003",
        date: "2025-02-20",
        time: "2:30 PM",
        purpose: "Progress Review and Status Update",
        status: "scheduled",
        source: "nclt_website"
      }
    ],
    
    // AI extraction status tracking
    aiExtractionStatus: {
      plaintiff: { status: "completed", confidence: 0.95, lastExtracted: "2024-12-05T10:30:00Z", source: "pdf_application" },
      defendant: { status: "completed", confidence: 0.92, lastExtracted: "2024-12-05T10:30:00Z", source: "pdf_application" },
      authority: { status: "completed", confidence: 0.98, lastExtracted: "2024-12-05T10:30:00Z", source: "pdf_application" },
      filedUnder: { status: "completed", confidence: 0.97, lastExtracted: "2024-12-05T10:30:00Z", source: "pdf_application" },
      particulars: { status: "completed", confidence: 0.89, lastExtracted: "2024-12-05T10:30:00Z", source: "pdf_application" },
      prayer: { status: "completed", confidence: 0.91, lastExtracted: "2024-12-05T10:30:00Z", source: "pdf_application" }
    },
    
    // User override tracking
    userOverrides: {
      plaintiff: false,
      defendant: false,
      authority: false,
      filedUnder: false,
      dateOfFiling: false,
      hearingDates: false,
      particulars: false,
      prayer: false
    },
    
    // Stage 2 specific data
    applicationStatus: "numbered",
    particulars: "Application for initiation of Corporate Insolvency Resolution Process against Beta Industries Pvt Ltd under Section 7 of the Insolvency and Bankruptcy Code, 2016 for default in payment of financial debt amounting to Rs. 25,00,000/-",
    reliefSought: "Initiation of CIRP against the Corporate Debtor, appointment of Interim Resolution Professional, moratorium on legal proceedings, and recovery of outstanding dues",
    
    interimOrders: [
      {
        id: "io-001",
        date: "2025-01-10",
        time: "11:30 AM",
        description: "Interim order for admission of application and appointment of IRP",
        orderCopy: "/documents/interim-order-001.pdf",
        briefSummary: "The Tribunal admitted the application under Section 7 of IBC, 2016 and appointed CA Suresh Kumar as Interim Resolution Professional. Moratorium declared under Section 14. All pending legal proceedings stayed.",
        status: "complied",
        source: "nclt_website",
        aiGenerated: true
      },
      {
        id: "io-002",
        date: "2025-01-25",
        time: "2:15 PM",
        description: "Order for extension of CIRP period by 90 days",
        orderCopy: "/documents/interim-order-002.pdf",
        briefSummary: "Upon application by the Resolution Professional, the Tribunal granted extension of Corporate Insolvency Resolution Process by 90 days as per Section 12(3) of IBC, 2016. New timeline: 270 days from commencement date.",
        status: "pending",
        source: "nclt_website",
        aiGenerated: true
      }
    ],
    
    finalOrder: {
      date: "2025-03-15",
      time: "11:30 AM",
      description: "Final Order on Corporate Insolvency Resolution Process",
      outcome: "favorable",
      briefSummary: "Application admitted, CIRP initiated successfully, IRP appointed with moratorium declared",
      orderCopy: "/documents/final-order.pdf",
      source: "nclt_website",
      aiGenerated: true
    },
    
    replies: [
      {
        id: "rp-001",
        submittingParty: "Beta Industries Pvt Ltd",
        partyType: "defendant",
        document: "/documents/reply-001.pdf",
        documentType: "reply",
        date: "2025-01-15",
        summary: "Reply contesting the application with objections on maintainability and quantum of debt. Respondent argues that the debt is disputed and the application is premature.",
        status: "filed",
        uploadedBy: "Adv. Priya Mehta"
      },
      {
        id: "rp-002",
        submittingParty: "ABC Suppliers",
        partyType: "defendant",
        document: "/documents/reply-002.pdf",
        documentType: "reply",
        date: "2025-01-18",
        summary: "Supporting reply as operational creditor with additional claims. Respondent supports the application and claims operational debt of Rs. 5,00,000/-.",
        status: "filed",
        uploadedBy: "Adv. Suresh Kumar"
      },
      {
        id: "rp-003",
        submittingParty: "Acme Corporation Ltd",
        partyType: "plaintiff",
        document: "/documents/rejoinder-001.pdf",
        documentType: "rejoinder",
        date: "2025-01-22",
        summary: "Rejoinder to the reply filed by Beta Industries. Applicant refutes all objections and provides additional evidence of debt default.",
        status: "filed",
        uploadedBy: "Adv. Rajesh Sharma"
      }
    ],
    
    documents: [
      {
        id: "doc-001",
        name: "Application Copy",
        type: "application",
        uploadDate: "2024-12-05",
        size: "2.5 MB",
        url: "/documents/application.pdf",
        category: "Primary Documents"
      },
      {
        id: "doc-002",
        name: "Board Resolution for Filing",
        type: "supporting",
        uploadDate: "2024-12-05",
        size: "1.2 MB",
        url: "/documents/board-resolution.pdf",
        category: "Supporting Documents"
      },
      {
        id: "doc-003",
        name: "Audited Financial Statements",
        type: "financial",
        uploadDate: "2024-12-06",
        size: "3.8 MB",
        url: "/documents/financial-statements.pdf",
        category: "Financial Documents"
      },
      {
        id: "doc-004",
        name: "Demand Notice and Acknowledgment",
        type: "legal",
        uploadDate: "2024-12-07",
        size: "0.8 MB",
        url: "/documents/demand-notice.pdf",
        category: "Legal Documents"
      },
      {
        id: "doc-005",
        name: "Certificate of Incorporation",
        type: "corporate",
        uploadDate: "2024-12-08",
        size: "0.5 MB",
        url: "/documents/incorporation-cert.pdf",
        category: "Corporate Documents"
      }
    ],
    
    hearings: [
      {
        id: "hearing-001",
        date: "2024-12-20",
        time: "10:30 AM",
        type: "First Hearing - Admission",
        status: "completed",
        outcome: "Application taken on record, notice issued to respondents",
        nextDate: "2025-01-15",
        attendees: ["Adv. Rajesh Sharma", "Adv. Priya Mehta (Respondent)"],
        noticeDocument: "/documents/notice-001.pdf",
        orderDocument: "/documents/order-001.pdf",
        minutesDocument: "/documents/minutes-001.pdf"
      },
      {
        id: "hearing-002",
        date: "2025-01-15",
        time: "11:00 AM",
        type: "Reply Hearing",
        status: "completed",
        outcome: "Application admitted, IRP appointed, moratorium declared",
        nextDate: "2025-02-20",
        attendees: ["Adv. Rajesh Sharma", "Adv. Priya Mehta", "IRP - CA Suresh Kumar"],
        noticeDocument: "/documents/notice-002.pdf",
        orderDocument: "/documents/order-002.pdf",
        minutesDocument: "/documents/minutes-002.pdf"
      },
      {
        id: "hearing-003",
        date: "2025-02-20",
        time: "2:30 PM",
        type: "Progress Review",
        status: "scheduled",
        outcome: "",
        nextDate: "",
        attendees: ["Adv. Rajesh Sharma", "IRP - CA Suresh Kumar"],
        noticeDocument: "/documents/notice-003.pdf"
      }
    ],
    
    notes: [
      {
        id: "note-001",
        content: "Client emphasized the urgency of the matter. Need to expedite proceedings.",
        author: "Adv. Sharma",
        date: "2025-01-20",
        time: "3:45 PM"
      },
      {
        id: "note-002",
        content: "Interim relief application to be filed by next hearing. Documents ready.",
        author: "Legal Team",
        date: "2025-01-18",
        time: "11:20 AM"
      }
    ],
    
    costs: [
      {
        id: "cost-001",
        type: "drafting",
        amount: 25000,
        date: "2024-12-05",
        description: "Drafting of application and supporting documents"
      },
      {
        id: "cost-002",
        type: "filing",
        amount: 15000,
        date: "2024-12-05",
        description: "Filing fees for application and supporting documents"
      },
      {
        id: "cost-003",
        type: "appearances",
        amount: 85000,
        date: "2025-01-15",
        description: "Appearance fees for first hearing"
      }
    ],
    
    auditLog: [
      {
        id: "audit-001",
        date: "2024-12-05",
        time: "10:00 AM",
        action: "Application filed",
        description: "Application for initiation of CIRP filed against Beta Industries Pvt Ltd",
        actionee: "System"
      },
      {
        id: "audit-002",
        date: "2024-12-10",
        time: "11:00 AM",
        action: "Notice issued",
        description: "Notice issued to respondents for first hearing",
        actionee: "System"
      },
      {
        id: "audit-003",
        date: "2025-01-15",
        time: "12:00 PM",
        action: "First hearing",
        description: "First hearing held, application admitted, IRP appointed",
        actionee: "Court"
      }
    ]
  });

  // Manual status selected (for override)
  const [manualStatusSelected, setManualStatusSelected] = useState<ApplicationStatusType>(
    ((applicationStatusOptions as readonly string[]).includes(caseDetails.applicationStatus)
      ? (caseDetails.applicationStatus as ApplicationStatusType)
      : 'Filed, under scrutiny')
  );
  useEffect(() => {
    const next = ((applicationStatusOptions as readonly string[]).includes(caseDetails.applicationStatus)
      ? (caseDetails.applicationStatus as ApplicationStatusType)
      : 'Filed, under scrutiny');
    setManualStatusSelected(next);
  }, [caseDetails.applicationStatus]);

  // Local state derived from case details
  const [notes, setNotes] = useState(caseDetails.notes);
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingParties, setEditingParties] = useState(false);
  const [draftDetails, setDraftDetails] = useState({
    status: caseDetails.status,
    filedUnder: caseDetails.filedUnder || "",
    adjudicatingAuthority: caseDetails.adjudicatingAuthority,
    nextHearing: caseDetails.nextHearing,
    court: caseDetails.court,
    amount: caseDetails.amount,
  });
  const [draftParties, setDraftParties] = useState({
    plaintiff: caseDetails.plaintiff,
    defendant: caseDetails.defendant,
  });

  // Helpers
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // AI Processing and NCLT Integration Functions
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isLoadingNCLT, setIsLoadingNCLT] = useState(false);
  
  // Simulate AI PDF extraction
  const extractFromPDF = async (field: string) => {
    setIsProcessingAI(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI extraction results
    const mockExtractions = {
      plaintiff: {
        name: "Acme Corporation Limited (AI Extracted)",
        address: "Plot No. 45, Industrial Area, Phase-II, Chandigarh - 160002 (AI Extracted)",
        contactInfo: "Phone: +91-172-2345678, Email: legal@acmecorp.com (AI Extracted)",
        representedBy: "Adv. Rajesh Sharma, Senior Advocate (AI Extracted)"
      },
      defendant: [
        {
          name: "Beta Industries Private Limited (AI Extracted)",
          address: "Sector 18, Industrial Complex, Gurgaon, Haryana - 122015 (AI Extracted)",
          contactInfo: "Phone: +91-124-4567890, Email: info@betaindustries.com (AI Extracted)",
          representedBy: "Adv. Priya Mehta, Advocate (AI Extracted)"
        }
      ],
      authority: "Hon'ble Justice A.K. Sharma, NCLT Mumbai Bench (AI Extracted)",
      filedUnder: "Insolvency and Bankruptcy Code, 2016 - Section 7 (Financial Creditor) (AI Extracted)",
      particulars: "AI has analyzed the PDF and extracted: The Applicant seeks initiation of CIRP under Section 7 of IBC, 2016 against the Corporate Debtor for default in financial debt of Rs. 25,00,000/-. (AI Extracted)",
      prayer: "AI Summary: a) Admit application for CIRP; b) Appoint IRP; c) Declare moratorium; d) Provide books of accounts; e) Other reliefs. (AI Extracted)"
    };
    
    // Update case details with AI extracted data
    setCaseDetails(prev => {
      const updated = { ...prev };
      
      if (field === 'plaintiff' && mockExtractions.plaintiff) {
        updated.plaintiffDetails = {
          ...mockExtractions.plaintiff,
          aiExtracted: true,
          lastUpdated: new Date().toISOString()
        };
        updated.aiExtractionStatus.plaintiff = {
          status: 'completed',
          confidence: 0.95,
          lastExtracted: new Date().toISOString(),
          source: 'pdf_application'
        };
      }
      
      if (field === 'defendant' && mockExtractions.defendant) {
        updated.defendantDetails = mockExtractions.defendant.map(d => ({
          ...d,
          aiExtracted: true,
          lastUpdated: new Date().toISOString()
        }));
        updated.aiExtractionStatus.defendant = {
          status: 'completed',
          confidence: 0.92,
          lastExtracted: new Date().toISOString(),
          source: 'pdf_application'
        };
      }
      
      if (field === 'authority') {
        updated.adjudicatingAuthority = mockExtractions.authority;
        updated.aiExtractionStatus.authority = {
          status: 'completed',
          confidence: 0.98,
          lastExtracted: new Date().toISOString(),
          source: 'pdf_application'
        };
      }
      
      if (field === 'filedUnder') {
        updated.filedUnder = mockExtractions.filedUnder;
        updated.aiExtractionStatus.filedUnder = {
          status: 'completed',
          confidence: 0.97,
          lastExtracted: new Date().toISOString(),
          source: 'pdf_application'
        };
      }
      
      if (field === 'particulars') {
        updated.applicationParticulars = mockExtractions.particulars;
        updated.aiExtractionStatus.particulars = {
          status: 'completed',
          confidence: 0.89,
          lastExtracted: new Date().toISOString(),
          source: 'pdf_application'
        };
      }
      
      if (field === 'prayer') {
        updated.prayerReliefSought = mockExtractions.prayer;
        updated.aiExtractionStatus.prayer = {
          status: 'completed',
          confidence: 0.91,
          lastExtracted: new Date().toISOString(),
          source: 'pdf_application'
        };
      }
      
      return updated;
    });
    
    setIsProcessingAI(false);
    addCaseAudit(`AI Extraction - ${field}`, `AI successfully extracted ${field} information from PDF application`, 'AI System');
    toast({ title: 'AI Extraction Complete', description: `Successfully extracted ${field} information from PDF` });
  };
  
  // Simulate NCLT/NCLAT website integration
  const syncFromNCLTWebsite = async () => {
    setIsLoadingNCLT(true);
    
    // Simulate API call to NCLT website
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock NCLT data
    const mockNCLTData = {
      hearingDates: [
        {
          id: "hd-004",
          date: "2025-03-15",
          time: "10:00 AM",
          purpose: "Final Arguments and Judgment",
          status: "scheduled" as const,
          source: "nclt_website" as const
        }
      ],
      interimOrders: [
        {
          id: "io-003",
          date: "2025-02-01",
          time: "3:00 PM",
          description: "Order regarding asset verification",
          orderCopy: "/documents/interim-order-003.pdf",
          briefSummary: "Tribunal directed the IRP to complete asset verification within 15 days and submit detailed report. All stakeholders to cooperate in the process.",
          status: "pending" as const,
          source: "nclt_website" as const,
          aiGenerated: true
        }
      ]
    };
    
    setCaseDetails(prev => ({
      ...prev,
      hearingDates: [...prev.hearingDates, ...mockNCLTData.hearingDates],
      interimOrders: [...prev.interimOrders, ...mockNCLTData.interimOrders]
    }));
    
    setIsLoadingNCLT(false);
    addCaseAudit('NCLT Sync', 'Successfully synced latest hearing dates and orders from NCLT website', 'NCLT Integration');
    toast({ title: 'NCLT Sync Complete', description: 'Latest hearing dates and orders synced from NCLT website' });
  };
  
  // Toggle user override for specific fields
  const toggleUserOverride = (field: keyof typeof caseDetails.userOverrides) => {
    setCaseDetails(prev => ({
      ...prev,
      userOverrides: {
        ...prev.userOverrides,
        [field]: !prev.userOverrides[field]
      }
    }));
    
    addCaseAudit('User Override', `User override ${caseDetails.userOverrides[field] ? 'disabled' : 'enabled'} for ${field}`, 'User');
  };
  
  // Auto-sync on mount and periodically (simulated)
  useEffect(() => {
    // Initial fetch
    syncStatusFromPortals();
    // Periodic sync every 30 minutes (simulation)
    const interval = setInterval(() => {
      syncStatusFromPortals();
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  // re-create interval if manual override toggles (so we respect not overriding while enabled)
  }, [applicationStatusManualOverride]);

  // Audit helper for case status actions
  const addCaseAudit = (action: string, description: string, actionee: string = 'You') => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    setCaseDetails(prev => ({
      ...prev,
      auditLog: [
        { id: `audit-${Date.now()}`, date, time, action, description, actionee },
        ...prev.auditLog,
      ],
    }));
  };

  // Simulate pulling status from third-party portals
  const syncStatusFromPortals = () => {
    // Simulate a fetched status rotation for demo
    const idx = Math.floor(Math.random() * applicationStatusOptions.length);
    const fetched = applicationStatusOptions[idx];
    setThirdPartyStatus(fetched);
    setLastStatusSyncedAt(new Date().toLocaleString('en-IN'));
    // Simulate identifiers fetched from the court portal
    const mockAppNo = `APP-${Math.floor(100000 + Math.random() * 900000)}`; // e.g., APP-654321
    const mockFileNo = `EFIL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`; // e.g., EFIL-2025-4823
    setPortalIdentifiers({ applicationNumber: mockAppNo, fileNumber: mockFileNo });
    // If not overridden, also apply to case details
    if (!applicationStatusManualOverride) {
      setCaseDetails(prev => ({ ...prev, applicationStatus: fetched }));
    }
    toast({ title: 'Status Synced', description: `Fetched latest status from portals: ${fetched}` });
  };
  
  // Get AI confidence badge color
  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Format AI extraction timestamp
  const formatAITimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handlers for editing details
  const saveDetails = () => {
    setCaseDetails(prev => ({
      ...prev,
      status: draftDetails.status,
      filedUnder: draftDetails.filedUnder,
      adjudicatingAuthority: draftDetails.adjudicatingAuthority,
      nextHearing: draftDetails.nextHearing,
      court: draftDetails.court,
      amount: Number(draftDetails.amount) || 0,
    }));
    setEditingDetails(false);
    toast({ title: 'Details Updated', description: 'Case details saved successfully.' });
  };

  const cancelDetails = () => {
    setDraftDetails({
      status: caseDetails.status,
      filedUnder: caseDetails.filedUnder || "",
      adjudicatingAuthority: caseDetails.adjudicatingAuthority,
      nextHearing: caseDetails.nextHearing,
      court: caseDetails.court,
      amount: caseDetails.amount,
    });
    setEditingDetails(false);
  };

  // Handlers for editing parties
  const saveParties = () => {
    setCaseDetails(prev => ({
      ...prev,
      plaintiff: draftParties.plaintiff,
      defendant: draftParties.defendant,
    }));
    setEditingParties(false);
    toast({ title: 'Parties Updated', description: 'Parties information saved successfully.' });
  };

  const cancelParties = () => {
    setDraftParties({ plaintiff: caseDetails.plaintiff, defendant: caseDetails.defendant });
    setEditingParties(false);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'scheduled':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">Pending</Badge>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <Badge variant="destructive" className="text-xs">Critical</Badge>
          </div>
        );
      case 'won':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <Badge variant="outline" className="text-xs border-green-200 text-green-700">Won</Badge>
          </div>
        );
      case 'lost':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <Badge variant="outline" className="text-xs border-red-200 text-red-700">Lost</Badge>
          </div>
        );
      case 'awaiting-docs':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700">Awaiting Docs</Badge>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <Badge variant="secondary" className="text-xs">{status}</Badge>
          </div>
        );
    }
  };

  // Aggregate costs summary
  const costsSummary = React.useMemo(() => {
    const totals = caseDetails.costs.reduce((acc, c) => {
      acc.total += c.amount;
      if (c.type in acc.byType) {
        acc.byType[c.type] += c.amount;
      } else {
        acc.byType[c.type] = c.amount;
      }
      return acc;
    }, { total: 0, byType: {} as Record<string, number> });
    return totals;
  }, [caseDetails.costs]);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: `note-${Date.now()}`,
      content: newNote,
      author: "You",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      })
    };
    
    setNotes(prev => [note, ...prev]);
    setNewNote("");
    
    toast({
      title: "Note Added",
      description: "Your note has been added to the case.",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/litigation')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Litigation List
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Case: {caseDetails.caseNumber}
          </div>
        </div>

        {/* Case Header */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Scale className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold">{caseDetails.caseNumber} - {caseDetails.title}</h1>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Status:</span>
                      {getStatusBadge(caseDetails.status)}
                    </div>
                    <span>Filed: {formatDate(caseDetails.filedDate)}</span>
                    <span>Priority: High</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span>Next Hearing: {caseDetails.nextHearing ? formatDate(caseDetails.nextHearing) + ', 10:30 AM' : 'Not scheduled'}</span>
                    <span>Court: {caseDetails.court}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(caseDetails.amount)}</div>
                  <div className="text-sm text-muted-foreground">Claim Amount</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="case-details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Case Details
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="replies" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Replies
            </TabsTrigger>
            <TabsTrigger value="remarks" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Remarks
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="costs" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Costs
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Audit
            </TabsTrigger>
          </TabsList>

          {/* Case Details Tab */}
          <TabsContent value="case-details" className="space-y-6">
            {/* Application Filing Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Application Filing Status
                </CardTitle>
                <CardDescription>System auto-syncs status from court/tribunal portals. You may manually overwrite if needed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Current Status (in system)</Label>
                    <div className="text-sm font-medium">{caseDetails.applicationStatus || '—'}</div>
                    {lastStatusSyncedAt && (
                      <div className="text-xs text-muted-foreground">Last synced: {lastStatusSyncedAt}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Court Portal (latest fetched)</Label>
                    <div className="text-sm">{thirdPartyStatus}</div>
                    {(portalIdentifiers.applicationNumber || portalIdentifiers.fileNumber) && (
                      <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                        {portalIdentifiers.applicationNumber && (
                          <div>
                            Application No.: <span className="font-medium text-foreground">{portalIdentifiers.applicationNumber}</span>
                          </div>
                        )}
                        {portalIdentifiers.fileNumber && (
                          <div>
                            File No.: <span className="font-medium text-foreground">{portalIdentifiers.fileNumber}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <Button size="sm" variant="outline" className="mt-1" onClick={() => {
                        syncStatusFromPortals();
                        addCaseAudit('Status sync', 'Fetched status from court portals');
                      }}>Pull from Court Portals</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="override-status" checked={applicationStatusManualOverride} onCheckedChange={(v) => setApplicationStatusManualOverride(Boolean(v))} />
                      <Label htmlFor="override-status">Manually override status</Label>
                    </div>
                    <Select disabled={!applicationStatusManualOverride} value={manualStatusSelected} onValueChange={(v) => setManualStatusSelected(v as ApplicationStatusType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {applicationStatusOptions.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={!applicationStatusManualOverride} onClick={() => {
                        setCaseDetails(prev => ({ ...prev, applicationStatus: manualStatusSelected }));
                        addCaseAudit('Manual status set', `Status set to: ${manualStatusSelected}`);
                        toast({ title: 'Status Updated', description: `Application status overwritten to "${manualStatusSelected}".` });
                      }}>Apply Manual Status</Button>
                      {applicationStatusManualOverride && (
                        <Button size="sm" variant="outline" onClick={() => {
                          setApplicationStatusManualOverride(false);
                          // Restore to last fetched when disabling override
                          setCaseDetails(prev => ({ ...prev, applicationStatus: thirdPartyStatus }));
                          addCaseAudit('Manual override removed', 'Reverted to synced status');
                          toast({ title: 'Override Disabled', description: 'Reverted to status from court portals.' });
                        }}>Disable Override</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!editingDetails ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-muted-foreground">Application Filed:</Label>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Yes</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">E-filing Receipt:</Label>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Uploaded</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Status:</Label>
                          <div className="mt-1">{getStatusBadge(caseDetails.status)}</div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Filed Under:</Label>
                          <p>{caseDetails.filedUnder}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-muted-foreground">Adjudicating Authority:</Label>
                          <p>{caseDetails.adjudicatingAuthority}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => setEditingDetails(true)}>
                          <Edit className="h-3 w-3" />
                          Edit Details
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <Label>Status</Label>
                          <Select value={draftDetails.status} onValueChange={(v) => setDraftDetails(d => ({ ...d, status: v }))}>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                              <SelectItem value="won">Won</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                              <SelectItem value="awaiting-docs">Awaiting Docs</SelectItem>
                              <SelectItem value="numbered">Numbered</SelectItem>
                              <SelectItem value="pending-adjudication">Pending Adjudication</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label>Filed Under</Label>
                          <Input value={draftDetails.filedUnder} onChange={(e) => setDraftDetails(d => ({ ...d, filedUnder: e.target.value }))} />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label>Adjudicating Authority</Label>
                          <Input value={draftDetails.adjudicatingAuthority} onChange={(e) => setDraftDetails(d => ({ ...d, adjudicatingAuthority: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                          <Label>Next Hearing</Label>
                          <Input type="date" value={draftDetails.nextHearing} onChange={(e) => setDraftDetails(d => ({ ...d, nextHearing: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                          <Label>Court</Label>
                          <Input value={draftDetails.court} onChange={(e) => setDraftDetails(d => ({ ...d, court: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                          <Label>Claim Amount</Label>
                          <Input type="number" value={draftDetails.amount} onChange={(e) => setDraftDetails(d => ({ ...d, amount: Number(e.target.value) }))} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveDetails}>Save</Button>
                        <Button size="sm" variant="outline" onClick={cancelDetails}>Cancel</Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Parties Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Parties Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!editingParties ? (
                    <>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-muted-foreground">Plaintiff/Appellant:</Label>
                          <p className="font-medium">• {caseDetails.plaintiff}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Defendant/Respondent:</Label>
                          <div className="space-y-1">
                            {caseDetails.defendant.split(', ').map((party, index) => (
                              <p key={index} className="font-medium">• {party}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => setEditingParties(true)}>
                          <Edit className="h-3 w-3" />
                          Edit Parties
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label>Plaintiff/Appellant</Label>
                          <Input value={draftParties.plaintiff} onChange={(e) => setDraftParties(p => ({ ...p, plaintiff: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                          <Label>Defendant/Respondent (comma-separated)</Label>
                          <Textarea value={draftParties.defendant} onChange={(e) => setDraftParties(p => ({ ...p, defendant: e.target.value }))} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveParties}>Save</Button>
                        <Button size="sm" variant="outline" onClick={cancelParties}>Cancel</Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Documents & Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents & Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Primary: Application Copy & E-filing Receipt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Copy of Application Filed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline">Upload PDF</Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Version History:</div>
                    <ul className="mt-1 text-sm list-disc ml-6 space-y-1">
                      <li>v3 • 12 Jan 2025 • Updated annexures</li>
                      <li>v2 • 08 Jan 2025 • Added board resolution</li>
                      <li>v1 • 05 Dec 2024 • Initial upload</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">E-filing Receipt Copy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline">Upload PDF</Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Version History:</div>
                    <ul className="mt-1 text-sm list-disc ml-6 space-y-1">
                      <li>v2 • 05 Dec 2024 • Re-uploaded stamped copy</li>
                      <li>v1 • 05 Dec 2024 • Initial upload</li>
                    </ul>
                  </div>
                </div>

                {/* All documents list */}
                {caseDetails.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(doc.uploadDate)} • {doc.size} • {doc.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Plus className="h-3 w-3" />
                    Add Document
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <History className="h-3 w-3" />
                    Document History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hearing Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Hearing Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {caseDetails.hearings.map((hearing) => (
                    <div key={hearing.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">
                              {formatDate(hearing.date)} at {hearing.time}
                            </span>
                            {hearing.status === 'scheduled' && (
                              <Badge className="bg-blue-100 text-blue-800">Next</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{hearing.type}</p>
                          {hearing.outcome && (
                            <p className="text-sm text-green-600 font-medium">
                              Outcome: {hearing.outcome}
                            </p>
                          )}
                        </div>
                        
                        {/* Only show View and Download buttons for completed hearings */}
                        {hearing.status === 'completed' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                             
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                // Download the primary document
                                const docUrl = hearing.orderDocument || hearing.noticeDocument || hearing.minutesDocument;
                                if (docUrl) {
                                  const link = document.createElement('a');
                                  link.href = docUrl;
                                  link.download = `hearing_${hearing.date}.pdf`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  addCaseAudit('Downloaded hearing document', `Hearing on ${formatDate(hearing.date)}`);
                                }
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Plus className="h-3 w-3" />
                    Add Hearing
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Full Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Final Order */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Final Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {caseDetails.finalOrder ? (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Gavel className="h-4 w-4 text-green-600" />
                          <span className="font-medium">
                            {formatDate(caseDetails.finalOrder.date)} at {caseDetails.finalOrder.time}
                          </span>
                          <Badge className={`${
                            caseDetails.finalOrder.outcome === 'favorable' ? 'bg-green-100 text-green-800' :
                            caseDetails.finalOrder.outcome === 'unfavorable' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {caseDetails.finalOrder.outcome === 'favorable' ? 'Favorable' :
                             caseDetails.finalOrder.outcome === 'unfavorable' ? 'Unfavorable' : 'Partial'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{caseDetails.finalOrder.description}</p>
                        {caseDetails.finalOrder.briefSummary && (
                          <p className="text-sm text-green-600 font-medium">
                            Summary: {caseDetails.finalOrder.briefSummary}
                          </p>
                        )}
                      </div>
                      
                      {/* View and Download buttons for final order */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            if (caseDetails.finalOrder?.orderCopy) {
                              const link = document.createElement('a');
                              link.href = caseDetails.finalOrder.orderCopy;
                              link.download = `final_order_${caseDetails.finalOrder.date}.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              addCaseAudit('Downloaded final order document', `Final order dated ${formatDate(caseDetails.finalOrder.date)}`);
                            }
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Gavel className="h-4 w-4" />
                      <span className="text-sm">Final order pending - case is still under adjudication</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legal Team & Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Legal Team & Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Primary Lawyer:</Label>
                    <p className="font-medium">• {caseDetails.lawyer}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{caseDetails.lawyerContact}</span>
                    </div>
                  </div>
                  {/* Additional lawyer details can be populated when available */}
                  <div>
                    <Label className="text-muted-foreground">Total Costs Incurred:</Label>
                    <p className="text-lg font-semibold">{formatCurrency(costsSummary.total)}</p>
                    <div className="text-sm text-muted-foreground">
                      Drafting: {formatCurrency(costsSummary.byType['drafting'] || 0)} • Filing: {formatCurrency(costsSummary.byType['filing'] || 0)} • Appearances: {formatCurrency(costsSummary.byType['appearances'] || 0)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3" />
                    View Detailed Costs
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Manage Legal Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Replies Tab */}
          <TabsContent value="replies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Replies/Rejoinders Filed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add reply */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>Submitting Party</Label>
                    <Input placeholder="e.g., Beta Industries Pvt Ltd" />
                  </div>
                  <div className="space-y-1">
                    <Label>Upload Document (PDF)</Label>
                    <Input type="file" accept=".pdf" />
                  </div>
                  <div className="space-y-1 md:col-span-3">
                    <Label>Short Description</Label>
                    <Textarea placeholder="Write short description / summary" />
                  </div>
                  <div className="md:col-span-3">
                    <Button size="sm">Add Reply</Button>
                  </div>
                </div>

                <Separator />

                {/* Replies list */}
                <div className="space-y-3">
                  {caseDetails.replies.map(r => (
                    <div key={r.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{r.submittingParty}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(r.date)}</div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{r.summary}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Remarks Tab */}
          <TabsContent value="remarks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Case Notes & Remarks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Note */}
                <div className="space-y-3">
                  <Label htmlFor="new-note">Add New Note:</Label>
                  <Textarea
                    id="new-note"
                    placeholder="Enter your note or remark about this case..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button onClick={addNote} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Note
                  </Button>
                </div>

                <Separator />

                {/* Existing Notes */}
                <div className="space-y-3">
                  <h4 className="font-medium">Previous Notes:</h4>
                  {notes.map((note) => (
                    <Card key={note.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="text-sm">{note.content}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>By: {note.author}</span>
                            <span>{formatDate(note.date)} at {note.time}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>AI-assisted Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <Label className="text-muted-foreground">Particulars of the application:</Label>
                  <p className="mt-1">{caseDetails.particulars}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prayer / Relief sought:</Label>
                  <p className="mt-1">{caseDetails.reliefSought}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Key Relief /Prayer sought:</Label>
                  <p className="mt-1">Admission of application</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">AI Summary (from PDFs):</Label>
                  <ul className="mt-1 list-disc ml-6 space-y-1">
                    <li>Application filed under {caseDetails.filedUnder}</li>
                    <li>Respondents: {caseDetails.defendant}</li>
                    <li>Adjudicating authority: {caseDetails.adjudicatingAuthority}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications & Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 border rounded-lg bg-blue-50 text-blue-700">
                  Upcoming hearing on {formatDate(caseDetails.nextHearing)} — reminders scheduled 7 and 1 days prior.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg">
                    <Label className="text-muted-foreground">Custom Reminder</Label>
                    <div className="mt-2 flex gap-2">
                      <Input type="date" />
                      <Button size="sm">Set Reminder</Button>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Label className="text-muted-foreground">Follow-up with Lawyer</Label>
                    <div className="mt-2 flex gap-2">
                      <Input placeholder="Frequency (days)" className="w-40" />
                      <Button size="sm">Schedule</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Head</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Bill</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {caseDetails.costs.map(c => (
                        <TableRow key={c.id}>
                          <TableCell className="capitalize">{c.type}</TableCell>
                          <TableCell>{formatCurrency(c.amount)}</TableCell>
                          <TableCell>{formatDate(c.date)}</TableCell>
                          <TableCell>{c.description}</TableCell>
                          <TableCell><Button size="sm" variant="outline">Upload</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Add Cost Item</Button>
                  <Button size="sm" variant="outline">Monthly Charges</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>System Comment</TableHead>
                        <TableHead>Actionee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {caseDetails.auditLog.map(a => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.action}</TableCell>
                          <TableCell className="whitespace-nowrap">{a.date} • {a.time}</TableCell>
                          <TableCell>{a.description}</TableCell>
                          <TableCell>{a.actionee || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Email Lawyer
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Schedule Call
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Set Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LitigationCaseDetails;

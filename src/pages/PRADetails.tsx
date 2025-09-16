import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  Eye,
  Edit,
  FileText,
  Calendar,
  Clock,
  Users,
  Building,
  Mail,
  Phone,
  DollarSign,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  Shield,
  Info,
  Save,
  Send,
  Target,
  Zap,
  FileCheck
} from 'lucide-react';

interface PRAData {
  id: string;
  praName: string;
  groupType: 'standalone' | 'group';
  entityType: 'company' | 'partnership' | 'individual';
  submissionDate: string;
  submissionSource: 'platform' | 'manual';
  eoiSubmissionDate?: string;
  email: string;
  contactNo: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  complianceScore: number;
  section29ACompliance: boolean;
  documents: Document[];
  queries: Query[];
  financialInfo: FinancialInfo;
  evaluationData?: EvaluationData;
}

interface EvaluationData {
  aiEvaluationEnabled: boolean;
  eligibilityStatus: 'pending' | 'eligible' | 'ineligible' | 'conditional';
  evaluationDate?: string;
  evaluatedBy: 'ai' | 'manual' | 'hybrid';
  provisionalReports: ProvisionalReport[];
  savedReports: SavedReport[];
  objections?: ObjectionEntry[];
}

interface ProvisionalReport {
  id: string;
  name: string;
  generatedDate: string;
  status: 'draft' | 'final' | 'circulated';
  customization: ReportCustomization;
  data: ReportData[];
  circulation?: CirculationData;
}

interface ReportCustomization {
  selectedFields: string[];
  fieldOrder: string[];
  sortBy?: string;
  sortDirection: 'asc' | 'desc';
  filters: Record<string, string | number | boolean>;
  layout: 'horizontal' | 'vertical';
}

interface ReportData {
  praId: string;
  praName: string;
  entityType: string;
  complianceStatus: string;
  section29AStatus: string;
  eligiblitycreator: 'Yes' | 'No';
  financialStatus: string;
  documentsStatus: string;
  remarks?: string;
}

interface SavedReport {
  id: string;
  name: string;
  format: 'pdf' | 'excel' | 'docx';
  savedDate: string;
  isSigned: boolean;
  signatureDetails?: SignatureDetails;
  filePath: string;
}

interface SignatureDetails {
  fullName: string;
  organization: string;
  address: string;
  email: string;
  phone: string;
  signedDate: string;
  signatureType: 'digital' | 'electronic';
}

interface CirculationData {
  circulatedDate: string;
  praNotifications: NotificationStatus[];
  cocNotifications: NotificationStatus[];
  objectionDeadline?: string;
  autoEmailEnabled: boolean;
}

// === CoC Objection Types ===
interface ObjectionVersion {
  timestamp: string;
  user: string;
  changes: string;
}

interface ObjectionEntry {
  id: string;
  cocMemberId: string;
  cocMemberName: string;
  praId: string;
  praName: string;
  receivedDate: string; // auto-captured
  details: string; // objection details
  response?: string; // response from PRA / platform
  includeInFinal?: 'yes' | 'no' | null;
  remarks?: string;
  status: 'pending' | 'approved' | 'rejected';
  history: ObjectionVersion[];
  updatedAt: string;
}

interface NotificationStatus {
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  sentDate: string;
  status: 'sent' | 'delivered' | 'read' | 'responded';
  objections?: string[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'submitted' | 'verified' | 'rejected';
  uploadDate: string;
  size: string;
  remarks?: string;
}

interface Query {
  id: string;
  question: string;
  response?: string;
  status: 'pending' | 'answered';
  createdAt: string;
  createdBy: 'system' | 'user';
  priority: 'low' | 'medium' | 'high';
}

interface FinancialInfo {
  netWorth: number;
  annualTurnover: number;
  liquidAssets: number;
  creditRating: string;
  bankGuarantee: number;
  emdAmount: number;
}

const PRADetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [newQuery, setNewQuery] = useState('');
  const [queryPriority, setQueryPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSelected, setIsSelected] = useState<boolean>(false);
  
  // Evaluation states
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);
  const [showReportCustomization, setShowReportCustomization] = useState(false);
  const [showCirculationDialog, setShowCirculationDialog] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [showObjectionDialog, setShowObjectionDialog] = useState(false);
  const [showObjectionHistory, setShowObjectionHistory] = useState(false);
  const [historyObjection, setHistoryObjection] = useState<ObjectionEntry | null>(null);
  const [currentReport, setCurrentReport] = useState<ProvisionalReport | null>(null);
  const [selectedReportForSigning, setSelectedReportForSigning] = useState<ProvisionalReport | null>(null);
  // Selection state for rows in the Report View dialog
  const [selectedReportRows, setSelectedReportRows] = useState<number[]>([]);
  // Separate dialog for viewing Saved Reports (read-only)
  const [savedReportView, setSavedReportView] = useState<ProvisionalReport | null>(null);
  // Circulation state
  const [autoEmailEnabled, setAutoEmailEnabled] = useState<boolean>(true);
  const [objectionDeadline, setObjectionDeadline] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [emailSubject, setEmailSubject] = useState<string>('Provisional PRA Eligibility Report - Review Required');
  const [emailBody, setEmailBody] = useState<string>(
    'Dear Recipient,\n\nPlease find attached the Provisional Eligibility Report for review. You may raise objections by the specified deadline if required.\n\nRegards,\nResolution Authority'
  );
  const [includeObjectionLink, setIncludeObjectionLink] = useState<boolean>(true);
  const [includePlatformLink, setIncludePlatformLink] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState({
    fullName: 'John Doe',
    organization: 'Resolution Authority',
    address: '123 Business District, Mumbai',
    email: 'john.doe@authority.com',
    phone: '+91-9876543210'
  });

  // === CoC Objection Handlers ===
  const recordObjectionHistory = (entry: ObjectionEntry, change: string, user: string = 'System') => {
    const now = new Date();
    const ts = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    return { ...entry, history: [...entry.history, { timestamp: ts, user, changes: change }], updatedAt: ts };
  };

  // Helper: save a report as draft (placeholder for API integration)
  const saveReportAsDraft = (reportId: string) => {
    setPraData(prev => {
      const reports = prev.evaluationData?.provisionalReports || [];
      const updated = reports.map(r => {
        if (r.id !== reportId) return r;
        if (r.status === 'final' || r.status === 'circulated') return r; // cannot draft finalized/circulated
        return { ...r, status: 'draft' as const };
      });
      return { ...prev, evaluationData: { ...prev.evaluationData!, provisionalReports: updated, savedReports: prev.evaluationData!.savedReports } };
    });
    toast({ title: 'Saved as Draft', description: 'Report marked as draft.' });
  };

  // Helper: download report (placeholder)
  const downloadReport = (report: ProvisionalReport, format: 'pdf' | 'excel' | 'docx' = 'pdf') => {
    toast({ title: 'Download Started', description: `Downloading ${report.name}.${format}` });
  };

  

  const updateObjectionField = (
    id: string,
    field: keyof ObjectionEntry,
    value: string | null | 'yes' | 'no'
  ) => {
    setPraData(prev => {
      const entries = prev.evaluationData?.objections || [];
      const updated = entries.map(e => {
        if (e.id !== id) return e;
        const before = e[field] as unknown as string | null | 'yes' | 'no';
        let next = { ...e, [field]: value } as ObjectionEntry;
        if (before !== value) {
          const change = `Updated ${String(field)}: ${before ?? '—'} → ${value ?? '—'}`;
          next = recordObjectionHistory(next, change, e.cocMemberName);
        }
        return next;
      });
      return { ...prev, evaluationData: { ...prev.evaluationData!, objections: updated, provisionalReports: prev.evaluationData!.provisionalReports, savedReports: prev.evaluationData!.savedReports } };
    });
  };

  const approveObjection = (id: string) => {
    setPraData(prev => {
      const entries = prev.evaluationData?.objections || [];
      const updated = entries.map(e => e.id === id ? recordObjectionHistory({ ...e, status: 'approved', includeInFinal: 'yes' }, 'Marked Approved') : e);
      return { ...prev, evaluationData: { ...prev.evaluationData!, objections: updated, provisionalReports: prev.evaluationData!.provisionalReports, savedReports: prev.evaluationData!.savedReports } };
    });
    toast({ title: 'Objection Approved', description: 'Marked for inclusion in final list' });
  };

  const rejectObjection = (id: string) => {
    setPraData(prev => {
      const entries = prev.evaluationData?.objections || [];
      const updated = entries.map(e => e.id === id ? recordObjectionHistory({ ...e, status: 'rejected', includeInFinal: 'no' }, 'Marked Rejected') : e);
      return { ...prev, evaluationData: { ...prev.evaluationData!, objections: updated, provisionalReports: prev.evaluationData!.provisionalReports, savedReports: prev.evaluationData!.savedReports } };
    });
    toast({ title: 'Objection Rejected', description: 'Excluded from final list' });
  };

  const exportObjectionsCSV = () => {
    const entries = praData.evaluationData?.objections || [];
    const header = ['CoC Member','PRA Name','Received','Details','Response','Include In Final','Remarks','Status','Updated At'];
    const rows = entries.map(e => [e.cocMemberName, e.praName, e.receivedDate, (e.details||'').replace(/\n/g,' '), (e.response||'').replace(/\n/g,' '), e.includeInFinal ?? '', e.remarks ?? '', e.status, e.updatedAt]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'coc_objections.csv'; a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export Started', description: 'Downloading CoC objections CSV' });
  };

  const printObjectionsPDF = () => {
    // Mock: trigger print of the section; in real, render to PDF
    window.print();
    toast({ title: 'Print Triggered', description: 'Use your browser to save as PDF' });
  };

  const sendObjectionReminders = () => {
    toast({ title: 'Reminders Sent', description: 'Reminder emails queued to pending CoC members' });
  };
  const [reportCustomization, setReportCustomization] = useState<ReportCustomization>({
    selectedFields: ['praName', 'entityType', 'complianceStatus', 'section29AStatus', 'eligiblitycreator'],
    fieldOrder: ['praName', 'entityType', 'complianceStatus', 'section29AStatus', 'eligiblitycreator'],
    sortBy: 'praName',
    sortDirection: 'asc',
    filters: {},
    layout: 'horizontal'
  });

  // Mock: additional PRAs to include in generated provisional report
  const mockOtherPRAs: ReportData[] = [
    {
      praId: '2',
      praName: 'Strategic Investments Ltd.',
      entityType: 'company',
      complianceStatus: 'Needs Review',
      section29AStatus: 'Compliant',
      eligiblitycreator: 'Yes',
      financialStatus: 'Partially Verified',
      documentsStatus: '7/8 Verified',
      remarks: 'Subject to query resolution'
    },
    {
      praId: '3',
      praName: 'Alpha Capital Partners',
      entityType: 'partnership',
      complianceStatus: 'Compliant',
      section29AStatus: 'Compliant',
      eligiblitycreator: 'Yes',
      financialStatus: 'Verified',
      documentsStatus: '9/9 Verified'
    },
    {
      praId: '4',
      praName: 'Nova Resolutions Inc.',
      entityType: 'company',
      complianceStatus: 'Needs Review',
      section29AStatus: 'Non-Compliant',
      eligiblitycreator: 'Yes',
      financialStatus: 'Partially Verified',
      documentsStatus: '6/8 Verified',
      remarks: '29A clarification pending'
    }
  ];

  // Mock PRA data
  const [praData, setPraData] = useState<PRAData>({
    id: '1',
    praName: 'Resolution Partners LLC',
    groupType: 'standalone',
    entityType: 'company',
    submissionDate: '2024-02-10',
    submissionSource: 'platform',
    eoiSubmissionDate: '2024-02-10',
    evaluationData: {
      aiEvaluationEnabled: true,
      eligibilityStatus: 'eligible',
      evaluationDate: '2024-02-15',
      evaluatedBy: 'ai',
      provisionalReports: [
        {
          id: 'report-001',
          name: 'Provisional Report - Resolution Partners LLC - 2/15/2024',
          generatedDate: '2024-02-15',
          status: 'circulated',
          customization: {
            selectedFields: ['praName', 'entityType', 'complianceStatus', 'section29AStatus', 'eligiblitycreator', 'financialStatus'],
            fieldOrder: ['praName', 'entityType', 'complianceStatus', 'section29AStatus', 'eligiblitycreator', 'financialStatus'],
            sortBy: 'praName',
            sortDirection: 'asc',
            filters: {},
            layout: 'horizontal'
          },
          data: [
            {
              praId: '1',
              praName: 'Resolution Partners LLC',
              entityType: 'Company',
              complianceStatus: 'Compliant',
              section29AStatus: 'Compliant',
              eligiblitycreator: 'Yes',
              financialStatus: 'Verified',
              documentsStatus: '8/8 Verified',
              remarks: 'All requirements met'
            }
          ],
          circulation: {
            circulatedDate: '2024-02-15',
            praNotifications: [
              {
                recipientId: '1',
                recipientName: 'Resolution Partners LLC',
                recipientEmail: 'contact@resolutionpartners.com',
                sentDate: '2024-02-15',
                status: 'read'
              }
            ],
            cocNotifications: [
              {
                recipientId: 'coc-1',
                recipientName: 'State Bank of India',
                recipientEmail: 'coc.sbi@bank.com',
                sentDate: '2024-02-15',
                status: 'delivered'
              },
              {
                recipientId: 'coc-2',
                recipientName: 'HDFC Bank Ltd',
                recipientEmail: 'coc.hdfc@bank.com',
                sentDate: '2024-02-15',
                status: 'sent'
              }
            ],
            objectionDeadline: '2024-02-22',
            autoEmailEnabled: true
          }
        }
      ],
      objections: [
        {
          id: 'obj-001',
          cocMemberId: 'coc-1',
          cocMemberName: 'John Doe',
          praId: '1',
          praName: 'Resolution Partners LLC',
          receivedDate: '2024-02-14',
          details: 'Concerns about the financial capacity and previous track record of the PRA',
          response: '',
          includeInFinal: null,
          remarks: '',
          status: 'pending',
          history: [
            { timestamp: '2024-02-14 10:05', user: 'John Doe', changes: 'Objection submitted' }
          ],
          updatedAt: '2024-02-14 10:05'
        },
        {
          id: 'obj-002',
          cocMemberId: 'coc-2',
          cocMemberName: 'Jane Smith',
          praId: '1',
          praName: 'Strategic Investments Ltd.',
          receivedDate: '2024-02-15',
          details: 'Incomplete documentation - missing consortium agreement',
          response: '',
          includeInFinal: null,
          remarks: '',
          status: 'pending',
          history: [
            { timestamp: '2024-02-15 15:22', user: 'Jane Smith', changes: 'Objection submitted' }
          ],
          updatedAt: '2024-02-15 15:22'
        }
      ],
      savedReports: []
    },
    email: 'contact@resolutionpartners.com',
    contactNo: '+91-9876543210',
    status: 'under-review',
    complianceScore: 100,
    section29ACompliance: true,
    documents: [
      {
        id: '1',
        name: 'EOI Letter Signed by PRAs.pdf',
        type: 'EOI Letter',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '2.5 MB',
        remarks: 'All signatures verified'
      },
      {
        id: '2',
        name: 'Certificate of Incorporation.pdf',
        type: 'Incorporation Certificate',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '1.2 MB'
      },
      {
        id: '3',
        name: 'Audited Financial Statements.pdf',
        type: 'Financial Statements',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '5.8 MB'
      },
      {
        id: '4',
        name: 'Net Worth Certificate.pdf',
        type: 'Net Worth Certificate',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '0.8 MB'
      },
      {
        id: '5',
        name: 'Section 29A Compliance Certificate.pdf',
        type: 'Compliance Certificate',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '1.5 MB',
        remarks: 'Section 29A compliance confirmed'
      },
      {
        id: '6',
        name: 'Board Resolution for EOI.pdf',
        type: 'Board Resolution',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '0.9 MB'
      },
      {
        id: '7',
        name: 'KYC Documents - Directors.pdf',
        type: 'KYC Documents',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '3.2 MB'
      },
      {
        id: '8',
        name: 'Experience Certificate - Resolution.pdf',
        type: 'Experience Certificate',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '1.1 MB',
        remarks: '5+ years resolution experience documented'
      }
    ],
    queries: [
      {
        id: '1',
        question: 'Please clarify the proposed timeline for debt restructuring',
        response: 'We propose a 24-month restructuring timeline with quarterly milestones',
        status: 'answered',
        createdAt: '2024-02-11',
        createdBy: 'user',
        priority: 'high'
      },
      {
        id: '2',
        question: 'Provide additional details on consortium members and their roles',
        status: 'pending',
        createdAt: '2024-02-13',
        createdBy: 'system',
        priority: 'medium'
      }
    ],
    financialInfo: {
      netWorth: 50000000,
      annualTurnover: 120000000,
      liquidAssets: 25000000,
      creditRating: 'AA-',
      bankGuarantee: 5000000,
      emdAmount: 1000000
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'submitted': { variant: 'secondary' as const, label: 'Submitted', icon: FileText },
      'under-review': { variant: 'default' as const, label: 'Under Review', icon: RefreshCw },
      'approved': { variant: 'default' as const, label: 'Approved', icon: CheckCircle },
      'rejected': { variant: 'destructive' as const, label: 'Rejected', icon: XCircle },
      'verified': { variant: 'default' as const, label: 'Verified', icon: CheckCircle },
      'pending': { variant: 'secondary' as const, label: 'Pending', icon: Clock },
      'answered': { variant: 'default' as const, label: 'Answered', icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || FileText;
    return (
      <Badge variant={config?.variant || 'secondary'} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config?.label || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'high': { variant: 'destructive' as const, label: 'High' },
      'medium': { variant: 'default' as const, label: 'Medium' },
      'low': { variant: 'secondary' as const, label: 'Low' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge variant={config?.variant || 'secondary'}>{config?.label || priority}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAddQuery = () => {
    if (!newQuery.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a query",
        variant: "destructive"
      });
      return;
    }

    const query: Query = {
      id: Date.now().toString(),
      question: newQuery,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'user',
      priority: queryPriority
    };

    setPraData(prev => ({
      ...prev,
      queries: [...prev.queries, query]
    }));

    setNewQuery('');
    setShowQueryDialog(false);

    toast({
      title: "Success",
      description: "Query added successfully"
    });
  };

  const handleStatusUpdate = (newStatus: string) => {
    setPraData(prev => ({
      ...prev,
      status: newStatus as PRAData['status']
    }));

    toast({
      title: "Success",
      description: "PRA status updated successfully"
    });
  };

  // ===== Validation cycle: generates observations as system queries =====
  const generateValidationObservations = (): Query[] => {
    const terms = {
      notarised: [/notar/i],
      letterHead: [/letter\s*head/i, /on\s+letterhead/i],
      authorityLetter: [/authority\s*letter/i, /authori[sz]ation\s+letter/i],
      stampPaper: [/stamp\s*paper/i],
      signed: [/signed/i, /signature/i]
    };

    const matchesAny = (text: string, regs: RegExp[]) => regs.some(r => r.test(text));
    const docsText = (praData.documents || []).map(d => `${d.name} ${d.type} ${d.remarks || ''}`).join(' | ');

    const observations: string[] = [];
    if (!matchesAny(docsText, terms.notarised)) observations.push('Notarised copies appear to be missing. Please provide notarised versions where required.');
    if (!matchesAny(docsText, terms.letterHead)) observations.push('Documents on official Letter Head are not detected. Ensure required documents are on letter head.');
    if (!matchesAny(docsText, terms.authorityLetter)) observations.push('Authority Letter/Authorization Letter not detected. Please upload the appropriate authorization.');
    if (!matchesAny(docsText, terms.stampPaper)) observations.push('Execution on Stamp Paper not detected where applicable. Please provide executed copies.');
    if (!matchesAny(docsText, terms.signed)) observations.push('Signed/Signature markers not detected. Ensure all required documents are duly signed/stamped.');

    // Generic check for prohibitive 'NOT' wording per IBC undertakings (best-effort placeholder)
    observations.push('Kindly verify undertakings do not contain prohibitive "NOT" clauses that invalidate commitments.');

    const now = new Date().toISOString().split('T')[0];
    return observations.map((obs, idx) => ({
      id: `val-${Date.now()}-${idx}`,
      question: obs,
      status: 'pending',
      createdAt: now,
      createdBy: 'system',
      priority: 'medium'
    }));
  };

  const runValidationAndRecord = (decision: 'yes' | 'no') => {
    const newObs = generateValidationObservations();
    setPraData(prev => {
      // remove previous validation observations
      const filtered = prev.queries.filter(q => !q.id.startsWith('val-'));
      const extraNote: Query[] = decision === 'no' ? [{
        id: `val-${Date.now()}-decision`,
        question: 'Selection marked as No. Please record reasons and communicate to PRA as needed.',
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'system',
        priority: 'low'
      }] : [];
      return { ...prev, queries: [...filtered, ...newObs, ...extraNote] };
    });
    toast({ title: 'Validation Completed', description: `${newObs.length} observation(s) added to Queries.` });
  };

  // ===== Evaluation Functions =====
  const handleAIEvaluation = async () => {
    setLoading(true);
    
    // Simulate AI evaluation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const evalScore = Math.floor(Math.random() * 40) + 60; // 60-100 (internal use)
    const eligibilityStatus = evalScore >= 80 ? 'eligible' : evalScore >= 60 ? 'conditional' : 'ineligible';
    
    setPraData(prev => ({
      ...prev,
      evaluationData: {
        ...prev.evaluationData!,
        eligibilityStatus: eligibilityStatus as 'eligible' | 'conditional' | 'ineligible',
        evaluationDate: new Date().toISOString().split('T')[0],
        evaluatedBy: 'ai'
      }
    }));
    
    setLoading(false);
    toast({
      title: 'AI Evaluation Complete',
      description: `PRA evaluated as ${eligibilityStatus}. Eligibility: ${eligibilityStatus === 'eligible' ? 'Yes' : 'No'}`
    });
  };

  const handleManualEvaluation = () => {
    setPraData(prev => ({
      ...prev,
      evaluationData: {
        ...prev.evaluationData!,
        eligibilityStatus: 'eligible',
        evaluationDate: new Date().toISOString().split('T')[0],
        evaluatedBy: 'manual'
      }
    }));
    
    toast({
      title: 'Manual Evaluation',
      description: 'PRA marked as eligible for manual review'
    });
  };

  const generateProvisionalReport = () => {
    const baseRow: ReportData = {
      praId: praData.id,
      praName: praData.praName,
      entityType: praData.entityType,
      complianceStatus: praData.complianceScore >= 80 ? 'Compliant' : 'Needs Review',
      section29AStatus: praData.section29ACompliance ? 'Compliant' : 'Non-Compliant',
      eligiblitycreator: 'Yes',
      financialStatus: 'Verified',
      documentsStatus: `${praData.documents.filter(d => d.status === 'verified').length}/${praData.documents.length} Verified`,
      remarks: praData.evaluationData?.eligibilityStatus === 'conditional' ? 'Subject to query resolution' : undefined
    };
    const reportData: ReportData[] = [baseRow, ...mockOtherPRAs];

    const uniqueNames = Array.from(new Set(reportData.map(r => r.praName)));
    const primaryName = uniqueNames[0] || praData.praName;
    const suffix = uniqueNames.length > 1 ? ` + ${uniqueNames.length - 1} other${uniqueNames.length - 1 > 1 ? 's' : ''}` : '';
    const displayName = `${primaryName}${suffix}`;

    const newReport: ProvisionalReport = {
      id: Date.now().toString(),
      name: `Provisional Report - ${displayName} - ${new Date().toLocaleDateString()}`,
      generatedDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      customization: { ...reportCustomization },
      data: reportData
    };

    setPraData(prev => ({
      ...prev,
      evaluationData: {
        ...prev.evaluationData!,
        provisionalReports: [...prev.evaluationData!.provisionalReports, newReport]
      }
    }));

    setCurrentReport(newReport);
    toast({
      title: 'Report Generated',
      description: 'Provisional eligibility report created successfully'
    });
  };

  

  const saveToSavedReports = (report: ProvisionalReport, format: 'pdf' | 'excel' | 'docx', isSigned: boolean = false, signatureDetails?: SignatureDetails) => {
    const savedReport: SavedReport = {
      id: Date.now().toString(),
      name: report.name,
      format,
      savedDate: new Date().toISOString().split('T')[0],
      isSigned,
      signatureDetails,
      filePath: `/reports/${report.id}.${format}`
    };

    // Save to Reports Library and mark the corresponding provisional report as 'final'
    setPraData(prev => ({
      ...prev,
      evaluationData: {
        ...prev.evaluationData!,
        savedReports: [...prev.evaluationData!.savedReports, savedReport],
        provisionalReports: prev.evaluationData!.provisionalReports.map(r =>
          r.id === report.id ? { ...r, status: 'final' } : r
        )
      }
    }));

    toast({
      title: 'Report Finalized',
      description: `Report finalized and saved to Reports Library${isSigned ? ' with signature' : ''}`
    });
  };

  const validateProfileForSigning = () => {
    const { fullName, organization, address, email, phone } = userProfile;
    const missingFields = [];
    if (!fullName) missingFields.push('Full Name');
    if (!organization) missingFields.push('Organization');
    if (!address) missingFields.push('Address');
    if (!email) missingFields.push('Email');
    if (!phone) missingFields.push('Phone');
    
    return missingFields;
  };

  const handleDigitalSignature = (signatureType: 'digital' | 'electronic') => {
    const missingFields = validateProfileForSigning();
    
    if (missingFields.length > 0) {
      toast({
        title: 'Profile Incomplete',
        description: `Please complete: ${missingFields.join(', ')}`,
        variant: 'destructive'
      });
      return;
    }

    if (selectedReportForSigning) {
      const signatureDetails: SignatureDetails = {
        fullName: userProfile.fullName,
        organization: userProfile.organization,
        address: userProfile.address,
        email: userProfile.email,
        phone: userProfile.phone,
        signedDate: new Date().toISOString().split('T')[0],
        signatureType
      };

      saveToSavedReports(selectedReportForSigning, 'pdf', true, signatureDetails);
      setShowSignatureDialog(false);
      setSelectedReportForSigning(null);
      
      toast({
        title: 'Document Signed',
        description: `Report signed with ${signatureType} signature, Shared with the COC And PRA Members`
      });
    }
  };

  const updateReportCustomization = (field: string, checked: boolean) => {
    setReportCustomization(prev => {
      const selectedFields = checked 
        ? [...prev.selectedFields, field]
        : prev.selectedFields.filter(f => f !== field);
      
      return {
        ...prev,
        selectedFields,
        fieldOrder: selectedFields
      };
    });
  };

  const applyCustomization = () => {
    if (currentReport) {
      const updatedReport = {
        ...currentReport,
        customization: { ...reportCustomization }
      };
      
      setPraData(prev => ({
        ...prev,
        evaluationData: {
          ...prev.evaluationData!,
          provisionalReports: prev.evaluationData!.provisionalReports.map(r =>
            r.id === currentReport.id ? updatedReport : r
          )
        }
      }));
      
      setCurrentReport(updatedReport);
      setShowReportCustomization(false);
      
      toast({
        title: 'Customization Applied',
        description: 'Report layout updated successfully'
      });
    }
  };

  const circulateReport = (
    report: ProvisionalReport,
    options: {
      autoEmailEnabled: boolean;
      objectionDeadline: string;
      emailSubject: string;
      emailBody: string;
      includeObjectionLink: boolean;
      includePlatformLink: boolean;
    }
  ) => {
    const circulation: CirculationData = {
      circulatedDate: new Date().toISOString().split('T')[0],
      praNotifications: [{
        recipientId: praData.id,
        recipientName: praData.praName,
        recipientEmail: praData.email,
        sentDate: new Date().toISOString().split('T')[0],
        status: 'sent'
      }],
      cocNotifications: [
        {
          recipientId: 'coc-1',
          recipientName: 'CoC Member 1',
          recipientEmail: 'coc1@example.com',
          sentDate: new Date().toISOString().split('T')[0],
          status: 'sent'
        }
      ],
      objectionDeadline: options.objectionDeadline,
      autoEmailEnabled: options.autoEmailEnabled
    };

    setPraData(prev => ({
      ...prev,
      evaluationData: {
        ...prev.evaluationData!,
        provisionalReports: prev.evaluationData!.provisionalReports.map(r =>
          r.id === report.id ? { ...r, status: 'circulated', circulation } : r
        )
      }
    }));

    toast({
      title: 'Report Circulated',
      description: `Emails ${options.autoEmailEnabled ? 'auto-sent' : 'prepared for manual review'}; objections due by ${circulation.objectionDeadline}`
    });
  };

  const availableFields = [
    { id: 'praName', label: 'PRA Name' },
    { id: 'entityType', label: 'Entity Type' },
    { id: 'complianceStatus', label: 'Compliance Status' },
    { id: 'section29AStatus', label: 'Section 29A Status' },
    { id: 'eligiblitycreator', label: 'Eligibility creator' },
    { id: 'financialStatus', label: 'Financial Status' },
    { id: 'documentsStatus', label: 'Documents Status' },
    { id: 'remarks', label: 'Remarks' }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate(`/resolution/eoi/${id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to EOI Details
            </Button>
            {/* <Button variant="default" size="sm" onClick={() => navigate('/resolution/pra-evaluation')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Evaluation Plan
            </Button> */}
            <div>
              <h1 className="text-2xl font-bold">{praData.praName}</h1>
              <p className="text-muted-foreground">
                {praData.groupType} • {praData.entityType} • Submitted: {new Date(praData.submissionDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{praData.complianceScore}%</div>
              <div className="text-xs text-muted-foreground">Compliance Score</div>
            </div>
            {getStatusBadge(praData.status)}
            <Select value={praData.status} onValueChange={handleStatusUpdate}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents</p>
                  <p className="text-2xl font-bold">{praData.documents.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Objection History Dialog */}
        <Dialog open={showObjectionHistory} onOpenChange={setShowObjectionHistory}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Change History</DialogTitle>
              <DialogDescription>
                Audit trail for {historyObjection?.cocMemberName}'s objection on {historyObjection?.praName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {(historyObjection?.history || []).length === 0 && (
                <div className="text-sm text-muted-foreground">No history recorded yet.</div>
              )}
              {(historyObjection?.history || []).map((h, idx) => (
                <div key={idx} className="p-3 border rounded-md flex items-start justify-between">
                  <div>
                    <div className="text-sm">{h.changes}</div>
                    <div className="text-xs text-muted-foreground">by {h.user}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{h.timestamp}</div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Queries</p>
                  <p className="text-2xl font-bold">{praData.queries.filter(q => q.status === 'pending').length}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Worth</p>
                  <p className="text-2xl font-bold">{formatCurrency(praData.financialInfo.netWorth)}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Section 29A</p>
                  <p className="text-2xl font-bold text-green-600">
                    {praData.section29ACompliance ? 'Compliant' : 'Non-Compliant'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="queries" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Queries
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Provisional Report
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">PRA Name</Label>
                      <p className="font-medium">{praData.praName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Entity Type</Label>
                      <p className="font-medium capitalize">{praData.entityType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Group Type</Label>
                      <p className="font-medium capitalize">{praData.groupType}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Submission Source</Label>
                      <Select
                        value={praData.submissionSource}
                        onValueChange={(value: 'platform' | 'manual') => {
                          setPraData(prev => ({
                            ...prev,
                            submissionSource: value,
                            submissionDate: value === 'platform'
                              ? (prev.submissionDate || new Date().toISOString().split('T')[0])
                              : prev.submissionDate,
                            eoiSubmissionDate: value === 'platform'
                              ? (prev.eoiSubmissionDate || prev.submissionDate || new Date().toISOString().split('T')[0])
                              : (prev.eoiSubmissionDate || prev.submissionDate)
                          }));
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="platform">Submitted by PRA (Auto)</SelectItem>
                          <SelectItem value="manual">Uploaded by User (Manual)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Submission Date</Label>
                      {praData.submissionSource === 'manual' ? (
                        <Input
                          type="date"
                          value={praData.submissionDate}
                          onChange={(e) => setPraData(prev => ({ ...prev, submissionDate: e.target.value }))}
                        />
                      ) : (
                        <p className="font-medium">{praData.submissionDate ? new Date(praData.submissionDate).toLocaleDateString() : '-'}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {praData.submissionSource === 'platform' ? 'Captured automatically when PRA submitted EOI.' : 'Manual entry for records uploaded by user.'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-muted-foreground">Date of submission of EOI</Label>
                      {praData.submissionSource === 'manual' ? (
                        <Input
                          type="date"
                          value={praData.eoiSubmissionDate || ''}
                          onChange={(e) => setPraData(prev => ({ ...prev, eoiSubmissionDate: e.target.value }))}
                        />
                      ) : (
                        <p className="font-medium">{(praData.eoiSubmissionDate || praData.submissionDate) ? new Date(praData.eoiSubmissionDate || praData.submissionDate).toLocaleDateString() : '-'}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {praData.submissionSource === 'platform' ? 'Auto-captured from the platform submission timestamp.' : 'If you uploaded this manually, please set the actual EOI submission date here.'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Selected (Yes/No)</Label>
                      <div className="mt-1">
                        <Button
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            setIsSelected(true);
                            runValidationAndRecord('yes');
                            toast({ title: 'PRA Selected', description: `${praData.praName} marked as Selected. Validation observations added.` });
                          }}
                        >
                          Yes
                        </Button>
                        <Button
                          variant={!isSelected ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setIsSelected(false);
                            runValidationAndRecord('no');
                            toast({ title: 'Selection: No', description: `${praData.praName} marked as Not Selected. Validation observations added.` });
                          }}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* System Observations (document validation) */}
                  {praData.queries.some(q => q.id.startsWith('val-')) && (
                    <div className="mt-4 p-3 border rounded-md bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">System Observations</Label>
                        <Badge variant="secondary">{praData.queries.filter(q => q.id.startsWith('val-')).length}</Badge>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {praData.queries
                          .filter(q => q.id.startsWith('val-'))
                          .map(q => (
                            <li key={q.id}>{q.question}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {praData.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Contact Number</Label>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {praData.contactNo}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Compliance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Compliance Score</span>
                      <span className="text-2xl font-bold text-blue-600">{praData.complianceScore}%</span>
                    </div>
                    <Progress value={praData.complianceScore} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Section 29A Compliance</span>
                      {praData.section29ACompliance ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Compliant
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Non-Compliant
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Documents Verified</span>
                      <span className="text-sm font-medium">
                        {praData.documents.filter(d => d.status === 'verified').length} / {praData.documents.length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pending Queries</span>
                      <span className="text-sm font-medium">
                        {praData.queries.filter(q => q.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submitted Documents
                </CardTitle>
                <CardDescription>
                  Review and verify documents submitted by the PRA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {praData.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{doc.remarks || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={'#'} download={doc.name}>Download</a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Queries Tab */}
          <TabsContent value="queries" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Queries & Communications
                    </CardTitle>
                    <CardDescription>
                      Manage queries and communications with the PRA
                    </CardDescription>
                  </div>
                  <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Add Query
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Query</DialogTitle>
                        <DialogDescription>
                          Enter your query or request for additional information
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select value={queryPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setQueryPriority(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="query">Query</Label>
                          <Textarea
                            id="query"
                            value={newQuery}
                            onChange={(e) => setNewQuery(e.target.value)}
                            placeholder="Enter your query..."
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowQueryDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddQuery}>
                            Add Query
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {praData.queries.map((query) => (
                    <Card key={query.id} className={`border-l-4 ${
                      query.priority === 'high' ? 'border-l-red-500' : 
                      query.priority === 'medium' ? 'border-l-orange-500' : 'border-l-blue-500'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(query.createdAt).toLocaleDateString()}
                            </span>
                            {getPriorityBadge(query.priority)}
                          </div>
                          {getStatusBadge(query.status)}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-sm">Question:</h5>
                            <p className="text-sm text-muted-foreground">{query.question}</p>
                          </div>
                          
                          {query.response && (
                            <div>
                              <h5 className="font-medium text-sm">Response:</h5>
                              <p className="text-sm text-muted-foreground">{query.response}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Created by: {query.createdBy}</span>
                            {query.status === 'pending' && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                Follow Up
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Information
                </CardTitle>
                <CardDescription>
                  Financial capacity and creditworthiness assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Net Worth</p>
                        <p className="text-xl font-bold">{formatCurrency(praData.financialInfo.netWorth)}</p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Annual Turnover</p>
                        <p className="text-xl font-bold">{formatCurrency(praData.financialInfo.annualTurnover)}</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Liquid Assets</p>
                        <p className="text-xl font-bold">{formatCurrency(praData.financialInfo.liquidAssets)}</p>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Credit Rating</p>
                        <p className="text-xl font-bold">{praData.financialInfo.creditRating}</p>
                      </div>
                      <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Bank Guarantee</p>
                        <p className="text-xl font-bold">{formatCurrency(praData.financialInfo.bankGuarantee)}</p>
                      </div>
                      <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">EMD Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(praData.financialInfo.emdAmount)}</p>
                      </div>
                      <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluation Tab */}
          <TabsContent value="evaluation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Evaluation Controls */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Eligibility Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Evaluation Mode</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="aiEnabled"
                        checked={praData.evaluationData?.aiEvaluationEnabled}
                        onChange={(e) => setPraData(prev => ({
                          ...prev,
                          evaluationData: {
                            ...prev.evaluationData!,
                            aiEvaluationEnabled: e.target.checked
                          }
                        }))}
                      />
                      <Label htmlFor="aiEnabled">Enable AI Evaluation</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className='me-2'>Current Status</Label>
                    <Badge variant={
                      praData.evaluationData?.eligibilityStatus === 'eligible' ? 'default' :
                      praData.evaluationData?.eligibilityStatus === 'conditional' ? 'secondary' :
                      praData.evaluationData?.eligibilityStatus === 'ineligible' ? 'destructive' : 'outline'
                    }>
                      {praData.evaluationData?.eligibilityStatus || 'Pending'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={praData.evaluationData?.aiEvaluationEnabled ? handleAIEvaluation : handleManualEvaluation}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      {praData.evaluationData?.aiEvaluationEnabled ? 'Run AI Evaluation' : 'Manual Evaluation'}
                    </Button>
                  </div>

                  {praData.evaluationData?.eligibilityStatus !== 'pending' && (
                    <div className="space-y-2">
                      <Button
                        onClick={generateProvisionalReport}
                        variant="outline"
                        className="w-full"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reports List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Post Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Final Report Generation */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" /> Final Report
                      </CardTitle>
                      <CardDescription>Process selection criteria and generate a dynamic report snapshot for this PRA.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Button onClick={generateProvisionalReport} disabled={praData.evaluationData?.eligibilityStatus === 'pending' || loading}>
                          Generate Report
                        </Button>
                        <div className="text-xs text-muted-foreground">Button is disabled until evaluation completes.</div>
                      </div>
                    </CardContent>
                  </Card>

                  {praData.evaluationData?.provisionalReports.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No reports generated yet</p>
                      <p className="text-sm">Run evaluation first to generate reports</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {praData.evaluationData?.provisionalReports.map((report) => (
                        <Card key={report.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{report.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Generated: {new Date(report.generatedDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant={
                                report.status === 'final' ? 'default' :
                                report.status === 'circulated' ? 'secondary' : 'outline'
                              }>
                                {report.status}
                              </Badge>
                            </div>
                            
                            <div className="flex gap-2 flex-wrap">
                              <Button size="sm" variant="outline" onClick={() => { setCurrentReport(report); setSelectedReportRows([]); }}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => saveReportAsDraft(report.id)} disabled={report.status === 'final' || report.status === 'circulated'}>
                                <Save className="h-3 w-3 mr-1" />
                                Save Draft
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => downloadReport(report, 'pdf')} disabled={report.status !== 'final'}>
                                Download PDF
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => downloadReport(report, 'excel')} disabled={report.status !== 'final'}>
                                Download Excel
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => saveToSavedReports(report, 'pdf')} disabled={report.status === 'circulated'}>
                                Finalize & Save
                              </Button>
                              <Button size="sm" disabled={report.status !== 'final'} onClick={() => {
                                setSelectedReportForSigning(report);
                                setShowSignatureDialog(true);
                              }}>
                                <Shield className="h-3 w-3 mr-1" />
                                Sign Report
                              </Button>
                              <Button size="sm" variant="outline" disabled={report.status !== 'final'} onClick={() => {
                                setCurrentReport(report);
                                setShowCirculationDialog(true);
                              }}>
                                <Mail className="h-3 w-3 mr-1" />
                                Circulate
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Saved Reports */}
            {praData.evaluationData?.savedReports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Saved Date</TableHead>
                        <TableHead>Signed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {praData.evaluationData.savedReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell className="uppercase">{report.format}</TableCell>
                          <TableCell>{new Date(report.savedDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {report.isSigned ? (
                              <Badge variant="default">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Signed
                              </Badge>
                            ) : (
                              <Badge variant="outline">Unsigned</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => {
                                const baseRow: ReportData = {
                                  praId: praData.id,
                                  praName: praData.praName,
                                  entityType: praData.entityType,
                                  complianceStatus: praData.complianceScore >= 80 ? 'Compliant' : 'Needs Review',
                                  section29AStatus: praData.section29ACompliance ? 'Compliant' : 'Non-Compliant',
                                  eligiblitycreator: 'Yes',
                                  financialStatus: 'Verified',
                                  documentsStatus: `${praData.documents.filter(d => d.status === 'verified').length}/${praData.documents.length} Verified`
                                };
                                const tempReport: ProvisionalReport = {
                                  id: report.id,
                                  name: report.name,
                                  generatedDate: report.savedDate,
                                  status: 'final',
                                  customization: reportCustomization,
                                  data: [baseRow, ...mockOtherPRAs]
                                };
                                setSavedReportView(tempReport);
                              }}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => {
                                toast({
                                  title: 'Download Started',
                                  description: `Downloading ${report.name}.${report.format}`
                                });
                              }}>
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Report View Dialog */}
        {currentReport && (
          <Dialog open={!!currentReport} onOpenChange={() => setCurrentReport(null)}>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{currentReport.name}</DialogTitle>
                <DialogDescription>
                  Provisional Eligibility Report - Generated on {new Date(currentReport.generatedDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Report Data</h3>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setShowReportCustomization(true)}>
                      Customize
                    </Button>
                    <Button size="sm" disabled={selectedReportRows.length === 0} onClick={() => { saveToSavedReports(currentReport, 'pdf'); setCurrentReport(null); }}>
                      Finalize & Save
                    </Button>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <input
                          type="checkbox"
                          aria-label="Select all"
                          checked={selectedReportRows.length === currentReport.data.length && currentReport.data.length > 0}
                          indeterminate={(selectedReportRows.length > 0 && selectedReportRows.length < currentReport.data.length) as unknown as boolean}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReportRows(currentReport.data.map((_, idx) => idx));
                            } else {
                              setSelectedReportRows([]);
                            }
                          }}
                        />
                      </TableHead>
                      {currentReport.customization.selectedFields.map(field => (
                        <TableHead key={field}>
                          {availableFields.find(f => f.id === field)?.label || field}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentReport.data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-10">
                          <input
                            type="checkbox"
                            checked={selectedReportRows.includes(index)}
                            onChange={(e) => {
                              setSelectedReportRows(prev => e.target.checked ? Array.from(new Set([...prev, index])) : prev.filter(i => i !== index));
                            }}
                          />
                        </TableCell>
                        {currentReport.customization.selectedFields.map(field => (
                          <TableCell key={field}>
                            {field === 'eligiblitycreator' ? 'Yes' : (row[field as keyof ReportData] || '-')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Saved Report View Dialog (read-only) */}
        {savedReportView && (
          <Dialog open={!!savedReportView} onOpenChange={() => setSavedReportView(null)}>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{savedReportView.name}</DialogTitle>
                <DialogDescription>
                  Saved Report - Generated on {new Date(savedReportView.generatedDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Report Data</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => downloadReport(savedReportView, 'pdf')}>Download PDF</Button>
                    <Button size="sm" variant="outline" onClick={() => downloadReport(savedReportView, 'excel')}>Download Excel</Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {savedReportView.customization.selectedFields.map(field => (
                        <TableHead key={field}>
                          {availableFields.find(f => f.id === field)?.label || field}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedReportView.data.map((row, index) => (
                      <TableRow key={index}>
                        {savedReportView.customization.selectedFields.map(field => (
                          <TableCell key={field}>
                            {field === 'eligiblitycreator' ? 'Yes' : (row[field as keyof ReportData] || '-')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* CoC Member Objections */}
        {/* <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>COC Member Objections</CardTitle>
                <CardDescription>
                  Review, respond, and finalize CoC objections. Auto-saves edits and maintains history.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportObjectionsCSV}>Export CSV</Button>
                <Button variant="outline" onClick={printObjectionsPDF}>Print / PDF</Button>
                <Button onClick={sendObjectionReminders}>Send Reminder</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(praData.evaluationData?.objections || []).map(entry => (
                <div key={entry.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{entry.cocMemberName}</div>
                      <div className="text-sm text-muted-foreground">Objection against: {entry.praName}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={entry.status === 'pending' ? 'secondary' : entry.status === 'approved' ? 'default' : 'destructive'} className="capitalize">{entry.status}</Badge>
                      <Button size="sm" variant="outline" onClick={() => { setHistoryObjection(entry); setShowObjectionHistory(true); }}>History</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                    <div className="lg:col-span-2">
                      <Label>Objection Details</Label>
                      <Textarea value={entry.details} onChange={(e) => updateObjectionField(entry.id, 'details', e.target.value)} placeholder="Enter objection details" />
                    </div>
                    <div className="lg:col-span-2">
                      <Label>Response from PRA / Platform</Label>
                      <Textarea value={entry.response || ''} onChange={(e) => updateObjectionField(entry.id, 'response', e.target.value)} placeholder="Enter response" />
                    </div>
                    <div>
                      <Label>Received</Label>
                      <div className="text-sm mt-2">{entry.receivedDate}</div>
                    </div>
                    <div>
                      <Label>Include in Final</Label>
                      <Select value={entry.includeInFinal ?? ''} onValueChange={(v: 'yes' | 'no') => updateObjectionField(entry.id, 'includeInFinal', v || null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="lg:col-span-2">
                      <Label>Remarks</Label>
                      <Input value={entry.remarks || ''} onChange={(e) => updateObjectionField(entry.id, 'remarks', e.target.value)} placeholder="Add remarks (optional)" />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => rejectObjection(entry.id)}>Reject</Button>
                    <Button size="sm" onClick={() => approveObjection(entry.id)}>Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Report Customization Dialog */}
        <Dialog open={showReportCustomization} onOpenChange={setShowReportCustomization}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customize Report</DialogTitle>
              <DialogDescription>
                Select fields, arrange layout, and configure sorting for the provisional report
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Field Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Field Selection</Label>
                <div className="grid grid-cols-2 gap-3">
                  {availableFields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={field.id}
                        checked={reportCustomization.selectedFields.includes(field.id)}
                        onChange={(e) => updateReportCustomization(field.id, e.target.checked)}
                      />
                      <Label htmlFor={field.id}>{field.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Layout Options */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Layout</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="horizontal"
                      name="layout"
                      checked={reportCustomization.layout === 'horizontal'}
                      onChange={() => setReportCustomization(prev => ({ ...prev, layout: 'horizontal' }))}
                    />
                    <Label htmlFor="horizontal">Horizontal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="vertical"
                      name="layout"
                      checked={reportCustomization.layout === 'vertical'}
                      onChange={() => setReportCustomization(prev => ({ ...prev, layout: 'vertical' }))}
                    />
                    <Label htmlFor="vertical">Vertical</Label>
                  </div>
                </div>
              </div>
              
              {/* Sorting */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sorting</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Sort By</Label>
                    <Select value={reportCustomization.sortBy} onValueChange={(value) => 
                      setReportCustomization(prev => ({ ...prev, sortBy: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields.map(field => (
                          <SelectItem key={field.id} value={field.id}>{field.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Direction</Label>
                    <Select value={reportCustomization.sortDirection} onValueChange={(value: 'asc' | 'desc') => 
                      setReportCustomization(prev => ({ ...prev, sortDirection: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReportCustomization(false)}>
                  Cancel
                </Button>
                <Button onClick={applyCustomization}>
                  Apply Customization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Digital Signature Dialog */}
        <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Digital Signature</DialogTitle>
              <DialogDescription>
                Sign the provisional report with your digital credentials
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Profile Information */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Signature Details</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={userProfile.fullName} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>Organization</Label>
                    <Input value={userProfile.organization} readOnly className="bg-gray-50" />
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Input value={userProfile.address} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={userProfile.email} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={userProfile.phone} readOnly className="bg-gray-50" />
                  </div>
                </div>
              </div>
              
              {/* Signature Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Signature Type</Label>
                <div className="flex gap-4">
                  <Button onClick={() => handleDigitalSignature('digital')} className="flex-1">
                    <Shield className="h-4 w-4 mr-2" />
                    Digital Signature (DSC)
                  </Button>
                  <Button onClick={() => handleDigitalSignature('electronic')} variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    E-Signature
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSignatureDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Circulation Dialog */}
        <Dialog open={showCirculationDialog} onOpenChange={setShowCirculationDialog}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Circulate Report</DialogTitle>
              <DialogDescription>
                Send provisional report to PRAs and CoC members for review and objections
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Email Configuration */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Email Configuration</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoEmail"
                    checked={autoEmailEnabled}
                    onChange={(e) => setAutoEmailEnabled(e.target.checked)}
                  />
                  <Label htmlFor="autoEmail">Enable automatic email circulation</Label>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>Subject</Label>
                    <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                  </div>
                  <div>
                    <Label>Body</Label>
                    <Textarea rows={5} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeObjectionLink}
                      onChange={(e) => setIncludeObjectionLink(e.target.checked)}
                    />
                    <span>Include objection submission link</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includePlatformLink}
                      onChange={(e) => setIncludePlatformLink(e.target.checked)}
                    />
                    <span>Include platform access link</span>
                  </label>
                </div>
                <div className="text-sm text-muted-foreground">
                  When enabled, emails will be sent automatically. When disabled, you can manually review and send.
                </div>
              </div>
              
              {/* Recipients */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Recipients</Label>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">PRAs</div>
                    <div className="text-sm text-muted-foreground">
                      • {praData.praName} ({praData.email})
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">CoC Members</div>
                    <div className="text-sm text-muted-foreground">
                      • CoC Member 1 (coc1@example.com)
                      • CoC Member 2 (coc2@example.com)
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Objection Deadline */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Objection Deadline</Label>
                <Input type="date" value={objectionDeadline} onChange={(e) => setObjectionDeadline(e.target.value)} />
                <div className="text-sm text-muted-foreground">
                  Recipients will have until this date to raise objections
                </div>
              </div>
              
              {/* Email Content Preview */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Email Content Preview</Label>
                <div className="p-3 border rounded-lg bg-gray-50 text-sm">
                  <div className="font-medium">Subject: {emailSubject}</div>
                  <div className="mt-2 whitespace-pre-wrap">
                    {emailBody}
                    {`\n\nReport: ${currentReport?.name || ''}`}
                    {`\nDeadline: ${new Date(objectionDeadline).toLocaleDateString()}`}
                    {includeObjectionLink ? '\nObjection link: https://app.example.com/objections/upload' : ''}
                    {includePlatformLink ? '\nPlatform link: https://app.example.com/login' : ''}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCirculationDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (currentReport) {
                    circulateReport(currentReport, {
                      autoEmailEnabled,
                      objectionDeadline,
                      emailSubject,
                      emailBody,
                      includeObjectionLink,
                      includePlatformLink
                    });
                  }
                  setShowCirculationDialog(false);
                }}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Circulation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Objection Upload Dialog for CoC Members */}
        <Dialog open={showObjectionDialog} onOpenChange={setShowObjectionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Objection</DialogTitle>
              <DialogDescription>
                Upload objection documents and provide comments for the provisional report
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Objection Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select objection type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eligibility">Eligibility Concerns</SelectItem>
                    <SelectItem value="financial">Financial Discrepancies</SelectItem>
                    <SelectItem value="compliance">Compliance Issues</SelectItem>
                    <SelectItem value="documentation">Documentation Problems</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Comments</Label>
                <textarea
                  className="w-full p-3 border rounded-md min-h-[100px]"
                  placeholder="Provide detailed comments about your objection..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Supporting Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" multiple className="hidden" id="objection-files" />
                  <label htmlFor="objection-files" className="cursor-pointer">
                    <div className="space-y-2">
                      <FileText className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload supporting documents</p>
                      <p className="text-xs text-gray-400">PDF, DOC, DOCX files accepted</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowObjectionDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: 'Objection Submitted',
                    description: 'Your objection has been recorded and will be reviewed'
                  });
                  setShowObjectionDialog(false);
                }}>
                  Submit Objection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PRADetails;

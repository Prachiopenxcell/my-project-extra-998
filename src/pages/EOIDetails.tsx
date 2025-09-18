            
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  FileText,
  Calendar,
  Clock,
  Users,
  Building,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Save,
  Send,
  Bot,
  Target,
  Info,
  ExternalLink,
  MessageSquare,
  Star,
  BarChart3,
  Shield
} from 'lucide-react';

// Provisional Report interfaces
interface ProvisionalReport {
  id: string;
  name: string;
  generatedDate: string;
  status: 'draft' | 'circulated' | 'final';
  customization: ReportCustomization;
  data: ReportData[];
}

interface ReportCustomization {
  selectedFields: string[];
  fieldOrder: string[];
  sortBy?: string;
  sortDirection: 'asc' | 'desc';
  includeRemarks: boolean;
  layout: 'horizontal' | 'vertical';
}

interface ReportData {
  praId: string;
  praName: string;
  entityType: string;
  complianceStatus: string;
  section29AStatus: string;
  eligiblitycreator: string;
  aiEligibilityStatus: string;
  financialStatus?: string;
  documentsStatus?: string;
  remarks?: string;
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

interface FinalReport {
  id: string;
  name: string;
  generatedDate: string;
  selectedData: ReportData[];
  totalEntries: number;
  isSigned?: boolean;
  signatureDetails?: SignatureDetails;
}

interface PRASubmission {
  id: string;
  praName: string;
  groupType: 'standalone' | 'group';
  entityType: 'company' | 'partnership' | 'individual';
  submissionDate: string;
  email: string;
  contactNo: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  documentsSubmitted: string[];
  documentsByCategory?: Record<string, string[]>;
  othersNote?: string;
  comments?: string;
  platformQueriesNote?: string;
  complianceScore: number;
  queries: Query[];
}

interface Query {
  id: string;
  question: string;
  response?: string;
  status: 'pending' | 'answered';
  createdAt: string;
  createdBy: 'system' | 'user';
}

interface ObjectionComment { id: string; user: string; text: string; timestamp: string }

interface Objection {
  id: string;
  cocMemberName: string;
  praName: string;
  objectionDetails: string;
  submissionDate: string;
  status: 'pending' | 'resolved' | 'rejected';
  response?: string;
  includeInFinal?: boolean | null;
  remarks?: string;
  history?: Array<{ timestamp: string; user: string; action: string; changes?: string }>;
  comments?: ObjectionComment[];
  attachments?: string[];
}

const EOIDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { hasModuleAccess } = useSubscription();
  
  // Provisional Report state
  const [currentReport, setCurrentReport] = useState<ProvisionalReport | null>(null);
  const [selectedReportRows, setSelectedReportRows] = useState<number[]>([]);
  const [showReportCustomization, setShowReportCustomization] = useState(false);
  
  // Final Reports state
  const [finalReports, setFinalReports] = useState<FinalReport[]>([]);
  const [viewReportDialog, setViewReportDialog] = useState<FinalReport | null>(null);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [selectedReportForSigning, setSelectedReportForSigning] = useState<FinalReport | null>(null);
  // Post Reports (signed/completed)
  const [postReports, setPostReports] = useState<FinalReport[]>([]);
  // Circulation state for Post Reports
  const [showCirculationDialog, setShowCirculationDialog] = useState(false);
  const [selectedReportForCirculation, setSelectedReportForCirculation] = useState<FinalReport | null>(null);
  const [autoEmailEnabled, setAutoEmailEnabled] = useState<boolean>(true);
  const [includeCoC, setIncludeCoC] = useState<boolean>(true);
  const [includePRAs, setIncludePRAs] = useState<boolean>(true);
  const [attachPDF, setAttachPDF] = useState<boolean>(true);
  const [emailSubject, setEmailSubject] = useState<string>('Provisional PRA Report for Review & Objections');
  const [emailBody, setEmailBody] = useState<string>('Dear Stakeholder,\n\nPlease find attached the Provisional PRA Report. This is circulated for your review and to raise any objections, if any, within the stipulated time period.\n\nKey details included: Eligibility status, evaluation parameters, and Section 29A compliance summary.\n\nRegards,\nResolution Authority');
  
  // User profile for signing
  const [userProfile] = useState({
    fullName: 'John Doe',
    organization: 'Resolution Authority',
    address: '123 Business District, Mumbai',
    email: 'john.doe@resolution.gov.in',
    phone: '+91 98765 43210'
  });
  const [reportCustomization, setReportCustomization] = useState<ReportCustomization>({
    selectedFields: ['praName', 'entityType', 'complianceStatus', 'section29AStatus', 'eligiblitycreator', 'aiEligibilityStatus'],
    fieldOrder: ['praName', 'entityType', 'complianceStatus', 'section29AStatus', 'eligiblitycreator', 'aiEligibilityStatus'],
    sortBy: 'praName',
    sortDirection: 'asc',
    includeRemarks: true,
    layout: 'horizontal'
  });
  
  // Available fields for report customization
  const availableFields = [
    { id: 'praName', label: 'PRA Name' },
    { id: 'entityType', label: 'Entity Type' },
    { id: 'complianceStatus', label: 'Compliance Status' },
    { id: 'section29AStatus', label: 'Section 29A Status' },
    { id: 'eligiblitycreator', label: 'Eligibility creator' },
    { id: 'aiEligibilityStatus', label: 'AI Eligibility Status' },
    { id: 'financialStatus', label: 'Financial Status' },
    { id: 'documentsStatus', label: 'Documents Status' },
    { id: 'remarks', label: 'Remarks' }
  ];
  
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [selectedPRA, setSelectedPRA] = useState<PRASubmission | null>(null);
  const [compareRightId, setCompareRightId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock EOI data
  const [eoiData] = useState({
    id: '1',
    entityName: 'ABC Corporation Ltd.',
    dateOfIssue: '2024-01-15',
    lastDateToSubmit: '2024-02-15',
    status: 'provisional-list-shared',
    totalPRAs: 12,
    totalObjections: 6
  });

  // ===== Objections Helpers =====
  const [showRespondDialog, setShowRespondDialog] = useState(false);
  // Reject dialog state
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showHistoryDialog, setShowHistoryDialog] = useState<null | Objection>(null);
  const [activeObjection, setActiveObjection] = useState<Objection | null>(null);
  const [draftResponse, setDraftResponse] = useState('');
  const [draftInclude, setDraftInclude] = useState<string>('');
  const [draftRemarks, setDraftRemarks] = useState('');
  const [autoSavedAt, setAutoSavedAt] = useState<string | null>(null);
  // Objection deadline (mock): 7 days after lastDateToSubmit
  const [objectionDeadline] = useState<string>(() => {
    const base = new Date(eoiData.lastDateToSubmit || '2024-02-15');
    const deadline = new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000);
    return deadline.toISOString().slice(0,10);
  });
  const [autoReminderSent, setAutoReminderSent] = useState(false);
  
  // Saved Final Reports (local mock)
  interface FinalReportEntry {
    praName: string;
    entityType: 'company' | 'partnership' | 'individual';
    complianceStatus: 'Compliant' | 'Needs Review';
    section29AStatus: 'Compliant' | 'Non-Compliant';
    eligiblitycreator: 'Yes' | 'No';
  }
  interface SavedReport { id: string; name: string; createdAt: string; entries: FinalReportEntry[] }
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [showReportDialog, setShowReportDialog] = useState<null | SavedReport>(null);
  const [showAddObjectionDialog, setShowAddObjectionDialog] = useState(false);
  const [newObjMemberName, setNewObjMemberName] = useState('CoC Member - State Bank of India'); // mock current CoC bank member
  const [newObjPraName, setNewObjPraName] = useState('');
  const [newObjDetails, setNewObjDetails] = useState('');
  const [newObjAttachments, setNewObjAttachments] = useState<string[]>([]);

  // Mock objections (moved up so effects below can access safely)
  const [objections, setObjections] = useState<Objection[]>([
    // Pending
    {
      id: '1',
      cocMemberName: 'CoC Member - State Bank of India',
      praName: 'Resolution Partners LLC',
      objectionDetails: 'Concerns about the financial capacity and previous track record of the PRA',
      submissionDate: '2024-02-14',
      status: 'pending',
      includeInFinal: null,
      remarks: '',
      history: [
        { timestamp: '2024-02-14', user: 'CoC Member - State Bank of India', action: 'Objection submitted' }
      ],
      comments: [
        { id: 'c-1-1', user: 'CoC Secretariat', text: 'Please share additional financials for FY 21-23.', timestamp: '2024-02-14T10:15:00Z' }
      ]
    },
    // Pending
    {
      id: '2',
      cocMemberName: 'CoC Member - HDFC Bank',
      praName: 'Strategic Investments Ltd.',
      objectionDetails: 'Incomplete documentation - missing consortium agreement',
      submissionDate: '2024-02-15',
      status: 'pending',
      includeInFinal: null,
      remarks: '',
      history: [
        { timestamp: '2024-02-15', user: 'CoC Member - HDFC Bank', action: 'Objection submitted' }
      ],
      comments: [
        { id: 'c-2-1', user: 'CoC Secretariat', text: 'Kindly provide the consortium agreement for review.', timestamp: '2024-02-15T12:30:00Z' }
      ]
    },
    // Pending
    {
      id: '3',
      cocMemberName: 'CoC Member - ICICI Bank',
      praName: 'Resolution Partners LLC',
      objectionDetails: 'Requested clarification on EMD computation which has been provided',
      submissionDate: '2024-02-16',
      status: 'pending',
      includeInFinal: null,
      remarks: '',
      history: [
        { timestamp: '2024-02-16', user: 'CoC Member - ICICI Bank', action: 'Objection submitted' }
      ],
      comments: [
        { id: 'c-3-1', user: 'Platform', text: 'EMD computation note attached in documents.', timestamp: '2024-02-16T16:45:00Z' }
      ]
    },
    // Resolved
    {
      id: '4',
      cocMemberName: 'CoC Member - Axis Bank',
      praName: 'Strategic Investments Ltd.',
      objectionDetails: 'Clarification sought on audited statements. Clarification received.',
      submissionDate: '2024-02-17',
      status: 'resolved',
      response: 'Audited statements for FY 21-23 shared and found in order',
      includeInFinal: true,
      remarks: 'Approved',
      history: [
        { timestamp: '2024-02-17', user: 'CoC Member - Axis Bank', action: 'Objection submitted' },
        { timestamp: '2024-02-18', user: 'Platform', action: 'Response added: Audited statements reviewed' },
        { timestamp: '2024-02-18', user: 'CoC Secretariat', action: 'Approved • Marked include in final: Yes' }
      ],
      comments: [
        { id: 'c-4-1', user: 'CoC Secretariat', text: 'Reviewed audited statements. Looks in order.', timestamp: '2024-02-18T10:05:00Z' }
      ]
    },
    // Rejected
    {
      id: '5',
      cocMemberName: 'CoC Member - Bank of Baroda',
      praName: 'Resolution Partners LLC',
      objectionDetails: 'Alleged mismatch in authorized signatory details',
      submissionDate: '2024-02-18',
      status: 'rejected',
      includeInFinal: false,
      remarks: 'Rejected: Evidence provided confirms authorized signatory details are correct',
      history: [
        { timestamp: '2024-02-18', user: 'CoC Member - Bank of Baroda', action: 'Objection submitted' },
        { timestamp: '2024-02-19', user: 'CoC Secretariat', action: 'Rejected', changes: 'Reason: Evidence confirms details correct' }
      ],
      comments: [
        { id: 'c-5-1', user: 'CoC Secretariat', text: 'Verified records. Signatory details match the registry.', timestamp: '2024-02-19T09:10:00Z' }
      ]
    },
    // Rejected
    {
      id: '6',
      cocMemberName: 'CoC Member - Punjab National Bank',
      praName: 'Strategic Investments Ltd.',
      objectionDetails: 'Raised concern about missing board resolution',
      submissionDate: '2024-02-19',
      status: 'rejected',
      includeInFinal: false,
      remarks: 'Rejected: Board resolution provided earlier; duplicate concern',
      history: [
        { timestamp: '2024-02-19', user: 'CoC Member - Punjab National Bank', action: 'Objection submitted' },
        { timestamp: '2024-02-20', user: 'CoC Secretariat', action: 'Rejected', changes: 'Reason: Duplicate; document already on record' }
      ],
      comments: [
        { id: 'c-6-1', user: 'Platform', text: 'Board resolution uploaded on 2024-02-10.', timestamp: '2024-02-20T08:00:00Z' },
        { id: 'c-6-2', user: 'CoC Secretariat', text: 'Closing as duplicate; evidence already on file.', timestamp: '2024-02-20T11:20:00Z' }
      ]
    }
  ]);

  // Secure link generator (mock tokenized URL) for Objection Dashboard access
  const generateSecureDashboardLink = () => {
    const token = btoa(`${id || 'eoi-1'}:${Date.now()}`);
    return `${window.location.origin}/resolution/eoi/${id || '1'}?tab=objections&token=${token}`;
  };

  // Add comment on an objection
  const addObjectionComment = (obj: Objection, text: string) => {
    if (!text.trim()) return;
    const now = new Date().toISOString();
    setObjections(prev => prev.map(o => o.id === obj.id ? {
      ...o,
      comments: [...(o.comments || []), { id: `${Date.now()}`, user: 'CoC Secretariat', text, timestamp: now }],
      history: [...(o.history || []), { timestamp: now.slice(0,10), user: 'CoC Secretariat', action: 'Comment added', changes: text.substring(0,80) }]
    } : o));
  };

  // Create new objection entry
  const createNewObjection = () => {
    if (!newObjPraName || !newObjDetails.trim()) {
      toast({ title: 'Validation', description: 'Please select PRA and enter objection details', variant: 'destructive' });
      return;
    }
    const now = new Date().toISOString();
    const newObj: Objection = {
      id: Date.now().toString(),
      cocMemberName: newObjMemberName,
      praName: newObjPraName,
      objectionDetails: newObjDetails,
      submissionDate: now.slice(0,10),
      status: 'pending',
      includeInFinal: null,
      remarks: '',
      history: [{ timestamp: now.slice(0,10), user: newObjMemberName, action: 'Objection submitted' }],
      comments: [],
      attachments: [...newObjAttachments]
    };
    setObjections(prev => [newObj, ...prev]);
    setShowAddObjectionDialog(false);
    setNewObjPraName(''); setNewObjDetails(''); setNewObjAttachments([]);
    toast({ title: 'Objection Submitted', description: 'New objection recorded.' });
  };

  const copyDashboardLink = () => {
    const url = generateSecureDashboardLink();
    navigator.clipboard.writeText(url);
    toast({ title: 'Link Copied', description: 'Secure Objection Dashboard link copied to clipboard.' });
  };

  // Autosave simulation when editing respond fields
  useEffect(() => {
    if (!showRespondDialog || !activeObjection) return;
    const t = setTimeout(() => {
      setObjections(prev => prev.map(o => {
        if (o.id !== activeObjection.id) return o;
        const nextInclude = draftInclude === '' ? (o.includeInFinal ?? null) : (draftInclude === 'yes');
        const changes: string[] = [];
        if ((o.response || '') !== draftResponse) changes.push('Response');
        if ((o.includeInFinal ?? null) !== nextInclude) changes.push('Include in final');
        if ((o.remarks || '') !== draftRemarks) changes.push('Remarks');
        const updated = {
          ...o,
          response: draftResponse,
          includeInFinal: nextInclude,
          remarks: draftRemarks,
        } as typeof o;
        if (changes.length) {
          const now = new Date().toISOString();
          updated.history = [...(o.history || []), { timestamp: now.slice(0,10), user: 'User Admin', action: 'Draft auto-saved', changes: changes.join(', ') }];
        }
        return updated;
      }));
      setAutoSavedAt(new Date().toLocaleTimeString());
    }, 600);
    return () => clearTimeout(t);
  }, [draftResponse, draftInclude, draftRemarks, showRespondDialog, activeObjection]);

  // Auto reminder before deadline (mock): if within 48 hours and not sent yet
  useEffect(() => {
    const now = new Date();
    const deadline = new Date(objectionDeadline);
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    const hasPending = objections.some(o => o.status === 'pending');
    if (!autoReminderSent && hasPending && hoursLeft <= 48) {
      setAutoReminderSent(true);
      const pending = objections.filter(o => o.status === 'pending').map(o => o.cocMemberName);
      toast({ title: 'Auto Reminder Sent', description: pending.length ? `Deadline ${deadline.toLocaleDateString()}. Reminder sent to: ${pending.join(', ')}` : `Deadline ${deadline.toLocaleDateString()}.` });
    }
  }, [objectionDeadline, objections, autoReminderSent, toast]);

  const openRespond = (obj: Objection) => {
    setActiveObjection(obj);
    setDraftResponse(obj.response || '');
    setDraftInclude(obj.includeInFinal === null || obj.includeInFinal === undefined ? '' : (obj.includeInFinal ? 'yes' : 'no'));
    setDraftRemarks(obj.remarks || '');
    setAutoSavedAt(null);
    setShowRespondDialog(true);
  };

  // Build Final PRA List (Approved only) from PRA submissions, regardless of rejected objections
  const finalizeFinalPRAList = () => {
    // Select PRAs that are approved in submissions
    const approvedPRAs = praSubmissions.filter(p => p.status === 'approved');
    const entries: FinalReportEntry[] = approvedPRAs.map(p => ({
      praName: p.praName,
      entityType: p.entityType,
      complianceStatus: (p.complianceScore ?? 0) >= 80 ? 'Compliant' : 'Needs Review',
      section29AStatus: 'Compliant',
      eligiblitycreator: 'Yes'
    }));
    const report: SavedReport = { id: Date.now().toString(), name: `Final PRA List (Approved) ${new Date().toLocaleDateString()}`, createdAt: new Date().toISOString(), entries };
    setSavedReports(prev => [report, ...prev]);
    setShowReportDialog(report);
    // Simulate auto-emailing final list to CoC and PRAs
    sendFinalListEmails(report);
    toast({ title: 'Final PRA List Generated', description: 'Final report saved and circulation emails sent (mock).' });
  };

  // Email sender (mock) for final list
  const sendFinalListEmails = (rep: SavedReport) => {
    // In real integration, call backend mailer and Notification module here
    console.log('Emailing Final PRA List to CoC & PRAs:', rep);
  };

  const exportReportCSV = (rep: SavedReport) => {
    const headers = ['PRA Name','Entity Type','Compliance Status','Section 29A Status','Eligibility creator'];
    const rows = rep.entries.map(e => [
      e.praName,
      e.entityType,
      e.complianceStatus,
      e.section29AStatus,
      e.eligiblitycreator
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${rep.name.replace(/\s+/g,'_')}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const finalizeRespond = () => {
    if (!activeObjection) return;
    setObjections(prev => prev.map(o => o.id === activeObjection.id ? {
      ...o,
      response: draftResponse,
      includeInFinal: draftInclude === '' ? null : draftInclude === 'yes',
      remarks: draftRemarks,
      status: 'resolved',
      history: [
        ...(o.history || []),
        { timestamp: new Date().toISOString().split('T')[0], user: 'User Admin', action: 'Response finalized', changes: `Include in final: ${draftInclude || '—'}` }
      ]
    } : o));
    setShowRespondDialog(false);
    toast({ title: 'Saved', description: 'Objection response saved and marked resolved.' });
  };

  // Approve / Reject handlers for objections
  const approveObjection = (obj: Objection) => {
    setObjections(prev => prev.map(o => o.id === obj.id ? {
      ...o,
      status: 'resolved',
      includeInFinal: true,
      remarks: o.remarks || 'Approved',
      history: [...(o.history || []), { timestamp: new Date().toISOString().split('T')[0], user: 'User Admin', action: 'Approved', changes: 'Marked include in final: Yes' }]
    } : o));
    toast({ title: 'Approved', description: `Objection by ${obj.cocMemberName} marked as approved.` });
  };

  const openReject = (obj: Objection) => {
    setActiveObjection(obj);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!activeObjection) return;
    setObjections(prev => prev.map(o => o.id === activeObjection.id ? {
      ...o,
      status: 'rejected',
      includeInFinal: false,
      remarks: rejectReason,
      history: [...(o.history || []), { timestamp: new Date().toISOString().split('T')[0], user: 'User Admin', action: 'Rejected', changes: `Reason: ${rejectReason || '—'}` }]
    } : o));
    setShowRejectDialog(false);
    toast({ title: 'Rejected', description: 'Objection marked as rejected.' });
  };

  const exportObjectionsCSV = () => {
    const headers = ['CoC Member','PRA','Date','Status','Objection','Response','IncludeInFinal','Remarks'];
    const rows = objections.map(o => [o.cocMemberName, o.praName, o.submissionDate, o.status, (o.objectionDetails||'').replace(/\n/g,' '), (o.response||'').replace(/\n/g,' '), o.includeInFinal==null?'':(o.includeInFinal?'Yes':'No'), (o.remarks||'').replace(/\n/g,' ')]);
    const meta = [`GeneratedAt,${new Date().toISOString()}`, `Deadline,${objectionDeadline}`].join('\n');
    const csv = [meta, headers.join(','), ...rows.map(r => r.map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Objections_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const printObjectionsPDF = () => {
    window.print();
  };

  const sendReminder = () => {
    // Mock reminder to CoC members who are pending
    const pending = objections.filter(o => o.status === 'pending').map(o => o.cocMemberName);
    toast({ title: 'Reminders Sent', description: pending.length ? `Reminder sent to: ${pending.join(', ')}` : 'No pending objections.' });
  };

  // Mock PRA submissions
  const [praSubmissions, setPraSubmissions] = useState<PRASubmission[]>([
    {
      id: '1',
      praName: 'Resolution Partners LLC',
      groupType: 'standalone',
      entityType: 'company',
      submissionDate: '2024-02-10',
      email: 'contact@resolutionpartners.com',
      contactNo: '+91-9876543210',
      status: 'approved',
      documentsSubmitted: ['eoi-letter', '29a-undertaking', 'annual-reports'],
      complianceScore: 92,
      queries: [
        {
          id: '1',
          question: 'Please clarify the proposed timeline for debt restructuring',
          response: 'We propose a 24-month restructuring timeline with quarterly milestones',
          status: 'answered',
          createdAt: '2024-02-11',
          createdBy: 'user'
        }
      ]
    },
    {
      id: '2',
      praName: 'Strategic Investments Ltd.',
      groupType: 'group',
      entityType: 'company',
      submissionDate: '2024-02-12',
      email: 'info@strategicinv.com',
      contactNo: '+91-9876543211',
      status: 'approved',
      documentsSubmitted: ['eoi-letter', '29a-undertaking'],
      complianceScore: 78,
      queries: [
        {
          id: '2',
          question: 'Net worth certificate appears to be outdated. Please provide current certificate',
          status: 'pending',
          createdAt: '2024-02-13',
          createdBy: 'system'
        }
      ]
    },
    {
      id: '3',
      praName: 'Alpha Capital Partners',
      groupType: 'standalone',
      entityType: 'partnership',
      submissionDate: '2024-02-13',
      email: 'contact@alphacapital.com',
      contactNo: '+91-9876543212',
      status: 'approved',
      documentsSubmitted: ['eoi-letter', '29a-undertaking', 'annual-reports'],
      complianceScore: 88,
      queries: []
    },
    {
      id: '4',
      praName: 'Nova Resolutions Inc.',
      groupType: 'group',
      entityType: 'company',
      submissionDate: '2024-02-14',
      email: 'contact@novaresolutions.com',
      contactNo: '+91-9876543213',
      status: 'approved',
      documentsSubmitted: ['eoi-letter', '29a-undertaking', 'annual-reports', 'net-worth-certificate'],
      complianceScore: 82,
      queries: []
    },
    {
      id: '5',
      praName: 'Zenith Recovery Pvt Ltd',
      groupType: 'standalone',
      entityType: 'company',
      submissionDate: '2024-02-15',
      email: 'info@zenithrecovery.in',
      contactNo: '+91-9876543214',
      status: 'approved',
      documentsSubmitted: ['eoi-letter', '29a-undertaking', 'confidential-undertaking', 'board-resolution'],
      complianceScore: 90,
      queries: []
    }
  ]);


  const [newPRAData, setNewPRAData] = useState({
    praName: '',
    groupType: 'standalone',
    entityType: 'company',
    submissionDate: '',
    email: '',
    contactNo: '',
    documentsSubmitted: [],
    comments: '',
    platformQueriesNote: ''
  });

  // Document categories for PRA uploads
  const docCategories = [
    { id: 'eoi-letter', label: 'Letter stating EOI signed by PRAs' },
    { id: '29a-undertaking', label: '29A eligibility undertaking' },
    { id: 'eligibility-criteria-undertaking', label: 'Fulfilling Eligibility criteria undertaking' },
    { id: 'confidential-undertaking', label: 'Confidential Undertaking' },
    { id: 'annual-reports', label: 'Copies of Annual Reports for last three years' },
    { id: 'net-worth-certificate', label: 'Copies of Net worth certificate' },
    { id: 'board-resolution', label: 'Copies of Board Resolution authorising person' },
    { id: 'incorporation-docs', label: 'Copies of Incorporation docs' },
    { id: 'kyc-pras', label: 'Copies of KYC of PRAs' },
    { id: 'kyc-authorised', label: 'Copies of KYC of Authorised person' },
    { id: 'connected-persons', label: 'List of connected persons' },
    { id: 'consortium-agreement', label: 'Consortium Agreement' },
    { id: 'payment-proof', label: 'Copy of cheque/DD/NEFT' },
    { id: 'profile', label: 'Profile' },
    { id: 'others', label: 'Others, Specify' },
  ] as const;

  const [newPRADocFiles, setNewPRADocFiles] = useState<Record<string, string[]>>({});
  const [newPRADocOtherNote, setNewPRADocOtherNote] = useState('');

  const [editPRAData, setEditPRAData] = useState({
    id: '',
    praName: '',
    groupType: 'standalone',
    entityType: 'company',
    submissionDate: '',
    email: '',
    contactNo: ''
  });

  const [newQuery, setNewQuery] = useState('');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'submitted': { variant: 'secondary' as const, label: 'Submitted' },
      'under-review': { variant: 'default' as const, label: 'Under Review' },
      'approved': { variant: 'default' as const, label: 'Approved' },
      'rejected': { variant: 'destructive' as const, label: 'Rejected' },
      'pending': { variant: 'secondary' as const, label: 'Pending' },
      'resolved': { variant: 'default' as const, label: 'Resolved' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config?.variant || 'secondary'}>{config?.label || status}</Badge>;
  };

  const handleUploadPRA = () => {
    if (!newPRAData.praName || !newPRAData.email || !newPRAData.submissionDate) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    let newPRA: PRASubmission = {
      id: Date.now().toString(),
      praName: newPRAData.praName,
      groupType: newPRAData.groupType as 'standalone' | 'group',
      entityType: newPRAData.entityType as 'company' | 'partnership' | 'individual',
      submissionDate: newPRAData.submissionDate,
      email: newPRAData.email,
      contactNo: newPRAData.contactNo,
      status: 'submitted',
      documentsSubmitted: Object.values(newPRADocFiles).flat(),
      documentsByCategory: newPRADocFiles,
      othersNote: newPRADocOtherNote || undefined,
      comments: newPRAData.comments || undefined,
      platformQueriesNote: newPRAData.platformQueriesNote || undefined,
      complianceScore: 0,
      queries: []
    };

    // If AI assistance is subscribed, run a lightweight evaluation
    if (hasModuleAccess && hasModuleAccess('ai')) {
      // Define a minimal required set for checks
      const requiredIds = [
        'eoi-letter',
        '29a-undertaking',
        'confidential-undertaking',
        'annual-reports',
        'net-worth-certificate'
      ];
      const missing = requiredIds.filter(id => !(newPRADocFiles[id] && newPRADocFiles[id].length > 0));
      const total = requiredIds.length;
      const scoreBase = Math.max(0, Math.round(((total - missing.length) / total) * 100));

      const aiQueries: Query[] = [];
      if (missing.length > 0) {
        aiQueries.push({
          id: `${Date.now()}-q1`,
          question: `The following document categories are missing: ${missing.map(m => docCategories.find(d => d.id === m)?.label).join(', ')}. Please upload the required documents for authentication.`,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: 'system'
        });
      }
      // Generic quality check suggestion
      aiQueries.push({
        id: `${Date.now()}-q2`,
        question: 'Please ensure that submitted documents are legible, dated, and duly signed/stamped where applicable. Provide clarifications if any scanned copies are unclear.',
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'system'
      });

      newPRA = {
        ...newPRA,
        complianceScore: scoreBase,
        queries: [...newPRA.queries, ...aiQueries],
        status: 'under-review'
      };

      toast({
        title: 'AI Checks Triggered',
        description: 'Document Authentication and Quality Check initiated. Findings added as queries.',
      });
    }

    // Map platform queries (from textarea) into Query entries
    const extraPlatformQueries: Query[] = (newPRAData.platformQueriesNote || '')
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)
      .map((q, idx) => ({
        id: `${Date.now()}-pq-${idx}`,
        question: q,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'system'
      }));

    if (extraPlatformQueries.length) {
      newPRA = { ...newPRA, queries: [...newPRA.queries, ...extraPlatformQueries], status: newPRA.status === 'submitted' ? 'under-review' : newPRA.status };
    }

    setPraSubmissions(prev => [...prev, newPRA]);
    setNewPRAData({
      praName: '',
      groupType: 'standalone',
      entityType: 'company',
      submissionDate: '',
      email: '',
      contactNo: '',
      documentsSubmitted: [],
      comments: '',
      platformQueriesNote: ''
    });
    setNewPRADocFiles({});
    setNewPRADocOtherNote('');
    setShowUploadDialog(false);

    toast({
      title: "Success",
      description: "PRA submission added successfully"
    });
  };

  const handleAddQuery = () => {
    if (!newQuery.trim() || !selectedPRA) {
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
      createdBy: 'user'
    };

    setPraSubmissions(prev => 
      prev.map(pra => 
        pra.id === selectedPRA.id 
          ? { ...pra, queries: [...pra.queries, query] }
          : pra
      )
    );

    setNewQuery('');
    setShowQueryDialog(false);

    toast({
      title: "Success",
      description: "Query added successfully"
    });
  };

  const handleStatusUpdate = (praId: string, newStatus: string) => {
    setPraSubmissions(prev => 
      prev.map(pra => 
        pra.id === praId 
          ? { ...pra, status: newStatus as PRASubmission['status'] }
          : pra
      )
    );

    toast({
      title: "Success",
      description: "PRA status updated successfully"
    });
  };

  const handleViewPRADetails = (praId: string) => {
    navigate(`/resolution/pra/${praId}`);
  };
  
  // Generate Provisional Report function
  const generateProvisionalReport = () => {
    // Create report data from filtered PRAs
    const reportData: ReportData[] = filteredPRAs.map((pra, index) => {
      // Make last two entries have "No" for eligibility creator
      const isLastTwo = index >= filteredPRAs.length - 2;
      
      // AI eligibility status logic
      let aiStatus = '';
      if (pra.complianceScore >= 85) {
        aiStatus = 'Eligible by AI';
      } else if (pra.complianceScore >= 70) {
        aiStatus = 'Conditionally Eligible by AI';
      } else if (pra.complianceScore < 50) {
        aiStatus = 'Rejected by AI - Low compliance score';
      } else if (pra.queries.length > 2) {
        aiStatus = 'Rejected by AI - Multiple unresolved queries';
      } else {
        aiStatus = 'Under AI Review';
      }
      
      return {
        praId: pra.id,
        praName: pra.praName,
        entityType: pra.entityType,
        complianceStatus: pra.complianceScore >= 80 ? 'Compliant' : 'Needs Review',
        section29AStatus: pra.complianceScore >= 70 ? 'Compliant' : 'Non-Compliant',
        eligiblitycreator: isLastTwo ? 'No' : 'Yes',
        aiEligibilityStatus: aiStatus,
        financialStatus: 'Verified',
        documentsStatus: `${pra.documentsSubmitted.length} Verified`,
        remarks: pra.queries.length > 0 ? 'Subject to query resolution' : undefined
      };
    });

    const uniqueNames = Array.from(new Set(reportData.map(r => r.praName)));
    const primaryName = uniqueNames[0] || 'PRAs';
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

    setCurrentReport(newReport);
    toast({
      title: 'Report Generated',
      description: 'Provisional eligibility report created successfully'
    });
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
      
      setCurrentReport(updatedReport);
      setShowReportCustomization(false);
      
      toast({
        title: 'Customization Applied',
        description: 'Report layout updated successfully'
      });
    }
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

      // Find the selected report, remove it from finalReports, and add to postReports as signed
      setFinalReports(prev => {
        const reportToMove = prev.find(r => r.id === selectedReportForSigning.id);
        const remaining = prev.filter(r => r.id !== selectedReportForSigning.id);
        if (reportToMove) {
          const signedReport = { ...reportToMove, isSigned: true, signatureDetails } as FinalReport;
          setPostReports(pr => [signedReport, ...pr]);
        }
        return remaining;
      });

      setShowSignatureDialog(false);
      setSelectedReportForSigning(null);
      
      toast({
        title: 'Document Signed',
        description: `Report signed with ${signatureType} signature and moved to Post Reports`
      });
    }
  };

  const filteredPRAs = praSubmissions.filter(pra => {
    const matchesSearch = pra.praName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pra.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pra.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/resolution/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">EOI Details - {eoiData.entityName}</h1>
              <p className="text-muted-foreground">
                Manage PRA submissions and objections for this EOI invitation
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* <Button variant="default" size="sm" onClick={() => navigate('/resolution/pra-evaluation')}>
             Provisional Report
            </Button> */}
            {getStatusBadge(eoiData.status)}
          </div>
        </div>

        {/* EOI Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-semibold">{new Date(eoiData.dateOfIssue).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submission Deadline</p>
                  <p className="font-semibold">{new Date(eoiData.lastDateToSubmit).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total PRAs</p>
                  <p className="font-semibold">{eoiData.totalPRAs}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Objections</p>
                  <p className="font-semibold">{eoiData.totalObjections}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

       
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              EOI Received ({praSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="objections" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Objections Received ({objections.length})
            </TabsTrigger>
          </TabsList>

          {/* EOI Received Tab */}
          <TabsContent value="received" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      PRA Submissions
                    </CardTitle>
                    <CardDescription>
                      Review and manage Expression of Interest submissions from PRAs
                    </CardDescription>
                  </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={generateProvisionalReport}>
                        Generate Provisional Report
                      </Button>
                  <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload EOI
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Upload PRA Submission</DialogTitle>
                        <DialogDescription>
                          Add PRA details manually if received offline
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="praName">PRA Name</Label>
                          <Input
                            id="praName"
                            value={newPRAData.praName}
                            onChange={(e) => setNewPRAData(prev => ({ ...prev, praName: e.target.value }))}
                            placeholder="Enter PRA name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="groupType">Group Type</Label>
                            <Select value={newPRAData.groupType} onValueChange={(value) => setNewPRAData(prev => ({ ...prev, groupType: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standalone">Standalone</SelectItem>
                                <SelectItem value="group">Group</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="entityType">Entity Type</Label>
                            <Select value={newPRAData.entityType} onValueChange={(value) => setNewPRAData(prev => ({ ...prev, entityType: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="company">Company</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="individual">Individual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Comments and queries from user/platform */}
                        <div className="pt-2 border-t">
                          <h4 className="font-medium mb-2">Comments and queries from user/platform</h4>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="praComments">Comments from user</Label>
                              <Textarea
                                id="praComments"
                                placeholder="Enter any comments or notes regarding this submission"
                                value={newPRAData.comments}
                                onChange={(e) => setNewPRAData(prev => ({ ...prev, comments: e.target.value }))}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="praPlatformQueries">Queries from platform</Label>
                              <Textarea
                                id="praPlatformQueries"
                                placeholder="Enter queries (one per line) that the platform should raise for this submission"
                                value={newPRAData.platformQueriesNote}
                                onChange={(e) => setNewPRAData(prev => ({ ...prev, platformQueriesNote: e.target.value }))}
                                rows={3}
                              />
                              <p className="text-xs text-muted-foreground mt-1">Tip: Enter multiple queries on separate lines. Each will be added as a pending query.</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newPRAData.email}
                            onChange={(e) => setNewPRAData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactNo">Contact Number</Label>
                          <Input
                            id="contactNo"
                            value={newPRAData.contactNo}
                            onChange={(e) => setNewPRAData(prev => ({ ...prev, contactNo: e.target.value }))}
                            placeholder="Enter contact number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="submissionDate">Submission Date</Label>
                          <Input
                            id="submissionDate"
                            type="date"
                            value={newPRAData.submissionDate}
                            onChange={(e) => setNewPRAData(prev => ({ ...prev, submissionDate: e.target.value }))}
                          />
                        </div>
                        {/* Document Uploads by Category */}
                        <div className="pt-2 border-t">
                          <h4 className="font-medium mb-2">Upload Documents (by Category)</h4>
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {docCategories.map(cat => (
                              <div key={cat.id} className="flex items-center justify-between gap-2">
                                <div className="text-sm">
                                  <Label>{cat.label}</Label>
                                  {cat.id === 'others' && (
                                    <Input
                                      className="mt-1 h-8"
                                      placeholder="Specify other document"
                                      value={newPRADocOtherNote}
                                      onChange={(e) => setNewPRADocOtherNote(e.target.value)}
                                    />
                                  )}
                                  {newPRADocFiles[cat.id]?.length ? (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {newPRADocFiles[cat.id].length} file(s) selected
                                    </p>
                                  ) : (
                                    <p className="text-xs text-muted-foreground mt-1">No file selected</p>
                                  )}
                                </div>
                                <div>
                                  <input
                                    id={`upload-${cat.id}`}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files || []);
                                      if (files.length) {
                                        setNewPRADocFiles(prev => ({
                                          ...prev,
                                          [cat.id]: [ ...(prev[cat.id] || []), ...files.map(f => f.name) ]
                                        }));
                                      }
                                      e.currentTarget.value = '';
                                    }}
                                  />
                                  <Button variant="outline" size="sm" onClick={() => document.getElementById(`upload-${cat.id}`)?.click()}>
                                    Upload
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUploadPRA}>
                            Upload PRA
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                    </div>

            

          {/* Compare PRA Dialog */}
          <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Compare PRA Submissions</DialogTitle>
                <DialogDescription>
                  Select another PRA to compare against {selectedPRA?.praName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-2">Left</h4>
                    <div className="text-sm">
                      <p className="font-semibold">{selectedPRA?.praName}</p>
                      <p className="text-muted-foreground">{selectedPRA?.groupType} • {selectedPRA?.entityType}</p>
                      <p className="mt-1">EOI Received: {selectedPRA ? new Date(selectedPRA.submissionDate).toLocaleDateString() : '—'}</p>
                      <p>Score: {selectedPRA?.complianceScore ? `${selectedPRA.complianceScore}%` : '—'}</p>
                      <p>Documents: {selectedPRA?.documentsSubmitted?.length ?? 0}</p>
                    </div>
                  </div>
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-2">Right</h4>
                    <Select value={compareRightId} onValueChange={setCompareRightId} disabled={!selectedPRA}>
                      <SelectTrigger><SelectValue placeholder="Select PRA to compare" /></SelectTrigger>
                      <SelectContent>
                        {filteredPRAs.filter(p => p.id !== selectedPRA?.id).map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.praName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {compareRightId && (
                      <div className="text-sm mt-2">
                        {(() => {
                          const right = filteredPRAs.find(p => p.id === compareRightId) || praSubmissions.find(p => p.id === compareRightId);
                          if (!right) return null;
                          return (
                            <div>
                              <p className="font-semibold">{right.praName}</p>
                              <p className="text-muted-foreground">{right.groupType} • {right.entityType}</p>
                              <p className="mt-1">EOI Received: {new Date(right.submissionDate).toLocaleDateString()}</p>
                              <p>Score: {right.complianceScore ? `${right.complianceScore}%` : '—'}</p>
                              <p>Documents: {right.documentsSubmitted?.length ?? 0}</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                {/* Category-by-category summary */}
                <div className="border rounded-md p-3">
                  <h4 className="font-medium mb-2">Category Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Array.from({ length: Math.ceil(docCategories.length / 2) }).map((_, idx) => {
                      const leftCat = docCategories[idx * 2];
                      const rightCat = docCategories[idx * 2 + 1];
                      const rightPra = praSubmissions.find(p => p.id === compareRightId);
                      const renderCell = (cat: typeof docCategories[number] | undefined) => {
                        if (!cat) return <div className="border rounded px-3 py-2 opacity-50" />;
                        const leftCount = selectedPRA?.documentsByCategory?.[cat.id]?.length || 0;
                        const rightCount = rightPra?.documentsByCategory?.[cat.id]?.length || 0;
                        return (
                          <div className="flex items-center justify-between border rounded px-3 py-2">
                            <span className="truncate pr-2">{cat.label}</span>
                            <span className="tabular-nums">{leftCount} vs {rightCount}</span>
                          </div>
                        );
                      };
                      return (
                        <React.Fragment key={idx}>
                          {renderCell(leftCat)}
                          {renderCell(rightCat)}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setShowCompareDialog(false)}>Close</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filter */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search PRAs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under-review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* PRA Table */}
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name of PRAs</TableHead>
                          <TableHead>Group / Standalone</TableHead>
                          <TableHead>Entity Type</TableHead>
                          <TableHead>Date of receipt of EOI</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Queries</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPRAs.map((pra) => (
                          <TableRow key={pra.id}>
                            <TableCell className="font-medium">{pra.praName}</TableCell>
                            <TableCell>{pra.groupType === 'group' ? 'Group' : 'Standalone'}</TableCell>
                            <TableCell>
                              {pra.entityType === 'company' ? 'Company' : pra.entityType === 'partnership' ? 'Partnership' : 'Individual'}
                            </TableCell>
                            <TableCell>{new Date(pra.submissionDate).toLocaleDateString()}</TableCell>
                            <TableCell>{pra.complianceScore ? `${pra.complianceScore}%` : '—'}</TableCell>
                            <TableCell>{pra.queries?.length ?? 0}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewPRADetails(pra.id)}
                                >
                                  <Eye className="h-3 w-3 mr-1" /> View Details
                                </Button>
                                {/* <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => { setSelectedPRA(pra); setCompareRightId(''); setShowCompareDialog(true); }}
                                  disabled={filteredPRAs.filter(p => p.id !== pra.id).length === 0}
                                  title={filteredPRAs.filter(p => p.id !== pra.id).length === 0 ? 'Add another PRA to enable comparison' : ''}
                                >
                                  <BarChart3 className="h-3 w-3 mr-1" /> Compare
                                </Button> */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => { setSelectedPRA(pra); setShowQueryDialog(true); }}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" /> Add Query
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditPRAData({
                                      id: pra.id,
                                      praName: pra.praName,
                                      groupType: pra.groupType,
                                      entityType: pra.entityType,
                                      submissionDate: pra.submissionDate,
                                      email: pra.email,
                                      contactNo: pra.contactNo,
                                    });
                                    setShowEditDialog(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3 mr-1" /> Edit
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredPRAs.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No submissions found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Query Dialog (table view) */}
            <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Query for {selectedPRA?.praName || ''}</DialogTitle>
                  <DialogDescription>
                    Enter your query or comment for this PRA
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    placeholder="Enter your query..."
                    rows={4}
                  />
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

            {/* Edit PRA Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit PRA Submission</DialogTitle>
                  <DialogDescription>Modify PRA details and save</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editPraName">PRA Name</Label>
                    <Input id="editPraName" value={editPRAData.praName}
                      onChange={(e) => setEditPRAData(prev => ({ ...prev, praName: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editGroupType">Group Type</Label>
                      <Select value={editPRAData.groupType} onValueChange={(value) => setEditPRAData(prev => ({ ...prev, groupType: value }))}>
                        <SelectTrigger id="editGroupType"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standalone">Standalone</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editEntityType">Entity Type</Label>
                      <Select value={editPRAData.entityType} onValueChange={(value) => setEditPRAData(prev => ({ ...prev, entityType: value }))}>
                        <SelectTrigger id="editEntityType"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editEmail">Email</Label>
                      <Input id="editEmail" type="email" value={editPRAData.email}
                        onChange={(e) => setEditPRAData(prev => ({ ...prev, email: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="editContact">Contact Number</Label>
                      <Input id="editContact" value={editPRAData.contactNo}
                        onChange={(e) => setEditPRAData(prev => ({ ...prev, contactNo: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="editSubmissionDate">Submission Date</Label>
                    <Input id="editSubmissionDate" type="date" value={editPRAData.submissionDate}
                      onChange={(e) => setEditPRAData(prev => ({ ...prev, submissionDate: e.target.value }))} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                    <Button onClick={() => {
                      setPraSubmissions(prev => prev.map(p => p.id === editPRAData.id ? {
                        ...p,
                        praName: editPRAData.praName,
                        groupType: editPRAData.groupType as 'standalone' | 'group',
                        entityType: editPRAData.entityType as 'company' | 'partnership' | 'individual',
                        submissionDate: editPRAData.submissionDate,
                        email: editPRAData.email,
                        contactNo: editPRAData.contactNo,
                      } : p));
                      setShowEditDialog(false);
                      toast({ title: 'Updated', description: 'PRA submission updated' });
                    }}>Save Changes</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Objections Tab */}
          <TabsContent value="objections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  COC Member Objections
                </CardTitle>
                <CardDescription>
                  Review, respond, and finalize CoC objections. Auto-saves edits and maintains history.
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" onClick={exportObjectionsCSV}>
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                  </Button>
                  <Button variant="outline" onClick={printObjectionsPDF}>
                    <FileText className="h-4 w-4 mr-2" /> Print / PDF
                  </Button>
                  <Button variant="outline" onClick={sendReminder}>
                    <Send className="h-4 w-4 mr-2" /> Send Reminder
                  </Button>
                  <Button onClick={finalizeFinalPRAList}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Generate Final PRA List
                  </Button>
                  <Button variant="outline" onClick={copyDashboardLink}>
                    <ExternalLink className="h-4 w-4 mr-2" /> Copy Dashboard Link
                  </Button>
                 {/*  <Button variant="default" onClick={() => setShowAddObjectionDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Objection
                  </Button> */}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {objections.map((obj) => (
                    <Card key={obj.id} className={`border-l-4 ${obj.status === 'resolved' ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{obj.cocMemberName}</h4>
                            <p className="text-sm text-muted-foreground">Objection against: {obj.praName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(obj.status)}
                            <Button variant="outline" size="sm" onClick={() => setShowHistoryDialog(obj)}>History</Button>
                            {/* <Button size="sm" onClick={() => openRespond(obj)}>Respond</Button> */}
                          </div>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium">Objection Details:</p>
                            <p className="text-muted-foreground">{obj.objectionDetails}</p>
                          </div>
                          <div>
                            <p className="font-medium">Response from PRA / Platform:</p>
                            <p className="text-muted-foreground">{obj.response || '—'}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Received</p>
                              <p className="text-sm">{new Date(obj.submissionDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Include in Final</p>
                              <p className="text-sm">{obj.includeInFinal==null ? '—' : (obj.includeInFinal ? 'Yes' : 'No')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Remarks</p>
                              <p className="text-sm">{obj.remarks || '—'}</p>
                            </div>
                          </div>
                        </div>
                        {/* Comments */}
                        <div className="mt-3">
                          <Label>Comments</Label>
                          <div className="space-y-2 mt-1">
                            {(obj.comments || []).map(c => (
                              <div key={c.id} className="text-xs border rounded p-2 flex items-start justify-between">
                                <div>
                                  <div className="font-medium">{c.user}</div>
                                  <div className="text-muted-foreground">{c.text}</div>
                                </div>
                                <div className="text-muted-foreground">{new Date(c.timestamp).toLocaleString()}</div>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <Input placeholder="Add a comment" onKeyDown={(e) => {
                                const t = e.target as HTMLInputElement;
                                if (e.key === 'Enter') { addObjectionComment(obj, t.value); t.value=''; }
                              }} />
                              <Button size="sm" onClick={() => {
                                const input = (document.activeElement as HTMLInputElement);
                                if (input && input.tagName === 'INPUT') { addObjectionComment(obj, input.value); }
                              }}>Add</Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-3 gap-2">
                          <Button
                            variant={obj.status === 'resolved' ? 'default' : 'outline'}
                            aria-pressed={obj.status === 'resolved'}
                            size="sm"
                            onClick={() => approveObjection(obj)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant={obj.status === 'rejected' ? 'destructive' : 'outline'}
                            aria-pressed={obj.status === 'rejected'}
                            size="sm"
                            onClick={() => openReject(obj)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => openRespond(obj)}>Respond</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                 {/* Saved Final Reports */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Saved Final Reports
              </CardTitle>
              <CardDescription>Compiled final PRA lists with decisions, remarks, and responses. Stored for audit trail.</CardDescription>
            </CardHeader>
            <CardContent>
              {savedReports.length === 0 ? (
                <div className="text-sm text-muted-foreground">No final reports yet. Generate one from the Objections tab.</div>
              ) : (
                <div className="space-y-3">
                  {savedReports.map(rep => (
                    <div key={rep.id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{rep.name}</div>
                        <div className="text-xs text-muted-foreground">Created {new Date(rep.createdAt).toLocaleString()} • Entries: {rep.entries.length}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => exportReportCSV(rep)}>
                          <Download className="h-4 w-4 mr-2" /> Export CSV
                        </Button>
                        <Button size="sm" onClick={() => { setActiveTab('objections'); setShowReportDialog(rep); }}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
              </CardContent>
            </Card>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Reject Objection</DialogTitle>
                  <DialogDescription>
                    Objection by {activeObjection?.cocMemberName} on {activeObjection?.praName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Reason for Rejection</Label>
                    <Textarea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter the reason for rejecting this objection..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                    <Button onClick={confirmReject} disabled={rejectReason.trim().length === 0}>Mark Rejected</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Respond Dialog (editable with auto-save) */}
            <Dialog open={showRespondDialog} onOpenChange={setShowRespondDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Respond to Objection</DialogTitle>
                  <DialogDescription>
                    {activeObjection ? `${activeObjection.cocMemberName} • ${activeObjection.praName}` : ''}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Response from PRA / Platform</Label>
                    <Textarea rows={5} value={draftResponse} onChange={(e) => setDraftResponse(e.target.value)} placeholder="Enter response..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Include in Final</Label>
                      <Select value={draftInclude} onValueChange={setDraftInclude}>
                        <SelectTrigger>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Remarks</Label>
                      <Input value={draftRemarks} onChange={(e) => setDraftRemarks(e.target.value)} placeholder="Add remarks (optional)" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {autoSavedAt ? `Auto-saved at ${autoSavedAt}` : 'Auto-save active...'}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowRespondDialog(false)}>Close</Button>
                    <Button onClick={finalizeRespond}>Finalize Response</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* History Dialog */}
            <Dialog open={!!showHistoryDialog} onOpenChange={() => setShowHistoryDialog(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Activity Log</DialogTitle>
                  <DialogDescription>
                    Version and comment history for objection by {showHistoryDialog?.cocMemberName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                  {(showHistoryDialog?.history || []).map((h, idx) => (
                    <div key={idx} className="flex items-start justify-between border rounded p-2">
                      <div>
                        <div className="font-medium">{h.action}</div>
                        {h.changes && <div className="text-muted-foreground">{h.changes}</div>}
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <div>{h.user}</div>
                        <div>{h.timestamp}</div>
                      </div>
                    </div>
                  ))}
                  {(!showHistoryDialog?.history || showHistoryDialog?.history?.length === 0) && (
                    <div className="text-muted-foreground">No history yet.</div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Final PRA List Report Dialog */}
            <Dialog open={Boolean(showReportDialog)} onOpenChange={(open) => setShowReportDialog(open ? (showReportDialog as SavedReport) : null)}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{showReportDialog?.name}</DialogTitle>
                  <DialogDescription>Created at {showReportDialog ? new Date(showReportDialog.createdAt).toLocaleString() : ''}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="flex justify-end">
                    {showReportDialog && (
                      <Button variant="outline" onClick={() => exportReportCSV(showReportDialog)}>
                        <Download className="h-4 w-4 mr-2" /> Export CSV
                      </Button>
                    )}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PRA Name</TableHead>
                        <TableHead>Entity Type</TableHead>
                        <TableHead>Compliance Status</TableHead>
                        <TableHead>Section 29A Status</TableHead>
                        <TableHead>Eligibility creator</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {showReportDialog?.entries.map((e, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{e.praName}</TableCell>
                          <TableCell>{e.entityType}</TableCell>
                          <TableCell>{e.complianceStatus}</TableCell>
                          <TableCell>{e.section29AStatus}</TableCell>
                          <TableCell>{e.eligiblitycreator}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
         
        </Tabs>

        {/* Final Reports Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Final Reports
            </CardTitle>
            <CardDescription>
              Finalized reports with selected PRA data from provisional reports. These are stored for audit trail and compliance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {finalReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No final reports generated yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate a provisional report and use "Finalize & Save" to create final reports.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {finalReports.map((report) => (
                  <Card key={report.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{report.name}</CardTitle>
                            {report.isSigned && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <Shield className="h-3 w-3 mr-1" />
                                Signed
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            Generated on {new Date(report.generatedDate).toLocaleString()} • {report.totalEntries} entries
                            {report.isSigned && report.signatureDetails && (
                              <span> • Signed with {report.signatureDetails.signatureType} signature on {new Date(report.signatureDetails.signedDate).toLocaleDateString()}</span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Export functionality
                              const csvContent = [
                                // Header
                                ['PRA Name', 'Entity Type', 'Compliance Status', 'Section 29A Status', 'Eligibility Creator', 'AI Eligibility Status'].join(','),
                                // Data rows
                                ...report.selectedData.map(row => [
                                  row.praName,
                                  row.entityType,
                                  row.complianceStatus,
                                  row.section29AStatus,
                                  row.eligiblitycreator,
                                  row.aiEligibilityStatus
                                ].join(','))
                              ].join('\n');
                              
                              const blob = new Blob([csvContent], { type: 'text/csv' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${report.name}.csv`;
                              a.click();
                              window.URL.revokeObjectURL(url);
                              
                              toast({
                                title: 'Export Complete',
                                description: 'Final report exported as CSV'
                              });
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                          {!report.isSigned && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReportForSigning(report);
                                setShowSignatureDialog(true);
                              }}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Sign Report
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setViewReportDialog(report)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      
                      {/* Preview of first few entries */}
                      
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
 {/* Post Reports Section */}
 <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Post Reports
            </CardTitle>
            <CardDescription>
              Signed reports are archived here for records, further circulation, or uploads to authorities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {postReports.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No signed reports yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Sign a final report to move it here automatically.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {postReports.map((report) => (
                  <Card key={report.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{report.name}</CardTitle>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Signed
                            </Badge>
                          </div>
                          <CardDescription>
                            Generated on {new Date(report.generatedDate).toLocaleString()} • {report.totalEntries} entries
                            {report.signatureDetails && (
                              <span> • Signed with {report.signatureDetails.signatureType} signature on {new Date(report.signatureDetails.signedDate).toLocaleDateString()}</span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const csvContent = [
                                ['PRA Name', 'Entity Type', 'Compliance Status', 'Section 29A Status', 'Eligibility Creator', 'AI Eligibility Status'].join(','),
                                ...report.selectedData.map(row => [
                                  row.praName,
                                  row.entityType,
                                  row.complianceStatus,
                                  row.section29AStatus,
                                  row.eligiblitycreator,
                                  row.aiEligibilityStatus
                                ].join(','))
                              ].join('\n');
                              const blob = new Blob([csvContent], { type: 'text/csv' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${report.name}.csv`;
                              a.click();
                              window.URL.revokeObjectURL(url);
                              toast({ title: 'Export Complete', description: 'Signed report exported as CSV' });
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReportForCirculation(report);
                              setShowCirculationDialog(true);
                            }}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Circulate
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setViewReportDialog(report)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Provisional Report Dialog */}
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
                    <Button size="sm" disabled={selectedReportRows.length === 0} onClick={() => {
                      if (currentReport) {
                        // Get selected data based on selected rows
                        const selectedData = selectedReportRows.map(index => currentReport.data[index]);
                        
                        // Create final report
                        const finalReport: FinalReport = {
                          id: Date.now().toString(),
                          name: `Final Report - ${new Date().toLocaleDateString()} - ${selectedData.length} entries`,
                          generatedDate: new Date().toISOString(),
                          selectedData: selectedData,
                          totalEntries: selectedData.length
                        };
                        
                        // Add to final reports
                        setFinalReports(prev => [...prev, finalReport]);
                        
                        toast({ 
                          title: 'Report Finalized', 
                          description: `Final report created with ${selectedData.length} selected entries` 
                        }); 
                        setCurrentReport(null);
                        setSelectedReportRows([]);
                      }
                    }}>
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
                            {row[field as keyof ReportData] || '-'}
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

        {/* Circulate Post Report Dialog */}
        <Dialog open={showCirculationDialog} onOpenChange={setShowCirculationDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Circulate Provisional PRA Report</DialogTitle>
              <DialogDescription>
                Automated circulation to CoC Members and PRAs with optional manual controls.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Context */}
              <div className="p-4 rounded-md bg-blue-50 text-blue-900 text-sm">
                Circulation of Provisional PRA Report to CoC Members & PRAs ensures transparency, compliance and an opportunity to raise objections.
              </div>

              {/* Auto Email Cycle */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Auto-Mail Cycle</Label>
                <div className="flex items-center gap-2">
                  <input id="autoEmailEnabled" type="checkbox" checked={autoEmailEnabled} onChange={(e)=>setAutoEmailEnabled(e.target.checked)} />
                  <Label htmlFor="autoEmailEnabled">Enable automatic send to all recipients</Label>
                </div>
                <p className="text-xs text-muted-foreground">If enabled, the system will send the report automatically to selected stakeholders with the configured template.</p>
              </div>

              {/* Manual options when auto is off */}
              {!autoEmailEnabled && (
                <div className="space-y-4 border rounded-lg p-4">
                  <Label className="text-base font-semibold">Manual Options</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <input id="includeCoC" type="checkbox" checked={includeCoC} onChange={(e)=>setIncludeCoC(e.target.checked)} />
                      <Label htmlFor="includeCoC">Include CoC Members</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="includePRAs" type="checkbox" checked={includePRAs} onChange={(e)=>setIncludePRAs(e.target.checked)} />
                      <Label htmlFor="includePRAs">Include PRAs</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="attachPDF" type="checkbox" checked={attachPDF} onChange={(e)=>setAttachPDF(e.target.checked)} />
                      <Label htmlFor="attachPDF">Attach Provisional List PDF</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label>Email Subject</Label>
                      <Input value={emailSubject} onChange={e=>setEmailSubject(e.target.value)} />
                    </div>
                    <div>
                      <Label>Email Body</Label>
                      <Textarea rows={6} value={emailBody} onChange={e=>setEmailBody(e.target.value)} />
                      <p className="text-xs text-muted-foreground mt-1">Attachment will include key evaluation parameters, eligibility status and Section 29A summary.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Access Info */}
              <div className="text-xs text-muted-foreground">
                PRAs can also access the circulated report from their dashboard: PRA Dashboard → Reports → Provisional List Mail cycle.
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={()=>setShowCirculationDialog(false)}>Cancel</Button>
                <Button onClick={()=>{
                  const name = selectedReportForCirculation?.name || 'Report';
                  toast({
                    title: 'Circulation Initiated',
                    description: autoEmailEnabled
                      ? `${name} will be auto-mailed to CoC Members and PRAs with PDF attachment.`
                      : `${name} prepared for manual circulation${includeCoC? ' to CoC':''}${includePRAs? ' & PRAs':''}${attachPDF? ' with PDF attachment':''}.`
                  });
                  setShowCirculationDialog(false);
                  setSelectedReportForCirculation(null);
                }}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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

        {/* View Final Report Details Dialog */}
        {viewReportDialog && (
          <Dialog open={!!viewReportDialog} onOpenChange={() => setViewReportDialog(null)}>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Report Data</DialogTitle>
                <DialogDescription>
                  {viewReportDialog.name} • Generated on {new Date(viewReportDialog.generatedDate).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Final Report Details</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Export PDF functionality
                        toast({
                          title: 'PDF Export',
                          description: 'PDF export functionality coming soon'
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Export Excel functionality
                        const csvContent = [
                          // Header
                          ['PRA Name', 'Entity Type', 'Compliance Status', 'Section 29A Status', 'Eligibility Creator', 'AI Eligibility Status'].join(','),
                          // Data rows
                          ...viewReportDialog.selectedData.map(row => [
                            row.praName,
                            row.entityType,
                            row.complianceStatus,
                            row.section29AStatus,
                            row.eligiblitycreator,
                            row.aiEligibilityStatus
                          ].join(','))
                        ].join('\n');
                        
                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${viewReportDialog.name}.csv`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        
                        toast({
                          title: 'Excel Export Complete',
                          description: 'Report exported as CSV file'
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PRA Name</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Compliance Status</TableHead>
                      <TableHead>Section 29A Status</TableHead>
                      <TableHead>Eligibility creator</TableHead>
                      <TableHead>AI Eligibility Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewReportDialog.selectedData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.praName}</TableCell>
                        <TableCell>{row.entityType}</TableCell>
                        <TableCell>
                          <Badge variant={row.complianceStatus === 'Compliant' ? 'default' : 'secondary'}>
                            {row.complianceStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.section29AStatus === 'Compliant' ? 'default' : 'secondary'}>
                            {row.section29AStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.eligiblitycreator === 'Yes' ? 'default' : 'destructive'}>
                            {row.eligiblitycreator}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              row.aiEligibilityStatus.includes('Eligible by AI') ? 'default' :
                              row.aiEligibilityStatus.includes('Rejected by AI') ? 'destructive' :
                              'secondary'
                            }
                          >
                            {row.aiEligibilityStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Digital Signature Dialog */}
        <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Digital Signature</DialogTitle>
              <DialogDescription>
                Sign the final report with your digital credentials
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
      </div>
    </DashboardLayout>
  );
};

export default EOIDetails;

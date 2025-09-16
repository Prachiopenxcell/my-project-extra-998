import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from "@/components/ui/button";
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
  ArrowLeft, Calendar, FileText, Users, User, DollarSign, Clock, AlertTriangle,
  CheckCircle, Building, Scale, Phone, Mail, MapPin, Download, Eye, Edit,
  Plus, X, Save, Gavel, BookOpen, Bell, MessageSquare, Upload, Trash2,
  ExternalLink, Copy, Share, Filter, Search, MoreHorizontal, History, Send
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
  
  // Stage 2 specific fields
  applicationStatus: string;
  adjudicatingAuthority: string;
  filedUnder?: string;
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

interface InterimOrder {
  id: string;
  date: string;
  description: string;
  orderCopy: string;
  status: 'pending' | 'complied' | 'appealed';
}

interface FinalOrder {
  date: string;
  description: string;
  orderCopy: string;
  outcome: 'favorable' | 'unfavorable' | 'partial';
}

interface Reply {
  id: string;
  submittingParty: string;
  document: string;
  date: string;
  summary: string;
  status: 'filed' | 'pending' | 'rejected';
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
  description: string;
}

const LitigationCaseDetails = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("case-details");
  const [newNote, setNewNote] = useState("");

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
    
    // Stage 2 specific data
    applicationStatus: "numbered",
    adjudicatingAuthority: "Hon'ble Justice A.K. Sharma, NCLT Mumbai",
    filedUnder: "IBC 2016, Section 7",
    particulars: "Application for initiation of Corporate Insolvency Resolution Process against Beta Industries Pvt Ltd under Section 7 of the Insolvency and Bankruptcy Code, 2016 for default in payment of financial debt amounting to Rs. 25,00,000/-",
    reliefSought: "Initiation of CIRP against the Corporate Debtor, appointment of Interim Resolution Professional, moratorium on legal proceedings, and recovery of outstanding dues",
    
    interimOrders: [
      {
        id: "io-001",
        date: "2025-01-10",
        description: "Interim order for admission of application and appointment of IRP",
        orderCopy: "/documents/interim-order-001.pdf",
        status: "complied"
      },
      {
        id: "io-002",
        date: "2025-01-25",
        description: "Order for extension of CIRP period by 90 days",
        orderCopy: "/documents/interim-order-002.pdf",
        status: "pending"
      }
    ],
    
    finalOrder: null,
    
    replies: [
      {
        id: "rp-001",
        submittingParty: "Beta Industries Pvt Ltd",
        document: "/documents/reply-001.pdf",
        date: "2025-01-15",
        summary: "Reply contesting the application with objections on maintainability and quantum of debt",
        status: "filed"
      },
      {
        id: "rp-002",
        submittingParty: "ABC Suppliers",
        document: "/documents/reply-002.pdf",
        date: "2025-01-18",
        summary: "Supporting reply as operational creditor with additional claims",
        status: "filed"
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
        attendees: ["Adv. Rajesh Sharma", "Adv. Priya Mehta (Respondent)"]
      },
      {
        id: "hearing-002",
        date: "2025-01-15",
        time: "11:00 AM",
        type: "Reply Hearing",
        status: "completed",
        outcome: "Application admitted, IRP appointed, moratorium declared",
        nextDate: "2025-02-20",
        attendees: ["Adv. Rajesh Sharma", "Adv. Priya Mehta", "IRP - CA Suresh Kumar"]
      },
      {
        id: "hearing-003",
        date: "2025-02-20",
        time: "2:30 PM",
        type: "Progress Review",
        status: "scheduled",
        outcome: "",
        nextDate: "",
        attendees: ["Adv. Rajesh Sharma", "IRP - CA Suresh Kumar"]
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
        description: "Application for initiation of CIRP filed against Beta Industries Pvt Ltd"
      },
      {
        id: "audit-002",
        date: "2024-12-10",
        time: "11:00 AM",
        action: "Notice issued",
        description: "Notice issued to respondents for first hearing"
      },
      {
        id: "audit-003",
        date: "2025-01-15",
        time: "12:00 PM",
        action: "First hearing",
        description: "First hearing held, application admitted, IRP appointed"
      }
    ]
  });

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
                {caseDetails.auditLog.map(a => (
                  <div key={a.id} className="p-3 border rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{a.action}</div>
                      <div className="text-xs text-muted-foreground">{a.date} • {a.time}</div>
                    </div>
                    <div className="text-muted-foreground mt-1">{a.description}</div>
                  </div>
                ))}
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

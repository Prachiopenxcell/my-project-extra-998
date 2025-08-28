import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Scale, 
  Calendar, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  Bell, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Download, 
  Eye, 
  Edit, 
  Plus, 
  Send,
  Gavel,
  Users,
  Award,
  History
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface CaseDetails {
  id: string;
  caseNumber: string;
  title: string;
  status: 'pending' | 'critical' | 'won' | 'lost';
  court: string;
  filedDate: string;
  nextHearing?: string;
  lastHearing?: string;
  plaintiff: string;
  defendant: string;
  amount: number;
  lawyer: LawyerDetails;
  adjudicatingAuthority: string;
  filedUnder: string;
  applicationFiled: boolean;
  eFilingReceipt: boolean;
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
  uploadDate: string;
  type: string;
  size: string;
}

interface Hearing {
  id: string;
  date: string;
  time: string;
  description: string;
  outcome?: string;
}

interface CostBreakdown {
  drafting: number;
  filing: number;
  appearances: number;
  total: number;
}

const LitigationCaseDetails = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("case-details");
  const [newNote, setNewNote] = useState("");

  // Mock data - replace with actual API calls
  const [caseDetails] = useState<CaseDetails>({
    id: "ac-001",
    caseNumber: "NCLT/MB/123/2024",
    title: "Acme Corporation Ltd vs XYZ Limited",
    status: "pending",
    court: "NCLT Mumbai",
    filedDate: "2024-12-05",
    nextHearing: "2025-02-20",
    plaintiff: "Acme Corporation Ltd",
    defendant: "XYZ Limited, ABC Industries",
    amount: 250000,
    lawyer: {
      name: "Adv. Rajesh Sharma",
      specialization: "NCLT, NCLAT, Insolvency Law",
      contact: "+91-98765-43210",
      email: "rajesh.sharma@lawfirm.com",
      address: "Law Chamber, BKC, Mumbai - 400051"
    },
    adjudicatingAuthority: "Justice R.K. Sharma",
    filedUnder: "IBC, Section 7",
    applicationFiled: true,
    eFilingReceipt: true
  });

  const [documents] = useState<Document[]>([
    { id: "doc-001", name: "Application Filed (v2.1)", uploadDate: "2024-12-05", type: "PDF", size: "2.3 MB" },
    { id: "doc-002", name: "E-filing Receipt", uploadDate: "2024-12-05", type: "PDF", size: "156 KB" },
    { id: "doc-003", name: "Interim Order", uploadDate: "2025-01-20", type: "PDF", size: "1.1 MB" },
    { id: "doc-004", name: "Counter Reply", uploadDate: "2025-01-15", type: "PDF", size: "3.4 MB" }
  ]);

  const [hearings] = useState<Hearing[]>([
    { 
      id: "h-001", 
      date: "2025-02-20", 
      time: "10:30 AM", 
      description: "Next Hearing - Final Arguments" 
    },
    { 
      id: "h-002", 
      date: "2025-01-20", 
      time: "2:00 PM", 
      description: "Interim order passed, next hearing scheduled",
      outcome: "Interim relief granted"
    },
    { 
      id: "h-003", 
      date: "2024-12-15", 
      time: "11:00 AM", 
      description: "First hearing, counter reply deadline set",
      outcome: "Counter reply deadline: 15 Jan 2025"
    },
    { 
      id: "h-004", 
      date: "2024-12-05", 
      time: "9:30 AM", 
      description: "Case filed and numbered",
      outcome: "Case admitted and numbered"
    }
  ]);

  const [costs] = useState<CostBreakdown>({
    drafting: 25000,
    filing: 15000,
    appearances: 85000,
    total: 125000
  });

  const [notes, setNotes] = useState([
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
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'critical': { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      'won': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'lost': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="case-details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Case Details
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Summary
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
                      <p>Pending Adjudication</p>
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
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Edit className="h-3 w-3" />
                    Edit Details
                  </Button>
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
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Edit className="h-3 w-3" />
                    Edit Parties
                  </Button>
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
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(doc.uploadDate)} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
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
                  {hearings.map((hearing) => (
                    <div key={hearing.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">
                              {formatDate(hearing.date)} at {hearing.time}
                            </span>
                            {hearing.id === "h-001" && (
                              <Badge className="bg-blue-100 text-blue-800">Next</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{hearing.description}</p>
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
                    <p className="font-medium">{caseDetails.lawyer.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{caseDetails.lawyer.contact}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{caseDetails.lawyer.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{caseDetails.lawyer.address}</span>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Court Practice:</Label>
                    <p className="text-sm">{caseDetails.lawyer.specialization}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Costs Incurred:</Label>
                    <p className="text-lg font-semibold">{formatCurrency(costs.total)}</p>
                    <div className="text-sm text-muted-foreground">
                      Drafting: {formatCurrency(costs.drafting)} • Filing: {formatCurrency(costs.filing)} • Appearances: {formatCurrency(costs.appearances)}
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

          {/* Other tabs content can be added here */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Case Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Case summary content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications & Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Notifications content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed cost breakdown will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Audit trail information will be displayed here.</p>
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

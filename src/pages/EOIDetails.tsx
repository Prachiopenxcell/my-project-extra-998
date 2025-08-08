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
  BarChart3
} from 'lucide-react';

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

interface Objection {
  id: string;
  cocMemberName: string;
  praName: string;
  objectionDetails: string;
  submissionDate: string;
  status: 'pending' | 'resolved';
  response?: string;
}

const EOIDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [selectedPRA, setSelectedPRA] = useState<PRASubmission | null>(null);
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
    totalObjections: 3
  });

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
      status: 'under-review',
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
    }
  ]);

  // Mock objections
  const [objections] = useState<Objection[]>([
    {
      id: '1',
      cocMemberName: 'John Doe',
      praName: 'Resolution Partners LLC',
      objectionDetails: 'Concerns about the financial capacity and previous track record of the PRA',
      submissionDate: '2024-02-14',
      status: 'pending',
    },
    {
      id: '2',
      cocMemberName: 'Jane Smith',
      praName: 'Strategic Investments Ltd.',
      objectionDetails: 'Incomplete documentation - missing consortium agreement',
      submissionDate: '2024-02-15',
      status: 'resolved',
      response: 'Consortium agreement has been submitted and verified'
    }
  ]);

  const [newPRAData, setNewPRAData] = useState({
    praName: '',
    groupType: 'standalone',
    entityType: 'company',
    submissionDate: '',
    email: '',
    contactNo: '',
    documentsSubmitted: []
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

    const newPRA: PRASubmission = {
      id: Date.now().toString(),
      praName: newPRAData.praName,
      groupType: newPRAData.groupType as 'standalone' | 'group',
      entityType: newPRAData.entityType as 'company' | 'partnership' | 'individual',
      submissionDate: newPRAData.submissionDate,
      email: newPRAData.email,
      contactNo: newPRAData.contactNo,
      status: 'submitted',
      documentsSubmitted: [],
      complianceScore: 0,
      queries: []
    };

    setPraSubmissions(prev => [...prev, newPRA]);
    setNewPRAData({
      praName: '',
      groupType: 'standalone',
      entityType: 'company',
      submissionDate: '',
      email: '',
      contactNo: '',
      documentsSubmitted: []
    });
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

  const filteredPRAs = praSubmissions.filter(pra => {
    const matchesSearch = pra.praName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pra.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pra.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout userType="service_provider">
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
                  <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload EOI
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
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

                  {/* PRA List */}
                  <div className="space-y-4">
                    {filteredPRAs.map((pra) => (
                      <Card key={pra.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="font-semibold">{pra.praName}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {pra.groupType} • {pra.entityType}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(pra.status)}
                              <Select value={pra.status} onValueChange={(value) => handleStatusUpdate(pra.id, value)}>
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
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {pra.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {pra.contactNo}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(pra.submissionDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              Score: {pra.complianceScore}%
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <span>Documents: {pra.documentsSubmitted.length}</span>
                              <span>Queries: {pra.queries.length}</span>
                            </div>
                            <div className="flex gap-2">
                              <Dialog open={showQueryDialog && selectedPRA?.id === pra.id} onOpenChange={(open) => {
                                setShowQueryDialog(open);
                                if (open) setSelectedPRA(pra);
                              }}>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Add Query
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Query for {pra.praName}</DialogTitle>
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/resolution/pra/${pra.id}`)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>

                          {/* Queries Preview */}
                          {pra.queries.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <h5 className="font-medium mb-2">Recent Queries:</h5>
                              <div className="space-y-2">
                                {pra.queries.slice(0, 2).map((query) => (
                                  <div key={query.id} className="text-sm bg-muted/50 p-2 rounded">
                                    <p className="font-medium">{query.question}</p>
                                    {query.response && (
                                      <p className="text-muted-foreground mt-1">Response: {query.response}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(query.createdAt).toLocaleDateString()}
                                      </span>
                                      {getStatusBadge(query.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  Review and respond to objections raised by COC members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {objections.map((objection) => (
                    <Card key={objection.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{objection.cocMemberName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Objection against: {objection.praName}
                            </p>
                          </div>
                          {getStatusBadge(objection.status)}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-sm">Objection Details:</h5>
                            <p className="text-sm text-muted-foreground">{objection.objectionDetails}</p>
                          </div>
                          
                          {objection.response && (
                            <div>
                              <h5 className="font-medium text-sm">Response:</h5>
                              <p className="text-sm text-muted-foreground">{objection.response}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Submitted: {new Date(objection.submissionDate).toLocaleDateString()}</span>
                            {objection.status === 'pending' && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                Respond
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EOIDetails;

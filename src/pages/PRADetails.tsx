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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Send
} from 'lucide-react';

interface PRAData {
  id: string;
  praName: string;
  groupType: 'standalone' | 'group';
  entityType: 'company' | 'partnership' | 'individual';
  submissionDate: string;
  email: string;
  contactNo: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  complianceScore: number;
  section29ACompliance: boolean;
  documents: Document[];
  queries: Query[];
  financialInfo: FinancialInfo;
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

  // Mock PRA data
  const [praData, setPraData] = useState<PRAData>({
    id: '1',
    praName: 'Resolution Partners LLC',
    groupType: 'standalone',
    entityType: 'company',
    submissionDate: '2024-02-10',
    email: 'contact@resolutionpartners.com',
    contactNo: '+91-9876543210',
    status: 'under-review',
    complianceScore: 92,
    section29ACompliance: true,
    documents: [
      {
        id: '1',
        name: 'EOI Letter Signed by PRAs.pdf',
        type: 'EOI Letter',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '2.1 MB',
        remarks: 'All signatures verified'
      },
      {
        id: '2',
        name: '29A Eligibility Undertaking.pdf',
        type: '29A Undertaking',
        status: 'verified',
        uploadDate: '2024-02-10',
        size: '1.5 MB'
      },
      {
        id: '3',
        name: 'Net Worth Certificate.pdf',
        type: 'Financial Document',
        status: 'submitted',
        uploadDate: '2024-02-11',
        size: '800 KB',
        remarks: 'Pending verification'
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

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/resolution/pra-evaluation')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to PRA Evaluation
            </Button>
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
          <TabsList className="grid w-full grid-cols-4">
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
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Submission Date</Label>
                      <p className="font-medium">{new Date(praData.submissionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PRADetails;

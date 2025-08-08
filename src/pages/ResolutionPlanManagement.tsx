import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  DollarSign,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  Send,
  Bot,
  Info,
  ExternalLink
} from 'lucide-react';

interface ResolutionPlan {
  id: string;
  praName: string;
  groupType: 'standalone' | 'group';
  entityType: 'company' | 'partnership' | 'individual' | 'fund';
  submissionDate: string;
  modifiedSubmissionDate?: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'modified';
  planValue: number;
  liquidationValue: number;
  fairValue: number;
  complianceScore: number;
  npvAnalysis: NPVAnalysis;
  queries: Query[];
  documents: Document[];
  evaluationMatrix: EvaluationItem[];
}

interface NPVAnalysis {
  discountingFactor: number;
  cirpCost: number;
  liquidationCost: number;
  liquidatorFee: number;
  statutoryClaims: number;
  netDistribution: number;
}

interface Query {
  id: string;
  question: string;
  response?: string;
  status: 'pending' | 'answered';
  createdAt: string;
  createdBy: 'system' | 'user';
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  url: string;
}

interface EvaluationItem {
  id: string;
  criteria: string;
  weight: number;
  score: number;
  remarks: string;
}

const ResolutionPlanManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('plans');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ResolutionPlan | null>(null);
  const [newQuery, setNewQuery] = useState('');

  // Mock resolution plans data
  const [resolutionPlans, setResolutionPlans] = useState<ResolutionPlan[]>([
    {
      id: '1',
      praName: 'Resolution Partners LLC',
      groupType: 'standalone',
      entityType: 'company',
      submissionDate: '2024-02-10',
      modifiedSubmissionDate: '2024-02-20',
      status: 'under-review',
      planValue: 15000000,
      liquidationValue: 12000000,
      fairValue: 18000000,
      complianceScore: 92,
      npvAnalysis: {
        discountingFactor: 12.5,
        cirpCost: 500000,
        liquidationCost: 800000,
        liquidatorFee: 300000,
        statutoryClaims: 200000,
        netDistribution: 13200000
      },
      queries: [
        {
          id: '1',
          question: 'Please clarify the proposed timeline for debt restructuring',
          response: 'We propose a 24-month restructuring timeline with quarterly milestones',
          status: 'answered',
          createdAt: '2024-02-11',
          createdBy: 'user'
        },
        {
          id: '2',
          question: 'Provide details on the funding arrangement for the resolution plan',
          status: 'pending',
          createdAt: '2024-02-15',
          createdBy: 'system'
        }
      ],
      documents: [
        {
          id: '1',
          name: 'Resolution Plan - Main Document.pdf',
          type: 'PDF',
          uploadDate: '2024-02-10',
          size: '2.5 MB',
          url: '#'
        },
        {
          id: '2',
          name: 'Financial Projections.xlsx',
          type: 'Excel',
          uploadDate: '2024-02-10',
          size: '1.2 MB',
          url: '#'
        }
      ],
      evaluationMatrix: [
        {
          id: '1',
          criteria: 'Financial Viability',
          weight: 30,
          score: 85,
          remarks: 'Strong financial projections with realistic assumptions'
        },
        {
          id: '2',
          criteria: 'Implementation Timeline',
          weight: 25,
          score: 90,
          remarks: 'Well-defined timeline with clear milestones'
        }
      ]
    },
    {
      id: '2',
      praName: 'Strategic Investments Ltd.',
      groupType: 'group',
      entityType: 'company',
      submissionDate: '2024-02-12',
      status: 'submitted',
      planValue: 18500000,
      liquidationValue: 14000000,
      fairValue: 20000000,
      complianceScore: 78,
      npvAnalysis: {
        discountingFactor: 11.0,
        cirpCost: 450000,
        liquidationCost: 750000,
        liquidatorFee: 280000,
        statutoryClaims: 180000,
        netDistribution: 17340000
      },
      queries: [],
      documents: [
        {
          id: '3',
          name: 'Resolution Plan Document.pdf',
          type: 'PDF',
          uploadDate: '2024-02-12',
          size: '3.1 MB',
          url: '#'
        }
      ],
      evaluationMatrix: []
    }
  ]);

  const [uploadData, setUploadData] = useState({
    praName: '',
    groupType: 'standalone',
    entityType: 'company',
    submissionDate: '',
    planValue: '',
    documents: []
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'submitted': { variant: 'secondary' as const, label: 'Submitted', icon: FileText },
      'under-review': { variant: 'default' as const, label: 'Under Review', icon: RefreshCw },
      'approved': { variant: 'default' as const, label: 'Approved', icon: CheckCircle },
      'rejected': { variant: 'destructive' as const, label: 'Rejected', icon: XCircle },
      'modified': { variant: 'secondary' as const, label: 'Modified', icon: Edit }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleUploadPlan = () => {
    if (!uploadData.praName || !uploadData.submissionDate || !uploadData.planValue) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newPlan: ResolutionPlan = {
      id: Date.now().toString(),
      praName: uploadData.praName,
      groupType: uploadData.groupType as 'standalone' | 'group',
      entityType: uploadData.entityType as 'company' | 'partnership' | 'individual' | 'fund',
      submissionDate: uploadData.submissionDate,
      status: 'submitted',
      planValue: parseInt(uploadData.planValue),
      liquidationValue: 0,
      fairValue: 0,
      complianceScore: 0,
      npvAnalysis: {
        discountingFactor: 0,
        cirpCost: 0,
        liquidationCost: 0,
        liquidatorFee: 0,
        statutoryClaims: 0,
        netDistribution: 0
      },
      queries: [],
      documents: [],
      evaluationMatrix: []
    };

    setResolutionPlans(prev => [...prev, newPlan]);
    setUploadData({
      praName: '',
      groupType: 'standalone',
      entityType: 'company',
      submissionDate: '',
      planValue: '',
      documents: []
    });
    setShowUploadDialog(false);

    toast({
      title: "Success",
      description: "Resolution plan uploaded successfully"
    });
  };

  const handleAddQuery = () => {
    if (!newQuery.trim() || !selectedPlan) {
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

    setResolutionPlans(prev => 
      prev.map(plan => 
        plan.id === selectedPlan.id 
          ? { ...plan, queries: [...plan.queries, query] }
          : plan
      )
    );

    setNewQuery('');
    setShowQueryDialog(false);

    toast({
      title: "Success",
      description: "Query added successfully"
    });
  };

  const handleStatusUpdate = (planId: string, newStatus: string) => {
    setResolutionPlans(prev => 
      prev.map(plan => 
        plan.id === planId 
          ? { ...plan, status: newStatus as ResolutionPlan['status'] }
          : plan
      )
    );

    toast({
      title: "Success",
      description: "Plan status updated successfully"
    });
  };

  const filteredPlans = resolutionPlans.filter(plan => {
    const matchesSearch = plan.praName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const planStats = {
    total: resolutionPlans.length,
    submitted: resolutionPlans.filter(p => p.status === 'submitted').length,
    underReview: resolutionPlans.filter(p => p.status === 'under-review').length,
    approved: resolutionPlans.filter(p => p.status === 'approved').length,
    totalValue: resolutionPlans.reduce((sum, plan) => sum + plan.planValue, 0)
  };

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
              <h1 className="text-2xl font-bold">Resolution Plan Management</h1>
              <p className="text-muted-foreground">
                Manage and evaluate resolution plans from PRAs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Resolution Plan</DialogTitle>
                  <DialogDescription>
                    Add a resolution plan on behalf of a PRA
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="praName">PRA Name</Label>
                    <Input
                      id="praName"
                      value={uploadData.praName}
                      onChange={(e) => setUploadData(prev => ({ ...prev, praName: e.target.value }))}
                      placeholder="Enter PRA name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="groupType">Group Type</Label>
                      <Select value={uploadData.groupType} onValueChange={(value) => setUploadData(prev => ({ ...prev, groupType: value }))}>
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
                      <Select value={uploadData.entityType} onValueChange={(value) => setUploadData(prev => ({ ...prev, entityType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="fund">Fund</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="planValue">Plan Value (INR)</Label>
                    <Input
                      id="planValue"
                      type="number"
                      value={uploadData.planValue}
                      onChange={(e) => setUploadData(prev => ({ ...prev, planValue: e.target.value }))}
                      placeholder="Enter plan value"
                    />
                  </div>
                  <div>
                    <Label htmlFor="submissionDate">Submission Date</Label>
                    <Input
                      id="submissionDate"
                      type="date"
                      value={uploadData.submissionDate}
                      onChange={(e) => setUploadData(prev => ({ ...prev, submissionDate: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUploadPlan}>
                      Upload Plan
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                  <p className="text-2xl font-bold">{planStats.total}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                  <p className="text-2xl font-bold">{planStats.underReview}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{planStats.approved}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(planStats.totalValue)}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Resolution Plans
                </CardTitle>
                <CardDescription>
                  Review and manage submitted resolution plans
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search resolution plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
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

              {/* Plans List */}
              <div className="space-y-4">
                {filteredPlans.map((plan) => (
                  <Card key={plan.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold text-lg">{plan.praName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {plan.groupType} • {plan.entityType} • Submitted: {new Date(plan.submissionDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(plan.planValue)}
                            </div>
                            <div className="text-xs text-muted-foreground">Plan Value</div>
                          </div>
                          {getStatusBadge(plan.status)}
                          <Select value={plan.status} onValueChange={(value) => handleStatusUpdate(plan.id, value)}>
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Financial Overview</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Plan Value:</span>
                              <span className="font-medium">{formatCurrency(plan.planValue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Liquidation Value:</span>
                              <span className="font-medium">{formatCurrency(plan.liquidationValue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Fair Value:</span>
                              <span className="font-medium">{formatCurrency(plan.fairValue)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Compliance & Evaluation</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Compliance Score:</span>
                              <span className="font-medium">{plan.complianceScore}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Documents:</span>
                              <span className="font-medium">{plan.documents.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Queries:</span>
                              <span className="font-medium">{plan.queries.length}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">NPV Analysis</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Discount Factor:</span>
                              <span className="font-medium">{plan.npvAnalysis.discountingFactor}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">CIRP Cost:</span>
                              <span className="font-medium">{formatCurrency(plan.npvAnalysis.cirpCost)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Net Distribution:</span>
                              <span className="font-medium">{formatCurrency(plan.npvAnalysis.netDistribution)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Queries */}
                      {plan.queries.length > 0 && (
                        <div className="space-y-3 mb-4">
                          <h5 className="font-medium text-sm">Recent Queries</h5>
                          <div className="space-y-2">
                            {plan.queries.slice(0, 2).map((query) => (
                              <div key={query.id} className="text-sm bg-muted/50 p-3 rounded">
                                <p className="font-medium">{query.question}</p>
                                {query.response && (
                                  <p className="text-muted-foreground mt-1">Response: {query.response}</p>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(query.createdAt).toLocaleDateString()}
                                  </span>
                                  <Badge variant={query.status === 'answered' ? 'default' : 'secondary'}>
                                    {query.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {plan.modifiedSubmissionDate && (
                            <span>Modified: {new Date(plan.modifiedSubmissionDate).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Dialog open={showQueryDialog && selectedPlan?.id === plan.id} onOpenChange={(open) => {
                            setShowQueryDialog(open);
                            if (open) setSelectedPlan(plan);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Add Query
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Query for {plan.praName}</DialogTitle>
                                <DialogDescription>
                                  Enter your query or comment for this resolution plan
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
                            onClick={() => navigate(`/resolution/plan/${plan.id}`)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/resolution/plan/${plan.id}/comparison`)}
                          >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Compare
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPlans.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No resolution plans found matching your criteria</p>
                  <p className="text-sm">Try adjusting your search or filter settings</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResolutionPlanManagement;

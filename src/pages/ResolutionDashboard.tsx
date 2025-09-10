import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Upload,
  FileText,
  Calendar,
  Clock,
  Users,
  Building,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  DollarSign,
  ArrowRight,
  Download
} from 'lucide-react';

interface EOIInvitation {
  id: string;
  entityName: string;
  dateOfIssue: string;
  lastDateToSubmit: string;
  status: 'invitation-sent' | 'objection-awaiting' | 'objection-received' | 'provisional-list-shared' | 'final-list-circulated';
  totalPRAs: number;
  totalObjections: number;
}

interface ResolutionPlan {
  id: string;
  praName: string;
  entityType: string;
  submissionDate: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  planValue: number;
  complianceScore: number;
}

const ResolutionDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock data for EOI Invitations
  const [eoiInvitations] = useState<EOIInvitation[]>([
    {
      id: '1',
      entityName: 'ABC Corporation Ltd.',
      dateOfIssue: '2024-01-15',
      lastDateToSubmit: '2024-02-15',
      status: 'provisional-list-shared',
      totalPRAs: 12,
      totalObjections: 3
    },
    {
      id: '2',
      entityName: 'XYZ Industries Pvt. Ltd.',
      dateOfIssue: '2024-01-20',
      lastDateToSubmit: '2024-02-20',
      status: 'objection-awaiting',
      totalPRAs: 8,
      totalObjections: 1
    },
    {
      id: '3',
      entityName: 'PQR Manufacturing Co.',
      dateOfIssue: '2024-01-25',
      lastDateToSubmit: '2024-02-25',
      status: 'invitation-sent',
      totalPRAs: 0,
      totalObjections: 0
    }
  ]);

  // Mock data for Resolution Plans
  const [resolutionPlans] = useState<ResolutionPlan[]>([
    {
      id: '1',
      praName: 'Resolution Partners LLC',
      entityType: 'Company',
      submissionDate: '2024-02-10',
      status: 'under-review',
      planValue: 15000000,
      complianceScore: 85
    },
    {
      id: '2',
      praName: 'Strategic Investments Ltd.',
      entityType: 'Company',
      submissionDate: '2024-02-12',
      status: 'submitted',
      planValue: 18500000,
      complianceScore: 92
    },
    {
      id: '3',
      praName: 'Phoenix Recovery Fund',
      entityType: 'Fund',
      submissionDate: '2024-02-14',
      status: 'approved',
      planValue: 22000000,
      complianceScore: 96
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'invitation-sent': { variant: 'secondary' as const, label: 'Invitation Sent' },
      'objection-awaiting': { variant: 'default' as const, label: 'Objection Awaiting' },
      'objection-received': { variant: 'destructive' as const, label: 'Objection Received' },
      'provisional-list-shared': { variant: 'default' as const, label: 'Provisional List Shared' },
      'final-list-circulated': { variant: 'default' as const, label: 'Final List Circulated' },
      'submitted': { variant: 'secondary' as const, label: 'Submitted' },
      'under-review': { variant: 'default' as const, label: 'Under Review' },
      'approved': { variant: 'default' as const, label: 'Approved' },
      'rejected': { variant: 'destructive' as const, label: 'Rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config?.variant || 'secondary'}>{config?.label || status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCreateEOI = () => {
    navigate('/resolution/create-eoi');
  };

  const handleViewEOIDetails = (eoiId: string) => {
    navigate(`/resolution/eoi/${eoiId}`);
  };

  const handleViewResolutionPlans = () => {
    navigate('/resolution/plans');
  };

  const handleUploadResolutionPlan = () => {
    // Open file explorer to upload a resolution plan file
    fileInputRef.current?.click();
  };

  const handlePlanFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: 'Resolution Plan Selected',
        description: `${file.name} ready to upload.`
      });
      // Reset input so selecting the same file again will trigger onChange
      e.target.value = '';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Hidden file input for uploading resolution plans */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xlsx,.xls,.zip"
          className="hidden"
          onChange={handlePlanFileSelected}
        />
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Resolution System</h1>
            <p className="text-muted-foreground">
              Manage EOI invitations, resolution plans, and PRA evaluations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleCreateEOI} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create EOI Invitation
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total EOI Invitations</p>
                  <p className="text-2xl font-bold">{eoiInvitations.length}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Active PRAs</p>
                  <p className="text-2xl font-bold">{eoiInvitations.reduce((sum, eoi) => sum + eoi.totalPRAs, 0)}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolution Plans</p>
                  <p className="text-2xl font-bold">{resolutionPlans.length}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Plan Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(resolutionPlans.reduce((sum, plan) => sum + plan.planValue, 0))}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* EOI Invitations List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  EOI Invitations
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleCreateEOI}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
              <CardDescription>
                Manage Expression of Interest invitations and track PRA responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search EOI invitations..."
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
                      <SelectItem value="invitation-sent">Invitation Sent</SelectItem>
                      <SelectItem value="objection-awaiting">Objection Awaiting</SelectItem>
                      <SelectItem value="provisional-list-shared">Provisional List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* EOI List */}
                <div className="space-y-3">
                  {eoiInvitations.map((eoi) => (
                    <div key={eoi.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{eoi.entityName}</h4>
                        {getStatusBadge(eoi.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Issue: {new Date(eoi.dateOfIssue).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last date to submit EOI: {new Date(eoi.lastDateToSubmit).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          PRAs: {eoi.totalPRAs}
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Objections: {eoi.totalObjections}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEOIDetails(eoi.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resolution Plan Review */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Resolution Plan Review
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleViewResolutionPlans}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleUploadResolutionPlan}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Plan
                  </Button>
                </div>
              </div>
              <CardDescription>
                Review and evaluate submitted resolution plans from PRAs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resolutionPlans.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{plan.praName}</h4>
                      {getStatusBadge(plan.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {plan.entityType}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(plan.submissionDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(plan.planValue)}
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        Score: {plan.complianceScore}%
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/resolution/plan/${plan.id}`)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Review Plan
                      </Button>
                    </div>
                  </div>
                ))}
                
                {resolutionPlans.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" onClick={handleViewResolutionPlans} className="flex items-center gap-2">
                      View All Plans
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResolutionDashboard;

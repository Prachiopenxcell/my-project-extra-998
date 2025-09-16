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
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Switch } from '@/components/ui/switch';
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
  ExternalLink,
  Shield
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
  email?: string;
  modifiedDocuments?: Document[];
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
  const [tableView, setTableView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ResolutionPlan | null>(null);
  const [newQuery, setNewQuery] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState<{ id: string; email: string; planValue: string; status: ResolutionPlan['status']; modifiedSubmissionDate: string }>({ id: '', email: '', planValue: '', status: 'submitted', modifiedSubmissionDate: '' });

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
      email: 'contact@resolutionpartners.com',
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
      modifiedDocuments: [
        {
          id: 'm1',
          name: 'Modified Resolution Plan.pdf',
          type: 'PDF',
          uploadDate: '2024-02-20',
          size: '2.8 MB',
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
      email: 'info@strategicinv.com',
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
      modifiedDocuments: [],
      evaluationMatrix: []
    }
  ]);

  const [uploadData, setUploadData] = useState({
    praName: '',
    groupType: 'standalone',
    entityType: 'company',
    submissionDate: '',
    planValue: '',
    documents: [],
    planFileName: '',
    modifiedSubmissionDate: ''
  });

  // RFRP create dialog
  const [showRFRPDialog, setShowRFRPDialog] = useState(false);
  const { hasModuleAccess } = useSubscription();
  type EMRow = { id: string; criteria: string; weight: number; score?: number; remarks?: string };
  type RFRPData = {
    title: string;
    useStandardFormat: boolean;
    performanceGuarantee: string;
    performanceGuaranteeSource: 'meetings' | 'manual';
    notes: string;
    aiSuggested: string;
    emRows: EMRow[];
    imLink?: string;
    imLinkSource?: 'vdr' | 'manual';
  };
  const [rfrp, setRfrp] = useState<RFRPData>({
    title: '',
    useStandardFormat: true,
    performanceGuarantee: '',
    performanceGuaranteeSource: 'manual',
    notes: '',
    aiSuggested: '',
    emRows: [
      { id: 'em1', criteria: 'Financial Viability', weight: 30 },
      { id: 'em2', criteria: 'Implementation Timeline', weight: 25 },
      { id: 'em3', criteria: 'Legal Compliance', weight: 20 },
    ],
  });
  const [rfrpSaved, setRfrpSaved] = useState<RFRPData | null>(null);
  // Signature flow for RFRP Save
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signing, setSigning] = useState(false);

  // AI Suggestion Editor dialog for RFRP
  const [showAISuggestDialog, setShowAISuggestDialog] = useState(false);
  const [aiEditor, setAiEditor] = useState('');

  const buildRfrpEvaluationMatrixTemplate = (): string => `
  <div>
    <h3>Evaluation Matrix for Resolution Plan Assessment</h3>
    <h4>Part A - Quantitative Parameters</h4>
    <table border="1" cellspacing="0" cellpadding="6" style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th>#</th>
          <th>Evaluation Criteria</th>
          <th>Score Matrix (Indicative)</th>
          <th>Score</th>
          <th>Weightage</th>
          <th>Max Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Upfront cash payment (within 30-90 days from NCLT approval)</td>
          <td>≥80% of Resolution Amount = 10; 60-79% = 7; 40-59% = 5; 20-39% = 2; &lt;20% = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>2</td>
          <td>NPV of payments to Financial Creditors</td>
          <td>≥90% of Admitted FC claims = 10; 70-89% = 8; 50-69% = 6; 30-49% = 4; &lt;30% = 2</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>3</td>
          <td>NPV of payments to Operational Creditors</td>
          <td>≥25% of Admitted OC claims = 10; 15-24% = 8; 10-14% = 6; 5-9% = 4; &lt;5% = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Homebuyer delivery timeline (if applicable)</td>
          <td>≤6 months = 5; ≤12 months = 4; ≤18 months = 3; ≤24 months = 2; &gt;24 months = 0</td>
          <td>5</td>
          <td>100%</td>
          <td>5</td>
        </tr>
        <tr>
          <td>5</td>
          <td>Interest/Penalty payments to FCs/Homebuyers</td>
          <td>≥75% of dues = 10; 50-74% = 7; 25-49% = 4; &lt;25% = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>6</td>
          <td>Fresh fund infusion for operations (Capex + Working Capital)</td>
          <td>≥100% of Resolution Amount = 10; 75-99% = 8; 50-74% = 6; 25-49% = 4; &lt;25% = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
      </tbody>
    </table>
    <h4 class="mt-4">Part B - Qualitative Parameters</h4>
    <table border="1" cellspacing="0" cellpadding="6" style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th>#</th>
          <th>Evaluation Criteria</th>
          <th>Score Matrix (Indicative)</th>
          <th>Score</th>
          <th>Weightage</th>
          <th>Max Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>7</td>
          <td>Financial projections reasonableness &amp; RA financial strength</td>
          <td>Highly credible &amp; strong financials = 10; Credible &amp; good track record = 8; Acceptable = 6; Weak assumptions = 4; Unrealistic = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>8</td>
          <td>Track record in turnaround/M&amp;A/Industry experience</td>
          <td>Strong turnaround &amp; sector expertise = 10; Good M&amp;A = 8; Relevant experience = 6; Limited = 3; None = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
      </tbody>
    </table>
    <p><strong>Total Max Score:</strong> 75</p>
    <p><strong>Notes:</strong><br/>
    NPV calculated at 9% discount rate or SBI MCLR<br/>
    Resolution Amount = Total payments to creditors + CIRP costs<br/>
    Minimum 26% equity holding for 1 year post-implementation required<br/>
    CoC retains discretion on final weightage and selection
    </p>
  </div>
  `;

  // Themed table data for preview (matches the provided template)
  type EMPreviewRow = { id: number; criteria: string; scoreMatrix: string; score: string; weight: string; max: string };
  const getEMPreviewData = () => {
    const partA: EMPreviewRow[] = [
      { id: 1, criteria: 'Upfront cash payment (within 30-90 days from NCLT approval)', scoreMatrix: '≥80% = 10; 60-79% = 7; 40-59% = 5; 20-39% = 2; <20% = 0', score: '10', weight: '100%', max: '10' },
      { id: 2, criteria: 'NPV of payments to Financial Creditors', scoreMatrix: '≥90% = 10; 70-89% = 8; 50-69% = 6; 30-49% = 4; <30% = 2', score: '10', weight: '100%', max: '10' },
      { id: 3, criteria: 'NPV of payments to Operational Creditors', scoreMatrix: '≥25% = 10; 15-24% = 8; 10-14% = 6; 5-9% = 4; <5% = 0', score: '10', weight: '100%', max: '10' },
      { id: 4, criteria: 'Homebuyer delivery timeline (if applicable)', scoreMatrix: '≤6m = 5; ≤12m = 4; ≤18m = 3; ≤24m = 2; >24m = 0', score: '5', weight: '100%', max: '5' },
      { id: 5, criteria: 'Interest/Penalty payments to FCs/Homebuyers', scoreMatrix: '≥75% = 10; 50-74% = 7; 25-49% = 4; <25% = 0', score: '10', weight: '100%', max: '10' },
      { id: 6, criteria: 'Fresh fund infusion for operations (Capex + Working Capital)', scoreMatrix: '≥100% = 10; 75-99% = 8; 50-74% = 6; 25-49% = 4; <25% = 0', score: '10', weight: '100%', max: '10' },
    ];
    const partB: EMPreviewRow[] = [
      { id: 7, criteria: 'Financial projections reasonableness & RA financial strength', scoreMatrix: 'Highly credible = 10; Credible = 8; Acceptable = 6; Weak = 4; Unrealistic = 0', score: '10', weight: '100%', max: '10' },
      { id: 8, criteria: 'Track record in turnaround/M&A/Industry experience', scoreMatrix: 'Strong turnaround = 10; Good M&A = 8; Relevant = 6; Limited = 3; None = 0', score: '10', weight: '100%', max: '10' },
    ];
    return { partA, partB };
  };

  const handleSignAndSaveRFRP = async (signatureType: 'digital' | 'electronic') => {
    try {
      setSigning(true);
      // Simulate signing latency
      await new Promise(res => setTimeout(res, 800));
      // Persist RFRP (mock create)
      setRfrpSaved(rfrp);
      setShowSignatureDialog(false);
      setShowRFRPDialog(false);
      toast({ title: 'RFRP Created', description: `RFRP signed with ${signatureType === 'digital' ? 'Digital Signature (DSC)' : 'E-Signature'}.` });
    } finally {
      setSigning(false);
    }
  };

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

  const openEditPlan = (plan: ResolutionPlan) => {
    setEditData({
      id: plan.id,
      email: plan.email || '',
      planValue: String(plan.planValue || ''),
      status: plan.status,
      modifiedSubmissionDate: plan.modifiedSubmissionDate || ''
    });
    setShowEditDialog(true);
  };

  const saveEditPlan = () => {
    setResolutionPlans(prev => prev.map(p => p.id === editData.id ? {
      ...p,
      email: editData.email || undefined,
      planValue: parseInt(editData.planValue || '0') || 0,
      status: editData.status,
      modifiedSubmissionDate: editData.modifiedSubmissionDate || undefined,
    } : p));
    setShowEditDialog(false);
    toast({ title: 'Plan Updated', description: 'Resolution plan details saved.' });
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
      modifiedSubmissionDate: uploadData.modifiedSubmissionDate || undefined,
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
      documents: uploadData.planFileName ? [{ id: 'plan', name: uploadData.planFileName, type: 'PDF', uploadDate: uploadData.submissionDate, size: '—', url: '#' }] : [],
      evaluationMatrix: []
    };

    setResolutionPlans(prev => [...prev, newPlan]);
    setUploadData({
      praName: '',
      groupType: 'standalone',
      entityType: 'company',
      submissionDate: '',
      planValue: '',
      documents: [],
      planFileName: '',
      modifiedSubmissionDate: ''
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
    <>
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
                  <div>
                    <Label htmlFor="modifiedSubmissionDate">Modified Submission Date (optional)</Label>
                    <Input
                      id="modifiedSubmissionDate"
                      type="date"
                      value={uploadData.modifiedSubmissionDate}
                      onChange={(e) => setUploadData(prev => ({ ...prev, modifiedSubmissionDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="planFileName">Plan Document Name</Label>
                    <Input id="planFileName" value={uploadData.planFileName} onChange={(e) => setUploadData(prev => ({ ...prev, planFileName: e.target.value }))} placeholder="e.g. Resolution Plan - Main Document.pdf" />
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

            <Dialog open={showRFRPDialog} onOpenChange={setShowRFRPDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Create RFRP
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create / Upload RFRP</DialogTitle>
                  <DialogDescription>Use standard format or customize. Collaboration supported via Document Draft Cycle (mock).</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pr-1">
                  {/* Standard Format + Draft Cycle */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Label>Title</Label>
                        <Input value={rfrp.title} onChange={(e)=>setRfrp(prev=>({...prev, title: e.target.value}))} placeholder="RFRP for ABC CIRP" />
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <Switch checked={rfrp.useStandardFormat} onCheckedChange={(checked)=> setRfrp(prev=>({...prev, useStandardFormat: checked}))} />
                          <Label className="text-sm">Use Standard Format</Label>
                        </div>
                        <Button variant="ghost" onClick={()=> toast({ title: 'Draft Opened', description: 'Opening Document Draft Cycle (mock).' })}>Open Draft</Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Standard format supports collaborative editing via Document Draft Cycle.</p>
                    <div className="h-px bg-muted" />
                  </div>

                  {/* Performance Guarantee with Meetings integration */}
                  <div className="space-y-2">
                    <Label>Performance Guarantee</Label>
                    <div className="flex gap-2">
                      <Input className="flex-1" value={rfrp.performanceGuarantee} onChange={(e)=>setRfrp(prev=>({...prev, performanceGuarantee: e.target.value, performanceGuaranteeSource: 'manual'}))} placeholder="e.g. 10% of plan value or Rs X" />
                      <Button
                        variant="outline"
                        disabled={!hasModuleAccess('meetings')}
                        title={hasModuleAccess('meetings') ? 'Fetch from Meetings' : 'Requires Meetings module'}
                        onClick={()=> setRfrp(prev=>({...prev, performanceGuarantee: 'As per Meeting #CIRP-12 Resolution: 10% of plan value', performanceGuaranteeSource: 'meetings'}))}
                      >Pull from Meetings</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Source: <Badge variant="outline">{rfrp.performanceGuaranteeSource === 'meetings' ? 'Provided by System' : 'Provided by User'}</Badge></p>
                    <div className="h-px bg-muted" />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea value={rfrp.notes} onChange={(e)=>setRfrp(prev=>({...prev, notes: e.target.value}))} rows={3} placeholder="Instructions to PRA, timelines, document list, etc." />
                  </div>

                  {/* AI Suggestions gated by AI module */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={!hasModuleAccess('ai')}
                      title={hasModuleAccess('ai') ? 'Get AI suggestions' : 'Requires AI module'}
                      onClick={()=>{ setAiEditor(buildRfrpEvaluationMatrixTemplate()); setShowAISuggestDialog(true); }}
                    >Suggest with AI</Button>
                    {rfrp.aiSuggested && <Badge variant="secondary">AI Suggested</Badge>}
                  </div>
                  {rfrp.aiSuggested && (() => {
                    const { partA, partB } = getEMPreviewData();
                    return (
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-semibold mb-2">Part A - Quantitative Parameters</div>
                          <div className="overflow-x-auto border rounded">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-10">#</TableHead>
                                  <TableHead>Evaluation Criteria</TableHead>
                                  <TableHead>Score Matrix (Indicative)</TableHead>
                                  <TableHead className="w-20">Score</TableHead>
                                  <TableHead className="w-28">Weightage</TableHead>
                                  <TableHead className="w-24">Max Score</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {partA.map(r => (
                                  <TableRow key={r.id}>
                                    <TableCell>{r.id}</TableCell>
                                    <TableCell>{r.criteria}</TableCell>
                                    <TableCell>{r.scoreMatrix}</TableCell>
                                    <TableCell>{r.score}</TableCell>
                                    <TableCell>{r.weight}</TableCell>
                                    <TableCell>{r.max}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-2">Part B - Qualitative Parameters</div>
                          <div className="overflow-x-auto border rounded">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-10">#</TableHead>
                                  <TableHead>Evaluation Criteria</TableHead>
                                  <TableHead>Score Matrix (Indicative)</TableHead>
                                  <TableHead className="w-20">Score</TableHead>
                                  <TableHead className="w-28">Weightage</TableHead>
                                  <TableHead className="w-24">Max Score</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {partB.map(r => (
                                  <TableRow key={r.id}>
                                    <TableCell>{r.id}</TableCell>
                                    <TableCell>{r.criteria}</TableCell>
                                    <TableCell>{r.scoreMatrix}</TableCell>
                                    <TableCell>{r.score}</TableCell>
                                    <TableCell>{r.weight}</TableCell>
                                    <TableCell>{r.max}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div><strong>Total Max Score:</strong> 75</div>
                          <div className="mt-1">
                            <strong>Notes:</strong> NPV at 9% (or SBI MCLR); Resolution Amount = Total payments + CIRP costs; Min 26% equity for 1 year post-implementation; CoC discretion applies.
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Evaluation Matrix */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Evaluation Matrix</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          disabled={!hasModuleAccess('ai')}
                          title={hasModuleAccess('ai') ? 'AI suggest EM' : 'Requires AI module'}
                          onClick={()=> setRfrp(prev=>({...prev, emRows: [
                            { id: 'em1', criteria: 'Financial Viability', weight: 30 },
                            { id: 'em2', criteria: 'Implementation Timeline', weight: 25 },
                            { id: 'em3', criteria: 'Operational Turnaround', weight: 20 },
                            { id: 'em4', criteria: 'Legal/IBC Compliance', weight: 25 },
                          ]}))}
                        >AI Suggest EM</Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto border rounded">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Criteria</TableHead>
                            <TableHead>Weight</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rfrp.emRows.map(row => (
                            <TableRow key={row.id}>
                              <TableCell>
                                <Input value={row.criteria} onChange={(e)=> setRfrp(prev=>({...prev, emRows: prev.emRows.map(r => r.id===row.id ? { ...r, criteria: e.target.value } : r)}))} />
                              </TableCell>
                              <TableCell className="w-32">
                                <Input type="number" value={row.weight} onChange={(e)=> setRfrp(prev=>({...prev, emRows: prev.emRows.map(r => r.id===row.id ? { ...r, weight: parseFloat(e.target.value||'0') } : r)}))} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">After approval, an IM link will be generated and shared with PRAs automatically.</div>
                      <Button className="ml-auto" onClick={()=>{
                        const im = hasModuleAccess('vdr') ? `/data-room/room/IM-${Date.now()}` : 'Provide IM link manually';
                        setRfrp(prev=>({...prev, imLink: im, imLinkSource: hasModuleAccess('vdr') ? 'vdr' : 'manual'}));
                        toast({ title: 'EM Approved', description: hasModuleAccess('vdr') ? 'IM link generated from VDR and will be shared with PRAs.' : 'Please provide IM link manually (VDR not subscribed).' });
                      }}>Approve EM & Generate IM Link</Button>
                    </div>
                    {rfrp.imLink && (
                      <Alert>
                        <AlertDescription>
                          IM Link: <a className="underline" href={rfrp.imLink.startsWith('/') ? rfrp.imLink : '#'}>{rfrp.imLink}</a> {' '}
                          <Badge variant="outline">{rfrp.imLinkSource === 'vdr' ? 'Generated by System' : 'Provided by User'}</Badge>
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="h-px bg-muted" />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={()=>setShowRFRPDialog(false)}>Close</Button>
                    <Button onClick={()=> setShowSignatureDialog(true)}>Create RFRP</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {/* AI Suggestion Editor Dialog */}
            <Dialog open={showAISuggestDialog} onOpenChange={setShowAISuggestDialog}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>AI Suggested Evaluation Matrix</DialogTitle>
                  <DialogDescription>Edit the template below and click Save to insert into RFRP.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div
                    className="min-h-[420px] border rounded p-3 text-sm overflow-auto bg-white"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e)=> setAiEditor((e.currentTarget as HTMLDivElement).innerHTML)}
                    dangerouslySetInnerHTML={{ __html: aiEditor }}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={()=> setShowAISuggestDialog(false)}>Cancel</Button>
                    <Button onClick={()=>{ setRfrp(prev=>({...prev, aiSuggested: aiEditor})); setShowAISuggestDialog(false); toast({ title: 'Inserted', description: 'AI suggestion added to RFRP.' }); }}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant={tableView? 'default':'outline'} onClick={()=>setTableView(v=>!v)}>{tableView? 'Card View':'Table View'}</Button>
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
              {!tableView && (
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
                                  <Button onClick={handleAddQuery}>Add Query</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" onClick={()=>navigate(`/resolution/plan/${plan.id}/edit`)}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={()=>navigate(`/resolution/plan/${plan.id}`)}>View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              )}

              {tableView && (
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name of PRAs</TableHead>
                        <TableHead>Group / Standalone</TableHead>
                        <TableHead>Entity Type</TableHead>
                        <TableHead>Email Id</TableHead>
                        <TableHead>Date of submission of Resolution Plan</TableHead>
                        <TableHead>Date of submission of Modified Resolution Plan</TableHead>
                        <TableHead>Download Resolution plan</TableHead>
                        <TableHead>Download Modified Resolution Plan</TableHead>
                        <TableHead>Queries (Platform)</TableHead>
                        <TableHead>Queries (User)</TableHead>
                        <TableHead>Responses from PRAs</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlans.map((plan)=> (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.praName}</TableCell>
                          <TableCell>{plan.groupType === 'group' ? 'Group' : 'Standalone'}</TableCell>
                          <TableCell className="capitalize">{plan.entityType}</TableCell>
                          <TableCell>{plan.email || '—'}</TableCell>
                          <TableCell>{new Date(plan.submissionDate).toLocaleDateString()}</TableCell>
                          <TableCell>{plan.modifiedSubmissionDate ? new Date(plan.modifiedSubmissionDate).toLocaleDateString() : '—'}</TableCell>
                          <TableCell>
                            {plan.documents[0] ? (
                              <Button variant="outline" size="sm" asChild><a href={plan.documents[0].url} download>{'Download'}</a></Button>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {plan.modifiedSubmissionDate ? (
                              <Button variant="outline" size="sm" asChild><a href={'#'} download>{'Download'}</a></Button>
                            ) : '—'}
                          </TableCell>
                          <TableCell>{plan.queries.filter(q=>q.createdBy==='system').length}</TableCell>
                          <TableCell>{plan.queries.filter(q=>q.createdBy!=='system').length}</TableCell>
                          <TableCell>{plan.queries.filter(q=>!!q.response).length}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={()=>navigate(`/resolution/plan/${plan.id}/edit`)}>Edit</Button>
                              <Button variant="outline" size="sm" onClick={()=>navigate(`/resolution/plan/${plan.id}`)}>View Details</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Edit Plan Dialog */}
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Resolution Plan</DialogTitle>
                    <DialogDescription>Update high-level details for the selected plan.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Email</Label>
                      <Input value={editData.email} onChange={(e)=>setEditData(prev=>({...prev, email: e.target.value}))} placeholder="contact@example.com" />
                    </div>
                    <div>
                      <Label>Plan Value</Label>
                      <Input type="number" value={editData.planValue} onChange={(e)=>setEditData(prev=>({...prev, planValue: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={editData.status} onValueChange={(v: ResolutionPlan['status'])=> setEditData(prev=>({...prev, status: v}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="under-review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="modified">Modified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Modified Submission Date</Label>
                      <Input type="date" value={editData.modifiedSubmissionDate} onChange={(e)=>setEditData(prev=>({...prev, modifiedSubmissionDate: e.target.value}))} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={()=>setShowEditDialog(false)}>Cancel</Button>
                      <Button onClick={saveEditPlan}>Save</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

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

    {/* Signature Dialog for RFRP Save */}
    <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sign RFRP</DialogTitle>
          <DialogDescription>
            Choose a signature method to authorize creation of the RFRP.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Button disabled={signing} onClick={()=> handleSignAndSaveRFRP('digital')} className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" /> {signing ? 'Signing…' : 'Digital Signature (DSC)'}
            </Button>
            <Button disabled={signing} variant="outline" onClick={()=> handleSignAndSaveRFRP('electronic')} className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" /> {signing ? 'Signing…' : 'E‑Signature'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ResolutionPlanManagement;

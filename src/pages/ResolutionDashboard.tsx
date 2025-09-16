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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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

  const handleSignAndSaveRFRP = async (signatureType: 'digital' | 'electronic') => {
    try {
      setSigning(true);
      await new Promise(res => setTimeout(res, 800));
      setShowSignatureDialog(false);
      setShowRFRPDialog(false);
      toast({ title: 'RFRP Created', description: `RFRP signed with ${signatureType === 'digital' ? 'Digital Signature (DSC)' : 'E-Signature'} and mailed to all PRAs.` });
    } finally {
      setSigning(false);
    }
  };

  // ================= RFRP (Create from Dashboard) =================
  type EMRow = { id: string; criteria: string; weight: number; score?: number; remarks?: string };
  type RFRPData = {
    title: string;
    useStandardFormat: boolean;
    performanceGuarantee: string;
    performanceGuaranteeSource: 'meetings' | 'manual';
    notes: string;
    aiSuggested: string; // stored as HTML for preview elsewhere
    emRows: EMRow[];
    imLink?: string;
    imLinkSource?: 'vdr' | 'manual';
  };
  const [showRFRPDialog, setShowRFRPDialog] = useState(false);
  const [showAISuggestDialog, setShowAISuggestDialog] = useState(false);
  const [aiEditor, setAiEditor] = useState('');
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signing, setSigning] = useState(false);
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
          <td>≥80% = 10; 60-79% = 7; 40-59% = 5; 20-39% = 2; &lt;20% = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>2</td>
          <td>NPV of payments to Financial Creditors</td>
          <td>≥90% = 10; 70-89% = 8; 50-69% = 6; 30-49% = 4; &lt;30% = 2</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>3</td>
          <td>NPV of payments to Operational Creditors</td>
          <td>≥25% = 10; 15-24% = 8; 10-14% = 6; 5-9% = 4; &lt;5% = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Homebuyer delivery timeline (if applicable)</td>
          <td>≤6m = 5; ≤12m = 4; ≤18m = 3; ≤24m = 2; &gt;24m = 0</td>
          <td>5</td>
          <td>100%</td>
          <td>5</td>
        </tr>
        <tr>
          <td>5</td>
          <td>Interest/Penalty payments to FCs/Homebuyers</td>
          <td>≥75% = 10; 50-74% = 7; 25-49% = 4; &lt;25% = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>6</td>
          <td>Fresh fund infusion for operations (Capex + Working Capital)</td>
          <td>≥100% = 10; 75-99% = 8; 50-74% = 6; 25-49% = 4; &lt;25% = 0</td>
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
          <td>Highly credible = 10; Credible = 8; Acceptable = 6; Weak = 4; Unrealistic = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
        <tr>
          <td>8</td>
          <td>Track record in turnaround/M&amp;A/Industry experience</td>
          <td>Strong turnaround = 10; Good M&amp;A = 8; Relevant = 6; Limited = 3; None = 0</td>
          <td>10</td>
          <td>100%</td>
          <td>10</td>
        </tr>
      </tbody>
    </table>
    <p><strong>Total Max Score:</strong> 75</p>
  </div>
  `;

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

        {/* Create RFRP Dialog (mirrors ResolutionPlanManagement) */}
        <Dialog open={showRFRPDialog} onOpenChange={setShowRFRPDialog}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create / Upload RFRP</DialogTitle>
              <DialogDescription>Use standard format or customize. Collaboration supported via Document Draft Cycle (mock).</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pr-1">
              {/* Title & Standard Format */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input value={rfrp.title} onChange={(e)=>setRfrp(prev=>({...prev, title: e.target.value}))} placeholder="RFRP for ABC CIRP" />
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3">
                    <div className="flex items-center gap-2">
                      <Switch checked={rfrp.useStandardFormat} onCheckedChange={(checked)=> setRfrp(prev=>({...prev, useStandardFormat: checked}))} />
                      <span className="text-sm">Use Standard Format</span>
                    </div>
                    <Button variant="ghost" onClick={()=> toast({ title: 'Draft Opened', description: 'Opening Document Draft Cycle (mock).' })}>Open Draft</Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Standard format supports collaborative editing via Document Draft Cycle.</p>
                <div className="h-px bg-muted" />
              </div>

              {/* Performance Guarantee */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Performance Guarantee</label>
                <div className="flex gap-2">
                  <Input className="flex-1" value={rfrp.performanceGuarantee} onChange={(e)=>setRfrp(prev=>({...prev, performanceGuarantee: e.target.value, performanceGuaranteeSource: 'manual'}))} placeholder="e.g. 10% of plan value or Rs X" />
                  <Button variant="outline" onClick={()=> setRfrp(prev=>({...prev, performanceGuarantee: 'As per Meeting #CIRP-12 Resolution: 10% of plan value', performanceGuaranteeSource: 'meetings'}))}>Pull from Meetings</Button>
                </div>
                <p className="text-xs text-muted-foreground">Source: <Badge variant="outline">{rfrp.performanceGuaranteeSource === 'meetings' ? 'Provided by System' : 'Provided by User'}</Badge></p>
                <div className="h-px bg-muted" />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea value={rfrp.notes} onChange={(e)=>setRfrp(prev=>({...prev, notes: e.target.value}))} rows={3} placeholder="Instructions to PRA, timelines, document list, etc." />
              </div>

              {/* AI Suggestion */}
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={()=>{ setAiEditor(buildRfrpEvaluationMatrixTemplate()); setShowAISuggestDialog(true); }}>Suggest with AI</Button>
                {rfrp.aiSuggested && <Badge variant="secondary">AI Suggested</Badge>}
              </div>
              {rfrp.aiSuggested && (
                <div className="text-xs bg-muted/50 p-2 rounded leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: rfrp.aiSuggested }} />
                </div>
              )}

              {/* Evaluation Matrix (basic) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Evaluation Matrix</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
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
                <div className="text-xs text-muted-foreground">After approval, an IM link can be generated and shared with PRAs automatically.</div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={()=>setShowRFRPDialog(false)}>Close</Button>
                <Button onClick={()=> setShowSignatureDialog(true)}>Create RFRP</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Signature Dialog */}
        <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Sign RFRP</DialogTitle>
              <DialogDescription>Select a signature method to finalize and save the RFRP.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Button className="w-full" disabled={signing} onClick={()=> handleSignAndSaveRFRP('digital')}>
                {signing ? 'Signing…' : 'Sign with Digital Signature (DSC)'}
              </Button>
              <Button variant="outline" className="w-full" disabled={signing} onClick={()=> handleSignAndSaveRFRP('electronic')}>
                {signing ? 'Signing…' : 'Sign with E-Signature'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Suggestion Editor Dialog (Dashboard) */}
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
          {/* Left: EOI Invitations List */}
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

          {/* Right: Create RFRP + Resolution Plan Review stacked */}
          <div className="space-y-8">
            {/* Create RFRP (Dashboard) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Create RFRP
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={()=> setShowRFRPDialog(true)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Create RFRP
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Draft and circulate the Request for Resolution Plan (RFRP) to PRAs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Use standard format or customize. AI can suggest an Evaluation Matrix template.
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
      </div>
    </DashboardLayout>
  );
};

export default ResolutionDashboard;

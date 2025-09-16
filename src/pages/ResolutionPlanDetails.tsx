import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, FileText, CheckCircle, XCircle, RefreshCw, MessageSquare, Eye, Save, Download, PenTool } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface Query {
  id: string;
  question: string;
  response?: string;
  status: 'pending' | 'answered';
  createdAt: string;
  createdBy: 'system' | 'user';
  thread?: Array<{ id: string; author: 'pra' | 'user' | 'system'; text: string; date: string }>
}

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  url: string;
}

interface Plan {
  id: string;
  praName: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'modified';
  submissionDate: string;
  modifiedSubmissionDate?: string;
  planValue: number;
  complianceScore: number;
  documents: DocumentItem[];
  queries: Query[];
}

const mockPlans: Plan[] = [
  {
    id: '1',
    praName: 'Resolution Partners LLC',
    status: 'under-review',
    submissionDate: '2024-02-10',
    planValue: 15000000,
    complianceScore: 92,
    documents: [
      { id: '1', name: 'Resolution Plan - Main Document.pdf', type: 'PDF', uploadDate: '2024-02-10', size: '2.5 MB', url: '#' },
    ],
    queries: [
      { id: '1', question: 'Provide funding arrangement details', status: 'pending', createdAt: '2024-02-15', createdBy: 'system' }
    ]
  },
  {
    id: '2',
    praName: 'Strategic Investments Ltd.',
    status: 'submitted',
    submissionDate: '2024-02-12',
    planValue: 18500000,
    complianceScore: 78,
    documents: [],
    queries: []
  }
];

const ResolutionPlanDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, organization } = useAuth();
  const { hasModuleAccess } = useSubscription();
  const [newQuery, setNewQuery] = useState('');
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [queryResponseDraft, setQueryResponseDraft] = useState<Record<string, string>>({});
  const [imLink, setImLink] = useState<string>('');
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  // Compliance Report draft cycle and signatures
  type ComplianceReport = {
    id: string;
    planId: string;
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'final';
    items: Record<string, { checked: boolean; note?: string }>;
    signed?: { name: string; company?: string; address?: string; email: string; phone?: string; signedAt: string };
  };
  const [savedReports, setSavedReports] = useState<ComplianceReport[]>([]);
  const [signatureProfile, setSignatureProfile] = useState<{ name: string; company?: string; address?: string; email: string; phone?: string }>({ name: '', email: '' });
  const [showSignDialog, setShowSignDialog] = useState(false);

  // Compliance checklist items per IB Code and Regulations
  const complianceItems = [
    'Section 30(1)','Section 30(2) (a)','Section 30(2) (b)','Section 30(2) (c)','Section 30(2) (d)','Section 30(2) (e)','Section 30(2) (f)',
    'Regulation 38 (1)','Regulation 38 (1A)','Regulation 38 (1B)','Regulation 38 (2)','Regulation 38 (3)',
    'Regulation 37 (a)','Regulation 37 (b)','Regulation 37 (ba)','Regulation 37 (c)','Regulation 37 (ca)','Regulation 37 (d)','Regulation 37 (e)','Regulation 37 (f)','Regulation 37 (g)','Regulation 37 (h)','Regulation 37 (i)','Regulation 37 (j)','Regulation 37 (k)','Regulation 37 (l)','Regulation 37 (m)'
  ] as const;
  const [complianceState, setComplianceState] = useState<Record<string, {checked: boolean; note?: string}>>({});

  // Evaluation Matrix
  type EMRow = { id: string; criteria: string; weight: number; score?: number; remarks?: string };
  const [discountingFactor, setDiscountingFactor] = useState<number>(12.5);
  const [emRows, setEmRows] = useState<EMRow[]>([
    { id: 'em1', criteria: 'Financial Viability', weight: 30 },
    { id: 'em2', criteria: 'Implementation Timeline', weight: 25 },
    { id: 'em3', criteria: 'Statutory Dues Handling', weight: 15 },
    { id: 'em4', criteria: 'CIRP Cost Provisioning', weight: 15 },
    { id: 'em5', criteria: 'Net Distribution Fairness', weight: 15 },
  ]);
  const [savedEMDraft, setSavedEMDraft] = useState<null | { rows: EMRow[]; discountingFactor: number; savedAt: string }>(null);

  // Comparison Tab: Costs, SFC Position, Liquidator Fee, Statutory Claims
  type PaymentRow = { id: string; year: number; creditorCategory: string; resolutionAmount: number };
  const [comparisonDraftAt, setComparisonDraftAt] = useState<string | null>(null);
  const [cirpCost, setCirpCost] = useState<number>(500000);
  const [estimatedLiquidationCost, setEstimatedLiquidationCost] = useState<number>(800000);
  const [epfoDues, setEpfoDues] = useState<number>(150000);
  const [gratuity, setGratuity] = useState<number>(120000);
  const [paymentTimeline, setPaymentTimeline] = useState<PaymentRow[]>([
    { id: 'p1', year: 1, creditorCategory: 'Financial Creditors (SFCs)', resolutionAmount: 5000000 },
    { id: 'p2', year: 2, creditorCategory: 'Operational Creditors', resolutionAmount: 2000000 },
  ]);
  const totalDistribution = paymentTimeline.reduce((s, r) => s + (r.resolutionAmount || 0), 0);
  const liquidatorFeeEstimated = Math.max(0, Math.round(0.01 * Math.max(0, totalDistribution - (cirpCost + estimatedLiquidationCost + epfoDues + gratuity))));
  const [statutoryClaims, setStatutoryClaims] = useState<Array<{ id: string; authority: string; amount: number; note?: string }>>([
    { id: 'sc1', authority: 'Income Tax', amount: 300000 },
    { id: 'sc2', authority: 'GST', amount: 250000 },
  ]);
  const [originalDate, setOriginalDate] = useState<string>('2024-02-10');
  const [modifiedDate, setModifiedDate] = useState<string>('');

  const aiPopulateComparison = () => {
    if (!hasModuleAccess('ai')) {
      toast({ title: 'AI Module Required', description: 'Subscribe to AI module to auto-populate from IM documents.', variant: 'destructive' });
      return;
    }
    // Mock AI population from IM/plan
    setEstimatedLiquidationCost(900000);
    setPaymentTimeline(prev => prev.map(r => r.id === 'p1' ? { ...r, resolutionAmount: 5200000 } : r));
    setStatutoryClaims([
      { id: 'sc1', authority: 'Income Tax', amount: 320000, note: 'From IM Para 4.1' },
      { id: 'sc2', authority: 'GST', amount: 260000, note: 'From IM Para 4.2' }
    ]);
    toast({ title: 'AI Populated', description: 'Costs and claims populated from IM (mock).' });
  };

  const addTimelineRow = () => setPaymentTimeline(prev => [
    ...prev,
    { id: Math.random().toString(36).slice(2), year: prev.length + 1, creditorCategory: '', resolutionAmount: 0 }
  ]);
  const removeTimelineRow = (id: string) => setPaymentTimeline(prev => prev.filter(r => r.id !== id));

  const exportComparisonCSV = () => {
    const lines: string[] = [];
    lines.push('Section,Field,Value');
    lines.push(`Costs,CIRP Cost,${cirpCost}`);
    lines.push(`Costs,Estimated Liquidation Cost,${estimatedLiquidationCost}`);
    lines.push(`Costs,EPFO Dues,${epfoDues}`);
    lines.push(`Costs,Gratuity,${gratuity}`);
    lines.push(`Costs,Liquidator Fee (Estimated),${liquidatorFeeEstimated}`);
    lines.push('Timeline,Year,Creditor Category,Resolution Amount');
    paymentTimeline.forEach(r => lines.push(`Timeline,${r.year},${r.creditorCategory},${r.resolutionAmount}`));
    lines.push('Statutory Claims,Authority,Amount,Note');
    statutoryClaims.forEach(s => lines.push(`Statutory Claims,${s.authority},${s.amount},${(s.note||'').replace(/,/g,';')}`));
    lines.push(`Comparison,Original Date,${originalDate}`);
    lines.push(`Comparison,Modified Date,${modifiedDate || plan.modifiedSubmissionDate || ''}`);
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `Comparison_${plan.praName}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const saveComparisonDraft = () => {
    setComparisonDraftAt(new Date().toLocaleTimeString());
    toast({ title: 'Draft Saved', description: 'Comparison draft saved locally.' });
  };

  const plan = useMemo(() => mockPlans.find(p => p.id === id) || mockPlans[0], [id]);

  useEffect(() => {
    setModifiedDate(plan?.modifiedSubmissionDate || plan?.submissionDate || '');
  }, [plan]);

  const getStatusBadge = (status: Plan['status']) => {
    type IconType = React.ComponentType<{ className?: string }>
    const cfg: Record<Plan['status'], { label: string; variant: 'default'|'secondary'|'destructive'; Icon: IconType }> = {
      'submitted': { label: 'Submitted', variant: 'secondary', Icon: FileText },
      'under-review': { label: 'Under Review', variant: 'default', Icon: RefreshCw },
      'approved': { label: 'Approved', variant: 'default', Icon: CheckCircle },
      'rejected': { label: 'Rejected', variant: 'destructive', Icon: XCircle },
      'modified': { label: 'Modified', variant: 'secondary', Icon: RefreshCw },
    };
    const { label, variant, Icon } = cfg[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const exportReportCSV = () => {
    const headers = ['Compliance Item','Status','Note'];
    const rows = complianceItems.map(k => [k, complianceState[k]?.checked ? 'Complied' : 'Not Complied', (complianceState[k]?.note||'').replace(/\n/g,' ')]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `Compliance_${plan.praName}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const printPDF = () => { window.print(); };

  // Load stored signature profile
  useEffect(() => {
    const stored = localStorage.getItem('signatureProfile');
    if (stored) {
      try { setSignatureProfile(JSON.parse(stored)); } catch (e) { /* no-op */ }
    } else {
      const derived = {
        name: [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim(),
        company: organization?.name,
        address: '',
        email: user?.email || '',
        phone: ''
      };
      setSignatureProfile(derived);
    }
  }, [user, organization]);

  const saveDraftReport = () => {
    const now = new Date().toISOString();
    const report: ComplianceReport = {
      id: Date.now().toString(),
      planId: plan.id,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      items: { ...complianceState }
    };
    setSavedReports(prev => [report, ...prev]);
    setDraftSavedAt(new Date().toLocaleTimeString());
    toast({ title: 'Draft Saved', description: 'Compliance report saved as draft.' });
  };

  const finalizeReport = () => {
    const now = new Date().toISOString();
    const report: ComplianceReport = {
      id: Date.now().toString(),
      planId: plan.id,
      createdAt: now,
      updatedAt: now,
      status: 'final',
      items: { ...complianceState }
    };
    setSavedReports(prev => [report, ...prev]);
    toast({ title: 'Report Finalized', description: 'Final compliance report created.' });
  };

  const openSignReport = () => {
    // ensure required fields
    const missing = !signatureProfile.name || !signatureProfile.email || !signatureProfile.company || !signatureProfile.address || !signatureProfile.phone;
    if (missing) {
      setShowSignDialog(true);
      return;
    }
    performSign();
  };

  const performSign = () => {
    const signedAt = new Date().toISOString();
    // attach signature to latest final report or draft if none final
    setSavedReports(prev => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const idx = next.findIndex(r => r.planId === plan.id && r.status === 'final');
      const targetIdx = idx >= 0 ? idx : 0;
      const target = next[targetIdx];
      next[targetIdx] = { ...target, signed: { ...signatureProfile, signedAt } };
      return next;
    });
    toast({ title: 'Signed', description: 'Report digitally signed and saved (mock).' });
    setShowSignDialog(false);
  };

  const suggestComplianceWithAI = () => {
    // Mock AI suggestion: mark a few as complied with notes
    const next = { ...complianceState };
    complianceItems.slice(0, 5).forEach((k, idx) => { next[k] = { checked: true, note: `Covered under Para ${idx+1}.2 of plan` }; });
    setComplianceState(next);
    toast({ title: 'AI Suggestions Applied', description: 'Compliance checklist auto-populated from plan (mock).' });
  };

  const suggestEMWithAI = () => {
    setEmRows(prev => prev.map((r, i) => ({ ...r, score: 70 + i * 5, remarks: 'Auto-evaluated from plan (mock)' })));
    setDiscountingFactor(12.0);
    setImLink('https://vdr.example.com/im/ABC');
    toast({ title: 'AI Evaluation Completed', description: 'Scores populated and IM link generated (mock).' });
  };

  const addEMRow = () => setEmRows(prev => [...prev, { id: Math.random().toString(36).slice(2), criteria: '', weight: 0 }]);

  const saveEMDraft = () => {
    const savedAt = new Date().toLocaleTimeString();
    setSavedEMDraft({ rows: emRows, discountingFactor, savedAt });
    setDraftSavedAt(savedAt);
    toast({ title: 'Draft Saved', description: 'Evaluation Matrix draft saved locally.' });
  };

  // Queries: add response to thread and keep most recent at top
  const addQueryResponse = (qid: string) => {
    const text = (queryResponseDraft[qid] || '').trim(); if (!text) return;
    const target = plan.queries.find(q => q.id === qid);
    if (target) {
      target.thread = [...(target.thread || []), { id: Date.now().toString(), author: 'user', text, date: new Date().toISOString() }];
      target.response = text;
      target.status = 'answered';
      setQueryResponseDraft(prev => ({ ...prev, [qid]: '' }));
      setDraftSavedAt(new Date().toLocaleTimeString());
      toast({ title: 'Response Added' });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/resolution/plans')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plans
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Plan Details - {plan.praName}</h1>
              <p className="text-muted-foreground">Submitted: {new Date(plan.submissionDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(plan.status)}
            <Button size="sm" onClick={()=> navigate(`/resolution/plan/${plan.id}/edit`)}>Edit</Button>
            <Button size="sm" variant="outline" onClick={()=> navigate(`/resolution/plan/${plan.id}/comparison`)}>Compare</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="queries">Queries</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation Matrix</TabsTrigger>
            {/* <TabsTrigger value="actions">Actions</TabsTrigger> */}
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Summary of key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Plan Value</p>
                    <p className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(plan.planValue)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Compliance Score</p>
                    <p className="font-semibold">{plan.complianceScore}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Documents</p>
                    <p className="font-semibold">{plan.documents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Comparison & NPV Inputs</CardTitle>
                <CardDescription>Enter costs and timeline. Use AI to populate from IM (if subscribed). Export and save draft.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-56">
                    <Label>CIRP Cost</Label>
                    <Input type="number" value={cirpCost} onChange={(e)=> setCirpCost(parseFloat(e.target.value||'0'))} />
                  </div>
                  <div className="w-56">
                    <Label>Estimated Liquidation Cost</Label>
                    <Input type="number" value={estimatedLiquidationCost} onChange={(e)=> setEstimatedLiquidationCost(parseFloat(e.target.value||'0'))} />
                  </div>
                  <div className="w-56">
                    <Label>EPFO Dues</Label>
                    <Input type="number" value={epfoDues} onChange={(e)=> setEpfoDues(parseFloat(e.target.value||'0'))} />
                  </div>
                  <div className="w-56">
                    <Label>Gratuity</Label>
                    <Input type="number" value={gratuity} onChange={(e)=> setGratuity(parseFloat(e.target.value||'0'))} />
                  </div>
                  <div className="w-64">
                    <Label>Liquidator’s Fee (Estimated)</Label>
                    <Input readOnly value={liquidatorFeeEstimated} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={aiPopulateComparison}><PenTool className="h-4 w-4 mr-2" /> AI Populate</Button>
                    <Button variant="outline" onClick={exportComparisonCSV}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
                    <Button variant="outline" onClick={saveComparisonDraft}><Save className="h-4 w-4 mr-2" /> Save Draft</Button>
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Payment Timeline (Years vs Creditor Categories)</Label>
                  <div className="overflow-x-auto border rounded mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Year</TableHead>
                          <TableHead>Creditor Category</TableHead>
                          <TableHead className="w-48">Resolution Amount (INR)</TableHead>
                          <TableHead className="text-right w-32">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentTimeline.map(row => (
                          <TableRow key={row.id}>
                            <TableCell><Input type="number" value={row.year} onChange={(e)=> setPaymentTimeline(prev => prev.map(r=> r.id===row.id ? { ...r, year: parseInt(e.target.value||'0') } : r))} /></TableCell>
                            <TableCell><Input value={row.creditorCategory} onChange={(e)=> setPaymentTimeline(prev => prev.map(r=> r.id===row.id ? { ...r, creditorCategory: e.target.value } : r))} /></TableCell>
                            <TableCell><Input type="number" value={row.resolutionAmount} onChange={(e)=> setPaymentTimeline(prev => prev.map(r=> r.id===row.id ? { ...r, resolutionAmount: parseFloat(e.target.value||'0') } : r))} /></TableCell>
                            <TableCell className="text-right"><Button variant="outline" size="sm" onClick={()=> removeTimelineRow(row.id)}>Remove</Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-between mt-2">
                    <Button variant="outline" onClick={addTimelineRow}>Add Row</Button>
                    <div className="text-sm text-muted-foreground">Total Distribution: {new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(totalDistribution)}</div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Statutory Claims</Label>
                  <div className="overflow-x-auto border rounded mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Authority</TableHead>
                          <TableHead className="w-48">Amount</TableHead>
                          <TableHead>Note</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statutoryClaims.map(s => (
                          <TableRow key={s.id}>
                            <TableCell><Input value={s.authority} onChange={(e)=> setStatutoryClaims(prev=> prev.map(x=> x.id===s.id ? { ...x, authority: e.target.value } : x))} /></TableCell>
                            <TableCell><Input type="number" value={s.amount} onChange={(e)=> setStatutoryClaims(prev=> prev.map(x=> x.id===s.id ? { ...x, amount: parseFloat(e.target.value||'0') } : x))} /></TableCell>
                            <TableCell><Input value={s.note || ''} onChange={(e)=> setStatutoryClaims(prev=> prev.map(x=> x.id===s.id ? { ...x, note: e.target.value } : x))} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Original Plan Date</Label>
                    <Input type="date" value={originalDate} onChange={(e)=> setOriginalDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>Modified Plan Date</Label>
                    <Input type="date" value={modifiedDate} onChange={(e)=> setModifiedDate(e.target.value)} />
                    <div className="text-xs text-muted-foreground">If you select a modified date, the report will consider modified documents where available.</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">Draft saved {comparisonDraftAt ? `at ${comparisonDraftAt}` : '(edit to save)'}.</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Report Dialog */}
          {showSignDialog && (
            <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Complete Signature Details</DialogTitle>
                  <DialogDescription>Enter required details to proceed with e-sign.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <Input value={signatureProfile.name} onChange={(e)=> setSignatureProfile(p=>({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input value={signatureProfile.company || ''} onChange={(e)=> setSignatureProfile(p=>({ ...p, company: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input value={signatureProfile.address || ''} onChange={(e)=> setSignatureProfile(p=>({ ...p, address: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={signatureProfile.email} onChange={(e)=> setSignatureProfile(p=>({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={signatureProfile.phone || ''} onChange={(e)=> setSignatureProfile(p=>({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={()=> setShowSignDialog(false)}>Cancel</Button>
                    <Button onClick={()=> { localStorage.setItem('signatureProfile', JSON.stringify(signatureProfile)); performSign(); }}>Save & Sign</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Related Actions Tab (Meeting, Valuation, Tribunal, Regulatory) */}
          {/**
          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Related Actions</CardTitle>
                <CardDescription>Contextual shortcuts to adjacent modules. These are mocked links and toasts for now.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border rounded p-3">
                    <div className="font-medium mb-2">Circulate CoC Meeting Notice (Opening of Resolution Plan)</div>
                    <Button size="sm" onClick={()=> toast({ title: 'Meeting Notice Circulated', description: 'Notice drafted and circulated to CoC (mock).' })}>Open in Meetings</Button>
                  </div>
                  <div className="border rounded p-3">
                    <div className="font-medium mb-2">Open Resolution Plan in CoC Meeting</div>
                    <Button size="sm" onClick={()=> toast({ title: 'Meeting Launched', description: 'Plan opened in live meeting (mock).' })}>Launch Meeting</Button>
                  </div>
                  <div className="border rounded p-3">
                    <div className="font-medium mb-2">Share Valuation Report (on Confidential Undertaking)</div>
                    <Button size="sm" onClick={()=> toast({ title: 'Valuation Shared', description: 'Valuation report shared with CoC (mock).' })}>Share from Valuation</Button>
                  </div>
                  <div className="border rounded p-3">
                    <div className="font-medium mb-2">Submit Resolution Plan to AA (As published)</div>
                    <Button size="sm" onClick={()=> toast({ title: 'Submitted to AA', description: 'Submission logged in Litigation/Tribunal (mock).' })}>Open Tribunal</Button>
                  </div>
                  <div className="border rounded p-3">
                    <div className="font-medium mb-2">Form H</div>
                    <Button size="sm" onClick={()=> toast({ title: 'Form H Prepared', description: 'Form H drafted in Regulatory module (mock).' })}>Open Regulatory</Button>
                  </div>
                  <div className="border rounded p-3">
                    <div className="font-medium mb-2">CIRP 5</div>
                    <Button size="sm" onClick={()=> toast({ title: 'CIRP 5 Prepared', description: 'CIRP 5 drafted in Regulatory module (mock).' })}>Open Regulatory</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          **/}

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plan.documents.map(d => (
                      <TableRow key={d.id}>
                        <TableCell>{d.name}</TableCell>
                        <TableCell>{d.type}</TableCell>
                        <TableCell>{new Date(d.uploadDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <a href={d.url} rel="noreferrer">
                              <Eye className="h-3 w-3 mr-1" /> View
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {plan.documents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">No documents</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Queries</CardTitle>
                    <CardDescription>Ask questions and track threaded responses. Latest activity appears first.</CardDescription>
                  </div>
                  <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" /> Add Query
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Query</DialogTitle>
                        <DialogDescription>Enter your query for {plan.praName}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Textarea rows={4} value={newQuery} onChange={(e) => setNewQuery(e.target.value)} placeholder="Enter your query..." />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowQueryDialog(false)}>Cancel</Button>
                          <Button onClick={() => { if (!newQuery.trim()) return; toast({ title: 'Query added' }); setNewQuery(''); setShowQueryDialog(false); }}>Add Query</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Respond</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...plan.queries].sort((a,b)=>{
                        const ad = (a.thread && a.thread[a.thread.length-1]?.date) || a.createdAt;
                        const bd = (b.thread && b.thread[b.thread.length-1]?.date) || b.createdAt;
                        return bd.localeCompare(ad);
                      }).map(q => (
                        <TableRow key={q.id}>
                          <TableCell>{q.question}</TableCell>
                          <TableCell><Badge variant={q.status === 'answered' ? 'default' : 'secondary'}>{q.status}</Badge></TableCell>
                          <TableCell>{new Date(q.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="space-y-2">
                              <Textarea rows={2} value={queryResponseDraft[q.id] || ''} onChange={(e)=>setQueryResponseDraft(prev=>({ ...prev, [q.id]: e.target.value }))} placeholder="Type response..." />
                              <div className="flex justify-end">
                                <Button size="sm" variant="outline" onClick={()=>addQueryResponse(q.id)}>Reply</Button>
                              </div>
                              {(q.thread && q.thread.length>0) && (
                                <div className="text-xs text-muted-foreground text-left">
                                  Thread:
                                  <ul className="list-disc pl-4">
                                    {q.thread.slice().reverse().map(t => (
                                      <li key={t.id}><span className="font-medium">{t.author}</span>: {t.text} <span className="opacity-70">({new Date(t.date).toLocaleString()})</span></li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {plan.queries.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">No queries</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>IBC Compliance Checklist</CardTitle>
                <CardDescription>Mark compliance per IB Code/Regulations. You can edit notes or apply AI suggestions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={suggestComplianceWithAI}><PenTool className="h-4 w-4 mr-2" /> Suggest with AI</Button>
                  <Button variant="outline" onClick={exportReportCSV}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
                  <Button variant="outline" onClick={saveDraftReport}><Save className="h-4 w-4 mr-2" /> Save Draft</Button>
                  <Button variant="outline" onClick={finalizeReport}><Save className="h-4 w-4 mr-2" /> Finalize</Button>
                  <Button variant="outline" onClick={printPDF}><FileText className="h-4 w-4 mr-2" /> Print / PDF</Button>
                  <Button onClick={openSignReport}><Save className="h-4 w-4 mr-2" /> Sign & Save</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {complianceItems.map(item => (
                    <div key={item} className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">{item}</Label>
                        <Select value={complianceState[item]?.checked ? 'yes' : (complianceState[item]?.checked===false ? 'no' : '')} onValueChange={(v)=> setComplianceState(s=>({ ...s, [item]: { checked: v==='yes', note: s[item]?.note || '' } }))}>
                          <SelectTrigger className="w-28"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Complied</SelectItem>
                            <SelectItem value="no">Not Complied</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input className="mt-2" placeholder="Reference note, e.g. Para 2.2" value={complianceState[item]?.note || ''} onChange={(e)=> setComplianceState(s=>({ ...s, [item]: { checked: !!s[item]?.checked, note: e.target.value } }))} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluation Matrix Tab */}
          <TabsContent value="evaluation">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Matrix</CardTitle>
                <CardDescription>Manual entries or AI suggestions. Approve to generate IM link for PRAs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-4 flex-wrap">
                  <div className="w-60">
                    <Label>Discounting Factor</Label>
                    <Input type="number" value={discountingFactor} onChange={(e)=> setDiscountingFactor(parseFloat(e.target.value||'0'))} />
                  </div>
                  <Button variant="outline" onClick={suggestEMWithAI}><PenTool className="h-4 w-4 mr-2" /> Evaluate with AI</Button>
                  <Button variant="outline" onClick={saveEMDraft}><Save className="h-4 w-4 mr-2" /> Save</Button>
                  <Button onClick={()=>{ setImLink('https://vdr.example.com/im/ABC'); toast({ title: 'Evaluation Approved', description: 'IM link generated and shared with PRAs (mock).' }); }}>Approve & Generate IM Link</Button>
                </div>
                {imLink && (
                  <div className="text-sm">IM Link: <a href={imLink} className="underline" target="_blank" rel="noreferrer">{imLink}</a></div>
                )}
                <div className="overflow-x-auto border rounded">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Criteria</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emRows.map(r => (
                        <TableRow key={r.id}>
                          <TableCell>
                            <Input value={r.criteria} onChange={(e)=> setEmRows(prev => prev.map(x => x.id===r.id ? { ...x, criteria: e.target.value } : x))} />
                          </TableCell>
                          <TableCell className="w-32">
                            <Input type="number" value={r.weight} onChange={(e)=> setEmRows(prev => prev.map(x => x.id===r.id ? { ...x, weight: parseFloat(e.target.value||'0') } : x))} />
                          </TableCell>
                          <TableCell className="w-32">
                            <Input type="number" value={r.score ?? ''} onChange={(e)=> setEmRows(prev => prev.map(x => x.id===r.id ? { ...x, score: parseFloat(e.target.value||'0') } : x))} />
                          </TableCell>
                          <TableCell>
                            <Input value={r.remarks ?? ''} onChange={(e)=> setEmRows(prev => prev.map(x => x.id===r.id ? { ...x, remarks: e.target.value } : x))} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={addEMRow}>Add Row</Button>
                  <div className="text-xs text-muted-foreground">Draft saved {draftSavedAt ? `at ${draftSavedAt}` : '(edit to save)'}.</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ResolutionPlanDetails;

import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Reuse minimal types to mock editing like details page
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

const ResolutionPlanEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  type EditTab = 'overview'|'documents'|'queries'|'compliance'|'evaluation';
  const [activeTab, setActiveTab] = useState<EditTab>('overview');

  const plan = useMemo(() => mockPlans.find(p => p.id === id) || mockPlans[0], [id]);

  // Editable state mirrors key fields
  const [form, setForm] = useState({
    praName: plan.praName,
    status: plan.status,
    submissionDate: plan.submissionDate,
    planValue: plan.planValue,
    complianceScore: plan.complianceScore,
  });

  // Compliance editable state (simple map)
  const complianceItems = [
    'Section 30(1)','Section 30(2) (a)','Section 30(2) (b)','Section 30(2) (c)','Section 30(2) (d)','Section 30(2) (e)','Section 30(2) (f)',
    'Regulation 38 (1)','Regulation 38 (1A)','Regulation 38 (1B)','Regulation 38 (2)','Regulation 38 (3)'
  ] as const;
  const [complianceState, setComplianceState] = useState<Record<string, {checked: boolean; note?: string}>>({});

  // Evaluation matrix
  type EMRow = { id: string; criteria: string; weight: number; score?: number; remarks?: string };
  const [discountingFactor, setDiscountingFactor] = useState<number>(12.5);
  const [emRows, setEmRows] = useState<EMRow[]>([
    { id: 'em1', criteria: 'Financial Viability', weight: 30 },
    { id: 'em2', criteria: 'Implementation Timeline', weight: 25 },
  ]);

  const saveToStorage = () => {
    const key = `rp_edit_${plan.id}`;
    const payload = {
      form,
      complianceState,
      discountingFactor,
      emRows,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(payload));
  };

  const saveCurrentTab = () => {
    saveToStorage();
    toast({ title: 'Saved', description: `Your changes on ${activeTab} have been saved.` });
  };

  const goNext = () => {
    const order: typeof activeTab[] = ['overview','documents','queries','compliance','evaluation'];
    const idx = order.indexOf(activeTab);
    if (idx < order.length - 1) setActiveTab(order[idx+1]);
    else toast({ title: 'All steps completed', description: 'You have reached the last tab.' });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Plan - {plan.praName}</h1>
              <p className="text-muted-foreground">Submitted: {new Date(plan.submissionDate).toLocaleDateString()}</p>
            </div>
          </div>
          <Badge variant="secondary">Editing</Badge>
        </div>

        <Tabs value={activeTab} onValueChange={(v)=>setActiveTab(v as EditTab)} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="queries">Queries</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Edit key metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Plan Value (INR)</Label>
                    <Input type="number" value={form.planValue} onChange={(e)=> setForm(s=>({ ...s, planValue: parseFloat(e.target.value||'0') }))} />
                  </div>
                  <div>
                    <Label>Compliance Score (%)</Label>
                    <Input type="number" value={form.complianceScore} onChange={(e)=> setForm(s=>({ ...s, complianceScore: parseFloat(e.target.value||'0') }))} />
                  </div>
                  <div>
                    <Label>PRA Name</Label>
                    <Input value={form.praName} onChange={(e)=> setForm(s=>({ ...s, praName: e.target.value }))} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={saveCurrentTab}><Save className="h-4 w-4 mr-2" /> Save</Button>
                  <Button onClick={()=>{ saveCurrentTab(); goNext(); }}>
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Rename document titles if needed</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plan.documents.map(d => (
                      <TableRow key={d.id}>
                        <TableCell>
                          <Input defaultValue={d.name} />
                        </TableCell>
                        <TableCell>{d.type}</TableCell>
                        <TableCell>{new Date(d.uploadDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {plan.documents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">No documents</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={saveCurrentTab}><Save className="h-4 w-4 mr-2" /> Save</Button>
                  <Button onClick={()=>{ saveCurrentTab(); goNext(); }}>Next <ChevronRight className="h-4 w-4 ml-2" /></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <CardTitle>Queries</CardTitle>
                <CardDescription>You can edit your prepared responses inline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Your Response</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plan.queries.map(q => (
                        <TableRow key={q.id}>
                          <TableCell className="align-top">{q.question}</TableCell>
                          <TableCell>
                            <Textarea rows={3} defaultValue={q.response} />
                          </TableCell>
                        </TableRow>
                      ))}
                      {plan.queries.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-muted-foreground">No queries</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={saveCurrentTab}><Save className="h-4 w-4 mr-2" /> Save</Button>
                    <Button onClick={()=>{ saveCurrentTab(); goNext(); }}>Next <ChevronRight className="h-4 w-4 ml-2" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>IBC Compliance Checklist</CardTitle>
                <CardDescription>Mark compliance and add reference notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {complianceItems.map(item => (
                    <div key={item} className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">{item}</Label>
                        <Input type="checkbox" checked={!!complianceState[item]?.checked} onChange={(e)=> setComplianceState(s=>({ ...s, [item]: { checked: e.target.checked, note: s[item]?.note || '' } }))} className="h-4 w-4" />
                      </div>
                      <Input className="mt-2" placeholder="Reference note" value={complianceState[item]?.note || ''} onChange={(e)=> setComplianceState(s=>({ ...s, [item]: { checked: !!s[item]?.checked, note: e.target.value } }))} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={saveCurrentTab}><Save className="h-4 w-4 mr-2" /> Save</Button>
                  <Button onClick={()=>{ saveCurrentTab(); goNext(); }}>Next <ChevronRight className="h-4 w-4 ml-2" /></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Matrix</CardTitle>
                <CardDescription>Edit criteria, weights, and scores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-60">
                  <Label>Discounting Factor</Label>
                  <Input type="number" value={discountingFactor} onChange={(e)=> setDiscountingFactor(parseFloat(e.target.value||'0'))} />
                </div>
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
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={saveCurrentTab}><Save className="h-4 w-4 mr-2" /> Save</Button>
                  <Button onClick={()=>{ saveCurrentTab(); toast({ title: 'Saved', description: 'All edits saved.' }); navigate(`/resolution/plan/${plan.id}`); }}>Finish</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ResolutionPlanEdit;

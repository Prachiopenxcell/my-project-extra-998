import React, { useState, useEffect, useMemo } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  FileText,
  Users,
  Building,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bot,
  Target,
  Award,
  Star,
  TrendingUp,
  Save,
  Send,
  RefreshCw,
  Info,
  Shield,
  Hash,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  UserCheck,
  Settings2,
  ArrowUp,
  ArrowDown,
  Columns,
  Rows,
  Printer,
  Share2
} from 'lucide-react';

interface PRAEvaluation {
  id: string;
  praName: string;
  entityType: string;
  submissionDate: string;
  status: 'pending' | 'compliant' | 'non-compliant' | 'under-review';
  overallScore: number;
  section29ACompliance: boolean;
  eligibilityCriteria: {
    individuals: boolean;
    groups: boolean;
    financialInstitutions: boolean;
    fundHouses: boolean;
  };
  complianceChecklist: ComplianceItem[];
  aiEvaluationEnabled: boolean;
  remarks: string;
}

interface ComplianceItem {
  id: string;
  section: string;
  description: string;
  status: 'complied' | 'not-complied' | 'partial' | 'pending';
  evidence: string;
  remarks: string;
}

// === Report Types (aligned with PRADetails) ===
interface ReportCustomization {
  selectedFields: string[];
  fieldOrder: string[];
  sortBy?: string;
  sortDirection: 'asc' | 'desc';
  filters: Record<string, string | number | boolean>;
  layout: 'horizontal' | 'vertical';
}

interface ReportData {
  praId: string;
  praName: string;
  entityType: string;
  complianceStatus: string;
  section29AStatus: string;
  eligiblitycreator: 'Yes' | 'No';
  financialStatus: string;
  documentsStatus: string;
  remarks?: string;
}

interface ProvisionalReport {
  id: string;
  name: string;
  generatedDate: string;
  status: 'draft' | 'final' | 'circulated';
  customization: ReportCustomization;
  data: ReportData[];
}

interface SavedReport {
  id: string;
  name: string;
  format: 'pdf' | 'excel' | 'docx';
  savedDate: string;
  isSigned: boolean;
  filePath: string;
}

const PRAEvaluation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, organization, updateUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [aiEvaluationEnabled, setAiEvaluationEnabled] = useState(false);
  const [selectedPRA, setSelectedPRA] = useState<PRAEvaluation | null>(null);
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState<null | { praId: string; reportId: string }>(null);
  const [showSignatureDialog, setShowSignatureDialog] = useState<null | { praId: string; savedId: string }>(null);
  const [showCirculateDialog, setShowCirculateDialog] = useState<null | { praId: string; savedId: string }>(null);

  // Reports state per PRA
  const [reportCustomization, setReportCustomization] = useState<ReportCustomization>({
    selectedFields: ['praName', 'entityType', 'complianceStatus', 'section29AStatus', 'eligiblitycreator'],
    fieldOrder: ['praName', 'entityType', 'complianceStatus', 'section29AStatus', 'eligiblitycreator'],
    sortBy: 'praName',
    sortDirection: 'asc',
    filters: {},
    layout: 'horizontal'
  });
  const [reportsByPra, setReportsByPra] = useState<Record<string, ProvisionalReport[]>>({});
  const [savedReportsByPra, setSavedReportsByPra] = useState<Record<string, SavedReport[]>>({});

  const allAvailableFields = useMemo(() => (
    [
      { key: 'praName', label: 'PRA Name' },
      { key: 'entityType', label: 'Entity Type' },
      { key: 'complianceStatus', label: 'Compliance Status' },
      { key: 'section29AStatus', label: 'Section 29A' },
      { key: 'eligiblitycreator', label: 'Eligible' },
      { key: 'financialStatus', label: 'Financials' },
      { key: 'documentsStatus', label: 'Documents' },
      { key: 'remarks', label: 'Remarks' },
    ]
  ), []);

  // Mock PRA evaluations data
  const [praEvaluations, setPraEvaluations] = useState<PRAEvaluation[]>([
    {
      id: '1',
      praName: 'Resolution Partners LLC',
      entityType: 'Company',
      submissionDate: '2024-02-10',
      status: 'compliant',
      overallScore: 92,
      section29ACompliance: true,
      eligibilityCriteria: {
        individuals: true,
        groups: true,
        financialInstitutions: true,
        fundHouses: false
      },
      complianceChecklist: [
        {
          id: '1',
          section: 'Section 30(1)',
          description: 'Resolution plan provides for payment of debts',
          status: 'complied',
          evidence: 'Para 2.2 of resolution plan',
          remarks: 'Adequate provision made'
        },
        {
          id: '2',
          section: 'Section 30(2)(a)',
          description: 'Conformity with law',
          status: 'complied',
          evidence: 'Para 3.1 of resolution plan',
          remarks: 'All legal requirements met'
        }
      ],
      aiEvaluationEnabled: true,
      remarks: 'Strong financial capacity and good track record'
    },
    {
      id: '2',
      praName: 'Strategic Investments Ltd.',
      entityType: 'Company',
      submissionDate: '2024-02-12',
      status: 'under-review',
      overallScore: 78,
      section29ACompliance: false,
      eligibilityCriteria: {
        individuals: true,
        groups: false,
        financialInstitutions: true,
        fundHouses: true
      },
      complianceChecklist: [
        {
          id: '3',
          section: 'Section 30(1)',
          description: 'Resolution plan provides for payment of debts',
          status: 'partial',
          evidence: 'Para 2.1 of resolution plan',
          remarks: 'Partial provision, requires clarification'
        }
      ],
      aiEvaluationEnabled: false,
      remarks: 'Pending documentation verification'
    }
  ]);

  // Compliance sections for evaluation
  const complianceSections = [
    { id: 'section-30-1', name: 'Section 30(1)', description: 'Resolution plan provides for payment of debts' },
    { id: 'section-30-2a', name: 'Section 30(2)(a)', description: 'Conformity with law' },
    { id: 'section-30-2b', name: 'Section 30(2)(b)', description: 'Identification of assets' },
    { id: 'section-30-2c', name: 'Section 30(2)(c)', description: 'Treatment of creditors' },
    { id: 'section-30-2d', name: 'Section 30(2)(d)', description: 'Implementation timeline' },
    { id: 'section-30-2e', name: 'Section 30(2)(e)', description: 'Management structure' },
    { id: 'section-30-2f', name: 'Section 30(2)(f)', description: 'Monitoring mechanism' },
    { id: 'regulation-38-1', name: 'Regulation 38(1)', description: 'Minimum information requirements' },
    { id: 'regulation-38-1a', name: 'Regulation 38(1A)', description: 'Additional disclosures' },
    { id: 'regulation-38-1b', name: 'Regulation 38(1B)', description: 'Financial projections' },
    { id: 'regulation-38-2', name: 'Regulation 38(2)', description: 'Implementation details' },
    { id: 'regulation-38-3', name: 'Regulation 38(3)', description: 'Monitoring provisions' },
    { id: 'regulation-37a', name: 'Regulation 37(a)', description: 'Corporate debtor information' },
    { id: 'regulation-37b', name: 'Regulation 37(b)', description: 'Resolution applicant details' },
    { id: 'regulation-37ba', name: 'Regulation 37(ba)', description: 'Connected persons disclosure' },
    { id: 'regulation-37c', name: 'Regulation 37(c)', description: 'Financial information' },
    { id: 'regulation-37ca', name: 'Regulation 37(ca)', description: 'Funding arrangements' },
    { id: 'regulation-37d', name: 'Regulation 37(d)', description: 'Business plan' },
    { id: 'regulation-37e', name: 'Regulation 37(e)', description: 'Implementation timeline' },
    { id: 'regulation-37f', name: 'Regulation 37(f)', description: 'Management details' },
    { id: 'regulation-37g', name: 'Regulation 37(g)', description: 'Corporate governance' },
    { id: 'regulation-37h', name: 'Regulation 37(h)', description: 'Liquidation comparison' },
    { id: 'regulation-37i', name: 'Regulation 37(i)', description: 'Stakeholder consultation' },
    { id: 'regulation-37j', name: 'Regulation 37(j)', description: 'Compliance certificate' },
    { id: 'regulation-37k', name: 'Regulation 37(k)', description: 'Other material information' },
    { id: 'regulation-37l', name: 'Regulation 37(l)', description: 'Declarations' },
    { id: 'regulation-37m', name: 'Regulation 37(m)', description: 'Supporting documents' }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'secondary' as const, label: 'Pending', icon: AlertTriangle },
      'compliant': { variant: 'default' as const, label: 'Compliant', icon: CheckCircle },
      'non-compliant': { variant: 'destructive' as const, label: 'Non-Compliant', icon: XCircle },
      'under-review': { variant: 'default' as const, label: 'Under Review', icon: RefreshCw },
      'complied': { variant: 'default' as const, label: 'Complied', icon: CheckCircle },
      'not-complied': { variant: 'destructive' as const, label: 'Not Complied', icon: XCircle },
      'partial': { variant: 'secondary' as const, label: 'Partial', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || AlertTriangle;
    return (
      <Badge variant={config?.variant || 'secondary'} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config?.label || status}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleRunAIEvaluation = async () => {
    setLoading(true);
    try {
      // Mock AI evaluation process
      setTimeout(() => {
        setPraEvaluations(prev => 
          prev.map(pra => ({
            ...pra,
            status: pra.overallScore >= 75 ? 'compliant' : 'non-compliant',
            aiEvaluationEnabled: true
          }))
        );
        
        toast({
          title: "AI Evaluation Complete",
          description: "All PRAs have been evaluated using AI compliance analysis"
        });
        setLoading(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "AI evaluation failed. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  // Generate a provisional report for a specific PRA
  // Now includes ALL currently filtered PRAs in the report table
  const generateReportForPra = (pra: PRAEvaluation) => {
    const buildRow = (p: PRAEvaluation): ReportData => ({
      praId: p.id,
      praName: p.praName,
      entityType: p.entityType,
      complianceStatus: p.overallScore >= 80 ? 'Compliant' : 'Needs Review',
      section29AStatus: p.section29ACompliance ? 'Compliant' : 'Non-Compliant',
      eligiblitycreator: p.status === 'compliant' ? 'Yes' : 'No',
      financialStatus: 'Verified',
      documentsStatus: `${p.complianceChecklist.filter(c=>c.status==='complied').length}/${p.complianceChecklist.length || 1} Verified`,
      remarks: p.status === 'under-review' ? 'Subject to review' : undefined,
    });

    const rows: ReportData[] = (filteredPRAs && filteredPRAs.length
      ? filteredPRAs
      : praEvaluations
    ).map(buildRow);

    const newReport: ProvisionalReport = {
      id: `${pra.id}-${Date.now()}`,
      name: `Provisional Report - ${new Date().toLocaleDateString()}`,
      generatedDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      customization: { ...reportCustomization },
      data: rows
    };
    setReportsByPra(prev => ({
      ...prev,
      [pra.id]: [...(prev[pra.id] || []), newReport]
    }));
  };

  const handleGenerateReport = () => {
    // Bulk-generate for all filtered PRAs
    filteredPRAs.forEach(pra => generateReportForPra(pra));
    toast({
      title: 'Report(s) Generated',
      description: `Generated provisional report for ${filteredPRAs.length} PRA(s).`
    });
  };

  // Helper: build a matrix based on customization
  const buildReportMatrix = (rep: ProvisionalReport) => {
    const fields = rep.customization.fieldOrder.filter(f => rep.customization.selectedFields.includes(f));
    const rows = rep.data.map(row => fields.map(f => (row as any)[f] ?? ''));
    return { headers: fields, rows };
  };

  const downloadAsCSV = (rep: ProvisionalReport, asXlsx = false) => {
    const { headers, rows } = buildReportMatrix(rep);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv], { type: asXlsx ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rep.name.replace(/\s+/g,'_')}.${asXlsx ? 'xlsx' : 'csv'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsDOCX = (rep: ProvisionalReport) => {
    const { headers, rows } = buildReportMatrix(rep);
    const content = [rep.name, '', headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rep.name.replace(/\s+/g,'_')}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printAsPDF = (rep: ProvisionalReport) => {
    const { headers, rows } = buildReportMatrix(rep);
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>${rep.name}</title><style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style></head><body>`);
    w.document.write(`<h2>${rep.name}</h2>`);
    w.document.write('<table>');
    w.document.write('<thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead>');
    w.document.write('<tbody>' + rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('') + '</tbody>');
    w.document.write('</table></body></html>');
    w.document.close();
    w.focus();
    w.print();
  };

  const finalizeReport = (praId: string, reportId: string) => {
    const report = (reportsByPra[praId] || []).find(r => r.id === reportId);
    if (!report) return;
    // Move to saved reports
    setSavedReportsByPra(prev => ({
      ...prev,
      [praId]: [...(prev[praId] || []), {
        id: reportId,
        name: report.name,
        format: 'pdf',
        savedDate: new Date().toISOString().split('T')[0],
        isSigned: false,
        filePath: `/reports/${reportId}.pdf`
      }]
    }));
    // Optionally update status
    setReportsByPra(prev => ({
      ...prev,
      [praId]: (prev[praId] || []).map(r => r.id === reportId ? { ...r, status: 'final' } : r)
    }));
    toast({ title: 'Report Saved', description: 'Report finalized and saved.' });
  };

  // Signature handling with profile validation
  const [signatureForm, setSignatureForm] = useState({
    fullName: '',
    organization: '',
    address: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // prefill from auth
    const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
    setSignatureForm(prev => ({
      ...prev,
      fullName,
      organization: organization?.name || '',
      address: (user as any)?.address || '',
      email: user?.email || '',
      phone: (user as any)?.phone || ''
    }));
  }, [user, organization]);

  const signSavedReport = (praId: string, savedId: string) => {
    const sr = (savedReportsByPra[praId] || []).find(r => r.id === savedId);
    if (!sr) return;
    // Validate minimal fields
    const missing: string[] = [];
    if (!signatureForm.fullName) missing.push('Full Name');
    if (!signatureForm.organization) missing.push('Organization/Company Name');
    if (!signatureForm.address) missing.push('Registered Address');
    if (!signatureForm.email) missing.push('Email ID');
    if (!signatureForm.phone) missing.push('Phone Number');
    if (missing.length) {
      setShowSignatureDialog({ praId, savedId });
      toast({ title: 'Signature Details Required', description: `Please provide: ${missing.join(', ')}` });
      return;
    }
    setSavedReportsByPra(prev => ({
      ...prev,
      [praId]: (prev[praId] || []).map(r => r.id === savedId ? { ...r, isSigned: true } : r)
    }));
    toast({ title: 'Report Signed', description: 'Report signed electronically with profile details.' });
  };

  const handleUpdateCompliance = (praId: string, complianceData: Partial<PRAEvaluation>) => {
    setPraEvaluations(prev => 
      prev.map(pra => 
        pra.id === praId 
          ? { ...pra, ...complianceData }
          : pra
      )
    );
    
    toast({
      title: "Success",
      description: "PRA evaluation updated successfully"
    });
  };

  const filteredPRAs = praEvaluations.filter(pra => {
    const matchesSearch = pra.praName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pra.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const complianceStats = {
    compliant: praEvaluations.filter(p => p.status === 'compliant').length,
    nonCompliant: praEvaluations.filter(p => p.status === 'non-compliant').length,
    underReview: praEvaluations.filter(p => p.status === 'under-review').length,
    pending: praEvaluations.filter(p => p.status === 'pending').length
  };

  return (
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
              <h1 className="text-2xl font-bold">PRA Evaluation & Compliance Assessment</h1>
              <p className="text-muted-foreground">
                Evaluate Prospective Resolution Applicants against regulatory compliance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRunAIEvaluation}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  AI Evaluating...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  Run AI Evaluation
                </>
              )}
            </Button>
            <Button onClick={() => setShowCustomizeDialog(true)} variant="outline" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Customize
            </Button>
            <Button onClick={handleGenerateReport} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliant PRAs</p>
                  <p className="text-2xl font-bold text-green-600">{complianceStats.compliant}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Non-Compliant</p>
                  <p className="text-2xl font-bold text-red-600">{complianceStats.nonCompliant}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                  <p className="text-2xl font-bold text-blue-600">{complianceStats.underReview}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{complianceStats.pending}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
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
                  <BarChart3 className="h-5 w-5" />
                  PRA Compliance Evaluation
                </CardTitle>
                <CardDescription>
                  Assess PRAs against Section 29A and other regulatory requirements
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  AI Evaluation: {aiEvaluationEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Settings2 className="h-3 w-3" />
                  Layout: {reportCustomization.layout === 'horizontal' ? 'Horizontal' : 'Vertical'}
                </Badge>
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
                    placeholder="Search PRAs..."
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
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* PRA Evaluation List */}
              <div className="space-y-4">
                {filteredPRAs.map((pra) => (
                  <Card key={pra.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold text-lg">{pra.praName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {pra.entityType} • Submitted: {new Date(pra.submissionDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(pra.overallScore)}`}>
                              {pra.overallScore}%
                            </div>
                            <div className="text-xs text-muted-foreground">Overall Score</div>
                          </div>
                          {getStatusBadge(pra.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        {/* Section 29A Compliance */}
                        <div className="space-y-3">
                          <h5 className="font-medium flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Section 29A Compliance
                          </h5>
                          <div className="flex items-center gap-2">
                            {pra.section29ACompliance ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className={pra.section29ACompliance ? 'text-green-600' : 'text-red-600'}>
                              {pra.section29ACompliance ? 'Compliant' : 'Non-Compliant'}
                            </span>
                          </div>
                        </div>

                        {/* Eligibility Criteria */}
                        <div className="space-y-3">
                          <h5 className="font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Eligibility Criteria
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              {pra.eligibilityCriteria.individuals ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                              Individuals
                            </div>
                            <div className="flex items-center gap-1">
                              {pra.eligibilityCriteria.groups ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                              Groups
                            </div>
                            <div className="flex items-center gap-1">
                              {pra.eligibilityCriteria.financialInstitutions ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                              Financial Institutions
                            </div>
                            <div className="flex items-center gap-1">
                              {pra.eligibilityCriteria.fundHouses ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                              Fund Houses
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compliance Progress */}
                      <div className="space-y-3 mb-4">
                        <h5 className="font-medium">Compliance Checklist Progress</h5>
                        <Progress value={pra.overallScore} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Complied: {pra.complianceChecklist.filter(c => c.status === 'complied').length}</span>
                          <span>Partial: {pra.complianceChecklist.filter(c => c.status === 'partial').length}</span>
                          <span>Not Complied: {pra.complianceChecklist.filter(c => c.status === 'not-complied').length}</span>
                        </div>
                      </div>

                      {/* Remarks */}
                      {pra.remarks && (
                        <div className="space-y-2 mb-4">
                          <h5 className="font-medium text-sm">Remarks</h5>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{pra.remarks}</p>
                        </div>
                      )}

                      {/* Per-PRA Actions */}
                      <div className="flex justify-between items-center pb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {pra.aiEvaluationEnabled && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Bot className="h-3 w-3" />
                              AI Evaluated
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => generateReportForPra(pra)}>
                            <FileText className="h-3 w-3 mr-1" />
                            Generate Report
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowCustomizeDialog(true)}>
                            <Settings2 className="h-3 w-3 mr-1" />
                            Customize
                          </Button>
                          <Dialog open={showEvaluationDialog && selectedPRA?.id === pra.id} onOpenChange={(open) => {
                            setShowEvaluationDialog(open);
                            if (open) setSelectedPRA(pra);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit Evaluation
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit PRA Evaluation - {pra.praName}</DialogTitle>
                                <DialogDescription>
                                  Update compliance assessment and evaluation details
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Compliance Checklist */}
                                <div>
                                  <h4 className="font-medium mb-4">Compliance Checklist</h4>
                                  <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {complianceSections.map((section) => (
                                      <div key={section.id} className="flex items-center justify-between p-3 border rounded">
                                        <div className="flex-1">
                                          <div className="font-medium text-sm">{section.name}</div>
                                          <div className="text-xs text-muted-foreground">{section.description}</div>
                                        </div>
                                        <Select defaultValue="pending">
                                          <SelectTrigger className="w-32">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="complied">Complied</SelectItem>
                                            <SelectItem value="not-complied">Not Complied</SelectItem>
                                            <SelectItem value="partial">Partial</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setShowEvaluationDialog(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => {
                                    handleUpdateCompliance(pra.id, { status: 'under-review' });
                                    setShowEvaluationDialog(false);
                                  }}>
                                    Save Changes
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

                      {/* Provisional Reports List for this PRA */}
                      <div className="space-y-2 border-t pt-4">
                        <h5 className="font-medium text-sm">Provisional Reports</h5>
                        {!(reportsByPra[pra.id] && reportsByPra[pra.id].length) && (
                          <div className="text-xs text-muted-foreground">No reports yet. Click Generate Report to create one.</div>
                        )}
                        <div className="space-y-3">
                          {(reportsByPra[pra.id] || []).map((rep) => (
                            <div key={rep.id} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <div className="font-medium text-sm">{rep.name}</div>
                                <div className="text-xs text-muted-foreground">Generated: {rep.generatedDate} • Status: {rep.status}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setShowPreviewDialog({ praId: pra.id, reportId: rep.id })}>View</Button>
                                <Button size="sm" variant="outline" onClick={() => printAsPDF(rep)} title="Print / Save as PDF"><Printer className="h-3 w-3 mr-1"/>PDF</Button>
                                <Button size="sm" variant="outline" onClick={() => downloadAsCSV(rep, true)}>Excel</Button>
                                <Button size="sm" variant="outline" onClick={() => downloadAsDOCX(rep)}>DOCX</Button>
                                <Button size="sm" onClick={() => finalizeReport(pra.id, rep.id)}>Finalize & Save</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {(savedReportsByPra[pra.id] || []).length > 0 && (
                          <div className="pt-2">
                            <h6 className="font-medium text-sm mb-2">Saved Reports</h6>
                            <div className="space-y-2">
                              {savedReportsByPra[pra.id]!.map(sr => (
                                <div key={sr.id} className="flex items-center justify-between p-2 border rounded">
                                  <div className="text-sm">{sr.name} • Saved: {sr.savedDate} {sr.isSigned && <Badge className="ml-2" variant="secondary">Signed</Badge>}</div>
                                  <div className="flex gap-2">
                                    {!sr.isSigned && <Button size="sm" variant="outline" onClick={() => signSavedReport(pra.id, sr.id)}>Sign</Button>}
                                    <Button size="sm" variant="outline" onClick={() => {
                                      const rep = (reportsByPra[pra.id] || []).find(r => r.id === sr.id);
                                      if (rep) printAsPDF(rep);
                                    }}>Download</Button>
                                    <Button size="sm" variant="outline" onClick={() => setShowCirculateDialog({ praId: pra.id, savedId: sr.id })}><Share2 className="h-3 w-3 mr-1"/>Circulate</Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPRAs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No PRAs found matching your criteria</p>
                  <p className="text-sm">Try adjusting your search or filter settings</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

{/* Customize Report Dialog */}
<Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Customize Provisional Report</DialogTitle>
      <DialogDescription>Choose fields, order, layout, and sorting for the generated report</DialogDescription>
    </DialogHeader>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Field Selection</h4>
        <div className="space-y-2">
          {allAvailableFields.map(f => {
            const checked = reportCustomization.selectedFields.includes(f.key);
            return (
              <label key={f.key} className="flex items-center gap-2 text-sm">
                <Checkbox checked={checked} onCheckedChange={(v) => {
                  setReportCustomization(prev => {
                    const selected = new Set(prev.selectedFields);
                    if (v) { selected.add(f.key); } else { selected.delete(f.key); }
                    const next = Array.from(selected);
                    // ensure fieldOrder contains selected fields in order
                    const newOrder = prev.fieldOrder.filter(k => next.includes(k));
                    // append newly added at end
                    next.forEach(k => { if (!newOrder.includes(k)) newOrder.push(k); });
                    return { ...prev, selectedFields: next, fieldOrder: newOrder };
                  });
                }} />
                {f.label}
              </label>
            );
          })}
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Field Arrangement</h4>
        <div className="space-y-2">
          {reportCustomization.fieldOrder.filter(k => reportCustomization.selectedFields.includes(k)).map((k, idx, arr) => {
            const label = allAvailableFields.find(f => f.key === k)?.label || k;
            return (
              <div key={k} className="flex items-center justify-between border rounded p-2 text-sm">
                <span className="flex items-center gap-2"><Columns className="h-3 w-3" />{label}</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" disabled={idx===0}
                    onClick={() => setReportCustomization(prev => {
                      const order = [...prev.fieldOrder];
                      const i = order.indexOf(k);
                      if (i>0) { [order[i-1], order[i]] = [order[i], order[i-1]]; }
                      return { ...prev, fieldOrder: order };
                    })}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7" disabled={idx===arr.length-1}
                    onClick={() => setReportCustomization(prev => {
                      const order = [...prev.fieldOrder];
                      const i = order.indexOf(k);
                      if (i>=0 && i<order.length-1) { [order[i+1], order[i]] = [order[i], order[i+1]]; }
                      return { ...prev, fieldOrder: order };
                    })}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="space-y-1">
            <Label className="text-xs">Layout</Label>
            <Select value={reportCustomization.layout} onValueChange={(v: 'horizontal' | 'vertical') => setReportCustomization(prev => ({ ...prev, layout: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal"><Columns className="h-3 w-3 mr-1 inline"/>Horizontal</SelectItem>
                <SelectItem value="vertical"><Rows className="h-3 w-3 mr-1 inline"/>Vertical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Sort By</Label>
            <Select value={reportCustomization.sortBy} onValueChange={(v) => setReportCustomization(prev => ({ ...prev, sortBy: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allAvailableFields.map(f => (
                  <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Direction</Label>
            <Select value={reportCustomization.sortDirection} onValueChange={(v: 'asc'|'desc') => setReportCustomization(prev => ({ ...prev, sortDirection: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Filter: 29A</Label>
            <Select value={(reportCustomization.filters.section29AStatus as string) || 'any'} onValueChange={(v) => setReportCustomization(prev => ({ ...prev, filters: { ...prev.filters, section29AStatus: v==='any' ? '' : v } }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="Compliant">Compliant</SelectItem>
                <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>Close</Button>
      <Button onClick={() => { setShowCustomizeDialog(false); toast({ title: 'Customization Saved' }); }}>Save</Button>
    </div>
  </DialogContent>
</Dialog>

{/* Report Preview Dialog */}
<Dialog open={!!showPreviewDialog} onOpenChange={(open) => { if (!open) setShowPreviewDialog(null); }}>
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle>Report Preview</DialogTitle>
    </DialogHeader>
    {showPreviewDialog && (() => {
      const rep = (reportsByPra[showPreviewDialog.praId] || []).find(r => r.id === showPreviewDialog.reportId);
      if (!rep) return <div className="text-sm text-muted-foreground">Report not found</div>;
      const { headers, rows } = buildReportMatrix(rep);
      if (rep.customization.layout === 'vertical') {
        // transpose: fields as rows
        return (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  {rep.data.map((_, idx) => (<TableHead key={idx}>Row {idx+1}</TableHead>))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {headers.map((h, i) => (
                  <TableRow key={h}>
                    <TableCell className="font-medium">{h}</TableCell>
                    {rows.map((r, j) => (<TableCell key={`${i}-${j}`}>{r[i]}</TableCell>))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      }
      // horizontal
      return (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map(h => (<TableHead key={h}>{h}</TableHead>))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={idx}>{r.map((c, i) => (<TableCell key={`${idx}-${i}`}>{c}</TableCell>))}</TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    })()}
    <div className="flex justify-end gap-2">
      {showPreviewDialog && (() => {
        const rep = (reportsByPra[showPreviewDialog.praId] || []).find(r => r.id === showPreviewDialog.reportId);
        if (!rep) return null;
        return (
          <>
            <Button variant="outline" onClick={() => printAsPDF(rep)}><Printer className="h-4 w-4 mr-1"/>PDF</Button>
            <Button variant="outline" onClick={() => downloadAsCSV(rep, true)}>Excel</Button>
            <Button variant="outline" onClick={() => downloadAsDOCX(rep)}>DOCX</Button>
          </>
        );
      })()}
    </div>
  </DialogContent>
</Dialog>

{/* Signature Details Dialog */}
<Dialog open={!!showSignatureDialog} onOpenChange={(open) => { if (!open) setShowSignatureDialog(null); }}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Signature Details Required</DialogTitle>
      <DialogDescription>Provide missing fields to proceed with e-signing</DialogDescription>
    </DialogHeader>
    <div className="grid grid-cols-1 gap-3">
      <div>
        <Label className="text-xs">Full Name</Label>
        <Input value={signatureForm.fullName} onChange={(e) => setSignatureForm(prev => ({ ...prev, fullName: e.target.value }))} />
      </div>
      <div>
        <Label className="text-xs">Organization/Company Name</Label>
        <Input value={signatureForm.organization} onChange={(e) => setSignatureForm(prev => ({ ...prev, organization: e.target.value }))} />
      </div>
      <div>
        <Label className="text-xs">Registered Address</Label>
        <Textarea value={signatureForm.address} onChange={(e) => setSignatureForm(prev => ({ ...prev, address: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Email</Label>
          <Input value={signatureForm.email} onChange={(e) => setSignatureForm(prev => ({ ...prev, email: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs">Phone Number</Label>
          <Input value={signatureForm.phone} onChange={(e) => setSignatureForm(prev => ({ ...prev, phone: e.target.value }))} />
        </div>
      </div>
    </div>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setShowSignatureDialog(null)}>Cancel</Button>
      <Button onClick={() => {
        // Optionally persist minimal profile locally via updateUser for demo
        updateUser({ firstName: signatureForm.fullName.split(' ')[0] || (user?.firstName || ''), lastName: signatureForm.fullName.split(' ').slice(1).join(' ') });
        toast({ title: 'Details Saved', description: 'Proceeding to sign the report.' });
        if (showSignatureDialog) {
          signSavedReport(showSignatureDialog.praId, showSignatureDialog.savedId);
          setShowSignatureDialog(null);
        }
      }}>Save & Sign</Button>
    </div>
  </DialogContent>
</Dialog>

{/* Circulation Dialog */}
<Dialog open={!!showCirculateDialog} onOpenChange={(open) => { if (!open) setShowCirculateDialog(null); }}>
  <DialogContent className="max-w-xl">
    <DialogHeader>
      <DialogTitle>Circulate Provisional PRA Report</DialogTitle>
      <DialogDescription>Send the report to CoC members and PRAs with optional auto-mail cycle</DialogDescription>
    </DialogHeader>
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Email Mode</Label>
          <Select defaultValue="auto">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Objection Due Date (optional)</Label>
          <Input type="date" />
        </div>
      </div>
      <div>
        <Label className="text-xs">Additional Message (optional)</Label>
        <Textarea placeholder="Add a brief note to include in the email..." />
      </div>
      <Alert>
        <AlertDescription>
          PRAs will receive an email with the PDF report attached. CoC members will receive a link to view/download and upload objections/documents.
        </AlertDescription>
      </Alert>
    </div>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setShowCirculateDialog(null)}>Cancel</Button>
      <Button onClick={() => {
        toast({ title: 'Circulation Queued', description: 'Emails to PRAs and CoC members have been initiated.' });
        if (showCirculateDialog) {
          // mark status as circulated
          setReportsByPra(prev => ({
            ...prev,
            [showCirculateDialog.praId]: (prev[showCirculateDialog.praId] || []).map(r => r.id === showCirculateDialog.savedId ? { ...r, status: 'circulated' } : r)
          }));
          setShowCirculateDialog(null);
        }
      }}>Send</Button>
    </div>
  </DialogContent>
</Dialog>

      </div>
    </DashboardLayout>
  );
};

export default PRAEvaluation;

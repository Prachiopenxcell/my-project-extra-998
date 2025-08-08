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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
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
  UserCheck
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

const PRAEvaluation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [aiEvaluationEnabled, setAiEvaluationEnabled] = useState(false);
  const [selectedPRA, setSelectedPRA] = useState<PRAEvaluation | null>(null);
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);

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

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Provisional eligibility report has been generated and saved"
    });
    navigate('/resolution/reports');
  };

  const handleUpdateCompliance = (praId: string, complianceData: any) => {
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

                      {/* Top Compliance Items */}
                      {pra.complianceChecklist.length > 0 && (
                        <div className="space-y-3 mb-4">
                          <h5 className="font-medium">Recent Compliance Items</h5>
                          <div className="space-y-2">
                            {pra.complianceChecklist.slice(0, 2).map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{item.section}</div>
                                  <div className="text-xs text-muted-foreground">{item.description}</div>
                                  {item.evidence && (
                                    <div className="text-xs text-blue-600 mt-1">Evidence: {item.evidence}</div>
                                  )}
                                </div>
                                {getStatusBadge(item.status)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Remarks */}
                      {pra.remarks && (
                        <div className="space-y-2 mb-4">
                          <h5 className="font-medium text-sm">Remarks</h5>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{pra.remarks}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {pra.aiEvaluationEnabled && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Bot className="h-3 w-3" />
                              AI Evaluated
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
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
      </div>
    </DashboardLayout>
  );
};

export default PRAEvaluation;

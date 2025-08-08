import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { 
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  BarChart3,
  RefreshCw,
  Target,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Mail,
  Zap,
  FileText,
  FileCheck
} from "lucide-react";
import { format } from 'date-fns';
import PRADetailView from './PRADetailView';
import PRAEditForm from './PRAEditForm';

interface PRAApplication {
  id: string;
  name: string;
  groupType: 'standalone' | 'consortium' | 'group';
  entityType: 'company' | 'partnership' | 'llp';
  submitDate: string;
  status: 'review' | 'approved' | 'query' | 'rejected';
  complianceScore: number;
  section29ACompliant: boolean;
  documentsComplete: boolean;
  netWorthCertificate: boolean;
  kycComplete: boolean;
}

interface ComplianceStats {
  totalPRAs: number;
  newPRAs: number;
  section29ACompliant: number;
  documentsComplete: number;
  readyForApproval: number;
}

interface PRAEvaluationProps {
  onAIAutoEvaluate?: () => void;
  onGenerateReport?: () => void;
}

const PRAEvaluation = ({ onAIAutoEvaluate, onGenerateReport }: PRAEvaluationProps = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("this_month");
  const [praApplicationsList, setPraApplicationsList] = useState<PRAApplication[]>([]);
  const [selectedPRA, setSelectedPRA] = useState<PRAApplication | null>(null);
  const [showComplianceDialog, setShowComplianceDialog] = useState(false);
  const [showPRADetailView, setShowPRADetailView] = useState(false);
  const [showPRAEditForm, setShowPRAEditForm] = useState(false);

  // Initialize PRA applications if empty
  const initialPraApplications: PRAApplication[] = [
    {
      id: "1",
      name: "TechSol",
      groupType: "standalone",
      entityType: "company",
      submitDate: "2025-01-15",
      status: "review",
      complianceScore: 85,
      section29ACompliant: true,
      documentsComplete: true,
      netWorthCertificate: false,
      kycComplete: true
    },
    {
      id: "2",
      name: "InfraCorp",
      groupType: "consortium",
      entityType: "partnership",
      submitDate: "2025-01-16",
      status: "approved",
      complianceScore: 92,
      section29ACompliant: true,
      documentsComplete: true,
      netWorthCertificate: true,
      kycComplete: true
    },
    {
      id: "3",
      name: "MetalWks",
      groupType: "standalone",
      entityType: "company",
      submitDate: "2025-01-17",
      status: "query",
      complianceScore: 78,
      section29ACompliant: false,
      documentsComplete: false,
      netWorthCertificate: true,
      kycComplete: false
    },
    {
      id: "4",
      name: "PowerGen",
      groupType: "group",
      entityType: "company",
      submitDate: "2025-01-18",
      status: "review",
      complianceScore: 88,
      section29ACompliant: true,
      documentsComplete: true,
      netWorthCertificate: true,
      kycComplete: true
    },
    {
      id: "5",
      name: "CleanTech",
      groupType: "standalone",
      entityType: "company",
      submitDate: "2025-01-19",
      status: "approved",
      complianceScore: 94,
      section29ACompliant: true,
      documentsComplete: true,
      netWorthCertificate: true,
      kycComplete: true
    }
  ];

  if (praApplicationsList.length === 0) {
    setPraApplicationsList(initialPraApplications);
  }

  const handleViewPRA = (praId: string) => {
    const pra = praApplicationsList.find(p => p.id === praId);
    if (pra) {
      // Enhance PRA data with additional details for the detailed view
      const enhancedPRA = {
        ...pra,
        contactInfo: {
          email: `${pra.name.toLowerCase().replace(' ', '.')}@example.com`,
          phone: '+91 98765 43210',
          address: '123 Business District, Mumbai, Maharashtra 400001'
        },
        financialInfo: {
          netWorth: 50000000,
          turnover: 120000000,
          experience: '10+ years in corporate restructuring and insolvency resolution with expertise in manufacturing, retail, and service sectors.'
        },
        documents: [
          { name: 'Registration Certificate', status: 'verified' as const, uploadDate: '2024-01-15', remarks: 'Valid certificate verified' },
          { name: 'Financial Statements', status: 'submitted' as const, uploadDate: '2024-01-20' },
          { name: 'Net Worth Certificate', status: 'verified' as const, uploadDate: '2024-01-18', remarks: 'CA certified' },
          { name: 'Experience Certificate', status: 'pending' as const },
          { name: 'Team Details', status: 'submitted' as const, uploadDate: '2024-01-22' }
        ],
        evaluationHistory: [
          { date: pra.submitDate, action: 'Application Submitted', evaluator: 'System', remarks: 'Initial submission received' },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), action: 'Document Review', evaluator: 'John Smith', remarks: 'All required documents submitted' },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), action: 'Compliance Check', evaluator: 'Sarah Johnson', remarks: 'Section 29A compliance verified' }
        ]
      };
      setSelectedPRA(enhancedPRA);
      setShowPRADetailView(true);
    }
  };

  const handleEditPRA = (praId: string) => {
    const pra = praApplicationsList.find(p => p.id === praId);
    if (pra) {
      // Enhance PRA data for editing
      const enhancedPRA = {
        ...pra,
        contactInfo: {
          email: `${pra.name.toLowerCase().replace(' ', '.')}@example.com`,
          phone: '+91 98765 43210',
          address: '123 Business District, Mumbai, Maharashtra 400001'
        },
        financialInfo: {
          netWorth: 50000000,
          turnover: 120000000,
          experience: '10+ years in corporate restructuring and insolvency resolution with expertise in manufacturing, retail, and service sectors.'
        },
        documents: [
          { name: 'Registration Certificate', status: 'verified' as const, uploadDate: '2024-01-15', remarks: 'Valid certificate verified' },
          { name: 'Financial Statements', status: 'submitted' as const, uploadDate: '2024-01-20' },
          { name: 'Net Worth Certificate', status: 'verified' as const, uploadDate: '2024-01-18', remarks: 'CA certified' },
          { name: 'Experience Certificate', status: 'pending' as const },
          { name: 'Team Details', status: 'submitted' as const, uploadDate: '2024-01-22' }
        ],
        evaluationHistory: [
          { date: pra.submitDate, action: 'Application Submitted', evaluator: 'System', remarks: 'Initial submission received' },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), action: 'Document Review', evaluator: 'John Smith', remarks: 'All required documents submitted' },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), action: 'Compliance Check', evaluator: 'Sarah Johnson', remarks: 'Section 29A compliance verified' }
        ]
      };
      setSelectedPRA(enhancedPRA);
      setShowPRAEditForm(true);
    }
  };

  const handleComplianceView = (praId: string) => {
    const pra = praApplicationsList.find(p => p.id === praId);
    if (pra) {
      setSelectedPRA(pra);
      setShowComplianceDialog(true);
    }
  };

  const handleSavePRA = (updatedPRA: PRAApplication) => {
    setPraApplicationsList(praApplicationsList.map(pra => 
      pra.id === updatedPRA.id ? { ...pra, ...updatedPRA } : pra
    ));
    toast({
      title: "PRA Updated",
      description: `${updatedPRA.name}'s application has been successfully updated.`
    });
  };

  const handleApprovePRA = (praId: string) => {
    setPraApplicationsList(praApplicationsList.map(pra => 
      pra.id === praId ? { ...pra, status: 'approved' } : pra
    ));
    toast({
      title: "PRA Approved",
      description: "The PRA application has been approved successfully."
    });
  };

  const handleRejectPRA = (praId: string) => {
    setPraApplicationsList(praApplicationsList.map(pra => 
      pra.id === praId ? { ...pra, status: 'rejected' } : pra
    ));
    toast({
      title: "PRA Rejected",
      description: "The PRA application has been rejected.",
      variant: "destructive"
    });
  };

  const handleAIAutoEvaluate = () => {
    if (onAIAutoEvaluate) {
      onAIAutoEvaluate();
    } else {
      toast({
        title: "AI Auto-Evaluation Started",
        description: "AI is evaluating all pending PRA applications..."
      });
      // Simulate AI evaluation
      setTimeout(() => {
        toast({
          title: "AI Evaluation Complete",
          description: "3 PRAs recommended for approval, 1 flagged for review."
        });
      }, 2000);
    }
  };

  const handleGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport();
    } else {
      toast({
        title: "Generating Report",
        description: "PRA evaluation report is being generated..."
      });
    }
  };

  const complianceStats: ComplianceStats = {
    totalPRAs: 23,
    newPRAs: 5,
    section29ACompliant: 18,
    documentsComplete: 15,
    readyForApproval: 12
  };

  const recentAlerts = [
    {
      id: "1",
      type: "warning",
      message: "TechSol Inc. - Missing Net Worth Certificate (Due in 2 days)",
      icon: AlertTriangle,
      color: "text-yellow-600"
    },
    {
      id: "2",
      type: "success",
      message: "InfraCorp - All documents verified and compliant",
      icon: CheckCircle2,
      color: "text-green-600"
    },
    {
      id: "3",
      type: "info",
      message: "MetalWorks - Responded to Section 29A query",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      id: "4",
      type: "info",
      message: "PowerGen Group - Automatic reminder sent for pending KYC docs",
      icon: Mail,
      color: "text-blue-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      review: { label: "Review", color: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approved", color: "bg-green-100 text-green-800" },
      query: { label: "Query", color: "bg-red-100 text-red-800" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredPRAs = praApplicationsList.filter(pra => {
    const matchesSearch = pra.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || pra.status === statusFilter;
    const matchesType = typeFilter === "all" || pra.groupType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">

      {/* Filter & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PRA applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="query">Query</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="standalone">Standalone</SelectItem>
                <SelectItem value="consortium">Consortium</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total PRAs Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total PRAs</p>
                <p className="text-3xl font-bold">{complianceStats.totalPRAs}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                +{complianceStats.newPRAs} new
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 29A Compliant Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">29A Compliant</p>
                <p className="text-3xl font-bold">{complianceStats.section29ACompliant}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                {Math.round((complianceStats.section29ACompliant / complianceStats.totalPRAs) * 100)}% ✓
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Docs Complete Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Docs Complete</p>
                <p className="text-3xl font-bold">{complianceStats.documentsComplete}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                {Math.round((complianceStats.documentsComplete / complianceStats.totalPRAs) * 100)}% ✓
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Ready for Approval Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Ready for Approval</p>
                <p className="text-3xl font-bold">{complianceStats.readyForApproval}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  toast({
                    title: "Generating Approval List",
                    description: "Creating list of PRAs ready for approval..."
                  });
                }}
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Generate List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PRA Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>PRA Applications List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PRA Name</TableHead>
                <TableHead>Group/Stand.</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Submit Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPRAs.map((pra) => (
                <TableRow key={pra.id}>
                  <TableCell className="font-medium">{pra.name}</TableCell>
                  <TableCell className="capitalize">{pra.groupType}</TableCell>
                  <TableCell className="capitalize">{pra.entityType}</TableCell>
                  <TableCell>{format(new Date(pra.submitDate), "dd-MMM-yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(pra.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={pra.complianceScore} className="w-16" />
                      <span className="text-sm">{pra.complianceScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        title="View"
                        onClick={() => handleViewPRA(pra.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        title="Edit"
                        onClick={() => handleEditPRA(pra.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        title="Compliance"
                        onClick={() => handleComplianceView(pra.id)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      {pra.status === 'review' && (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" title="Approve">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approve PRA Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve {pra.name}'s application? This will move them to the approved list.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleApprovePRA(pra.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" title="Reject">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject PRA Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject {pra.name}'s application? This action can be reversed later if needed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleRejectPRA(pra.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Reject
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activities & Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Activities & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-50' :
                alert.type === 'success' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <alert.icon className={`h-5 w-5 ${alert.color}`} />
                <span className="text-sm">{alert.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Received EOIs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Search className="h-4 w-4 mr-2" />
              Under Review
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Provisional List
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <XCircle className="h-4 w-4 mr-2" />
              Objections
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Final List
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Details Dialog */}
      <Dialog open={showComplianceDialog} onOpenChange={setShowComplianceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compliance Details - {selectedPRA?.name}</DialogTitle>
            <DialogDescription>
              Detailed compliance information for this PRA application.
            </DialogDescription>
          </DialogHeader>
          {selectedPRA && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Overall Compliance Score</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedPRA.complianceScore} className="flex-1" />
                    <span className="text-sm font-medium">{selectedPRA.complianceScore}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Application Type</h4>
                  <Badge variant="outline" className="capitalize">
                    {selectedPRA.groupType} - {selectedPRA.entityType}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Compliance Checklist</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    {selectedPRA.section29ACompliant ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Section 29A Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedPRA.documentsComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Documents Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedPRA.netWorthCertificate ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Net Worth Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedPRA.kycComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">KYC Complete</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Submission Details</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Submit Date: {format(new Date(selectedPRA.submitDate), "dd MMM yyyy")}</p>
                  <p>Current Status: {getStatusBadge(selectedPRA.status)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComplianceDialog(false)}>
              Close
            </Button>
            {selectedPRA?.status === 'review' && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    handleApprovePRA(selectedPRA.id);
                    setShowComplianceDialog(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleRejectPRA(selectedPRA.id);
                    setShowComplianceDialog(false);
                  }}
                >
                  Reject
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detailed View Modals */}
      <PRADetailView
        pra={selectedPRA}
        isOpen={showPRADetailView}
        onClose={() => setShowPRADetailView(false)}
        onEdit={(pra) => {
          setSelectedPRA(pra);
          setShowPRADetailView(false);
          setShowPRAEditForm(true);
        }}
        onApprove={handleApprovePRA}
        onReject={handleRejectPRA}
      />

      <PRAEditForm
        pra={selectedPRA}
        isOpen={showPRAEditForm}
        onClose={() => setShowPRAEditForm(false)}
        onSave={handleSavePRA}
      />
    </div>
  );
};

export default PRAEvaluation;

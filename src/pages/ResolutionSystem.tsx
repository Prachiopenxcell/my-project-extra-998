import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Clock,
  Users,
  Building,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Upload,
  Download,
  RefreshCw,
  TrendingUp,
  Bell,
  Star,
  MoreHorizontal,
  Target,
  Award,
  DollarSign,
  PieChart,
  Activity,
  FileCheck,
  AlertTriangle,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import EOIManagement from "@/components/resolution/EOIManagement";
import PRAEvaluation from "@/components/resolution/PRAEvaluation";
import PlanAnalysis from "@/components/resolution/PlanAnalysis";

// Types
interface EOIInvitation {
  id: string;
  entityName: string;
  issueDate: string;
  lastSubmitDate: string;
  status: 'objection_period' | 'final_approved' | 'plans_due';
  prasApplied?: number;
  prasShortlisted?: number;
  prasApproved?: number;
}

interface PRAApplication {
  id: string;
  name: string;
  groupType: 'standalone' | 'consortium' | 'group';
  entityType: 'company' | 'partnership' | 'llp';
  submitDate: string;
  status: 'review' | 'approved' | 'query' | 'rejected';
  complianceScore: number;
}

interface ResolutionPlan {
  id: string;
  praName: string;
  version: string;
  submitDate: string;
  npvValue: number;
  recoveryPercentage: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
}

interface QuickStats {
  activeEOI: number;
  newEOI: number;
  totalPRAs: number;
  newPRAs: number;
  plansReceived: number;
  newPlansToday: number;
  finalApprovedPRAs: number;
}

const ResolutionSystem = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <ResolutionSystemModule />
      </div>
    </DashboardLayout>
  );
};

const ResolutionSystemModule = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("this_month");
  const [showCreateEOI, setShowCreateEOI] = useState(false);

  const handleCreateNewEOI = () => {
    setActiveTab("eoi-management");
    setShowCreateEOI(true);
  };

  // Mock data
  const quickStats: QuickStats = {
    activeEOI: 5,
    newEOI: 2,
    totalPRAs: 23,
    newPRAs: 5,
    plansReceived: 15,
    newPlansToday: 3,
    finalApprovedPRAs: 8
  };

  const eoiInvitations: EOIInvitation[] = [
    {
      id: "1",
      entityName: "ABC Manufacturing Ltd.",
      issueDate: "2025-01-15",
      lastSubmitDate: "2025-01-30",
      status: "objection_period",
      prasApplied: 12
    },
    {
      id: "2",
      entityName: "XYZ Industries Ltd.",
      issueDate: "2025-01-10",
      lastSubmitDate: "2025-01-25",
      status: "final_approved",
      prasApplied: 18,
      prasShortlisted: 5
    },
    {
      id: "3",
      entityName: "PQR Corp Ltd.",
      issueDate: "2025-01-05",
      lastSubmitDate: "2025-01-20",
      status: "plans_due",
      prasApplied: 15,
      prasApproved: 8
    }
  ];

  const praApplications: PRAApplication[] = [
    {
      id: "1",
      name: "TechSol",
      groupType: "standalone",
      entityType: "company",
      submitDate: "2025-01-15",
      status: "review",
      complianceScore: 85
    },
    {
      id: "2",
      name: "InfraCorp",
      groupType: "consortium",
      entityType: "partnership",
      submitDate: "2025-01-16",
      status: "approved",
      complianceScore: 92
    },
    {
      id: "3",
      name: "MetalWks",
      groupType: "standalone",
      entityType: "company",
      submitDate: "2025-01-17",
      status: "query",
      complianceScore: 78
    },
    {
      id: "4",
      name: "PowerGen",
      groupType: "group",
      entityType: "company",
      submitDate: "2025-01-18",
      status: "review",
      complianceScore: 88
    },
    {
      id: "5",
      name: "CleanTech",
      groupType: "standalone",
      entityType: "company",
      submitDate: "2025-01-19",
      status: "approved",
      complianceScore: 94
    }
  ];

  const resolutionPlans: ResolutionPlan[] = [
    {
      id: "1",
      praName: "TechSol Industries",
      version: "V1.2",
      submitDate: "2025-01-20",
      npvValue: 127.4,
      recoveryPercentage: 68,
      status: "under_review"
    },
    {
      id: "2",
      praName: "InfraCorp Solutions",
      version: "V2.0",
      submitDate: "2025-01-21",
      npvValue: 145.8,
      recoveryPercentage: 75,
      status: "approved"
    }
  ];

  const recentActivities = [
    {
      id: "1",
      type: "objection",
      message: "New EOI objection received - ABC Manufacturing Ltd.",
      time: "2 hours ago",
      icon: Bell
    },
    {
      id: "2",
      type: "plan_submitted",
      message: "Resolution plan submitted by PRA-TechSol Inc.",
      time: "4 hours ago",
      icon: CheckCircle
    },
    {
      id: "3",
      type: "list_circulated",
      message: "Provisional list circulated to CoC members",
      time: "1 day ago",
      icon: FileText
    },
    {
      id: "4",
      type: "form_published",
      message: "Form G published for XYZ Industries",
      time: "2 days ago",
      icon: FileCheck
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      objection_period: { label: "Objection Period", color: "bg-yellow-100 text-yellow-800" },
      final_approved: { label: "Final List Approved", color: "bg-green-100 text-green-800" },
      plans_due: { label: "Resolution Plans Due", color: "bg-red-100 text-red-800" },
      review: { label: "Review", color: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approved", color: "bg-green-100 text-green-800" },
      query: { label: "Query", color: "bg-red-100 text-red-800" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
      submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800" },
      under_review: { label: "Under Review", color: "bg-yellow-100 text-yellow-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getTabActions = () => {
    switch (activeTab) {
      case 'eoi-management':
        return (
          <Button onClick={handleCreateNewEOI}>
            <Plus className="h-4 w-4 mr-2" />
            Create New EOI
          </Button>
        );
      case 'pra-evaluation':
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              AI Auto-Evaluate
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        );
      case 'plan-analysis':
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              AI Analysis
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Report
            </Button>
          </div>
        );
      default:
        return (
          <Button onClick={handleCreateNewEOI}>
            <Plus className="h-4 w-4 mr-2" />
            Create New EOI
          </Button>
        );
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Resolution Dashboard',
          subtitle: 'Overview of EOI invitations, PRA evaluations, and resolution plans'
        };
      case 'eoi-management':
        return {
          title: 'EOI Management',
          subtitle: 'Manage Expression of Interest invitations and applications'
        };
      case 'pra-evaluation':
        return {
          title: 'PRA Evaluation',
          subtitle: 'Evaluate and manage Professional Resolution Applicants'
        };
      case 'plan-analysis':
        return {
          title: 'Plan Analysis',
          subtitle: 'Compare and analyze resolution plans for optimal creditor recovery'
        };
      default:
        return {
          title: 'Resolution Module',
          subtitle: 'Manage EOI invitations, PRA evaluations, and resolution plan analysis'
        };
    }
  };

  const tabInfo = getTabTitle();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tabInfo.title}</h1>
            <p className="text-muted-foreground">{tabInfo.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            {getTabActions()}
          </div>
        </div>

        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="eoi-management">EOI Management</TabsTrigger>
          <TabsTrigger value="pra-evaluation">PRA Evaluation</TabsTrigger>
          <TabsTrigger value="plan-analysis">Plan Analysis</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Cases Card */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Active Cases</p>
                    <p className="text-3xl font-bold">{quickStats.activeEOI}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    +{quickStats.newEOI} new
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pending Hearings Card */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Pending Hearings</p>
                    <p className="text-3xl font-bold">{quickStats.totalPRAs}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                    +{quickStats.newPRAs} new
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pre-filings Card */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Pre-filings</p>
                    <p className="text-3xl font-bold">{quickStats.plansReceived}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                    +{quickStats.newPlansToday} today
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Closed Card */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Closed</p>
                    <p className="text-3xl font-bold">{quickStats.finalApprovedPRAs}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      toast({
                        title: "Generating Report",
                        description: "Comprehensive resolution report is being generated..."
                      });
                    }}
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* EOI Invitations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  EOI Invitations
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setActiveTab("eoi-management");
                      toast({
                        title: "Navigating to EOI Management",
                        description: "Viewing all EOI invitations..."
                      });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleCreateNewEOI}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {eoiInvitations.map((eoi) => (
                <Card key={eoi.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Entity: {eoi.entityName}</h4>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setActiveTab("eoi-management");
                              toast({
                                title: "Viewing EOI Details",
                                description: `Opening details for ${eoi.entityName}...`
                              });
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>EOI Issue Date: {format(new Date(eoi.issueDate), "dd MMM yyyy")}</span>
                          <span>Last Submit: {format(new Date(eoi.lastSubmitDate), "dd MMM yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(eoi.status)}
                          <span className="text-sm">
                            {eoi.status === 'objection_period' && `PRAs Applied: ${eoi.prasApplied}`}
                            {eoi.status === 'final_approved' && `PRAs Shortlisted: ${eoi.prasShortlisted}`}
                            {eoi.status === 'plans_due' && `PRAs Approved: ${eoi.prasApproved}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Resolution Plan Review */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Resolution Plan Review & Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("plan-analysis");
                    toast({
                      title: "Viewing All Receipts",
                      description: "Opening plan analysis with all receipt details..."
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  View All Receipts
                </Button>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>• 15 Plans Received</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• 3 Pending Evaluation</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• 8 Under Review</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Resolution Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Upload plans on behalf of PRA</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Browse Files or Drag & Drop</p>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PRA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techsol">TechSol Industries</SelectItem>
                    <SelectItem value="infracorp">InfraCorp Solutions</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Upload Plan",
                      description: "Plan upload functionality would be implemented here...",
                      variant: "default"
                    });
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <activity.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EOI Management Tab */}
        <TabsContent value="eoi-management">
          <EOIManagement showCreateForm={showCreateEOI} setShowCreateForm={setShowCreateEOI} />
        </TabsContent>

        {/* PRA Evaluation Tab */}
        <TabsContent value="pra-evaluation">
          <PRAEvaluation 
            onAIAutoEvaluate={() => {
              toast({
                title: "AI Auto-Evaluation Started",
                description: "AI is evaluating all pending PRA applications..."
              });
              setTimeout(() => {
                toast({
                  title: "AI Evaluation Complete",
                  description: "3 PRAs recommended for approval, 1 flagged for review."
                });
              }, 2000);
            }}
            onGenerateReport={() => {
              toast({
                title: "Generating Report",
                description: "PRA evaluation report is being generated..."
              });
            }}
          />
        </TabsContent>

        {/* Plan Analysis Tab */}
        <TabsContent value="plan-analysis">
          <PlanAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResolutionSystem;

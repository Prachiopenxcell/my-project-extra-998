import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TeamMemberDetailsDialog } from "./TeamMemberDetailsDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Briefcase, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  Filter,
  Bell,
  Settings,
  User,
  CreditCard,
  BarChart3,
  Target,
  Users,
  DollarSign,
  FileText,
  Building,
  Star,
  Share2,
  HelpCircle,
  ExternalLink,
  Archive,
  UserMinus,
  MoreHorizontal,
  Globe,
  Layers,
  PlayCircle,
  MessageSquare,
  BookOpen,
  HandHeart,
  ArrowRight,
  Download,
  Calendar as CalendarIcon,
  MapPin,
  ChevronRight
} from "lucide-react";
 
import { DashboardData, WorkOrder, Opportunity, OrganizationPerformance, TeamStats, FinancialMetrics, EntityManagement } from "@/types/dashboard";

interface TeamMember {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  status: string;
  lastLogin: string;
  joinDate?: string;
  department?: string;
  assignedModules?: string[];
  assignedEntities?: string[];
}

interface SearchResult {
  id: string;
  title: string;
  module: string;
  type: string;
}
import { dashboardService } from "@/services/dashboardService";
import { UserRole } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface ServiceProviderDashboardProps {
  userRole: UserRole;
}

export const ServiceProviderDashboard = ({ userRole }: ServiceProviderDashboardProps) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("modules");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [isTeamMemberDialogOpen, setIsTeamMemberDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleExportFinancialData = () => {
    // Basic CSV export for financial summary
    const rows = [
      ["Category","Amount"],
      ["Service Contracts","245000"],
      ["Consulting","120000"],
      ["Training & Workshops","85000"],
      ["Other Revenue","35000"],
      ["Total Revenue","485000"],
      ["Personnel","210000"],
      ["Operations","75000"],
      ["Marketing","45000"],
      ["Other Expenses","20000"],
      ["Total Expenses","350000"]
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "financial-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export started", description: "Downloading financial-summary.csv" });
  };

  const moduleRouteMap: Record<string, string> = {
    Claims: "/claims",
    Meetings: "/meetings",
    "Work Orders": "/work-orders",
    Billing: "/billing",
    Resources: "/resources",
  };

  // Mock data for Service Provider dashboards
  const mockData: DashboardData = {
    registrationNumber: "TRN-123456",
    profileCompletion: 5,
    alerts: [
      { id: 1, message: "Bid deadline approaching for SRN-2024-001", type: "urgent", deadline: "2024-08-10" },
      { id: 2, message: "New opportunity available in your area", type: "info", deadline: "2024-08-15" },
      { id: 3, message: "Profile verification pending", type: "warning", deadline: "2024-08-12" }
    ],
    opportunities: { total: 24, open: 8, closed: 16 },
    workOrders: { total: 15, inProgress: 5, completed: 10 },
    subscriptions: [
      { name: "Entity Management", endDate: "2024-12-31", status: "active" },
      { name: "Meeting Management", endDate: "2024-11-30", status: "active" },
      { name: "E-Voting System", endDate: "2024-10-15", status: "expiring-soon" },
      { name: "Claims Management", endDate: "2024-12-31", status: "active" },
      { name: "Resolution System", endDate: "2025-01-15", status: "active" },
      { name: "Litigation Support", endDate: "2024-09-30", status: "active" },
      { name: "Virtual Data Room", endDate: "2024-10-15", status: "expiring-soon" },
      { name: "AR & Facilitators", endDate: "2024-11-30", status: "active" },
      { name: "Timeline Management", endDate: "2024-12-31", status: "active" },
      { name: "Regulatory Compliance", endDate: "2025-02-28", status: "active" },
      { name: "System Administration", endDate: "2025-01-31", status: "active" }
    ],
    recentModules: [
      { name: "Claims Management", lastVisited: "2024-08-07", status: "active" },
      { name: "Meeting Management", lastVisited: "2024-08-06", status: "active" },
      { name: "Timeline Management", lastVisited: "2024-08-05", status: "active" },
      { name: "Entity Management", lastVisited: "2024-08-04", status: "active" },
      { name: "Regulatory Compliance", lastVisited: "2024-08-03", status: "active" },
      { name: "Virtual Data Room", lastVisited: "2024-08-02", status: "active" }
    ],
    recentEntities: [
      { name: "ABC Corporation", moduleActivated: "Claims Management", status: "active" },
      { name: "XYZ Ltd", moduleActivated: "Meeting Management", status: "active" },
      { name: "Tech Solutions Inc", moduleActivated: "Timeline Management", status: "active" },
      { name: "Global Enterprises", moduleActivated: "Regulatory Compliance", status: "active" },
      { name: "Innovation Partners", moduleActivated: "Virtual Data Room", status: "active" },
      { name: "Strategic Advisors", moduleActivated: "Resolution System", status: "active" }
    ],
    recentOpportunities: [
      { srn: "SRN-2024-001", raisedOn: "2024-08-05", bidClosureDate: "2024-08-10", status: "open", title: "Legal Consultation Services", location: "Mumbai" },
      { srn: "SRN-2024-002", raisedOn: "2024-08-04", bidClosureDate: "2024-08-09", status: "open", title: "Corporate Compliance Audit", location: "Delhi" },
      { srn: "SRN-2024-003", raisedOn: "2024-08-03", bidClosureDate: "2024-08-08", status: "bidding", title: "Contract Review Services", location: "Bangalore" },
      { srn: "SRN-2024-004", raisedOn: "2024-08-02", bidClosureDate: "2024-08-07", status: "closed", title: "Regulatory Filing Support", location: "Chennai" }
    ],
    inProgressWorkOrders: [
      { workOrderNo: "WO-2024-001", startDate: "2024-08-01", lastDate: "2024-08-15", status: "in-progress", teamMembers: ["John Doe", "Jane Smith"], title: "Corporate Legal Advisory", client: "ABC Corp", progress: 65 },
      { workOrderNo: "WO-2024-002", startDate: "2024-08-03", lastDate: "2024-08-20", status: "in-progress", teamMembers: ["Mike Johnson"], title: "Compliance Documentation", client: "XYZ Ltd", progress: 40 },
      { workOrderNo: "WO-2024-003", startDate: "2024-08-05", lastDate: "2024-08-25", status: "in-progress", teamMembers: ["Sarah Wilson"], title: "Contract Negotiation", client: "Tech Solutions", progress: 20 }
    ],
    resourceSharingRequests: [
      { from: "Advocate Sharma", type: "Equipment", requestDate: "2024-08-06", status: "pending", description: "Legal Research Database Access", urgency: "high" },
      { from: "CA Patel", type: "Expertise", requestDate: "2024-08-05", status: "pending", description: "Tax Advisory Consultation", urgency: "medium" },
      { from: "CS Kumar", type: "Documentation", requestDate: "2024-08-04", status: "approved", description: "Company Secretary Templates", urgency: "low" },
      { from: "Legal Associates", type: "Team Support", requestDate: "2024-08-03", status: "pending", description: "Junior Associate for Research", urgency: "medium" }
    ],
    teamMembers: [
      { name: "John Doe", lastLogin: "2024-08-07 10:30", status: "active" },
      { name: "Jane Smith", lastLogin: "2024-08-06 15:45", status: "active" },
      { name: "Mike Johnson", lastLogin: "2024-08-05 09:20", status: "inactive" }
    ],
    assignedEntities: [
      { name: "ABC Corporation", moduleActivated: "Claims Management" },
      { name: "XYZ Ltd", moduleActivated: "Meeting Management" },
      { name: "Tech Solutions Inc", moduleActivated: "Timeline Management" },
      { name: "Global Enterprises", moduleActivated: "Regulatory Compliance" },
      { name: "Innovation Partners", moduleActivated: "Virtual Data Room" },
      { name: "Strategic Advisors", moduleActivated: "Resolution System" },
      { name: "Enterprise Holdings", moduleActivated: "Entity Management" },
      { name: "Legal Associates", moduleActivated: "Litigation Support" }
    ],
    // Organization performance metrics for Entity Admin dashboard
    organizationPerformance: {
      revenue: {
        current: 125000,
        previous: 110000,
        trend: 13.6,
        currency: "INR",
        period: "This Month"
      },
      workOrderCompletion: {
        onTime: 85,
        delayed: 12,
        total: 97,
        trend: 5.2
      },
      teamUtilization: {
        utilized: 78,
        available: 22,
        trend: 3.5
      },
      clientSatisfaction: {
        current: 4.7,
        previous: 4.5,
        trend: 4.4,
        total: 5
      },
      bidSuccessRate: {
        won: 65,
        lost: 35,
        trend: 8.2
      }
    },
    // Team management statistics
    teamStats: {
      totalMembers: 12,
      activeMembers: 10,
      inactiveMembers: 2,
      capacityUtilization: 78,
      averageRating: 4.6,
      composition: {
        managers: 3,
        specialists: 5,
        associates: 4
      },
      performance: {
        workOrderCompletion: 85,
        clientSatisfaction: 92,
        responseTime: 89,
        improvement: 5.2
      },
      allocation: [
        { project: "Corporate Legal Advisory", percentage: 35 },
        { project: "Compliance Documentation", percentage: 25 },
        { project: "Contract Negotiation", percentage: 20 },
        { project: "Regulatory Filing Support", percentage: 20 }
      ],
      byDepartment: [
        { name: "Legal Advisory", count: 5, utilization: 82 },
        { name: "Compliance", count: 3, utilization: 75 },
        { name: "Documentation", count: 2, utilization: 80 },
        { name: "Administration", count: 2, utilization: 65 }
      ],
      recentHires: 2,
      pendingTrainings: 3
    },
    // Financial metrics
    financialMetrics: {
      monthlyRevenue: [
        { month: "Jan", amount: 95000 },
        { month: "Feb", amount: 102000 },
        { month: "Mar", amount: 98500 },
        { month: "Apr", amount: 105000 },
        { month: "May", amount: 110000 },
        { month: "Jun", amount: 125000 }
      ],
      outstandingInvoices: 3,
      totalOutstanding: 175000,
      averageProjectValue: 85000,
      profitMargin: 32
    },
    // Entity management overview
    entityManagement: {
      totalEntities: 8,
      activeEntities: 7,
      inactiveEntities: 1,
      entitiesByType: [
        { type: "Corporation", count: 3 },
        { type: "Limited", count: 2 },
        { type: "Partnership", count: 2 },
        { type: "Proprietorship", count: 1 }
      ],
      moduleDistribution: [
        { module: "Claims Management", count: 5 },
        { module: "Meeting Management", count: 6 },
        { module: "Timeline Management", count: 4 },
        { module: "Entity Management", count: 8 },
        { module: "Regulatory Compliance", count: 7 }
      ],
      recentActivity: [
        { entity: "ABC Corporation", action: "Module Activated", date: "2024-08-05", module: "Claims Management" },
        { entity: "XYZ Ltd", action: "Team Member Added", date: "2024-08-04", module: "Meeting Management" },
        { entity: "Tech Solutions Inc", action: "Subscription Renewed", date: "2024-08-03", module: "Timeline Management" }
      ]
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await dashboardService.getDashboardData(userRole);
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userRole, toast]);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'destructive';
      case 'warning': return 'default';
      default: return 'default';
    }
  };

  // Handle global search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Mock search results across all modules
      const mockResults = [
        { id: "1", title: "Legal Advisory Work Order", module: "Work Orders", type: "work_order" },
        { id: "2", title: "Corporate Meeting - Board Resolution", module: "Meetings", type: "meeting" },
        { id: "3", title: "Compliance Claim - Tax Filing", module: "Claims", type: "claim" },
        { id: "4", title: "ABC Corporation Entity", module: "Entity Management", type: "entity" },
        { id: "5", title: "Service Request - Legal Consultation", module: "Service Requests", type: "service_request" }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.module.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'open': return 'default';
      case 'bidding': return 'secondary';
      case 'closed': return 'outline';
      case 'in-progress': return 'default';
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      default: return 'outline';
    }
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
        return renderIndividualDashboard();
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        return renderEntityAdminDashboard();
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        return renderTeamMemberDashboard();
      default:
        return renderIndividualDashboard();
    }
  };

  // Individual dashboard content without title (for reuse)
  const renderIndividualDashboardContent = () => (
    <>
      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts and Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.alerts.map((alert) => (
              <Alert key={alert.id} variant={getAlertColor(alert.type)}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {alert.message}
                  <span className="ml-2 text-xs">Deadline: {alert.deadline}</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bids and Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.opportunities.open}</div>
            <p className="text-sm text-muted-foreground">Open Opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Open Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.workOrders.inProgress}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Closed Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.workOrders.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderIndividualDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
          <p className="text-muted-foreground">Individual/Partner</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Temporary Registration Number</p>
          <p className="text-lg font-semibold text-primary">{mockData.registrationNumber}</p>
        </div>
      </div>

      {/* Profile Completion Widget */}
      {mockData.profileCompletion < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <User className="h-5 w-5" />
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-orange-700">
              Complete your profile to get your permanent registration number and access all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-800">Profile Completion</span>
                <span className="text-sm font-bold text-orange-800">{mockData.profileCompletion}%</span>
              </div>
              <Progress value={mockData.profileCompletion} className="h-2" />
              <div className="flex gap-2">
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Link to="/profile">Complete Profile</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  <Link to="/settings">Settings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {renderIndividualDashboardContent()}

      {/* Workspace Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Workspace
          </CardTitle>
          <CardDescription>
            Recently visited modules and entities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeWorkspaceTab} onValueChange={setActiveWorkspaceTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="entity">Entity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules" className="mt-4">
              <div className="space-y-3">
                {mockData.recentModules.slice(0, 4).map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{module.name}</h4>
                      <p className="text-sm text-muted-foreground">Last visited: {module.lastVisited}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/workspace`} className="flex items-center gap-1">
                          <PlayCircle className="h-4 w-4" />
                          Open
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/workspace" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View All Modules
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="entity" className="mt-4">
              <div className="space-y-3">
                {mockData.recentEntities.slice(0, 4).map((entity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{entity.name}</h4>
                      <p className="text-sm text-muted-foreground">Module: {entity.moduleActivated}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/entity/1`} className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/entity-management" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View All Entities
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* New/Recent Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            New/Recent Opportunities
          </CardTitle>
          <CardDescription>
            Latest opportunities available for bidding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.recentOpportunities.slice(0, 3).map((opportunity, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{opportunity.srn}</h4>
                      <Badge variant={getStatusBadgeVariant(opportunity.status)}>
                        {opportunity.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{opportunity.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Raised: {opportunity.raisedOn}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Bid Closure: {opportunity.bidClosureDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {opportunity.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/service-requests/${opportunity.srn}`} className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        View Opportunity
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/bids/${opportunity.srn}`} className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        View Bid
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/service-requests" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View All Opportunities
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders (In Progress) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Orders (In Progress)
          </CardTitle>
          <CardDescription>
            Currently active work orders requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.inProgressWorkOrders.map((workOrder, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{workOrder.workOrderNo}</h4>
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        {workOrder.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-2">{workOrder.title}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Start: {workOrder.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Due: {workOrder.lastDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Client: {workOrder.client}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Progress:</span>
                      <Progress value={workOrder.progress} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{workOrder.progress}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Team: {workOrder.teamMembers.join(", ")}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/work-orders/${workOrder.workOrderNo}`} className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/work-orders" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View All Work Orders
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guidance and Reference */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BookOpen className="h-5 w-5" />
            Guidance and Reference (Ask & Refer)
          </CardTitle>
          <CardDescription className="text-blue-700">
            Access professional guidance, reference materials, and expert consultation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Get Expert Assistance</p>
                <p className="text-sm text-blue-700">Access legal resources, templates, and expert consultation</p>
              </div>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/guidance-reference" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Access Guidance
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Pooling/Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandHeart className="h-5 w-5" />
            Resource Pooling/Sharing
          </CardTitle>
          <CardDescription>
            Recent requests for resource sharing from other professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockData.resourceSharingRequests.map((request, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{request.from}</h4>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        {request.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {request.requestDate}
                      </span>
                      <span className={`flex items-center gap-1 font-medium ${getUrgencyColor(request.urgency)}`}>
                        <AlertCircle className="h-4 w-4" />
                        {request.urgency}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                <Link to={`/resource-sharing`}>
                  <Button variant="outline" size="sm" className="flex-1">
                    
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                    
                  </Button>
                  </Link>
                  {request.status === 'pending' && (
                    <Link to={`/resource-sharing`}>
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/resource-sharing" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View All Requests
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Team Members
          </CardTitle>
          <CardDescription>
            Manage your team members and their access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{member.name}</h4>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'} 
                           className={member.status === 'active' ? 'bg-green-100 text-green-800' : ''}>
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Last login: {member.lastLogin}</p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    title="View Details"
                    onClick={() => {
                      // Add more detailed member data for the dialog
                      const enhancedMember = {
                        ...member,
                        email: `${member.name.toLowerCase().replace(' ', '.')}@example.com`,
                        phone: "+91 98765 43210",
                        role: "Team Member",
                        joinDate: "2024-01-15",
                        department: "Legal Advisory",
                        assignedModules: ["Claims Management", "Meeting Management", "Timeline Management"],
                        assignedEntities: ["ABC Corporation", "XYZ Ltd", "Tech Solutions Inc"]
                      };
                      setSelectedTeamMember(enhancedMember);
                      setIsTeamMemberDialogOpen(true);
                      toast({
                        title: "Team Member Details",
                        description: `Viewing details for ${member.name}`,
                      });
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    title="Archive"
                    onClick={() =>
                      toast({ title: "Archived", description: `${member.name} archived` })
                    }
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    title="Deactivate"
                    onClick={() =>
                      toast({ title: "Deactivated", description: `${member.name} deactivated` })
                    }
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-center pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/team-management" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Team Management
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Global Search
          </CardTitle>
          <CardDescription>
            Search across all modules and entities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all modules, entities, work orders..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {showSearchResults && searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <p className="text-sm font-medium text-muted-foreground">Search Results ({searchResults.length})</p>
                {searchResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{result.title}</h4>
                      <p className="text-sm text-muted-foreground">Module: {result.module}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Open ${result.module}`}
                      onClick={() => navigate(moduleRouteMap[result.module] ?? "/")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.subscriptions.slice(0, 3).map((subscription, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{subscription.name}</h4>
                  <p className="text-sm text-muted-foreground">Ends: {subscription.endDate}</p>
                </div>
                <Badge 
                  variant={subscription.status === 'active' ? 'default' : subscription.status === 'expiring-soon' ? 'destructive' : 'secondary'}
                  className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {subscription.status === 'active' ? 'Active' : 
                   subscription.status === 'expiring-soon' ? 'Expiring Soon' : subscription.status}
                </Badge>
              </div>
            ))}
            <div className="flex items-center justify-center pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/subscription" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Subscription Packages
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEntityAdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
          <p className="text-muted-foreground">Entity/Organization Admin</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Registration Number</p>
          <p className="text-lg font-semibold text-primary">{mockData.registrationNumber}</p>
        </div>
      </div>

      {/* Profile Completion Widget */}
      {mockData.profileCompletion < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <User className="h-5 w-5" />
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-orange-700">
              Complete your organization profile to get your permanent registration number and access all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-800">Profile Completion</span>
                <span className="text-sm font-bold text-orange-800">{mockData.profileCompletion}%</span>
              </div>
              <Progress value={mockData.profileCompletion} className="h-2" />
              <div className="flex gap-2">
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Link to="/profile">Complete Profile</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  <Link to="/settings">Settings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organization Performance Metrics */}
      {mockData.organizationPerformance && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-4">Organization Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Revenue Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">
                    {mockData.organizationPerformance.revenue.currency} {mockData.organizationPerformance.revenue.current.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={mockData.organizationPerformance.revenue.trend > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      <span className="flex items-center">
                        {mockData.organizationPerformance.revenue.trend > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(mockData.organizationPerformance.revenue.trend)}%
                      </span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">{mockData.organizationPerformance.revenue.period}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Order Completion Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Work Order Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">
                    {mockData.organizationPerformance.workOrderCompletion.onTime} / {mockData.organizationPerformance.workOrderCompletion.total}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-green-100 text-green-800">
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {mockData.organizationPerformance.workOrderCompletion.trend}%
                      </span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">On-time completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Utilization Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Team Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">
                    {mockData.organizationPerformance.teamUtilization.utilized}%
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={mockData.organizationPerformance.teamUtilization.utilized} className="h-2 w-24" />
                    <Badge className="bg-blue-100 text-blue-800">
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {mockData.organizationPerformance.teamUtilization.trend}%
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Satisfaction Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Client Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold flex items-center">
                    {mockData.organizationPerformance.clientSatisfaction.current}
                    <span className="text-sm text-muted-foreground ml-1">/ {mockData.organizationPerformance.clientSatisfaction.total}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(mockData.organizationPerformance.clientSatisfaction.current) 
                            ? "text-yellow-500 fill-yellow-500" 
                            : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {mockData.organizationPerformance.clientSatisfaction.trend}%
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bid Success Rate Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Bid Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">
                    {mockData.organizationPerformance.bidSuccessRate.won}%
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={mockData.organizationPerformance.bidSuccessRate.won} className="h-2 w-24" />
                    <Badge className="bg-green-100 text-green-800">
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {mockData.organizationPerformance.bidSuccessRate.trend}%
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Notification Center */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Notification Center</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Priority Alerts & Notifications
            </CardTitle>
            <CardDescription>
              Important alerts and notifications for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Priority Filters */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                  All
                </Button>
                <Button variant="outline" className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  High Priority
                </Button>
                <Button variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                  Medium Priority
                </Button>
                <Button variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  Low Priority
                </Button>
              </div>
              
              {/* Notifications List */}
              <div className="space-y-3">
                {/* High Priority Notification */}
                <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High Priority</Badge>
                        <span className="text-xs text-muted-foreground">Today, 10:45 AM</span>
                      </div>
                      <h4 className="font-medium mt-2">Subscription Expiring Soon</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your Claims Management module subscription will expire in 3 days. Renew now to avoid service interruption.
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-100">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      Renew Now
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100">
                      Remind Later
                    </Button>
                  </div>
                </div>
                
                {/* Medium Priority Notification */}
                <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Medium Priority</Badge>
                        <span className="text-xs text-muted-foreground">Yesterday, 3:20 PM</span>
                      </div>
                      <h4 className="font-medium mt-2">Team Member Request</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        John Smith has requested access to the Billing module. Review and approve this request.
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-800 hover:bg-amber-100">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                      Review Request
                    </Button>
                    <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-100">
                      Dismiss
                    </Button>
                  </div>
                </div>
                
                {/* Low Priority Notification */}
                <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low Priority</Badge>
                        <span className="text-xs text-muted-foreground">Aug 16, 9:15 AM</span>
                      </div>
                      <h4 className="font-medium mt-2">Platform Update Available</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        A new version of the platform is available with improved features and bug fixes.
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800 hover:bg-green-100">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-100">
                      Dismiss
                    </Button>
                  </div>
                </div>
                
                {/* System Notification */}
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">System</Badge>
                        <span className="text-xs text-muted-foreground">Aug 15, 2:30 PM</span>
                      </div>
                      <h4 className="font-medium mt-2">Scheduled Maintenance</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The system will undergo scheduled maintenance on August 20th from 2:00 AM to 4:00 AM UTC.
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notification Settings
                </Button>
                <Button asChild variant="link" size="sm" className="flex items-center gap-1">
                  <Link to="/notifications">
                    View All Notifications
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Allocation Visualization */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Resource Allocation</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Resource Allocation & Utilization
            </CardTitle>
            <CardDescription>
              Visual overview of resource distribution across departments, projects, and team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleExportFinancialData}>
                Export CSV
              </Button>
            </div>
            <div className="space-y-6">
              {/* Department Allocation */}
              <div>
                <h3 className="text-sm font-medium mb-3">Department Resource Allocation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Engineering</span>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2 bg-blue-100" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Sales</span>
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2 bg-green-100" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm">Marketing</span>
                      </div>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2 bg-amber-100" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Customer Support</span>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2 bg-purple-100" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Administration</span>
                      </div>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <Progress value={5} className="h-2 bg-red-100" />
                    
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span className="text-sm">Resource allocation by department</span>
                      <span className="text-sm">100%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Project Allocation */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Project Resource Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Project Alpha</h4>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">High Priority</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Team Members</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hours Allocated</span>
                          <span className="font-medium">240 hrs/week</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Utilization</span>
                          <span className="font-medium text-blue-700">85%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Project Beta</h4>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Medium Priority</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Team Members</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hours Allocated</span>
                          <span className="font-medium">160 hrs/week</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Utilization</span>
                          <span className="font-medium text-green-700">72%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Project Gamma</h4>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Low Priority</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Team Members</span>
                          <span className="font-medium">5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hours Allocated</span>
                          <span className="font-medium">80 hrs/week</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Utilization</span>
                          <span className="font-medium text-amber-700">65%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Team Member Allocation */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Top Team Member Utilization</h3>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    View All Team Members
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Sarah Johnson</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <Progress value={95} className="h-2 bg-blue-100" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Michael Chen</span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <Progress value={88} className="h-2 bg-blue-100" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">David Rodriguez</span>
                        <span className="text-sm font-medium">82%</span>
                      </div>
                      <Progress value={82} className="h-2 bg-blue-100" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Emily Wilson</span>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2 bg-blue-100" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Resource Allocation Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Link to="/resource-sharing">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Allocate Resources
                </Button>
                </Link>
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Detailed Reports
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Resource Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Financial Metrics */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Financial Overview</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Organization Financial Metrics
            </CardTitle>
            <CardDescription>
              Track revenue, expenses, and financial performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Revenue & Expense Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Revenue Breakdown</h3>
                    <Select defaultValue="quarterly">
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full space-y-2">
                    {/* Revenue Items */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service Contracts</span>
                        <span className="font-medium tabular-nums">$245,000</span>
                      </div>
                      <Progress value={65} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Consulting</span>
                        <span className="font-medium tabular-nums">$120,000</span>
                      </div>
                      <Progress value={32} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Training & Workshops</span>
                        <span className="font-medium tabular-nums">$85,000</span>
                      </div>
                      <Progress value={23} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Other Revenue</span>
                        <span className="font-medium tabular-nums">$35,000</span>
                      </div>
                      <Progress value={10} className="h-1.5" />
                    </div>
                    <div className="flex justify-between pt-3 font-semibold border-t">
                      <span>Total Revenue</span>
                      <span className="tabular-nums">$485,000</span>
                    </div>
                  </div>
                </div>

                {/* Expense List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Expense Categories</h3>
                    <Select defaultValue="quarterly">
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full space-y-2">
                    {/* Expense Items */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Personnel</span>
                        <span className="font-medium tabular-nums">$210,000</span>
                      </div>
                      <Progress value={70} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Operations</span>
                        <span className="font-medium tabular-nums">$75,000</span>
                      </div>
                      <Progress value={25} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Marketing</span>
                        <span className="font-medium tabular-nums">$45,000</span>
                      </div>
                      <Progress value={15} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Other Expenses</span>
                        <span className="font-medium tabular-nums">$20,000</span>
                      </div>
                      <Progress value={7} className="h-1.5" />
                    </div>
                    <div className="flex justify-between pt-3 font-semibold border-t">
                      <span>Total Expenses</span>
                      <span className="tabular-nums">$350,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial KPIs */}
              <div>
                <h3 className="font-medium mb-3">Key Financial Indicators</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">Net Profit Margin</p>
                          <p className="text-2xl font-bold text-green-600">28%</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          +3.2%
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">vs previous quarter</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">Operational Efficiency</p>
                          <p className="text-2xl font-bold">72%</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          +1.5%
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">vs previous quarter</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">Cash Flow</p>
                          <p className="text-2xl font-bold">$135,000</p>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          -2.1%
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">vs previous quarter</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">Accounts Receivable</p>
                          <p className="text-2xl font-bold">$92,500</p>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          +5.7%
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">vs previous quarter</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Financial Actions */}
              <div className="flex flex-wrap gap-3 justify-end">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Reports
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Financial Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Search Section */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Advanced Search</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
            <CardDescription>
              Find entities, modules, and resources across your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search by name, ID, or keyword..." 
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                  <Button>
                    Search
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Entity Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Types</option>
                    <option value="client">Client</option>
                    <option value="partner">Partner</option>
                    <option value="vendor">Vendor</option>
                    <option value="internal">Internal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Module</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Modules</option>
                    <option value="claims">Claims</option>
                    <option value="meetings">Meetings</option>
                    <option value="workOrders">Work Orders</option>
                    <option value="billing">Billing</option>
                    <option value="resources">Resources</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Status</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  Active Only
                  <button className="ml-1 hover:bg-gray-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  Module: Claims
                  <button className="ml-1 hover:bg-gray-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  Last 30 Days
                  <button className="ml-1 hover:bg-gray-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </Badge>
              </div>
              
              <div className="pt-2 border-t">
                <h3 className="text-sm font-medium mb-3">Recent Searches</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Active clients with pending claims</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Team members assigned to work orders</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entity Management Overview */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Entity Management</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Entity Overview & Management
            </CardTitle>
            <CardDescription>
              Manage your organization's entities, subsidiaries, and partnerships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Entity Stats Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total Entities</p>
                  <p className="text-2xl font-bold text-blue-700">12</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Active Entities</p>
                  <p className="text-2xl font-bold text-green-700">9</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-amber-700">2</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Partnerships</p>
                  <p className="text-2xl font-bold text-purple-700">5</p>
                </div>
              </div>

              {/* Entity Quick Actions */}
              <div>
                <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 text-center">
                    <Plus className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Add New Entity</p>
                      <p className="text-xs text-muted-foreground">Create a new subsidiary or branch</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 text-center">
                    <HandHeart className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Manage Partnerships</p>
                      <p className="text-xs text-muted-foreground">Review and update partnership agreements</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2 text-center">
                    <Globe className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Entity Compliance</p>
                      <p className="text-xs text-muted-foreground">Check regulatory compliance status</p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Recent Entity Activity */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Recent Entity Activity</h3>
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Building className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium">West Coast Division</p>
                        <p className="text-xs text-muted-foreground">Updated compliance documents</p>
                      </div>
                    </div>
                    <Badge>Today</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <HandHeart className="h-4 w-4 text-green-700" />
                      </div>
                      <div>
                        <p className="font-medium">Northern Partnership</p>
                        <p className="text-xs text-muted-foreground">New agreement signed</p>
                      </div>
                    </div>
                    <Badge>Yesterday</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium">Eastern Subsidiary</p>
                        <p className="text-xs text-muted-foreground">Compliance review required</p>
                      </div>
                    </div>
                    <Badge>3 days ago</Badge>
                  </div>
                </div>
              </div>

              {/* Entity Management Actions */}
              <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Entity Reports
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Entity Settings
                </Button>
                <Link to="/entity-management">
                  <Button className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Entity Management Portal
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Management Statistics */}
      {mockData.teamStats && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-4">Team Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Team Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Overview
                </CardTitle>
                <CardDescription>
                  Current team composition and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-2xl font-bold text-blue-700">{mockData.teamStats.totalMembers}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Active Members</p>
                      <p className="text-2xl font-bold text-green-700">{mockData.teamStats.activeMembers}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Team Capacity</span>
                      <span className="text-sm font-medium">{mockData.teamStats.capacityUtilization}%</span>
                    </div>
                    <Progress value={mockData.teamStats.capacityUtilization} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Team Composition</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Managers ({mockData.teamStats.composition.managers})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Specialists ({mockData.teamStats.composition.specialists})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm">Associates ({mockData.teamStats.composition.associates})</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Team Performance
                </CardTitle>
                <CardDescription>
                  Key performance indicators for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Work Order Completion</span>
                      <span className="text-sm font-medium">{mockData.teamStats.performance.workOrderCompletion}%</span>
                    </div>
                    <Progress value={mockData.teamStats.performance.workOrderCompletion} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Client Satisfaction</span>
                      <span className="text-sm font-medium">{mockData.teamStats.performance.clientSatisfaction}%</span>
                    </div>
                    <Progress value={mockData.teamStats.performance.clientSatisfaction} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm font-medium">{mockData.teamStats.performance.responseTime}%</span>
                    </div>
                    <Progress value={mockData.teamStats.performance.responseTime} className="h-2" />
                  </div>
                  
                  <div className="pt-2">
                    <Badge className="bg-green-100 text-green-800">
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {mockData.teamStats.performance.improvement}% improvement this month
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Allocation Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Resource Allocation
                </CardTitle>
                <CardDescription>
                  Current team allocation across projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(mockData.teamStats.allocation ?? []).map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.project}</span>
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/resource-management" className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Manage Resource Allocation
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* All Individual Dashboard content without duplicate title */}
      {renderIndividualDashboardContent()}

      {/* Additional Entity Admin Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">Last login: {member.lastLogin}</p>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Add more detailed member data for the dialog
                      const enhancedMember = {
                        ...member,
                        email: `${member.name.toLowerCase().replace(' ', '.')}@example.com`,
                        phone: "+91 98765 43210",
                        role: "Team Member",
                        joinDate: "2024-01-15",
                        department: "Legal Advisory",
                        assignedModules: ["Claims Management", "Meeting Management", "Timeline Management"],
                        assignedEntities: ["ABC Corporation", "XYZ Ltd", "Tech Solutions Inc"]
                      };
                      setSelectedTeamMember(enhancedMember);
                      setIsTeamMemberDialogOpen(true);
                      toast({
                        title: "Team Member Details",
                        description: `Viewing details for ${member.name}`,
                      });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserMinus className="h-4 w-4 mr-1" />
                    Deactivate
                  </Button>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/settings?tab=team" className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                View Team Management
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.subscriptions.slice(0, 4).map((subscription, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{subscription.name}</h4>
                  <p className="text-sm text-muted-foreground">Ends: {subscription.endDate}</p>
                </div>
                <Badge 
                  variant={subscription.status === 'active' ? 'default' : subscription.status === 'expiring-soon' ? 'destructive' : 'secondary'}
                  className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {subscription.status === 'active' ? 'Active' : 
                   subscription.status === 'expiring-soon' ? 'Expiring Soon' : subscription.status}
                </Badge>
              </div>
            ))}
            <div className="flex items-center justify-center pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/subscription" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Subscription Packages
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamMemberDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
          <p className="text-muted-foreground">Team Member</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Registration Number</p>
          <p className="text-lg font-semibold text-primary">{mockData.registrationNumber}</p>
        </div>
      </div>

      {/* Profile Completion Widget */}
      {mockData.profileCompletion < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <User className="h-5 w-5" />
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-orange-700">
              Complete your profile to get your permanent registration number and access all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-800">Profile Completion</span>
                <span className="text-sm font-bold text-orange-800">{mockData.profileCompletion}%</span>
              </div>
              <Progress value={mockData.profileCompletion} className="h-2" />
              <div className="flex gap-2">
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Link to="/profile">Complete Profile</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  <Link to="/settings">Settings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Assigned Entities
          </CardTitle>
          <CardDescription>
            Select an entity to access subscribed modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.assignedEntities.map((entity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{entity.name}</p>
                  <p className="text-sm text-muted-foreground">Module: {entity.moduleActivated}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Add more detailed entity data for the dialog
                    const enhancedMember = {
                      name: entity.name,
                      email: `info@${entity.name.toLowerCase().replace(/\s+/g, '')}.com`,
                      phone: "+91 98765 43210",
                      role: "Entity Admin",
                      status: "active",
                      lastLogin: "2024-08-07 10:30",
                      joinDate: "2024-01-15",
                      department: "Administration",
                      assignedModules: [entity.moduleActivated],
                      assignedEntities: [entity.name]
                    };
                    setSelectedTeamMember(enhancedMember);
                    setIsTeamMemberDialogOpen(true);
                    toast({
                      title: "Entity Details",
                      description: `Viewing details for ${entity.name}`,
                    });
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Modules Card - Note: Team members don't manage subscriptions directly */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Available Modules
          </CardTitle>
          <CardDescription>
            Modules available through your organization's subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.subscriptions.slice(0, 3).map((subscription, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{subscription.name}</h4>
                  <p className="text-sm text-muted-foreground">Access via assigned entities</p>
                </div>
                <Badge 
                  variant={subscription.status === 'active' ? 'default' : 'secondary'}
                  className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {subscription.status === 'active' ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            ))}
            <div className="flex items-center justify-center pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/subscription" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Organization Subscriptions
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {renderRoleSpecificContent()}
      <TeamMemberDetailsDialog
        isOpen={isTeamMemberDialogOpen}
        onClose={() => setIsTeamMemberDialogOpen(false)}
        member={selectedTeamMember}
      />
    </div>
  );
};

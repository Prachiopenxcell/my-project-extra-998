import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Scale, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  FileText, 
  DollarSign, 
  Building, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MoreHorizontal,
  CalendarClock,
  Users,
  Gavel,
  Copy
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Types for litigation data
interface LitigationCase {
  id: string;
  caseNumber: string;
  title: string;
  type: 'pre-filing' | 'active' | 'closed';
  status: 'draft' | 'pending' | 'critical' | 'won' | 'lost' | 'awaiting-docs' | 'upcoming';
  court: string;
  lawyer: string;
  amount: number;
  filedDate?: string;
  nextHearing?: string;
  lastHearing?: string;
  plaintiff: string;
  defendant: string;
  daysLeft?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdDate: string;
  participants?: number;
}

interface LitigationStats {
  activeCases: number;
  pendingHearings: number;
  preFilings: number;
  closedCases: number;
}

const LitigationManagement = () => {
  return (
    <DashboardLayout userType="service_provider">
      <LitigationModule />
    </DashboardLayout>
  );
};

const LitigationModule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State management
  const [selectedEntity, setSelectedEntity] = useState("Acme Corporation Ltd");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [stats, setStats] = useState<LitigationStats>({
    activeCases: 5,
    pendingHearings: 2,
    preFilings: 3,
    closedCases: 12
  });

  const [allCases, setAllCases] = useState<LitigationCase[]>([
    {
      id: "pf-001",
      caseNumber: "PRE-2025-001",
      title: "Application Draft - NCLT Petition",
      type: "pre-filing",
      status: "draft",
      court: "NCLT Mumbai",
      lawyer: "Adv. Rajesh Sharma",
      amount: 2500000,
      plaintiff: "Acme Corporation Ltd",
      defendant: "Beta Industries Pvt Ltd",
      daysLeft: 15,
      priority: "high",
      createdDate: "2025-01-15",
      participants: 3
    },
    {
      id: "pf-002", 
      caseNumber: "PRE-2025-002",
      title: "Reply to Show Cause Notice",
      type: "pre-filing",
      status: "awaiting-docs",
      court: "NCLT Delhi",
      lawyer: "Adv. Priya Mehta",
      amount: 1500000,
      plaintiff: "Acme Corporation Ltd",
      defendant: "Gamma Solutions Ltd",
      daysLeft: 12,
      priority: "critical",
      createdDate: "2025-01-10",
      participants: 2
    },
    {
      id: "ac-001",
      caseNumber: "CP(IB)-123/MB/2025",
      title: "Insolvency Petition - Beta Industries",
      type: "active",
      status: "pending",
      court: "NCLT Mumbai",
      lawyer: "Adv. Rajesh Sharma",
      amount: 2500000,
      filedDate: "2025-01-05",
      nextHearing: "2025-02-15",
      plaintiff: "Acme Corporation Ltd",
      defendant: "Beta Industries Pvt Ltd",
      priority: "high",
      createdDate: "2025-01-05",
      participants: 4
    },
    {
      id: "ac-002",
      caseNumber: "CP(IB)-456/ND/2025", 
      title: "Recovery Proceedings - Gamma Solutions",
      type: "active",
      status: "critical",
      court: "NCLT Delhi",
      lawyer: "Adv. Priya Mehta",
      amount: 1500000,
      filedDate: "2024-12-20",
      nextHearing: "2025-01-25",
      lastHearing: "2025-01-10",
      plaintiff: "Acme Corporation Ltd",
      defendant: "Gamma Solutions Ltd",
      priority: "critical",
      createdDate: "2024-12-20",
      participants: 5
    }
  ]);

  const [filteredCases, setFilteredCases] = useState<LitigationCase[]>([]);

  // Filter cases based on active tab, type, status, and search query
  const filterCases = useCallback((cases: LitigationCase[], tab = activeTab, type = filterType, status = filterStatus, query = searchTerm) => {
    if (!cases) return;
    
    let filtered = [...cases];
    
    // Filter by tab (case status/type)
    switch (tab) {
      case "upcoming":
        filtered = filtered.filter(case_ => case_.status === "pending" || case_.status === "upcoming" || case_.nextHearing);
        break;
      case "in-progress":
        filtered = filtered.filter(case_ => case_.status === "critical" || case_.status === "awaiting-docs");
        break;
      case "completed":
        filtered = filtered.filter(case_ => case_.status === "won" || case_.status === "lost");
        break;
      case "drafts":
        filtered = filtered.filter(case_ => case_.status === "draft");
        break;
    }
    
    // Filter by case type
    if (type !== "all") {
      filtered = filtered.filter(case_ => case_.type === type);
    }
    
    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(case_ => case_.status === status);
    }
    
    // Filter by search query
    if (query.trim() !== "") {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(case_ => 
        case_.title.toLowerCase().includes(lowercaseQuery) ||
        case_.caseNumber.toLowerCase().includes(lowercaseQuery) ||
        case_.plaintiff.toLowerCase().includes(lowercaseQuery) ||
        case_.defendant.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Sort cases
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    setFilteredCases(filtered);
  }, [activeTab, filterType, filterStatus, searchTerm, sortBy]);

  useEffect(() => {
    filterCases(allCases);
  }, [allCases, filterCases]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <Badge variant="secondary" className="text-xs">Draft</Badge>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">Pending</Badge>
          </div>
        );
      case "critical":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <Badge variant="destructive" className="text-xs">Critical</Badge>
          </div>
        );
      case "won":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <Badge variant="outline" className="text-xs border-green-200 text-green-700">Won</Badge>
          </div>
        );
      case "lost":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <Badge variant="outline" className="text-xs border-red-200 text-red-700">Lost</Badge>
          </div>
        );
      case "awaiting-docs":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700">Awaiting Docs</Badge>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <Badge variant="secondary" className="text-xs">{status}</Badge>
          </div>
        );
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "pre-filing":
        return <Badge variant="outline" className="text-xs">Pre-filing</Badge>;
      case "active":
        return <Badge variant="default" className="text-xs">Active</Badge>;
      case "closed":
        return <Badge variant="secondary" className="text-xs">Closed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{type}</Badge>;
    }
  };

  // Handle case actions
  const handleViewCase = (caseId: string) => {
    navigate(`/litigation/case/${caseId}`);
  };

  const handleEditCase = (caseId: string) => {
    const case_ = allCases.find(c => c.id === caseId);
    if (case_?.type === 'pre-filing') {
      navigate(`/litigation/create/pre-filing?edit=${caseId}`);
    } else {
      navigate(`/litigation/create/active?edit=${caseId}`);
    }
  };

  const handleDeleteCase = (caseId: string) => {
    if (confirm("Are you sure you want to delete this case?")) {
      setAllCases(prev => prev.filter(c => c.id !== caseId));
      toast({
        title: "Case Deleted",
        description: "The litigation case has been successfully deleted.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-600" />
            Litigation Management
          </h1>
          <p className="text-muted-foreground">Manage legal cases, pre-filing, and court proceedings</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            This Month
          </Button>
          <Button onClick={() => navigate('/litigation/create')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Entity Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Selected Entity:</span>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-auto border-0 p-0 h-auto font-medium text-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Acme Corporation Ltd">Acme Corporation Ltd</SelectItem>
                <SelectItem value="TechSolutions Pvt Ltd">TechSolutions Pvt Ltd</SelectItem>
                <SelectItem value="Global Ventures Inc">Global Ventures Inc</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="link" className="p-0 h-auto text-sm">Change Entity</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                <p className="text-2xl font-bold">{stats.activeCases}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Hearings</p>
                <p className="text-2xl font-bold">{stats.pendingHearings}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pre-filings</p>
                <p className="text-2xl font-bold">{stats.preFilings}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold">{stats.closedCases}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>MY LITIGATION</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pre-filing">Pre-filing</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Upcoming
                <Badge variant="secondary" className="ml-1 text-xs">
                  {allCases.filter(c => c.status === "pending" || c.nextHearing).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                In Progress
                <Badge variant="secondary" className="ml-1 text-xs">
                  {allCases.filter(c => c.status === "critical" || c.status === "awaiting-docs").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Completed
                <Badge variant="secondary" className="ml-1 text-xs">
                  {allCases.filter(c => c.status === "won" || c.status === "lost").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="drafts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Drafts
                <Badge variant="secondary" className="ml-1 text-xs">
                  {allCases.filter(c => c.status === "draft").length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CASE TITLE</TableHead>
                      <TableHead>DATE/TIME</TableHead>
                      <TableHead>TYPE</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead>MY ROLE</TableHead>
                      <TableHead>ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((case_) => (
                      <TableRow key={case_.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{case_.title}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Building className="h-3 w-3" />
                              {case_.caseNumber}
                              {case_.participants && (
                                <>
                                  <span>•</span>
                                  <Users className="h-3 w-3" />
                                  {case_.participants} participants
                                </>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {case_.nextHearing && (
                              <div className="text-sm font-medium">
                                {formatDate(case_.nextHearing)}
                              </div>
                            )}
                            {case_.filedDate && (
                              <div className="text-xs text-muted-foreground">
                                Filed: {formatDate(case_.filedDate)}
                              </div>
                            )}
                            {!case_.nextHearing && !case_.filedDate && (
                              <div className="text-sm text-muted-foreground">
                                Created: {formatDate(case_.createdDate)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(case_.type)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(case_.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">Plaintiff</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewCase(case_.id)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditCase(case_.id)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewCase(case_.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/litigation/documents/${case_.id}`)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Documents
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteCase(case_.id)} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/litigation/create')}>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium">Create New Case</h3>
            <p className="text-sm text-muted-foreground">Start fresh case setup</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium">Browse Templates</h3>
            <p className="text-sm text-muted-foreground">Use predefined case formats</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-medium">Manage Participants</h3>
            <p className="text-sm text-muted-foreground">Import/export participant list</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Gavel className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium">Case Analytics</h3>
            <p className="text-sm text-muted-foreground">View reports and insights</p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default LitigationManagement;

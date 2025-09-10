import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Vote, 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  FileText,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Bell,
  CalendarDays,
  Filter,
  Download
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { votingService } from "@/services/votingService";
import { VotingRequest, VotingStats, VotingActivity, VotingStatus } from "@/types/voting";
import { format, isValid, parseISO } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toDisplayFromStatus } from "@/utils/votingStatus";

const EVoting = () => {
  return (
    <DashboardLayout>
      <EVotingModule />
    </DashboardLayout>
  );
};

const EVotingModule = () => {
  const [votingRequests, setVotingRequests] = useState<VotingRequest[]>([]);
  const [stats, setStats] = useState<VotingStats | null>(null);
  const [activities, setActivities] = useState<VotingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VotingStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 50 | 100>(10);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsData, statsData, activitiesData] = await Promise.all([
        votingService.getVotingRequests({ 
          status: statusFilter === "all" ? undefined : statusFilter,
          search: searchTerm 
        }),
        votingService.getVotingStats(),
        votingService.getRecentActivities()
      ]);
      
      setVotingRequests(requestsData);
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load voting data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Date helpers to ensure safe formatting/Math on dates
  const toValidDate = (value: string | number | Date) => {
    if (value instanceof Date) return isValid(value) ? value : null;
    if (typeof value === 'string') {
      // Try ISO parse first
      const iso = parseISO(value);
      if (isValid(iso)) return iso;
      const d = new Date(value);
      return isValid(d) ? d : null;
    }
    const d = new Date(value);
    return isValid(d) ? d : null;
  };

  const safeFormatDate = (value: string | number | Date, fmt: string) => {
    const d = toValidDate(value);
    return d ? format(d, fmt) : '—';
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Debounce search in real implementation
    loadData();
  };

  const getStatusBadge = (status: VotingStatus) => {
    const { label, badgeClass } = toDisplayFromStatus(status);
    // Preserve special cases: draft and review
    if (status === 'draft') return <Badge variant="secondary">Draft</Badge>;
    if (status === 'review') return <Badge variant="outline">Review</Badge>;
    return <Badge className={badgeClass}>{label}</Badge>;
  };

  const getActivityIcon = (type: VotingActivity['type']) => {
    switch (type) {
      case 'new_request': return <Bell className="h-4 w-4 text-blue-500" />;
      case 'voting_completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fees_processed': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'extension_request': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTimeRemaining = (endDate: string) => {
    const end = toValidDate(endDate);
    if (!end) return "—";
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days remaining`;
    return `${hours} hours remaining`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Derived: sort and paginate client-side
  const sortedRequests = [...votingRequests].sort((a, b) => {
    const ad = toValidDate(a.createdAt)?.getTime() ?? 0;
    const bd = toValidDate(b.createdAt)?.getTime() ?? 0;
    return sortBy === "latest" ? bd - ad : ad - bd;
  });
  const totalItems = sortedRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pagedRequests = sortedRequests.slice(startIdx, endIdx);

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">E-Voting Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all voting requests for your entity</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <CalendarDays className="mr-2 h-4 w-4" />
            This Month
          </Button>
          <Button size="sm" className="h-9" asChild>
            <Link to="/voting/create">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Voting
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Vote className="mr-2 h-4 w-4 text-blue-500" />
              Ongoing Votings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeVotings}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats && stats.activeVotingsChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(stats?.activeVotingsChange || 0)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Concluded Votings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedVotings}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{stats?.completedVotingsChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-purple-500" />
              Upcoming Votings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.scheduledVotings}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{stats?.scheduledVotingsChange} from last month
            </div>
          </CardContent>
        </Card>

        
      </div>

      {/* Ongoing Voting Requests */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                Voting Requests
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/voting">
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Link>
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Track progress of your ongoing voting processes</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as VotingStatus | "all")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Upcoming</SelectItem>
                  <SelectItem value="in_progress">Ongoing</SelectItem>
                  <SelectItem value="completed">Concluded</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
              <Select value={String(pageSize) as `${number}`} onValueChange={(v) => { setPageSize(Number(v) as 10 | 50 | 100); setPage(1); }}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pagedRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Vote className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      {getStatusBadge(request.status)}
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(request.amount)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Due: {safeFormatDate(request.dueDate, 'dd MMM yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{request.entityName}</p>
                    <p className="text-sm text-gray-500 mb-3">ID: {request.id}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress:</span>
                        <span>{request.progress}%</span>
                      </div>
                      <Progress value={request.progress} className="h-2" />
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>Participants: {request.votedParticipants}/{request.totalParticipants} voted</span>
                      <span>•</span>
                      <span>Resolution: {request.passedResolutions}/{request.totalResolutions} passed</span>
                      <span>•</span>
                      <span className="text-orange-600">{calculateTimeRemaining(request.endDate)}</span>
                      {request.status === 'in_progress' && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600">🔔 2 extension requests</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/voting/${request.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/voting/edit/${request.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {request.status === 'completed' && (
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Showing {totalItems === 0 ? 0 : startIdx + 1}-{Math.min(endIdx, totalItems)} of {totalItems}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={currentPage === 1}>First</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>Last</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-gray-600">Latest updates and notifications</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {safeFormatDate(activity.timestamp, 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                {activity.amount && (
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(activity.amount)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/voting/create')}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <FileText className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium">Create Voting Request</h3>
            <p className="text-sm text-gray-600 mt-1">Set up new voting process</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <FileText className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium">View Reports</h3>
            <p className="text-sm text-gray-600 mt-1">Generate voting summaries</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Users className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium">Manage Participants</h3>
            <p className="text-sm text-gray-600 mt-1">Update voter lists & shares</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Bell className="h-8 w-8 text-orange-500 mb-2" />
            <h3 className="font-medium">Schedule Reminders</h3>
            <p className="text-sm text-gray-600 mt-1">Configure notifications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EVoting;

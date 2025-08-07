import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileText, 
  Eye, 
  Edit, 
  Trash2,
  Upload,
  Share,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  CalendarDays,
  Plus,
  MessageSquare,
  RefreshCw,
  Users,
  Globe,
  Smartphone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  Building,
  DollarSign,
  UserCheck,
  ClipboardList,
  Settings,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'approve' | 'reject' | 'submit' | 'verify' | 'allocate';
  entityType: 'claim' | 'invitation' | 'document' | 'verification' | 'allocation' | 'admission' | 'report';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  status: 'success' | 'failed' | 'pending';
  severity: 'low' | 'medium' | 'high' | 'critical';
  claimId?: string;
  claimantName?: string;
  amount?: number;
  currency?: string;
}

const ClaimsAuditLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Mock audit log data
  const auditLogs: AuditLogEntry[] = [
    {
      id: "1",
      timestamp: "2024-12-07T14:30:00Z",
      action: "Claim Verified",
      actionType: "verify",
      entityType: "claim",
      entityId: "CLM-2024-001",
      entityName: "Operational Debt Claim - ABC Corp",
      userId: "USR-001",
      userName: "John Verifier",
      userRole: "Claims Verifier",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      details: "Claim verified and approved for admission",
      status: "success",
      severity: "medium",
      claimId: "CLM-2024-001",
      claimantName: "ABC Corporation",
      amount: 2500000,
      currency: "INR"
    },
    {
      id: "2",
      timestamp: "2024-12-07T13:45:00Z",
      action: "Document Uploaded",
      actionType: "create",
      entityType: "document",
      entityId: "DOC-2024-156",
      entityName: "Supporting Invoice - Invoice_ABC_001.pdf",
      userId: "USR-002",
      userName: "ABC Corporation",
      userRole: "Claimant",
      ipAddress: "203.192.45.12",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      details: "Supporting document uploaded for claim verification",
      status: "success",
      severity: "low",
      claimId: "CLM-2024-001",
      claimantName: "ABC Corporation"
    },
    {
      id: "3",
      timestamp: "2024-12-07T12:20:00Z",
      action: "Claim Submitted",
      actionType: "submit",
      entityType: "claim",
      entityId: "CLM-2024-002",
      entityName: "Financial Debt Claim - XYZ Ltd",
      userId: "USR-003",
      userName: "XYZ Limited",
      userRole: "Claimant",
      ipAddress: "117.204.89.45",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      details: "New claim submitted for review and verification",
      status: "success",
      severity: "medium",
      claimId: "CLM-2024-002",
      claimantName: "XYZ Limited",
      amount: 1800000,
      currency: "INR"
    },
    {
      id: "4",
      timestamp: "2024-12-07T11:15:00Z",
      action: "Invitation Created",
      actionType: "create",
      entityType: "invitation",
      entityId: "INV-2024-005",
      entityName: "Q4 2024 Claims Process",
      userId: "USR-004",
      userName: "Admin User",
      userRole: "System Administrator",
      ipAddress: "192.168.1.50",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      details: "New claim invitation created and published",
      status: "success",
      severity: "high"
    },
    {
      id: "5",
      timestamp: "2024-12-07T10:30:00Z",
      action: "Allocation Updated",
      actionType: "update",
      entityType: "allocation",
      entityId: "ALL-2024-003",
      entityName: "Claim Allocation - Priority Update",
      userId: "USR-001",
      userName: "John Verifier",
      userRole: "Claims Verifier",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      details: "Claim allocation priority updated from Medium to High",
      oldValue: "Medium",
      newValue: "High",
      status: "success",
      severity: "medium",
      claimId: "CLM-2024-001"
    },
    {
      id: "6",
      timestamp: "2024-12-07T09:45:00Z",
      action: "Login Failed",
      actionType: "view",
      entityType: "claim",
      entityId: "SYS-LOGIN",
      entityName: "System Login Attempt",
      userId: "USR-UNKNOWN",
      userName: "Unknown User",
      userRole: "Unknown",
      ipAddress: "45.123.67.89",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      details: "Failed login attempt with invalid credentials",
      status: "failed",
      severity: "critical"
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === "all" || log.actionType === actionFilter;
    const matchesUser = userFilter === "all" || log.userRole === userFilter;
    const matchesEntity = entityFilter === "all" || log.entityType === entityFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    
    return matchesSearch && matchesAction && matchesUser && matchesEntity && matchesSeverity;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create': return <Plus className="h-4 w-4" />;
      case 'update': return <Edit className="h-4 w-4" />;
      case 'delete': return <Trash2 className="h-4 w-4" />;
      case 'view': return <Eye className="h-4 w-4" />;
      case 'approve': return <CheckCircle className="h-4 w-4" />;
      case 'reject': return <AlertTriangle className="h-4 w-4" />;
      case 'submit': return <Upload className="h-4 w-4" />;
      case 'verify': return <Shield className="h-4 w-4" />;
      case 'allocate': return <UserCheck className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const exportAuditLog = () => {
    // Mock export functionality
    const csvContent = [
      ['Timestamp', 'Action', 'Entity Type', 'Entity Name', 'User', 'Role', 'Status', 'Severity', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.action,
        log.entityType,
        log.entityName,
        log.userName,
        log.userRole,
        log.status,
        log.severity,
        `"${log.details}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claims-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Activity className="h-6 w-6" />
              <span>Claims Audit Log</span>
            </h1>
            <p className="text-muted-foreground">
              Complete activity tracking and audit trail for claims management
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportAuditLog}>
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Activities</p>
                  <p className="text-2xl font-bold">{auditLogs.length}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Events</p>
                  <p className="text-2xl font-bold text-red-600">
                    {auditLogs.filter(log => log.severity === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Actions</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {auditLogs.filter(log => log.status === 'failed').length}
                  </p>
                </div>
                <Trash2 className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">
                    {new Set(auditLogs.map(log => log.userId)).size}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Action Type</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="view">View</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="submit">Submit</SelectItem>
                    <SelectItem value="verify">Verify</SelectItem>
                    <SelectItem value="allocate">Allocate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Entity Type</label>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="claim">Claims</SelectItem>
                    <SelectItem value="invitation">Invitations</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                    <SelectItem value="allocation">Allocation</SelectItem>
                    <SelectItem value="admission">Admission</SelectItem>
                    <SelectItem value="report">Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">User Role</label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="System Administrator">Admin</SelectItem>
                    <SelectItem value="Claims Verifier">Verifier</SelectItem>
                    <SelectItem value="Claimant">Claimant</SelectItem>
                    <SelectItem value="Team Member">Team Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Severity</label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sort Order</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log ({filteredLogs.length} entries)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.actionType)}
                          <span className="font-medium">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.entityType}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-32">
                            {log.entityName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.userName}</span>
                          <span className="text-xs text-muted-foreground">{log.userRole}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                      <TableCell>
                        <span className="text-sm truncate max-w-48 block">
                          {log.details}
                        </span>
                        {log.claimId && (
                          <Link 
                            to={`/claims/claim/${log.claimId}`}
                            className="text-xs text-blue-600 hover:underline flex items-center space-x-1 mt-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View Claim</span>
                          </Link>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{' '}
                  {filteredLogs.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClaimsAuditLog;

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Building,
  Eye,
  FileText,
  BarChart3,
  Zap,
  Activity,
  Users,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  DollarSign,
  UserCheck,
  ClipboardList,
  Settings,
  Download,
  Upload,
  Link as LinkIcon,
  Copy,
  Send
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface ClaimsStats {
  allClaimsReceived: number;
  pendingVerification: number;
  pendingAdmission: number;
  pendingAllocation: number;
  totalAdmittedAmount: number;
}

interface ClaimInvitation {
  id: string; // internal id
  invitationId: string; // display id like INV001
  createdBy: string;
  creationDate: string; // YYYY-MM-DD
  capacity: string;
  authority: string;
  status: 'submission_progress' | 'verification_progress' | 'admission_progress' | 'closed';
  displayStatus: 'active' | 'expired';
  claimsReceived: number;
  entityName: string;
}

interface RecentActivity {
  id: string;
  type: 'claim_submitted' | 'claim_verified' | 'claim_admitted' | 'invitation_created';
  description: string;
  timestamp: string;
  claimantName?: string;
  amount?: number;
  status: 'pending' | 'completed' | 'rejected';
}

interface PendingAction {
  actionId: string; // e.g., ACT001
  claimId: string;  // e.g., CLM006
  action: 'Verify Documents' | 'Admit Claim' | 'Allocate Team';
  dueDate: string; // YYYY-MM-DD
}

const ClaimsManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEntity, setSelectedEntity] = useState("entity-1");
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [claimsStats, setClaimsStats] = useState<ClaimsStats>({
    allClaimsReceived: 13,
    pendingVerification: 3,
    pendingAdmission: 2,
    pendingAllocation: 3,
    totalAdmittedAmount: 2500000
  });

  const [recentInvitations, setRecentInvitations] = useState<ClaimInvitation[]>([
    {
      id: "inv-001",
      invitationId: "INV001",
      createdBy: "Admin User",
      creationDate: "2024-06-28",
      capacity: "IRP appointed by NCLT",
      authority: "Admission Order by NCLT",
      status: "verification_progress",
      displayStatus: "active",
      claimsReceived: 45,
      entityName: "ABC Corporation Ltd"
    },
    {
      id: "inv-002", 
      invitationId: "INV002",
      createdBy: "Team Lead",
      creationDate: "2024-06-25",
      capacity: "Liquidator appointed by NCLT",
      authority: "Liquidation Order by NCLT",
      status: "submission_progress",
      displayStatus: "expired",
      claimsReceived: 23,
      entityName: "XYZ Industries Ltd"
    },
    {
      id: "inv-003", 
      invitationId: "INV003",
      createdBy: "Admin User",
      creationDate: "2024-06-20",
      capacity: "IRP appointed by NCLT",
      authority: "Admission Order by NCLT",
      status: "submission_progress",
      displayStatus: "active",
      claimsReceived: 12,
      entityName: "PQR Services Ltd"
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: "act-001",
      type: "claim_submitted",
      description: "New claim submitted by Financial Creditor",
      timestamp: "2024-01-20T10:30:00",
      claimantName: "Bank of India",
      amount: 150000,
      status: "pending"
    },
    {
      id: "act-002",
      type: "claim_verified",
      description: "Claim verification completed",
      timestamp: "2024-01-20T09:15:00",
      claimantName: "HDFC Bank Ltd",
      amount: 250000,
      status: "completed"
    }
  ]);

  const [pendingActions, setPendingActions] = useState<PendingAction[]>([
    {
      actionId: "ACT001",
      claimId: "CLM006",
      action: "Verify Documents",
      dueDate: "2024-07-10"
    },
    {
      actionId: "ACT002",
      claimId: "CLM007",
      action: "Admit Claim",
      dueDate: "2024-07-12"
    },
    {
      actionId: "ACT003",
      claimId: "CLM008",
      action: "Allocate Team",
      dueDate: "2024-07-08"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submission_progress':
        return 'bg-blue-100 text-blue-800';
      case 'verification_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'admission_progress':
        return 'bg-orange-100 text-orange-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvitationDisplayStatusClass = (displayStatus: 'active' | 'expired') => {
    return displayStatus === 'active' 
      ? 'bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs'
      : 'bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCreateInvitation = () => {
    navigate('/claims/create-invitation');
  };

  const handleViewAllClaims = () => {
    navigate('/claims/all-claims');
  };

  const handleViewAllInvitations = () => {
    navigate('/claims/invitations');
  };

  const handleAllocationSettings = () => {
    navigate('/claims/allocation-settings');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
            <p className="text-gray-600 mt-1">Manage money claim processes and submissions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entity-1">ABC Corporation Ltd</SelectItem>
                  <SelectItem value="entity-2">XYZ Industries Ltd</SelectItem>
                  <SelectItem value="entity-3">PQR Services Ltd</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => navigate('/create-entity')}>
                Create Entity
              </Button>
            </div>
            <Button onClick={handleCreateInvitation}>
              <Plus className="w-4 h-4 mr-2" />
              Create Claim Invitation
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewAllClaims}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Claims Received</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{claimsStats.allClaimsReceived}</div>
              <p className="text-xs text-muted-foreground">
                Total claims submitted
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/claims/all-claims?tab=verification')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{claimsStats.pendingVerification}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/claims/all-claims?tab=admission')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Admission</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{claimsStats.pendingAdmission}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting admission
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/claims/all-claims?tab=allocation')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Allocation</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{claimsStats.pendingAllocation}</div>
              <p className="text-xs text-muted-foreground">
                Unassigned claims
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/claims/reports')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admitted Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(claimsStats.totalAdmittedAmount)}</div>
              <p className="text-xs text-muted-foreground">
                Approved claim value
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Claim Invitations - Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Claim Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invitation ID</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInvitations.map((inv) => (
                      <TableRow key={inv.id} className="text-sm">
                        <TableCell className="font-medium">{inv.invitationId}</TableCell>
                        <TableCell>{inv.createdBy}</TableCell>
                        <TableCell>{new Date(inv.creationDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={getInvitationDisplayStatusClass(inv.displayStatus)}>
                            {inv.displayStatus === 'active' ? 'Active' : 'Expired'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-center mt-4">
                <Button variant="link" className="text-blue-600" onClick={handleViewAllInvitations}>
                  View All Claim Invitations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* My Pending Actions - Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">My Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action ID</TableHead>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingActions.map((pa) => (
                      <TableRow key={pa.actionId} className="text-sm">
                        <TableCell className="font-medium">{pa.actionId}</TableCell>
                        <TableCell className="font-mono">{pa.claimId}</TableCell>
                        <TableCell>
                          {pa.action}
                        </TableCell>
                        <TableCell>{new Date(pa.dueDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-center mt-4">
                <Button variant="link" className="text-blue-600" onClick={handleViewAllClaims}>
                  View All My Pending Actions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewAllClaims}>
            <CardContent className="flex items-center p-6">
              <ClipboardList className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold">All Claims List</h3>
                <p className="text-sm text-gray-600">View and manage all claims</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleAllocationSettings}>
            <CardContent className="flex items-center p-6">
              <Settings className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold">Allocation Settings</h3>
                <p className="text-sm text-gray-600">Configure claim allocation rules</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/claims/reports')}>
            <CardContent className="flex items-center p-6">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-semibold">Reports & Analytics</h3>
                <p className="text-sm text-gray-600">Generate claim reports</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/claims/audit-log')}>
            <CardContent className="flex items-center p-6">
              <Activity className="h-8 w-8 text-orange-600 mr-4" />
              <div>
                <h3 className="font-semibold">Audit Log</h3>
                <p className="text-sm text-gray-600">Track all claim activities</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-blue-100">
                      {activity.type === 'claim_submitted' && <Upload className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'claim_verified' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.type === 'claim_admitted' && <UserCheck className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'invitation_created' && <Send className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-600">{activity.claimantName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="font-medium">{formatCurrency(activity.amount)}</p>
                    )}
                    <Badge className={activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                   activity.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                   'bg-yellow-100 text-yellow-800'}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClaimsManagement;

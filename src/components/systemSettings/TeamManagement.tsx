import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail, 
  UserPlus,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Archive,
  UserX,
  ExternalLink
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { systemSettingsService } from "@/services/systemSettingsService";
import { TeamMember, TeamMemberRole, TeamMemberStatus, SystemSettingsFilters } from "@/types/systemSettings";
import { format } from "date-fns";

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SystemSettingsFilters>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: TeamMemberRole.TEAM_MEMBER
  });

  const loadTeamMembers = useCallback(async () => {
    try {
      const response = await systemSettingsService.getTeamMembers(filters);
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Failed to load team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);



  const handleAddMember = async () => {
    try {
      const member = await systemSettingsService.addTeamMember(newMember);
      setTeamMembers(prev => [...prev, member]);
      setShowAddDialog(false);
      setNewMember({ name: '', email: '', role: TeamMemberRole.TEAM_MEMBER });
      toast({
        title: "Success",
        description: "Team member invited successfully",
      });
    } catch (error) {
      console.error('Failed to add team member:', error);
      toast({
        title: "Error",
        description: "Failed to invite team member",
        variant: "destructive"
      });
    }
  };

  const handleEditMember = async () => {
    if (!selectedMember) return;
    
    try {
      await systemSettingsService.updateTeamMember(selectedMember.id, selectedMember);
      setTeamMembers(prev => prev.map(m => m.id === selectedMember.id ? selectedMember : m));
      setShowEditDialog(false);
      setSelectedMember(null);
      toast({
        title: "Success",
        description: "Team member updated successfully",
      });
    } catch (error) {
      console.error('Failed to update team member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive"
      });
    }
  };

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    
    try {
      await systemSettingsService.removeTeamMember(memberToRemove);
      setTeamMembers(prev => prev.filter(m => m.id !== memberToRemove));
      setShowRemoveDialog(false);
      setMemberToRemove(null);
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
    } catch (error) {
      console.error('Failed to remove team member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive"
      });
    }
  };

  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [memberToArchive, setMemberToArchive] = useState<string | null>(null);

  const handleArchiveMember = async () => {
    if (!memberToArchive) return;
    
    try {
      await systemSettingsService.archiveTeamMember(memberToArchive);
      setTeamMembers(prev => prev.map(m => 
        m.id === memberToArchive ? { ...m, status: TeamMemberStatus.INACTIVE, archived: true } : m
      ));
      setShowArchiveDialog(false);
      setMemberToArchive(null);
      toast({
        title: "Success",
        description: "Team member archived successfully",
      });
    } catch (error) {
      console.error('Failed to archive team member:', error);
      toast({
        title: "Error",
        description: "Failed to archive team member",
        variant: "destructive"
      });
    }
  };

  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [memberToDeactivate, setMemberToDeactivate] = useState<string | null>(null);

  const handleDeactivateMember = async () => {
    if (!memberToDeactivate) return;
    
    try {
      await systemSettingsService.deactivateTeamMember(memberToDeactivate);
      setTeamMembers(prev => prev.map(m => 
        m.id === memberToDeactivate ? { ...m, status: TeamMemberStatus.INACTIVE } : m
      ));
      setShowDeactivateDialog(false);
      setMemberToDeactivate(null);
      toast({
        title: "Success",
        description: "Team member deactivated successfully",
      });
    } catch (error) {
      console.error('Failed to deactivate team member:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate team member",
        variant: "destructive"
      });
    }
  };

  const handleViewMemberDetail = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDetailDialog(true);
  };

 

  const getStatusBadge = (status: TeamMemberStatus) => {
    switch (status) {
      case TeamMemberStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case TeamMemberStatus.INACTIVE:
        return <Badge variant="secondary">Inactive</Badge>;
      case TeamMemberStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getRoleBadge = (role: TeamMemberRole) => {
    switch (role) {
      case TeamMemberRole.ADMIN:
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case TeamMemberRole.TEAM_LEAD:
        return <Badge className="bg-blue-100 text-blue-800">Team Lead</Badge>;
      case TeamMemberRole.TEAM_MEMBER:
        return <Badge variant="outline">Team Member</Badge>;
    }
  };

  const getLastActiveText = (lastActive: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return format(lastActive, 'MMM dd, yyyy');
  };

  const activeMembers = teamMembers.filter(m => m.status === TeamMemberStatus.ACTIVE).length;
  const totalMembers = teamMembers.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Members</p>
              <p className="text-2xl font-bold">{activeMembers}/{totalMembers}</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite New Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to a new team member to join your organization.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="memberName">Full Name</Label>
                      <Input
                        id="memberName"
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memberEmail">Email Address</Label>
                      <Input
                        id="memberEmail"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memberRole">Role</Label>
                      <Select 
                        value={newMember.role} 
                        onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value as TeamMemberRole }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TeamMemberRole.TEAM_MEMBER}>Team Member</SelectItem>
                          <SelectItem value={TeamMemberRole.TEAM_LEAD}>Team Lead</SelectItem>
                          <SelectItem value={TeamMemberRole.ADMIN}>Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddMember} disabled={!newMember.name || !newMember.email}>
                        Send Invitation
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Invite via Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select 
              value={filters.role || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, role: value === 'all' ? undefined : value as TeamMemberRole }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={TeamMemberRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={TeamMemberRole.TEAM_LEAD}>Team Lead</SelectItem>
                <SelectItem value={TeamMemberRole.TEAM_MEMBER}>Team Member</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value as TeamMemberStatus }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={TeamMemberStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={TeamMemberStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={TeamMemberStatus.PENDING}>Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Member List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMemberDetail(member)}
                            title="View Details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMember(member);
                            setShowEditDialog(true);
                          }}
                          title="Edit Member"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {member.role !== TeamMemberRole.ADMIN && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setMemberToArchive(member.id);
                                setShowArchiveDialog(true);
                              }}
                              title="Archive Member"
                            >
                              <Archive className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setMemberToDeactivate(member.id);
                                setShowDeactivateDialog(true);
                              }}
                              title="Deactivate Member"
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setMemberToRemove(member.id);
                                setShowRemoveDialog(true);
                              }}
                              title="Remove Member"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Full access to all modules</li>
                <li>• Team management capabilities</li>
                <li>• Billing and subscription control</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">Team Lead</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Access to assigned modules</li>
                <li>• Can view team performance</li>
                <li>• Limited administrative functions</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Team Member</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Access to assigned tasks</li>
                <li>• Profile and notification management only</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/settings?tab=roles">
                Manage Roles
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/settings?tab=permissions">
                Set Permissions
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/settings?tab=analytics">
                Usage Analytics
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/settings?tab=team">
                <ExternalLink className="h-4 w-4 mr-2" />
                View More
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Member Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Team Member Details</DialogTitle>
            <DialogDescription>
              Complete information about the team member.
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-blue-600">
                    {selectedMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.email}</p>
                  <div className="flex gap-2 mt-2">
                    {getRoleBadge(selectedMember.role)}
                    {getStatusBadge(selectedMember.status)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Detailed Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Member ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedMember.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Join Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedMember.createdAt || new Date()), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Active</Label>
                    <p className="text-sm text-muted-foreground">
                      {getLastActiveText(selectedMember.lastActive)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Department</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedMember.department || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedMember.phone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedMember.location || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Permissions & Access */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Module Access</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Claims', 'Meetings', 'Documents', 'Reports', 'Billing', 'Settings'].map((module) => (
                    <div key={module} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{module}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setShowDetailDialog(false);
                    setShowEditDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Member
                </Button>
                {selectedMember.role !== TeamMemberRole.ADMIN && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMemberToArchive(selectedMember.id);
                        setShowArchiveDialog(true);
                        setShowDetailDialog(false);
                      }}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMemberToDeactivate(selectedMember.id);
                        setShowDeactivateDialog(true);
                        setShowDetailDialog(false);
                      }}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  </>
                )}
                <Button variant="outline" asChild>
                  <Link to="/settings?tab=team">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Team Management
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update team member information and role.
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={selectedMember.name}
                  onChange={(e) => setSelectedMember(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email Address</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={selectedMember.email}
                  onChange={(e) => setSelectedMember(prev => prev ? { ...prev, email: e.target.value } : prev)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select 
                  value={selectedMember.role} 
                  onValueChange={(value) => setSelectedMember(prev => prev ? { ...prev, role: value as TeamMemberRole } : prev)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TeamMemberRole.TEAM_MEMBER}>Team Member</SelectItem>
                    <SelectItem value={TeamMemberRole.TEAM_LEAD}>Team Lead</SelectItem>
                    <SelectItem value={TeamMemberRole.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select 
                  value={selectedMember.status} 
                  onValueChange={(value) => setSelectedMember(prev => prev ? { ...prev, status: value as TeamMemberStatus } : prev)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TeamMemberStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={TeamMemberStatus.INACTIVE}>Inactive</SelectItem>
                    <SelectItem value={TeamMemberStatus.PENDING}>Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditMember}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Archive Member Confirmation Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this team member? This will make their profile inactive and archive their data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchiveMember}>
              Archive Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Deactivate Member Confirmation Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this team member? They will no longer have access to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowDeactivateDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeactivateMember}>
              Deactivate Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Remove Member Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this team member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Remove Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { TeamManagement };

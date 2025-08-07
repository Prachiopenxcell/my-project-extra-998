import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Search, 
  Shield, 
  UserCheck, 
  UserX, 
  Settings, 
  Mail,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Crown,
  Key,
  CalendarDays,
  Filter,
  Upload,
  MessageSquare,
  Lightbulb,
  FolderOpen,
  FileText,
  UserPlus,
  MoreHorizontal
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AccessManagement = () => {
  const { roomId } = useParams();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  const roomData = {
    name: "Due Diligence - Series A Funding",
    activeMembers: 8,
    documents: 127,
    privacy: "Private"
  };

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Admin",
      avatar: "JD",
      lastActive: "2 hours ago",
      isOwner: true
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@investor.com",
      role: "Editor",
      avatar: "SS",
      lastActive: "1 hour ago",
      isOwner: false
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@legal.com",
      role: "Viewer",
      avatar: "MJ",
      lastActive: "3 days ago",
      isOwner: false
    }
  ];

  const groups = [
    {
      id: 1,
      name: "Investment Team",
      members: 5,
      role: "Commenter",
      created: "Dec 10, 2023"
    }
  ];

  const pendingInvitations = [
    {
      id: 1,
      email: "alex.kim@startup.com",
      role: "Editor",
      sentDate: "Dec 18, 2023"
    },
    {
      id: 2,
      email: "lisa.wong@advisor.com",
      role: "Viewer",
      sentDate: "Dec 17, 2023"
    }
  ];

  const permissionRoles = [
    {
      role: "Admin",
      icon: Crown,
      description: "Full control, manage users, settings",
      color: "text-red-600"
    },
    {
      role: "Editor",
      icon: Edit,
      description: "Upload, edit, delete documents",
      color: "text-blue-600"
    },
    {
      role: "Uploader",
      icon: Upload,
      description: "Upload documents, view content",
      color: "text-green-600"
    },
    {
      role: "Commenter",
      icon: MessageSquare,
      description: "View and comment on documents",
      color: "text-yellow-600"
    },
    {
      role: "Viewer",
      icon: Eye,
      description: "View documents only",
      color: "text-gray-600"
    },
    {
      role: "Suggestion Only",
      icon: Lightbulb,
      description: "Suggest edits, no direct changes",
      color: "text-purple-600"
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Crown className="h-4 w-4 text-red-600" />;
      case "Editor":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "Viewer":
        return <Eye className="h-4 w-4 text-gray-600" />;
      case "Commenter":
        return <MessageSquare className="h-4 w-4 text-yellow-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Access Management</h1>
            <p className="text-muted-foreground">Manage user access, permissions, and security settings</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <CalendarDays className="mr-2 h-4 w-4" />
              This Month
            </Button>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-2 h-4 w-4 text-primary" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <UserCheck className="mr-2 h-4 w-4 text-primary" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                Currently online
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                Pending Invites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Awaiting response
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Shield className="mr-2 h-4 w-4 text-primary" />
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Room Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Room Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                <span className="font-medium">{roomData.name}</span>
              </div>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {roomData.activeMembers} Active Members
              </Badge>
              <Badge variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                {roomData.documents} Documents
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {roomData.privacy}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Access Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="users">Users & Groups</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Filter:</span>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort:</span>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Latest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TabsContent value="users" className="space-y-4">
            {/* User Access Control */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Access Control</CardTitle>
                  <div className="flex gap-2">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User/Group
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitations
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder-avatar-${user.id}.jpg`} />
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            {user.isOwner && <Badge variant="secondary">(Owner)</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Last Active: {user.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          <span className="text-sm font-medium">{user.role}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>View Activity</DropdownMenuItem>
                            {!user.isOwner && (
                              <DropdownMenuItem className="text-destructive">
                                Remove Access
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Groups */}
                {groups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{group.name} (Group)</h3>
                          <p className="text-sm text-muted-foreground">{group.members} members</p>
                          <p className="text-xs text-muted-foreground">Created: {group.created}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {getRoleIcon(group.role)}
                          <span className="text-sm font-medium">{group.role}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Manage Group</DropdownMenuItem>
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Remove Group
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pending Invitations */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending Invitations ({pendingInvitations.length})
                  </h3>
                  <div className="space-y-2">
                    {pendingInvitations.map((invitation) => (
                      <div key={invitation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{invitation.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {getRoleIcon(invitation.role)}
                            <span className="text-sm">{invitation.role}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Resend
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Permission Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permissionRoles.map((permission) => {
                    const Icon = permission.icon;
                    return (
                      <div key={permission.role} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Icon className={`h-5 w-5 ${permission.color}`} />
                          <div>
                            <h3 className="font-semibold">{permission.role}</h3>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Invitation management will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AccessManagement;

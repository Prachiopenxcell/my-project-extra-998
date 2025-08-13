import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Building, 
  Users, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  UserPlus,
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { workspaceService } from "@/services/workspaceService";
import { 
  WorkspaceEntity, 
  EntityType, 
  EntityStatus, 
  EntitySize,
  WorkspaceStats,
  TeamMemberStatus 
} from "@/types/workspace";
import { UserRole } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MyEntityProps {
  isTeamMember: boolean;
  isAdmin: boolean;
  userRole?: UserRole;
}

const MyEntity = ({ isTeamMember, isAdmin, userRole }: MyEntityProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [entities, setEntities] = useState<WorkspaceEntity[]>([]);
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<EntityType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<EntityStatus | "all">("all");
  const [selectedEntity, setSelectedEntity] = useState<WorkspaceEntity | null>(null);
  const [showEntityDetails, setShowEntityDetails] = useState(false);

  const loadEntities = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        searchTerm: searchTerm || undefined,
        entityType: typeFilter !== "all" ? typeFilter : undefined,
        entityStatus: statusFilter !== "all" ? statusFilter : undefined
      };
      
      const response = await workspaceService.getMyEntities("current-user", filters);
      setEntities(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load entities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, typeFilter, statusFilter, toast]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await workspaceService.getWorkspaceStats("current-user");
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }, []);

  useEffect(() => {
    loadEntities();
    loadStats();
  }, [loadEntities, loadStats]);

  const getStatusBadge = (status: EntityStatus) => {
    const statusConfig = {
      [EntityStatus.ACTIVE]: { 
        label: "Active", 
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle
      },
      [EntityStatus.INACTIVE]: { 
        label: "Inactive", 
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: XCircle
      },
      [EntityStatus.PENDING]: { 
        label: "Pending", 
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock
      },
      [EntityStatus.SUSPENDED]: { 
        label: "Suspended", 
        className: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle
      }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getEntityTypeLabel = (type: EntityType) => {
    const typeLabels = {
      [EntityType.INDIVIDUAL]: "Individual",
      [EntityType.PARTNERSHIP]: "Partnership",
      [EntityType.PRIVATE_LIMITED]: "Private Limited",
      [EntityType.PUBLIC_LIMITED]: "Public Limited",
      [EntityType.LLP]: "LLP",
      [EntityType.BRANCH]: "Branch",
      [EntityType.DEPARTMENT]: "Department"
    };
    return typeLabels[type];
  };

  const handleEntityClick = (entity: WorkspaceEntity) => {
    setSelectedEntity(entity);
    setShowEntityDetails(true);
  };

  const handleCreateEntity = () => {
    navigate('/entity-management?action=create');
  };

  const handleEditEntity = (entityId: string) => {
    navigate(`/entity-management?action=edit&id=${entityId}`);
  };

  const handleDeleteEntity = async (entityId: string) => {
    if (window.confirm('Are you sure you want to delete this entity?')) {
      try {
        await workspaceService.deleteEntity(entityId);
        toast({
          title: "Success",
          description: "Entity deleted successfully"
        });
        loadEntities();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete entity",
          variant: "destructive"
        });
      }
    }
  };

  const handleViewSubscriptionPackages = () => {
    navigate('/subscription/browse');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Entities Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entities</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEntities}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Entities</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeEntities}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalTeamMembers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Entities
            </CardTitle>
            {isAdmin && (
              <Button onClick={handleCreateEntity} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Entity
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as EntityType | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={EntityType.INDIVIDUAL}>Individual</SelectItem>
                <SelectItem value={EntityType.PARTNERSHIP}>Partnership</SelectItem>
                <SelectItem value={EntityType.PRIVATE_LIMITED}>Private Limited</SelectItem>
                <SelectItem value={EntityType.PUBLIC_LIMITED}>Public Limited</SelectItem>
                <SelectItem value={EntityType.LLP}>LLP</SelectItem>
                <SelectItem value={EntityType.BRANCH}>Branch</SelectItem>
                <SelectItem value={EntityType.DEPARTMENT}>Department</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EntityStatus | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={EntityStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={EntityStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={EntityStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={EntityStatus.SUSPENDED}>Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entities.map((entity) => (
          <Card key={entity.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{entity.name}</CardTitle>
                    <p className="text-sm text-gray-600">{getEntityTypeLabel(entity.type)}</p>
                  </div>
                </div>
                
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEntityClick(entity)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditEntity(entity.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Entity
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteEntity(entity.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Entity
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                {getStatusBadge(entity.status)}
                <Badge variant="outline" className="text-xs">
                  {entity.industry}
                </Badge>
              </div>
            </CardHeader>

            <CardContent onClick={() => handleEntityClick(entity)}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{entity.address.city}, {entity.address.state}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{entity.teamMembers.length} team member{entity.teamMembers.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4" />
                  <span>{entity.modules.length} module{entity.modules.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile Completion:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${entity.profileCompletion}%` }}
                        />
                      </div>
                      <span className="font-medium">{entity.profileCompletion}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEntityClick(entity);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Entity Details Dialog */}
      <Dialog open={showEntityDetails} onOpenChange={setShowEntityDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {selectedEntity?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed information about this entity
            </DialogDescription>
          </DialogHeader>

          {selectedEntity && (
            <div className="space-y-6">
              {/* Entity Profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Entity Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <p className="text-sm">{getEntityTypeLabel(selectedEntity.type)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Industry</label>
                      <p className="text-sm">{selectedEntity.industry}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Size</label>
                      <p className="text-sm capitalize">{selectedEntity.size}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registration Number</label>
                      <p className="text-sm">{selectedEntity.registrationNumber || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Created</label>
                      <p className="text-sm">{format(new Date(selectedEntity.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedEntity.contactInfo.primaryEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedEntity.contactInfo.primaryPhone}</span>
                    </div>
                    {selectedEntity.contactInfo.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedEntity.contactInfo.website}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div className="text-sm">
                        <p>{selectedEntity.address.street}</p>
                        <p>{selectedEntity.address.city}, {selectedEntity.address.state} {selectedEntity.address.pinCode}</p>
                        <p>{selectedEntity.address.country}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Modules Subscribed */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Modules Subscribed for Entity</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEntity.modules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedEntity.modules.map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{module.title}</p>
                            <p className="text-sm text-gray-600">{module.description}</p>
                          </div>
                          <Badge variant="outline">{module.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No modules subscribed for this entity</p>
                      {isAdmin && (
                        <Button onClick={handleViewSubscriptionPackages} variant="outline">
                          View Subscription Packages
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Members Assigned</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEntity.teamMembers.length > 0 ? (
                    <div className="space-y-3">
                      {selectedEntity.teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">{member.role}</Badge>
                            <p className="text-xs text-gray-600">
                              Last active: {format(new Date(member.lastActive), 'MMM dd')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No team members assigned to this entity</p>
                      {isAdmin && (
                        <Button variant="outline">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Team Members
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Team Member Notice */}
      {isTeamMember && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Team Member Access</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You can only view entities you are assigned to. You cannot create, edit, or delete entities. 
                  Contact your administrator for any changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {entities.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Entities Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                ? "No entities match your current filters."
                : isTeamMember 
                  ? "You haven't been assigned to any entities yet."
                  : "You haven't created any entities yet."}
            </p>
            {isAdmin && (
              <Button onClick={handleCreateEntity} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Entity
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyEntity;

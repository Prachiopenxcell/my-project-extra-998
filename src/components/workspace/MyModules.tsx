import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  Package, 
  Calendar, 
  Users, 
  Building, 
  AlertTriangle, 
  Vote, 
  Eye, 
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { workspaceService } from "@/services/workspaceService";
import { WorkspaceModule, ModuleStatus, ModuleCategory, WorkspaceStats } from "@/types/workspace";
import { UserRole } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface MyModulesProps {
  isTeamMember: boolean;
  isAdmin: boolean;
  userRole?: UserRole;
}

const MyModules = ({ isTeamMember, isAdmin, userRole }: MyModulesProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [modules, setModules] = useState<WorkspaceModule[]>([]);
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ModuleStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ModuleCategory | "all">("all");

  const loadModules = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        searchTerm: searchTerm || undefined,
        moduleStatus: statusFilter !== "all" ? statusFilter : undefined,
        moduleCategory: categoryFilter !== "all" ? categoryFilter : undefined
      };
      
      const response = await workspaceService.getMyModules("current-user", filters);
      setModules(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load modules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, categoryFilter, toast]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await workspaceService.getWorkspaceStats("current-user");
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }, []);

  useEffect(() => {
    loadModules();
    loadStats();
  }, [loadModules, loadStats]);

  const getStatusBadge = (status: ModuleStatus) => {
    const statusConfig = {
      [ModuleStatus.ACTIVE]: { 
        label: "Active", 
        variant: "default" as const, 
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200"
      },
      [ModuleStatus.EXPIRED]: { 
        label: "Expired", 
        variant: "destructive" as const, 
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-200"
      },
      [ModuleStatus.TRIAL]: { 
        label: "Trial", 
        variant: "secondary" as const, 
        icon: Clock,
        className: "bg-blue-100 text-blue-800 border-blue-200"
      },
      [ModuleStatus.PENDING_ACTIVATION]: { 
        label: "Pending", 
        variant: "outline" as const, 
        icon: AlertCircle,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200"
      },
      [ModuleStatus.INACTIVE]: { 
        label: "Inactive", 
        variant: "secondary" as const, 
        icon: XCircle,
        className: "bg-gray-100 text-gray-800 border-gray-200"
      }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getModuleIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      Building,
      Calendar,
      Users,
      AlertTriangle,
      Vote,
      Package
    };
    
    return iconMap[iconName] || Package;
  };

  const handleModuleAccess = (module: WorkspaceModule) => {
    if (module.status === ModuleStatus.ACTIVE || module.status === ModuleStatus.TRIAL) {
      // Navigate to the module based on module title or ID
      const moduleRoutes: { [key: string]: string } = {
        // Core Modules
        'Entity Management': '/entity-management',
        'Meeting Management': '/meetings',
        'Claims Management': '/claims',
        'Work Order Management': '/work-orders',
        
        // Professional Modules
        'Service Request Management': '/service-requests',
        'Bid Management': '/bids',
        'Timeline Management': '/timeline',
        'Virtual Data Room': '/data-room',
        'E-Voting System': '/voting',
        'Document Management': '/documents',
        'Project Management': '/projects',
        'CRM Integration': '/crm',
        'Analytics Dashboard': '/analytics',
        'Compliance Management': '/compliance',
        'Risk Assessment': '/risk-assessment',
        'Quality Assurance': '/quality',
        'Audit Trail': '/audit',
        'Notification System': '/notifications',
        'API Management': '/api',
        'Custom Workflows': '/workflows',
        'Advanced Reporting': '/reports',
        'Data Export': '/export',
        'Integration Hub': '/integrations',
        'Mobile App': '/mobile',
        'White Label': '/white-label',
        'Multi-tenant': '/multi-tenant',
        'Advanced Security': '/security',
        'Backup & Recovery': '/backup'
      };
      
      const route = moduleRoutes[module.title];
      if (route) {
        navigate(route);
        toast({
          title: "Module Access",
          description: `Opening ${module.title}...`,
        });
      } else {
        // Fallback for modules not yet implemented
        toast({
          title: "Module Coming Soon",
          description: `${module.title} interface is being prepared. You'll be redirected once it's ready.`,
          variant: "default"
        });
      }
    } else {
      // Handle inactive modules
      const actionText = module.status === ModuleStatus.EXPIRED ? 'renew' : 'activate';
      toast({
        title: "Module Unavailable",
        description: `${module.title} is currently ${module.status.replace('_', ' ')}. Please ${actionText} your subscription.`,
        variant: "destructive"
      });
    }
  };

  const handleViewAllModules = () => {
    navigate('/subscription/browse');
  };

  const handleSubscribeToModule = (moduleId: string) => {
    navigate(`/subscription/browse?module=${moduleId}`);
  };

  const handleRenewModule = (moduleId: string) => {
    navigate(`/subscription/browse?module=${moduleId}&action=renew`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modules Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Total Modules</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalModules}</p>
                </div>
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Active</p>
                  <p className="text-xl font-bold text-green-600">{stats.activeModules}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Trial</p>
                  <p className="text-xl font-bold text-blue-600">{stats.trialModules}</p>
                </div>
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.pendingModules}</p>
                </div>
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Expired</p>
                  <p className="text-xl font-bold text-red-600">{stats.expiredModules}</p>
                </div>
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Inactive</p>
                  <p className="text-xl font-bold text-gray-600">{stats.inactiveModules}</p>
                </div>
                <XCircle className="h-6 w-6 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ModuleStatus | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={ModuleStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={ModuleStatus.TRIAL}>Trial</SelectItem>
                <SelectItem value={ModuleStatus.EXPIRED}>Expired</SelectItem>
                <SelectItem value={ModuleStatus.PENDING_ACTIVATION}>Pending</SelectItem>
                <SelectItem value={ModuleStatus.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ModuleCategory | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={ModuleCategory.CORE}>Core</SelectItem>
                <SelectItem value={ModuleCategory.PROFESSIONAL}>Professional</SelectItem>
                <SelectItem value={ModuleCategory.ENTERPRISE}>Enterprise</SelectItem>
                <SelectItem value={ModuleCategory.ADDON}>Add-on</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const IconComponent = getModuleIcon(module.icon);
          
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  {getStatusBadge(module.status)}
                  <Badge variant="outline" className="text-xs">
                    {module.category.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {module.subscriptionEndDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subscription End:</span>
                      <span className="font-medium">
                        {format(new Date(module.subscriptionEndDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">₹{module.price.toLocaleString()}/{module.billingCycle}</span>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleModuleAccess(module)}
                        disabled={!isAdmin && isTeamMember && !module.isActive}
                        className="flex-1"
                        variant={module.status === ModuleStatus.ACTIVE ? "default" : 
                                module.status === ModuleStatus.PENDING_ACTIVATION ? "secondary" : "outline"}
                      >
                        {module.status === ModuleStatus.ACTIVE ? (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Access
                          </>
                        ) : module.status === ModuleStatus.PENDING_ACTIVATION ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Pending Activation
                          </>
                        ) : module.status === ModuleStatus.TRIAL ? (
                          <>
                            <Clock className="h-4 w-4 mr-2" />
                            Trial Access
                          </>
                        ) : module.status === ModuleStatus.EXPIRED ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Renew
                          </>
                        ) : (
                          <>
                            <Loader2 className="h-4 w-4 mr-2" />
                            {module.status.replace('_', ' ').toLowerCase()}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View All Modules Button */}
      {isAdmin && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Explore More Modules</h3>
                <p className="text-gray-600">
                  Discover additional modules to enhance your workspace capabilities
                </p>
              </div>
              <Button onClick={handleViewAllModules} className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                View All Subscription Packages
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Member Notice */}
      {isTeamMember && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Team Member Access</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You can only access modules assigned to you by your organization's administrator. 
                  Contact your admin to request access to additional modules.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {modules.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Modules Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "No modules match your current filters."
                : "You haven't subscribed to any modules yet."}
            </p>
            {isAdmin && (
              <Button onClick={handleViewAllModules} variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Browse Available Modules
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyModules;

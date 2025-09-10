import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bell, 
  Search, 
  Filter, 
  Settings, 
  Archive, 
  Trash2, 
  MoreHorizontal,
  CheckCircle,
  Circle,
  AlertTriangle,
  Info,
  Clock,
  Shield,
  Activity,
  Calendar,
  Eye,
  EyeOff,
  Download,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types/auth";
import { notificationService } from "@/services/notificationService";
import { 
  Notification, 
  NotificationFilters, 
  NotificationStats,
  NotificationType, 
  NotificationPriority, 
  NotificationStatus 
} from "@/types/notification";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout userType={user?.userType === UserType.SERVICE_SEEKER ? 'service_seeker' : 'service_provider'}>
      <div className="container mx-auto p-6">
        <NotificationModule />
      </div>
    </DashboardLayout>
  );
};

const NotificationModule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!user?.role) return;
    
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(
        user.role,
        {
          ...filters,
          searchTerm: searchTerm || undefined,
          status: selectedTab === 'unread' ? [NotificationStatus.UNREAD] : 
                 selectedTab === 'read' ? [NotificationStatus.READ] :
                 selectedTab === 'archived' ? [NotificationStatus.ARCHIVED] : undefined
        },
        { page: currentPage, limit: 20 }
      );
      
      setNotifications(response.notifications);
      setStats(response.stats);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.role, filters, searchTerm, selectedTab, currentPage]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Sync date range inputs to filters
  useEffect(() => {
    if (!dateFrom && !dateTo) {
      setFilters(prev => ({ ...prev, dateRange: undefined }));
      return;
    }
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : new Date(0);
    const to = dateTo ? new Date(`${dateTo}T23:59:59`) : new Date();
    setFilters(prev => ({ ...prev, dateRange: { from, to } }));
  }, [dateFrom, dateTo]);

  // Handle notification actions
  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.role) return;
    
    try {
      await notificationService.markAsRead(notificationId, user.role);
      await loadNotifications();
      toast({
        title: "Success",
        description: "Notification marked as read"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsUnread = async (notificationId: string) => {
    if (!user?.role) return;
    
    try {
      await notificationService.markAsUnread(notificationId, user.role);
      await loadNotifications();
      toast({
        title: "Success",
        description: "Notification marked as unread"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as unread",
        variant: "destructive"
      });
    }
  };

  const handleArchive = async (notificationId: string) => {
    if (!user?.role) return;
    
    try {
      await notificationService.archiveNotification(notificationId, user.role);
      await loadNotifications();
      toast({
        title: "Success",
        description: "Notification archived"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive notification",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!user?.role) return;
    
    try {
      await notificationService.deleteNotification(notificationId, user.role);
      await loadNotifications();
      toast({
        title: "Success",
        description: "Notification deleted"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.role) return;
    
    try {
      const count = await notificationService.markAllAsRead(user.role);
      await loadNotifications();
      toast({
        title: "Success",
        description: `${count} notifications marked as read`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  };

  // Get notification type icon and color
  const getNotificationTypeInfo = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM:
        return { icon: Info, color: "bg-blue-100 text-blue-800" };
      case NotificationType.REMINDER:
        return { icon: Clock, color: "bg-yellow-100 text-yellow-800" };
      case NotificationType.ACTIVITY:
        return { icon: Activity, color: "bg-green-100 text-green-800" };
      case NotificationType.SECURITY:
        return { icon: Shield, color: "bg-red-100 text-red-800" };
      default:
        return { icon: Bell, color: "bg-gray-100 text-gray-800" };
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return "bg-red-500 text-white";
      case NotificationPriority.HIGH:
        return "bg-orange-500 text-white";
      case NotificationPriority.MEDIUM:
        return "bg-blue-500 text-white";
      case NotificationPriority.LOW:
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Manage your notifications and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {/* Preferences navigates to settings tab */}
          <Button
            variant="outline"
            onClick={() => navigate('/settings?tab=notifications')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Preferences
          </Button>
          <Button
            variant="outline"
            onClick={loadNotifications}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
                </div>
                <Circle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.todayCount}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.weekCount}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select
                value={filters.type?.[0] || "all"}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    type: value === "all" ? undefined : [value as NotificationType] 
                  }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={NotificationType.SYSTEM}>System</SelectItem>
                  <SelectItem value={NotificationType.REMINDER}>Reminder</SelectItem>
                  <SelectItem value={NotificationType.ACTIVITY}>Activity</SelectItem>
                  <SelectItem value={NotificationType.SECURITY}>Security</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.priority?.[0] || "all"}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    priority: value === "all" ? undefined : [value as NotificationPriority] 
                  }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value={NotificationPriority.URGENT}>Urgent</SelectItem>
                  <SelectItem value={NotificationPriority.HIGH}>High</SelectItem>
                  <SelectItem value={NotificationPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={NotificationPriority.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Date range filter */}
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-[150px]"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-[150px]"
                />
                {(dateFrom || dateTo) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setDateFrom(""); setDateTo(""); }}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {stats && stats.unread > 0 && (
                <Button
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({stats?.total || 0})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({stats?.unread || 0})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read ({(stats?.total || 0) - (stats?.unread || 0)})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-600">
                  {selectedTab === 'unread' ? "You're all caught up!" : 
                   selectedTab === 'archived' ? "No archived notifications" :
                   "No notifications match your current filters"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const typeInfo = getNotificationTypeInfo(notification.type);
                const TypeIcon = typeInfo.icon;
                
                return (
                  <Card 
                    key={notification.id}
                    className={`transition-all hover:shadow-md ${
                      notification.status === NotificationStatus.UNREAD ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${typeInfo.color}`}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {notification.status === NotificationStatus.UNREAD ? (
                                    <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Read
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleMarkAsUnread(notification.id)}>
                                      <Circle className="h-4 w-4 mr-2" />
                                      Mark as Unread
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => setSelectedNotification(notification)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleArchive(notification.id)}>
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(notification.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{format(notification.createdAt, 'MMM dd, yyyy HH:mm')}</span>
                              {notification.moduleId && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.moduleId}
                                </Badge>
                              )}
                            </div>
                            
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex gap-2">
                                {notification.actions.slice(0, 2).map((action) => (
                                  <Button
                                    key={action.id}
                                    size="sm"
                                    variant={action.primary ? "default" : "outline"}
                                    onClick={() => {
                                      if (action.url) {
                                        window.open(action.url, '_blank');
                                      }
                                    }}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {(() => {
                  const typeInfo = getNotificationTypeInfo(selectedNotification.type);
                  const TypeIcon = typeInfo.icon;
                  return <TypeIcon className="h-5 w-5" />;
                })()}
                {selectedNotification.title}
              </DialogTitle>
              <DialogDescription>
                {format(selectedNotification.createdAt, 'MMMM dd, yyyy at HH:mm')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getPriorityColor(selectedNotification.priority)}>
                  {selectedNotification.priority} Priority
                </Badge>
                <Badge variant="outline">
                  {selectedNotification.type}
                </Badge>
                <Badge variant="outline">
                  {selectedNotification.status}
                </Badge>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p>{selectedNotification.message}</p>
              </div>
              
              {selectedNotification.actions && selectedNotification.actions.length > 0 && (
                <div className="flex gap-2 pt-4 border-t">
                  {selectedNotification.actions.map((action) => (
                    <Button
                      key={action.id}
                      variant={action.primary ? "default" : "outline"}
                      onClick={() => {
                        if (action.url) {
                          window.open(action.url, '_blank');
                        }
                        setSelectedNotification(null);
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Notifications;

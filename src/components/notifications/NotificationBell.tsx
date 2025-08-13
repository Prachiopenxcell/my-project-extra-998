import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Circle, 
  CheckCircle, 
  Eye, 
  Settings,
  Activity,
  Clock,
  Shield,
  Info,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { notificationService } from "@/services/notificationService";
import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationStatus 
} from "@/types/notification";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const loadUnreadCount = useCallback(async () => {
    if (!user?.role) return;
    
    try {
      const count = await notificationService.getUnreadCount(user.role);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, [user?.role]);

  useEffect(() => {
    if (user?.role) {
      loadUnreadCount();
      // Set up polling for real-time updates
      const interval = setInterval(loadUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user?.role, loadUnreadCount]);

  const loadRecentNotifications = async () => {
    if (!user?.role || loading) return;
    
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(
        user.role,
        { status: [NotificationStatus.UNREAD] },
        { page: 1, limit: 5 }
      );
      setRecentNotifications(response.notifications);
    } catch (error) {
      console.error('Failed to load recent notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user?.role) return;
    
    try {
      await notificationService.markAsRead(notificationId, user.role);
      await loadUnreadCount();
      await loadRecentNotifications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (notification.status === NotificationStatus.UNREAD && user?.role) {
      await notificationService.markAsRead(notification.id, user.role);
      await loadUnreadCount();
    }

    // Navigate to action URL if available
    if (notification.actions && notification.actions.length > 0) {
      const primaryAction = notification.actions.find(a => a.primary) || notification.actions[0];
      if (primaryAction.url) {
        navigate(primaryAction.url);
        setIsOpen(false);
        return;
      }
    }

    // Default navigation to notifications page
    navigate('/notifications');
    setIsOpen(false);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM:
        return <Info className="h-4 w-4 text-blue-600" />;
      case NotificationType.REMINDER:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case NotificationType.ACTIVITY:
        return <Activity className="h-4 w-4 text-green-600" />;
      case NotificationType.SECURITY:
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return "text-red-600";
      case NotificationPriority.HIGH:
        return "text-orange-600";
      case NotificationPriority.MEDIUM:
        return "text-blue-600";
      case NotificationPriority.LOW:
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadRecentNotifications();
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              <Settings className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">All caught up!</p>
              <p className="text-sm text-gray-500">No new notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {recentNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {notification.status === NotificationStatus.UNREAD && (
                            <Circle className="h-2 w-2 fill-blue-600 text-blue-600" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            {notification.status === NotificationStatus.UNREAD ? (
                              <Circle className="h-3 w-3" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.summary || notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {format(notification.createdAt, 'MMM dd, HH:mm')}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {recentNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-blue-600 hover:text-blue-700"
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
              >
                View All Notifications
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

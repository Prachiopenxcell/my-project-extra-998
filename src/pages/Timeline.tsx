import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CalendarDays,
  Search,
  Download,
  Bell,
  Plus,
  Edit,
  Trash2,
  Star,
  FileText,
  BarChart3,
  Save,
  CheckCircle,
  Mail,
  Smartphone,
  MessageCircle,
  Monitor,
  Settings,
  RefreshCw,
  Users,
  X,
  ScrollText,
  ClipboardList,
  Cog,
  HardDrive,
  AlertCircle,
  Info,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface TimelineEvent {
  id: string;
  natureOfActivity: string;
  activity: string;
  significance: number;
  dueDate: string;
  actualDate?: string;
  status: "due_today" | "completed" | "due_this_week" | "upcoming" | "overdue";
  icon: string;
}

interface NotificationItem {
  id: string;
  type: "urgent" | "reminder" | "info" | "email";
  message: string;
  date: string;
  isRead: boolean;
}

const Timeline = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("management");
  const [setupOption, setSetupOption] = useState("law_act");
  const [selectedEntity, setSelectedEntity] = useState("acme_corporation");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);
  const [customActivity, setCustomActivity] = useState("");
  const [customNature, setCustomNature] = useState("cirp_filing");
  const [customSignificance, setCustomSignificance] = useState(5);
  const [customDueDate, setCustomDueDate] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const { toast } = useToast();

  // Mock timeline events data
  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      natureOfActivity: "CIRP Filing",
      activity: "Submit Resolution Plan",
      significance: 5,
      dueDate: "2025-08-15",
      status: "due_today",
      icon: "FileText"
    },
    {
      id: "2",
      natureOfActivity: "COC Meeting",
      activity: "First COC Meeting",
      significance: 4,
      dueDate: "2025-08-20",
      actualDate: "2025-08-18",
      status: "completed",
      icon: "Users"
    },
    {
      id: "3",
      natureOfActivity: "Claims Submission",
      activity: "Filing of Claims",
      significance: 3,
      dueDate: "2025-08-25",
      status: "due_this_week",
      icon: "BarChart3"
    }
  ];

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: NotificationItem[] = [
      {
        id: "1",
        type: "urgent",
        message: "URGENT: CIRP Resolution Plan submission due TODAY (15/08/2025)",
        date: "2025-08-15",
        isRead: false
      },
      {
        id: "2",
        type: "reminder",
        message: "Reminder: Claims submission due in 3 days (25/08/2025)",
        date: "2025-08-22",
        isRead: false
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "due_today":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium py-1">Due Today</Badge>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium py-1">Completed</Badge>
          </div>
        );
      case "due_this_week":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium py-1">Due This Week</Badge>
          </div>
        );
      case "upcoming":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium py-1">Upcoming</Badge>
          </div>
        );
      case "overdue":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium py-1">Overdue</Badge>
          </div>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const filteredEvents = timelineEvents.filter(event => {
    const matchesSearch = event.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.natureOfActivity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveCustomEvent = () => {
    if (!customActivity || !customDueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Event Created",
      description: "Custom timeline event has been created successfully.",
    });
    
    // Reset form
    setCustomActivity("");
    setCustomDueDate("");
    setCustomDescription("");
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText": return <FileText className="h-4 w-4 text-blue-500" />;
      case "Users": return <Users className="h-4 w-4 text-green-500" />;
      case "BarChart3": return <BarChart3 className="h-4 w-4 text-amber-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent": return <Bell className="h-4 w-4 text-red-500" />;
      case "reminder": return <Bell className="h-4 w-4 text-amber-500" />;
      case "info": return <Bell className="h-4 w-4 text-blue-500" />;
      case "email": return <Mail className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Timeline Management</h1>
            <p className="text-muted-foreground">Manage and track your timeline events and compliance requirements</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isCalendarSyncOpen} onOpenChange={setIsCalendarSyncOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Sync to Calendar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    📅 Sync Timeline to Google Calendar
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Entity:</Label>
                      <Select defaultValue="acme_corporation">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acme_corporation">Acme Corporation</SelectItem>
                          <SelectItem value="tech_solutions">Tech Solutions Ltd</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2" onClick={() => {
                      toast({
                        title: "Calendar Sync",
                        description: "Timeline events have been synced to Google Calendar.",
                      });
                      setIsCalendarSyncOpen(false);
                    }}>
                      <CalendarDays className="w-4 h-4" />
                      📅 Sync to Calendar
                    </Button>
                    <Button variant="outline" onClick={() => setIsCalendarSyncOpen(false)}>
                      <X className="w-4 h-4" />
                      ❌ Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="h-9" onClick={() => navigate('/create-timeline-event')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Timeline Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CalendarDays className="mr-2 h-4 w-4 text-red-500" />
                Due Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredEvents.filter(e => e.status === 'due_today').length}</div>
              <p className="text-xs text-muted-foreground">
                {filteredEvents.filter(e => e.status === 'due_today').length > 0 ? 
                  `Next: ${filteredEvents.find(e => e.status === 'due_today')?.activity.substring(0, 20)}...` : 
                  "No events due today"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Completed Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredEvents.filter(e => e.status === 'completed').length}</div>
              <p className="text-xs text-muted-foreground">
                {filteredEvents.filter(e => e.status === 'completed').length > 0 ? 
                  `Last: ${filteredEvents.find(e => e.status === 'completed')?.activity.substring(0, 20)}...` : 
                  "No completed events"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Bell className="mr-2 h-4 w-4 text-amber-500" />
                Due This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredEvents.filter(e => e.status === 'due_this_week').length}</div>
              <p className="text-xs text-muted-foreground">
                {filteredEvents.filter(e => e.status === 'due_this_week').length > 0 ? 
                  `${filteredEvents.find(e => e.status === 'due_this_week')?.activity.substring(0, 20)}...` : 
                  "No events due this week"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4 text-blue-500" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredEvents.filter(e => e.status === 'upcoming').length}</div>
              <p className="text-xs text-muted-foreground">
                {filteredEvents.filter(e => e.status === 'upcoming').length > 0 ? 
                  `Next: ${filteredEvents.find(e => e.status === 'upcoming')?.activity.substring(0, 20)}...` : 
                  "No upcoming events"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My Timeline Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">MY TIMELINE</h2>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search events..." 
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="management">Timeline Management</TabsTrigger>
            <TabsTrigger value="setup">Timeline Setup</TabsTrigger>
            <TabsTrigger value="custom">Custom Timeline</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Timeline Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Listing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search and Filters */}
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="🔍 Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="due_today">Due Today</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="due_this_week">Due This Week</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline Events Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>📋 Nature of Activity</TableHead>
                      <TableHead>📝 Activity</TableHead>
                      <TableHead>🌟 Significance</TableHead>
                      <TableHead>📅 Due Date</TableHead>
                      <TableHead>📅 Actual Date</TableHead>
                      <TableHead>📊 Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-2">
                            {getActivityIcon(event.icon)}
                            <span className="font-medium text-sm">{event.natureOfActivity}</span>
                          </div>
                        </td>
                        <TableCell>{event.activity}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {renderStars(event.significance)}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(event.dueDate), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          {event.actualDate ? format(new Date(event.actualDate), 'dd/MM/yyyy') : '--/--/----'}
                        </TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Choose Setup Option:</Label>
                  <RadioGroup value={setupOption} onValueChange={setSetupOption}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="law_act" id="law_act" />
                      <Label htmlFor="law_act" className="flex items-center gap-2">
                        <ScrollText className="w-4 h-4" />
                        Law/Act
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="activity" id="activity" />
                      <Label htmlFor="activity" className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Activity
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="flex items-center gap-2">
                        <Cog className="w-4 h-4" />
                        Custom Timeline
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {setupOption === "law_act" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Entity:</Label>
                      <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acme_corporation">Acme Corporation</SelectItem>
                          <SelectItem value="tech_solutions">Tech Solutions Ltd</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Select Process:</Label>
                      <Select defaultValue="cirp">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cirp">CIRP Process</SelectItem>
                          <SelectItem value="liquidation">Liquidation Process</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Button onClick={() => {
                  toast({
                    title: "Configuration Saved",
                    description: "Timeline configuration has been saved successfully.",
                  });
                }}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Timeline Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Timeline Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Activity Name *</Label>
                    <Input
                      value={customActivity}
                      onChange={(e) => setCustomActivity(e.target.value)}
                      placeholder="Enter activity name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Nature of Activity</Label>
                    <Select value={customNature} onValueChange={setCustomNature}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cirp_filing">CIRP Filing</SelectItem>
                        <SelectItem value="coc_meeting">COC Meeting</SelectItem>
                        <SelectItem value="claims_submission">Claims Submission</SelectItem>
                        <SelectItem value="custom_event">Custom Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Significance (Priority)</Label>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCustomSignificance(i + 1)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${i < customSignificance ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input
                      type="date"
                      value={customDueDate}
                      onChange={(e) => setCustomDueDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>

                <Button onClick={handleSaveCustomEvent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Timeline Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      notification.isRead ? "bg-muted/50" : "bg-background"
                    }`}
                  >
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm ${notification.isRead ? "text-muted-foreground" : "text-foreground"}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Smartphone className="w-4 h-4" />
                    SMS
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Monitor className="w-4 h-4" />
                    Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Timeline;

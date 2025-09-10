import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { 
  toCsv, download, toExcelHtml, openPrintablePdf, sortRows, applyDateFilter, visibleColumns, shuffle, generateICS,
  type ColumnKey, type TimelineExportRow
} from "@/utils/reportUtils";

// Workspace integration for access guards and data
import { workspaceService } from "@/services/workspaceService";
import { ModuleStatus, type WorkspaceModule, type WorkspaceEntity } from "@/types/workspace";

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
  const [selectedEntity, setSelectedEntity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [sortLatestOnTop, setSortLatestOnTop] = useState(true);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
  const defaultColumns: ColumnKey[] = ['natureOfActivity','activity','significance','dueDate','actualDate','status'];
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(defaultColumns);
  const [hiddenColumns, setHiddenColumns] = useState<Set<ColumnKey>>(new Set());
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState('all');
  // Workspace/module state
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);
  const [modules, setModules] = useState<WorkspaceModule[]>([]);
  const [entities, setEntities] = useState<WorkspaceEntity[]>([]);
  const [hasTimelineModule, setHasTimelineModule] = useState(false);
  const [hasEntityModule, setHasEntityModule] = useState(false);
  const [hasMeetingModule, setHasMeetingModule] = useState(false);
  const [hasEVotingModule, setHasEVotingModule] = useState(false);
  const minEntitiesRequired = 1; // Adjust as needed
  // CIRP setup dialog state
  const [processValue, setProcessValue] = useState("");
  const [isCirpDialogOpen, setIsCirpDialogOpen] = useState(false);
  const [cirpSettings, setCirpSettings] = useState({
    meetingIntervalDays: 30,
    noticePeriodDays: 5,
    eVotingEnabled: false,
    eVotingWindowDays: 3,
    eVotingVendor: "",
  });
  const [configSaved, setConfigSaved] = useState(false);
  
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

  // Load modules and entities for guards
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoadingWorkspace(true);
        const [modsRes, entsRes] = await Promise.all([
          workspaceService.getMyModules("current-user"),
          workspaceService.getMyEntities("current-user"),
        ]);
        if (!isMounted) return;
        setModules(modsRes.data);
        setEntities(entsRes.data);
      } catch (e) {
        // Non-fatal
      } finally {
        if (isMounted) setLoadingWorkspace(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Derive module subscriptions
  useEffect(() => {
    const isActive = (m?: WorkspaceModule) => !!m && (m.status === ModuleStatus.ACTIVE || m.status === ModuleStatus.TRIAL);
    const findModule = (id: string) => modules.find(m => m.id === id);
    setHasTimelineModule(isActive(findModule("timeline-management")));
    setHasEntityModule(isActive(findModule("entity-management")));
    setHasMeetingModule(isActive(findModule("meeting-management")));
    setHasEVotingModule(isActive(findModule("e-voting")));
  }, [modules]);

  // Auto-select first entity when available
  useEffect(() => {
    if (!selectedEntity && entities.length > 0) {
      setSelectedEntity(entities[0].id);
    }
  }, [entities, selectedEntity]);

  // Auto-populate CIRP settings if Meeting/E-Voting available
  useEffect(() => {
    setCirpSettings(prev => ({
      ...prev,
      meetingIntervalDays: hasMeetingModule ? 30 : prev.meetingIntervalDays,
      noticePeriodDays: hasMeetingModule ? 5 : prev.noticePeriodDays,
      eVotingEnabled: hasEVotingModule ? true : prev.eVotingEnabled,
      eVotingWindowDays: hasEVotingModule ? 3 : prev.eVotingWindowDays,
      eVotingVendor: hasEVotingModule ? "Platform E-Voting" : prev.eVotingVendor,
    }));
  }, [hasMeetingModule, hasEVotingModule]);

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

  const entitiesOptions = useMemo(() => (
    entities.map(e => ({ id: e.id, name: e.name }))
  ), [entities]);

  const validateCirp = () => {
    const { meetingIntervalDays, noticePeriodDays, eVotingEnabled, eVotingWindowDays } = cirpSettings;
    if (meetingIntervalDays < 30 || meetingIntervalDays > 90) return "Meeting interval must be between 30 and 90 days.";
    if (noticePeriodDays < 2 || noticePeriodDays > 24) return "Notice period must be between 2 and 24 days (recommended 5).";
    if (eVotingEnabled) {
      if (eVotingWindowDays < 2 || eVotingWindowDays > 24) return "E-voting window must be between 2 and 24 days (recommended 3-5).";
    }
    return null;
  };

  const persistConfig = () => {
    try {
      localStorage.setItem("timeline.setup", JSON.stringify({
        option: setupOption,
        entityId: selectedEntity,
        process: processValue,
        cirp: cirpSettings,
      }));
    } catch {
      // no-op: localStorage may be unavailable (private mode)
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
                     Sync Timeline to Google Calendar
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Entity:</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
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
                        <Button variant="outline" size="sm" onClick={() => navigate('/create-entity')}>
                          Create Entity
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Timeline:</Label>
                      <Select value={selectedTimeline} onValueChange={setSelectedTimeline}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="management">Timeline Management</SelectItem>
                          <SelectItem value="setup">Timeline Setup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {!isGoogleLoggedIn ? (
                      <Button variant="outline" className="w-full" onClick={() => {
                        setIsGoogleLoggedIn(true);
                        toast({ title: 'Google Connected', description: 'You are now logged in to Google.' });
                      }}>
                        Connect Google Account
                      </Button>
                    ) : (
                      <div className="text-sm text-green-700">Connected to Google</div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Start Date</Label>
                        <Input type="date" value={startDate ?? ''} onChange={(e) => setStartDate(e.target.value || undefined)} />
                      </div>
                      <div>
                        <Label className="text-xs">End Date</Label>
                        <Input type="date" value={endDate ?? ''} onChange={(e) => setEndDate(e.target.value || undefined)} />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 gap-2" onClick={() => {
                        const rows: TimelineExportRow[] = filteredEvents.map(e => ({
                          natureOfActivity: e.natureOfActivity,
                          activity: e.activity,
                          significance: e.significance,
                          dueDate: e.dueDate,
                          actualDate: e.actualDate,
                          status: e.status,
                        }));
                        const filtered = applyDateFilter(rows, startDate, endDate);
                        const ics = generateICS(filtered, 'Timeline Events');
                        download('timeline-events.ics', 'text/calendar;charset=utf-8', ics);
                        toast({ 
                          title: "Calendar Sync",
                          description: "ICS downloaded. Import into Google Calendar to complete sync.",
                        });
                        setIsCalendarSyncOpen(false);
                      }}>
                        <CalendarDays className="w-4 h-4" />
                         Sync to Calendar
                      </Button>
                      <Button variant="outline" onClick={() => setIsCalendarSyncOpen(false)}>
                        <X className="w-4 h-4" />
                         Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" className="h-9" onClick={() => setIsExportOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="h-9" onClick={() => navigate('/create-timeline-event')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event/Custom Timeline
            </Button>
          </div>
        </div>

        {/* Export Options Dialog */}
        <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
          <DialogContent className="sm:max-w-[640px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Report
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Start Date</Label>
                  <Input type="date" value={startDate ?? ''} onChange={(e) => setStartDate(e.target.value || undefined)} />
                </div>
                <div>
                  <Label className="text-sm">End Date</Label>
                  <Input type="date" value={endDate ?? ''} onChange={(e) => setEndDate(e.target.value || undefined)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Alignment</Label>
                  <Select value={align} onValueChange={(v) => setAlign(v as 'left' | 'center' | 'right')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Sort</Label>
                  <div className="mt-2 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <Checkbox checked={sortLatestOnTop} onCheckedChange={(v) => setSortLatestOnTop(Boolean(v))} />
                      Latest on top
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Columns</Label>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {columnOrder.map((c) => (
                      <label key={c} className="flex items-center justify-between text-sm px-2 py-1 rounded border">
                        <span className="capitalize">{c}</span>
                        <Checkbox
                          checked={!hiddenColumns.has(c)}
                          onCheckedChange={(v) => {
                            const copy = new Set(hiddenColumns);
                            if (v) copy.delete(c); else copy.add(c);
                            setHiddenColumns(copy);
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setColumnOrder(prev => shuffle(prev))}>Shuffle Columns</Button>
                <Button onClick={() => {
                  const rows: TimelineExportRow[] = filteredEvents.map(e => ({
                    natureOfActivity: e.natureOfActivity,
                    activity: e.activity,
                    significance: e.significance,
                    dueDate: e.dueDate,
                    actualDate: e.actualDate,
                    status: e.status,
                  }));
                  const filtered = applyDateFilter(rows, startDate, endDate);
                  const sorted = sortRows(filtered, sortLatestOnTop);
                  const cols = visibleColumns(columnOrder, hiddenColumns);
                  const html = toExcelHtml(sorted, cols, align);
                  download('timeline-report.xls', 'application/vnd.ms-excel', html);
                }}>Download Excel</Button>
                <Button variant="outline" onClick={() => {
                  const rows: TimelineExportRow[] = filteredEvents.map(e => ({
                    natureOfActivity: e.natureOfActivity,
                    activity: e.activity,
                    significance: e.significance,
                    dueDate: e.dueDate,
                    actualDate: e.actualDate,
                    status: e.status,
                  }));
                  const filtered = applyDateFilter(rows, startDate, endDate);
                  const sorted = sortRows(filtered, sortLatestOnTop);
                  const cols = visibleColumns(columnOrder, hiddenColumns);
                  openPrintablePdf(sorted, cols, align, 'Timeline Report');
                }}>Download PDF</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="management">Timeline Management</TabsTrigger>
            <TabsTrigger value="setup">Timeline Setup</TabsTrigger>
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
                      placeholder=" Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">From</Label>
                    <Input type="date" value={startDate ?? ''} onChange={(e) => setStartDate(e.target.value || undefined)} className="w-[150px]" />
                    <Label className="text-xs">To</Label>
                    <Input type="date" value={endDate ?? ''} onChange={(e) => setEndDate(e.target.value || undefined)} className="w-[150px]" />
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Checkbox checked={sortLatestOnTop} onCheckedChange={(v) => setSortLatestOnTop(Boolean(v))} />
                      Latest on top
                    </label>
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
                      {visibleColumns(columnOrder, hiddenColumns).map((c) => (
                        <TableHead key={c} className={align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : ''}>
                          {c === 'natureOfActivity' ? ' Nature of Activity' :
                           c === 'activity' ? ' Activity' :
                           c === 'significance' ? ' Significance' :
                           c === 'dueDate' ? ' Due Date' :
                           c === 'actualDate' ? ' Actual Date' :
                           ' Status'}
                        </TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortRows(
                      applyDateFilter(
                        filteredEvents.map(e => ({
                          natureOfActivity: e.natureOfActivity,
                          activity: e.activity,
                          significance: e.significance,
                          dueDate: e.dueDate,
                          actualDate: e.actualDate,
                          status: e.status,
                          _orig: e, // keep original event for actions
                        }) as unknown as TimelineExportRow),
                        startDate,
                        endDate
                      ),
                      sortLatestOnTop
                    ).map((row, idx) => (
                      <TableRow key={idx}>
                        {visibleColumns(columnOrder, hiddenColumns).map((c) => {
                          const cls = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : '';
                          switch (c) {
                            case 'natureOfActivity':
                              return (
                                <td key={c} className={`p-3 pl-4 ${cls}`}>
                                  <div className="flex items-center gap-2">
                                    {getActivityIcon('FileText')}
                                    <span className="font-medium text-sm">{row.natureOfActivity}</span>
                                  </div>
                                </td>
                              );
                            case 'activity':
                              return <TableCell key={c} className={cls}>{row.activity}</TableCell>;
                            case 'significance':
                              return (
                                <TableCell key={c} className={cls}>
                                  <div className="flex items-center gap-1 justify-center md:justify-start">
                                    {renderStars(row.significance)}
                                  </div>
                                </TableCell>
                              );
                            case 'dueDate':
                              return <TableCell key={c} className={cls}>{format(new Date(row.dueDate), 'dd/MM/yyyy')}</TableCell>;
                            case 'actualDate':
                              return <TableCell key={c} className={cls}>{row.actualDate ? format(new Date(row.actualDate), 'dd/MM/yyyy') : '--/--/----'}</TableCell>;
                            case 'status':
                              return <TableCell key={c} className={cls}>{getStatusBadge(row.status)}</TableCell>;
                          }
                        })}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              // Map timeline event to CreateTimelineEvent form state
                              const mapStatus = (s: string) => {
                                switch (s) {
                                  case 'due_this_week': return 'due_next_week';
                                  case 'upcoming': return 'forthcoming';
                                  case 'completed': return 'on_time';
                                  default: return s; // 'due_today', 'overdue'
                                }
                              };
                              const orig = (row as unknown as { _orig?: TimelineEvent })._orig ?? null;
                              navigate('/create-timeline-event', {
                                state: {
                                  mode: 'edit',
                                  eventId: orig?.id ?? idx,
                                  formData: {
                                    eventType: 'custom_event',
                                    activityName: orig?.activity ?? row.activity,
                                    natureOfActivity: orig?.natureOfActivity ?? row.natureOfActivity,
                                    description: '',
                                    significance: orig?.significance ?? row.significance,
                                    dueDate: orig?.dueDate ?? row.dueDate,
                                    actualDate: (orig?.actualDate ?? row.actualDate) || '',
                                    entity: selectedEntity,
                                    process: processValue || 'cirp',
                                    isRecurring: false,
                                    recurringType: 'monthly',
                                    recurringInterval: 1,
                                    endDate: '',
                                    timelyCompiled: mapStatus(orig?.status ?? row.status) === 'on_time',
                                    justificationReason: '',
                                    remarks: '',
                                    status: mapStatus(orig?.status ?? row.status),
                                    notificationEnabled: true,
                                    notificationDays: 7,
                                    notificationChannels: { email: true, sms: false, whatsapp: false, dashboard: true },
                                    assignedTo: '',
                                    priority: 'medium',
                                    tags: [],
                                    attachments: []
                                  }
                                }
                              });
                            }}>
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
                {/* Access guards */}
                {loadingWorkspace && (
                  <div className="text-sm text-muted-foreground">Loading your workspace info...</div>
                )}
                {!loadingWorkspace && (!hasTimelineModule || !hasEntityModule) && (
                  <div className="p-4 border rounded bg-amber-50 text-amber-900 space-y-3">
                    {!hasTimelineModule && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <div>
                          <div className="font-medium">Timeline module not active</div>
                          <div className="text-sm">Please subscribe to the Timeline Management module to use setup.</div>
                        </div>
                      </div>
                    )}
                    {!hasEntityModule && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <div>
                          <div className="font-medium">Entity module not active</div>
                          <div className="text-sm">Please activate My Entity module to manage entities.</div>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => navigate('/workspace')}>Go to My Workspace</Button>
                    </div>
                  </div>
                )}

                {!loadingWorkspace && hasTimelineModule && hasEntityModule && entities.length < minEntitiesRequired && (
                  <div className="p-4 border rounded bg-blue-50 text-blue-900 space-y-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5" />
                      <div>
                        <div className="font-medium">You need at least {minEntitiesRequired} entity</div>
                        <div className="text-sm">Create an entity before setting up timelines.</div>
                      </div>
                    </div>
                    <div>
                      <Button size="sm" onClick={() => navigate('/workspace')}>Create Entity</Button>
                    </div>
                  </div>
                )}

                {/* Setup form */}
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

                {setupOption === "law_act" && hasTimelineModule && hasEntityModule && entities.length >= minEntitiesRequired && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Entity:</Label>
                      <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {entitiesOptions.map(e => (
                            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Select Process:</Label>
                      <Select value={processValue} onValueChange={(v) => {
                        setProcessValue(v);
                        if (v === 'cirp') setIsCirpDialogOpen(true);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a process" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cirp">CIRP Process</SelectItem>
                          <SelectItem value="liquidation">Liquidation Process</SelectItem>
                        </SelectContent>
                      </Select>
                      {processValue === 'cirp' && (
                        <div className="pt-2">
                          <Button variant="outline" size="sm" onClick={() => setIsCirpDialogOpen(true)}>
                            <Clock className="w-4 h-4 mr-2" /> Configure CIRP Settings
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button onClick={() => {
                  const err = validateCirp();
                  if (err) {
                    toast({ title: 'Validation Error', description: err, variant: 'destructive' });
                    return;
                  }
                  persistConfig();
                  setConfigSaved(true);
                  toast({
                    title: "Configuration Saved",
                    description: "Timeline configuration has been saved successfully.",
                  });
                }}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>

                {configSaved && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/create-timeline-event')}>Add Custom Events</Button>
                    <Button variant="outline" onClick={() => setActiveTab('management')}>Go to Timeline Summary</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CIRP Setup Dialog */}
          <Dialog open={isCirpDialogOpen} onOpenChange={setIsCirpDialogOpen}>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> CIRP Process Settings
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                {hasMeetingModule ? (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-2 rounded">
                    Meeting module active. Defaults auto-filled for meeting interval (30 days) and notice (5 days).
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Configure meeting cadence and notice period.</div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Meeting Interval (days)</Label>
                    <Input type="number" min={30} max={90} value={cirpSettings.meetingIntervalDays}
                      onChange={(e) => setCirpSettings(s => ({...s, meetingIntervalDays: Number(e.target.value)}))} />
                    <div className="text-xs text-muted-foreground mt-1">Allowed: 30 - 90</div>
                  </div>
                  <div>
                    <Label className="text-sm">Notice Period (days)</Label>
                    <Input type="number" min={2} max={24} value={cirpSettings.noticePeriodDays}
                      onChange={(e) => setCirpSettings(s => ({...s, noticePeriodDays: Number(e.target.value)}))} />
                    <div className="text-xs text-muted-foreground mt-1">Allowed: 2 - 24 (recommended 5)</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="evote" checked={cirpSettings.eVotingEnabled}
                      onCheckedChange={(v) => setCirpSettings(s => ({...s, eVotingEnabled: Boolean(v)}))} />
                    <Label htmlFor="evote">Enable E-Voting</Label>
                  </div>
                  {cirpSettings.eVotingEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">E-Voting Window (days)</Label>
                        <Input type="number" min={2} max={24} value={cirpSettings.eVotingWindowDays}
                          onChange={(e) => setCirpSettings(s => ({...s, eVotingWindowDays: Number(e.target.value)}))} />
                        <div className="text-xs text-muted-foreground mt-1">Allowed: 2 - 24</div>
                      </div>
                      <div>
                        <Label className="text-sm">E-Voting Provider</Label>
                        <Input placeholder="e.g., NSDL / CDSL / Platform" value={cirpSettings.eVotingVendor}
                          onChange={(e) => setCirpSettings(s => ({...s, eVotingVendor: e.target.value}))} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => {
                    const err = validateCirp();
                    if (err) {
                      toast({ title: 'Validation Error', description: err, variant: 'destructive' });
                      return;
                    }
                    setIsCirpDialogOpen(false);
                    toast({ title: 'CIRP Settings Saved' });
                  }}>Save</Button>
                  <Button variant="outline" onClick={() => setIsCirpDialogOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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

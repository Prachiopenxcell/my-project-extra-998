import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Users, 
  Pencil, 
  Eye, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText, 
  Building, 
  CheckCircle, 
  Clock3, 
  Video, 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Bell,
  CalendarDays,
  CalendarClock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { meetingsService } from "@/services/meetingsService";
import { Meeting, MeetingStats, MeetingActivity, MeetingStatus, MeetingType } from "@/types/meetings";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";


const Meetings = () => {
  return (
    <DashboardLayout userType="service_provider">
      <MeetingsModule />
    </DashboardLayout>
  );
};

interface MeetingAction {
  label: string;
  icon: React.ReactNode;
  onClick: (id: string) => void;
}

const MeetingsModule = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [meetingStats, setMeetingStats] = useState<MeetingStats>({ upcoming: 0, inProgress: 0, completed: 0, draft: 0 });
  const [activities, setActivities] = useState<MeetingActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("latest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Fetch meetings data
  // Function to filter meetings based on active tab, type, status, and search query
  const filterMeetings = useCallback((allMeetings: Meeting[], tab = activeTab, type = typeFilter, status = statusFilter, query = searchQuery) => {
    if (!allMeetings) return;
    
    let filtered = [...allMeetings];
    
    // Filter by tab (meeting status)
    switch (tab) {
      case "upcoming":
        filtered = filtered.filter(meeting => meeting.status === "upcoming");
        break;
      case "inProgress":
        filtered = filtered.filter(meeting => meeting.status === "in-progress");
        break;
      case "completed":
        filtered = filtered.filter(meeting => meeting.status === "completed");
        break;
      case "drafts":
        filtered = filtered.filter(meeting => meeting.status === "draft");
        break;
    }
    
    // Filter by meeting type
    if (type !== "all") {
      filtered = filtered.filter(meeting => meeting.type === type);
    }
    
    // Filter by meeting status (if different from tab)
    if (status !== "all") {
      const statusMap: Record<string, MeetingStatus> = {
        "upcoming": "upcoming",
        "inProgress": "in-progress",
        "completed": "completed",
        "draft": "draft"
      };
      filtered = filtered.filter(meeting => meeting.status === statusMap[status]);
    }
    
    // Filter by search query
    if (query.trim() !== "") {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(meeting => 
        meeting.title.toLowerCase().includes(lowercaseQuery) ||
        meeting.entity.name.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Sort meetings
    switch (sortOrder) {
      case "latest":
        filtered.sort((a, b) => new Date(b.startDate || new Date()).getTime() - new Date(a.startDate || new Date()).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.startDate || new Date()).getTime() - new Date(b.startDate || new Date()).getTime());
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    setFilteredMeetings(filtered);
  }, [activeTab, typeFilter, statusFilter, searchQuery, sortOrder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allMeetings, stats, recentActivities] = await Promise.all([
          meetingsService.getAllMeetings(),
          meetingsService.getMeetingStats(),
          meetingsService.getRecentActivities()
        ]);
        
        setMeetings(allMeetings);
        setMeetingStats(stats);
        setActivities(recentActivities);
        filterMeetings(allMeetings);
      } catch (error) {
        console.error("Error fetching meetings data:", error);
        toast({
          title: "Error",
          description: "Failed to load meetings data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterMeetings]);

  useEffect(() => {
    filterMeetings(meetings);
  }, [meetings, filterMeetings]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Navigate to create meeting page
  const handleCreateMeeting = () => {
    navigate("/create-meeting");
  };
  
  // Navigate to live meeting
  const handleJoinMeeting = (meetingId: string) => {
    navigate(`/live-meeting/${meetingId}`);
  };
  
  // Navigate to edit meeting
  const handleEditMeeting = (meetingId: string) => {
    navigate(`/edit-meeting/${meetingId}`);
  };
  
  // Get meeting actions based on status
  const getMeetingActions = (meeting: Meeting): MeetingAction[] => {
    switch (meeting.status) {
      case "upcoming":
        return [
          { label: "View", icon: <Eye className="h-4 w-4" />, onClick: (id: string) => navigate(`/meetings/${id}`) },
          { label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: (id: string) => handleEditMeeting(id) },
          { label: "Cancel", icon: <Trash2 className="h-4 w-4" />, onClick: (id: string) => handleCancelMeeting(id) }
        ];
      case "in-progress":
        return [
          { label: "Join", icon: <Video className="h-4 w-4" />, onClick: (id: string) => handleJoinMeeting(id) },
          { label: "View", icon: <Eye className="h-4 w-4" />, onClick: (id: string) => navigate(`/meetings/${id}`) }
        ];
      case "completed":
        return [
          { label: "View", icon: <FileText className="h-4 w-4" />, onClick: (id: string) => navigate(`/meetings/${id}`) },
          { label: "Recording", icon: <Video className="h-4 w-4" />, onClick: (id: string) => alert("Viewing recording...") }
        ];
      case "draft":
        return [
          { label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: (id: string) => handleEditMeeting(id) },
          { label: "Publish", icon: <CheckCircle className="h-4 w-4" />, onClick: (id: string) => handlePublishMeeting(id) },
          { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: (id: string) => handleDeleteMeeting(id) }
        ];
      default:
        return [
          { label: "View", icon: <Eye className="h-4 w-4" />, onClick: (id: string) => navigate(`/meetings/${id}`) }
        ];
    }
  };
  
  // Handle cancel meeting
  const handleCancelMeeting = (meetingId: string) => {
    // In a real app, this would call an API to cancel the meeting
    toast({
      title: "Meeting Cancelled",
      description: `Meeting ID ${meetingId} has been cancelled.`,
    });
  };
  
  // Handle publish meeting
  const handlePublishMeeting = (meetingId: string) => {
    // In a real app, this would call an API to publish the draft meeting
    toast({
      title: "Meeting Published",
      description: `Meeting ID ${meetingId} has been published.`,
    });
  };
  
  // Handle delete meeting
  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await meetingsService.deleteMeeting(meetingId);
      
      // Refresh meetings data
      const [allMeetings, stats] = await Promise.all([
        meetingsService.getAllMeetings(),
        meetingsService.getMeetingStats()
      ]);
      
      setMeetings(allMeetings);
      setMeetingStats(stats);
      
      toast({
        title: "Meeting Deleted",
        description: "The meeting has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast({
        title: "Error",
        description: "Failed to delete meeting. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Format meeting date and time
  const formatMeetingDateTime = (date: Date) => {
    return format(new Date(date), "dd MMM yyyy, HH:mm");
  };
  
  // Format activity time
  const formatActivityTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Get activity icon based on action
  const getActivityIcon = (action: string) => {
    if (action.includes("created")) return <Pencil className="h-4 w-4 text-primary" />;
    if (action.includes("started")) return <Video className="h-4 w-4 text-green-500" />;
    if (action.includes("uploaded")) return <FileText className="h-4 w-4 text-blue-500" />;
    if (action.includes("added")) return <Plus className="h-4 w-4 text-amber-500" />;
    if (action.includes("updated")) return <Clock3 className="h-4 w-4 text-violet-500" />;
    return <Bell className="h-4 w-4 text-gray-500" />;
  };
  
  // Get status badge
  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
      case "upcoming":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium py-1">Upcoming</Badge>
          </div>
        );
      case "in-progress":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium py-1">In Progress</Badge>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 font-medium py-1">Completed</Badge>
          </div>
        );
      case "draft":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium py-1">Draft</Badge>
          </div>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get meeting type display
  const getMeetingTypeDisplay = (type: MeetingType) => {
    switch (type) {
      case "board": return "BM";
      case "general": return "AGM";
      case "special": return "EGM";
      case "committee": return "COM";
      case "other": return "OTH";
      default: return String(type).toUpperCase().substring(0, 3);
    }
  };
  
  // Get meeting type icon
  const getMeetingTypeIcon = (type: MeetingType) => {
    switch (type) {
      case "board": return <Users className="h-3.5 w-3.5 text-primary" />;
      case "general": return <Building className="h-3.5 w-3.5 text-primary" />;
      case "special": return <Bell className="h-3.5 w-3.5 text-primary" />;
      case "committee": return <Users className="h-3.5 w-3.5 text-primary" />;
      case "other": return <FileText className="h-3.5 w-3.5 text-primary" />;
      default: return <FileText className="h-3.5 w-3.5 text-primary" />;
    }
  };
  
  // Get user role in meeting
  const getUserRole = (meeting: Meeting) => {
    // In a real app, this would determine the current user's role in the meeting
    // For now, we'll return a placeholder based on meeting ID
    const roles = ["Chairperson", "Secretary", "Participant", "Observer", "Creator"];
    return roles[parseInt(meeting.id) % roles.length];
  };
  
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meetings</h1>
          <p className="text-muted-foreground">Manage and schedule your meetings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <CalendarDays className="mr-2 h-4 w-4" />
            This Month
          </Button>
          <Button size="sm" className="h-9" onClick={() => navigate('/create-meeting')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Meeting
          </Button>
        </div>
      </div>

      {/* Meeting Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 text-primary" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{meetingStats.upcoming}</div>
                <p className="text-xs text-muted-foreground">
                  {meetings.filter(m => m.status === "upcoming").length > 0 ? 
                    `Next: ${meetings.find(m => m.status === "upcoming")?.title.substring(0, 20)}${meetings.find(m => m.status === "upcoming")?.title.length > 20 ? '...' : ''}` : 
                    "No upcoming meetings"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CalendarClock className="mr-2 h-4 w-4 text-amber-500" />
              In Progress Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{meetingStats.inProgress}</div>
                <p className="text-xs text-muted-foreground">
                  {meetings.filter(m => m.status === "in-progress").length > 0 ? 
                    `${meetings.find(m => m.status === "in-progress")?.title.substring(0, 20)}${meetings.find(m => m.status === "in-progress")?.title.length > 20 ? '...' : ''}` : 
                    "No meetings in progress"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Completed Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{meetingStats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {meetings.filter(m => m.status === "completed").length > 0 ? 
                    `Last: ${meetings.find(m => m.status === "completed")?.title.substring(0, 20)}${meetings.find(m => m.status === "completed")?.title.length > 20 ? '...' : ''}` : 
                    "No completed meetings"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              Draft Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{meetingStats.draft}</div>
                <p className="text-xs text-muted-foreground">
                  {meetings.filter(m => m.status === "draft").length > 0 ? 
                    `Last edited: ${meetings.find(m => m.status === "draft")?.title.substring(0, 20)}${meetings.find(m => m.status === "draft")?.title.length > 20 ? '...' : ''}` : 
                    "No draft meetings"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Meetings Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">MY MEETINGS</h2>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search meetings..." 
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">Filter:</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="board">BM</SelectItem>
                    <SelectItem value="general">AGM</SelectItem>
                    <SelectItem value="special">EGM</SelectItem>
                    <SelectItem value="committee">COM</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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

          <TabsContent value="upcoming" className="mt-0">
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 pl-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Meeting Title</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date/Time</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">My Role</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </td>
                    </tr>
                  ) : filteredMeetings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No upcoming meetings found
                      </td>
                    </tr>
                  ) : (
                    filteredMeetings.map((meeting) => (
                      <tr key={meeting.id} className="border-b hover:bg-muted/50 transition-colors duration-200">
                        <td className="p-3 pl-4">
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            {meeting.location === "virtual" ? 
                              <span className="flex items-center"><Video className="h-3 w-3 mr-1" /> Virtual</span> : 
                              meeting.location === "physical" ? 
                              <span className="flex items-center"><Building className="h-3 w-3 mr-1" /> Physical</span> : 
                              <span className="flex items-center"><Building className="h-3 w-3 mr-1" /> Hybrid</span>
                            } | 
                            <span className="flex items-center"><Users className="h-3 w-3 mr-1" /> {meeting.participants.length} participants</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            {formatMeetingDateTime(meeting.startDate)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {getMeetingTypeIcon(meeting.type)}
                            </div>
                            <span className="text-xs font-medium">{getMeetingTypeDisplay(meeting.type)}</span>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(meeting.status)}</td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <Users className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            {getUserRole(meeting)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {getMeetingActions(meeting).map((action, index) => (
                              <Button 
                                key={index} 
                                size="sm"
                                variant="ghost"
                                className="flex items-center gap-1 p-2 hover:bg-muted transition-colors"
                                onClick={() => action.onClick && action.onClick(meeting.id)}
                                title={action.label}
                              >
                                {action.icon}
                                <span className="sr-only">{action.label}</span>
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="inProgress" className="mt-0">
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 pl-4 text-xs uppercase text-muted-foreground font-medium tracking-wider">Meeting Title</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Date/Time</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Type</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Status</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">My Role</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </td>
                    </tr>
                  ) : filteredMeetings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No meetings in progress found
                      </td>
                    </tr>
                  ) : (
                    filteredMeetings.map((meeting) => (
                      <tr key={meeting.id} className="border-b hover:bg-muted/50 transition-colors duration-200">
                        <td className="p-3 pl-4">
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            {meeting.location === "virtual" ? 
                              <span className="flex items-center"><Video className="h-3 w-3 mr-1" /> Virtual</span> : 
                              meeting.location === "physical" ? 
                              <span className="flex items-center"><Building className="h-3 w-3 mr-1" /> Physical</span> : 
                              <span className="flex items-center"><Building className="h-3 w-3 mr-1" /> Hybrid</span>
                            } | 
                            <span className="flex items-center"><Users className="h-3 w-3 mr-1" /> {meeting.participants.length} participants</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            {formatMeetingDateTime(meeting.startDate)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {getMeetingTypeIcon(meeting.type)}
                            </div>
                            <span className="text-xs font-medium">{getMeetingTypeDisplay(meeting.type)}</span>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(meeting.status)}</td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <Users className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            {getUserRole(meeting)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {getMeetingActions(meeting).map((action, index) => (
                              <Button 
                                key={index} 
                                size="sm"
                                variant="ghost"
                                className="flex items-center gap-1 p-2 hover:bg-muted transition-colors"
                                onClick={() => action.onClick && action.onClick(meeting.id)}
                                title={action.label}
                              >
                                {action.icon}
                                <span className="sr-only">{action.label}</span>
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 pl-4 text-xs uppercase text-muted-foreground font-medium tracking-wider">Meeting Title</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Date/Time</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Type</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Status</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">My Role</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </td>
                    </tr>
                  ) : filteredMeetings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No completed meetings found
                      </td>
                    </tr>
                  ) : (
                    filteredMeetings.map((meeting) => (
                      <tr key={meeting.id} className="border-b hover:bg-muted/50 transition-colors duration-200">
                        <td className="p-3 pl-4">
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            {meeting.location === "virtual" ? 
                              <span className="flex items-center"><Video className="h-3 w-3 mr-1" /> Virtual</span> : 
                              meeting.location === "physical" ? 
                              <span className="flex items-center"><Building className="h-3 w-3 mr-1" /> Physical</span> : 
                              <span className="flex items-center"><Building className="h-3 w-3 mr-1" /> Hybrid</span>
                            } | 
                            <span className="flex items-center"><Users className="h-3 w-3 mr-1" /> {meeting.participants.length} participants</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            {formatMeetingDateTime(meeting.startDate)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {getMeetingTypeIcon(meeting.type)}
                            </div>
                            <span className="text-xs font-medium">{getMeetingTypeDisplay(meeting.type)}</span>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(meeting.status)}</td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <Users className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            {getUserRole(meeting)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {getMeetingActions(meeting).map((action, index) => (
                              <Button 
                                key={index} 
                                size="sm"
                                variant="ghost"
                                className="flex items-center gap-1 p-2 hover:bg-muted transition-colors"
                                onClick={() => action.onClick && action.onClick(meeting.id)}
                                title={action.label}
                              >
                                {action.icon}
                                <span className="sr-only">{action.label}</span>
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="drafts" className="mt-0">
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 pl-4 text-xs uppercase text-muted-foreground font-medium tracking-wider">Meeting Title</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Date/Time</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Type</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Status</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">My Role</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </td>
                    </tr>
                  ) : filteredMeetings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No draft meetings found
                      </td>
                    </tr>
                  ) : (
                    filteredMeetings.map((meeting) => (
                      <tr key={meeting.id} className="border-b hover:bg-muted/50 transition-colors duration-200">
                        <td className="p-3 pl-4">
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            {meeting.location === "virtual" ? 
                              <span className="flex items-center"><Video className="h-3 w-3 mr-1" /> Virtual</span> : 
                              meeting.location === "physical" ? 
                              <span className="flex items-center"><Building className="h-3 w-3 mr-1" /> Physical</span> : 
                              <span className="flex items-center"><Building className="h-3 w-3 mr-1" /> Hybrid</span>
                            } | 
                            <span className="flex items-center"><Users className="h-3 w-3 mr-1" /> {meeting.participants.length} participants</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            {meeting.startDate ? formatMeetingDateTime(meeting.startDate) : "Not Scheduled"}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {getMeetingTypeIcon(meeting.type)}
                            </div>
                            <span className="text-xs font-medium">{getMeetingTypeDisplay(meeting.type)}</span>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(meeting.status)}</td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <Users className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            {getUserRole(meeting)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {getMeetingActions(meeting).map((action, index) => (
                              <Button 
                                key={index} 
                                size="sm"
                                variant="ghost"
                                className="flex items-center gap-1 p-2 hover:bg-muted transition-colors"
                                onClick={() => action.onClick && action.onClick(meeting.id)}
                                title={action.label}
                              >
                                {action.icon}
                                <span className="sr-only">{action.label}</span>
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card onClick={() => navigate('/create-meeting')} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Pencil className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium">Create New Meeting</h3>
                <p className="text-sm text-muted-foreground mt-2">Start fresh meeting setup</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-8 w-8 mb-2 text-blue-500" />
                <h3 className="font-medium">Browse Meeting Templates</h3>
                <p className="text-sm text-muted-foreground mt-2">Use predefined meeting formats</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Users className="h-8 w-8 mb-2 text-amber-500" />
                <h3 className="font-medium">Manage Participants</h3>
                <p className="text-sm text-muted-foreground mt-2">Import/export participant list</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <CalendarDays className="h-8 w-8 mb-2 text-green-500" />
                <h3 className="font-medium">Meeting Analytics</h3>
                <p className="text-sm text-muted-foreground mt-2">View reports and insights</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Meeting Activity */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Meeting Activity</h2>
        <ul className="space-y-3">
          {loading ? (
            <>
              <li className="flex items-start">
                <span className="mr-2 text-xl"><Skeleton className="h-6 w-6" /></span>
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl"><Skeleton className="h-6 w-6" /></span>
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </li>
            </>
          ) : activities.length === 0 ? (
            <li className="text-center text-muted-foreground py-4">
              No recent activity
            </li>
          ) : (
            activities.map((activity, index) => (
              <li key={index} className="flex items-start p-2 hover:bg-slate-50 rounded-md transition-colors">
                <div className="mr-3 mt-0.5 bg-slate-100 p-2 rounded-md">{getActivityIcon(activity.action)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{formatActivityTime(activity.timestamp)}</p>
                </div>
              </li>
            ))
          )}  
        </ul>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2 text-sm font-medium">Page 1 of 3</span>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-16 h-8">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
      </div>
    </div>
  );
};

export default Meetings;

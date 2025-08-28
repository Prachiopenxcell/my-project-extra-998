import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Loader2, 
  ArrowLeft, 
  Edit, 
  Download, 
  FileText, 
  Users, 
  Building, 
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  Square,
  Share2,
  Copy,
  ExternalLink,
  Paperclip,
  MessageSquare,
  UserCheck,
  Crown,
  Shield,
  Eye,
  CalendarDays,
  Timer,
  Globe
} from "lucide-react";
import { meetingsService } from "@/services/meetingsService";
import { useToast } from "@/components/ui/use-toast";
import { Meeting, Participant, Document, AgendaItem } from "@/types/meetings";
import { format, formatDuration, intervalToDuration } from "date-fns";

const MeetingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await meetingsService.getMeetingById(id);
        setMeeting(data);
      } catch (error) {
        console.error('Error fetching meeting:', error);
        toast({
          title: "Error",
          description: "Failed to load meeting details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!meeting) return;
    
    try {
      setIsDeleting(true);
      await meetingsService.deleteMeeting(meeting.id);
      toast({
        title: "Meeting Deleted",
        description: "The meeting has been successfully deleted.",
      });
      navigate("/meetings");
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast({
        title: "Error",
        description: "Failed to delete meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleJoinMeeting = async () => {
    if (!meeting) return;
    
    try {
      setIsJoining(true);
      // Simulate joining meeting
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate(`/live-meeting/${meeting.id}`);
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast({
        title: "Error",
        description: "Failed to join meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleExport = () => {
    if (!meeting) return;
    
    setIsExporting(true);
    setTimeout(() => {
      const fileName = `${meeting.title.replace(/\s+/g, '_')}_details.json`;
      const dataStr = JSON.stringify(meeting, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', fileName);
      linkElement.click();
      
      setIsExporting(false);
      toast({
        title: "Export Complete",
        description: `Meeting details exported as ${fileName}`,
      });
    }, 1000);
  };

  const copyMeetingLink = () => {
    const meetingLink = `${window.location.origin}/meetings/${meeting?.id}`;
    navigator.clipboard.writeText(meetingLink);
    toast({
      title: "Link Copied",
      description: "Meeting link has been copied to clipboard.",
    });
  };

  const handleReschedule = async () => {
    if (!meeting) return;

    // Simple prompt for new date-time (ISO or parseable format)
    const input = window.prompt(
      "Enter new start date & time (e.g., 2025-08-25 15:30 or ISO)",
      meeting.startDate ? new Date(meeting.startDate).toISOString().slice(0, 16).replace('T', ' ') : ''
    );
    if (!input) return;

    const parsed = new Date(input.replace(' ', 'T'));
    if (isNaN(parsed.getTime())) {
      toast({
        title: "Invalid date",
        description: "Please enter a valid date/time.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (meeting.status === 'concluded') {
        // Clone into a new upcoming meeting
        const newMeeting = await meetingsService.createMeeting({
          title: meeting.title,
          type: meeting.type,
          status: 'upcoming',
          entity: meeting.entity,
          startDate: parsed,
          duration: meeting.duration,
          location: meeting.location,
          isVirtual: meeting.isVirtual,
          virtualMeetingLink: meeting.virtualMeetingLink,
          virtualMeetingId: meeting.virtualMeetingId,
          virtualMeetingPassword: meeting.virtualMeetingPassword,
          description: meeting.description,
          participants: meeting.participants ? [...meeting.participants] : [],
          agenda: (meeting.agenda || []).map((a) => ({ ...a, status: 'pending', notes: undefined })),
          documents: meeting.documents ? [...meeting.documents] : [],
          resolutions: meeting.resolutions ? [...meeting.resolutions] : undefined,
          officeBearers: meeting.officeBearers,
          createdBy: meeting.createdBy,
        });

        toast({
          title: "Meeting Rescheduled",
          description: "A new meeting was created with the selected date/time.",
        });
        navigate(`/meetings/${newMeeting.id}`);
      } else {
        // Update the same meeting
        const updated = await meetingsService.updateMeeting(meeting.id, {
          startDate: parsed,
          status: 'upcoming',
          endDate: undefined,
        });
        if (updated) setMeeting(updated);
        toast({
          title: "Meeting Rescheduled",
          description: "The meeting date/time has been updated.",
        });
      }
    } catch (error) {
      console.error('Error rescheduling meeting:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Upcoming
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
            <Play className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "concluded":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluded
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
            <Edit className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getParticipantRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "chairperson":
        return <Crown className="w-4 h-4 text-amber-500" />;
      case "secretary":
        return <Shield className="w-4 h-4 text-blue-500" />;
      case "director":
        return <UserCheck className="w-4 h-4 text-purple-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!meeting) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Meeting Not Found</h1>
            <p className="text-muted-foreground mb-4">The meeting you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/meetings")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Meetings
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/meetings")}
              className="p-0 h-auto font-normal hover:text-primary"
            >
              Meetings
            </Button>
            <span>/</span>
            <span className="font-medium text-foreground">Meeting Details</span>
          </div>
          
          {/* Title and Actions */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
                {getStatusBadge(meeting.status)}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>{meeting.entity.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>{meeting.startDate ? format(new Date(meeting.startDate), "PPP") : "Not scheduled"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  <span>{meeting.startDate ? format(new Date(meeting.startDate), "p") : "No time set"}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {meeting.status === "in-progress" && (
                <Button onClick={handleJoinMeeting} disabled={isJoining} className="bg-green-600 hover:bg-green-700">
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" /> Join Meeting
                    </>
                  )}
                </Button>
              )}
              
              {meeting.status !== 'concluded' && (
                <Button variant="outline" onClick={() => navigate(`/edit-meeting/${id}`)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Meeting
                </Button>
              )}
              
              <Button variant="outline" onClick={copyMeetingLink}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>

              {(meeting.status === 'upcoming' || meeting.status === 'draft') && (
                <Button variant="outline" onClick={handleReschedule}>
                  <Calendar className="mr-2 h-4 w-4" /> Reschedule
                </Button>
              )}
              
              <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Export
                  </>
                )}
              </Button>
              
              {meeting.status === "draft" && (
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" /> Delete
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="minutes">Minutes</TabsTrigger>
            <TabsTrigger value="notice">Notice</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Meeting Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Information</CardTitle>
                    <CardDescription>Basic details about this meeting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Meeting Type</label>
                        <p className="text-sm font-medium mt-1">{meeting.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <div className="mt-1">{getStatusBadge(meeting.status)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                        <p className="text-sm mt-1">
                          {meeting.startDate ? format(new Date(meeting.startDate), "PPP 'at' p") : "Not scheduled"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Duration</label>
                        <p className="text-sm mt-1">
                          {meeting.duration ? `${meeting.duration} minutes` : "Not specified"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <div className="flex items-center gap-2 mt-1">
                          {meeting.isVirtual ? (
                            <>
                              <Globe className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">Virtual Meeting</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{meeting.location || "Physical Location"}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {meeting.description && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="text-sm mt-1 text-muted-foreground">{meeting.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Entity Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Entity Information</CardTitle>
                    <CardDescription>Details about the associated entity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{meeting.entity.name}</h3>
                        <p className="text-sm text-muted-foreground">CIN: {meeting.entity.cin}</p>
                        <p className="text-sm text-muted-foreground mt-1">{meeting.entity.type}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Entity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Participants</span>
                      </div>
                      <span className="font-medium">{meeting.participants.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Agenda Items</span>
                      </div>
                      <span className="font-medium">{meeting.agenda?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Documents</span>
                      </div>
                      <span className="font-medium">{meeting.documents?.length || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Meeting Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                    {meeting.status !== 'concluded' && (
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Reminder
                      </Button>
                    )}
                   
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Participants</CardTitle>
                <CardDescription>People invited to this meeting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meeting.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{participant.name}</h4>
                          {getParticipantRoleIcon(participant.role)}
                        </div>
                        <p className="text-sm text-muted-foreground">{participant.role}</p>
                        <p className="text-sm text-muted-foreground">{participant.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={participant.status === 'accepted' ? 'default' : 'secondary'}>
                          {participant.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agenda" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Agenda</CardTitle>
                <CardDescription>Items to be discussed in this meeting</CardDescription>
              </CardHeader>
              <CardContent>
                {meeting.agenda && meeting.agenda.length > 0 ? (
                  <div className="space-y-4">
                    {meeting.agenda.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Duration: {item.duration || 'Not specified'}</span>
                            {item.presenter && <span>Presenter: {item.presenter}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No agenda items</h3>
                    <p className="text-sm text-muted-foreground">Agenda items will appear here once added.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Documents</CardTitle>
                <CardDescription>Files and documents related to this meeting</CardDescription>
              </CardHeader>
              <CardContent>
                {meeting.documents && meeting.documents.length > 0 ? (
                  <div className="space-y-4">
                    {meeting.documents.map((document, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{document.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {document.size} • Uploaded {document.uploadedAt ? format(new Date(document.uploadedAt), 'PPP') : 'recently'}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Paperclip className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No documents</h3>
                    <p className="text-sm text-muted-foreground">Meeting documents will appear here once uploaded.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="minutes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Minutes</CardTitle>
                <CardDescription>Notes and decisions from this meeting</CardDescription>
              </CardHeader>
              <CardContent>
                {meeting.status === 'concluded' ? (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        Meeting concluded on {meeting.endDate ? format(new Date(meeting.endDate), "PPP 'at' p") : 'N/A'}.
                        {meeting.resolutions && meeting.resolutions.length > 0 && ' See e-voting summary below.'}
                      </p>
                    </div>

                    {/* Agenda outcomes */}
                    <div>
                      <h4 className="font-medium mb-3">Agenda Outcomes</h4>
                      {meeting.agenda && meeting.agenda.length > 0 ? (
                        <div className="space-y-3">
                          {meeting.agenda.map((item: AgendaItem, idx: number) => (
                            <div key={idx} className="p-3 border rounded-md">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{idx + 1}. {item.title}</div>
                                <Badge variant="outline">{item.status === 'completed' ? 'Completed' : item.status === 'current' ? 'Discussed' : 'Pending'}</Badge>
                              </div>
                              {item.notes && (
                                <p className="text-sm text-muted-foreground mt-2">{item.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No agenda items recorded.</p>
                      )}
                    </div>

                    {/* E-voting summary */}
                    <div>
                      <h4 className="font-medium mb-3">E‑Voting Summary</h4>
                      {meeting.resolutions && meeting.resolutions.length > 0 ? (
                        <div className="space-y-3">
                          {meeting.resolutions.map((r, idx) => {
                            const totalVotes = (r.votesFor || 0) + (r.votesAgainst || 0) + (r.votesAbstain || 0);
                            const forPct = totalVotes ? Math.round((r.votesFor / totalVotes) * 100) : 0;
                            const againstPct = totalVotes ? Math.round((r.votesAgainst / totalVotes) * 100) : 0;
                            const abstainPct = totalVotes ? Math.round((r.votesAbstain / totalVotes) * 100) : 0;
                            return (
                              <div key={idx} className="p-3 border rounded-md">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{r.title}</div>
                                  <Badge variant={r.status === 'passed' ? 'default' : r.status === 'rejected' ? 'destructive' : 'secondary'}>
                                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">Required majority: {r.requiredMajority}%</p>
                                <div className="text-xs text-muted-foreground mt-2">Votes — For: {r.votesFor} ({forPct}%) • Against: {r.votesAgainst} ({againstPct}%) • Abstain: {r.votesAbstain} ({abstainPct}%)</div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No e‑voting items.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No minutes available</h3>
                    <p className="text-sm text-muted-foreground">Meeting minutes will be available after the meeting is concluded.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Notice</CardTitle>
                <CardDescription>Formal notice generated from meeting details and agenda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-sm leading-6">
                  <p className="font-semibold uppercase tracking-wide">Notice of Meeting</p>
                  <p className="mt-2">Notice is hereby given that a meeting of {meeting.entity?.name || 'the Entity'} will be held on {meeting.startDate ? format(new Date(meeting.startDate), "PPP") : '[Date]'} at {meeting.startDate ? format(new Date(meeting.startDate), "p") : '[Time]'}{meeting.isVirtual ? ' (Virtual)' : ''}.</p>
                  {!meeting.isVirtual && (
                    <p className="mt-2">Venue: {meeting.location || '[Venue/Address]'}</p>
                  )}
                  {meeting.isVirtual && (
                    <p className="mt-2">Virtual Meeting Link: {meeting.virtualMeetingLink || '[Meeting link will be shared separately]'}</p>
                  )}
                  <Separator className="my-4" />
                  <p className="font-medium">Agenda</p>
                  {meeting.agenda && meeting.agenda.length > 0 ? (
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      {meeting.agenda.map((item, idx) => (
                        <li key={idx}>{item.title}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-muted-foreground mt-2">Agenda will be circulated separately.</p>
                  )}
                  <Separator className="my-4" />
                  <div className="mt-2">
                    <p>By order of the Board</p>
                    <p className="mt-1 text-muted-foreground">[Authorized Signatory]</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <div>Place: {meeting.location || '[Place]'}</div>
                      <div>Date: {format(new Date(), 'PPP')}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recordings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Recordings</CardTitle>
                <CardDescription>Video and audio recordings of this meeting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No recordings available</h3>
                  <p className="text-sm text-muted-foreground">Meeting recordings will be available after the meeting is concluded.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this meeting? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Meeting
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default MeetingDetails;

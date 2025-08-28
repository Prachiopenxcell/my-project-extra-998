import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";
import { meetingsService } from "@/services/meetingsService";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Vote, 
  Clock, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  MoreVertical,
  Send,
  ThumbsUp,
  Hand,
  Download,
  Share2,
  PieChart,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  Mail,
  Timer,
  Crown,
  Shield,
  Upload,
  Edit,
  UserPlus,
  Cloud,
  HardDrive,
  PauseCircle,
  AlertTriangle,
  PlusCircle
} from "lucide-react";

// Mock data for participants
const participantsData = [
  { id: 1, name: "John Smith", role: "Chairperson", status: "Speaking", avatar: "" },
  { id: 2, name: "Sarah Johnson", role: "Secretary", status: "Present", avatar: "" },
  { id: 3, name: "Michael Brown", role: "Member", status: "Present", avatar: "" },
  { id: 4, name: "Lisa Anderson", role: "Auditor", status: "Present", avatar: "" },
  { id: 5, name: "Robert Wilson", role: "Legal Advisor", status: "Present", avatar: "" },
  { id: 6, name: "Emily Davis", role: "Member", status: "Absent", avatar: "" },
  { id: 7, name: "David Miller", role: "Member", status: "Present", avatar: "" },
  { id: 8, name: "Jennifer White", role: "Member", status: "Present", avatar: "" }
];

// Mock data for agenda items
const agendaItems = [
  { id: 1, title: "Welcome and Introduction", status: "Completed", duration: "00:10:00" },
  { id: 2, title: "Approval of Previous Minutes", status: "In Progress", duration: "00:15:00" },
  { id: 3, title: "Matters Arising from Previous Meeting", status: "Pending", duration: "00:10:00" },
  { id: 4, title: "Financial Report Presentation", status: "Pending", duration: "00:30:00" },
  { id: 5, title: "Quarterly Performance Review", status: "Pending", duration: "00:20:00" },
  { id: 6, title: "Election of New Board Members", status: "Pending", duration: "00:45:00" },
  { id: 7, title: "Compliance & Risk Update", status: "Pending", duration: "00:15:00" },
  { id: 8, title: "Any Other Business", status: "Pending", duration: "00:10:00" },
  { id: 9, title: "Closing Remarks", status: "Pending", duration: "00:05:00" }
];

// Mock data for chat messages
const initialChatMessages = [
  { id: 1, sender: "John Smith", role: "Chairperson", message: "Welcome everyone to the AGM 2024. Let's begin with the first agenda item.", time: "10:02 AM" },
  { id: 2, sender: "Sarah Johnson", role: "Secretary", message: "I'll be taking minutes for today's meeting.", time: "10:03 AM" },
  { id: 3, sender: "Michael Brown", role: "Member", message: "I have a question about the financial report.", time: "10:05 AM" },
  { id: 4, sender: "John Smith", role: "Chairperson", message: "We'll address that when we get to the financial report agenda item, Michael.", time: "10:06 AM" }
];

// Mock data for resolutions
const resolutionsData = [
  { 
    id: 1, 
    title: "Approval of Financial Statements", 
    description: "To receive, consider and adopt the Audited Financial Statements for the year ended March 31, 2024.",
    status: "Open",
    type: "Ordinary",
    votingStatus: "In Progress"
  },
  { 
    id: 2, 
    title: "Re-appointment of Auditors", 
    description: "To re-appoint M/s ABC & Associates as the Statutory Auditors of the Company.",
    status: "Open",
    type: "Ordinary",
    votingStatus: "Not Started"
  },
  { 
    id: 3, 
    title: "Dividend Declaration", 
    description: "To declare a final dividend of $2.50 per equity share for the financial year 2023-24.",
    status: "Open",
    type: "Ordinary",
    votingStatus: "Not Started"
  },
  { 
    id: 4, 
    title: "Appointment of Independent Director", 
    description: "To appoint Ms. Jane Doe as an Independent Director for a term of five years.",
    status: "Queued",
    type: "Ordinary",
    votingStatus: "Not Started"
  },
  { 
    id: 5, 
    title: "ESOP Plan 2025 Approval", 
    description: "To approve the Employee Stock Option Plan 2025 for eligible employees.",
    status: "Queued",
    type: "Special",
    votingStatus: "Not Started"
  }
];

// Mock data for documents
const documentsData = [
  { id: 1, name: "Annual Report 2023-24.pdf", type: "PDF", size: "2.5 MB" },
  { id: 2, name: "Financial Statements Q4.xlsx", type: "Excel", size: "1.8 MB" },
  { id: 3, name: "Previous Board Minutes.docx", type: "Word", size: "850 KB" },
  { id: 4, name: "Board Report.pdf", type: "PDF", size: "3.2 MB" },
  { id: 5, name: "Compliance & Risk Update.pptx", type: "PPT", size: "6.1 MB" },
  { id: 6, name: "ESOP Draft Policy.docx", type: "Word", size: "420 KB" },
  { id: 7, name: "Director Appointment Profile - Jane Doe.pdf", type: "PDF", size: "1.1 MB" },
  { id: 8, name: "Voting Procedure Guide.pdf", type: "PDF", size: "540 KB" }
];

const LiveMeetingContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("participants");
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [currentAgendaItem, setCurrentAgendaItem] = useState(1);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [sendAllAttendees, setSendAllAttendees] = useState(true);
  const [sending, setSending] = useState(false);
  const [paused, setPaused] = useState(false);
  const [chairperson, setChairperson] = useState<string | null>("John Smith");
  const [showChairDialog, setShowChairDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [savingCloud, setSavingCloud] = useState(false);
  const [savingLocal, setSavingLocal] = useState(false);
  const [showAdjournDialog, setShowAdjournDialog] = useState(false);
  const [adjournDetails, setAdjournDetails] = useState({ date: "", time: "", venue: "", link: "" });
  const [currentUserRole, setCurrentUserRole] = useState<"Chairperson" | "Secretary" | "Scrutinizer" | "Member">("Secretary");
  const [physicalAttendance, setPhysicalAttendance] = useState<Record<number, boolean>>({});
  const [extendMinutes, setExtendMinutes] = useState(15);

  // Computed attendance values
  const joinedCount = participantsData.filter(p => p.status === 'Present' || p.status === 'Speaking').length;
  const invitedCount = participantsData.length;
  const quorumMet = joinedCount >= Math.ceil(invitedCount * 0.5); // 50% quorum

  // Derived formatted time string from elapsedSeconds
  const elapsedTime = useMemo(() => {
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }, [elapsedSeconds]);

  // Ticking timer when not paused
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newChatMessage = {
      id: chatMessages.length + 1,
      sender: "Sarah Johnson", // Assuming current user
      role: "Secretary",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newChatMessage]);
    setNewMessage("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  const toggleHandRaise = () => {
    setHandRaised(!handRaised);
  };

  const moveToNextAgendaItem = () => {
    if (currentAgendaItem < agendaItems.length) {
      setCurrentAgendaItem(currentAgendaItem + 1);
    }
  };

  const toggleRecording = async () => {
    try {
      if (!id) return;
      const updated = await meetingsService.toggleRecording(id);
      if (updated) {
        setIsRecording(!!updated.isRecording);
        toast({
          title: updated.isRecording ? "Recording started" : "Recording stopped",
        });
      }
    } catch (e) {
      toast({ title: "Failed to toggle recording", variant: "destructive" });
    }
  };

  const handleUploadResolution = () => {
    toast({ title: "Resolution upload functionality coming soon" });
  };

  const handleEditResolution = () => {
    toast({ title: "Resolution edit functionality coming soon" });
  };

  const handleShareInvite = () => {
    if (inviteEmail.trim()) {
      toast({ title: `Invitation sent to ${inviteEmail}` });
      setInviteEmail("");
    }
  };

  const handleExtendMeeting = () => {
    toast({ title: `Meeting extended by ${extendMinutes} minutes` });
  };

  const handleSaveCloud = async () => {
    setSavingCloud(true);
    setTimeout(() => {
      setSavingCloud(false);
      toast({ title: "Meeting saved to cloud" });
    }, 2000);
  };

  const handleSaveLocal = async () => {
    setSavingLocal(true);
    setTimeout(() => {
      setSavingLocal(false);
      toast({ title: "Meeting saved locally" });
    }, 2000);
  };

  const togglePhysicalAttendance = (participantId: number) => {
    setPhysicalAttendance(prev => ({
      ...prev,
      [participantId]: !prev[participantId]
    }));
  };

  const handleAdjourn = () => {
    toast({ title: "Meeting marked for adjournment" });
    setShowAdjournDialog(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Live Meeting — Acme Corporation</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Meeting ID: {id || 'BM-2024-004'}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> Start Time: 10:00 AM
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer className="h-4 w-4" /> {paused ? 'Paused' : 'Timer'}: {elapsedTime}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="inline-flex items-center gap-1">
              <Crown className="h-4 w-4 text-amber-600" />
              <span>Chairperson: {chairperson || 'Not set'}</span>
              <Button size="sm" variant="ghost" onClick={() => setShowChairDialog(true)}>Set</Button>
            </div>
            <div className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" /> Attendance: {joinedCount}/{invitedCount}
              {quorumMet ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Quorum Met</Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 inline-flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Quorum Pending
                </Badge>
              )}
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowEndDialog(true)}>End Meeting</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Meeting Controls */}
        <div className="w-72 bg-muted p-4 flex flex-col border-r">
          <h2 className="font-semibold mb-4">MEETING CONTROL</h2>
          
          <div className="space-y-2 mb-6">
            <Button className="w-full justify-start" variant="outline">
              <Video className="mr-2 h-4 w-4" /> Share Screen
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Present Document
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Vote className="mr-2 h-4 w-4" />
              Start Voting
            </Button>
            {currentUserRole === 'Secretary' && (
              <>
                <Button className="w-full justify-start" variant="outline" onClick={handleUploadResolution}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Resolution
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={handleEditResolution}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Resolution
                </Button>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Add email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                  <Button size="sm" onClick={handleShareInvite}>
                    <UserPlus className="mr-2 h-4 w-4" /> Invite
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm">MEETING PROGRESS</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>35%</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Current Agenda Item:</h4>
              <div className="bg-background p-2 rounded-md border">
                <div className="font-medium">{agendaItems[currentAgendaItem - 1].title}</div>
                <div className="text-xs text-muted-foreground flex justify-between mt-1">
                  <span>Duration: {agendaItems[currentAgendaItem - 1].duration}</span>
                  <Badge variant="outline" className="text-xs">
                    {agendaItems[currentAgendaItem - 1].status}
                  </Badge>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={moveToNextAgendaItem}
                disabled={currentAgendaItem >= agendaItems.length}
              >
                Next Item
              </Button>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button size="sm" variant={paused ? 'default' : 'outline'} onClick={() => setPaused(!paused)} className="flex items-center">
                  <PauseCircle className="h-4 w-4 mr-2" /> {paused ? 'Resume' : 'Pause'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleExtendMeeting} className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" /> Extend {extendMinutes}m
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={micEnabled ? "default" : "destructive"} 
                size="icon"
                onClick={toggleMic}
              >
                {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button 
                variant={videoEnabled ? "default" : "destructive"} 
                size="icon"
                onClick={toggleVideo}
              >
                {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button 
                variant={handRaised ? "secondary" : "outline"} 
                size="icon"
                onClick={toggleHandRaise}
              >
                <Hand className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={toggleRecording} className="w-full mt-2" variant={isRecording ? "destructive" : "default"}>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button className="w-full" variant="outline" onClick={handleSaveCloud} disabled={savingCloud}>
                <Cloud className="h-4 w-4 mr-2" /> {savingCloud ? 'Saving…' : 'Save Cloud'}
              </Button>
              <Button className="w-full" variant="outline" onClick={handleSaveLocal} disabled={savingLocal}>
                <HardDrive className="h-4 w-4 mr-2" /> {savingLocal ? 'Saving…' : 'Save Local'}
              </Button>
            </div>
            <Button variant="destructive" className="w-full mt-2" onClick={() => setShowEndDialog(true)}>
              End Meeting
            </Button>
            <Button variant="outline" className="w-full mt-2" onClick={() => setShowAdjournDialog(true)}>
              Mark for Adjournment
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Conference Area */}
          <div className="bg-gray-900 h-2/3 p-4 relative">
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* Main speaker */}
              <div className="col-span-2 bg-gray-800 rounded-lg relative flex items-center justify-center">
                <div className="text-white text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-2">
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">John Smith</div>
                  <div className="text-sm opacity-70">Chairperson (Speaking)</div>
                </div>
                <Badge className="absolute bottom-2 left-2 bg-red-500">LIVE</Badge>
                {isRecording && (
                  <Badge className="absolute top-2 left-2 bg-red-600">REC</Badge>
                )}
              </div>
              
              {/* Participants grid */}
              <div className="grid grid-cols-2 gap-2 overflow-auto">
                {participantsData.slice(1, 7).map((participant) => (
                  <div key={participant.id} className="bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center">
                    <Avatar className="h-10 w-10 mb-1">
                      <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="text-white text-xs truncate w-full text-center">{participant.name}</div>
                    <div className="text-gray-400 text-xs">{participant.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Tabs Area */}
          <div className="flex-1 bg-background">
            <Tabs value={activeTab} defaultValue="participants" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="participants" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Participants ({participantsData.length})
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="agenda" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Agenda
                  </TabsTrigger>
                  <TabsTrigger value="resolutions" className="flex items-center">
                    <Vote className="mr-2 h-4 w-4" />
                    Resolutions
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="participants" className="mt-0 data-[state=active]:mt-0 p-4 overflow-auto min-h-[320px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Meeting Participants</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{joinedCount}/{invitedCount} Present</Badge>
                    <Input placeholder="Search participants..." className="w-48" />
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Voting Weight</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Physical</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantsData.map((participant) => (
                        <tr key={participant.id} className="border-t">
                          <td className="p-2 flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            {participant.name}
                          </td>
                          <td className="p-2">{participant.role}</td>
                          <td className="p-2">{participant.role === 'Chairperson' ? '2' : '1'}</td>
                          <td className="p-2">
                            <Badge variant={participant.status === "Speaking" ? "default" : participant.status === "Present" ? "secondary" : "outline"}>
                              {participant.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Checkbox
                              checked={!!physicalAttendance[participant.id]}
                              onCheckedChange={() => currentUserRole === 'Secretary' && togglePhysicalAttendance(participant.id)}
                              disabled={currentUserRole !== 'Secretary'}
                              aria-label="Mark physical attendance"
                            />
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">Mute</Button>
                              <Button variant="ghost" size="sm">Message</Button>
                              {currentUserRole === 'Chairperson' && (
                                <Button variant="ghost" size="sm">Assign Speak</Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="mt-0 data-[state=active]:mt-0  min-h-[320px]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.sender}</span>
                            <span className="text-xs text-muted-foreground">{message.role}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{message.time}</span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <Button onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="agenda" className="!mt-0 p-2 overflow-auto min-h-[320px] bg-background">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium mt-0">Meeting Agenda</h3>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Export Agenda
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground mb-2">{agendaItems.length} items</div>
                <div className="space-y-4">
                  {agendaItems.map((item, index) => (
                    <Card key={item.id} className={currentAgendaItem === item.id ? "border-primary" : ""}>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base flex justify-between">
                          <div className="flex items-center">
                            <span className="mr-2">{index + 1}.</span>
                            {item.title}
                          </div>
                          <Badge variant={
                            item.status === "Completed" ? "secondary" : 
                            item.status === "In Progress" ? "default" : 
                            "outline"
                          }>
                            {item.status}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Duration: {item.duration}</span>
                          {currentAgendaItem === item.id && (
                            <Button size="sm" variant="outline">
                              {item.status === "In Progress" ? "Mark Complete" : "Start Item"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resolutions" className="!mt-0 p-2 overflow-auto min-h-[320px] bg-background">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium mt-0">Resolutions</h3>
                  <Button variant="outline" size="sm">
                    <PieChart className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground mb-2">{resolutionsData.length} resolutions</div>
                <div className="space-y-4">
                  {resolutionsData.map((resolution) => (
                    <Card key={resolution.id}>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base flex justify-between">
                          <div>Resolution #{resolution.id}: {resolution.title}</div>
                          <Badge variant="outline">{resolution.type}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm mb-4">{resolution.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant={
                            resolution.votingStatus === "Completed" ? "secondary" : 
                            resolution.votingStatus === "In Progress" ? "default" : 
                            "outline"
                          }>
                            {resolution.votingStatus}
                          </Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex items-center">
                              <ThumbsUp className="mr-2 h-4 w-4" />
                              For
                            </Button>
                            <Button size="sm" variant="outline" className="flex items-center">
                              <XCircle className="mr-2 h-4 w-4" />
                              Against
                            </Button>
                            <Button size="sm" variant="outline">Abstain</Button>
                            {currentUserRole === 'Secretary' && (
                              <>
                                <Button size="sm" variant="ghost" className="flex items-center" onClick={handleUploadResolution}>
                                  <Upload className="mr-2 h-4 w-4" /> Reupload
                                </Button>
                                <Button size="sm" variant="ghost" className="flex items-center" onClick={handleEditResolution}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="!mt-0 p-2 overflow-auto min-h-[320px] bg-background">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium mt-0">Meeting Documents</h3>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="text-xs text-muted-foreground p-2 border-b">{documentsData.length} documents</div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Size</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentsData.map((document) => (
                        <tr key={document.id} className="border-t">
                          <td className="p-2">{document.name}</td>
                          <td className="p-2">{document.type}</td>
                          <td className="p-2">{document.size}</td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="flex items-center">
                                <Download className="mr-1 h-4 w-4" />
                                Download
                              </Button>
                              <Button variant="ghost" size="sm" className="flex items-center">
                                <Share2 className="mr-1 h-4 w-4" />
                                Share
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {/* End Meeting MOM Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-bold text-center">Minutes of Meeting (MOM)</DialogTitle>
            <DialogDescription className="text-center">
              Review the meeting summary. You can send this MOM to all attendees.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 max-h-[65vh] pr-2">
            <div className="p-6 space-y-6 bg-white">
              {/* Company Header */}
              <div className="border-2 border-gray-300 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">ACME CORPORATION</h1>
                  <h2 className="text-lg font-semibold text-gray-700">Board of Directors Meeting</h2>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div><span className="font-medium">Date:</span> 26/08/2024</div>
                    <div><span className="font-medium">Time:</span> 10:00 AM IST</div>
                    <div><span className="font-medium">Duration:</span> {elapsedTime}</div>
                    <div><span className="font-medium">Venue:</span> Virtual Meeting</div>
                  </div>
                </div>
              </div>

              {/* Attendance Section */}
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">ATTENDANCE SECTION</h3>
                
                {/* Present */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Present:</h4>
                  <div className="border border-gray-300 rounded-md p-4 bg-white">
                    <div className="grid gap-2">
                      {participantsData.filter(p => p.status !== "Absent").map((p, index) => (
                        <div key={p.id} className="flex items-center">
                          <span className="font-medium text-gray-700 w-6">{index + 1}.</span>
                          <span className="text-gray-900">{p.name}</span>
                          <span className="text-gray-600 ml-2">: {p.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* In Attendance */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">In attendance:</h4>
                  <div className="border border-gray-300 rounded-md p-4 bg-white">
                    <div className="space-y-1">
                      <div className="text-gray-900">Company Secretary : Sarah Johnson</div>
                      <div className="text-gray-900">Statutory Auditor : Lisa Anderson</div>
                      <div className="text-gray-900">Legal Advisor : Robert Wilson</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chairman Section */}
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">CHAIRMAN SECTION</h3>
                <div className="space-y-2 text-gray-900">
                  <p><span className="font-medium">Chairman:</span> {chairperson || 'John Smith'} was elected as Chairman</p>
                  <p>Meeting called to order at 10:00 AM with requisite quorum present</p>
                </div>
              </div>

              {/* Agenda Items */}
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">AGENDA ITEMS</h3>
                
                <div className="space-y-4">
                  {agendaItems.slice(0, 6).map((item, index) => (
                    <div key={item.id} className="border border-gray-300 rounded-lg p-4 bg-white">
                      <div className="border-b border-gray-200 pb-2 mb-3">
                        <h4 className="font-semibold text-gray-900">Item No. {index + 1}: {item.title}</h4>
                      </div>
                      <div className="space-y-3">
                        <p className="text-gray-700 text-sm">
                          {index === 0 && "The Chairman welcomed all members and outlined the meeting agenda. All participants confirmed their attendance and readiness to proceed."}
                          {index === 1 && "The minutes from the previous board meeting were reviewed and discussed. All members had the opportunity to raise questions and clarifications."}
                          {index === 2 && "Matters arising from the previous meeting were addressed systematically. Action items were reviewed and their current status was confirmed."}
                          {index === 3 && "The Chief Financial Officer presented the quarterly financial report with detailed analysis of revenue, expenses, and profitability metrics."}
                          {index === 4 && "The quarterly performance review was conducted covering all key business units and their respective achievements against set targets."}
                          {index === 5 && "The process for election of new board members was initiated as per the company's governance guidelines and regulatory requirements."}
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                          <p className="font-medium text-blue-900 mb-2">RESOLVED THAT:</p>
                          <div className="border border-blue-300 rounded-md p-3 bg-white">
                            <p className="text-blue-800 text-sm">
                              {index === 0 && "The agenda for the meeting is hereby approved and the meeting shall proceed as outlined."}
                              {index === 1 && "The minutes of the previous Board Meeting held on 24th July 2024 are hereby approved and adopted."}
                              {index === 2 && "All action items from the previous meeting have been satisfactorily addressed and closed."}
                              {index === 3 && "The financial report for Q2 2024 is hereby received, considered, and approved by the Board."}
                              {index === 4 && "The quarterly performance review is noted and the management is commended for achieving the set targets."}
                              {index === 5 && "The nomination committee's recommendations for new board members are hereby approved for further processing."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Any Other Business */}
                  <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <div className="border-b border-gray-200 pb-2 mb-3">
                      <h4 className="font-semibold text-gray-900">Item No. {agendaItems.length}: Any Other Business</h4>
                    </div>
                    <p className="text-gray-700 text-sm">
                      No other business matters were raised by the members. The Chairman confirmed that all agenda items had been adequately covered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Meeting Conclusion */}
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">MEETING CONCLUSION</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Vote of Thanks:</h4>
                    <p className="text-gray-700">The meeting ended with a vote of thanks to the chair at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  {/* Signatures Section */}
                  <div className="border border-gray-300 rounded-lg p-6 bg-white mt-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center space-y-4">
                        <div className="border-b border-gray-300 pb-2">
                          <p className="font-bold text-gray-900">CHAIRMAN</p>
                        </div>
                        <div className="space-y-2">
                          <div className="h-12 border-b border-gray-400"></div>
                          <p className="text-sm text-gray-700">[Signature]</p>
                          <p className="font-medium text-gray-900">{chairperson || 'John Smith'}</p>
                          <p className="text-sm text-gray-600">Chairperson</p>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-4">
                        <div className="border-b border-gray-300 pb-2">
                          <p className="font-bold text-gray-900">COMPANY SECRETARY</p>
                        </div>
                        <div className="space-y-2">
                          <div className="h-12 border-b border-gray-400"></div>
                          <p className="text-sm text-gray-700">[Signature]</p>
                          <p className="font-medium text-gray-900">Sarah Johnson</p>
                          <p className="text-sm text-gray-600">Company Secretary</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Notes */}
              <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                <h3 className="text-sm font-bold text-amber-900 mb-2">TEMPLATE NOTES</h3>
                <ul className="text-xs text-amber-800 space-y-1">
                  <li>• This MOM has been auto-generated based on meeting data and agenda items</li>
                  <li>• Resolutions follow the formal "RESOLVED THAT" format as per corporate governance</li>
                  <li>• Digital signatures can be applied before sending to all attendees</li>
                  <li>• Meeting duration and attendance have been automatically calculated</li>
                  <li>• All participants marked as "Present" have been included in the attendance section</li>
                </ul>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="mx-4 mb-3 mt-0 flex items-center justify-between pt-4 border-t bg-gray-50 px-6 py-5 rounded-md shadow-sm">
            <div className="flex items-center gap-2">
              <Checkbox id="sendAll" checked={sendAllAttendees} onCheckedChange={(c) => setSendAllAttendees(!!c)} />
              <Label htmlFor="sendAll" className="text-sm font-medium">Send to all attending team members</Label>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowEndDialog(false)} className="px-6">
                Cancel
              </Button>
              <Button variant="outline" className="px-6">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={async () => {
                  try {
                    setSending(true);
                    await new Promise(res => setTimeout(res, 800));
                    toast({ title: "MOM sent to all team members successfully" });
                    setShowEndDialog(false);
                    navigate('/meetings');
                  } finally {
                    setSending(false);
                  }
                }}
                disabled={sending}
                className="flex items-center px-6 bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="h-4 w-4 mr-2" /> 
                {sending ? 'Sending...' : 'Send MOM'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Chairperson Dialog */}
      <Dialog open={showChairDialog} onOpenChange={setShowChairDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Chairperson</DialogTitle>
            <DialogDescription>Choose or enter the chairperson for this meeting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <select
              className="border rounded-md w-full p-2"
              value={chairperson || ''}
              onChange={(e) => setChairperson(e.target.value)}
            >
              {participantsData.map(p => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>
            <Input placeholder="Or enter name" onChange={(e) => setChairperson(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowChairDialog(false)}>Cancel</Button>
              <Button onClick={() => setShowChairDialog(false)}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjourn & Reschedule Dialog */}
      <Dialog open={showAdjournDialog} onOpenChange={setShowAdjournDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjourn & Reschedule</DialogTitle>
            <DialogDescription>Provide next schedule details to notify participants.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Next Date (e.g., 2025-08-25)" value={adjournDetails.date} onChange={(e) => setAdjournDetails({ ...adjournDetails, date: e.target.value })} />
            <Input placeholder="Next Time (e.g., 15:30)" value={adjournDetails.time} onChange={(e) => setAdjournDetails({ ...adjournDetails, time: e.target.value })} />
            <Input placeholder="Venue (if physical)" value={adjournDetails.venue} onChange={(e) => setAdjournDetails({ ...adjournDetails, venue: e.target.value })} />
            <Input placeholder="Meeting Link (if virtual)" value={adjournDetails.link} onChange={(e) => setAdjournDetails({ ...adjournDetails, link: e.target.value })} />
            {!quorumMet && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-md flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Attendance not sufficient as per quorum. Consider rescheduling.
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdjournDialog(false)}>Cancel</Button>
              <Button onClick={handleAdjourn}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LiveMeeting = () => {
  return (
    <DashboardLayout>
      <LiveMeetingContent />
    </DashboardLayout>
  );
};

export default LiveMeeting;

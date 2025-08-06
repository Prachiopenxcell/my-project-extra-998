import { useState } from "react";
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
  ChevronDown
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
  { id: 3, title: "Financial Report Presentation", status: "Pending", duration: "00:30:00" },
  { id: 4, title: "Election of New Board Members", status: "Pending", duration: "00:45:00" },
  { id: 5, title: "Any Other Business", status: "Pending", duration: "00:15:00" },
  { id: 6, title: "Closing Remarks", status: "Pending", duration: "00:05:00" }
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
    status: "Pending",
    type: "Ordinary",
    votingStatus: "Not Started"
  },
  { 
    id: 2, 
    title: "Re-appointment of Auditors", 
    description: "To re-appoint M/s ABC & Associates as the Statutory Auditors of the Company.",
    status: "Pending",
    type: "Ordinary",
    votingStatus: "Not Started"
  },
  { 
    id: 3, 
    title: "Dividend Declaration", 
    description: "To declare a final dividend of $2.50 per equity share for the financial year 2023-24.",
    status: "Pending",
    type: "Ordinary",
    votingStatus: "Not Started"
  }
];

// Mock data for documents
const documentsData = [
  { id: 1, name: "Annual Report 2023-24.pdf", type: "PDF", size: "2.5 MB" },
  { id: 2, name: "Financial Statements.xlsx", type: "Excel", size: "1.8 MB" },
  { id: 3, name: "Previous AGM Minutes.docx", type: "Word", size: "850 KB" },
  { id: 4, name: "Board Report.pdf", type: "PDF", size: "3.2 MB" }
];

const LiveMeetingContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("participants");
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(true);
  const [elapsedTime, setElapsedTime] = useState("01:23:45");
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [currentAgendaItem, setCurrentAgendaItem] = useState(1);

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

  const handleKeyPress = (e) => {
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Board Meeting #4 - Acme Corporation</h1>
          <p className="text-muted-foreground">Meeting ID: {id || 'BM-2024-004'} • Started at 10:00 AM</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-1">
            <Clock className="h-3 w-3 mr-1" /> Live
          </Badge>
          <Button size="sm" variant="outline" onClick={() => {
            toast({
              title: "Meeting ended",
              description: "The meeting has been successfully ended."
            });
            navigate('/meetings');
          }}>End Meeting</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Meeting Controls */}
        <div className="w-64 bg-muted p-4 flex flex-col border-r">
          <h2 className="font-semibold mb-4">MEETING CONTROL</h2>
          
          <div className="space-y-2 mb-6">
            <Button className="w-full justify-start" variant="outline">
              <Video className="mr-2 h-4 w-4" />
              Share Screen
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Present Document
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Vote className="mr-2 h-4 w-4" />
              Start Voting
            </Button>
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
            <Button variant="destructive" className="w-full mt-2">
              End Meeting
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
            <Tabs defaultValue="participants" className="w-full h-full" onValueChange={setActiveTab}>
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

              <TabsContent value="participants" className="p-4 h-full overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Meeting Participants</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{participantsData.filter(p => p.status !== "Absent").length}/{participantsData.length} Present</Badge>
                    <Input placeholder="Search participants..." className="w-48" />
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Status</th>
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
                          <td className="p-2">
                            <Badge variant={participant.status === "Speaking" ? "default" : participant.status === "Present" ? "secondary" : "outline"}>
                              {participant.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">Mute</Button>
                              <Button variant="ghost" size="sm">Message</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="flex flex-col h-full">
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

              <TabsContent value="agenda" className="p-4 h-full overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Meeting Agenda</h3>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Export Agenda
                  </Button>
                </div>
                
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

              <TabsContent value="resolutions" className="p-4 h-full overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Resolutions</h3>
                  <Button variant="outline" size="sm">
                    <PieChart className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                </div>
                
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="p-4 h-full overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Meeting Documents</h3>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
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
    </div>
  );
};

const LiveMeeting = () => {
  return (
    <DashboardLayout userType="service_provider">
      <LiveMeetingContent />
    </DashboardLayout>
  );
};

export default LiveMeeting;

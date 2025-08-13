import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, ArrowLeft, Save, CheckCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Step components
const EntityAndMeetingDetails = ({ formData, setFormData, nextStep, saveAsDraft }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, meetingDate: date }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Entity Details:</h3>
        <div className="space-y-4 border rounded-md p-4">
          <div className="flex justify-between items-center">
            <div className="w-3/4">
              <Label htmlFor="entity">Choose Entity:</Label>
              <Select 
                value={formData.entity} 
                onValueChange={(value) => handleSelectChange("entity", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acme">Acme Corporation</SelectItem>
                  <SelectItem value="tech">Tech Solutions</SelectItem>
                  <SelectItem value="healthcare">Healthcare Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">+ Create New Entity</Button>
          </div>
          
          <div>
            <Label htmlFor="entityType">Entity Type:</Label>
            <Input 
              id="entityType" 
              name="entityType" 
              value="Private Limited Company" 
              disabled 
              className="bg-muted"
            />
          </div>
          
          <div>
            <Label htmlFor="entityName">Entity Name:</Label>
            <Input 
              id="entityName" 
              name="entityName" 
              value="Acme Corporation" 
              disabled 
              className="bg-muted"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Meeting Details:</h3>
        <div className="space-y-4 border rounded-md p-4">
                  <div>
                    <Label htmlFor="meetingTitle">Meeting Title: (Optional)</Label>
                    <Input 
                      id="meetingTitle" 
                      name="meetingTitle" 
                      value={formData.meetingTitle || ""} 
                      onChange={handleInputChange} 
                      placeholder="Enter meeting title"
                    />
                  </div>
                  
                  <div>
                    <Label>Class of Meeting:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["AGM", "COC", "BM", "EGM", "Valuer Meeting", "SEC", "Other"].map((type) => (
                        <Button 
                          key={type} 
                          variant={formData.meetingClass === type ? "default" : "outline"}
                          onClick={() => handleSelectChange("meetingClass", type)}
                          className="min-w-20"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                    {formData.meetingClass === "Other" && (
                      <div className="mt-3">
                        <Label htmlFor="customMeetingClass">Custom Meeting Class:</Label>
                        <Input 
                          id="customMeetingClass" 
                          name="customMeetingClass" 
                          value={formData.customMeetingClass || ""} 
                          onChange={handleInputChange} 
                          placeholder="Enter custom meeting class"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="meetingNumber">Meeting Number:</Label>
                    <Input 
                      id="meetingNumber" 
                      name="meetingNumber" 
                      type="number" 
                      value={formData.meetingNumber || 1} 
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label>Type of Meeting:</Label>
                    <Select 
                      value={formData.meetingType} 
                      onValueChange={(value) => handleSelectChange("meetingType", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select meeting type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original Meeting</SelectItem>
                        <SelectItem value="adjourned">Adjourned Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Nature of Meeting:</Label>
                    <Select 
                      value={formData.meetingNature} 
                      onValueChange={(value) => handleSelectChange("meetingNature", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select meeting nature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">Physical Meeting</SelectItem>
                        <SelectItem value="hybrid">Hybrid Meeting</SelectItem>
                        <SelectItem value="virtual">Virtual Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
        
                  {/* Date and Time - Required for all meeting types */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Meeting Date: *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label htmlFor="meetingTime">Meeting Time: *</Label>
                      <Input 
                        id="meetingTime" 
                        name="meetingTime" 
                        type="time" 
                        value={formData.meetingTime || ""} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
        
                  {/* Venue - Required for Physical and Hybrid, not for Virtual */}
                  {(formData.meetingNature === "physical" || formData.meetingNature === "hybrid") && (
                    <div>
                      <Label htmlFor="venue">Venue: *</Label>
                      <Input 
                        id="venue" 
                        name="venue" 
                        value={formData.venue || ""} 
                        onChange={handleInputChange} 
                        placeholder="Enter meeting venue"
                      />
                    </div>
                  )}
        
                  {/* Online Link Configuration - For Hybrid and Virtual */}
                  {(formData.meetingNature === "hybrid" || formData.meetingNature === "virtual") && (
                    <div className="border rounded-md p-4 space-y-4">
                      <Label>Online Meeting Configuration:</Label>
                      <RadioGroup 
                        value={formData.virtualMeetingOption} 
                        onValueChange={(value) => handleSelectChange("virtualMeetingOption", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="generate" id="generate" />
                          <Label htmlFor="generate">Generate meeting link automatically</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manual" id="manual" />
                          <Label htmlFor="manual">Enter meeting link manually</Label>
                        </div>
                      </RadioGroup>
                      
                      {formData.virtualMeetingOption === "manual" && (
                        <div>
                          <Label htmlFor="meetingLink">Meeting Link:</Label>
                          <Input 
                            id="meetingLink" 
                            name="meetingLink" 
                            value={formData.meetingLink || ""} 
                            onChange={handleInputChange} 
                            placeholder="Enter meeting link (e.g., Zoom, Teams, etc.)"
                          />
                        </div>
                      )}
                    </div>
                  )}
        
                  <div>
                    <Label htmlFor="quorum">Quorum (%):</Label>
                    <Input 
                      id="quorum" 
                      name="quorum" 
                      type="number" 
                      min="1" 
                      max="100" 
                      value={formData.quorum || 51} 
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">(auto-filled based on meeting class, editable)</p>
                  </div>
                </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={nextStep}>Next: Add Participants →</Button>
      </div>
    </div>
  );
};

const ParticipantsManagement = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }) => {
  const [votingParticipants, setVotingParticipants] = useState([
    { id: 1, name: "John Smith", email: "john@email.com", address: "123 Main St", distinctiveNo: "DP001", votingPercentage: "25%" },
    { id: 2, name: "Sarah Johnson", email: "sarah@email.com", address: "456 Oak Ave", distinctiveNo: "DP002", votingPercentage: "15%" },
    { id: 3, name: "Michael Brown", email: "michael@email.com", address: "789 Pine Rd", distinctiveNo: "DP003", votingPercentage: "30%" }
  ]);

  const [nonVotingInvitees, setNonVotingInvitees] = useState([
    { id: 1, name: "Robert Wilson", email: "robert@email.com", role: "Legal Advisor" },
    { id: 2, name: "Lisa Anderson", email: "lisa@email.com", role: "Auditor" }
  ]);

  const addVotingParticipant = () => {
    // In a real app, this would open a modal or form to add a new participant
    const newId = votingParticipants.length > 0 ? Math.max(...votingParticipants.map(p => p.id)) + 1 : 1;
    setVotingParticipants([...votingParticipants, { 
      id: newId, 
      name: "", 
      email: "", 
      address: "", 
      distinctiveNo: "", 
      votingPercentage: "" 
    }]);
  };

  const addNonVotingInvitee = () => {
    // In a real app, this would open a modal or form to add a new invitee
    const newId = nonVotingInvitees.length > 0 ? Math.max(...nonVotingInvitees.map(i => i.id)) + 1 : 1;
    setNonVotingInvitees([...nonVotingInvitees, { 
      id: newId, 
      name: "", 
      email: "", 
      role: "" 
    }]);
  };

  const removeVotingParticipant = (id) => {
    setVotingParticipants(votingParticipants.filter(p => p.id !== id));
  };

  const removeNonVotingInvitee = (id) => {
    setNonVotingInvitees(nonVotingInvitees.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">VOTING PARTICIPANTS</h3>
          <div className="space-x-2">
            <Button variant="outline">+ Add Manually</Button>
            <Button variant="outline">📤 Bulk Upload</Button>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Address</th>
                <th className="text-left p-2">Distinctive No.</th>
                <th className="text-left p-2">Shares/Voting %</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {votingParticipants.map((participant) => (
                <tr key={participant.id} className="border-t">
                  <td className="p-2">{participant.name}</td>
                  <td className="p-2">{participant.email}</td>
                  <td className="p-2">{participant.address}</td>
                  <td className="p-2">{participant.distinctiveNo}</td>
                  <td className="p-2">{participant.votingPercentage}</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeVotingParticipant(participant.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={6} className="p-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={addVotingParticipant}
                  >
                    + Add New Participant
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">NON-VOTING INVITEES</h3>
          <div className="space-x-2">
            <Button variant="outline">+ Add from Participants</Button>
            <Button variant="outline">+ Add Manually</Button>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {nonVotingInvitees.map((invitee) => (
                <tr key={invitee.id} className="border-t">
                  <td className="p-2">{invitee.name}</td>
                  <td className="p-2">{invitee.email}</td>
                  <td className="p-2">{invitee.role}</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeNonVotingInvitee(invitee.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="p-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={addNonVotingInvitee}
                  >
                    + Add New Invitee
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={nextStep}>Next: Documents →</Button>
      </div>
    </div>
  );
};

// Office Bearers Step
const OfficeBearers = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }) => {
  const [chairpersonSelection, setChairpersonSelection] = useState(formData.chairpersonSelection || 'select');
  const [secretarySelection, setSecretarySelection] = useState(formData.secretarySelection || 'select');
  const [scrutinizerSelection, setScrutinizerSelection] = useState(formData.scrutinizerSelection || 'select');
  const [enableVoting, setEnableVoting] = useState(formData.enableVoting || false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const participantOptions = formData.participants?.map(p => ({ value: p.id, label: p.name })) || [];
  const teamMembers = [
    { value: 'john-doe', label: 'John Doe (Team Member)' },
    { value: 'jane-smith', label: 'Jane Smith (Team Member)' },
  ];
  const allOptions = [...participantOptions, ...teamMembers];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Office Bearers</h3>
        <p className="text-sm text-muted-foreground mb-6">Define the key roles for this meeting</p>
      </div>

      {/* Chairperson Selection */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Chairperson of Meeting</Label>
              <span className="text-xs text-muted-foreground">Required</span>
            </div>
            
            <RadioGroup value={chairpersonSelection} onValueChange={(value) => {
              setChairpersonSelection(value);
              handleInputChange('chairpersonSelection', value);
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="select" id="chairperson-select" />
                <Label htmlFor="chairperson-select">Select Chairperson</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="during-meeting" id="chairperson-during" />
                <Label htmlFor="chairperson-during">Select Chairperson During Meeting</Label>
              </div>
            </RadioGroup>

            {chairpersonSelection === 'select' && (
              <div className="mt-4">
                <Label htmlFor="chairperson">Choose Chairperson:</Label>
                <Select 
                  value={formData.chairperson} 
                  onValueChange={(value) => handleInputChange('chairperson', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chairperson" />
                  </SelectTrigger>
                  <SelectContent>
                    {allOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Secretary and Scrutinizer cards would follow similar pattern */}
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button onClick={nextStep}>Next: Review →</Button>
      </div>
    </div>
  );
};

const Agenda = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }) => {
  const [agendaItems, setAgendaItems] = useState(formData.agendaItems || []);
  const [description, setDescription] = useState(formData.meetingDescription || '');
  const [useAI, setUseAI] = useState(formData.useAIAgenda || false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAgendaItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: 15,
      presenter: ''
    };
    const updatedItems = [...agendaItems, newItem];
    setAgendaItems(updatedItems);
    handleInputChange('agendaItems', updatedItems);
  };

  const updateAgendaItem = (id, field, value) => {
    const updatedItems = agendaItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setAgendaItems(updatedItems);
    handleInputChange('agendaItems', updatedItems);
  };

  const removeAgendaItem = (id) => {
    const updatedItems = agendaItems.filter(item => item.id !== id);
    setAgendaItems(updatedItems);
    handleInputChange('agendaItems', updatedItems);
  };

  const generateAISuggestions = () => {
    const suggestions = [
      {
        title: "Approval of Previous Meeting Minutes",
        description: "Review and approve the minutes from the last AGM",
        duration: 10
      },
      {
        title: "Financial Report Presentation",
        description: "Annual financial statements and auditor's report",
        duration: 30
      },
      {
        title: "Election of Board Members",
        description: "Election of directors for the upcoming term",
        duration: 45
      }
    ];
    setAiSuggestions(suggestions);
  };

  const acceptAISuggestion = (suggestion) => {
    const newItem = {
      id: Date.now().toString(),
      ...suggestion,
      presenter: ''
    };
    const updatedItems = [...agendaItems, newItem];
    setAgendaItems(updatedItems);
    handleInputChange('agendaItems', updatedItems);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Agenda & Explanatory Statement</h3>
        <p className="text-sm text-muted-foreground mb-6">Define the meeting agenda and provide explanatory details</p>
      </div>

      {/* Meeting Description */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Meeting Description/Explanation</Label>
            <textarea 
              className="w-full min-h-[120px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Provide a detailed explanation of the meeting purpose, background, and context..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                handleInputChange('meetingDescription', e.target.value);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">AI-Powered Agenda Generation</Label>
                <p className="text-sm text-muted-foreground mt-1">Generate agenda suggestions based on meeting type and history</p>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="use-ai" 
                  checked={useAI}
                  onChange={(e) => {
                    setUseAI(e.target.checked);
                    handleInputChange('useAIAgenda', e.target.checked);
                  }}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="use-ai">Enable AI</Label>
              </div>
            </div>
            
            {useAI && (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={generateAISuggestions}
                  className="w-full"
                >
                  🤖 Generate AI Suggestions
                </Button>
                
                {aiSuggestions.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">AI Suggestions:</Label>
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-900">{suggestion.title}</h4>
                            <p className="text-sm text-blue-700 mt-1">{suggestion.description}</p>
                            <span className="text-xs text-blue-600 mt-2 inline-block">
                              Duration: {suggestion.duration} minutes
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => acceptAISuggestion(suggestion)}
                            className="ml-4"
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agenda Items */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Agenda Items</Label>
              <Button onClick={addAgendaItem} size="sm">
                + Add Item
              </Button>
            </div>
            
            {agendaItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No agenda items added yet.</p>
                <p className="text-sm">Click "Add Item" to create your first agenda item.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {agendaItems.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">Item {index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeAgendaItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor={`title-${item.id}`}>Title *</Label>
                        <Input 
                          id={`title-${item.id}`}
                          placeholder="Agenda item title"
                          value={item.title}
                          onChange={(e) => updateAgendaItem(item.id, 'title', e.target.value)}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor={`description-${item.id}`}>Description</Label>
                        <textarea 
                          id={`description-${item.id}`}
                          className="w-full min-h-[80px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Detailed description of the agenda item..."
                          value={item.description}
                          onChange={(e) => updateAgendaItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`duration-${item.id}`}>Duration (minutes)</Label>
                        <Input 
                          id={`duration-${item.id}`}
                          type="number"
                          placeholder="15"
                          value={item.duration}
                          onChange={(e) => updateAgendaItem(item.id, 'duration', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`presenter-${item.id}`}>Presenter</Label>
                        <Input 
                          id={`presenter-${item.id}`}
                          placeholder="Presenter name"
                          value={item.presenter}
                          onChange={(e) => updateAgendaItem(item.id, 'presenter', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button onClick={nextStep}>Next: office bearers →</Button>
      </div>
    </div>
  );
};

const Documents = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }) => {
  const [lastMeetingOption, setLastMeetingOption] = useState(formData.lastMeetingOption || 'manual');
  const [additionalDocs, setAdditionalDocs] = useState(formData.additionalDocuments || []);
  const [reminderSettings, setReminderSettings] = useState(formData.reminderSettings || {
    enabled: false,
    date: null,
    type: 'one-time',
    frequency: 'daily',
    channels: ['email']
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      handleInputChange(`lastMeeting${type}`, {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        uploadDate: new Date().toISOString()
      });
    }
  };

  const addAdditionalDocument = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newDoc = {
          id: Date.now().toString(),
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type,
          uploadDate: new Date().toISOString()
        };
        const updatedDocs = [...additionalDocs, newDoc];
        setAdditionalDocs(updatedDocs);
        handleInputChange('additionalDocuments', updatedDocs);
      }
    };
    input.click();
  };

  const removeDocument = (id) => {
    const updatedDocs = additionalDocs.filter(doc => doc.id !== id);
    setAdditionalDocs(updatedDocs);
    handleInputChange('additionalDocuments', updatedDocs);
  };

  const updateReminderSettings = (field, value) => {
    const updated = { ...reminderSettings, [field]: value };
    setReminderSettings(updated);
    handleInputChange('reminderSettings', updated);
  };

  const toggleChannel = (channel) => {
    const channels = reminderSettings.channels.includes(channel)
      ? reminderSettings.channels.filter(c => c !== channel)
      : [...reminderSettings.channels, channel];
    updateReminderSettings('channels', channels);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Last Meeting Details & Documents</h3>
        <p className="text-sm text-muted-foreground mb-6">Upload previous meeting documents and configure reminders</p>
      </div>

      {/* Last Meeting Details */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Last Meeting Details</Label>
            <p className="text-sm text-muted-foreground">Update details of previously held meetings for the selected entity</p>
            
            <RadioGroup value={lastMeetingOption} onValueChange={(value) => {
              setLastMeetingOption(value);
              handleInputChange('lastMeetingOption', value);
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual-upload" />
                <Label htmlFor="manual-upload">Manual Upload</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system-generated" />
                <Label htmlFor="system-generated">System Generated (from previous meetings)</Label>
              </div>
            </RadioGroup>

            {lastMeetingOption === 'manual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <Label>Minutes of Meeting (MoM)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload('MoM', e)}
                      className="hidden"
                      id="mom-upload"
                    />
                    <label htmlFor="mom-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          📄
                        </div>
                        <p className="text-sm font-medium">Upload MoM</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    </label>
                    {formData.lastMeetingMoM && (
                      <div className="mt-3 p-2 bg-green-50 rounded text-sm">
                        ✓ {formData.lastMeetingMoM.name}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Meeting Notice</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload('Notice', e)}
                      className="hidden"
                      id="notice-upload"
                    />
                    <label htmlFor="notice-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          📄
                        </div>
                        <p className="text-sm font-medium">Upload Notice</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    </label>
                    {formData.lastMeetingNotice && (
                      <div className="mt-3 p-2 bg-green-50 rounded text-sm">
                        ✓ {formData.lastMeetingNotice.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {lastMeetingOption === 'system' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <Label>Previous Meeting MoM</Label>
                  <Select onValueChange={(value) => handleInputChange('selectedPreviousMoM', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select previous MoM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agm-2023-mom">AGM 2023 - Minutes</SelectItem>
                      <SelectItem value="board-q4-mom">Board Meeting Q4 - Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Previous Meeting Notice</Label>
                  <Select onValueChange={(value) => handleInputChange('selectedPreviousNotice', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select previous notice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agm-2023-notice">AGM 2023 - Notice</SelectItem>
                      <SelectItem value="board-q4-notice">Board Meeting Q4 - Notice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Documents */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Additional Documents & Attachments</Label>
                <p className="text-sm text-muted-foreground mt-1">Upload supporting documents for the meeting</p>
              </div>
              <Button onClick={addAdditionalDocument} size="sm">
                + Add Document
              </Button>
            </div>
            
            {additionalDocs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No additional documents uploaded.</p>
                <p className="text-sm">Click "Add Document" to upload supporting files.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {additionalDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        📄
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reminder Settings */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Reminder Settings</Label>
                <p className="text-sm text-muted-foreground mt-1">Set up notifications for meeting participants</p>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="enable-reminders" 
                  checked={reminderSettings.enabled}
                  onChange={(e) => updateReminderSettings('enabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="enable-reminders">Enable Reminders</Label>
              </div>
            </div>
            
            {reminderSettings.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <Label>Reminder Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !reminderSettings.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reminderSettings.date ? format(new Date(reminderSettings.date), "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={reminderSettings.date ? new Date(reminderSettings.date) : undefined}
                        onSelect={(date) => updateReminderSettings('date', date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-3">
                  <Label>Reminder Type</Label>
                  <Select value={reminderSettings.type} onValueChange={(value) => updateReminderSettings('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One Time</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {reminderSettings.type === 'recurring' && (
                  <div className="space-y-3">
                    <Label>Frequency</Label>
                    <Select value={reminderSettings.frequency} onValueChange={(value) => updateReminderSettings('frequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Label>Notification Channels</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="email-channel" 
                        checked={reminderSettings.channels.includes('email')}
                        onChange={() => toggleChannel('email')}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="email-channel">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="sms-channel" 
                        checked={reminderSettings.channels.includes('sms')}
                        onChange={() => toggleChannel('sms')}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="sms-channel">SMS</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button onClick={nextStep}>Next: Agenda →</Button>
      </div>
    </div>
  );
};

const Review = ({ formData, setFormData, prevStep, saveAsDraft, submitMeeting }) => {
  const [noticeContent, setNoticeContent] = useState(formData.noticeContent || '');
  const [generateAINotice, setGenerateAINotice] = useState(formData.generateAINotice || false);
  const [signatureMethod, setSignatureMethod] = useState('physical');
  const [additionalSignatories, setAdditionalSignatories] = useState([]);
  const [circulationOptions, setCirculationOptions] = useState({
    sendEmail: true,
    additionalEmails: '',
    printLabels: false,
    offlinePublished: false
  });
  const [showNoticePreview, setShowNoticePreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateAINoticeContent = () => {
    // Simulate AI notice generation based on meeting details
    const aiGeneratedNotice = `
NOTICE OF ${formData.meetingClass?.toUpperCase() || 'MEETING'}

Notice is hereby given that the ${formData.meetingClass || 'Meeting'} of ${formData.entity || 'Company'} will be held on ${formData.meetingDate ? format(new Date(formData.meetingDate), 'PPP') : '[Date]'} at ${formData.meetingTime || '[Time]'}.

AGENDA:
${formData.agendaItems?.map((item, index) => `${index + 1}. ${item.title}`).join('\n') || 'To be updated'}

By Order of the Board
[Secretary Name]
Company Secretary

Place: [Location]
Date: ${format(new Date(), 'PPP')}
    `;
    setNoticeContent(aiGeneratedNotice);
    handleInputChange('noticeContent', aiGeneratedNotice);
  };

  const addSignatory = () => {
    const newSignatory = {
      id: Date.now().toString(),
      name: '',
      email: '',
      role: 'Director'
    };
    setAdditionalSignatories([...additionalSignatories, newSignatory]);
  };

  const updateSignatory = (id, field, value) => {
    setAdditionalSignatories(prev => 
      prev.map(sig => sig.id === id ? { ...sig, [field]: value } : sig)
    );
  };

  const removeSignatory = (id) => {
    setAdditionalSignatories(prev => prev.filter(sig => sig.id !== id));
  };

  const totalDuration = formData.agendaItems?.reduce((total, item) => total + (item.duration || 0), 0) || 0;
  const participantCount = formData.participants?.length || 0;
  const votingParticipants = formData.participants?.filter(p => p.isVoting)?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Review & Create Notice</h3>
        <p className="text-sm text-muted-foreground mb-6">Review all meeting details and create the meeting notice</p>
      </div>

      {/* Meeting Summary */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Meeting Summary</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Entity</Label>
                  <p className="text-sm">{formData.entity || 'Not selected'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Meeting Class</Label>
                  <p className="text-sm">{formData.meetingClass || 'Not selected'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Meeting Type</Label>
                  <p className="text-sm">{formData.meetingType || 'Not selected'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nature</Label>
                  <p className="text-sm">{formData.meetingNature || 'Not selected'}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date & Time</Label>
                  <p className="text-sm">
                    {formData.meetingDate ? format(new Date(formData.meetingDate), 'PPP') : 'Not set'}
                    {formData.meetingTime && ` at ${formData.meetingTime}`}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Participants</Label>
                  <p className="text-sm">{participantCount} total ({votingParticipants} voting)</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Agenda Items</Label>
                  <p className="text-sm">{formData.agendaItems?.length || 0} items ({totalDuration} min total)</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Quorum</Label>
                  <p className="text-sm">{formData.quorum || 51}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Bearers Summary */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Office Bearers</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Chairperson</Label>
                <p className="text-sm">
                  {formData.chairpersonSelection === 'during-meeting' 
                    ? 'To be selected during meeting' 
                    : formData.chairperson || 'Not selected'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Secretary</Label>
                <p className="text-sm">
                  {formData.secretarySelection === 'no-secretary' 
                    ? 'No Secretary' 
                    : formData.secretarySelection === 'during-meeting'
                    ? 'To be selected during meeting'
                    : formData.secretary || 'Not selected'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Scrutinizer</Label>
                <p className="text-sm">
                  {formData.scrutinizerSelection === 'no-scrutinizer' 
                    ? 'No Scrutinizer' 
                    : formData.scrutinizerSelection === 'during-meeting'
                    ? 'To be selected during meeting'
                    : formData.scrutinizer || 'Not selected'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notice Content */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Notice Content</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="generate-ai-notice" 
                    checked={generateAINotice}
                    onChange={(e) => {
                      setGenerateAINotice(e.target.checked);
                      handleInputChange('generateAINotice', e.target.checked);
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="generate-ai-notice">Use AI Generation</Label>
                </div>
                {generateAINotice && (
                  <Button onClick={generateAINoticeContent} size="sm">
                    🤖 Generate Notice
                  </Button>
                )}
              </div>
            </div>
            
            <textarea 
              className="w-full min-h-[300px] p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              placeholder="Enter the meeting notice content here..."
              value={noticeContent}
              onChange={(e) => {
                setNoticeContent(e.target.value);
                handleInputChange('noticeContent', e.target.value);
              }}
            />
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowNoticePreview(!showNoticePreview)}
                size="sm"
              >
                {showNoticePreview ? 'Hide Preview' : 'Preview Notice'}
              </Button>
            </div>
            
            {showNoticePreview && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <Label className="text-sm font-medium text-gray-600">Notice Preview:</Label>
                <div className="mt-2 whitespace-pre-wrap text-sm font-mono">
                  {noticeContent || 'No content to preview'}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Signature Settings */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Signature of Notice</Label>
            <p className="text-sm text-muted-foreground">Configure how the notice will be signed</p>
            
            <RadioGroup value={signatureMethod} onValueChange={setSignatureMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="physical" id="physical-signature" />
                <Label htmlFor="physical-signature">Physical Signature (Download, Sign & Upload)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="digital" id="digital-signature" />
                <Label htmlFor="digital-signature">Digital/E-sign (Third-party system)</Label>
              </div>
            </RadioGroup>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Additional Signatories</Label>
                <Button onClick={addSignatory} size="sm">
                  + Add Signatory
                </Button>
              </div>
              
              {additionalSignatories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No additional signatories added
                </p>
              ) : (
                <div className="space-y-3">
                  {additionalSignatories.map((signatory) => (
                    <div key={signatory.id} className="p-3 border rounded-lg bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input 
                          placeholder="Name"
                          value={signatory.name}
                          onChange={(e) => updateSignatory(signatory.id, 'name', e.target.value)}
                        />
                        <Input 
                          placeholder="Email"
                          type="email"
                          value={signatory.email}
                          onChange={(e) => updateSignatory(signatory.id, 'email', e.target.value)}
                        />
                        <div className="flex space-x-2">
                          <Select 
                            value={signatory.role} 
                            onValueChange={(value) => updateSignatory(signatory.id, 'role', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Director">Director</SelectItem>
                              <SelectItem value="Secretary">Secretary</SelectItem>
                              <SelectItem value="Chairperson">Chairperson</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeSignatory(signatory.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Circulation Options */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Circulation of Notice</Label>
            <p className="text-sm text-muted-foreground">Configure how the notice will be circulated</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="send-email" 
                  checked={circulationOptions.sendEmail}
                  onChange={(e) => setCirculationOptions(prev => ({ ...prev, sendEmail: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="send-email">Send email to participants</Label>
              </div>
              
              <div>
                <Label htmlFor="additional-emails">Additional Email Addresses</Label>
                <textarea 
                  id="additional-emails"
                  className="w-full min-h-[80px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter additional email addresses (one per line)"
                  value={circulationOptions.additionalEmails}
                  onChange={(e) => setCirculationOptions(prev => ({ ...prev, additionalEmails: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="print-labels" 
                  checked={circulationOptions.printLabels}
                  onChange={(e) => setCirculationOptions(prev => ({ ...prev, printLabels: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="print-labels">Print delivery labels for participants</Label>
              </div>
              
              {/* <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="offline-published" 
                  checked={circulationOptions.offlinePublished}
                  onChange={(e) => setCirculationOptions(prev => ({ ...prev, offlinePublished: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="offline-published">Offline Published (Newspaper)</Label>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button onClick={submitMeeting} className="bg-primary text-primary-foreground">
          <CheckCircle className="w-4 h-4 mr-2" />
          Create & Circulate Meeting
        </Button>
      </div>
    </div>
  );
};

const CreateMeetingContent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    entity: "acme",
    meetingClass: "AGM",
    meetingNumber: 1,
    meetingType: "original",
    meetingNature: "virtual",
    virtualMeetingOption: "generate",
    quorum: 51
  });

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const saveAsDraft = () => {
    // In a real app, this would save the meeting data to a database
    console.log("Saving meeting as draft:", formData);
    // Navigate back to meetings list
    navigate("/meetings");
  };

  const submitMeeting = () => {
    // In a real app, this would submit the meeting data to a database
    console.log("Submitting meeting:", formData);
    // Navigate back to meetings list
    navigate("/meetings");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EntityAndMeetingDetails 
            formData={formData} 
            setFormData={setFormData} 
            nextStep={nextStep} 
            saveAsDraft={saveAsDraft} 
          />
        );
      case 2:
        return (
          <EntityAndMeetingDetails 
            formData={formData} 
            setFormData={setFormData} 
            nextStep={nextStep} 
            saveAsDraft={saveAsDraft} 
          />
        );
      case 3:
        return (
          <ParticipantsManagement 
            formData={formData} 
            setFormData={setFormData} 
            prevStep={prevStep} 
            nextStep={nextStep} 
            saveAsDraft={saveAsDraft} 
          />
        );
      case 4:
        return (
          <Documents 
            formData={formData} 
            setFormData={setFormData} 
            prevStep={prevStep} 
            nextStep={nextStep} 
            saveAsDraft={saveAsDraft} 
          />
        );
      case 5:
        return (
          <Agenda 
            formData={formData} 
            setFormData={setFormData} 
            prevStep={prevStep} 
            nextStep={nextStep} 
            saveAsDraft={saveAsDraft} 
          />
        );
      case 6:
        return (
          <OfficeBearers 
            formData={formData} 
            setFormData={setFormData} 
            prevStep={prevStep} 
            nextStep={nextStep} 
            saveAsDraft={saveAsDraft} 
          />
        );
      case 7:
        return (
          <Review 
            formData={formData} 
            setFormData={setFormData} 
            prevStep={prevStep} 
            saveAsDraft={saveAsDraft} 
            submitMeeting={submitMeeting} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Meeting</h1>
          <p className="text-muted-foreground">Set up your meeting details and participants</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
            Step {currentStep} of 7
          </div>
          <Button variant="outline" onClick={() => navigate('/meetings')}>
            Cancel
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border rounded-lg">
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

const CreateMeeting = () => {
  return (
    <DashboardLayout userType="service_provider">
      <CreateMeetingContent />
    </DashboardLayout>
  );
};

export default CreateMeeting;

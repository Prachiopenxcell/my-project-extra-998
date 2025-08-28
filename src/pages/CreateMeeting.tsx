import { useState, useEffect } from "react";
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
import { ReminderDialog } from "@/components/notifications/ReminderDialog";
import { useRecurringReminder } from "@/hooks/useRecurringReminder";
import { useSubscription } from "@/contexts/SubscriptionContext";

// Step components
const EntityAndMeetingDetails = ({ formData, setFormData, nextStep, saveAsDraft }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

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
            <Button onClick={() => navigate('/create-entity')} variant="outline">+ Create New Entity</Button>
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
  // Signature of Notice (moved from Review step)
  const [signatureMethod, setSignatureMethod] = useState(formData.signatureMethod || 'physical');
  const [additionalSignatories, setAdditionalSignatories] = useState(formData.additionalSignatories || []);
  const [generateAINotice, setGenerateAINotice] = useState(formData.generateAINotice || false);
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  
  // Get template data for visual design
  const getTemplateData = () => {
    const meetingDate = formData.meetingDate ? format(new Date(formData.meetingDate), 'PPP') : '___day, the__ August 2025';
    const meetingTime = formData.meetingTime || '12:45 PM';
    const entityName = formData.entityName || 'THE ABC PRIVATE LIMITED';
    const venue = formData.venue || '_________ Rajasthan - 313001';
    
    return {
      noticeNumber: 'No. ______________ ________ 2025',
      entityName,
      meetingDate,
      meetingTime,
      venue,
      serialNumber: '02/2025-2026',
      agendaItems: [
        { id: 1, title: 'To grant Leave of absence.' },
        { id: 2, title: 'To take note of and sign the Minutes of the preceding Board of Directors Meeting held on 12th April 2025.' },
        {
          id: 3,
          title: 'To consider and approve:',
          subItems: [
            'Financial Statements for the year ended 31st March 2025.',
            'Recommendation of Dividend.',
            'Recommendation for Regularization of the Additional Director.',
            'Directors\' Report.'
          ]
        },
        { id: 4, title: 'To fix the date of the ___ Annual General Meeting of the Company and to approve the Notice to the Shareholders for the said Annual General Meeting.' },
        { id: 5, title: 'Any other matter with the permission of the Chair.' }
      ],
      agendaNotes: [
        { items: '1 & 2', note: 'Self Explanatory.' },
        {
          items: '3',
          note: '(a) Consideration and approval by Board of Directors of the audited consolidated/standalone financial Statements of the company for the year ended 31st March 2025.\n\n(b) Self Explanatory.\n\n(c) The tenure of Shri Ram as an Additional Director will conclude at the forthcoming Annual General Meeting of the Company. The Board of Directors may propose his appointment as a Director, liable to retire by rotation, for the approval of the Shareholders. Shri Ram is deemed to be interested in this agenda item to the extent of his own appointment.\n\n(d) Self Explanatory.'
        },
        { items: '4, 5 & 6', note: 'Self Explanatory.' }
      ]
    };
  };
  
  const [templateData, setTemplateData] = useState(getTemplateData());
  const [editableFields, setEditableFields] = useState({
    noticeNumber: templateData.noticeNumber,
    entityName: templateData.entityName,
    venue: templateData.venue,
    agendaItems: templateData.agendaItems,
    agendaNotes: templateData.agendaNotes
  });
  const { hasModuleAccess, loading } = useSubscription();
  // Dev override: assume subscription exists for E-Voting
  const DEV_ASSUME_VOTING = true;
  const hasVotingAccess = DEV_ASSUME_VOTING || hasModuleAccess('e-voting');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Signatory handlers persisted to formData
  const addSignatory = () => {
    const newSignatory = { id: Date.now().toString(), name: '', email: '', role: 'Director' };
    const next = [...additionalSignatories, newSignatory];
    setAdditionalSignatories(next);
    handleInputChange('additionalSignatories', next);
  };

  const updateSignatory = (id, field, value) => {
    const next = additionalSignatories.map(sig => sig.id === id ? { ...sig, [field]: value } : sig);
    setAdditionalSignatories(next);
    handleInputChange('additionalSignatories', next);
  };

  const removeSignatory = (id) => {
    const next = additionalSignatories.filter(sig => sig.id !== id);
    setAdditionalSignatories(next);
    handleInputChange('additionalSignatories', next);
  };

  const downloadNoticeFromOfficeBearers = () => {
    // Generate comprehensive notice content
    const noticeContent = `
NOTICE OF MEETING

${templateData.entityName}
${templateData.noticeNumber}

Date: ${templateData.meetingDate}
Time: ${templateData.meetingTime}
Venue: ${templateData.venue}

AGENDA:
${templateData.agendaItems.map((item, index) => {
  if (item.subItems) {
    return `${index + 1}. ${item.title}\n${item.subItems.map(sub => `   • ${sub}`).join('\n')}`;
  }
  return `${index + 1}. ${item.title}`;
}).join('\n\n')}

EXPLANATORY NOTES:
${templateData.agendaNotes.map(note => `Items ${note.items}: ${note.note}`).join('\n\n')}

${formData.explanatoryStatement ? `\nEXPLANATORY STATEMENT:\n${formData.explanatoryStatement}` : ''}

OFFICE BEARERS:
Chairperson: ${formData.chairperson ? 'Selected' : 'To be selected during meeting'}
Secretary: ${formData.secretary ? 'Selected' : 'To be selected during meeting'}
${formData.scrutinizer ? 'Scrutinizer: Selected' : ''}

By Order of the Board
${formData.secretary || 'Company Secretary'}
    `.trim();

    // Create and download the notice
    const blob = new Blob([noticeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Meeting_Notice_${templateData.entityName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Notice Downloaded",
      description: "Meeting notice has been downloaded successfully.",
    });
  };
  const generateAINoticeContent = () => {
    // Simulate AI notice generation based on meeting details
    const aiGeneratedData = {
      ...templateData,
      entityName: formData.entity || 'Company',
      meetingDate: formData.meetingDate ? format(new Date(formData.meetingDate), 'PPP') : '[Date]',
      meetingTime: formData.meetingTime || '[Time]',
      agendaItems: formData.agendaItems?.map((item, index) => ({
        id: index + 1,
        title: item.title
      })) || templateData.agendaItems
    };
    setTemplateData(aiGeneratedData);
    setEditableFields({
      noticeNumber: aiGeneratedData.noticeNumber,
      entityName: aiGeneratedData.entityName,
      venue: aiGeneratedData.venue,
      agendaItems: aiGeneratedData.agendaItems,
      agendaNotes: aiGeneratedData.agendaNotes
    });
    handleInputChange('templateData', aiGeneratedData);
  };

  const handleEditNotice = () => {
    setIsEditingNotice(true);
  };

  const handleSaveNotice = () => {
    // Update template data with edited fields
    const updatedData = {
      ...templateData,
      noticeNumber: editableFields.noticeNumber,
      entityName: editableFields.entityName,
      venue: editableFields.venue,
      agendaItems: editableFields.agendaItems,
      agendaNotes: editableFields.agendaNotes
    };
    setTemplateData(updatedData);
    handleInputChange('templateData', updatedData);
    setIsEditingNotice(false);
    toast({ title: "Notice content saved successfully" });
  };

  const handleCancelEdit = () => {
    // Reset editable fields to original template data
    setEditableFields({
      noticeNumber: templateData.noticeNumber,
      entityName: templateData.entityName,
      venue: templateData.venue,
      agendaItems: templateData.agendaItems,
      agendaNotes: templateData.agendaNotes
    });
    setIsEditingNotice(false);
  };

  // Update template data when form data changes
  const updateTemplateData = () => {
    const updatedData = getTemplateData();
    setTemplateData(updatedData);
    setEditableFields({
      noticeNumber: updatedData.noticeNumber,
      entityName: updatedData.entityName,
      venue: updatedData.venue,
      agendaItems: updatedData.agendaItems,
      agendaNotes: updatedData.agendaNotes
    });
    handleInputChange('templateData', updatedData);
  };

  const handleFieldChange = (field, value) => {
    setEditableFields(prev => ({ ...prev, [field]: value }));
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
      {/* Secretary Selection */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Secretary of Meeting</Label>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>

            <RadioGroup value={secretarySelection} onValueChange={(value) => {
              setSecretarySelection(value);
              handleInputChange('secretarySelection', value);
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="select" id="secretary-select" />
                <Label htmlFor="secretary-select">Select Secretary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="during-meeting" id="secretary-during" />
                <Label htmlFor="secretary-during">Select Secretary During Meeting</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="secretary-none" />
                <Label htmlFor="secretary-none">No Secretary</Label>
              </div>
            </RadioGroup>

            {secretarySelection === 'select' && (
              <div className="mt-4">
                <Label htmlFor="secretary">Choose Secretary:</Label>
                <Select 
                  value={formData.secretary}
                  onValueChange={(value) => handleInputChange('secretary', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select secretary (Participants / Team / COC)" />
                  </SelectTrigger>
                  <SelectContent>
                    {allOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                    {/* Mock COC list entries */}
                    <SelectItem value="coc-1">COC Member 1</SelectItem>
                    <SelectItem value="coc-2">COC Member 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scrutinizer Selection */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Scrutinizer of Meeting</Label>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>

            <RadioGroup value={scrutinizerSelection} onValueChange={(value) => {
              setScrutinizerSelection(value);
              handleInputChange('scrutinizerSelection', value);
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="select" id="scrutinizer-select" />
                <Label htmlFor="scrutinizer-select">Select Scrutinizer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="during-meeting" id="scrutinizer-during" />
                <Label htmlFor="scrutinizer-during">Select Scrutinizer During Meeting</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="scrutinizer-none" />
                <Label htmlFor="scrutinizer-none">No Scrutinizer</Label>
              </div>
            </RadioGroup>

            {scrutinizerSelection === 'select' && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label className="text-sm">Select From</Label>
                  <Select
                    value={formData.scrutinizerSource || ''}
                    onValueChange={(value) => handleInputChange('scrutinizerSource', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participant">Participants</SelectItem>
                      <SelectItem value="chairperson">Chairperson</SelectItem>
                      <SelectItem value="secretary">Secretary</SelectItem>
                      <SelectItem value="third-party">Third Party</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.scrutinizerSource === 'participant' && (
                  <div>
                    <Label htmlFor="scrutinizer">Choose Participant as Scrutinizer:</Label>
                    <Select 
                      value={formData.scrutinizer}
                      onValueChange={(value) => handleInputChange('scrutinizer', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select participant" />
                      </SelectTrigger>
                      <SelectContent>
                        {participantOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.scrutinizerSource === 'chairperson' && (
                  <div className="text-sm text-muted-foreground">
                    Scrutinizer will be the selected Chairperson{formData.chairperson ? ` (${formData.chairperson})` : ''}.
                  </div>
                )}

                {formData.scrutinizerSource === 'secretary' && (
                  <div className="text-sm text-muted-foreground">
                    Scrutinizer will be the selected Secretary{formData.secretary ? ` (${formData.secretary})` : ''}.
                  </div>
                )}

                {formData.scrutinizerSource === 'third-party' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="thirdPartyName">Name</Label>
                      <Input
                        id="thirdPartyName"
                        value={formData.scrutinizerThirdPartyName || ''}
                        onChange={(e) => handleInputChange('scrutinizerThirdPartyName', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="thirdPartyContact">Contact No.</Label>
                      <Input
                        id="thirdPartyContact"
                        value={formData.scrutinizerThirdPartyContact || ''}
                        onChange={(e) => handleInputChange('scrutinizerThirdPartyContact', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="thirdPartyEmail">Email</Label>
                      <Input
                        id="thirdPartyEmail"
                        type="email"
                        value={formData.scrutinizerThirdPartyEmail || ''}
                        onChange={(e) => handleInputChange('scrutinizerThirdPartyEmail', e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Notice Content */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Notice Content</Label>
                <p className="text-sm text-muted-foreground mt-1">Pre-built template with meeting details</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={updateTemplateData} size="sm" variant="outline">
                  Refresh Template
                </Button>
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
                  <Label htmlFor="generate-ai-notice" className="text-sm">Use AI Generation</Label>
                </div>
                {generateAINotice && (
                  <Button onClick={generateAINoticeContent} size="sm">
                    🤖 Generate Notice
                  </Button>
                )}
              </div>
            </div>
            
            <div className="border rounded-lg">
              <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Notice Template</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="default" 
                    onClick={downloadNoticeFromOfficeBearers}
                    size="sm"
                    className="h-8 px-3 bg-green-600 hover:bg-green-700"
                  >
                    <span className="text-xs">📄 Download Notice</span>
                  </Button>
                  {!isEditingNotice ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleEditNotice}
                      size="sm"
                      className="h-8 px-3"
                    >
                      <span className="text-xs">Edit</span>
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        onClick={handleCancelEdit}
                        size="sm"
                        className="h-8 px-3 text-muted-foreground"
                      >
                        <span className="text-xs">Cancel</span>
                      </Button>
                      <Button 
                        onClick={handleSaveNotice}
                        size="sm"
                        className="h-8 px-3 bg-primary text-primary-foreground"
                      >
                        <span className="text-xs">Save</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {!isEditingNotice ? (
                <div className="p-6 bg-white max-h-96 overflow-y-auto">
                  {/* Notice Header */}
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-600 mb-4">{templateData.noticeNumber}</div>
                    <div className="bg-blue-900 text-white py-3 px-6 font-bold text-lg tracking-wide">
                      NOTICE OF MEETING OF BOARD OF DIRECTORS
                    </div>
                  </div>

                  {/* Main Notice Content */}
                  <div className="space-y-4 text-sm leading-relaxed">
                    <p>
                      Notice is hereby given that a Meeting of the Board of Directors
                      (Serial No. {templateData.serialNumber}) of <strong>{templateData.entityName}</strong> will be held at
                      <strong> {templateData.meetingTime}</strong> on <strong>{templateData.meetingDate}</strong> at registered office of the
                      Company at <strong>{templateData.venue}</strong> to transact following business:
                    </p>

                    {/* Agenda Section */}
                    <div className="mt-6">
                      <div className="bg-gray-100 border-2 border-gray-300 py-2 px-4 text-center font-semibold mb-4">
                        AGENDA
                      </div>
                      <div className="space-y-3">
                        {templateData.agendaItems.map((item) => (
                          <div key={item.id} className="flex">
                            <span className="font-medium mr-2">{item.id}.</span>
                            <div className="flex-1">
                              <span>{item.title}</span>
                              {item.subItems && (
                                <div className="mt-2 ml-4 border border-gray-300 p-3 bg-gray-50">
                                  {item.subItems.map((subItem, index) => (
                                    <div key={index} className="mb-1">
                                      <span className="font-medium">{String.fromCharCode(97 + index)})</span> {subItem}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Note */}
                    <div className="mt-6">
                      <div className="bg-gray-100 border-2 border-gray-300 py-2 px-4 text-center font-semibold mb-3">
                        SPECIAL NOTE
                      </div>
                      <p className="mb-3">
                        Directors have an option to attend the meeting through Video Conferencing,
                        details of which shall be provided in due course.
                      </p>
                      <p>
                        You are requested to make it convenient to attend the Meeting of the
                        Board of Directors.
                      </p>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-6">
                      <div className="bg-gray-100 border-2 border-gray-300 py-2 px-4 text-center font-semibold mb-4">
                        SIGNATURE
                      </div>
                      <div className="mb-4">
                        <p>Company Secretary</p>
                        <p>M. No.______________________</p>
                      </div>
                      <p className="text-sm">Enclosed: Notes on Agenda.</p>
                    </div>

                    {/* Agenda Notes Section */}
                    <div className="mt-8 border-t-2 pt-6">
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-600 mb-2">31 July 2025</div>
                        <div className="bg-blue-900 text-white py-3 px-6 font-bold text-lg tracking-wide">
                          NOTES ON AGENDA OF NOTICE OF BOARD MEETING
                        </div>
                        <div className="bg-blue-900 text-white py-1 px-6 text-sm">
                          (Serial No.{templateData.serialNumber})
                        </div>
                      </div>

                      <div className="bg-gray-100 border-2 border-gray-300 py-2 px-4 text-center font-semibold mb-4">
                        AGENDA NOTES
                      </div>

                      {templateData.agendaNotes.map((note, index) => (
                        <div key={index} className="mb-4">
                          <div className="font-medium mb-2">Agenda No. {note.items}</div>
                          <div className="border border-gray-300 p-3 bg-gray-50 whitespace-pre-line">
                            {note.note}
                          </div>
                        </div>
                      ))}

                      <div className="mt-6">
                        <div className="bg-gray-100 border-2 border-gray-300 py-2 px-4 text-center font-semibold mb-4">
                          SIGNATURE
                        </div>
                        <div>
                          <p>Company Secretary</p>
                          <p>M. No.______________________</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-white max-h-96 overflow-y-auto space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Notice Number</Label>
                      <Input
                        value={editableFields.noticeNumber}
                        onChange={(e) => handleFieldChange('noticeNumber', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Entity Name</Label>
                      <Input
                        value={editableFields.entityName}
                        onChange={(e) => handleFieldChange('entityName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Venue</Label>
                      <Input
                        value={editableFields.venue}
                        onChange={(e) => handleFieldChange('venue', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signature of Notice (moved up from Review step) */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Signature of Notice</Label>
            <p className="text-sm text-muted-foreground">Configure how the notice will be signed</p>

            <RadioGroup value={signatureMethod} onValueChange={(v) => { setSignatureMethod(v); handleInputChange('signatureMethod', v); }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="physical" id="ob-physical-signature" />
                <Label htmlFor="ob-physical-signature">Physical Signature (Download, Sign & Upload)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="digital" id="ob-digital-signature" />
                <Label htmlFor="ob-digital-signature">Digital/E-sign (Third-party system)</Label>
              </div>
            </RadioGroup>

            {signatureMethod === 'physical' && (
              <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                <Label className="text-sm font-medium">Upload Signed Notice</Label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    id="physical-signature-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleInputChange('physicalSignatureFile', file);
                        handleInputChange('physicalSignatureFileName', file.name);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('physical-signature-upload')?.click()}
                  >
                    Upload File
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {formData.physicalSignatureFileName || 'No file selected'}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Additional Signatories</Label>
                <Button onClick={addSignatory} size="sm">+ Add Signatory</Button>
              </div>

              {additionalSignatories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No additional signatories added</p>
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
                        {signatory.role === "Other" && (
                          <div className="mt-2">
                            <Input 
                              placeholder="Specify role"
                              value={signatory.customRole || ''}
                              onChange={(e) => updateSignatory(signatory.id, 'customRole', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

     
      
      {/* Enable E-Voting */}
      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <Label className="text-base font-medium">Enable E-Voting</Label>
              <p className="text-sm text-muted-foreground mt-1">Allow participants to vote electronically for this meeting</p>
              {!loading && !hasVotingAccess && (
                <p className="text-xs text-red-600 mt-2">Requires E-Voting subscription. Visit Subscription to enable.</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enable-voting"
                checked={!!formData.enableVoting}
                disabled={!hasVotingAccess}
                onChange={(e) => {
                  const checked = e.target.checked;
                  handleInputChange('enableVoting', checked);
                  if (checked) {
                    if (hasVotingAccess) {
                      navigate('/voting/create');
                    } else {
                      toast({
                        title: 'E-Voting not available',
                        description: 'Your subscription does not include E-Voting. Please upgrade to use this feature.',
                        variant: 'destructive'
                      });
                    }
                  }
                }}
                className="rounded border-gray-300"
              />
              <Label htmlFor="enable-voting">Enable EVoting</Label>
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
        <Button onClick={nextStep}>Next: Review →</Button>
      </div>
    </div>
  );
};

const Agenda = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }) => {
  const [agendaItems, setAgendaItems] = useState(formData.agendaItems || []);
  const [additionalDocs, setAdditionalDocs] = useState(formData.additionalDocuments || []);
  const [description, setDescription] = useState(formData.meetingDescription || '');
  const [useAI, setUseAI] = useState(formData.useAIAgenda || false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [explanatoryStatement, setExplanatoryStatement] = useState(formData.explanatoryStatement || '');
  const [aiExplanatoryStatements, setAiExplanatoryStatements] = useState([]);

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

  const generateAIExplanatoryStatements = () => {
    const statements = [
      {
        id: 1,
        title: "Annual Financial Review Statement",
        content: `Dear Shareholders,

The Board of Directors is pleased to present the Annual Financial Statements for the financial year ended March 31, 2024. The company has demonstrated strong performance with a revenue growth of 15% compared to the previous year.

Key highlights include:
• Total revenue increased to ₹125 crores from ₹108 crores
• Net profit margin improved to 12.5%
• Successful expansion into two new markets
• Investment in digital transformation initiatives

The audited financial statements, along with the auditor's report, are enclosed for your review and approval.`
      },
      {
        id: 2,
        title: "Board Composition and Governance Statement",
        content: `Dear Members,

In accordance with the Companies Act, 2013 and SEBI regulations, the Board recommends the appointment/re-appointment of directors to ensure effective governance and strategic oversight.

The proposed changes include:
• Re-appointment of Mr. John Smith as Independent Director for a second term
• Appointment of Ms. Sarah Johnson as Non-Executive Director
• Retirement by rotation of Mr. Michael Brown, who offers himself for re-election

Each nominee brings valuable expertise and experience that will contribute to the company's continued growth and success.`
      },
      {
        id: 3,
        title: "Dividend Declaration Statement",
        content: `Dear Shareholders,

Based on the company's strong financial performance and healthy cash position, the Board of Directors is pleased to recommend a dividend of ₹2.50 per equity share for the financial year 2023-24.

This represents:
• A dividend yield of 4.2% based on current market price
• Total dividend payout of ₹15 crores
• Payout ratio of 25% of net profits

The dividend, if approved, will be paid within 30 days of the AGM to shareholders whose names appear in the register of members as on the record date.`
      }
    ];
    setAiExplanatoryStatements(statements);
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

  const acceptExplanatoryStatement = (statement) => {
    setExplanatoryStatement(statement.content);
    handleInputChange('explanatoryStatement', statement.content);
  };

  const downloadNotice = () => {
    // Generate notice content with explanatory statement
    const noticeContent = `
NOTICE OF MEETING

${formData.entityName || 'Company Name'}
Meeting Notice

Date: ${formData.meetingDate ? format(new Date(formData.meetingDate), 'PPP') : '[Date]'}
Time: ${formData.meetingTime || '[Time]'}
Venue: ${formData.venue || '[Venue]'}

AGENDA:
${agendaItems.map((item, index) => `${index + 1}. ${item.title}`).join('\n')}

EXPLANATORY STATEMENT:
${explanatoryStatement}

By Order of the Board
${formData.secretary || 'Company Secretary'}
    `.trim();

    // Create and download the notice
    const blob = new Blob([noticeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Meeting_Notice_${formData.entityName || 'Company'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Agenda & Explanatory Statement</h3>
        <p className="text-sm text-muted-foreground mb-6">Define the meeting agenda and provide explanatory details</p>
      </div>

      
      
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
{/* AI Explanatory Statement */}
<Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">AI Generate Explanatory Statement</Label>
              <Button variant="outline" onClick={generateAIExplanatoryStatements}>
                🤖 Generate AI Statements
              </Button>
            </div>
            
            {aiExplanatoryStatements.length > 0 && (
              <div className="space-y-4">
                <Label className="text-sm font-medium">AI - Powerd Explanatory Generated Statements:</Label>
                {aiExplanatoryStatements.map((statement) => (
                  <div key={statement.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-green-900">{statement.title}</h4>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acceptExplanatoryStatement(statement)}
                        className="ml-4"
                      >
                        Use This Statement
                      </Button>
                    </div>
                    <div className="text-sm text-green-700 whitespace-pre-line max-h-32 overflow-y-auto">
                      {statement.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {explanatoryStatement && (
              <div className="space-y-2">
                <Label className="text-base font-medium">Current Explanatory Statement</Label>
                <textarea 
                  className="w-full min-h-[200px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="The explanatory statement will appear here after AI generation or you can write your own..."
                  value={explanatoryStatement}
                  onChange={(e) => {
                    setExplanatoryStatement(e.target.value);
                    handleInputChange('explanatoryStatement', e.target.value);
                  }}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      handleInputChange('explanatoryStatement', explanatoryStatement);
                      // You could add a toast notification here if needed
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Statement
                  </Button>
                  {/* <Button 
                    variant="default" 
                    size="sm"
                    onClick={downloadNotice}
                    disabled={!explanatoryStatement || agendaItems.length === 0}
                  >
                    📄 Download Notice
                  </Button> */}
                </div>
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
  
  const [circulationOptions, setCirculationOptions] = useState({
    sendEmail: true,
    additionalEmails: '',
    printLabels: false,
    offlinePublished: false
  });
  const [offlineSelected, setOfflineSelected] = useState(false);
  const [showOfflineReminder, setShowOfflineReminder] = useState(false);
  const [offlineReminderActive, setOfflineReminderActive] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  // Signature configuration moved to Office Bearers step.

  // Start recurring reminder while selected and not yet marked as published
  useRecurringReminder(offlineReminderActive && !circulationOptions.offlinePublished, 30000, () => {
    // 30s interval for demo; adjust as needed
    toast({
      title: 'Publish Notice Reminder',
      description: 'Please publish the meeting notice in the newspaper.',
    });
    setShowOfflineReminder(true);
  });

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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <Label className="text-base font-semibold text-gray-900">Meeting Summary</Label>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Meeting Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Entity:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{formData.entity || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Title:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{formData.meetingTitle || '—'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Class:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{formData.meetingClass || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Type:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{formData.meetingType || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Nature:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{formData.meetingNature || 'Not selected'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Schedule & Logistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Number:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{formData.meetingNumber ?? '—'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Date & Time:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">
                        {formData.meetingDate ? format(new Date(formData.meetingDate), 'PPP') : 'Not set'}
                        {formData.meetingTime && <br />}{formData.meetingTime && `at ${formData.meetingTime}`}
                      </span>
                    </div>
                    {(formData.meetingNature === 'physical' || formData.meetingNature === 'hybrid') && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">Venue:</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">{formData.venue || '—'}</span>
                      </div>
                    )}
                    {(formData.meetingNature === 'hybrid' || formData.meetingNature === 'virtual') && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">Meeting Link:</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">{formData.virtualMeetingOption === 'manual' ? (formData.meetingLink || '—') : 'Auto-generated'}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Participants:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{participantCount} total ({votingParticipants} voting)</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Agenda:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{formData.agendaItems?.length || 0} items ({totalDuration} min)</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Quorum:</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{formData.quorum || 51}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Bearers Summary */}
      <Card className="border rounded-lg">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <Label className="text-base font-semibold text-gray-900">Office Bearers</Label>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Positions</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600">Chairperson:</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">
                          {formData.chairpersonSelection === 'during-meeting' 
                            ? 'To be selected during meeting' 
                            : formData.chairperson || 'Not selected'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600">Secretary:</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">
                          {formData.secretarySelection === 'no-secretary' 
                            ? 'No Secretary' 
                            : formData.secretarySelection === 'during-meeting'
                            ? 'To be selected during meeting'
                            : formData.secretary || 'Not selected'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600">Scrutinizer:</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">
                          {formData.scrutinizerSelection === 'no-scrutinizer' 
                            ? 'No Scrutinizer' 
                            : formData.scrutinizerSelection === 'during-meeting'
                            ? 'To be selected during meeting'
                            : formData.scrutinizer || 'Not selected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Signature Configuration</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600">Method:</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">
                          {formData.signatureMethod ? (formData.signatureMethod === 'physical' ? 'Physical Signature' : 'Digital / E-sign') : 'Not configured'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600">Additional Signatories:</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">
                          {formData.additionalSignatories?.length || 0} {(formData.additionalSignatories?.length || 0) === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                    </div>
                    {formData.additionalSignatories?.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-2">Signatories:</div>
                        <div className="space-y-1">
                          {formData.additionalSignatories.map((sig, idx) => (
                            <div key={sig.id} className="text-xs bg-white rounded px-2 py-1 border">
                              {idx + 1}. {sig.name} ({sig.role})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notice Content (read-only) */}
      <Card className="border rounded-lg">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <Label className="text-base font-semibold text-gray-900">Meeting Notice</Label>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="bg-white border rounded-lg p-6">
            {formData.templateData ? (
              <div className="space-y-6">
                {/* Notice Header */}
                <div className="text-center border-b pb-4">
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    NOTICE OF {formData.meetingClass?.toUpperCase() || 'MEETING'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formData.templateData.noticeNumber}
                  </div>
                </div>

                {/* Notice Body */}
                <div className="space-y-4 text-sm leading-relaxed">
                  <p className="text-gray-800">
                    Notice is hereby given that the <strong>{formData.meetingClass || 'Meeting'}</strong> of{' '}
                    <strong>{formData.templateData.entityName}</strong> will be held on{' '}
                    <strong>{formData.templateData.meetingDate}</strong> at{' '}
                    <strong>{formData.templateData.meetingTime}</strong>{' '}
                    {formData.templateData.venue && (
                      <>at <strong>{formData.templateData.venue}</strong></>
                    )}.
                  </p>

                  {/* Agenda Section */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">AGENDA</h4>
                    <div className="space-y-2">
                      {formData.templateData.agendaItems?.map((item, index) => (
                        <div key={item.id || index} className="flex items-start gap-2">
                          <span className="font-medium text-gray-700 min-w-[20px]">{item.id || index + 1}.</span>
                          <span className="text-gray-800">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Note */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Special Note:</strong> Members are requested to attend the meeting punctually.
                      The meeting will be conducted as per the applicable regulations.
                    </p>
                  </div>

                  {/* Signature Section */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-600">By Order of the Board</p>
                        <div className="mt-8 border-b border-gray-300 w-40"></div>
                        <p className="text-sm font-medium text-gray-800 mt-1">Company Secretary</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Place: {formData.templateData.venue || '[Location]'}</p>
                        <p className="text-sm text-gray-600">Date: {format(new Date(), 'PPP')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Agenda Notes */}
                  {formData.templateData.agendaNotes?.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                      <div className="space-y-1">
                        {formData.templateData.agendaNotes.map((note, index) => (
                          <p key={index} className="text-xs text-gray-600">• {note}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No notice content provided.</p>
                <p className="text-sm mt-1">Please configure the notice template in the Office Bearers step.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agenda Summary */}
      <Card className="border rounded-lg">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <Label className="text-base font-semibold text-gray-900">Meeting Agenda</Label>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="bg-white border rounded-lg p-6">
            {(formData.agendaItems?.length || 0) === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No agenda items added.</p>
                <p className="text-sm mt-1">Please add agenda items in the Agenda step.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Agenda Items ({formData.agendaItems.length})</h4>
                  <div className="space-y-3">
                    {formData.agendaItems.map((item, idx) => (
                      <div key={item.id ?? idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-amber-600 min-w-[24px]">{idx + 1}.</span>
                              <div>
                                <p className="font-medium text-gray-900">{item.title || 'Untitled'}</p>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            {item.duration && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {item.duration} min
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t bg-amber-50 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">Total Estimated Duration:</span>
                    <span className="font-semibold text-amber-700">{totalDuration} minutes</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Documents */}
      <Card className="border rounded-lg">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
            <Label className="text-base font-semibold text-gray-900">Additional Documents</Label>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="bg-white border rounded-lg p-6">
            {(formData.additionalDocuments?.length || 0) === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No additional documents uploaded.</p>
                <p className="text-sm mt-1">Documents can be added in the Documents step.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-l-4 border-slate-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Uploaded Documents ({formData.additionalDocuments.length})</h4>
                  <div className="space-y-2">
                    {formData.additionalDocuments.map((doc, idx) => (
                      <div key={doc.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-medium text-slate-600">{idx + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              {doc.type && (
                                <p className="text-xs text-gray-500">{doc.type}</p>
                              )}
                            </div>
                          </div>
                          {doc.size && (
                            <span className="text-sm text-gray-500">{doc.size}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reminder Settings Summary */}
      <Card className="border rounded-lg">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
            <Label className="text-base font-semibold text-gray-900">Reminder Settings</Label>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="bg-white border rounded-lg p-6">
            {!formData.reminderSettings ? (
              <div className="text-center py-8 text-gray-500">
                <p>No reminder configured.</p>
                <p className="text-sm mt-1">Reminders can be set up in the Reminders step.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-l-4 border-rose-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Reminder Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formData.reminderSettings.enabled ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Enabled</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Disabled</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600">Date:</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">
                          {formData.reminderSettings.date ? format(new Date(formData.reminderSettings.date), 'PPP') : '—'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-600">Channels:</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">
                          {[
                            formData.reminderSettings.email && 'Email',
                            formData.reminderSettings.sms && 'SMS',
                          ].filter(Boolean).join(', ') || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  id="offline-published" 
                  checked={offlineSelected}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setOfflineSelected(checked);
                    setOfflineReminderActive(checked && !circulationOptions.offlinePublished);
                    if (checked) {
                      toast({ title: 'Offline publishing selected', description: 'We will remind you until you mark as Published.' });
                    }
                  }}
                  className="mt-1 rounded border-gray-300"
                />
                <div>
                  <Label htmlFor="offline-published">Offline Published (Newspaper)</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enables automated reminders and popup notifications until you mark as Published.
                    {circulationOptions.offlinePublished && ' (Published marked)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Offline Publishing Reminder Dialog */}
      <ReminderDialog
        open={showOfflineReminder}
        onOpenChange={setShowOfflineReminder}
        onRemindAgain={() => {
          // Close dialog; interval will open it again until published
          setShowOfflineReminder(false);
          setOfflineReminderActive(true);
        }}
        onPublished={() => {
          setShowOfflineReminder(false);
          setOfflineReminderActive(false);
          setCirculationOptions(prev => ({ ...prev, offlinePublished: true }));
          toast({ title: 'Marked as Published', description: 'Offline publishing reminders have been stopped.' });
        }}
      />

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
    <DashboardLayout>
      <CreateMeetingContent />
    </DashboardLayout>
  );
};

export default CreateMeeting;

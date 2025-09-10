import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, 
  Send, 
  X, 
  Plus, 
  Upload, 
  Trash2,
  Users,
  FileText,
  Calendar,
  Bell,
  Eye,
  Bot
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { votingService } from "@/services/votingService";
import { CreateVotingRequest, MeetingType } from "@/types/voting";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const CreateVotingRequestPage = () => {
  return (
    <DashboardLayout>
      <CreateVotingRequestForm />
    </DashboardLayout>
  );
};

const CreateVotingRequestForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateVotingRequest>({
    title: "",
    entityName: "",
    meetingNumber: "",
    meetingType: "board_meeting",
    startDate: "",
    endDate: "",
    discreteVoting: false,
    allowExtensions: false,
    participants: [
      { name: "John Smith", email: "john@acme.com", mobile: "+1-555-0101", votingShare: 25 },
      { name: "Jane Doe", email: "jane@acme.com", mobile: "+1-555-0102", votingShare: 30 },
      { name: "Mike Wilson", email: "mike@acme.com", mobile: "+1-555-0103", votingShare: 20 },
      { name: "Sarah Connor", email: "sarah@acme.com", mobile: "+1-555-0104", votingShare: 15 },
      { name: "David Park", email: "david@acme.com", mobile: "+1-555-0105", votingShare: 10 },
    ],
    resolutions: [
      {
        title: "Approval of Q3 Budget",
        description: "To approve the quarterly budget allocation of $2.5M for Q3 operations including marketing, development, and administrative expenses as presented by the CFO.",
        minimumPassPercentage: 51,
        calculationBase: "total_vote"
      },
      {
        title: "Board Member Appointment",
        description: "To appoint Ms. Jennifer Lawrence as an independent director to the Board of Directors for a term of three years, effective immediately upon approval.",
        minimumPassPercentage: 66,
        calculationBase: "votes_present"
      }
    ],
    reminders: {
      sendSMS: false,
      sendEmail: true,
      sendTo: "all_participants",
      frequency: "daily",
      startBefore: 1
    }
  });

  const [equalShareVoting, setEqualShareVoting] = useState(false);
  // Tri-state: yes | no | as_per_law
  const [participantListVisibility, setParticipantListVisibility] = useState<'yes'|'no'|'as_per_law'>('no');
  // Time selections bound to state
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  // Bulk upload ref
  const bulkInputRef = useRef<HTMLInputElement | null>(null);
  // MoM upload ref/state
  const momInputRef = useRef<HTMLInputElement | null>(null);
  const [momProcessing, setMomProcessing] = useState(false);
  // Existing setup options
  const [existingOptions, setExistingOptions] = useState<{id:string; title:string}[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);

  useEffect(() => {
    // Bind time selects into ISO strings when dates present
    if (formData.startDate) {
      const date = formData.startDate.split('T')[0] || formData.startDate;
      handleInputChange("startDate", `${date}T${startTime}:00`);
    }
    if (formData.endDate) {
      const date = formData.endDate.split('T')[0] || formData.endDate;
      handleInputChange("endDate", `${date}T${endTime}:00`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  const handleInputChange = (field: keyof CreateVotingRequest, value: string | boolean | MeetingType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMoMUploadClick = () => {
    momInputRef.current?.click();
  };

  const handleMoMUpload = async (file: File | null) => {
    if (!file) return;
    try {
      setMomProcessing(true);
      const extracted = await votingService.extractResolutionsFromMoM(file);
      if (!extracted || extracted.length === 0) {
        toast({ title: "No resolutions found", description: "Could not detect resolution items in the uploaded MoM." });
        return;
      }
      // Map to Resolution type used in formData
      const mapped: CreateVotingRequest['resolutions'] = extracted.map((r) => ({
        title: r.title,
        description: r.description,
        minimumPassPercentage: r.minimumPassPercentage ?? 51,
        calculationBase: r.calculationBase,
      }));
      setFormData(prev => ({ ...prev, resolutions: mapped }));
      toast({ title: "Resolutions extracted", description: `Added ${mapped.length} resolution(s) from MoM` });
    } catch (e) {
      toast({ title: "Extraction failed", description: "We couldn't parse the MoM. Try a simpler .txt or ensure headings like 'Resolved that'.", variant: "destructive" });
    } finally {
      setMomProcessing(false);
    }
  };

  type NewParticipant = CreateVotingRequest['participants'][number];
  const handleParticipantChange = (index: number, field: keyof NewParticipant, value: string | number) => {
    const updatedParticipants = [...formData.participants];
    updatedParticipants[index] = { ...updatedParticipants[index], [field]: value };
    setFormData(prev => ({ ...prev, participants: updatedParticipants }));
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [
        ...prev.participants,
        { name: "", email: "", mobile: "", votingShare: 0 }
      ]
    }));
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  type NewResolution = CreateVotingRequest['resolutions'][number];
  const handleResolutionChange = (index: number, field: keyof NewResolution, value: string | number) => {
    const updatedResolutions = [...formData.resolutions];
    updatedResolutions[index] = { ...updatedResolutions[index], [field]: value };
    setFormData(prev => ({ ...prev, resolutions: updatedResolutions }));
  };

  const addResolution = () => {
    setFormData(prev => ({
      ...prev,
      resolutions: [
        ...prev.resolutions,
        {
          title: "",
          description: "",
          minimumPassPercentage: 51,
          calculationBase: "total_vote"
        }
      ]
    }));
  };

  const removeResolution = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resolutions: prev.resolutions.filter((_, i) => i !== index)
    }));
  };

  const handleEqualShareToggle = (checked: boolean) => {
    setEqualShareVoting(checked);
    if (checked) {
      const equalShare = Math.floor(100 / formData.participants.length);
      const updatedParticipants = formData.participants.map((p, index) => ({
        ...p,
        votingShare: index === 0 ? equalShare + (100 % formData.participants.length) : equalShare
      }));
      setFormData(prev => ({ ...prev, participants: updatedParticipants }));
    }
  };

  const handleUseExistingSetup = async () => {
    try {
      setLoadingExisting(true);
      // fetch existing requests for selection if not loaded
      if (existingOptions.length === 0) {
        const list = await votingService.getVotingRequests();
        setExistingOptions(list.map(l => ({ id: l.id, title: `${l.title} (${l.id})` })));
      }
      // Simple behavior: pick the most recent request automatically (could render a Select for choice)
      const list = await votingService.getVotingRequests();
      if (list.length) {
        const latest = list[0];
        const participants: NewParticipant[] = latest.participants.map(p => ({
          name: p.name,
          email: p.email,
          mobile: p.mobile,
          votingShare: p.votingShare ?? 0,
        }));
        setFormData(prev => ({ ...prev, participants }));
        toast({ title: "Participants loaded", description: `Loaded ${participants.length} from ${latest.id}` });
      } else {
        toast({ title: "No existing data", description: "No previous voting requests found" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to load existing setup", variant: "destructive" });
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleBulkUploadClick = () => {
    bulkInputRef.current?.click();
  };

  const parseCsv = (text: string): NewParticipant[] => {
    // Expect headers: name,email,mobile,votingShare
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const startIdx = lines[0].toLowerCase().includes('name') ? 1 : 0;
    const rows = lines.slice(startIdx);
    return rows.map(line => {
      const [name, email, mobile, share] = line.split(',').map(s => s?.trim() ?? '');
      return { name, email, mobile, votingShare: Number(share || 0) } as NewParticipant;
    }).filter(p => p.name || p.email || p.mobile);
  };

  const handleBulkUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const txt = await file.text();
      const parsed = parseCsv(txt);
      if (parsed.length === 0) {
        toast({ title: "No rows found", description: "CSV appears empty" });
        return;
      }
      setFormData(prev => ({ ...prev, participants: parsed }));
      toast({ title: "Bulk upload complete", description: `Imported ${parsed.length} participants` });
    } catch {
      toast({ title: "Upload failed", description: "Could not parse CSV", variant: "destructive" });
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      await votingService.createVotingRequest(formData);
      toast({
        title: "Success",
        description: "Voting request saved as draft",
      });
      navigate("/voting");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      const request = await votingService.createVotingRequest(formData);
      await votingService.updateVotingRequest(request.id, { status: "scheduled" });
      // Notify participants with non-zero share (simulated)
      const notifiees = formData.participants.filter(p => (p.votingShare ?? 0) > 0).length;
      toast({ title: "Published", description: `Notified ${notifiees} participant(s) with non-zero share` });
      navigate("/voting");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish voting request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openPreview = () => {
    // Basic validation
    if (!formData.entityName || !formData.title) {
      toast({ title: "Missing details", description: "Please enter Title and Entity Name before preview" });
      return;
    }
    setPreviewOpen(true);
  };

  const totalVotingShare = formData.participants.reduce((sum, p) => sum + p.votingShare, 0);

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Schedule New Voting Request</h1>
          <p className="text-muted-foreground">Create and configure a new voting process</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9" onClick={handleSaveDraft} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button size="sm" className="h-9" onClick={openPreview} disabled={loading}>
            <Send className="mr-2 h-4 w-4" />
            Preview & Publish
          </Button>
        </div>
      </div>

      {/* Meeting Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meeting Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meetingType">Meeting Type</Label>
              <Select value={formData.meetingType} onValueChange={(value: MeetingType) => handleInputChange("meetingType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="board_meeting">Board Meeting</SelectItem>
                  <SelectItem value="annual_meeting">Annual Meeting</SelectItem>
                  <SelectItem value="special_meeting">Special Meeting</SelectItem>
                  <SelectItem value="committee_meeting">Committee Meeting</SelectItem>
                  <SelectItem value="csr">CSR</SelectItem>
                  <SelectItem value="nrc">NRC</SelectItem>
                  <SelectItem value="audit_committee">Audit Committee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="momFile">Upload MoM</Label>
              <div className="flex items-center gap-2">
                <input
                  ref={momInputRef}
                  id="momFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleMoMUpload(e.target.files?.[0] || null)}
                />
                <Input readOnly value={momInputRef.current?.files?.[0]?.name || ''} placeholder="Select MoM file (.pdf, .docx, .txt)" className="flex-1" />
                <Button variant="outline" size="sm" onClick={handleMoMUploadClick} disabled={momProcessing}>
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entityName">Entity Name</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select value={formData.entityName} onValueChange={(value) => handleInputChange("entityName", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                      <SelectItem value="Tech Solutions Inc.">Tech Solutions Inc.</SelectItem>
                      <SelectItem value="Healthcare Ltd">Healthcare Ltd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/create-entity')}>
                  Create Entity
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="meetingNumber">Meeting Number</Label>
              <Input
                id="meetingNumber"
                type="number"
                value={formData.meetingNumber}
                onChange={(e) => handleInputChange("meetingNumber", e.target.value)}
                placeholder="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="equalShare"
                checked={equalShareVoting}
                onCheckedChange={handleEqualShareToggle}
              />
              <Label htmlFor="equalShare">Equal Share Voting</Label>
            </div>
            <Select value={participantListVisibility} onValueChange={(v: 'yes'|'no'|'as_per_law') => setParticipantListVisibility(v)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="as_per_law">As per Law</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleUseExistingSetup} disabled={loadingExisting}>
              <Users className="h-4 w-4 mr-2" />
              Use Existing Setup
            </Button>
            <input
              ref={bulkInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleBulkUpload(e.target.files?.[0] || null)}
            />
            <Button variant="outline" size="sm" onClick={handleBulkUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 font-medium text-sm">
              <div>Name</div>
              <div>Email</div>
              <div>Mobile</div>
              <div>Voting Share %</div>
              <div>Actions</div>
            </div>
            
            {formData.participants.map((participant, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 p-4 border-t">
                <Input
                  value={participant.name}
                  onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                  placeholder="Full Name"
                />
                <Input
                  type="email"
                  value={participant.email}
                  onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                  placeholder="email@example.com"
                />
                <Input
                  value={participant.mobile}
                  onChange={(e) => handleParticipantChange(index, "mobile", e.target.value)}
                  placeholder="+1-555-0000"
                />
                <Input
                  type="number"
                  value={participant.votingShare}
                  onChange={(e) => handleParticipantChange(index, "votingShare", Number(e.target.value))}
                  disabled={equalShareVoting}
                  min="0"
                  max="100"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParticipant(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={addParticipant}>
              <Plus className="h-4 w-4 mr-2" />
              Add Participant
            </Button>
            <div className="text-sm">
              Total Voting Share: <Badge variant={totalVotingShare === 100 ? "default" : "destructive"}>
                {totalVotingShare}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voting Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Voting Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate.split('T')[0]}
                onChange={(e) => handleInputChange("startDate", e.target.value + "T09:00:00")}
              />
            </div>
            <div>
              <Label htmlFor="startTime">Time</Label>
              <Select value={startTime} onValueChange={(v: string) => setStartTime(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate.split('T')[0]}
                onChange={(e) => handleInputChange("endDate", e.target.value + "T17:00:00")}
              />
            </div>
            <div>
              <Label htmlFor="endTime">Time</Label>
              <Select value={endTime} onValueChange={(v: string) => setEndTime(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="17:00">05:00 PM</SelectItem>
                  <SelectItem value="18:00">06:00 PM</SelectItem>
                  <SelectItem value="19:00">07:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discreteVoting"
                checked={formData.discreteVoting}
                onCheckedChange={(checked) => handleInputChange("discreteVoting", checked)}
              />
              <Label htmlFor="discreteVoting">Discrete Voting (Hide voter names in results)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowExtensions"
                checked={formData.allowExtensions}
                onCheckedChange={(checked) => handleInputChange("allowExtensions", checked)}
              />
              <Label htmlFor="allowExtensions">Allow Extensions</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resolutions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resolutions 
            
          </CardTitle>
          <span className="text-xs text-muted-foreground block">Auto generated By AI</span>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.resolutions.map((resolution, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Resolution {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeResolution(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <Label>Resolution Title</Label>
                <Input
                  value={resolution.title}
                  onChange={(e) => handleResolutionChange(index, "title", e.target.value)}
                  placeholder="Enter resolution title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Pass %</Label>
                  <Input
                    type="number"
                    value={resolution.minimumPassPercentage}
                    onChange={(e) => handleResolutionChange(index, "minimumPassPercentage", Number(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Calculated on</Label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`total-${index}`}
                        name={`calculation-${index}`}
                        checked={resolution.calculationBase === "total_vote"}
                        onChange={() => handleResolutionChange(index, "calculationBase", "total_vote")}
                      />
                      <Label htmlFor={`total-${index}`}>Total Vote</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`present-${index}`}
                        name={`calculation-${index}`}
                        checked={resolution.calculationBase === "votes_present"}
                        onChange={() => handleResolutionChange(index, "calculationBase", "votes_present")}
                      />
                      <Label htmlFor={`present-${index}`}>Votes Present</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Resolution Description</Label>
                <Textarea
                  value={resolution.description}
                  onChange={(e) => handleResolutionChange(index, "description", e.target.value)}
                  placeholder="Detailed resolution text..."
                  rows={3}
                />
              </div>
            </div>
          ))}

          
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Send Type</Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendSMS"
                    checked={formData.reminders.sendSMS}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        reminders: { ...prev.reminders, sendSMS: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="sendSMS">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendEmail"
                    checked={formData.reminders.sendEmail}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        reminders: { ...prev.reminders, sendEmail: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="sendEmail">Email</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Send To</Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="allParticipants"
                    name="sendTo"
                    checked={formData.reminders.sendTo === "all_participants"}
                    onChange={() => 
                      setFormData(prev => ({
                        ...prev,
                        reminders: { ...prev.reminders, sendTo: "all_participants" }
                      }))
                    }
                  />
                  <Label htmlFor="allParticipants">All Participants</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="nonVoters"
                    name="sendTo"
                    checked={formData.reminders.sendTo === "non_voters_only"}
                    onChange={() => 
                      setFormData(prev => ({
                        ...prev,
                        reminders: { ...prev.reminders, sendTo: "non_voters_only" }
                      }))
                    }
                  />
                  <Label htmlFor="nonVoters">Non-Voters Only</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select 
                value={formData.reminders.frequency} 
                onValueChange={(value: "daily" | "twice_daily" | "hourly") => 
                  setFormData(prev => ({
                    ...prev,
                    reminders: { ...prev.reminders, frequency: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="twice_daily">Twice Daily</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startBefore">Start</Label>
              <Select 
                value={formData.reminders.startBefore.toString()} 
                onValueChange={(value) => 
                  setFormData(prev => ({
                    ...prev,
                    reminders: { ...prev.reminders, startBefore: Number(value) }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="2">2 days before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="7">1 week before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="mb-6">
        <CardContent className="flex justify-center gap-4 py-6">
          <Button variant="outline" onClick={openPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handlePublish} disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
          <Button variant="outline" asChild>
            <Link to="/voting">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Link>
          </Button>
        </CardContent>
      </Card>
      {/* Preview Overlay */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Preview Voting Request</h3>
                <p className="text-sm text-muted-foreground">Review details before publishing</p>
              </div>
              <Button variant="ghost" onClick={() => setPreviewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Entity Name</Label>
                  <p className="mt-1 font-medium">{formData.entityName || '—'}</p>
                </div>
                <div>
                  <Label>Meeting Type</Label>
                  <p className="mt-1 font-medium">{formData.meetingType.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label>Start & End</Label>
                  <p className="mt-1 font-medium">{formData.startDate || '—'} → {formData.endDate || '—'}</p>
                </div>
                <div>
                  <Label>Discreet Voting</Label>
                  <p className="mt-1 font-medium">{formData.discreteVoting ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <Label>Participant List Visibility</Label>
                  <p className="mt-1 font-medium">{participantListVisibility === 'as_per_law' ? 'As per Law' : participantListVisibility === 'yes' ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div>
                <Label>Resolutions</Label>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {formData.resolutions.map((r, i) => (
                    <li key={i}>
                      <span className="font-medium">{r.title}</span> — {r.minimumPassPercentage}% on {r.calculationBase === 'total_vote' ? 'Total Vote' : 'Votes Present'}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label>Voter List</Label>
                <div className="mt-2 border rounded">
                  <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 text-sm font-medium">
                    <div>Name</div><div>Email</div><div>Mobile</div><div>Share %</div>
                  </div>
                  {formData.participants.map((p, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 p-2 border-t text-sm">
                      <div>{p.name}</div><div>{p.email}</div><div>{p.mobile}</div><div>{p.votingShare}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>Edit</Button>
              <Button onClick={() => { setPreviewOpen(false); handlePublish(); }} disabled={loading}>
                <Send className="h-4 w-4 mr-2" /> Publish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateVotingRequestPage;

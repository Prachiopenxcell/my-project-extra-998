import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  Building, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Save,
  Send,
  ArrowRight
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface LawyerInfo {
  id: string;
  name: string;
  specialization: string;
  courtPractice: string;
  contact: string;
  email: string;
  address: string;
  status: 'registered' | 'pending';
}

const CreatePreFiling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(2); // Step 2: Details
  const [formData, setFormData] = useState({
    applicationType: '',
    customType: '',
    court: '',
    actSection: '',
    caseCategory: '',
    filingDeadline: '30',
    customDeadline: '',
    draftDeadline: '7',
    enableFollowups: true,
    followupInterval: '3',
    enableEscalation: true,
    escalationAfter: '7',
    assignedLawyer: '',
    briefDescription: '',
    responseType: 'Awaiting Response',
    numberOfDays: '15',
    reliefSought: {
      admission: false,
      appointment: false,
      moratorium: false,
      interim: false,
      costs: false,
      other: false,
      otherText: ''
    }
  });

  const [selectedLawyer, setSelectedLawyer] = useState<LawyerInfo | null>({
    id: "lawyer-001",
    name: "Adv. Rajesh Sharma",
    specialization: "NCLT, NCLAT, Insolvency Law",
    courtPractice: "NCLT Mumbai, NCLAT New Delhi",
    contact: "+91-98765-43210",
    email: "rajesh.sharma@lawfirm.com",
    address: "Law Chamber, BKC, Mumbai - 400051",
    status: "registered"
  });

  const [costEstimation] = useState({
    draftingFee: 25000,
    filingFee: 15000,
    courtFee: 5000,
    miscellaneous: 10000,
    total: 55000
  });

  // Stage 1: Documents, Drafts, and Audit Log
  const [documents, setDocuments] = useState<{ id: string; title: string; fileName: string }[]>([]);
  const [drafts, setDrafts] = useState<{ id: string; title: string; status: 'uploaded' | 'synced' }[]>([]);
  const [auditLog, setAuditLog] = useState<{ id: string; action: string; timestamp: string; comment?: string }[]>([
    { id: 'a-1', action: 'Stage 1 initiated', timestamp: new Date().toLocaleString('en-IN') },
  ]);

  const addAudit = (action: string, comment?: string) => {
    setAuditLog(prev => [
      { id: `a-${Date.now()}`, action, timestamp: new Date().toLocaleString('en-IN'), comment },
      ...prev,
    ]);
  };

  // Progress steps
  const steps = [
   /*  { id: 1, title: "Stage Selection", completed: true }, */
    { id: 1, title: "Details", completed: false, active: true },
    { id: 2, title: "Documents", completed: false },
    { id: 3, title: "Review", completed: false }
  ];

  // Detect edit mode from query string and prefill basic data
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    if (editId) {
      // Minimal mock prefill mapping based on known pf-001..003 used in dashboard
      const prefillMap: Record<string, { court?: string; briefDescription?: string; assignedLawyer?: string }> = {
        'pf-001': { court: 'NCLT Mumbai', briefDescription: 'Corporate insolvency resolution – Section 7 IBC', assignedLawyer: 'lawyer-001' },
        'pf-002': { court: 'High Court Delhi', briefDescription: 'Breach of supply agreement preparation', assignedLawyer: 'lawyer-002' },
        'pf-003': { court: 'District Court Mumbai', briefDescription: 'Property title verification dispute', assignedLawyer: 'lawyer-003' },
      };
      const data = prefillMap[editId];
      if (data) {
        setFormData(prev => ({ ...prev, ...data }));
      }
    }
  }, [location.search]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field: string, value: string | number | boolean | Record<string, unknown>) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReliefChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      reliefSought: {
        ...prev.reliefSought,
        [field]: checked
      }
    }));
  };

  const handleNext = () => {
    // Validation logic here
    // If pipeline=active, save minimal carryover for Stage 2 and propagate the flag to Documents
    const pipelineActive = new URLSearchParams(location.search).get('pipeline') === 'active';
    // Save Stage 1 review summary
    try {
      const stage1Review = {
        stage: 'pre-filing',
        title: formData.briefDescription?.slice(0, 80) || 'Application',
        court: formData.court,
        actSection: formData.actSection,
        responseType: formData.responseType,
        numberOfDays: formData.numberOfDays,
        assignedLawyer: formData.assignedLawyer,
        particulars: formData.briefDescription,
        reliefSought: Object.entries(formData.reliefSought)
          .filter(([k, v]) => typeof v === 'boolean' ? v : false)
          .map(([k]) => k),
        documentsCount: documents.length,
      };
      localStorage.setItem('review_stage1', JSON.stringify(stage1Review));
    } catch { /* ignore */ }
    if (pipelineActive) {
      const carry = {
        title: formData.briefDescription?.slice(0, 60) || 'Application',
        court: formData.court,
        actSection: formData.actSection,
        particulars: formData.briefDescription,
        reliefSought: Object.entries(formData.reliefSought)
          .filter(([k, v]) => typeof v === 'boolean' ? v : false)
          .map(([k]) => k).join(', '),
      };
      try {
        localStorage.setItem('stage1_carryover', JSON.stringify(carry));
      } catch { /* ignore */ }
    }
    navigate('/litigation/create/documents' + (pipelineActive ? '?pipeline=active' : ''));
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your pre-filing application has been saved as draft.",
    });
    addAudit('Saved draft');
  };

  // Note: Stage 2 handoff occurs from Documents page when pipeline=active

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/litigation')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Stage Selection
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Case: PRE-2025-001
          </div>
        </div>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Pre-filing Details (Stage 1)</h2>
            </div>
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.completed ? 'bg-green-500 border-green-500 text-white' :
                    step.active ? 'bg-blue-500 border-blue-500 text-white' :
                    'border-gray-300 text-gray-400'
                  }`}>
                    {step.id}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step.active ? 'font-medium text-blue-600' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-0.5 w-12 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What to File Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">What to File</h3>
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Select Application Type: <span className="text-red-500">*</span>
                </Label>
                <RadioGroup 
                  value={formData.applicationType} 
                  onValueChange={(value) => handleInputChange('applicationType', value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new-application" id="new-application" />
                    <Label htmlFor="new-application">New Application/Petition</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="show-cause" id="show-cause" />
                    <Label htmlFor="show-cause">Reply to Show Cause</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="counter-affidavit" id="counter-affidavit" />
                    <Label htmlFor="counter-affidavit">Counter Affidavit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rejoinder" id="rejoinder" />
                    <Label htmlFor="rejoinder">Rejoinder</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interlocutory" id="interlocutory" />
                    <Label htmlFor="interlocutory">Interlocutory Application</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="miscellaneous" id="miscellaneous" />
                    <Label htmlFor="miscellaneous">Miscellaneous Application</Label>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other:</Label>
                    <Input 
                      placeholder="Specify other type"
                      value={formData.customType}
                      onChange={(e) => handleInputChange('customType', e.target.value)}
                      className="ml-2 flex-1"
                      disabled={formData.applicationType !== 'other'}
                    />
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="court">
                    Court/Authority: <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.court} onValueChange={(value) => handleInputChange('court', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select court" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nclt-mumbai">NCLT Mumbai</SelectItem>
                      <SelectItem value="nclt-delhi">NCLT Delhi</SelectItem>
                      <SelectItem value="nclat">NCLAT</SelectItem>
                      <SelectItem value="bombay-hc">Bombay High Court</SelectItem>
                      <SelectItem value="supreme-court">Supreme Court</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="case-category">Case Category:</Label>
                  <Select value={formData.caseCategory} onValueChange={(value) => handleInputChange('caseCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insolvency">Insolvency</SelectItem>
                      <SelectItem value="corporate-dispute">Corporate Dispute</SelectItem>
                      <SelectItem value="debt-recovery">Debt Recovery</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="act-section">
                  Act & Section: <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="act-section"
                  placeholder="e.g., Insolvency and Bankruptcy Code, 2016 - Section 7"
                  value={formData.actSection}
                  onChange={(e) => handleInputChange('actSection', e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* Timeline & Deadlines Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Timeline & Deadlines</h3>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Application to be filed within: <span className="text-red-500">*</span>
                </Label>
                <RadioGroup 
                  value={formData.filingDeadline} 
                  onValueChange={(value) => handleInputChange('filingDeadline', value)}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7" id="7-days" />
                    <Label htmlFor="7-days">7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15" id="15-days" />
                    <Label htmlFor="15-days">15 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30" id="30-days" />
                    <Label htmlFor="30-days">30 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="60" id="60-days" />
                    <Label htmlFor="60-days">60 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom-days" />
                    <Label htmlFor="custom-days">Custom:</Label>
                    <Input 
                      type="number"
                      placeholder="Days"
                      value={formData.customDeadline}
                      onChange={(e) => handleInputChange('customDeadline', e.target.value)}
                      className="w-20 ml-2"
                      disabled={formData.filingDeadline !== 'custom'}
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                </RadioGroup>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: 25 Feb 2025</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Draft to be received within: <span className="text-red-500">*</span>
                </Label>
                <RadioGroup 
                  value={formData.draftDeadline} 
                  onValueChange={(value) => handleInputChange('draftDeadline', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="3-days-draft" />
                    <Label htmlFor="3-days-draft">3 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7" id="7-days-draft" />
                    <Label htmlFor="7-days-draft">7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15" id="15-days-draft" />
                    <Label htmlFor="15-days-draft">15 days</Label>
                  </div>
                </RadioGroup>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Expected: 23 Jan 2025</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Follow-up Settings:</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="enable-followups"
                      checked={formData.enableFollowups}
                      onCheckedChange={(checked) => handleInputChange('enableFollowups', checked)}
                    />
                    <Label htmlFor="enable-followups">Enable automatic follow-ups</Label>
                    <span className="text-sm text-muted-foreground">Every</span>
                    <Input 
                      type="number"
                      value={formData.followupInterval}
                      onChange={(e) => handleInputChange('followupInterval', e.target.value)}
                      className="w-16"
                      disabled={!formData.enableFollowups}
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="enable-escalation"
                      checked={formData.enableEscalation}
                      onCheckedChange={(checked) => handleInputChange('enableEscalation', checked)}
                    />
                    <Label htmlFor="enable-escalation">Send escalation alerts</Label>
                    <span className="text-sm text-muted-foreground">After</span>
                    <Input 
                      type="number"
                      value={formData.escalationAfter}
                      onChange={(e) => handleInputChange('escalationAfter', e.target.value)}
                      className="w-16"
                      disabled={!formData.enableEscalation}
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Response Type & Number of Days */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type of Response</Label>
                <Select
                  value={formData.responseType}
                  onValueChange={(v) => handleInputChange('responseType', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select response type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Awaiting Response">Awaiting Response</SelectItem>
                    <SelectItem value="No Objection">No Objection</SelectItem>
                    <SelectItem value="Objection Received">Objection Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Days</Label>
                <Input
                  type="number"
                  value={formData.numberOfDays}
                  onChange={(e) => handleInputChange('numberOfDays', e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* Lawyer Assignment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lawyer Assignment</h3>
              
              <div className="space-y-2">
                <Label htmlFor="assigned-lawyer">
                  Assign Lawyer: <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.assignedLawyer} onValueChange={(value) => handleInputChange('assignedLawyer', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lawyer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lawyer-001">Adv. Rajesh Sharma</SelectItem>
                    <SelectItem value="lawyer-002">Adv. Priya Patel</SelectItem>
                    <SelectItem value="lawyer-003">Sr. Adv. Mukesh Shah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedLawyer && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedLawyer.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Specialization:</strong> {selectedLawyer.specialization}</div>
                    <div><strong>Court Practice:</strong> {selectedLawyer.courtPractice}</div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedLawyer.contact}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedLawyer.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedLawyer.address}
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">Registered on Platform</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Add New Lawyer
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send Scope of Work Email
                </Button>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documents for Filing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Manual Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Manual Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label>Label/Title</Label>
                        <Input id="doc-title" placeholder="e.g., Minutes of CoC" />
                      </div>
                      <div className="space-y-2">
                        <Label>Upload Document (PDF/Word)</Label>
                        <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => {
                          const file = e.target.files?.[0];
                          const title = (document.getElementById('doc-title') as HTMLInputElement)?.value || file?.name || 'Document';
                          if (file) {
                            const id = `doc-${Date.now()}`;
                            setDocuments(prev => [{ id, title, fileName: file.name }, ...prev]);
                            toast({ title: 'Uploaded', description: `${file.name} added.` });
                            addAudit('Uploaded document', file.name);
                          }
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label>Uploaded Documents</Label>
                        <div className="space-y-2">
                          {documents.map(d => (
                            <div key={d.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="text-sm">
                                <span className="font-medium">{d.title}</span> • {d.fileName}
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setDocuments(prev => prev.filter(x => x.id !== d.id));
                                addAudit('Deleted document', d.fileName);
                              }}>
                                Delete
                              </Button>
                            </div>
                          ))}
                          {documents.length === 0 && (
                            <div className="text-sm text-muted-foreground">No documents uploaded yet.</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Auto Upload from VDR */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Auto Upload from VDR</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">Select to auto-import relevant documents from the VDR based on the selected entity.</p>
                      <Button variant="outline" onClick={() => {
                        const imported = [
                          { id: `doc-${Date.now()}-1`, title: 'NCLT Order', fileName: 'nclt-order.pdf' },
                          { id: `doc-${Date.now()}-2`, title: 'RP Report', fileName: 'rp-report.pdf' }
                        ];
                        setDocuments(prev => [...imported, ...prev]);
                        toast({ title: 'VDR Sync Complete', description: '2 documents imported from VDR.' });
                        addAudit('Auto-upload from VDR');
                      }}>Auto Upload from VDR</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Case Description Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Case Description</h3>
              
              <div className="space-y-2">
                <Label htmlFor="brief-description">
                  Brief Description: <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="brief-description"
                  placeholder="Provide a brief description of the case..."
                  value={formData.briefDescription}
                  onChange={(e) => handleInputChange('briefDescription', e.target.value)}
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <div className="text-right text-sm text-muted-foreground">
                  Character count: {formData.briefDescription.length}/500
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Key Relief/Prayer Sought:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admission"
                      checked={formData.reliefSought.admission}
                      onCheckedChange={(checked) => handleReliefChange('admission', checked as boolean)}
                    />
                    <Label htmlFor="admission">Admission of application</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="appointment"
                      checked={formData.reliefSought.appointment}
                      onCheckedChange={(checked) => handleReliefChange('appointment', checked as boolean)}
                    />
                    <Label htmlFor="appointment">Appointment of IRP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="moratorium"
                      checked={formData.reliefSought.moratorium}
                      onCheckedChange={(checked) => handleReliefChange('moratorium', checked as boolean)}
                    />
                    <Label htmlFor="moratorium">Moratorium declaration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="interim"
                      checked={formData.reliefSought.interim}
                      onCheckedChange={(checked) => handleReliefChange('interim', checked as boolean)}
                    />
                    <Label htmlFor="interim">Interim relief</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="costs"
                      checked={formData.reliefSought.costs}
                      onCheckedChange={(checked) => handleReliefChange('costs', checked as boolean)}
                    />
                    <Label htmlFor="costs">Costs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="other-relief"
                      checked={formData.reliefSought.other}
                      onCheckedChange={(checked) => handleReliefChange('other', checked as boolean)}
                    />
                    <Label htmlFor="other-relief">Other:</Label>
                    <Input 
                      placeholder="Specify"
                      value={formData.reliefSought.otherText}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        reliefSought: { ...prev.reliefSought, otherText: e.target.value }
                      }))}
                      className="ml-2 flex-1"
                      disabled={!formData.reliefSought.other}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/litigation')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={handleNext}>
                Continue to Documents
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatePreFiling;

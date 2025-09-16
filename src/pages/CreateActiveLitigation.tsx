import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, ArrowRight, FileText, Upload, Users, Calendar, DollarSign,
  Save, CheckCircle, Clock, AlertTriangle, Building, Scale, Plus, X,
  Download, Eye, Edit, Trash2, Phone, Mail, MapPin, User, Gavel
} from 'lucide-react';

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

const CreateActiveLitigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { stage } = useParams<{ stage?: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [applicationCopyVersions, setApplicationCopyVersions] = useState<{name:string; uploadedAt:string; size?:number}[]>([]);
  const [eFilingReceiptVersions, setEFilingReceiptVersions] = useState<{name:string; uploadedAt:string; size?:number}[]>([]);
  const [interimOrders, setInterimOrders] = useState<{date:string; summary:string}[]>([]);
  const [finalOrders, setFinalOrders] = useState<{date:string; summary:string}[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Case Information
    caseNumber: '',
    title: '',
    court: '',
    actSection: '',
    caseCategory: '',
    filingDate: '',
    status: 'filed',
    plaintiff: '',
    defendant: '',
    adjudicatingAuthority: '',
    
    // Application Details
    applicationStatus: stage === 'pre-filing' ? 'draft' : 'filed-scrutiny',
    particulars: '',
    reliefSought: '',
    urgency: 'medium',
    estimatedDuration: '',
    
    // Document Management
    applicationCopy: null,
    eFilingReceipt: null,
    supportingDocuments: [],
    
    // Legal Team
    assignedLawyer: '',
    lawyerContact: '',
    lawyerFee: '',
    
    // Deadlines and Follow-ups
    nextDeadline: '',
    followUpDate: '',
    reminderDays: '7',
    
    // Cost Tracking
    estimatedCost: '',
    actualCost: '',
    costBreakdown: {
      drafting: '',
      filing: '',
      appearances: '',
      outOfPocket: '',
      counselFee: ''
    },
    
    // Additional Information
    notes: '',
    tags: [],
    priority: 'medium'
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
    filingFee: 15000,
    courtFee: 5000,
    counselFee: 35000,
    miscellaneous: 10000,
    total: 65000
  });

  // Progress steps
  const steps = stage === 'pre-filing' ? [
    { id: 1, title: 'Application Details', icon: FileText, completed: currentStep > 1, active: currentStep === 1 },
    { id: 2, title: 'Documents & Evidence', icon: Upload, completed: currentStep > 2, active: currentStep === 2 },
    { id: 3, title: 'Legal Team', icon: Users, completed: currentStep > 3, active: currentStep === 3 },
    { id: 4, title: 'Deadlines & Follow-ups', icon: Calendar, completed: currentStep > 4, active: currentStep === 4 },
    { id: 5, title: 'Cost Estimation', icon: DollarSign, completed: currentStep > 5, active: currentStep === 5 },
    { id: 6, title: 'Review & Submit', icon: CheckCircle, completed: currentStep > 6, active: currentStep === 6 }
  ] : [
    { id: 1, title: 'Case Information', icon: Scale, completed: currentStep > 1, active: currentStep === 1 },
    { id: 2, title: 'Case Documents', icon: FileText, completed: currentStep > 2, active: currentStep === 2 },
    { id: 3, title: 'Legal Representatives', icon: Users, completed: currentStep > 3, active: currentStep === 3 },
    { id: 4, title: 'Timeline & Costs', icon: Calendar, completed: currentStep > 4, active: currentStep === 4 },
    { id: 5, title: 'Final Review', icon: CheckCircle, completed: currentStep > 5, active: currentStep === 5 }
  ];

  // Prefill from Stage 1 when arriving via pipeline
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const from = params.get('from');
    if (from === 'stage1') {
      try {
        const raw = localStorage.getItem('stage1_carryover');
        if (raw) {
          const carry = JSON.parse(raw) as Partial<typeof formData> & {
            title?: string; court?: string; actSection?: string; particulars?: string; reliefSought?: string;
          };
          setFormData(prev => ({
            ...prev,
            title: carry.title || prev.title,
            court: carry.court || prev.court,
            actSection: carry.actSection || prev.actSection,
            particulars: carry.particulars || prev.particulars,
            reliefSought: carry.reliefSought || prev.reliefSought,
          }));
          // Clear after applying
          localStorage.removeItem('stage1_carryover');
        }
      } catch { /* ignore parse error */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Status options
  const statusOptions = [
    { value: 'filed', label: 'Filed, Under Scrutiny' },
    { value: 'defects', label: 'Defects Raised' },
    { value: 'rectified', label: 'Defects Rectified, Under Scrutiny' },
    { value: 'pending', label: 'Defect Free, Pending Numbering' },
    { value: 'numbered', label: 'Numbering Done' },
    { value: 'adjudication', label: 'Pending Adjudication' },
    { value: 'hearing', label: 'Final Hearing Done' }
  ];

  const statusOrder = ['filed','defects','rectified','pending','numbered','adjudication','hearing'] as const;
  const orderMap: Record<string, number> = Object.fromEntries(
    (statusOrder as readonly string[]).map((v, i) => [v, i])
  );
  const isStatusNumberedOrAfter = (s: string) => {
    const idx = orderMap[s] ?? -1;
    return idx >= orderMap['numbered'];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const addArrayItem = (field, item = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], item]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    // Intermediate steps: allow navigation without hard blocking
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: stage === 'pre-filing' ? "Application Saved" : "Case Created",
        description: stage === 'pre-filing' 
          ? "Your pre-filing application has been saved successfully."
          : "Your litigation case has been created successfully."
      });
      // Save Stage 2 review snapshot for merged review
      try {
        const s2 = {
          stage: 'active',
          status: formData.status,
          caseNumber: formData.caseNumber,
          filingDate: formData.filingDate,
          plaintiff: formData.plaintiff,
          defendant: formData.defendant,
          court: formData.court,
          actSection: formData.actSection,
          particulars: formData.particulars,
          reliefSought: formData.reliefSought,
          applicationCopyVersions: applicationCopyVersions.length,
          eFilingReceiptVersions: eFilingReceiptVersions.length,
          interimOrders,
          finalOrders,
          lawyer: selectedLawyer ? {
            name: selectedLawyer.name,
            specialization: selectedLawyer.specialization,
            contact: selectedLawyer.contact,
            email: selectedLawyer.email,
          } : undefined,
          costEstimation: costEstimation,
        };
        localStorage.setItem('review_stage2', JSON.stringify(s2));
      } catch { /* ignore */ }
      const params = new URLSearchParams(location.search);
      const from = params.get('from');
      if (from === 'stage1') {
        navigate('/litigation/review-submit');
      } else {
        navigate('/litigation');
      }
    }, 2000);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your litigation case has been saved as draft.",
    });
  };

  const handleFileUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would handle file upload to server here
      toast({
        title: "File Uploaded",
        description: `${e.target.files[0].name} has been uploaded.`,
      });
      
      // For demo purposes, just store the file name
      handleInputChange(field, e.target.files[0].name);

      const version = { name: e.target.files[0].name, uploadedAt: new Date().toISOString(), size: e.target.files[0].size };
      if (field === 'applicationCopy') setApplicationCopyVersions(prev => [version, ...prev]);
      if (field === 'eFilingReceipt') setEFilingReceiptVersions(prev => [version, ...prev]);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/litigation/create')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Stage Selection
            </Button>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">AI Assist</span>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {stage === 'pre-filing' ? 'Pre-filing Details (Stage 1)' : 'Summary of Litigation (Stage 2)'}
            </h2>
          </div>
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-blue-500 text-white"
                      : step.active
                        ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-xs mt-1 ${step.active ? "font-medium text-blue-800" : "text-gray-500"}`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className="hidden sm:block absolute left-0 w-full h-0.5 bg-gray-200"
                    style={{ top: "20px", zIndex: -1 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Case Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-orange-600" />
                    Active Litigation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-1">
                      <Label>Status of Application</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="caseNumber">Suit/Application Number</Label>
                      <Input id="caseNumber" placeholder={isStatusNumberedOrAfter(formData.status) ? "Auto-filled from Court (editable)" : "Pending Numbering"} disabled={!isStatusNumberedOrAfter(formData.status)} value={formData.caseNumber} onChange={(e)=>handleInputChange('caseNumber', e.target.value)} />
                      {!isStatusNumberedOrAfter(formData.status) && (
                        <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded">Pending Numbering</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plaintiff">Name of Plaintiff/Appellant/Applicant</Label>
                      <Input id="plaintiff" placeholder="Enter name" value={formData.plaintiff} onChange={(e)=>handleInputChange('plaintiff', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defendant">Name of Defendant/Respondent</Label>
                      <Input id="defendant" placeholder="Enter name" value={formData.defendant} onChange={(e)=>handleInputChange('defendant', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="court">Adjudicating Authority</Label>
                      <Input id="court" placeholder="e.g., NCLT Mumbai" value={formData.court} onChange={(e)=>handleInputChange('court', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actSection">Filed under Act & Section</Label>
                      <Input id="actSection" placeholder="IBC 2016 - Section 7" value={formData.actSection} onChange={(e)=>handleInputChange('actSection', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filingDate">Date of Filing</Label>
                      <div className="flex gap-2">
                        <Input type="date" id="filingDate" value={formData.filingDate} onChange={(e)=>handleInputChange('filingDate', e.target.value)} />
                        <Button type="button" variant="outline" onClick={()=>handleInputChange('filingDate', new Date().toISOString().slice(0,10))}>Extract</Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="particulars">Particulars of the Application</Label>
                      <Button type="button" variant="outline" size="sm" onClick={()=>handleInputChange('particulars', 'AI-extracted summary from uploaded Application (mock)')}>Generate from Application</Button>
                    </div>
                    <Textarea id="particulars" placeholder="Enter brief particulars of the application" className="min-h-[100px]" value={formData.particulars} onChange={(e)=>handleInputChange('particulars', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reliefSought">Prayer/Relief Sought</Label>
                      <Button type="button" variant="outline" size="sm" onClick={()=>handleInputChange('reliefSought', 'AI-extracted relief pointers (mock)')}>Generate from Application</Button>
                    </div>
                    <Textarea id="reliefSought" placeholder="Enter prayer/relief sought in the application" className="min-h-[100px]" value={formData.reliefSought} onChange={(e)=>handleInputChange('reliefSought', e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Case Documents */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Case Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="applicationCopy">Copy of Application Filed</Label>
                    <div className="flex items-center gap-2">
                      <Input id="applicationCopy" type="file" accept=".pdf,.doc,.docx" className="flex-1" onChange={(e)=>handleFileUpload('applicationCopy', e)} />
                      <Button variant="outline" size="sm" className="flex items-center gap-1"><Upload className="h-4 w-4" />Upload</Button>
                    </div>
                    {applicationCopyVersions.length > 0 && (
                      <div className="border rounded p-3 space-y-2">
                        <div className="text-sm font-medium">Version History</div>
                        {applicationCopyVersions.map((v,i)=> (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div>{v.name} • {new Date(v.uploadedAt).toLocaleString()}</div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm"><Download className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eFilingReceipt">E-Filing Receipt Copy</Label>
                    <div className="flex items-center gap-2">
                      <Input id="eFilingReceipt" type="file" accept=".pdf,.jpg,.jpeg,.png" className="flex-1" onChange={(e)=>handleFileUpload('eFilingReceipt', e)} />
                      <Button variant="outline" size="sm" className="flex items-center gap-1"><Upload className="h-4 w-4" />Upload</Button>
                    </div>
                    <div className="pt-2">
                      <Button type="button" variant="outline" size="sm" onClick={()=>handleInputChange('filingDate', new Date().toISOString().slice(0,10))}>Extract Date of Filing</Button>
                    </div>
                    {eFilingReceiptVersions.length > 0 && (
                      <div className="border rounded p-3 space-y-2">
                        <div className="text-sm font-medium">Version History</div>
                        {eFilingReceiptVersions.map((v,i)=> (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div>{v.name} • {new Date(v.uploadedAt).toLocaleString()}</div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm"><Download className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Interim Orders</h4>
                      <Button type="button" variant="outline" size="sm" onClick={()=>setInterimOrders(prev=>[...prev,{date:new Date().toISOString().slice(0,10), summary:'Pulled interim order (mock)'}])}>Pull from NCLT/NCLAT</Button>
                    </div>
                    {interimOrders.map((o,idx)=> (
                      <div key={idx} className="p-2 border rounded text-sm flex items-center justify-between">
                        <div>
                          <div className="font-medium">{o.date}</div>
                          <div className="text-muted-foreground">{o.summary}</div>
                        </div>
                        <Button variant="outline" size="sm">Upload Order Copy</Button>
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                      <h4 className="font-medium">Final Orders</h4>
                      <Button type="button" variant="outline" size="sm" onClick={()=>setFinalOrders(prev=>[...prev,{date:new Date().toISOString().slice(0,10), summary:'Pulled final order (mock)'}])}>Pull from NCLT/NCLAT</Button>
                    </div>
                    {finalOrders.map((o,idx)=> (
                      <div key={idx} className="p-2 border rounded text-sm flex items-center justify-between">
                        <div>
                          <div className="font-medium">{o.date}</div>
                          <div className="text-muted-foreground">{o.summary}</div>
                        </div>
                        <Button variant="outline" size="sm">Upload Order Copy</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Legal Representatives */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-blue-600" />Assigned Lawyer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Lawyer</Label>
                    <Select value={formData.assignedLawyer} onValueChange={(value)=>{handleInputChange('assignedLawyer', value); setSelectedLawyer({id:'lawyer-001',name:'Adv. Rajesh Sharma',specialization:'NCLT, NCLAT, Insolvency Law',courtPractice:'NCLT Mumbai, NCLAT New Delhi',contact:'+91-98765-43210',email:'rajesh.sharma@lawfirm.com',address:'Law Chamber, BKC, Mumbai - 400051',status:'registered'});} }>
                      <SelectTrigger><SelectValue placeholder="Select lawyer" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lawyer-001">Adv. Rajesh Sharma</SelectItem>
                        <SelectItem value="lawyer-002">Adv. Priya Mehta</SelectItem>
                        <SelectItem value="lawyer-003">Adv. Vikram Desai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedLawyer && (
                    <Card className="bg-gray-50">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
                            <div>
                              <h4 className="font-medium">{selectedLawyer.name}</h4>
                              <p className="text-sm text-gray-500">{selectedLawyer.specialization}</p>
                            </div>
                            <Badge className={selectedLawyer.status === 'registered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {selectedLawyer.status === 'registered' ? 'Registered on 998P' : 'Not Registered'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2"><Gavel className="h-4 w-4 text-gray-500" /><span>{selectedLawyer.courtPractice}</span></div>
                            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /><span>{selectedLawyer.contact}</span></div>
                            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /><span>{selectedLawyer.email}</span></div>
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500" /><span>{selectedLawyer.address}</span></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 4: Timeline & Costs */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Timeline & Follow-ups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Next Deadline</Label><Input type="date" value={formData.nextDeadline} onChange={(e)=>handleInputChange('nextDeadline', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Follow-up Date</Label><Input type="date" value={formData.followUpDate} onChange={(e)=>handleInputChange('followUpDate', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Reminder (days)</Label><Input value={formData.reminderDays} onChange={(e)=>handleInputChange('reminderDays', e.target.value)} /></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Final Review */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Final Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Case Information */}
                  <div>
                    <h4 className="mb-2 font-medium">Case Information</h4>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
                      <div><span className="text-muted-foreground">Status: </span><span className="font-medium">{formData.status}</span></div>
                      <div><span className="text-muted-foreground">Case Number: </span><span className="font-medium">{formData.caseNumber || '—'}</span></div>
                      <div><span className="text-muted-foreground">Date of Filing: </span><span className="font-medium">{formData.filingDate || '—'}</span></div>
                      <div><span className="text-muted-foreground">Plaintiff/Applicant: </span><span className="font-medium">{formData.plaintiff || '—'}</span></div>
                      <div><span className="text-muted-foreground">Defendant/Respondent: </span><span className="font-medium">{formData.defendant || '—'}</span></div>
                      <div><span className="text-muted-foreground">Adjudicating Authority: </span><span className="font-medium">{formData.court || '—'}</span></div>
                      <div className="md:col-span-3"><span className="text-muted-foreground">Filed under Act & Section: </span><span className="font-medium">{formData.actSection || '—'}</span></div>
                      <div className="md:col-span-3"><span className="text-muted-foreground">Particulars: </span><span className="font-medium">{formData.particulars || '—'}</span></div>
                      <div className="md:col-span-3"><span className="text-muted-foreground">Relief Sought: </span><span className="font-medium">{formData.reliefSought || '—'}</span></div>
                    </div>
                  </div>

                  {/* Documents Overview */}
                  <div>
                    <h4 className="mb-2 font-medium">Documents Overview</h4>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                      <div>
                        <div className="font-medium">Application Copy</div>
                        <div className="text-muted-foreground">Latest: {applicationCopyVersions[0]?.name || '—'}</div>
                        <div className="text-muted-foreground">Versions: {applicationCopyVersions.length}</div>
                      </div>
                      <div>
                        <div className="font-medium">E-Filing Receipt</div>
                        <div className="text-muted-foreground">Latest: {eFilingReceiptVersions[0]?.name || '—'}</div>
                        <div className="text-muted-foreground">Versions: {eFilingReceiptVersions.length}</div>
                      </div>
                    </div>
                  </div>

                  {/* Orders */}
                  <div>
                    <h4 className="mb-2 font-medium">Orders</h4>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                      <div>
                        <div className="font-medium">Interim Orders</div>
                        {interimOrders.length === 0 ? (
                          <div className="text-muted-foreground">No interim orders added</div>
                        ) : (
                          <ul className="list-disc pl-5">
                            {interimOrders.map((o, i) => (
                              <li key={i}>{o.date} — {o.summary}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">Final Orders</div>
                        {finalOrders.length === 0 ? (
                          <div className="text-muted-foreground">No final orders added</div>
                        ) : (
                          <ul className="list-disc pl-5">
                            {finalOrders.map((o, i) => (
                              <li key={i}>{o.date} — {o.summary}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Legal Team */}
                  <div>
                    <h4 className="mb-2 font-medium">Legal Team</h4>
                    {selectedLawyer ? (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
                        <div><span className="text-muted-foreground">Lawyer: </span><span className="font-medium">{selectedLawyer.name}</span></div>
                        <div><span className="text-muted-foreground">Specialization: </span><span className="font-medium">{selectedLawyer.specialization}</span></div>
                        <div><span className="text-muted-foreground">Contact: </span><span className="font-medium">{selectedLawyer.contact}</span></div>
                        <div className="md:col-span-3"><span className="text-muted-foreground">Court Practice: </span><span className="font-medium">{selectedLawyer.courtPractice}</span></div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No lawyer assigned</div>
                    )}
                  </div>

                  {/* Deadlines & Follow-ups */}
                  <div>
                    <h4 className="mb-2 font-medium">Deadlines & Follow-ups</h4>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
                      <div><span className="text-muted-foreground">Next Deadline: </span><span className="font-medium">{formData.nextDeadline || '—'}</span></div>
                      <div><span className="text-muted-foreground">Follow-up Date: </span><span className="font-medium">{formData.followUpDate || '—'}</span></div>
                      <div><span className="text-muted-foreground">Reminder (days): </span><span className="font-medium">{formData.reminderDays || '—'}</span></div>
                    </div>
                  </div>

                  {/* Cost Overview */}
                  <div>
                    <h4 className="mb-2 font-medium">Cost Overview</h4>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                      <div className="space-y-1">
                        <div className="flex justify-between"><span className="text-muted-foreground">Filing Fee</span><span className="font-medium">{formatCurrency(costEstimation.filingFee)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Court Fee</span><span className="font-medium">{formatCurrency(costEstimation.courtFee)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Counsel Fee</span><span className="font-medium">{formatCurrency(costEstimation.counselFee)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Miscellaneous</span><span className="font-medium">{formatCurrency(costEstimation.miscellaneous)}</span></div>
                      </div>
                      <div className="flex items-end justify-end">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Total Estimated Cost</div>
                          <div className="text-xl font-semibold text-green-600">{formatCurrency(costEstimation.total)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate('/litigation')}>Cancel</Button>
                <Button variant="outline" disabled={currentStep === 1} onClick={handlePrevious}>Previous</Button>
                <Button onClick={handleNext} className="flex items-center gap-2">
                  {currentStep < 5 ? 'Continue' : 'Submit'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cost Estimation Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Cost Estimation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Filing Fee</span>
                    <span className="font-medium">{formatCurrency(costEstimation.filingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Court Fee</span>
                    <span className="font-medium">{formatCurrency(costEstimation.courtFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Counsel Fee</span>
                    <span className="font-medium">{formatCurrency(costEstimation.counselFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Miscellaneous Expenses</span>
                    <span className="font-medium">{formatCurrency(costEstimation.miscellaneous)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Estimated Cost</span>
                    <span className="text-green-600">{formatCurrency(costEstimation.total)}</span>
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-xs text-yellow-800">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    These are estimated costs and may vary based on actual proceedings.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Helpful Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Required Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Enter the official case number as assigned by the court</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Upload a copy of the filed application (PDF format preferred)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Upload the e-filing receipt as proof of submission</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Provide accurate details of all parties involved in the litigation</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Select the current status of the application from the dropdown</p>
                </div>
                {aiEnabled && (
                  <div className="mt-3 p-3 rounded-md border bg-blue-50 text-xs text-blue-900">
                    <p className="font-medium mb-1">AI Assist is ON</p>
                    <p>
                      Based on your inputs, the AI can help pre-fill sections, validate missing fields, and suggest deadlines.
                      You can turn this off from the toggle in the header.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateActiveLitigation;

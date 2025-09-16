import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { 
  Save,
  Upload,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Zap,
  ArrowLeft,
  ArrowRight,
  Send,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CreateClaimInvitation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    capacity: "",
    authority: "",
    orderNumber: "",
    orderDate: undefined as Date | undefined,
    emailAddress: "",
    postAddress: "",
    weblinkToken: "auto-generated-token-12345",
    classesOfCreditors: [] as Array<{
      id: string;
      category: string;
      className: string;
      ars: Array<{ id: string; name: string; regn: string }>;
    }>,
    publicationDate: undefined as Date | undefined,
    publicationCopyUploaded: false,
    permitModifications: false,
    maxModifications: 1,
    modificationCutoffDate: undefined as Date | undefined,
    admissionProcess: "single_stage" as "single_stage" | "double_stage" | "threshold_based",
    thresholdLimit: "",
    claimsAsOnDate: undefined as Date | undefined,
    receivingClaimsDate: undefined as Date | undefined,
    verifyingClaimsDate: undefined as Date | undefined,
    admittingClaimsDate: undefined as Date | undefined,
    aiAssistanceOpted: false,
    aiPaymentDone: false,
    defaultInterestRate: "",
    interestType: "per_annum" as "per_annum" | "per_month" | "per_day",
    interestComputation: "simple" as "simple" | "comp_monthly" | "comp_annually",
    interestMonthBasis: "calendar" as "30_day" | "calendar" | "day" | "annum",
    forexRateDate: undefined as Date | undefined,
    forexRate: undefined as number | undefined,
    assistInterestCalc: false,
    assistForexCalc: false,
    // Submission forms & dynamic fields per category
    submissionForms: [] as Array<{
      id: string;
      category: string;
      templateUploaded: boolean;
      fields: Array<{ id: string; name: string; type: 'nature' | 'amount' }>
    }>,
    // Notification triggers config
    notifyInvite: "confirm" as 'confirm' | 'auto' | 'dont',
    notifyReminder: "confirm" as 'confirm' | 'auto' | 'dont',
    notifyAck: "confirm" as 'confirm' | 'auto' | 'dont',
    notifyDocsMissing: "dont" as 'confirm' | 'auto' | 'dont',
    notifyShortcomings: "dont" as 'confirm' | 'auto' | 'dont',
    notifyAdditionalInfo: "confirm" as 'confirm' | 'auto' | 'dont',
    notifyAdmitUpdates: "confirm" as 'confirm' | 'auto' | 'dont',
    notifyRejection: "confirm" as 'confirm' | 'auto' | 'dont',
    emailListUploaded: false,
    signatureName: "",
    signatureDesignation: "",
    signatureImageUploaded: false,
    signatureImageFileName: ""
  });

  const capacityOptions = [
    "IRP appointed by NCLT",
    "RP appointed by NCLT", 
    "Liquidator appointed by NCLT",
    "Liquidator appointed by SEBI",
    "Receiver appointed by High Court",
    "Special Transaction Auditor",
    "Statutory Auditor",
    "Internal Auditor",
    "Other (Please specify)"
  ];

  const authorityOptions = [
    "Admission Order by NCLT",
    "Liquidation Order by NCLT", 
    "Liquidator appointment letter by SEBI",
    "Receiver appointment Order by High Court",
    "Engagement Letter",
    "Letter of Appointment of Statutory Auditor",
    "Letter of Appointment as Internal Auditor",
    "Board Resolution",
    "Other (Please specify)"
  ];

  const handleInputChange = (field: string, value: string | boolean | number | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Initialize default forex date to today and set a mock rate
  useEffect(() => {
    if (!formData.forexRateDate) {
      handleInputChange('forexRateDate', new Date());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mock: compute a pseudo forex rate based on the selected date (replace with real RBI API integration later)
  useEffect(() => {
    if (formData.forexRateDate) {
      const base = 83.25; // base mock INR per USD
      const dayFactor = (formData.forexRateDate.getFullYear() * (formData.forexRateDate.getMonth() + 1) * formData.forexRateDate.getDate()) % 50;
      const rate = parseFloat((base + (dayFactor / 100)).toFixed(2));
      setFormData(prev => ({ ...prev, forexRate: rate }));
    }
  }, [formData.forexRateDate]);

  const addClassOfCreditor = () => {
    setFormData(prev => ({
      ...prev,
      classesOfCreditors: [
        ...prev.classesOfCreditors,
        {
          id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
          category: "",
          className: "",
          ars: [0,1,2].map(() => ({ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), name: "", regn: "" }))
        },
      ],
    }));
  };

  const updateClassOfCreditor = (id: string, key: 'category' | 'className', value: string) => {
    setFormData(prev => ({
      ...prev,
      classesOfCreditors: prev.classesOfCreditors.map(cls => cls.id === id ? { ...cls, [key]: value } : cls)
    }));
  };

  const removeClassOfCreditor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      classesOfCreditors: prev.classesOfCreditors.filter(cls => cls.id !== id)
    }));
  };

  const addAR = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      classesOfCreditors: prev.classesOfCreditors.map(cls => cls.id === classId ? {
        ...cls,
        ars: [...cls.ars, { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), name: "", regn: "" }]
      } : cls)
    }));
  };

  const updateAR = (classId: string, arId: string, key: 'name' | 'regn', value: string) => {
    setFormData(prev => ({
      ...prev,
      classesOfCreditors: prev.classesOfCreditors.map(cls => cls.id === classId ? {
        ...cls,
        ars: cls.ars.map(ar => ar.id === arId ? { ...ar, [key]: value } : ar)
      } : cls)
    }));
  };

  const removeAR = (classId: string, arId: string) => {
    setFormData(prev => ({
      ...prev,
      classesOfCreditors: prev.classesOfCreditors.map(cls => cls.id === classId ? {
        ...cls,
        ars: cls.ars.filter(ar => ar.id !== arId)
      } : cls)
    }));
  };

  const addSubmissionFormRow = () => {
    setFormData(prev => ({
      ...prev,
      submissionForms: [
        ...prev.submissionForms,
        { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), category: "", templateUploaded: false, fields: [] }
      ]
    }));
  };

  type SubmissionField = { id: string; name: string; type: 'nature' | 'amount' };
  type SubmissionFormKey = 'category' | 'templateUploaded' | 'fields';
  const updateSubmissionForm = (
    id: string,
    key: SubmissionFormKey,
    value: string | boolean | SubmissionField[]
  ) => {
    setFormData(prev => ({
      ...prev,
      submissionForms: prev.submissionForms.map(f => f.id === id ? { ...f, [key]: value } : f)
    }));
  };

  const addRequiredField = (formId: string) => {
    setFormData(prev => ({
      ...prev,
      submissionForms: prev.submissionForms.map(f => f.id === formId ? {
        ...f,
        fields: [...f.fields, { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), name: "", type: 'nature' }]
      } : f)
    }));
  };

  const updateRequiredField = (
    formId: string,
    fieldId: string,
    key: 'name' | 'type',
    value: string | 'nature' | 'amount'
  ) => {
    setFormData(prev => ({
      ...prev,
      submissionForms: prev.submissionForms.map(f => f.id === formId ? {
        ...f,
        fields: f.fields.map(fl => fl.id === fieldId ? { ...fl, [key]: value } : fl)
      } : f)
    }));
  };

  const removeRequiredField = (formId: string, fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      submissionForms: prev.submissionForms.map(f => f.id === formId ? {
        ...f,
        fields: f.fields.filter(fl => fl.id !== fieldId)
      } : f)
    }));
  };

  const tabOrder = ["basic", "address", "forms", "process", "ai-settings", "signature"];
  
  const getTabIndex = (tab: string) => tabOrder.indexOf(tab);
  
  const handleNext = () => {
    const currentIndex = getTabIndex(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };
  
  const handlePrevious = () => {
    const currentIndex = getTabIndex(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };
  
  const isFirstTab = () => getTabIndex(activeTab) === 0;
  const isLastTab = () => getTabIndex(activeTab) === tabOrder.length - 1;

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      toast({
        title: "Draft Saved",
        description: "Your claim invitation has been saved as draft.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndPublish = async () => {
    setLoading(true);
    try {
      // Basic validations before publish
      if (!formData.emailAddress || !formData.postAddress) {
        toast({ title: 'Missing Address Info', description: 'Please provide Email Address and Post Address.', variant: 'destructive' });
        setLoading(false);
        return;
      }
      if (formData.admissionProcess === 'threshold_based' && !formData.thresholdLimit) {
        toast({ title: 'Threshold Required', description: 'Please set a threshold limit for threshold-based process.', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const anyClassWithLessARs = formData.classesOfCreditors.some(cls => cls.ars.length < 3);
      if (anyClassWithLessARs) {
        toast({ title: 'Add Minimum ARs', description: 'Each Class of Creditors must have at least 3 Authorized Representatives.', variant: 'destructive' });
        setLoading(false);
        return;
      }
      if (formData.permitModifications && !formData.modificationCutoffDate) {
        // default to receiving claims cutoff if available
        setFormData(prev => ({ ...prev, modificationCutoffDate: prev.receivingClaimsDate }));
      }
      if (!formData.signatureImageUploaded) {
        toast({ title: 'Signature Image Not Uploaded', description: 'You can upload a signature image in the Signature tab. The system will use the saved signature on reports and notices.', variant: 'default' });
      }
      toast({
        title: "Invitation Published",
        description: "Your claim invitation has been published successfully.",
      });
      navigate('/claims/invitations');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Claim Invitation</h1>
            <p className="text-gray-600 mt-1">Set up a new claim invitation for creditors</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button onClick={handleSaveAndPublish} disabled={loading} className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <CheckCircle className="w-4 h-4 mr-2" />
              Save & Publish
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="ai-settings">AI & Settings</TabsTrigger>
            <TabsTrigger value="signature">Signature</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="capacity">Capacity in which User is inviting claims *</Label>
                    <Select value={formData.capacity} onValueChange={(value) => handleInputChange('capacity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        {capacityOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="authority">Authority under which User empowered *</Label>
                    <Select value={formData.authority} onValueChange={(value) => handleInputChange('authority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select authority" />
                      </SelectTrigger>
                      <SelectContent>
                        {authorityOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="orderNumber">Order No./Case No.</Label>
                    <Input
                      id="orderNumber"
                      value={formData.orderNumber}
                      onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                      placeholder="Enter order/case number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="orderDate">Order Date/Appointment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.orderDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.orderDate ? format(formData.orderDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.orderDate}
                          onSelect={(date) => handleInputChange('orderDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label htmlFor="supportingDocs">Upload Supporting Authority Documents</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents
                    </Button>
                    <span className="text-sm text-gray-500">
                      Engagement Letter, Appointment Letter, Board Resolution, etc.
                    </span>
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div>
                    {!isFirstTab() && (
                      <Button variant="outline" onClick={handlePrevious}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    {!isLastTab() ? (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                        Save & Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleSaveAndPublish} disabled={loading} className="bg-success hover:bg-success/90 text-success-foreground">
                        <Send className="h-4 w-4 mr-2" />
                        Save & Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Address for Receiving Claims</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emailAddress">Email Address *</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weblink">Weblink for Online Submission</Label>
                    <Input
                      id="weblink"
                      value={`https://app.998p.com/claims/submit/${formData.weblinkToken}`}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated link to redirect invited users to the Claim Submission page. Accessible to all three submitter types.</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="postAddress">Post Address *</Label>
                  <Textarea
                    id="postAddress"
                    value={formData.postAddress}
                    onChange={(e) => handleInputChange('postAddress', e.target.value)}
                    placeholder="Enter complete postal address"
                    rows={3}
                  />
                </div>

                {/* ARs for Class of Creditors */}
                <div className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">ARs for Class of Creditors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" size="sm" onClick={addClassOfCreditor}>
                        <Plus className="w-4 h-4 mr-2" /> Add Class of Creditors
                      </Button>
                      {formData.classesOfCreditors.length === 0 && (
                        <p className="text-sm text-gray-500">No classes added yet. Use the button above to add at least one.</p>
                      )}
                      {formData.classesOfCreditors.map((cls) => (
                        <div key={cls.id} className="border rounded-lg p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Category of Class Creditors</Label>
                              <Select value={cls.category} onValueChange={(v) => updateClassOfCreditor(cls.id, 'category', v)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="financial_secured">Financial creditors - secured</SelectItem>
                                  <SelectItem value="financial_unsecured">Financial creditors - unsecured</SelectItem>
                                  <SelectItem value="operational">Operational Creditors</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Name of Class</Label>
                              <Input value={cls.className} onChange={(e) => updateClassOfCreditor(cls.id, 'className', e.target.value)} placeholder="e.g., Home Buyers" />
                            </div>
                            <div className="flex items-end justify-end">
                              <Button variant="outline" size="sm" onClick={() => removeClassOfCreditor(cls.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Remove
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Authorized Representatives (min. 3)</Label>
                              <Button variant="outline" size="sm" onClick={() => addAR(cls.id)}>
                                <Plus className="w-4 h-4 mr-2" /> Add AR
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {cls.ars.map((ar) => (
                                <div key={ar.id} className="border rounded-md p-3">
                                  <Label>AR Name</Label>
                                  <Input className="mt-1" value={ar.name} onChange={(e) => updateAR(cls.id, ar.id, 'name', e.target.value)} />
                                  <Label className="mt-2 block">Regn. No.</Label>
                                  <Input className="mt-1" value={ar.regn} onChange={(e) => updateAR(cls.id, ar.id, 'regn', e.target.value)} />
                                  {cls.ars.length > 3 && (
                                    <div className="mt-2 text-right">
                                      <Button variant="outline" size="sm" onClick={() => removeAR(cls.id, ar.id)}>
                                        Remove
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Publication Details */}
                <div className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Date of Publication of Public Notice (if any)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Publication Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.publicationDate ? format(formData.publicationDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={formData.publicationDate} onSelect={(date) => handleInputChange('publicationDate', date)} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label>Upload Public Notice Copy</Label>
                          <div className="mt-2 flex items-center gap-4">
                            <Button variant="outline" size="sm" onClick={() => handleInputChange('publicationCopyUploaded', true)}>
                              <Upload className="w-4 h-4 mr-2" /> Upload Copy
                            </Button>
                            {formData.publicationCopyUploaded && <span className="text-sm text-green-700">File uploaded</span>}
                          </div>
                        </div>
                      </div>
                      {!formData.publicationDate && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                          Suggestion: Publish a "Notice inviting claims" via the integrated Publication Module. You can add this information later as well.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div>
                    {!isFirstTab() && (
                      <Button variant="outline" onClick={handlePrevious}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    {!isLastTab() ? (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                        Save & Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleSaveAndPublish} disabled={loading} className="bg-success hover:bg-success/90 text-success-foreground">
                        <Send className="h-4 w-4 mr-2" />
                        Save & Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Claim Submission Forms & Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Format of Claim Submission Forms</Label>
                  <div className="space-y-4">
                    <Button variant="outline" size="sm" onClick={addSubmissionFormRow}>
                      <Plus className="w-4 h-4 mr-2" /> Add Category Form
                    </Button>
                    {formData.submissionForms.length === 0 && (
                      <p className="text-sm text-gray-500">No categories added. Add a category to upload a template and define required fields.</p>
                    )}
                    {formData.submissionForms.map(sf => (
                      <div key={sf.id} className="border rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Category of Creditor</Label>
                            <Select value={sf.category} onValueChange={(v) => updateSubmissionForm(sf.id, 'category', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fc_secured">Financial Creditor - Secured</SelectItem>
                                <SelectItem value="fc_unsecured">FC - Unsecured</SelectItem>
                                <SelectItem value="fc_class_deposit">FC in a class - Deposit Holder</SelectItem>
                                <SelectItem value="fc_class_home">FC in a class - Home Buyers</SelectItem>
                                <SelectItem value="oc">Operational Creditor</SelectItem>
                                <SelectItem value="workmen">Workmen/Staff/Employees</SelectItem>
                                <SelectItem value="statutory">Statutory Authorities</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="consolidate">Consolidate</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end">
                            <Button variant="outline" size="sm" onClick={() => updateSubmissionForm(sf.id, 'templateUploaded', true)}>
                              <Upload className="w-4 h-4 mr-2" /> Upload Claim Submission Form
                            </Button>
                            {sf.templateUploaded && <span className="ml-3 text-xs text-green-700">Template uploaded</span>}
                          </div>
                        </div>
                        <div>
                          <Label>Fields Required for Online Submission</Label>
                          <div className="mt-2 space-y-3">
                            {sf.fields.map(field => (
                              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Input placeholder="Field Name" value={field.name} onChange={(e) => updateRequiredField(sf.id, field.id, 'name', e.target.value)} />
                                <Select value={field.type} onValueChange={(v) => updateRequiredField(sf.id, field.id, 'type', v)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="nature">Nature of Field</SelectItem>
                                    <SelectItem value="amount">Amount Field</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center">
                                  <Button variant="outline" size="sm" onClick={() => removeRequiredField(sf.id, field.id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Remove
                                  </Button>
                                </div>
                              </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => addRequiredField(sf.id)}>
                              <Plus className="w-4 h-4 mr-2" /> Add Field
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="permitModifications"
                    checked={formData.permitModifications}
                    onCheckedChange={(checked) => handleInputChange('permitModifications', checked)}
                  />
                  <Label htmlFor="permitModifications">Permit online claim modifications by submitter</Label>
                </div>
                
                {formData.permitModifications && (
                  <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Maximum Number of Modifications</Label>
                      <Input
                        type="number"
                        value={formData.maxModifications}
                        onChange={(e) => handleInputChange('maxModifications', parseInt(e.target.value))}
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                )}

                
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div>
                    {!isFirstTab() && (
                      <Button variant="outline" onClick={handlePrevious}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    {!isLastTab() ? (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                        Save & Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleSaveAndPublish} disabled={loading} className="bg-success hover:bg-success/90 text-success-foreground">
                        <Send className="h-4 w-4 mr-2" />
                        Save & Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Process Tab */}
          <TabsContent value="process">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admission Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="single_stage"
                        name="admissionProcess"
                        value="single_stage"
                        checked={formData.admissionProcess === "single_stage"}
                        onChange={(e) => handleInputChange('admissionProcess', e.target.value)}
                      />
                      <Label htmlFor="single_stage">Single Stage - Verification Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="double_stage"
                        name="admissionProcess"
                        value="double_stage"
                        checked={formData.admissionProcess === "double_stage"}
                        onChange={(e) => handleInputChange('admissionProcess', e.target.value)}
                      />
                      <Label htmlFor="double_stage">Double Stage - Verification & Admission</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="threshold_based"
                        name="admissionProcess"
                        value="threshold_based"
                        checked={formData.admissionProcess === "threshold_based"}
                        onChange={(e) => handleInputChange('admissionProcess', e.target.value)}
                      />
                      <Label htmlFor="threshold_based">Threshold Based</Label>
                    </div>
                  </div>

                  {formData.admissionProcess === "threshold_based" && (
                    <div className="mt-4">
                      <Label>Set Threshold Limit (₹)</Label>
                      <Input
                        type="number"
                        value={formData.thresholdLimit}
                        onChange={(e) => handleInputChange('thresholdLimit', e.target.value)}
                        placeholder="Enter threshold amount"
                      />
                      <p className="text-xs text-gray-500 mt-1">Claims below the threshold: Verification stage only. Equal/above threshold: Verification + Admission.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cut-off Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Claims/Debts as on</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.claimsAsOnDate ? format(formData.claimsAsOnDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.claimsAsOnDate}
                            onSelect={(date) => handleInputChange('claimsAsOnDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>For Receiving Claims</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.receivingClaimsDate ? format(formData.receivingClaimsDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.receivingClaimsDate}
                            onSelect={(date) => handleInputChange('receivingClaimsDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>For Verifying Claims</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.verifyingClaimsDate ? format(formData.verifyingClaimsDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={formData.verifyingClaimsDate} onSelect={(date) => handleInputChange('verifyingClaimsDate', date)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>For Admitting Claims</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.admittingClaimsDate ? format(formData.admittingClaimsDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={formData.admittingClaimsDate} onSelect={(date) => handleInputChange('admittingClaimsDate', date)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>For Claim Modification</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.modificationCutoffDate ? format(formData.modificationCutoffDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.modificationCutoffDate}
                            onSelect={(date) => {
                              if (!formData.permitModifications && date) {
                                toast({ title: 'Modification not enabled', description: 'Enable "Permit online claim modifications" to set a modification cutoff date.', variant: 'destructive' });
                                return;
                              }
                              handleInputChange('modificationCutoffDate', date || formData.receivingClaimsDate);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-gray-500 mt-1">Default will be the receiving claims cutoff if not specified.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <div>
                  {!isFirstTab() && (
                    <Button variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  {!isLastTab() ? (
                    <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                      Save & Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSaveAndPublish} disabled={loading} className="bg-green-600 hover:bg-green-700">
                      <Send className="h-4 w-4 mr-2" />
                      Save & Publish
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AI & Settings Tab */}
          <TabsContent value="ai-settings">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistance & Interest Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aiAssistanceOpted"
                    checked={formData.aiAssistanceOpted}
                    onCheckedChange={(checked) => handleInputChange('aiAssistanceOpted', checked)}
                  />
                  <Label htmlFor="aiAssistanceOpted">Enable AI Assistance</Label>
                  <Zap className="w-4 h-4 text-yellow-500" />
                </div>

                {!formData.aiPaymentDone && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
                    <p className="text-blue-800">To activate AI assistance, please purchase the service.</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" onClick={() => handleInputChange('aiPaymentDone', true)}>Go to AI Assistance Purchase</Button>
                    </div>
                  </div>
                )}

                {!formData.aiAssistanceOpted && (
                  <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                    <p className="text-sm text-info">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      AI assistance helps with document analysis, interest calculations, and forex conversions.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Default Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.defaultInterestRate}
                      onChange={(e) => handleInputChange('defaultInterestRate', e.target.value)}
                      placeholder="Enter interest rate"
                    />
                  </div>
                  <div>
                    <Label>Interest Type</Label>
                    <Select value={formData.interestType} onValueChange={(value) => handleInputChange('interestType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="per_annum">Per Annum</SelectItem>
                        <SelectItem value="per_month">Per Month</SelectItem>
                        <SelectItem value="per_day">Per Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Interest Computation</Label>
                    <Select value={formData.interestComputation} onValueChange={(v) => handleInputChange('interestComputation', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="comp_monthly">Compounded Monthly</SelectItem>
                        <SelectItem value="comp_annually">Compounded Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Month Basis</Label>
                    <Select value={formData.interestMonthBasis} onValueChange={(v) => handleInputChange('interestMonthBasis', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30_day">30 days</SelectItem>
                        <SelectItem value="calendar">Calendar month</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="annum">Annum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Forex Working Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.forexRateDate ? format(formData.forexRateDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={formData.forexRateDate} onSelect={(date) => handleInputChange('forexRateDate', date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-gray-500 mt-1">By default, the system will pick RBI forex rate as on claim creation date.</p>
                    {formData.forexRate && (
                      <div className="mt-2 text-sm text-gray-700">
                        Applied Forex Rate (mock): <span className="font-medium">{formData.forexRate} INR per USD</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="assistInterest" checked={formData.assistInterestCalc} onCheckedChange={(c) => handleInputChange('assistInterestCalc', c)} />
                      <Label htmlFor="assistInterest">Should AI assist the submitter in Interest Calculation?</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="assistForex" checked={formData.assistForexCalc} onCheckedChange={(c) => handleInputChange('assistForexCalc', c)} />
                      <Label htmlFor="assistForex">Should AI assist the submitter in Forex Impact Calculation?</Label>
                    </div>
                  </div>
                </div>
                {/* Notifications & Email Upload (placed in AI & Settings) */}
                <div className="pt-4 space-y-4">
                  <div>
                    <Label>Upload list of creditor emails</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <Button variant="outline" size="sm" onClick={() => handleInputChange('emailListUploaded', true)}>
                        <Upload className="w-4 h-4 mr-2" /> Upload Excel
                      </Button>
                      {formData.emailListUploaded && <span className="text-xs text-green-700">List uploaded</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Excel format with names, reference number (if any), and email address.</p>
                  </div>
                  <div>
                    <Label>Update list of creditor emails</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" /> Upload Updated Excel
                      </Button>
                      <span className="text-xs text-gray-500">Only the updated list users will receive the notification; prior users will not be notified.</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Inviting Submission of claims</Label>
                      <Select value={formData.notifyInvite} onValueChange={(v) => handleInputChange('notifyInvite', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirm">Confirm Before</SelectItem>
                          <SelectItem value="auto">Auto-Send</SelectItem>
                          <SelectItem value="dont">Don't Send</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Reminder for Submission of claims</Label>
                      <Select value={formData.notifyReminder} onValueChange={(v) => handleInputChange('notifyReminder', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirm">Confirm Before</SelectItem>
                          <SelectItem value="auto">Auto-Send</SelectItem>
                          <SelectItem value="dont">Don't Send</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Acknowledgement of receipt of claims</Label>
                      <Select value={formData.notifyAck} onValueChange={(v) => handleInputChange('notifyAck', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirm">Confirm Before</SelectItem>
                          <SelectItem value="auto">Auto-Send</SelectItem>
                          <SelectItem value="dont">Don't Send</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Documents Not-uploaded</Label>
                      <Select value={formData.notifyDocsMissing} onValueChange={(v) => handleInputChange('notifyDocsMissing', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirm">Confirm Before</SelectItem>
                          <SelectItem value="auto">Auto-Send</SelectItem>
                          <SelectItem value="dont">Don't Send</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Shortcomings in Documents Uploaded</Label>
                      <Select value={formData.notifyShortcomings} onValueChange={(v) => handleInputChange('notifyShortcomings', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirm">Confirm Before</SelectItem>
                          <SelectItem value="auto">Auto-Send</SelectItem>
                          <SelectItem value="dont">Don't Send</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Request for Additional Information/Supporting Documents</Label>
                      <Select value={formData.notifyAdditionalInfo} onValueChange={(v) => handleInputChange('notifyAdditionalInfo', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirm">Confirm Before</SelectItem>
                          <SelectItem value="auto">Auto-Send</SelectItem>
                          <SelectItem value="dont">Don't Send</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Updates on Admitted and Not-admitted Claim Amounts</Label>
                      <Select value={formData.notifyAdmitUpdates} onValueChange={(v) => handleInputChange('notifyAdmitUpdates', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirm">Confirm Before</SelectItem>
                          <SelectItem value="auto">Auto-Send</SelectItem>
                          <SelectItem value="dont">Don't Send</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Claim Rejection</Label>
                      <Select value={formData.notifyRejection} onValueChange={(v) => handleInputChange('notifyRejection', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirm">Confirm Before</SelectItem>
                          <SelectItem value="auto">Auto-Send</SelectItem>
                          <SelectItem value="dont">Don't Send</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div>
                    {!isFirstTab() && (
                      <Button variant="outline" onClick={handlePrevious}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    {!isLastTab() ? (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                        Save & Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleSaveAndPublish} disabled={loading} className="bg-success hover:bg-success/90 text-success-foreground">
                        <Send className="h-4 w-4 mr-2" />
                        Save & Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signature Tab */}
          <TabsContent value="signature">
            <Card>
              <CardHeader>
                <CardTitle>Digital Signature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signatureName">Name *</Label>
                    <Input
                      id="signatureName"
                      value={formData.signatureName}
                      onChange={(e) => handleInputChange('signatureName', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signatureDesignation">Designation *</Label>
                    <Input
                      id="signatureDesignation"
                      value={formData.signatureDesignation}
                      onChange={(e) => handleInputChange('signatureDesignation', e.target.value)}
                      placeholder="Enter designation"
                    />
                  </div>
                </div>
                <div>
                  <Label>Upload Signature Image</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, signatureImageUploaded: true, signatureImageFileName: 'signature.png' }))}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Signature
                    </Button>
                    <span className="text-sm text-gray-500">PNG, JPG formats accepted</span>
                    {formData.signatureImageUploaded && (
                      <span className="text-xs text-green-700">Uploaded: {formData.signatureImageFileName || 'signature image'}</span>
                    )}
                  </div>
                </div>
                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                  <p className="text-sm text-warning-foreground">
                    All generated reports will include this digital signature with a disclaimer about digital signing.
                  </p>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div>
                    {!isFirstTab() && (
                      <Button variant="outline" onClick={handlePrevious}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    {!isLastTab() ? (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                        Save & Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleSaveAndPublish} disabled={loading} className="bg-success hover:bg-success/90 text-success-foreground">
                        <Send className="h-4 w-4 mr-2" />
                        Save & Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CreateClaimInvitation;

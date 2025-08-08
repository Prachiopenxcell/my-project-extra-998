import { useState } from "react";
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
    permitModifications: false,
    maxModifications: 1,
    admissionProcess: "single_stage" as "single_stage" | "double_stage" | "threshold_based",
    thresholdLimit: "",
    claimsAsOnDate: undefined as Date | undefined,
    receivingClaimsDate: undefined as Date | undefined,
    verifyingClaimsDate: undefined as Date | undefined,
    admittingClaimsDate: undefined as Date | undefined,
    aiAssistanceOpted: false,
    defaultInterestRate: "",
    interestType: "per_annum" as "per_annum" | "per_month" | "per_day",
    signatureName: "",
    signatureDesignation: ""
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
    <DashboardLayout userType="service_provider">
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
                      value="https://platform.com/claims/submit/auto-generated"
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated link for claim submission</p>
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
                  <Label>Upload Creditor Email List</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Excel File
                    </Button>
                    <span className="text-sm text-gray-500">
                      Excel format with names, reference numbers, and email addresses
                    </span>
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
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Signature
                    </Button>
                    <span className="text-sm text-gray-500">
                      PNG, JPG formats accepted
                    </span>
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

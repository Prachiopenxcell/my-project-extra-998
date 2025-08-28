import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  ArrowRight,
  Upload,
  Scale,
  Gavel
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

const CreateActiveLitigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(2); // Step 2: Details
  const [formData, setFormData] = useState({
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
    applicationCopy: null,
    eFilingReceipt: null,
    particulars: '',
    reliefSought: '',
    assignedLawyer: '',
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
  const steps = [
    { id: 1, title: "Stage Selection", completed: true },
    { id: 2, title: "Details", completed: false, active: true },
    { id: 3, title: "Documents", completed: false },
    { id: 4, title: "Review", completed: false }
  ];

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Validation logic here
    navigate('/litigation/create/documents');
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
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? "bg-blue-500 text-white" 
                    : step.active 
                      ? "bg-blue-100 text-blue-800 border-2 border-blue-500" 
                      : "bg-gray-100 text-gray-400"
                }`}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <span className={`text-xs mt-1 ${
                  step.active ? "font-medium text-blue-800" : "text-gray-500"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute left-0 w-full h-0.5 bg-gray-200" style={{ top: "20px", zIndex: -1 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Case Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-orange-600" />
                  Active Litigation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caseNumber">Suit/Application Number</Label>
                    <Input 
                      id="caseNumber" 
                      placeholder="e.g., CP(IB)-123/MB/2025" 
                      value={formData.caseNumber}
                      onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status of Application</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="court">Adjudicating Authority</Label>
                    <Select 
                      value={formData.court} 
                      onValueChange={(value) => handleInputChange('court', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select court" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nclt-mumbai">NCLT Mumbai</SelectItem>
                        <SelectItem value="nclt-delhi">NCLT Delhi</SelectItem>
                        <SelectItem value="nclt-chennai">NCLT Chennai</SelectItem>
                        <SelectItem value="nclat">NCLAT</SelectItem>
                        <SelectItem value="high-court">High Court</SelectItem>
                        <SelectItem value="supreme-court">Supreme Court</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="filingDate">Date of Filing</Label>
                    <Input 
                      id="filingDate" 
                      type="date" 
                      value={formData.filingDate}
                      onChange={(e) => handleInputChange('filingDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actSection">Filed Under Act & Section</Label>
                    <Input 
                      id="actSection" 
                      placeholder="e.g., IBC 2016, Section 7" 
                      value={formData.actSection}
                      onChange={(e) => handleInputChange('actSection', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="caseCategory">Case Category</Label>
                    <Select 
                      value={formData.caseCategory} 
                      onValueChange={(value) => handleInputChange('caseCategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="insolvency">Insolvency</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                        <SelectItem value="criminal">Criminal</SelectItem>
                        <SelectItem value="arbitration">Arbitration</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plaintiff">Name of Plaintiff/Appellant/Applicant</Label>
                    <Input 
                      id="plaintiff" 
                      placeholder="Enter name" 
                      value={formData.plaintiff}
                      onChange={(e) => handleInputChange('plaintiff', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defendant">Name of Defendant/Respondent</Label>
                    <Input 
                      id="defendant" 
                      placeholder="Enter name" 
                      value={formData.defendant}
                      onChange={(e) => handleInputChange('defendant', e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicationCopy">Copy of Application Filed</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="applicationCopy" 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="flex-1"
                        onChange={(e) => handleFileUpload('applicationCopy', e)}
                      />
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Upload PDF or Word document (Max: 10MB)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="eFilingReceipt">E-Filing Receipt Copy</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="eFilingReceipt" 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        className="flex-1"
                        onChange={(e) => handleFileUpload('eFilingReceipt', e)}
                      />
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Upload PDF or image (Max: 5MB)</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="particulars">Particulars of the Application</Label>
                    <Textarea 
                      id="particulars" 
                      placeholder="Enter brief particulars of the application" 
                      className="min-h-[100px]"
                      value={formData.particulars}
                      onChange={(e) => handleInputChange('particulars', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reliefSought">Prayer/Relief Sought</Label>
                    <Textarea 
                      id="reliefSought" 
                      placeholder="Enter prayer/relief sought in the application" 
                      className="min-h-[100px]"
                      value={formData.reliefSought}
                      onChange={(e) => handleInputChange('reliefSought', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lawyer Assignment Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Assigned Lawyer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Lawyer</Label>
                  <Select 
                    value={formData.assignedLawyer} 
                    onValueChange={(value) => {
                      handleInputChange('assignedLawyer', value);
                      setSelectedLawyer({
                        id: "lawyer-001",
                        name: "Adv. Rajesh Sharma",
                        specialization: "NCLT, NCLAT, Insolvency Law",
                        courtPractice: "NCLT Mumbai, NCLAT New Delhi",
                        contact: "+91-98765-43210",
                        email: "rajesh.sharma@lawfirm.com",
                        address: "Law Chamber, BKC, Mumbai - 400051",
                        status: "registered"
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lawyer" />
                    </SelectTrigger>
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
                          <div className="flex items-center gap-2">
                            <Gavel className="h-4 w-4 text-gray-500" />
                            <span>{selectedLawyer.courtPractice}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{selectedLawyer.contact}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{selectedLawyer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{selectedLawyer.address}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => navigate('/litigation')}>
                  Cancel
                </Button>
                <Button onClick={handleNext} className="flex items-center gap-2">
                  Continue to Documents
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

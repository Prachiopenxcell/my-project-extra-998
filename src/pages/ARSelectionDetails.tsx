import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, User, Award, FileText, Upload, Download, Info, AlertCircle, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

const ARSelectionDetails = () => {
  return (
    <DashboardLayout>
      <ARSelectionDetailsModule />
    </DashboardLayout>
  );
};

const ARSelectionDetailsModule = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const processId = searchParams.get("id") || "ARSEL-001";
  const isCompleted = searchParams.get("completed") === "1";
  const [currentStep] = useState(4);

  // Interfaces for AR Selection Details
  interface Candidate {
    id: string;
    name: string;
    qualification: string;
    experience: string;
    rating: number;
    completedCases: number;
    specialization: string;
    location: string;
    fees: string;
    status: "available" | "busy";
    documents: string[];
    enrolled: boolean;
    firm?: string;
    registeredUnder?: string;
    registrationNo?: string;
    disciplinaryProceedings?: boolean;
    email?: string;
    mobile?: string;
    consentLetter?: string;
    disclosureLetter?: string;
    relationshipType?: string;
    nominated?: boolean;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      locality?: string;
      state?: string;
      pincode?: string;
    };
  }
  
  interface ClassOfCreditors {
    id: string;
    name: string;
    count: number;
  }

  const [selectedAR, setSelectedAR] = useState<Candidate | null>(null);
  const [classOfCreditors, setClassOfCreditors] = useState<ClassOfCreditors>({
    id: "FC-SEC",
    name: "Financial Creditors-Secured",
    count: 1487
  });
  const [processType, setProcessType] = useState<"CIRP" | "NON-CIRP">("CIRP");
  const [activeTab, setActiveTab] = useState("candidates");
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [nominatedARs, setNominatedARs] = useState<Candidate[]>([]);
  const [selectedARForCIRP, setSelectedARForCIRP] = useState<Candidate | null>(null);
  
  const steps = [
    { id: 1, name: "Regulatory Provisions", status: "completed" },
    { id: 2, name: "Call EOI", status: "completed" },
    { id: 3, name: "Initiate Consent", status: "completed" },
    { id: 4, name: "Awaiting Consents", status: "completed" },
    { id: 5, name: "AR Selection", status: "active" }
  ] as const;

  const candidates: Candidate[] = [
    {
      id: "AR-002",
      name: "Priya Sharma",
      qualification: "CS, LLB",
      experience: "12 years",
      rating: 4.8,
      completedCases: 45,
      specialization: "Corporate Insolvency",
      location: "Mumbai",
      fees: "₹2,50,000",
      status: "available",
      documents: ["CV", "Certificates", "Case Studies"],
      enrolled: true,
      firm: "Sharma & Associates",
      registeredUnder: "IBBI",
      registrationNo: "IB789012",
      disciplinaryProceedings: false,
      email: "priya.sharma@email.com",
      mobile: "+91-9876543210",
      consentLetter: "consent_letter_priya.pdf",
      disclosureLetter: "disclosure_letter_priya.pdf",
      relationshipType: "Unrelated",
      nominated: false,
      address: {
        line1: "201, Sunrise Apartments",
        line2: "Andheri East",
        city: "Mumbai",
        locality: "Marol",
        state: "Maharashtra",
        pincode: "400059"
      }
    },
    {
      id: "AR-004",
      name: "Sunita Verma", 
      qualification: "CMA, CS",
      experience: "10 years",
      rating: 4.6,
      completedCases: 32,
      specialization: "Financial Restructuring",
      location: "Delhi",
      fees: "₹2,00,000",
      status: "available",
      documents: ["CV", "Certificates", "References"],
      enrolled: false,
      nominated: false
    },
    {
      id: "AR-005",
      name: "Rajesh Kumar",
      qualification: "CA, LLB",
      experience: "15 years",
      rating: 4.9,
      completedCases: 58,
      specialization: "Corporate Restructuring",
      location: "Mumbai",
      fees: "₹3,00,000",
      status: "available",
      documents: ["CV", "Certificates", "Case Studies"],
      enrolled: true,
      firm: "Kumar & Associates",
      registeredUnder: "IBBI",
      registrationNo: "IB123456",
      disciplinaryProceedings: false,
      email: "rajesh.kumar@email.com",
      mobile: "+91-9876543211",
      consentLetter: "consent_letter_rajesh.pdf",
      disclosureLetter: "disclosure_letter_rajesh.pdf",
      relationshipType: "Unrelated",
      nominated: false
    },
    {
      id: "AR-006",
      name: "Amit Patel",
      qualification: "CA",
      experience: "8 years",
      rating: 4.5,
      completedCases: 25,
      specialization: "Financial Analysis",
      location: "Bangalore",
      fees: "₹2,25,000",
      status: "available",
      documents: ["CV", "Certificates"],
      enrolled: false,
      nominated: false
    }
  ];

  // Auto-populate selected AR in CIRP from nominated list or the first enrolled candidate
  React.useEffect(() => {
    if (processType === "CIRP" && !selectedARForCIRP) {
      const auto = nominatedARs[0] || candidates.find(c => c.enrolled) || candidates[0];
      if (auto) setSelectedARForCIRP(auto);
    }
  }, [processType, nominatedARs, selectedARForCIRP]);
  
  const classOptions = [
    { id: "FC-SEC", name: "Financial Creditors-Secured", count: 1487 },
    { id: "FC-UNSEC", name: "Financial Creditors-Unsecured", count: 2304 },
    { id: "OC", name: "Operational Creditors", count: 865 },
    { id: "BOND-SEC", name: "Bondholders-Secured", count: 432 }
  ];

  const handleSelectAR = (candidate: Candidate) => {
    setSelectedAR(candidate);
    
    // If candidate is not enrolled, show enrollment form
    if (!candidate.enrolled) {
      setShowEnrollmentForm(true);
    }
  };

  const handleConfirmSelection = () => {
    if (!selectedAR) return;
    
    // Add to nominated ARs
    if (!nominatedARs.some(ar => ar.id === selectedAR.id)) {
      const updatedCandidate = {...selectedAR, nominated: true};
      setNominatedARs([...nominatedARs, updatedCandidate]);
      
      // Update in candidates list
      const updatedCandidates = candidates.map(c => 
        c.id === selectedAR.id ? {...c, nominated: true} : c
      );
      
      toast({
        title: "AR Nominated",
        description: `${selectedAR.name} has been nominated as AR.`,
        variant: "default"
      });
    }
    
    // Reset selection
    setSelectedAR(null);
    setShowEnrollmentForm(false);
    setActiveTab("nominated");
  };
  
  const handleSelectARForCIRP = (candidate: Candidate) => {
    setSelectedARForCIRP(candidate);
    
    toast({
      title: "AR Selected",
      description: `${candidate.name} has been selected as the AR for this process.`,
      variant: "default"
    });
  };
  
  const handleSaveEnrollmentDetails = (candidate: Candidate) => {
    // Update candidate with enrollment details
    const updatedCandidate = {
      ...candidate,
      enrolled: true
    };
    
    setSelectedAR(updatedCandidate);
    setShowEnrollmentForm(false);
    
    toast({
      title: "Details Saved",
      description: "AR enrollment details have been saved.",
      variant: "default"
    });
  };
  
  const handleUploadDocument = (type: string) => {
    toast({
      title: "Document Uploaded",
      description: `${type} has been uploaded successfully.`,
      variant: "default"
    });
  };
  
  const handleFinalize = () => {
    toast({
      title: "Selection Finalized",
      description: "AR selection has been finalized and saved.",
      variant: "default"
    });
    
    navigate("/ar-facilitators");
  };

  // no-op

  return (
    <div className="container mx-auto p-6">
      {/* Header / Breadcrumb */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ar-facilitators')} className="px-2 h-8 w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
          </div>
          <h1 className="text-2xl font-bold leading-tight">AR Selection Details</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>›</span>
            <span>AR & Facilitators</span>
            <span>›</span>
            <span>Selection Details</span>
            <Badge variant="outline" className="ml-2">ID: {processId}</Badge>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  step.status === 'active' ? 'bg-primary text-primary-foreground' :
                  step.status === 'completed' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.status === 'completed' ? '✓' : step.id}
                </div>
                <div className="ml-2 text-xs md:text-sm">
                  <div className={`font-medium ${step.status === 'active' ? 'text-primary' : ''}`}>{step.name}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-14 md:w-16 h-0.5 mx-3 ${step.status === 'completed' ? 'bg-green-500' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class of Creditors */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Class of Creditors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="class-select">Select Class</Label>
              <Select value={classOfCreditors.id} onValueChange={(value) => {
                const selected = classOptions.find(opt => opt.id === value);
                if (selected) setClassOfCreditors(selected);
              }}>
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name} ({option.count} creditors)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Process Type</Label>
              <RadioGroup value={processType} onValueChange={(value: "CIRP" | "NON-CIRP") => setProcessType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CIRP" id="cirp" />
                  <Label htmlFor="cirp">CIRP Process</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NON-CIRP" id="non-cirp" />
                  <Label htmlFor="non-cirp">Non-CIRP Process</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="text-center p-3 rounded-md bg-blue-50">
              <p className="text-2xl font-bold text-blue-700">{classOfCreditors.count}</p>
              <p className="text-xs text-blue-800/80">Total Creditors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Selection Details View */}
      {isCompleted && (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Completed Selection Process Details</CardTitle>
              <p className="text-sm text-muted-foreground">Read-only summary of the finalized selection</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Class of Creditors</p>
                  <p className="font-medium">{classOfCreditors.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">AR Selected</Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Process Type</p>
                  <p className="font-medium">{processType}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-medium text-muted-foreground mb-2">Name of Probable ARs</p>
                <div className="flex gap-2 flex-wrap">
                  {candidates.map(c => (
                    <Badge key={c.id} variant="outline">{c.name}</Badge>
                  ))}
                </div>
              </div>

              {/* Details Required - Read Only */}
              <h3 className="text-sm font-semibold mb-2">Details Required</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Name</p>
                  <p className="font-medium">{(selectedARForCIRP || candidates[0]).name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Name of Firm/Agency</p>
                  <p className="font-medium">{(selectedARForCIRP || candidates[0]).firm || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Registered Under</p>
                  <p className="font-medium">{(selectedARForCIRP || candidates[0]).registeredUnder || (processType === "CIRP" ? "IBBI" : "-")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Registration No.</p>
                  <p className="font-medium">{(selectedARForCIRP || candidates[0]).registrationNo || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Disciplinary Proceedings</p>
                  <p className="font-medium">{(selectedARForCIRP || candidates[0]).disciplinaryProceedings ? "Yes" : "No"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Email ID</p>
                  <p className="font-medium">{(selectedARForCIRP || candidates[0]).email || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Mobile No.</p>
                  <p className="font-medium">{(selectedARForCIRP || candidates[0]).mobile || "-"}</p>
                </div>
                {/* Address Block */}
                <div className="md:col-span-2 space-y-2 mt-2">
                  <p className="text-xs font-medium text-muted-foreground">Registered Office Address</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Address Line 1</p>
                      <p className="font-medium">{(selectedARForCIRP || candidates[0]).address?.line1 || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Address Line 2</p>
                      <p className="font-medium">{(selectedARForCIRP || candidates[0]).address?.line2 || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Locality</p>
                      <p className="font-medium">{(selectedARForCIRP || candidates[0]).address?.locality || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">City</p>
                      <p className="font-medium">{(selectedARForCIRP || candidates[0]).address?.city || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">State</p>
                      <p className="font-medium">{(selectedARForCIRP || candidates[0]).address?.state || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pincode</p>
                      <p className="font-medium">{(selectedARForCIRP || candidates[0]).address?.pincode || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents & Relationship */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Consent to act as AR</p>
                  <Badge variant={(selectedARForCIRP || candidates[0]).consentLetter ? "default" : "secondary"}>
                    {(selectedARForCIRP || candidates[0]).consentLetter ? "Available" : "Not Provided"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Letter of Disclosure</p>
                  <Badge variant={(selectedARForCIRP || candidates[0]).disclosureLetter ? "default" : "secondary"}>
                    {(selectedARForCIRP || candidates[0]).disclosureLetter ? "Available" : "Not Provided"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Type of Relationship</p>
                  <p className="font-medium">{(selectedARForCIRP || candidates[0]).relationshipType || "-"}</p>
                </div>
              </div>

              {/* Nominated ARs */}
              <div className="mb-6">
                <p className="text-xs font-medium text-muted-foreground mb-2">Nominated ARs</p>
                {nominatedARs.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {nominatedARs.map(ar => (
                      <Badge key={ar.id} variant="outline" className="bg-green-50 text-green-700 border-green-200">{ar.name}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No nominations recorded</p>
                )}
              </div>

              {/* Selected AR List */}
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-green-800">Selected AR</h3>
                    <p className="text-sm text-green-700">{(selectedARForCIRP || candidates[0]).name}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/ar-details')}>
                    View AR Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Log */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[ 
                  { action: 'Nomination Confirmed', by: 'John Doe', time: '2024-01-22 15:20', comment: 'All documents verified' },
                  { action: 'Disclosure Uploaded', by: 'Priya Sharma', time: '2024-01-21 11:05', comment: 'Disclosure letter provided' },
                  { action: 'Consent Received', by: 'System', time: '2024-01-20 09:30', comment: 'Auto-synced from AR dashboard' },
                ].map((log, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start p-3 border rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Action</p>
                      <p className="font-medium">{log.action}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Timestamp</p>
                      <p className="font-medium">{log.time}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">System Comment</p>
                      <p className="font-medium">{log.comment}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Actionee</p>
                      <p className="font-medium">{log.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Main Content Tabs */}
      {!isCompleted && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="candidates">AR Candidates</TabsTrigger>
            <TabsTrigger value="details">Fill Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="nominated">Nominated ARs</TabsTrigger>
            <TabsTrigger value="selected">Selected AR</TabsTrigger>
          </TabsList>

        {/* AR Candidates Tab */}
        <TabsContent value="candidates">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Probable ARs - Post Consent Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className={`border rounded-lg p-5 ${selectedAR?.id === candidate.id ? "border-primary bg-primary/5" : ""}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold leading-tight">{candidate.name}</h3>
                          <p className="text-xs text-muted-foreground">ID: {candidate.id}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {candidate.enrolled ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Enrolled
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Not Enrolled
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{candidate.rating}/5.0</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Qualification</p>
                        <p className="font-medium">{candidate.qualification}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Experience</p>
                        <p className="font-medium">{candidate.experience}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Status</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Consented
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Location</p>
                        <p className="font-medium">{candidate.location}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        {!candidate.enrolled && (
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedAR(candidate);
                            setActiveTab("details");
                          }}>
                            Fill Details
                          </Button>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSelectAR(candidate)}
                        variant={selectedAR?.id === candidate.id ? "default" : "outline"}
                      >
                        {selectedAR?.id === candidate.id ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          "Select AR"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fill Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Fill AR Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedAR ? `Complete details for ${selectedAR.name}` : "Select an AR to fill details"}
              </p>
            </CardHeader>
            <CardContent>
              {selectedAR && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ar-name">Name</Label>
                      <Input id="ar-name" value={selectedAR.name} disabled className="bg-gray-50" />
                      <p className="text-xs text-muted-foreground">Auto-filled from consent submission</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firm-name">Name of Firm/Agency</Label>
                      <Input 
                        id="firm-name" 
                        defaultValue={selectedAR.firm || ""} 
                        placeholder="Enter firm or agency name"
                        disabled={selectedAR.enrolled}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="registered-under">Registered Under</Label>
                      <Select defaultValue={selectedAR.registeredUnder || (processType === "CIRP" ? "IBBI" : undefined)} disabled={processType === "CIRP"}>
                        <SelectTrigger id="registered-under">
                          <SelectValue placeholder="Select registration authority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IBBI">IBBI</SelectItem>
                          <SelectItem value="ICAI">ICAI</SelectItem>
                          <SelectItem value="ICSI">ICSI</SelectItem>
                          <SelectItem value="ICMAI">ICMAI</SelectItem>
                        </SelectContent>
                      </Select>
                      {processType === "CIRP" && (
                        <p className="text-xs text-muted-foreground">Auto-selected for CIRP process</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration-no">Registration Number</Label>
                      <Input 
                        id="registration-no" 
                        defaultValue={selectedAR.registrationNo || ""} 
                        placeholder="Enter registration number"
                        disabled={selectedAR.enrolled}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Subject to Disciplinary Proceedings?</Label>
                    <RadioGroup defaultValue={selectedAR.disciplinaryProceedings ? "yes" : "no"}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="disciplinary-no" />
                        <Label htmlFor="disciplinary-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="disciplinary-yes" />
                        <Label htmlFor="disciplinary-yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Registered Office Address</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address-line1">Address Line 1</Label>
                        <Input id="address-line1" placeholder="Enter address line 1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address-line2">Address Line 2</Label>
                        <Input id="address-line2" placeholder="Enter address line 2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Enter city" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="telangana">Telangana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" placeholder="Enter pincode" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email ID</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={selectedAR.email || ""} 
                        disabled 
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">Pre-filled from consent submission</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input 
                        id="mobile" 
                        defaultValue={selectedAR.mobile || ""} 
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveEnrollmentDetails(selectedAR)}>
                      Save Details
                    </Button>
                  </div>
                </div>
              )}
              {!selectedAR && (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select an AR from the candidates tab to fill details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Document Management</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAR && (
                <div className="space-y-6">
                  {/* Consent Letter */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Consent to Act as AR</h3>
                      <Badge variant={selectedAR.consentLetter ? "default" : "secondary"}>
                        {selectedAR.consentLetter ? "Available" : "Required"}
                      </Badge>
                    </div>
                    {selectedAR.enrolled && selectedAR.consentLetter ? (
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium">{selectedAR.consentLetter}</p>
                          <p className="text-sm text-muted-foreground">Pulled from AR dashboard</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleUploadDocument("Consent Letter")}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Upload consent letter manually</p>
                        <Button variant="outline" size="sm" onClick={() => handleUploadDocument("Consent Letter")}>
                          Upload Document
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Disclosure Letter */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Letter of Disclosure of Relationship</h3>
                      <Badge variant={selectedAR.disclosureLetter ? "default" : "secondary"}>
                        {selectedAR.disclosureLetter ? "Available" : "Required"}
                      </Badge>
                    </div>
                    {selectedAR.enrolled && selectedAR.disclosureLetter ? (
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium">{selectedAR.disclosureLetter}</p>
                          <p className="text-sm text-muted-foreground">Pulled from AR dashboard</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleUploadDocument("Disclosure Letter")}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Upload disclosure letter manually</p>
                        <Button variant="outline" size="sm" onClick={() => handleUploadDocument("Disclosure Letter")}>
                          Upload Document
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Type of Relationship */}
                  <div className="border rounded-lg p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">Type of Relationship</h3>
                      <Select defaultValue={selectedAR.relationshipType || undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unrelated">Unrelated</SelectItem>
                          <SelectItem value="Relationship A">Relationship A</SelectItem>
                          <SelectItem value="Relationship B">Relationship B</SelectItem>
                          <SelectItem value="Relationship C">Relationship C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Nomination Button */}
                  {selectedAR.consentLetter && selectedAR.disclosureLetter && selectedAR.relationshipType && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-green-800">Ready for Nomination</h3>
                          <p className="text-sm text-green-700">All required documents and details are complete</p>
                        </div>
                        <Button onClick={handleConfirmSelection} disabled={selectedAR.nominated}>
                          {selectedAR.nominated ? "Already Nominated" : "Nominate AR"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {!selectedAR && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select an AR to manage documents</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nominated ARs Tab */}
        <TabsContent value="nominated">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Nominated ARs</CardTitle>
              <p className="text-sm text-muted-foreground">ARs with complete documentation ready for selection</p>
            </CardHeader>
            <CardContent>
              {nominatedARs.length > 0 ? (
                <div className="space-y-4">
                  {nominatedARs.map((ar) => (
                    <div key={ar.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{ar.name}</h3>
                            <p className="text-sm text-muted-foreground">{ar.qualification} • {ar.experience}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Nominated
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No ARs nominated yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Complete documentation for ARs to nominate them</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Selected AR Tab */}
        <TabsContent value="selected">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Selected AR</CardTitle>
              <p className="text-sm text-muted-foreground">
                {processType === "CIRP" ? "AR selected by creditors through Claims Module" : "AR selected through voting process"}
              </p>
            </CardHeader>
            <CardContent>
              {processType === "CIRP" ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-blue-800">CIRP Process</h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      The AR will be automatically selected based on creditor voting through the Claims Module.
                    </p>
                  </div>
                  
                  {selectedARForCIRP ? (
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-green-800">{selectedARForCIRP.name}</h3>
                            <p className="text-sm text-green-700">Selected by creditors</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/ar-details')}>
                          View AR Details
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Awaiting creditor selection</p>
                      <p className="text-sm text-muted-foreground mt-2">Selection will be updated from Claims Module</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-purple-600" />
                      <h3 className="font-medium text-purple-800">Non-CIRP Process</h3>
                    </div>
                    <p className="text-sm text-purple-700">
                      Use the Voting Module to conduct AR selection process.
                    </p>
                    <Button className="mt-3" variant="outline">
                      Open Voting Module
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}

      {/* Finalize Button (hidden in completed view) */}
      {!isCompleted && (
        <div className="flex justify-end mt-6">
          <Button onClick={handleFinalize} disabled={nominatedARs.length === 0}>
            Finalize Selection Process
          </Button>
        </div>
      )}

      <div className="mt-8 text-xs text-muted-foreground border-t pt-4">
        John Doe • Service Provider • ID: TRN-636169
      </div>
    </div>
  );
};

export default ARSelectionDetails;

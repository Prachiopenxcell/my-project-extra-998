import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Save, Mail, User, FileText, Check } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const ARConsentRequest = () => {
  return (
    <DashboardLayout>
      <ARConsentRequestModule />
    </DashboardLayout>
  );
};

const ARConsentRequestModule = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const processId = searchParams.get("id") || "ARSEL-001";
  
  // State for form data
  const [classOfCreditors, setClassOfCreditors] = useState("Financial Creditors-Secured");
  const [location, setLocation] = useState("Mumbai");
  const [notes, setNotes] = useState("");
  const [emailPreview, setEmailPreview] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  
  // State for email template
  const [emailSubject, setEmailSubject] = useState("Request for Consent to Act as Authorized Representative");
  const [emailBody, setEmailBody] = useState(
    `Dear [AR Name],

I hope this email finds you well.

You are invited to serve as an Authorized Representative for the [CLASS] in the matter of [Entity Name] under the provisions of the Insolvency and Bankruptcy Code, 2016.

Please provide the following documents:
1. Written consent to act as Authorized Representative
2. Letter of Disclosure of Relationship as required under the Code
3. Copy of valid IBBI Registration Certificate

Additional Information:
- Location: [LOCATION]
- Class of Creditors: [CLASS]
[NOTES]

Kindly respond by [Response Date] to ensure timely processing of your appointment.

Regards,
John Doe
Resolution Professional`
  );
  
  // State for candidates
  const [candidates, setCandidates] = useState([
    {
      id: "1",
      name: "Rajesh Kumar",
      location: "Mumbai",
      qualification: "CA, LLB",
      ibbiReg: "IB123456",
      experience: "15 years",
      selected: false
    },
    {
      id: "2", 
      name: "Priya Sharma",
      location: "Delhi",
      qualification: "Advocate",
      ibbiReg: "IB789012",
      experience: "12 years",
      selected: false
    },
    {
      id: "3",
      name: "Amit Patel",
      location: "Bangalore", 
      qualification: "CA",
      ibbiReg: "IB345678",
      experience: "18 years",
      selected: false
    },
    {
      id: "4",
      name: "Sunita Verma",
      location: "Hyderabad",
      qualification: "CMA, CS",
      ibbiReg: "IB901234",
      experience: "10 years",
      selected: false
    }
  ]);

  const steps = [
    { id: 1, name: "Regulatory Provisions", status: "completed" },
    { id: 2, name: "Call EOI", status: "completed" },
    { id: 3, name: "Initiate Consent", status: "active" },
    { id: 4, name: "Awaiting Consents", status: "pending" },
    { id: 5, name: "AR Selection", status: "pending" }
  ] as const;

  const handleCandidateSelection = (id) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, selected: !candidate.selected } : candidate
    ));
  };

  const handleSelectAll = () => {
    const allSelected = candidates.every(candidate => candidate.selected);
    setCandidates(candidates.map(candidate => ({ ...candidate, selected: !allSelected })));
  };

  const handleSaveAndProceed = () => {
    const selectedCandidates = candidates.filter(c => c.selected);
    if (selectedCandidates.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one candidate to proceed.",
        variant: "destructive"
      });
      return;
    }

    setShowSuccessMessage(true);
    
    // Simulate email sending
    setTimeout(() => {
      toast({
        title: "Consent Requests Sent",
        description: `Sent to ${selectedCandidates.length} candidates successfully.`,
        variant: "default"
      });
      navigate("/ar-facilitators");
    }, 1500);
  };
  
  const handleSendTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "A test consent request email has been sent to your inbox for review.",
      variant: "default"
    });
  };

  const handleSaveAsDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your consent request has been saved as draft.",
      variant: "default"
    });
  };

  const handleBackToEOI = () => {
    navigate(`/ar-call-eoi?id=${processId}`);
  };

  const selectedCount = candidates.filter(c => c.selected).length;

  const consentRequests = [
    {
      id: "1",
      name: "Rajesh Kumar",
      location: "Mumbai",
      qualification: "CA, LLB",
      ibbiReg: "IB123456",
      experience: "15 years",
      status: "pending",
      sentDate: "2024-01-15",
      responseDeadline: "2024-01-25"
    },
    {
      id: "2", 
      name: "Priya Sharma",
      location: "Delhi",
      qualification: "Advocate",
      ibbiReg: "IB789012",
      experience: "12 years",
      status: "accepted",
      sentDate: "2024-01-10",
      responseDate: "2024-01-18"
    },
    {
      id: "3",
      name: "Amit Patel",
      location: "Bangalore", 
      qualification: "CA",
      ibbiReg: "IB345678",
      experience: "18 years",
      status: "declined",
      sentDate: "2024-01-08",
      responseDate: "2024-01-16"
    },
    {
      id: "4",
      name: "Sunita Verma",
      location: "Hyderabad",
      qualification: "CMA, CS",
      ibbiReg: "IB901234",
      experience: "10 years",
      status: "consented",
      sentDate: "2024-01-12",
      responseDate: "2024-01-20"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "consented":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Consented</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "consented":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "declined":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const consentedCount = consentRequests.filter(req => req.status === "consented").length;
  const pendingCount = consentRequests.filter(req => req.status === "pending").length;
  const declinedCount = consentRequests.filter(req => req.status === "declined").length;
  const totalRequests = consentRequests.length;
  const responseRate = Math.round(((totalRequests - pendingCount) / totalRequests) * 100);

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
          <h1 className="text-2xl font-bold leading-tight">AR Consent Request</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>›</span>
            <span>AR & Facilitators</span>
            <span>›</span>
            <span>Consent Request</span>
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

      {/* Success Message */}
      {showSuccessMessage && (
        <Card className="mb-6 border-green-300 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Consent Requests Initiated</p>
              <p className="text-sm text-green-700">
                Consent requests have been sent to {selectedCount} candidates. You will be redirected shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Fields */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Request for Consent from AR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="class-of-creditors">Class of Creditors</Label>
              <Select value={classOfCreditors} onValueChange={setClassOfCreditors}>
                <SelectTrigger id="class-of-creditors">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial Creditors-Secured">Financial Creditors-Secured</SelectItem>
                  <SelectItem value="Financial Creditors-Unsecured">Financial Creditors-Unsecured</SelectItem>
                  <SelectItem value="Operational Creditors">Operational Creditors</SelectItem>
                  <SelectItem value="Bondholders-Secured">Bondholders-Secured</SelectItem>
                  <SelectItem value="Debenture holders-Secured">Debenture holders-Secured</SelectItem>
                  <SelectItem value="Deposit holders-Secured">Deposit holders-Secured</SelectItem>
                  <SelectItem value="Bondholders-Unsecured">Bondholders-Unsecured</SelectItem>
                  <SelectItem value="Debenture holders-Unsecured">Debenture holders-Unsecured</SelectItem>
                  <SelectItem value="Deposit holders-Unsecured">Deposit holders-Unsecured</SelectItem>
                  <SelectItem value="Homebuyers">Homebuyers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Location can be specified manually or use creditor's location if suggested by system.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any specific requirements or notes for the AR candidates..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Probable ARs Details */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select candidates to send invitation for consent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="select-all" checked={candidates.every(c => c.selected)} onCheckedChange={handleSelectAll} />
                      <Label htmlFor="select-all" className="text-xs font-medium">Select All</Label>
                    </div>
                  </th>
                  <th className="text-left py-2">AR Name</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-left py-2">Profession</th>
                  <th className="text-left py-2">Experience</th>
                  <th className="text-left py-2">IBBI Reg</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <Checkbox 
                        id={`candidate-${candidate.id}`} 
                        checked={candidate.selected}
                        onCheckedChange={() => handleCandidateSelection(candidate.id)}
                      />
                    </td>
                    <td className="py-3 font-medium">{candidate.name}</td>
                    <td className="py-3">{candidate.location}</td>
                    <td className="py-3">{candidate.qualification}</td>
                    <td className="py-3">{candidate.experience}</td>
                    <td className="py-3">{candidate.ibbiReg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Selected candidates: {selectedCount} of {candidates.length}
          </div>
        </CardContent>
      </Card>

      {/* Email Template Preview */}
      <Card className="mb-6">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Consent Letter Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditingTemplate(!isEditingTemplate)}>
              {isEditingTemplate ? "Cancel Edit" : "Edit Template"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEmailPreview(!emailPreview)}>
              {emailPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </CardHeader>
        {emailPreview && !isEditingTemplate && (
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Subject: {emailSubject} - {classOfCreditors}</p>
                </div>
                <div className="space-y-2 text-sm">
                  {emailBody
                    .replace(/\[CLASS\]/g, classOfCreditors)
                    .replace(/\[LOCATION\]/g, location)
                    .replace(/\[NOTES\]/g, notes ? `- Special Notes: ${notes}` : '')
                    .split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
        
        {emailPreview && isEditingTemplate && (
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input 
                  id="email-subject" 
                  value={emailSubject} 
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-body">Email Body</Label>
                <p className="text-xs text-muted-foreground">Use [CLASS], [LOCATION], and [NOTES] as placeholders that will be automatically replaced.</p>
                <Textarea 
                  id="email-body" 
                  value={emailBody} 
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => {
                    toast({
                      title: "Template Saved",
                      description: "Your consent letter template has been saved.",
                      variant: "default"
                    });
                    setIsEditingTemplate(false);
                  }}
                >
                  Save Template
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>


      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveAsDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button variant="secondary" onClick={handleSendTestEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send Test Email
          </Button>
        </div>
        <Button onClick={handleSaveAndProceed} disabled={selectedCount === 0}>
          <Check className="h-4 w-4 mr-2" />
          Save and Send {selectedCount > 0 ? `(${selectedCount} selected)` : ''}
        </Button>
      </div>

      <div className="mt-8 text-xs text-muted-foreground border-t pt-4">
        John Doe • Service Provider • ID: TRN-636169
      </div>
    </div>
  );
};

export default ARConsentRequest;

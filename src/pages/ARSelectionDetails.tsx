import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, X, Clock, User, Award, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ARSelectionDetails = () => {
  return (
    <DashboardLayout>
      <ARSelectionDetailsModule />
    </DashboardLayout>
  );
};

const ARSelectionDetailsModule = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(4);
  const [selectedAR, setSelectedAR] = useState(null);

  const steps = [
    "Regulatory Provisions",
    "Call EOI",
    "Initiate Consent",
    "Awaiting Consents",
    "AR Selection"
  ];

  const candidates = [
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
      documents: ["CV", "Certificates", "Case Studies"]
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
      documents: ["CV", "Certificates", "References"]
    }
  ];

  const handleSelectAR = (candidate) => {
    setSelectedAR(candidate);
  };

  const handleConfirmSelection = () => {
    navigate("/ar-facilitators");
  };

  const handleBackToConsent = () => {
    navigate("/ar-facilitators/consent-request");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ar-facilitators')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-bold">AR Selection Details</h1>
          <p className="text-muted-foreground">
            Dashboard &gt; AR &amp; Facilitators &gt; Selection Details
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index === currentStep 
                ? "bg-primary text-primary-foreground" 
                : index < currentStep 
                  ? "bg-green-500 text-white" 
                  : "bg-muted text-muted-foreground"
            }`}>
              {index < currentStep ? "✓" : index + 1}
            </div>
            <div className="ml-2 text-sm">
              <div className={`font-medium ${index === currentStep ? "text-primary" : ""}`}>
                {step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                index < currentStep ? "bg-green-500" : "bg-muted"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Selection Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selection Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{candidates.length}</p>
              <p className="text-sm text-muted-foreground">Eligible Candidates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-sm text-muted-foreground">To be Selected</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">IBBI CIRP</p>
              <p className="text-sm text-muted-foreground">Framework</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Evaluation & Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className={`border rounded-lg p-6 ${
                selectedAR?.id === candidate.id ? "border-primary bg-primary/5" : ""
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {candidate.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{candidate.rating}/5.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Qualification</p>
                    <p className="font-medium">{candidate.qualification}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Experience</p>
                    <p className="font-medium">{candidate.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed Cases</p>
                    <p className="font-medium">{candidate.completedCases}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="font-medium">{candidate.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                    <p className="font-medium">{candidate.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Professional Fees</p>
                    <p className="font-medium text-green-600">{candidate.fees}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Documents Submitted</p>
                  <div className="flex gap-2">
                    {candidate.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Available
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
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
                        "Select as AR"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selection Confirmation */}
      {selectedAR && (
        <Card className="mt-6 border-primary">
          <CardHeader>
            <CardTitle className="text-green-600">Selection Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-medium">Selected AR: {selectedAR.name}</p>
              <p className="text-sm text-muted-foreground">
                You have selected {selectedAR.name} as the Authorized Representative for this process.
              </p>
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setSelectedAR(null)}>
                Change Selection
              </Button>
              <Button onClick={handleConfirmSelection} className="bg-green-600 hover:bg-green-700">
                Confirm & Complete Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-sm text-muted-foreground border-t pt-4">
        John Doe - Service Provider - ID: TRN-636169
      </div>
    </div>
  );
};

export default ARSelectionDetails;

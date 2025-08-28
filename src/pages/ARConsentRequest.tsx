import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Send, Mail, User } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ARConsentRequest = () => {
  return (
    <DashboardLayout>
      <ARConsentRequestModule />
    </DashboardLayout>
  );
};

const ARConsentRequestModule = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);

  const steps = [
    "Regulatory Provisions",
    "Call EOI",
    "Initiate Consent",
    "Awaiting Consents",
    "AR Selection"
  ];

  const handleProceedToSelection = () => {
    navigate("/ar-selection-details");
  };

  const handleBackToEOI = () => {
    navigate("/ar-facilitators/call-eoi");
  };

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ar-facilitators')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-bold">AR Consent Request</h1>
          <p className="text-muted-foreground">
            Dashboard &gt; AR &amp; Facilitators &gt; Consent Request
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

      {/* Consent Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{consentedCount}</p>
              <p className="text-sm text-muted-foreground">Consented</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{declinedCount}</p>
              <p className="text-sm text-muted-foreground">Declined</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{responseRate}%</p>
              <p className="text-sm text-muted-foreground">Response Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Consent Collection Progress</span>
              <span>{totalRequests - pendingCount} of {totalRequests} responded</span>
            </div>
            <Progress value={responseRate} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Probable ARs Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Probable ARs Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">AR Name</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-left py-2">Profession</th>
                  <th className="text-left py-2">IBBI Reg</th>
                  <th className="text-left py-2">Send</th>
                </tr>
              </thead>
              <tbody>
                {consentRequests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="py-3 font-medium">{request.name}</td>
                    <td className="py-3">{request.location ?? 'Mumbai'}</td>
                    <td className="py-3">{request.qualification ?? 'CA/Advocate'}</td>
                    <td className="py-3">{request.ibbiReg ?? 'IB123'}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={request.status !== "pending"}
                          className="mr-2"
                          readOnly
                        />
                        {request.status !== "pending" ? "✓" : ""}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Email Template Preview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Template Preview:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="space-y-3">
              <div>
                <p className="font-medium">Subject: Invitation for AR Position - [Entity Name]</p>
              </div>
              <div className="space-y-2 text-sm">
                <p>Dear [AR Name],</p>
                <p>You are invited to serve as Authorized Representative for [Class of Creditors] in [Entity Name].</p>
                <p>Please provide:</p>
                <ul className="list-decimal list-inside ml-4 space-y-1">
                  <li>Consent to act as AR</li>
                  <li>Letter of Disclosure of Relationship</li>
                </ul>
                <p>Respond by: [Date]</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Consent Requests Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {request.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{request.qualification}</p>
                    <p className="text-sm text-muted-foreground">{request.experience} experience</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p className="text-muted-foreground">Sent: {request.sentDate}</p>
                    {request.responseDate && (
                      <p className="text-muted-foreground">Responded: {request.responseDate}</p>
                    )}
                    {request.status === "pending" && (
                      <p className="text-muted-foreground">Deadline: {request.responseDeadline}</p>
                    )}
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline">
          Send Reminder
        </Button>
        <Button onClick={handleProceedToSelection} disabled={consentedCount < 1}>
          Proceed to Selection ({consentedCount} consented)
        </Button>
      </div>

      <div className="mt-8 text-sm text-muted-foreground border-t pt-4">
        John Doe - Service Provider - ID: TRN-636169
      </div>
    </div>
  );
};

export default ARConsentRequest;

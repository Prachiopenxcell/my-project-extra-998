import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const ARCallEOI = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("Financial Creditors-Secured");
  const [invitationParams, setInvitationParams] = useState({
    invitations: "10",
    nominations: "5",
    arsToSelect: "2",
    userProposed: "3",
    systemProposed: "7"
  });
  
  const [manualNominations, setManualNominations] = useState([
    { name: "John Smith", email: "john.smith@email.com" },
    { name: "Sarah Johnson", email: "sarah.j@email.com" },
    { name: "Michael Brown", email: "m.brown@email.com" }
  ]);
  
  const [systemSuggestions, setSystemSuggestions] = useState([
    { id: 1, name: "AR Name 1", location: "Mumbai", ibbi: "IB123", selected: true },
    { id: 2, name: "AR Name 2", location: "Delhi", ibbi: "IB124", selected: true },
    { id: 3, name: "AR Name 3", location: "Bangalore", ibbi: "IB125", selected: true },
    { id: 4, name: "AR Name 4", location: "Chennai", ibbi: "IB126", selected: false },
    { id: 5, name: "AR Name 5", location: "Pune", ibbi: "IB127", selected: false }
  ]);

  const progressSteps = [
    { id: 1, name: "Regulatory Provisions", status: "completed" },
    { id: 2, name: "Call EOI Selection", status: "active" },
    { id: 3, name: "Initiate Consent", status: "pending" },
    { id: 4, name: "Awaiting Consents", status: "pending" },
    { id: 5, name: "AR Selection", status: "pending" }
  ];

  const addManualNomination = () => {
    setManualNominations([...manualNominations, { name: "", email: "" }]);
  };

  const removeManualNomination = (index: number) => {
    setManualNominations(manualNominations.filter((_, i) => i !== index));
  };

  const updateManualNomination = (index: number, field: string, value: string) => {
    const updated = [...manualNominations];
    updated[index] = { ...updated[index], [field]: value };
    setManualNominations(updated);
  };

  const toggleSystemSuggestion = (id: number) => {
    setSystemSuggestions(systemSuggestions.map(ar => 
      ar.id === id ? { ...ar, selected: !ar.selected } : ar
    ));
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/ar-selection-process')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-2xl font-bold">Call EOI for AR Nomination</h1>
            <p className="text-muted-foreground">
              Dashboard &gt; AR &amp; Facilitators &gt; Call EOI
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-center mb-4">Progress Tracker</h3>
            <div className="flex items-center justify-between">
              {progressSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      step.status === 'active' ? 'bg-primary' :
                      step.status === 'completed' ? 'bg-green-500' :
                      'bg-gray-300'
                    }`} />
                    <span className={`text-xs mt-2 text-center max-w-16 leading-tight ${
                      step.status === 'active' ? 'text-primary font-medium' :
                      step.status === 'completed' ? 'text-green-600 font-medium' :
                      'text-gray-500'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-3 ${
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* General Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-lg font-semibold">
              GENERAL SUMMARY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Entity:</p>
                <p className="font-medium">Acme Corporation Ltd.</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Selected Law:</p>
                <p className="font-medium">IBBI CIRP</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="class-select">Class of Creditors:</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial Creditors-Secured">Financial Creditors-Secured</SelectItem>
                  <SelectItem value="Financial Creditors-Unsecured">Financial Creditors-Unsecured</SelectItem>
                  <SelectItem value="Operational Creditors">Operational Creditors</SelectItem>
                  <SelectItem value="Bondholders-Secured">Bondholders-Secured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invitation Parameters */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Invitation Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Req. No. of Invitations for EOIs (A):</Label>
                    <Input
                      value={invitationParams.invitations}
                      onChange={(e) => setInvitationParams({...invitationParams, invitations: e.target.value})}
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Req. No. of Nominations:</Label>
                    <Input
                      value={invitationParams.nominations}
                      onChange={(e) => setInvitationParams({...invitationParams, nominations: e.target.value})}
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">No. of ARs to be selected:</Label>
                    <Input
                      value={invitationParams.arsToSelect}
                      onChange={(e) => setInvitationParams({...invitationParams, arsToSelect: e.target.value})}
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">No. of ARs proposed by User (D):</Label>
                    <Input
                      value={invitationParams.userProposed}
                      onChange={(e) => setInvitationParams({...invitationParams, userProposed: e.target.value})}
                      className="mt-1 h-8"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">No. of ARs proposed by System:</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={invitationParams.systemProposed} readOnly className="max-w-20 h-8" />
                    <span className="text-sm text-muted-foreground">(Auto)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Manual AR Nominations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base font-medium">Manual AR Nominations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground pb-2">
                <span>Name</span>
                <span>Email</span>
                <span>Action</span>
              </div>
              {manualNominations.map((nomination, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <Input
                    value={nomination.name}
                    onChange={(e) => updateManualNomination(index, 'name', e.target.value)}
                    className="h-8"
                  />
                  <Input
                    value={nomination.email}
                    onChange={(e) => updateManualNomination(index, 'email', e.target.value)}
                    className="h-8"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeManualNomination(index)}
                    className="h-8"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addManualNomination} className="mt-4 h-8">
                <Plus className="h-4 w-4 mr-2" />
                Add Another AR Nomination
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Suggested ARs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base font-medium">System Suggested ARs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemSuggestions.map((ar) => (
                <div key={ar.id} className="flex items-center gap-3 p-2">
                  <Checkbox
                    checked={ar.selected}
                    onCheckedChange={() => toggleSystemSuggestion(ar.id)}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-sm">{ar.name}</span>
                    <span className="text-sm text-muted-foreground ml-4">
                      Location: {ar.location}
                    </span>
                    <span className="text-sm text-muted-foreground ml-4">
                      IBBI: {ar.ibbi}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/ar-selection-process')}>
            Save as Draft
          </Button>
          <Button onClick={() => navigate('/ar-consent-request')}>
            Initiate Consent Request
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ARCallEOI;

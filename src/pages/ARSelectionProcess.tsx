import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

// Define the steps in the AR Selection Process
const STEPS = [
  { id: 1, name: "Regulatory Provisions" },
  { id: 2, name: "Entity & Class Details" },
  { id: 3, name: "Invitation Parameters" },
  { id: 4, name: "Manual AR Nominations" },
  { id: 5, name: "System Suggested ARs" },
  { id: 6, name: "Review & Initiate" }
];

interface ARSelectionFormData {
  // Step 1: Regulatory Provisions
  applicableLaw: string;
  notes: string;
  
  // Step 2: Entity & Class Details
  entityName: string;
  classOfCreditors: string;
  
  // Step 3: Invitation Parameters
  requiredInvitations: string;
  requiredNominations: string;
  arsToSelect: string;
  userProposed: string;
  systemProposed: string;
  
  // Step 4: Manual AR Nominations
  manualNominations: Array<{ name: string; email: string }>;
  
  // Step 5: System Suggested ARs
  selectedSystemARs: string[];
}

const ARSelectionProcess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<ARSelectionFormData>({
    // Step 1
    applicableLaw: "IBBI CIRP",
    notes: "",
    
    // Step 2
    entityName: "Acme Corporation Ltd.",
    classOfCreditors: "Financial Creditors-Secured",
    
    // Step 3
    requiredInvitations: "10",
    requiredNominations: "5",
    arsToSelect: "2",
    userProposed: "3",
    systemProposed: "7",
    
    // Step 4
    manualNominations: [
      { name: "John Smith", email: "john.smith@email.com" },
      { name: "Sarah Johnson", email: "sarah.j@email.com" },
      { name: "Michael Brown", email: "m.brown@email.com" }
    ],
    
    // Step 5
    selectedSystemARs: ["1", "2", "3"]
  });

  const progressPercentage = (currentStep / STEPS.length) * 100;

  // Handle form data changes
  const updateFormData = (data: Partial<ARSelectionFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save as draft
  const saveAsDraft = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Draft Saved",
        description: "AR Selection Process saved as draft successfully!",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "AR Selection Process initiated successfully!",
        variant: "default"
      });
      
      // Navigate to Call EOI after short delay
      setTimeout(() => {
        navigate("/ar-call-eoi");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate AR Selection Process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RegulatoryProvisionsStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <EntityClassDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <InvitationParametersStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ManualNominationsStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <SystemSuggestedARsStep formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ReviewInitiateStep formData={formData} updateFormData={updateFormData} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Initiate AR Selection Process</h1>
            <p className="text-muted-foreground">
              Dashboard &gt; AR &amp; Facilitators &gt; Initiate Selection Process
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveAsDraft} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <> Save as Draft</>
              )}
            </Button>
            {currentStep === STEPS.length ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initiating...
                  </>
                ) : (
                  <>🚀 Initiate Process</>
                )}
              </Button>
            ) : (
              <Button onClick={saveAsDraft} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>💾 Save & Continue</>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Step {currentStep}: {STEPS[currentStep - 1].name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Progress
              </span>
              <div className="w-32">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6 mb-6">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => currentStep > 1 ? prevStep() : navigate("/ar-facilitators")}
          >
            ← Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveAsDraft} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>💾 Save as Draft</>
              )}
            </Button>
            {currentStep < STEPS.length ? (
              <Button onClick={nextStep}>
                Continue →
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initiating...
                  </>
                ) : (
                  <>🚀 Initiate Process</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Step Components
const RegulatoryProvisionsStep: React.FC<{ formData: ARSelectionFormData; updateFormData: (data: Partial<ARSelectionFormData>) => void }> = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div>
      <Label htmlFor="applicable-law">Select Applicable Law:</Label>
      <Select value={formData.applicableLaw} onValueChange={(value) => updateFormData({ applicableLaw: value })}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="IBBI CIRP">IBBI (Insolvency and Bankruptcy Board of India) - CIRP</SelectItem>
          <SelectItem value="IBBI Liquidation">IBBI (Insolvency and Bankruptcy Board of India) - Liquidation</SelectItem>
          <SelectItem value="SARFAESI">SARFAESI Act</SelectItem>
          <SelectItem value="Companies Act">Companies Act 2013</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="notes">Notes (Optional):</Label>
      <Textarea
        id="notes"
        value={formData.notes}
        onChange={(e) => updateFormData({ notes: e.target.value })}
        placeholder="Add any additional notes or requirements..."
        className="mt-2"
        rows={4}
      />
    </div>
  </div>
);

const EntityClassDetailsStep: React.FC<{ formData: ARSelectionFormData; updateFormData: (data: Partial<ARSelectionFormData>) => void }> = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div>
      <Label htmlFor="entity-name">Entity Name:</Label>
      <Input
        id="entity-name"
        value={formData.entityName}
        onChange={(e) => updateFormData({ entityName: e.target.value })}
        className="mt-2"
      />
    </div>

    <div>
      <Label htmlFor="class-creditors">Class of Creditors:</Label>
      <Select value={formData.classOfCreditors} onValueChange={(value) => updateFormData({ classOfCreditors: value })}>
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
  </div>
);

const InvitationParametersStep: React.FC<{ formData: ARSelectionFormData; updateFormData: (data: Partial<ARSelectionFormData>) => void }> = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Req. No. of Invitations for EOIs (A):</Label>
        <Input
          value={formData.requiredInvitations}
          onChange={(e) => updateFormData({ requiredInvitations: e.target.value })}
          className="mt-2"
        />
      </div>
      <div>
        <Label>Req. No. of Nominations:</Label>
        <Input
          value={formData.requiredNominations}
          onChange={(e) => updateFormData({ requiredNominations: e.target.value })}
          className="mt-2"
        />
      </div>
      <div>
        <Label>No. of ARs to be selected:</Label>
        <Input
          value={formData.arsToSelect}
          onChange={(e) => updateFormData({ arsToSelect: e.target.value })}
          className="mt-2"
        />
      </div>
      <div>
        <Label>No. of ARs proposed by User (D):</Label>
        <Input
          value={formData.userProposed}
          onChange={(e) => updateFormData({ userProposed: e.target.value })}
          className="mt-2"
        />
      </div>
    </div>
    <div>
      <Label>No. of ARs proposed by System:</Label>
      <div className="flex items-center gap-2 mt-2">
        <Input value={formData.systemProposed} readOnly className="max-w-20" />
        <span className="text-sm text-muted-foreground">(Auto-calculated)</span>
      </div>
    </div>
  </div>
);

const ManualNominationsStep: React.FC<{ formData: ARSelectionFormData; updateFormData: (data: Partial<ARSelectionFormData>) => void }> = ({ formData, updateFormData }) => {
  const addNomination = () => {
    const newNominations = [...formData.manualNominations, { name: "", email: "" }];
    updateFormData({ manualNominations: newNominations });
  };

  const removeNomination = (index: number) => {
    const newNominations = formData.manualNominations.filter((_, i) => i !== index);
    updateFormData({ manualNominations: newNominations });
  };

  const updateNomination = (index: number, field: string, value: string) => {
    const newNominations = [...formData.manualNominations];
    newNominations[index] = { ...newNominations[index], [field]: value };
    updateFormData({ manualNominations: newNominations });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground pb-2">
          <span>Name</span>
          <span>Email</span>
          <span>Action</span>
        </div>
        {formData.manualNominations.map((nomination, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-center">
            <Input
              value={nomination.name}
              onChange={(e) => updateNomination(index, 'name', e.target.value)}
              placeholder="Enter name"
            />
            <Input
              value={nomination.email}
              onChange={(e) => updateNomination(index, 'email', e.target.value)}
              placeholder="Enter email"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeNomination(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={addNomination} className="mt-4">
          + Add Another AR Nomination
        </Button>
      </div>
    </div>
  );
};

const SystemSuggestedARsStep: React.FC<{ formData: ARSelectionFormData; updateFormData: (data: Partial<ARSelectionFormData>) => void }> = ({ formData, updateFormData }) => {
  const systemARs = [
    { id: "1", name: "AR Name 1", location: "Mumbai", ibbi: "IB123" },
    { id: "2", name: "AR Name 2", location: "Delhi", ibbi: "IB124" },
    { id: "3", name: "AR Name 3", location: "Bangalore", ibbi: "IB125" },
    { id: "4", name: "AR Name 4", location: "Chennai", ibbi: "IB126" },
    { id: "5", name: "AR Name 5", location: "Pune", ibbi: "IB127" }
  ];

  const toggleAR = (id: string) => {
    const newSelected = formData.selectedSystemARs.includes(id)
      ? formData.selectedSystemARs.filter(arId => arId !== id)
      : [...formData.selectedSystemARs, id];
    updateFormData({ selectedSystemARs: newSelected });
  };

  return (
    <div className="space-y-4">
      {systemARs.map((ar) => (
        <div key={ar.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <Checkbox
            checked={formData.selectedSystemARs.includes(ar.id)}
            onCheckedChange={() => toggleAR(ar.id)}
          />
          <div className="flex-1">
            <span className="font-medium">{ar.name}</span>
            <span className="text-sm text-muted-foreground ml-4">
              Location: {ar.location} | IBBI: {ar.ibbi}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ReviewInitiateStep: React.FC<{ formData: ARSelectionFormData; updateFormData: (data: Partial<ARSelectionFormData>) => void }> = ({ formData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Regulatory Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Applicable Law:</strong> {formData.applicableLaw}</p>
          <p><strong>Entity:</strong> {formData.entityName}</p>
          <p><strong>Class:</strong> {formData.classOfCreditors}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invitation Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Required Invitations:</strong> {formData.requiredInvitations}</p>
          <p><strong>ARs to Select:</strong> {formData.arsToSelect}</p>
          <p><strong>Manual Nominations:</strong> {formData.manualNominations.length}</p>
          <p><strong>System ARs Selected:</strong> {formData.selectedSystemARs.length}</p>
        </CardContent>
      </Card>
    </div>
    
    {formData.notes && (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{formData.notes}</p>
        </CardContent>
      </Card>
    )}
  </div>
);

export default ARSelectionProcess;

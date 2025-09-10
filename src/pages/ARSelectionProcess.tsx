import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
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
  { id: 6, name: "Call EOI – General Summary" },
  { id: 7, name: "Initiate Consent Request" },
];

// Props and reusable summary table (function declaration so it is hoisted)
type StepProps = { formData: ARSelectionFormData; updateFormData: (data: Partial<ARSelectionFormData>) => void };

function ARSummaryTable({ formData, updateFormData }: StepProps) {
  const parseNum = (v: string) => {
    const n = parseInt(v || "0", 10);
    return isNaN(n) ? 0 : n;
  };

  const A = parseNum(formData.requiredInvitations);
  const D = parseNum(formData.userProposed);
  const calculatedSystem = Math.max(0, A - D);

  React.useEffect(() => {
    const current = parseNum(formData.systemProposed);
    if (current !== calculatedSystem) {
      updateFormData({ systemProposed: String(calculatedSystem) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [A, D]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-md text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="border border-gray-200 p-2 text-left font-medium">Class of creditors</th>
            <th className="border border-gray-200 p-2 text-left font-medium">Req. No. of invitation for EOIs (A)</th>
            <th className="border border-gray-200 p-2 text-left font-medium">Req. No. of Nominations (B)</th>
            <th className="border border-gray-200 p-2 text-left font-medium">No. of AR to be selected (C)</th>
            <th className="border border-gray-200 p-2 text-left font-medium">No. of prospective ARs to be proposed by User (D)</th>
            <th className="border border-gray-200 p-2 text-left font-medium">No. of prospective ARs to be proposed by System</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-200 p-2 min-w-[220px]">
              <Select value={formData.classOfCreditors} onValueChange={(value) => updateFormData({ classOfCreditors: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial Creditors-Secured">Financial creditors- secured</SelectItem>
                  <SelectItem value="Financial Creditors-Unsecured">Financial Creditors-unsecured</SelectItem>
                  <SelectItem value="Operational Creditors">Operational Creditors</SelectItem>
                  <SelectItem value="Bondholders-Secured">Bondholders- secured</SelectItem>
                  <SelectItem value="Debenture holders- secured">Debenture holders- secured</SelectItem>
                  <SelectItem value="Deposit holders- secured">Deposit holders- secured</SelectItem>
                  <SelectItem value="Bond holders- unsecured">Bond holders- unsecured</SelectItem>
                  <SelectItem value="Debenture holders- unsecured">Debenture holders- unsecured</SelectItem>
                  <SelectItem value="Deposit holders- unsecured">Deposit holders- unsecured</SelectItem>
                  <SelectItem value="Homebuyers">Homebuyers</SelectItem>
                </SelectContent>
              </Select>
            </td>
            <td className="border border-gray-200 p-2 min-w-[160px]">
              <Input
                value={formData.requiredInvitations}
                onChange={(e) => updateFormData({ requiredInvitations: e.target.value })}
                inputMode="numeric"
                className="h-9"
              />
            </td>
            <td className="border border-gray-200 p-2 min-w-[160px]">
              <Input
                value={formData.requiredNominations}
                onChange={(e) => updateFormData({ requiredNominations: e.target.value })}
                inputMode="numeric"
                className="h-9"
              />
            </td>
            <td className="border border-gray-200 p-2 min-w-[160px]">
              <Input
                value={formData.arsToSelect}
                onChange={(e) => updateFormData({ arsToSelect: e.target.value })}
                inputMode="numeric"
                className="h-9"
              />
            </td>
            <td className="border border-gray-200 p-2 min-w-[220px]">
              <Input
                value={formData.userProposed}
                onChange={(e) => updateFormData({ userProposed: e.target.value })}
                inputMode="numeric"
                className="h-9"
              />
            </td>
            <td className="border border-gray-200 p-2 min-w-[220px]">
              <div className="flex items-center gap-2">
                <Input value={String(calculatedSystem)} readOnly className="h-9 max-w-[100px]" />
                <span className="text-xs text-muted-foreground">Calculated (A - D)</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


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
  // Step 7: Consent selection
  selectedConsentARs?: string[];
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
    selectedSystemARs: ["1", "2", "3"],
    // Step 7
    selectedConsentARs: []
  });

  const progressPercentage = (currentStep / STEPS.length) * 100;

  // Allow deep-linking to a specific step via ?step=
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = Number(params.get('step'));
    if (stepParam && stepParam >= 1 && stepParam <= STEPS.length) {
      setCurrentStep(stepParam);
    }
  }, []);

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

  // Submit the form (finalize consent invites in Step 7)
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Validate: Step 7 requires at least one selected candidate
      if (currentStep === 7 && (!formData.selectedConsentARs || formData.selectedConsentARs.length === 0)) {
        toast({
          title: "No candidates selected",
          description: "Please select at least one AR candidate to send consent requests.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Invitation Mail has been Sent",
        description: `Consent requests have been sent to ${formData.selectedConsentARs?.length ?? 0} AR candidate(s). Emails have been sent successfully.`,
        variant: "default"
      });
      // Redirect back to listing shortly after showing the toast
      setTimeout(() => {
        navigate("/ar-facilitators", { replace: true });
        // Hard-refresh fallback in case SPA routing doesn't re-render
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            const target = "/ar-facilitators";
            if (window.location.pathname !== target) {
              window.location.assign(target);
            } else {
              // Even if path is same but view didn't update, force reload
              window.location.reload();
            }
          }
        }, 700);
      }, 800);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send consent requests. Please try again.",
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
        return <GeneralSummaryStep formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <ConsentRequestStep formData={formData} updateFormData={updateFormData} />;
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
                    Sending...
                  </>
                ) : (
                  <> Send Consent Requests</>
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
                  <> Save & Continue</>
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

        {/* Summary table visible on the page for quick reference */}
    

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
                <> Save as Draft</>
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
                    Sending...
                  </>
                ) : (
                  <> Send Consent Requests</>
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
          <SelectItem value="IBBI CIRP">IBBI CIRP</SelectItem>
          <SelectItem value="IBBI Liquidation">IBBI Liquidation</SelectItem>
          <SelectItem value="SEBI">SEBI</SelectItem>
          <SelectItem value="IBBI Insolvency">IBBI Insolvency</SelectItem>
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
          <SelectItem value="Financial Creditors-Secured">Financial creditors- secured</SelectItem>
          <SelectItem value="Financial Creditors-Unsecured">Financial Creditors-unsecured</SelectItem>
          <SelectItem value="Operational Creditors">Operational Creditors</SelectItem>
          <SelectItem value="Bondholders-Secured">Bondholders- secured</SelectItem>
          <SelectItem value="Debenture holders- secured">Debenture holders- secured</SelectItem>
          <SelectItem value="Deposit holders- secured">Deposit holders- secured</SelectItem>
          <SelectItem value="Bond holders- unsecured">Bond holders- unsecured</SelectItem>
          <SelectItem value="Debenture holders- unsecured">Debenture holders- unsecured</SelectItem>
          <SelectItem value="Deposit holders- unsecured">Deposit holders- unsecured</SelectItem>
          <SelectItem value="Homebuyers">Homebuyers</SelectItem>
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
    { id: "1", name: "Rajesh Kumar", location: "Mumbai", ibbi: "IB123456" },
    { id: "2", name: "Priya Sharma", location: "Delhi", ibbi: "IB789012" },
    { id: "3", name: "Amit Patel", location: "Bangalore", ibbi: "IB345678" },
    { id: "4", name: "Sunita Verma", location: "Chennai", ibbi: "IB901234" },
    { id: "5", name: "Neha Gupta", location: "Pune", ibbi: "IB567890" }
  ];

  const toggleAR = (id: string) => {
    const newSelected = formData.selectedSystemARs.includes(id)
      ? formData.selectedSystemARs.filter(arId => arId !== id)
      : [...formData.selectedSystemARs, id];
    updateFormData({ selectedSystemARs: newSelected });
  };

  return (
    <div className="space-y-4">
      {/* Summary table within Step 5 as per requirement */}
      {/* <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">AR Nomination Summary</h3>
        <ARSummaryTable formData={formData} updateFormData={updateFormData} />
      </div> */}
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

// Step 6: General Summary (Call EOI)
const GeneralSummaryStep: React.FC<{ formData: ARSelectionFormData; updateFormData: (data: Partial<ARSelectionFormData>) => void }> = ({ formData, updateFormData }) => {
  const systemARs = [
    { id: "1", name: "Rajesh Kumar", location: "Mumbai", ibbi: "IB123456" },
    { id: "2", name: "Priya Sharma", location: "Delhi", ibbi: "IB789012" },
    { id: "3", name: "Amit Patel", location: "Bangalore", ibbi: "IB345678" },
    { id: "4", name: "Sunita Verma", location: "Chennai", ibbi: "IB901234" },
    { id: "5", name: "Neha Gupta", location: "Pune", ibbi: "IB567890" }
  ];

  const selectedSystemARs = systemARs.filter(ar => formData.selectedSystemARs.includes(ar.id));
  // Local inputs for adding a new manual nomination
  const [newNomName, setNewNomName] = React.useState("");
  const [newNomEmail, setNewNomEmail] = React.useState("");

  const addManualNomination = () => {
    if (!newNomName.trim() || !newNomEmail.trim()) return;
    updateFormData({ manualNominations: [...formData.manualNominations, { name: newNomName.trim(), email: newNomEmail.trim() }] });
    setNewNomName("");
    setNewNomEmail("");
  };

  const removeManualNomination = (index: number) => {
    const updated = formData.manualNominations.filter((_, i) => i !== index);
    updateFormData({ manualNominations: updated });
  };

  const updateNomination = (index: number, key: 'name' | 'email', value: string) => {
    const updated = [...formData.manualNominations];
    updated[index] = { ...updated[index], [key]: value };
    updateFormData({ manualNominations: updated });
  };

  return (
    <div className="space-y-8  ">
      

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 ring-1 ring-blue-50">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Entity:</span>
              <span className="text-sm text-gray-900">{formData.entityName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Selected Law:</span>
              <span className="text-sm text-gray-900">{formData.applicableLaw}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 ring-1 ring-blue-50">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Class of Creditors:</span>
            </div>
            <Select value={formData.classOfCreditors} onValueChange={(v) => updateFormData({ classOfCreditors: v })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Financial Creditors-Secured">Financial creditors- secured</SelectItem>
                <SelectItem value="Financial Creditors-Unsecured">Financial Creditors-unsecured</SelectItem>
                <SelectItem value="Operational Creditors">Operational Creditors</SelectItem>
                <SelectItem value="Bondholders-Secured">Bondholders- secured</SelectItem>
                <SelectItem value="Debenture holders- secured">Debenture holders- secured</SelectItem>
                <SelectItem value="Deposit holders- secured">Deposit holders- secured</SelectItem>
                <SelectItem value="Bond holders- unsecured">Bond holders- unsecured</SelectItem>
                <SelectItem value="Debenture holders- unsecured">Debenture holders- unsecured</SelectItem>
                <SelectItem value="Deposit holders- unsecured">Deposit holders- unsecured</SelectItem>
                <SelectItem value="Homebuyers">Homebuyers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 ring-1 ring-blue-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Invitation Parameters</h3>
          <span className="text-xs text-slate-500">Auto-calculated fields are read-only</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Req. No. of Invitations for EOIs (A):</Label>
              <Input value={formData.requiredInvitations} readOnly className="mt-2 bg-gray-50" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">No. of ARs to be selected:</Label>
              <Input value={formData.arsToSelect} readOnly className="mt-2 bg-gray-50" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Req. No. of Nominations:</Label>
              <Input value={formData.requiredNominations} readOnly className="mt-2 bg-gray-50" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">No. of ARs proposed by User (D):</Label>
              <Input value={formData.userProposed} readOnly className="mt-2 bg-gray-50" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Label className="text-sm font-medium text-gray-700">No. of ARs proposed by System:</Label>
          <div className="flex items-center gap-3 mt-2">
            <Input value={formData.systemProposed} readOnly className="max-w-32 bg-gray-50" />
            <span className="text-sm text-gray-500">(Auto)</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 ring-1 ring-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Manual AR Nominations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-transparent">
              <tr className="border-b border-slate-200">
                <th className="text-left font-medium p-3 text-slate-500">Name</th>
                <th className="text-left font-medium p-3 text-slate-500">Email</th>
                <th className="text-right font-medium p-3 text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.manualNominations.map((nomination, idx) => (
                <tr key={idx} className="border-b hover:bg-blue-50/40">
                  <td className="p-3">
                    <Input
                      placeholder="Enter AR name"
                      value={nomination.name}
                      onChange={(e) => updateNomination(idx, 'name', e.target.value)}
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="email"
                      placeholder="Enter AR email"
                      value={nomination.email}
                      onChange={(e) => updateNomination(idx, 'email', e.target.value)}
                    />
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => removeManualNomination(idx)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => updateFormData({ manualNominations: [...formData.manualNominations, { name: '', email: '' }] })}>
            + Add Another AR Nomination
          </Button>
        </div>
        {formData.manualNominations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No manual nominations added
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 ring-1 ring-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Selected System ARs</h3>
        <div className="space-y-3">
          {selectedSystemARs.map((ar) => (
            <div key={ar.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/70 border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
                <span className="font-medium text-gray-900">{ar.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                Location: {ar.location} | IBBI: {ar.ibbi}
              </div>
            </div>
          ))}
        </div>
        {selectedSystemARs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No system ARs selected
          </div>
        )}
      </div>

      {formData.notes && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 ring-1 ring-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{formData.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 7: Initiate Consent Request (within wizard)
const ConsentRequestStep: React.FC<{ formData: ARSelectionFormData; updateFormData: (data: Partial<ARSelectionFormData>) => void }> = ({ formData, updateFormData }) => {
  const [location, setLocation] = React.useState("Mumbai");
  const [notes, setNotes] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [showPreview, setShowPreview] = React.useState(true);
  const [isEditingTemplate, setIsEditingTemplate] = React.useState(false);
  const [letterText, setLetterText] = React.useState(
    `Subject: Request for Consent to Act as Authorized Representative - ${formData.classOfCreditors}\n\n` +
    `Dear [AR Name],\n\n` +
    `I hope this email finds you well.\n\n` +
    `You are invited to serve as an Authorized Representative for the ${formData.classOfCreditors} in the matter of [${formData.entityName}] under the provisions of the Insolvency and Bankruptcy Code, 2016.\n\n` +
    `Please provide the following documents:\n` +
    `1. Written consent to act as Authorized Representative\n` +
    `2. Letter of Disclosure of Relationship as required under the Code\n` +
    `3. Copy of valid IBBI Registration Certificate\n\n` +
    `Additional Information:\n` +
    `- Location: ${location}\n` +
    `- Class of Creditors: ${formData.classOfCreditors}\n\n` +
    `Kindly respond by [Response Date] to ensure timely processing of your appointment.\n\n` +
    `Regards,\nJohn Doe\nResolution Professional`
  );

  const candidates = [
    { id: "c1", name: "Rajesh Kumar", location: "Mumbai", profession: "CA, LLB", exp: "15 years", reg: "IB123456" },
    { id: "c2", name: "Priya Sharma", location: "Delhi", profession: "Advocate", exp: "12 years", reg: "IB789012" },
    { id: "c3", name: "Amit Patel", location: "Bangalore", profession: "CA", exp: "18 years", reg: "IB345678" },
    { id: "c4", name: "Sunita Verma", location: "Hyderabad", profession: "CMA, CS", exp: "10 years", reg: "IB901234" },
  ];

  const toggle = (id: string, all = false) => {
    if (all) {
      setSelected(selected.length === candidates.length ? [] : candidates.map(c => c.id));
      return;
    }
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Keep selected candidates in the main form data for submission
  React.useEffect(() => {
    updateFormData({ selectedConsentARs: selected });
  }, [selected, updateFormData]);

  return (
    <div className="space-y-8 bg-slate-50/60 p-6 rounded-xl border border-slate-200">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 ring-1 ring-blue-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Request for Consent from AR</h2>
        <div className="h-1 w-24 bg-blue-600/80 rounded-full mb-4"></div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700">Class of Creditors</Label>
            <Select value={formData.classOfCreditors} onValueChange={(v) => updateFormData({ classOfCreditors: v })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Financial Creditors-Secured">Financial creditors- secured</SelectItem>
                <SelectItem value="Financial Creditors-Unsecured">Financial Creditors-unsecured</SelectItem>
                <SelectItem value="Operational Creditors">Operational Creditors</SelectItem>
                <SelectItem value="Bondholders-Secured">Bondholders- secured</SelectItem>
                <SelectItem value="Debenture holders- secured">Debenture holders- secured</SelectItem>
                <SelectItem value="Deposit holders- secured">Deposit holders- secured</SelectItem>
                <SelectItem value="Bond holders- unsecured">Bond holders- unsecured</SelectItem>
                <SelectItem value="Debenture holders- unsecured">Debenture holders- unsecured</SelectItem>
                <SelectItem value="Deposit holders- unsecured">Deposit holders- unsecured</SelectItem>
                <SelectItem value="Homebuyers">Homebuyers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Location can be specified manually or use creditor's location if suggested by system.</p>
          </div>
        </div>
        
        <div className="mt-6">
          <Label className="text-sm font-medium text-gray-700">Additional Notes (Optional)</Label>
          <Textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            placeholder="Add any specific requirements or notes for the AR candidates..." 
            className="mt-2" 
            rows={3} 
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 ring-1 ring-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select candidates to send invitation for consent</h3>
        
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Checkbox 
              checked={selected.length === candidates.length} 
              onCheckedChange={() => toggle('', true)} 
            />
            <span className="text-sm font-medium text-gray-700">Select All</span>
          </div>
          <span className="text-sm text-gray-600">Selected candidates: {selected.length} of {candidates.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm ">
            <thead className="bg-transparent">
              <tr className="border-b border-slate-200">
                <th className="text-left font-medium p-4 text-slate-500"></th>
                <th className="text-left font-medium p-4 text-slate-500">AR Name</th>
                <th className="text-left font-medium p-4 text-slate-500">Location</th>
                <th className="text-left font-medium p-4 text-slate-500">Profession</th>
                <th className="text-left font-medium p-4 text-slate-500">Experience</th>
                <th className="text-left font-medium p-4 text-slate-500">IBBI Reg</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id} className="border-b hover:bg-blue-50/40">
                  <td className="p-4">
                    <Checkbox 
                      checked={selected.includes(c.id)} 
                      onCheckedChange={() => toggle(c.id)} 
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">{c.name}</td>
                  <td className="p-4 text-gray-700">{c.location}</td>
                  <td className="p-4 text-gray-700">{c.profession}</td>
                  <td className="p-4 text-gray-700">{c.exp}</td>
                  <td className="p-4 text-gray-700">{c.reg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {selected.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Please select at least one candidate to proceed
          </div>
        )}
      </div>

      {/* Consent Letter Preview (inline editable) */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 ring-1 ring-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <Mail />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Consent Letter Preview</h3>
          </div>
          <div className="flex gap-2">
            {isEditingTemplate ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingTemplate(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsEditingTemplate(false)}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600"
                  onClick={() => setIsEditingTemplate(true)}
                >
                  Edit Template
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Inline single-editor or preview */}
        {isEditingTemplate ? (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Letter Content</Label>
            <Textarea
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              className="mt-1"
              rows={16}
              placeholder={"Type the entire email content here including Subject, Greeting and Body..."}
            />
            <p className="text-xs text-gray-500">Hint: You can use placeholders like [AR Name] and [Response Date].</p>
          </div>
        ) : (
          showPreview && (
            <div className="bg-gray-50 p-6 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{letterText}</pre>
            </div>
          )
        )}
      </div>

      
    </div>
  );
};

export default ARSelectionProcess;

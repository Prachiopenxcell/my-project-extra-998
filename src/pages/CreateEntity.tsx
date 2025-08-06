import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  BasicDetailsStep, 
  AddressContactStep, 
  KeyPersonnelStep, 
  IndustryDetailsStep, 
  RecordsFinancialStep,
  CreditorsClassStep,
  BankDocumentsStep,
  ReviewSubmitStep, 
  EntityFormData 
} from "@/components/entity";
import { Progress } from "@/components/ui/progress";
import { entityService } from "@/services/entityServiceFactory";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Define the steps in the entity creation process
const STEPS = [
  { id: 1, name: "Basic Details" },
  { id: 2, name: "Address & Contact Information" },
  { id: 3, name: "Key Personnel Details" },
  { id: 4, name: "Industry & Operational Details" },
  { id: 5, name: "Records & Financial Details" },
  { id: 6, name: "Creditors in Class" },
  { id: 7, name: "Bank & Investment Documents" },
  { id: 8, name: "Review & Submit" }
];

const CreateEntity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<EntityFormData>({
    // Basic Details
    entityType: "Company",
    cinNumber: "",
    entityName: "",
    registrationNo: "",
    rocName: "",
    category: "",
    subcategory: "",
    lastAgmDate: "",
    balanceSheetDate: "",
    companyStatus: "Active",
    indexOfCharges: "No",
    directors: [],
    pan: "",
    gstn: { available: false, number: "" },
    msme: { available: false, number: "" },
    shopEstablishment: { available: false, number: "" },
    bankAccounts: [],
    
    // Address & Contact
    registeredOffice: {
      address: "",
      city: "",
      state: "",
      pincode: ""
    },
    corporateOffice: {
      address: "",
      city: "",
      state: "",
      pincode: ""
    },
    factoryOffice: "",
    correspondenceAddress: "",
    sameAddress: true,
    businessLocations: [],
    email: "",
    phone: "",
    registeredEmail: "",
    alternateEmail: "",
    correspondenceEmail: "",
    phoneNumber: "",
    
    // Key Personnel
    keyPersonnel: [],
    
    // Industry & Operational Details
    industries: [],
    industryDetails: [],
    businessActivity: "",
    turnover: "",
    employeeCount: 0,
    maleEmployeeCount: 0,
    femaleEmployeeCount: 0,
    operationalStatus: "Active",
    complianceRating: "High",
    riskCategory: "Low"
  });

  // Calculate progress percentage based on current step
  const progressPercentage = (currentStep / STEPS.length) * 100;

  // Handle form data changes
  const updateFormData = (data: Partial<EntityFormData>) => {
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
      // Add draft status to the form data
      const draftData = { ...formData, status: "Draft" };
      
      // Use entity service to save the draft
      const savedEntity = await entityService.createEntity(draftData);
      
      // Show success message
      toast({
        title: "Draft Saved",
        description: "Entity saved as draft successfully!",
        variant: "default"
      });
      
      console.log("Saved draft:", savedEntity);
      return savedEntity;
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Add submitted status to the form data
      const submissionData = { ...formData, status: "Submitted" };
      
      // Use entity service to create the entity
      const createdEntity = await entityService.createEntity(submissionData);
      
      // Show success message
      toast({
        title: "Success",
        description: "Entity created successfully!",
        variant: "default"
      });
      
      console.log("Created entity:", createdEntity);
      
      // Navigate back to entity list after short delay
      setTimeout(() => {
        navigate("/entity-management");
      }, 1500);
    } catch (error) {
      console.error("Error creating entity:", error);
      toast({
        title: "Error",
        description: "Failed to create entity. Please try again.",
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
        return <BasicDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <AddressContactStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <KeyPersonnelStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <IndustryDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <RecordsFinancialStep formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <CreditorsClassStep formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <BankDocumentsStep formData={formData} updateFormData={updateFormData} />;
      case 8:
        return <ReviewSubmitStep formData={formData} updateFormData={updateFormData} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Create Entity</h1>
            <p className="text-muted-foreground">
              Dashboard &gt; My Entities &gt; Create Entity
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
                <>💾 Save as Draft</>
              )}
            </Button>
            {currentStep === STEPS.length ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>💾 Save & Submit</>
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
            onClick={() => currentStep > 1 ? prevStep() : navigate("/entity-management")}
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
                    Submitting...
                  </>
                ) : (
                  <>Submit</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateEntity;

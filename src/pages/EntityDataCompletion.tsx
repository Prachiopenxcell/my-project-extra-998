import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  RecordsFinancialStep,
  CreditorsClassStep,
  BankDocumentsStep,
  ReviewSubmitStep, 
  EntityFormData 
} from "@/components/entity";
import { Progress } from "@/components/ui/progress";
import { entityService } from "@/services/entityServiceFactory";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, FileBarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define the VDR entity data completion steps
const VDR_STEPS = [
  { id: 1, name: "Records & Financial Details" },
  { id: 2, name: "Creditors in Class" },
  { id: 3, name: "Bank & Investment Documents" },
  { id: 4, name: "Review & Submit" }
];

const EntityDataCompletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<EntityFormData>({
    // Basic entity info (would be populated from selected entity)
    id: "abc-corp-001",
    entityType: "Private Limited Company",
    cinNumber: "U72200MH2018PTC123456",
    entityName: "ABC Corporation Ltd",
    registrationNo: "123456",
    rocName: "Mumbai",
    category: "Company Limited by Shares",
    subcategory: "Indian Non-Government Company",
    lastAgmDate: "2023-09-15",
    balanceSheetDate: "2023-03-31",
    companyStatus: "Active",
    entityStatus: "active",
    indexOfCharges: "No",
    directors: [],
    pan: "ABCDE1234F",
    gstn: { available: true, number: "GST123456789" },
    msme: { available: false, number: "" },
    shopEstablishment: { available: false, number: "" },
    bankAccounts: [],
    
    // Address & Contact (pre-filled)
    registeredOffice: {
      address: "123 Business Park, Tower A, 5th Floor",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    corporateOffice: {
      address: "123 Business Park, Tower A, 5th Floor",
      city: "Mumbai", 
      state: "Maharashtra",
      pincode: "400001"
    },
    sameAddress: true,
    businessLocations: [],
    registeredEmail: "info@abccorp.com",
    alternateEmail: "admin@abccorp.com",
    correspondenceEmail: "correspondence@abccorp.com",
    phoneNumber: "9876543210",
    
    // Key Personnel (pre-filled)
    keyPersonnel: [
      {
        id: 1,
        name: "John Smith",
        designation: "Managing Director",
        identityNo: "ABCPN1234E",
        din: "12345678",
        email: "j.smith@abccorp.com",
        contact: "9876543210"
      }
    ],
    
    // Industry & Operational (pre-filled)
    industries: ["Technology"],
    businessActivity: "Software Development",
    turnover: "50000000",
    employeeCount: 50,
    maleEmployeeCount: 30,
    femaleEmployeeCount: 20,
    operationalStatus: "Active",
    
    // VDR-specific fields (to be filled in these steps)
    financialRecords: [],
    creditors: [],
    bankDocuments: []
  });

  // Calculate progress percentage based on current step
  const progressPercentage = (currentStep / VDR_STEPS.length) * 100;

  // Update form data
  const updateFormData = (data: Partial<EntityFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < VDR_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save as draft
  const saveAsDraft = async () => {
    setIsSaving(true);
    try {
      // Save draft logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      toast({
        title: "Draft Saved",
        description: "Your progress has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle final submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit the VDR entity data
      const result = await entityService.updateEntityVDRData(formData);
      
      toast({
        title: "Entity Data Completed",
        description: "Your entity's VDR data has been successfully updated.",
      });
      
      // Navigate back to VDR dashboard
      navigate('/data-room');
    } catch (error) {
      console.error("Error submitting VDR data:", error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while updating entity data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RecordsFinancialStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <CreditorsClassStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <BankDocumentsStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ReviewSubmitStep formData={formData} updateFormData={updateFormData} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/data-room')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to VDR
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileBarChart className="h-6 w-6 text-primary" />
                Entity Data Completion
              </h1>
              <p className="text-muted-foreground">
                Complete financial and legal documentation for VDR readiness
              </p>
            </div>
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
            {currentStep === VDR_STEPS.length ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>✅ Complete & Submit</>
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

        {/* Progress Header */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">
                  Step {currentStep}: {VDR_STEPS[currentStep - 1].name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Entity: {formData.entityName} • CIN: {formData.cinNumber}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <div className="w-32">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  <Badge variant="outline">{Math.round(progressPercentage)}%</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep < VDR_STEPS.length ? (
              <Button onClick={handleNext}>
                Next
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    ✅ Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EntityDataCompletion;

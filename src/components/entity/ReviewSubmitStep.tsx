import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";
import { StepComponentProps } from "./types";
import { useToast } from "@/components/ui/use-toast";

export const ReviewSubmitStep = ({ formData, updateFormData }: StepComponentProps): JSX.Element => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Import the entityService
      const { entityService } = await import("@/services/entityService");
      
      // Submit the entity data
      const result = await entityService.createEntity(formData);
      
      setSubmitted(true);
      toast({
        title: "Entity Created Successfully",
        description: `Entity ${result.entityName} has been created with ID: ${result.id}`,
      });
    } catch (error) {
      console.error("Error submitting entity:", error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while creating the entity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to check if a section is complete
  const isSectionComplete = (section: string): boolean => {
    switch (section) {
      case "basic":
        return !!(formData.entityName && formData.entityType && formData.cinNumber);
      case "address":
        return !!(formData.registeredOffice?.address && formData.registeredOffice?.city);
      case "personnel":
        return !!(formData.keyPersonnel && formData.keyPersonnel.length > 0);
      case "industry":
        return !!(formData.industry && formData.operationalStatus);
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Review & Submit</h2>
        {submitted ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" /> Submitted
          </Badge>
        ) : null}
      </div>
      
      <p className="text-muted-foreground">
        Please review all the information before final submission. You can go back to any step to make changes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Details Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Basic Details</h3>
              {isSectionComplete("basic") ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Complete
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Incomplete
                </Badge>
              )}
            </div>
            <Separator className="mb-4" />
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Entity Name:</dt>
                <dd className="text-sm col-span-2">{formData.entityName || "Not provided"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Entity Type:</dt>
                <dd className="text-sm col-span-2">{formData.entityType || "Not provided"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">CIN/LLPIN:</dt>
                <dd className="text-sm col-span-2">{formData.cinNumber || "Not provided"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Registration No:</dt>
                <dd className="text-sm col-span-2">{formData.registrationNo || "Not provided"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">ROC Name:</dt>
                <dd className="text-sm col-span-2">{formData.rocName || "Not provided"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Category:</dt>
                <dd className="text-sm col-span-2">{formData.category || "Not provided"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Address & Contact Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Address & Contact</h3>
              {isSectionComplete("address") ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Complete
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Incomplete
                </Badge>
              )}
            </div>
            <Separator className="mb-4" />
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Registered Office:</dt>
                <dd className="text-sm col-span-2">
                  {formData.registeredOffice?.address ? (
                    <div>
                      {formData.registeredOffice.address}, {formData.registeredOffice.city}, {formData.registeredOffice.state} - {formData.registeredOffice.pincode}
                    </div>
                  ) : (
                    "Not provided"
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Corporate Office:</dt>
                <dd className="text-sm col-span-2">
                  {formData.corporateOffice?.address ? (
                    <div>
                      {formData.corporateOffice.address}, {formData.corporateOffice.city}, {formData.corporateOffice.state} - {formData.corporateOffice.pincode}
                    </div>
                  ) : (
                    "Not provided"
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Email:</dt>
                <dd className="text-sm col-span-2">{formData.email || "Not provided"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Phone:</dt>
                <dd className="text-sm col-span-2">{formData.phone || "Not provided"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Key Personnel Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Key Personnel</h3>
              {isSectionComplete("personnel") ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Complete
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Incomplete
                </Badge>
              )}
            </div>
            <Separator className="mb-4" />
            {formData.keyPersonnel && formData.keyPersonnel.length > 0 ? (
              <div className="space-y-4">
                {formData.keyPersonnel.map((person, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="font-medium">{person.name} - {person.designation}</div>
                    <div className="text-sm text-muted-foreground">
                      DIN: {person.din || "N/A"} | Email: {person.email || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No key personnel added</p>
            )}
          </CardContent>
        </Card>

        {/* Industry & Operations Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Industry & Operations</h3>
              {isSectionComplete("industry") ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Complete
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Incomplete
                </Badge>
              )}
            </div>
            <Separator className="mb-4" />
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Industry:</dt>
                <dd className="text-sm col-span-2">{formData.industry || "Not provided"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Sector:</dt>
                <dd className="text-sm col-span-2">{formData.sector || "Not provided"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Operational Status:</dt>
                <dd className="text-sm col-span-2">{formData.operationalStatus || "Not provided"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Annual Turnover:</dt>
                <dd className="text-sm col-span-2">
                  {formData.turnover ? `₹${formData.turnover}` : "Not provided"}
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-sm font-medium text-muted-foreground">Employee Count:</dt>
                <dd className="text-sm col-span-2">{formData.employeeCount || "Not provided"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSubmit} 
          disabled={submitting || submitted}
          className="w-full md:w-auto"
        >
          {submitting ? "Submitting..." : submitted ? "Submitted" : "Submit Entity"}
        </Button>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  Upload, 
  X, 
  Plus, 
  Save, 
  Send,
  ArrowLeft,
  ArrowRight,
  FileText,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  HelpCircle
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { serviceRequestService } from "@/services/serviceRequestService";
import { ProfessionalType, ServiceType, ServiceRequest } from "@/types/serviceRequest";

const CreateServiceRequest = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceCategory: [] as ProfessionalType[],
    serviceTypes: [] as ServiceType[],
    scopeOfWork: "",
    budgetRange: { min: 0, max: 0 },
    budgetNotClear: false,
    documents: [] as any[],
    questionnaire: [] as any[],
    workRequiredBy: "",
    preferredLocations: [] as string[],
    invitedProfessionals: [] as string[],
    repeatPastProfessionals: [] as string[],
    isAIAssisted: false
  });
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [aiGeneratedScope, setAiGeneratedScope] = useState("");
  const [isGeneratingScope, setIsGeneratingScope] = useState(false);
  const [scopeSaved, setScopeSaved] = useState(false);

  const steps = [
    { id: 1, title: "Service Category", description: "Select professional type and services" },
    { id: 2, title: "Scope of Work", description: "Define project requirements" },
    { id: 3, title: "Supporting Documents", description: "Upload relevant files" },
    { id: 4, title: "Service Questionnaire", description: "Additional requirements" },
    { id: 5, title: "Timeline & Location", description: "Deadline and preferences" },
    { id: 6, title: "Review & Submit", description: "Final review" }
  ];

  const professionalTypes = [
    { value: ProfessionalType.LAWYER, label: "Lawyer" },
    { value: ProfessionalType.CHARTERED_ACCOUNTANT, label: "Chartered Accountant" },
    { value: ProfessionalType.COMPANY_SECRETARY, label: "Company Secretary" },
    { value: ProfessionalType.COST_MANAGEMENT_ACCOUNTANT, label: "Cost and Management Accountant" },
    { value: ProfessionalType.VALUER, label: "Valuer" },
    { value: ProfessionalType.INSOLVENCY_PROFESSIONAL, label: "Insolvency Professional" }
  ];

  const serviceTypes = [
    { value: ServiceType.VALUATION_COMPANIES_ACT, label: "Valuation under Companies Act" },
    { value: ServiceType.VALUATION_INCOME_TAX_ACT, label: "Valuation under Income Tax Act" },
    { value: ServiceType.VALUATION_LB_IBC, label: "Valuation of L & B under IBC" },
    { value: ServiceType.VALUATION_PM_IBC, label: "Valuation of P&M under IBC" },
    { value: ServiceType.VALUATION_SFA_IBC, label: "Valuation of S & FA under IBC" },
    { value: ServiceType.PUBLICATION_COMPANIES_ACT, label: "Publication under Companies Act" },
    { value: ServiceType.PUBLICATION_IBC, label: "Publication under IBC" },
    { value: ServiceType.PUBLICATION_SEBI, label: "Publication under SEBI" },
    { value: ServiceType.PUBLICATION_OTHER_LAWS, label: "Publication under other laws" },
    { value: ServiceType.OTHERS, label: "Others" }
  ];

  // Generate AI scope of work based on selected services
  const generateAIScope = async () => {
    if (formData.serviceCategory.length === 0 || formData.serviceTypes.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select professional type and service types to generate AI scope of work.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingScope(true);
    try {
      // Mock AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedServices = formData.serviceTypes.map(type => 
        serviceTypes.find(s => s.value === type)?.label
      ).join(", ");
      
      const selectedProfessionals = formData.serviceCategory.map(cat => 
        professionalTypes.find(p => p.value === cat)?.label
      ).join(", ");

      const aiScope = `Based on your selection of ${selectedProfessionals} services for ${selectedServices}, here is the recommended scope of work:

1. Initial Consultation and Requirement Analysis
   - Review client requirements and objectives
   - Analyze applicable regulations and compliance requirements
   - Identify key deliverables and timelines

2. Documentation and Preparation
   - Gather necessary documents and information
   - Prepare preliminary assessments and reports
   - Coordinate with relevant stakeholders

3. Core Service Delivery
   - Execute ${selectedServices.toLowerCase()} as per regulatory requirements
   - Ensure compliance with applicable laws and standards
   - Provide detailed analysis and recommendations

4. Review and Finalization
   - Quality review of all deliverables
   - Client presentation and discussion
   - Final report submission with recommendations

5. Post-Delivery Support
   - Address any queries or clarifications
   - Provide implementation guidance if required
   - Follow-up support as needed

This scope can be customized based on your specific requirements and project complexity.`;

      setAiGeneratedScope(aiScope);
      setFormData(prev => ({ ...prev, scopeOfWork: aiScope }));
      setScopeSaved(false);
      
      toast({
        title: "AI Scope Generated",
        description: "AI has generated a comprehensive scope of work. You can edit it as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI scope of work. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingScope(false);
    }
  };

  // Save the scope description
  const saveDescription = () => {
    if (!formData.scopeOfWork.trim()) {
      toast({
        title: "No Content",
        description: "Please enter scope of work content before saving.",
        variant: "destructive"
      });
      return;
    }

    setScopeSaved(true);
    toast({
      title: "Description Saved",
      description: "Scope of work description has been saved successfully.",
    });
  };

  const handleAIAssistance = async () => {
    if (!formData.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please enter a description to get AI suggestions.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const suggestions = await serviceRequestService.getAISuggestions(formData.description);
      setAiSuggestions(suggestions);
      setFormData(prev => ({
        ...prev,
        serviceCategory: suggestions.professionals,
        serviceTypes: suggestions.services,
        scopeOfWork: suggestions.scopeOfWork,
        isAIAssisted: true
      }));
      toast({
        title: "AI Suggestions Applied",
        description: "AI has suggested relevant professionals and services based on your description."
      });
    } catch (error) {
      toast({
        title: "AI Assistance Failed",
        description: "Unable to get AI suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      await serviceRequestService.createServiceRequest({
        ...formData,
        status: 'draft' as any
      });
      toast({
        title: "Draft Saved",
        description: "Your service request has been saved as draft."
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await serviceRequestService.createServiceRequest({
        ...formData,
        status: 'open' as any
      });
      toast({
        title: "Service Request Submitted",
        description: "Your service request has been published successfully."
      });
      // Reset form or redirect
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit service request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Service Description</Label>
              <p className="text-sm text-gray-600 mb-3">
                Describe your service requirement or use AI assistance
              </p>
              <Textarea
                placeholder="Describe your service requirement in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-32"
              />
              <Button 
                variant="outline" 
                className="mt-3"
                onClick={handleAIAssistance}
                disabled={loading}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Get AI Suggestions
              </Button>
            </div>

            <div>
              <Label className="text-base font-semibold">Professional Type</Label>
              <p className="text-sm text-gray-600 mb-3">
                Select one or more professional types
              </p>
              <div className="grid grid-cols-2 gap-3">
                {professionalTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={formData.serviceCategory.includes(type.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            serviceCategory: [...prev.serviceCategory, type.value]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            serviceCategory: prev.serviceCategory.filter(cat => cat !== type.value)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={type.value} className="text-sm">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Service Types</Label>
              <p className="text-sm text-gray-600 mb-3">
                Select specific services required
              </p>
              <div className="grid grid-cols-1 gap-2">
                {serviceTypes.map((service) => (
                  <div key={service.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.value}
                      checked={formData.serviceTypes.includes(service.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            serviceTypes: [...prev.serviceTypes, service.value]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            serviceTypes: prev.serviceTypes.filter(type => type !== service.value)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={service.value} className="text-sm">
                      {service.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-base font-semibold">Scope of Work</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Define the detailed scope of work for this project
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAIScope}
                  disabled={isGeneratingScope || formData.serviceCategory.length === 0 || formData.serviceTypes.length === 0}
                  className="flex items-center gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  {isGeneratingScope ? "Generating..." : "Generate AI Scope"}
                </Button>
              </div>
              
              <Textarea
                placeholder="Enter detailed scope of work or use AI to generate..."
                value={formData.scopeOfWork}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, scopeOfWork: e.target.value }));
                  setScopeSaved(false);
                }}
                className="min-h-40"
              />
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {scopeSaved && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Save className="h-4 w-4" />
                      <span>Description saved</span>
                    </div>
                  )}
                  {aiGeneratedScope && (
                    <div className="text-sm text-blue-600">
                      AI-generated content (editable)
                    </div>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={saveDescription}
                  disabled={!formData.scopeOfWork.trim()}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save the Description
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Budget Range (Optional)</Label>
              <p className="text-sm text-gray-600 mb-3">
                Specify your budget range if known
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label className="text-sm">Minimum Amount</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.budgetRange.min}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      budgetRange: { ...prev.budgetRange, min: Number(e.target.value) }
                    }))}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-sm">Maximum Amount</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.budgetRange.max}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      budgetRange: { ...prev.budgetRange, max: Number(e.target.value) }
                    }))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox
                  id="budget-not-clear"
                  checked={formData.budgetNotClear}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, budgetNotClear: !!checked }))}
                />
                <Label htmlFor="budget-not-clear" className="text-sm">
                  Budget not clear / Open for discussion
                </Label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Supporting Documents</Label>
              <p className="text-sm text-gray-600 mb-3">
                Upload any relevant documents that will help professionals understand your requirements
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-xs text-gray-500 mb-4">Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB each)</p>
                <Button variant="outline" className="mb-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
              
              {formData.documents.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Uploaded Documents:</Label>
                  <div className="space-y-2 mt-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              documents: prev.documents.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Service Questionnaire</Label>
              <p className="text-sm text-gray-600 mb-4">
                Please provide additional details to help professionals understand your specific requirements
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">What is the nature of your business/organization?</Label>
                  <Textarea
                    placeholder="Describe your business, industry, size, etc."
                    className="mt-2"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">What specific challenges are you facing?</Label>
                  <Textarea
                    placeholder="Describe the specific issues or challenges you need help with"
                    className="mt-2"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">What are your expected outcomes?</Label>
                  <Textarea
                    placeholder="What do you hope to achieve with this service?"
                    className="mt-2"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Do you have any specific preferences or requirements?</Label>
                  <Textarea
                    placeholder="Any specific methodologies, compliance requirements, or preferences"
                    className="mt-2"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Additional Information</Label>
                  <Textarea
                    placeholder="Any other relevant information that would help professionals provide better service"
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Timeline & Location Preferences</Label>
              <p className="text-sm text-gray-600 mb-4">
                Specify when you need the work completed and your location preferences
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Work Required By</Label>
                  <Input
                    type="date"
                    value={formData.workRequiredBy}
                    onChange={(e) => setFormData(prev => ({ ...prev, workRequiredBy: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Urgency Level</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Flexible timeline</SelectItem>
                      <SelectItem value="medium">Medium - Standard timeline</SelectItem>
                      <SelectItem value="high">High - Urgent requirement</SelectItem>
                      <SelectItem value="critical">Critical - Immediate attention needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Preferred Locations</Label>
                <p className="text-xs text-gray-500 mb-2">Select cities/regions where you prefer the professional to be located</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.preferredLocations.map((location, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {location}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            preferredLocations: prev.preferredLocations.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter city or region"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !formData.preferredLocations.includes(value)) {
                          setFormData(prev => ({
                            ...prev,
                            preferredLocations: [...prev.preferredLocations, value]
                          }));
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      const value = input.value.trim();
                      if (value && !formData.preferredLocations.includes(value)) {
                        setFormData(prev => ({
                          ...prev,
                          preferredLocations: [...prev.preferredLocations, value]
                        }));
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Work Location Preference</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select work location preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote work preferred</SelectItem>
                    <SelectItem value="onsite">On-site work required</SelectItem>
                    <SelectItem value="hybrid">Hybrid (combination of remote and on-site)</SelectItem>
                    <SelectItem value="flexible">Flexible - open to discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Additional Timeline Notes</Label>
                <Textarea
                  placeholder="Any specific timeline requirements, milestones, or constraints"
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Review Your Service Request</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Description:</Label>
                  <p className="text-sm text-gray-700 mt-1">{formData.description}</p>
                </div>

                <div>
                  <Label className="font-medium">Professional Types:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.serviceCategory.map((cat) => (
                      <Badge key={cat} variant="outline">
                        {professionalTypes.find(p => p.value === cat)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Service Types:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.serviceTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {serviceTypes.find(s => s.value === type)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Scope of Work:</Label>
                  <p className="text-sm text-gray-700 mt-1">{formData.scopeOfWork}</p>
                </div>

                {!formData.budgetNotClear && (formData.budgetRange.min > 0 || formData.budgetRange.max > 0) && (
                  <div>
                    <Label className="font-medium">Budget Range:</Label>
                    <p className="text-sm text-gray-700 mt-1">
                      ₹{formData.budgetRange.min.toLocaleString()} - ₹{formData.budgetRange.max.toLocaleString()}
                    </p>
                  </div>
                )}

                {formData.workRequiredBy && (
                  <div>
                    <Label className="font-medium">Required By:</Label>
                    <p className="text-sm text-gray-700 mt-1">{formData.workRequiredBy}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Step content under development</p>
            <Button onClick={handleNext} className="mt-4">
              Continue to Next Step
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Service Request</h2>
        <p className="text-gray-600">Follow the steps to create your service request</p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {steps[currentStep - 1]?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < steps.length && (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateServiceRequest;

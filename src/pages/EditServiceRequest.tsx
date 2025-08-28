import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";
import { serviceRequestService } from "@/services/serviceRequestService";
import { ServiceRequest, ProfessionalType, ServiceType, ServiceQuestionnaire, ServiceRequestDocument } from "@/types/serviceRequest";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const EditServiceRequest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    { id: 1, title: "Service Category", description: "Select professional type and services" },
    { id: 2, title: "Scope of Work", description: "Define project requirements" },
    { id: 3, title: "Invite Professionals", description: "Select and invite professionals to bid" },
    { id: 4, title: "Supporting Documents", description: "Upload relevant files" },
    { id: 5, title: "Service Questionnaire", description: "Additional requirements" },
    { id: 6, title: "Timeline & Location", description: "Deadline and preferences" },
    { id: 7, title: "Review & Save", description: "Final review" }
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scopeOfWork: "",
    serviceCategory: [] as ProfessionalType[],
    serviceTypes: [] as ServiceType[],
    budgetRange: {
      min: 0,
      max: 0
    },
    budgetNotClear: false,
    workRequiredBy: "",
    deadline: "",
    preferredLocations: [] as string[],
    questionnaire: [] as ServiceQuestionnaire[],
    documents: [] as ServiceRequestDocument[],
    invitedProfessionals: [] as string[],
    repeatPastProfessionals: [] as string[],
    isAIAssisted: false
  });

  const fetchServiceRequest = useCallback(async () => {
    try {
      const response = await serviceRequestService.getServiceRequestById(id!);
      setServiceRequest(response);
      
      // Populate form data
      setFormData({
        title: response.title,
        description: response.description,
        scopeOfWork: response.scopeOfWork,
        serviceCategory: response.serviceCategory,
        serviceTypes: response.serviceTypes,
        budgetRange: response.budgetRange || { min: 0, max: 0 },
        budgetNotClear: response.budgetNotClear,
        workRequiredBy: response.workRequiredBy ? format(response.workRequiredBy, 'yyyy-MM-dd') : "",
        deadline: format(response.deadline, 'yyyy-MM-dd'),
        preferredLocations: response.preferredLocations,
        questionnaire: response.questionnaire,
        documents: response.documents || [],
        invitedProfessionals: response.invitedProfessionals || [],
        repeatPastProfessionals: response.repeatPastProfessionals || [],
        isAIAssisted: response.isAIAssisted || false
      });
    } catch (error) {
      console.error('Error fetching service request:', error);
      toast({
        title: "Error",
        description: "Failed to load service request details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchServiceRequest();
    }
  }, [id, fetchServiceRequest]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = {
        ...serviceRequest!,
        title: formData.title,
        description: formData.description,
        scopeOfWork: formData.scopeOfWork,
        serviceCategory: formData.serviceCategory,
        serviceTypes: formData.serviceTypes,
        budgetRange: formData.budgetNotClear ? undefined : formData.budgetRange,
        budgetNotClear: formData.budgetNotClear,
        workRequiredBy: formData.workRequiredBy ? new Date(formData.workRequiredBy) : undefined,
        deadline: new Date(formData.deadline),
        preferredLocations: formData.preferredLocations,
        questionnaire: formData.questionnaire,
        documents: formData.documents,
        invitedProfessionals: formData.invitedProfessionals,
        repeatPastProfessionals: formData.repeatPastProfessionals,
        isAIAssisted: formData.isAIAssisted,
        updatedAt: new Date()
      };

      await serviceRequestService.updateServiceRequest(id!, updatedData);
      
      toast({
        title: "Success",
        description: "Service request updated successfully.",
      });
      
      navigate(`/service-requests/${id}`);
    } catch (error) {
      console.error('Error updating service request:', error);
      toast({
        title: "Error",
        description: "Failed to update service request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addLocation = () => {
    const newLocation = prompt("Enter location:");
    if (newLocation && !formData.preferredLocations.includes(newLocation)) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, newLocation]
      }));
    }
  };

  const removeLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(loc => loc !== location)
    }));
  };

  // Invite Professionals helpers (simple list of emails or IDs)
  const addInvitedProfessional = () => {
    const value = prompt("Enter professional email or ID to invite:");
    if (value && !formData.invitedProfessionals.includes(value)) {
      setFormData(prev => ({ ...prev, invitedProfessionals: [...prev.invitedProfessionals, value] }));
    }
  };

  const removeInvitedProfessional = (value: string) => {
    setFormData(prev => ({
      ...prev,
      invitedProfessionals: prev.invitedProfessionals.filter(v => v !== value)
    }));
  };

  // Documents helpers (mock upload using prompt)
  const addDocument = () => {
    const name = prompt("Enter document name:");
    if (!name) return;
    const label = prompt("Enter document label:") || name;
    const type = "application/pdf";
    const newDoc: ServiceRequestDocument = {
      id: `doc-${Date.now()}`,
      name,
      label,
      url: `https://example.com/${encodeURIComponent(name)}`,
      uploadedAt: new Date(),
      size: Math.floor(Math.random() * 500000) + 10000,
      type
    };
    setFormData(prev => ({ ...prev, documents: [...prev.documents, newDoc] }));
  };

  const removeDocument = (docId: string) => {
    setFormData(prev => ({ ...prev, documents: prev.documents.filter(d => d.id !== docId) }));
  };

  // Questionnaire helpers
  const updateQuestionAnswer = (qid: string, answer: string) => {
    setFormData(prev => ({
      ...prev,
      questionnaire: prev.questionnaire.map(q => q.id === qid ? { ...q, answer, isSkipped: false } : q)
    }));
  };

  const toggleQuestionSkip = (qid: string, isSkipped: boolean) => {
    setFormData(prev => ({
      ...prev,
      questionnaire: prev.questionnaire.map(q => q.id === qid ? { ...q, isSkipped, answer: isSkipped ? 'Skipped' : q.answer } : q)
    }));
  };

  // Step navigation
  const nextStep = () => setCurrentStep(s => Math.min(s + 1, steps.length));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!serviceRequest) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Request Not Found</h1>
            <Link to="/service-requests">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Service Requests
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to={`/service-requests/${id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Service Request</h1>
              <p className="text-gray-600">{serviceRequest.srnNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate(`/service-requests/${id}`)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {steps.map(step => (
              <div key={step.id} className={`p-3 border rounded-lg ${currentStep === step.id ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
                <div className="text-xs text-gray-500">Step {step.id}</div>
                <div className="font-medium">{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input id="title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter service request title" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe your service requirements" rows={4} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Professional Types</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.values(ProfessionalType).map((pt) => (
                            <Button key={pt} type="button" variant={formData.serviceCategory.includes(pt) ? 'default' : 'outline'} size="sm" onClick={() => setFormData(prev => ({
                              ...prev,
                              serviceCategory: prev.serviceCategory.includes(pt) ? prev.serviceCategory.filter(p => p !== pt) : [...prev.serviceCategory, pt]
                            }))}>
                              {pt.replace('_', ' ')}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Service Types</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.values(ServiceType).map((st) => (
                            <Button key={st} type="button" variant={formData.serviceTypes.includes(st) ? 'default' : 'outline'} size="sm" onClick={() => setFormData(prev => ({
                              ...prev,
                              serviceTypes: prev.serviceTypes.includes(st) ? prev.serviceTypes.filter(s => s !== st) : [...prev.serviceTypes, st]
                            }))}>
                              {String(st).replace(/_/g, ' ')}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Scope of Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea id="scopeOfWork" value={formData.scopeOfWork} onChange={(e) => setFormData(prev => ({ ...prev, scopeOfWork: e.target.value }))} placeholder="Detailed scope of work" rows={10} />
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Invite Professionals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Invited Professionals</Label>
                    <Button variant="outline" size="sm" onClick={addInvitedProfessional}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2">
                    {formData.invitedProfessionals.map((p, i) => (
                      <div key={i} className="flex items-center justify-between border rounded p-2">
                        <span className="text-sm">{p}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeInvitedProfessional(p)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    {formData.invitedProfessionals.length === 0 && <p className="text-sm text-gray-500">No invitations added</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Documents</Label>
                    <Button variant="outline" size="sm" onClick={addDocument}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between border rounded p-2">
                        <div>
                          <div className="font-medium text-sm">{doc.label || doc.name}</div>
                          <div className="text-xs text-gray-500">{doc.type} • {(doc.size/1024).toFixed(1)} KB</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeDocument(doc.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    {formData.documents.length === 0 && <p className="text-sm text-gray-500">No documents uploaded</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Service Questionnaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.questionnaire.length === 0 && (
                    <p className="text-sm text-gray-500">No questionnaire available for selected services.</p>
                  )}
                  {formData.questionnaire.map((q) => (
                    <div key={q.id} className="space-y-2 border rounded p-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">{q.question}</Label>
                        <div className="flex items-center gap-2">
                          <Checkbox checked={q.isSkipped} onCheckedChange={(c) => toggleQuestionSkip(q.id, Boolean(c))} />
                          <span className="text-xs text-gray-600">Skip</span>
                        </div>
                      </div>
                      {!q.isSkipped && (
                        <Input value={q.answer || ''} onChange={(e) => updateQuestionAnswer(q.id, e.target.value)} placeholder="Your answer" />
                      )}
                      {q.isRequired && <div className="text-xs text-red-500">Required</div>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {currentStep === 6 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="workRequiredBy">Work Required By</Label>
                        <Input id="workRequiredBy" type="date" value={formData.workRequiredBy} onChange={(e) => setFormData(prev => ({ ...prev, workRequiredBy: e.target.value }))} />
                      </div>
                      <div>
                        <Label htmlFor="deadline">Deadline *</Label>
                        <Input id="deadline" type="date" value={formData.deadline} onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="budgetNotClear" checked={formData.budgetNotClear} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, budgetNotClear: checked as boolean }))} />
                      <Label htmlFor="budgetNotClear">Budget not clear</Label>
                    </div>
                    {!formData.budgetNotClear && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minBudget">Minimum Budget (₹)</Label>
                          <Input id="minBudget" type="number" value={formData.budgetRange.min} onChange={(e) => setFormData(prev => ({ ...prev, budgetRange: { ...prev.budgetRange, min: Number(e.target.value) } }))} />
                        </div>
                        <div>
                          <Label htmlFor="maxBudget">Maximum Budget (₹)</Label>
                          <Input id="maxBudget" type="number" value={formData.budgetRange.max} onChange={(e) => setFormData(prev => ({ ...prev, budgetRange: { ...prev.budgetRange, max: Number(e.target.value) } }))} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {currentStep === 7 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Title</div>
                      <div className="font-medium">{formData.title || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Deadline</div>
                      <div className="font-medium">{formData.deadline || '-'}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500">Description</div>
                      <div className="whitespace-pre-wrap">{formData.description || '-'}</div>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Invited Professionals</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.invitedProfessionals.map((p, i) => (<Badge key={i} variant="secondary">{p}</Badge>))}
                      {formData.invitedProfessionals.length === 0 && <span className="text-sm text-gray-500">None</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Documents</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.documents.map((d) => (<Badge key={d.id} variant="outline">{d.label || d.name}</Badge>))}
                      {formData.documents.length === 0 && <span className="text-sm text-gray-500">None</span>}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step controls */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>Back</Button>
              <div className="flex gap-2">
                {currentStep < steps.length && (
                  <Button onClick={nextStep}>Next</Button>
                )}
                {currentStep === steps.length && (
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-blue-100 text-blue-800">
                  {serviceRequest.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </CardContent>
            </Card>

            {/* Preferred Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Preferred Locations
                  <Button variant="outline" size="sm" onClick={addLocation}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formData.preferredLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{location}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeLocation(location)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.preferredLocations.length === 0 && (
                    <p className="text-sm text-gray-500">No locations specified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span>{format(serviceRequest.createdAt, 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span>{format(serviceRequest.updatedAt, 'dd/MM/yyyy')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditServiceRequest;

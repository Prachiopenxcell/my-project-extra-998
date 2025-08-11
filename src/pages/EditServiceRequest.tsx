import { useState, useEffect } from "react";
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
import { ServiceRequest, ProfessionalType, ServiceType } from "@/types/serviceRequest";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const EditServiceRequest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);

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
    questionnaire: [] as Array<{
      id: string;
      question: string;
      answer: string;
      isRequired: boolean;
      isSkipped: boolean;
    }>
  });

  useEffect(() => {
    if (id) {
      fetchServiceRequest();
    }
  }, [id]);

  const fetchServiceRequest = async () => {
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
        questionnaire: response.questionnaire
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
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter service request title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your service requirements"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="scopeOfWork">Scope of Work *</Label>
                  <Textarea
                    id="scopeOfWork"
                    value={formData.scopeOfWork}
                    onChange={(e) => setFormData(prev => ({ ...prev, scopeOfWork: e.target.value }))}
                    placeholder="Detailed scope of work"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Budget Information */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="budgetNotClear"
                    checked={formData.budgetNotClear}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, budgetNotClear: checked as boolean }))
                    }
                  />
                  <Label htmlFor="budgetNotClear">Budget not clear</Label>
                </div>

                {!formData.budgetNotClear && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minBudget">Minimum Budget (₹)</Label>
                      <Input
                        id="minBudget"
                        type="number"
                        value={formData.budgetRange.min}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          budgetRange: { ...prev.budgetRange, min: Number(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxBudget">Maximum Budget (₹)</Label>
                      <Input
                        id="maxBudget"
                        type="number"
                        value={formData.budgetRange.max}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          budgetRange: { ...prev.budgetRange, max: Number(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workRequiredBy">Work Required By</Label>
                    <Input
                      id="workRequiredBy"
                      type="date"
                      value={formData.workRequiredBy}
                      onChange={(e) => setFormData(prev => ({ ...prev, workRequiredBy: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLocation(location)}
                      >
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

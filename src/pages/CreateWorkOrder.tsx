import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Upload, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Send,
  Save,
  User,
  Building,
  Clock,
  Target,
  Paperclip
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { workOrderService } from "@/services/workOrderService";
import { CreateWorkOrderRequest } from "@/types/workOrder";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { getUserTypeFromRole } from "@/utils/userTypeUtils";

const CreateWorkOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const layoutUserType = getUserTypeFromRole(user?.role);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateWorkOrderRequest>({
    clientEmail: '',
    clientName: '',
    title: '',
    scopeOfWork: '',
    deliverables: [''],
    timeline: {
      startDate: new Date(),
      expectedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    milestones: [
      {
        title: '',
        description: '',
        deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      }
    ],
    financials: {
      professionalFee: 0,
      reimbursements: 0,
      regulatoryPayouts: 0,
      ope: 0
    },
    documents: [],
    referenceNumber: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof CreateWorkOrderRequest],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (field: string, index: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof CreateWorkOrderRequest].map((item: any, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
  };

  const removeDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, {
        title: '',
        description: '',
        deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }]
    }));
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...fileArray]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.clientEmail) {
      toast({
        title: "Validation Error",
        description: "Client email is required.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.title) {
      toast({
        title: "Validation Error",
        description: "Work order title is required.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.scopeOfWork) {
      toast({
        title: "Validation Error",
        description: "Scope of work is required.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.deliverables.filter(d => d.trim()).length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one deliverable is required.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.financials.professionalFee <= 0) {
      toast({
        title: "Validation Error",
        description: "Professional fee must be greater than 0.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (action: 'save' | 'send') => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Filter out empty deliverables
      const cleanedData = {
        ...formData,
        deliverables: formData.deliverables.filter(d => d.trim()),
        milestones: formData.milestones.filter(m => m.title.trim())
      };

      const response = await workOrderService.createWorkOrder(cleanedData);
      
      if (action === 'send') {
        toast({
          title: "Success",
          description: "Work order created and sent to client successfully.",
        });
      } else {
        toast({
          title: "Success",
          description: "Work order saved as draft successfully.",
        });
      }

      navigate(`/work-orders/${response.workOrder.id}`);
      
    } catch (error) {
      console.error('Error creating work order:', error);
      toast({
        title: "Error",
        description: "Failed to create work order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    const { professionalFee, reimbursements, regulatoryPayouts, ope } = formData.financials;
    const platformFee = professionalFee * 0.1; // 10% platform fee
    const subtotal = professionalFee + platformFee + (reimbursements || 0) + (regulatoryPayouts || 0) + (ope || 0);
    const gst = subtotal * 0.18; // 18% GST
    return subtotal + gst;
  };

  return (
    <DashboardLayout userType={layoutUserType}>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/work-orders')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Work Order</h1>
                <p className="text-gray-600">Create a new work order and send it to your client</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit('save')}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              <Button
                onClick={() => handleSubmit('send')}
                disabled={loading}
              >
                <Send className="h-4 w-4 mr-2" />
                Create & Send
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientEmail">Client Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        placeholder="client@example.com"
                        value={formData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        placeholder="Client Name (Optional)"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="referenceNumber">Reference Number</Label>
                    <Input
                      id="referenceNumber"
                      placeholder="Your reference number (Optional)"
                      value={formData.referenceNumber}
                      onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Work Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Work Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title of Work Order *</Label>
                    <Input
                      id="title"
                      placeholder="Enter work order title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="scopeOfWork">Detailed Scope of Work *</Label>
                    <Textarea
                      id="scopeOfWork"
                      placeholder="Describe the detailed scope of work..."
                      rows={5}
                      value={formData.scopeOfWork}
                      onChange={(e) => handleInputChange('scopeOfWork', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Deliverables *</Label>
                    <div className="space-y-2">
                      {formData.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder={`Deliverable ${index + 1}`}
                            value={deliverable}
                            onChange={(e) => handleArrayInputChange('deliverables', index, e.target.value)}
                          />
                          {formData.deliverables.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeDeliverable(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addDeliverable}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Deliverable
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline & Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Timeline & Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={format(formData.timeline.startDate, 'yyyy-MM-dd')}
                        onChange={(e) => handleNestedInputChange('timeline', 'startDate', new Date(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="completionDate">Expected Completion Date</Label>
                      <Input
                        id="completionDate"
                        type="date"
                        value={format(formData.timeline.expectedCompletionDate, 'yyyy-MM-dd')}
                        onChange={(e) => handleNestedInputChange('timeline', 'expectedCompletionDate', new Date(e.target.value))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Milestones</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMilestone}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Milestone
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.milestones.map((milestone, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Milestone {index + 1}</h4>
                            {formData.milestones.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeMilestone(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <Label>Title</Label>
                              <Input
                                placeholder="Milestone title"
                                value={milestone.title}
                                onChange={(e) => {
                                  const updatedMilestones = [...formData.milestones];
                                  updatedMilestones[index] = { ...milestone, title: e.target.value };
                                  handleInputChange('milestones', updatedMilestones);
                                }}
                              />
                            </div>
                            
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Milestone description"
                                rows={2}
                                value={milestone.description}
                                onChange={(e) => {
                                  const updatedMilestones = [...formData.milestones];
                                  updatedMilestones[index] = { ...milestone, description: e.target.value };
                                  handleInputChange('milestones', updatedMilestones);
                                }}
                              />
                            </div>
                            
                            <div>
                              <Label>Delivery Date</Label>
                              <Input
                                type="date"
                                value={format(milestone.deliveryDate, 'yyyy-MM-dd')}
                                onChange={(e) => {
                                  const updatedMilestones = [...formData.milestones];
                                  updatedMilestones[index] = { ...milestone, deliveryDate: new Date(e.target.value) };
                                  handleInputChange('milestones', updatedMilestones);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Paperclip className="h-5 w-5 mr-2" />
                    Supporting Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="documents">Upload Documents</Label>
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                    </p>
                  </div>

                  {formData.documents.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Documents</Label>
                      {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Financial Details Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="professionalFee">Professional Fee *</Label>
                    <Input
                      id="professionalFee"
                      type="number"
                      placeholder="0"
                      value={formData.financials.professionalFee || ''}
                      onChange={(e) => handleNestedInputChange('financials', 'professionalFee', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reimbursements">Reimbursements</Label>
                    <Input
                      id="reimbursements"
                      type="number"
                      placeholder="0"
                      value={formData.financials.reimbursements || ''}
                      onChange={(e) => handleNestedInputChange('financials', 'reimbursements', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="regulatoryPayouts">Regulatory Payouts</Label>
                    <Input
                      id="regulatoryPayouts"
                      type="number"
                      placeholder="0"
                      value={formData.financials.regulatoryPayouts || ''}
                      onChange={(e) => handleNestedInputChange('financials', 'regulatoryPayouts', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ope">Out-of-Pocket Expenses (OPE)</Label>
                    <Input
                      id="ope"
                      type="number"
                      placeholder="0"
                      value={formData.financials.ope || ''}
                      onChange={(e) => handleNestedInputChange('financials', 'ope', Number(e.target.value))}
                    />
                  </div>

                  <Separator />

                  {/* Cost Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Professional Fee:</span>
                      <span>₹{formData.financials.professionalFee.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Platform Fee (10%):</span>
                      <span>₹{(formData.financials.professionalFee * 0.1).toLocaleString()}</span>
                    </div>
                    
                    {formData.financials.reimbursements > 0 && (
                      <div className="flex justify-between">
                        <span>Reimbursements:</span>
                        <span>₹{formData.financials.reimbursements.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {formData.financials.regulatoryPayouts > 0 && (
                      <div className="flex justify-between">
                        <span>Regulatory Payouts:</span>
                        <span>₹{formData.financials.regulatoryPayouts.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {formData.financials.ope > 0 && (
                      <div className="flex justify-between">
                        <span>OPE:</span>
                        <span>₹{formData.financials.ope.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span>₹{(calculateTotalAmount() * 0.18 / 1.18).toLocaleString()}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">₹{calculateTotalAmount().toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleSubmit('save')}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  
                  <Button
                    className="w-full justify-start"
                    onClick={() => handleSubmit('send')}
                    disabled={loading}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Create & Send to Client
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateWorkOrder;

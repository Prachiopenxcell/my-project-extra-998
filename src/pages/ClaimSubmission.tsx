import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { 
  FileText, Upload, Download, Eye, Trash2, Plus, AlertTriangle, CheckCircle, 
  Clock, DollarSign, Calendar, User, Building, Phone, Mail, MapPin, FileCheck,
  Save, Send, ArrowLeft, Info, HelpCircle, Calculator, Paperclip, Shield, Lock, Users
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";

interface GroupClaimant {
  id: string;
  organizationName: string;
  contactPersonName: string;
  email: string;
  phone: string;
  claimAmount: number;
  panNumber: string;
  registrationNumber?: string;
}

interface ClaimFormData {
  claimantType: 'self' | 'representative' | 'group_representative';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    panNumber: string;
  };
  representativeInfo?: {
    fullName: string;
    email: string;
    phone: string;
    relationship: string;
    authorizationDocument?: File;
  };
  groupClaimants?: GroupClaimant[];
  claimDetails: {
    claimAmount: number;
    claimDescription: string;
    claimCategory: string;
    incidentDate: string;
    claimBasis: string;
    interestClaimed: boolean;
    interestFromDate?: string;
  };
  supportingDocuments: File[];
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
  };
  declarations: {
    accuracyDeclaration: boolean;
    legalConsequencesAcknowledgment: boolean;
    duplicateClaimDeclaration: boolean;
    communicationConsent: boolean;
  };
}

const ClaimSubmission = () => {
  const { invitationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("claimant-info");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ClaimFormData>({
    claimantType: 'self',
    personalInfo: {
      fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', panNumber: '',
    },
    representativeInfo: {
      fullName: '', email: '', phone: '', relationship: '',
    },
    groupClaimants: [],
    claimDetails: {
      claimAmount: 0, claimDescription: '', claimCategory: '', incidentDate: '', 
      claimBasis: '', interestClaimed: false,
    },
    supportingDocuments: [],
    bankDetails: {
      accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', branchName: '',
    },
    declarations: {
      accuracyDeclaration: false, legalConsequencesAcknowledgment: false,
      duplicateClaimDeclaration: false, communicationConsent: false,
    },
  });

  const handleInputChange = (section: keyof ClaimFormData, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [field]: value
      }
    }));
  };

  const addGroupClaimant = () => {
    const newClaimant: GroupClaimant = {
      id: `group-${Date.now()}`,
      organizationName: '',
      contactPersonName: '',
      email: '',
      phone: '',
      claimAmount: 0,
      panNumber: '',
      registrationNumber: ''
    };
    setFormData(prev => ({
      ...prev,
      groupClaimants: [...(prev.groupClaimants || []), newClaimant]
    }));
  };

  const removeGroupClaimant = (id: string) => {
    setFormData(prev => ({
      ...prev,
      groupClaimants: prev.groupClaimants?.filter(claimant => claimant.id !== id) || []
    }));
  };

  const updateGroupClaimant = (id: string, field: keyof GroupClaimant, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      groupClaimants: prev.groupClaimants?.map(claimant => 
        claimant.id === id ? { ...claimant, [field]: value } : claimant
      ) || []
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      supportingDocuments: [...prev.supportingDocuments, ...fileArray]
    }));
    toast({ title: "Files Uploaded", description: `${fileArray.length} file(s) uploaded successfully` });
  };

  const handleSubmitClaim = async () => {
    const requiredDeclarations = Object.values(formData.declarations);
    if (!requiredDeclarations.every(Boolean)) {
      toast({ title: "Validation Error", description: "Please accept all required declarations", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({ title: "Claim Submitted", description: "Your claim has been submitted successfully." });
      navigate('/claims');
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit claim", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/claims" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Submit Claim</h1>
              <p className="text-muted-foreground">Corporate Restructuring Claims - Q4 2024</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Due: Dec 31, 2024</span>
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="claimant-info">Claimant Info</TabsTrigger>
            <TabsTrigger value="claim-details">Claim Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="bank-details">Bank Details</TabsTrigger>
            <TabsTrigger value="review">Review & Submit</TabsTrigger>
          </TabsList>

          <TabsContent value="claimant-info">
            <Card>
              <CardHeader><CardTitle>Claimant Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Claimant Type</Label>
                  <Select value={formData.claimantType} onValueChange={(value: 'self' | 'representative' | 'group_representative') => setFormData(prev => ({ ...prev, claimantType: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="representative">Representative</SelectItem>
                      <SelectItem value="group_representative">Group Representative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input value={formData.personalInfo.fullName} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label>Email Address *</Label>
                    <Input type="email" value={formData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} placeholder="Enter email" />
                  </div>
                  <div>
                    <Label>Phone Number *</Label>
                    <Input value={formData.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} placeholder="Enter phone" />
                  </div>
                  <div>
                    <Label>PAN Number *</Label>
                    <Input value={formData.personalInfo.panNumber} onChange={(e) => handleInputChange('personalInfo', 'panNumber', e.target.value)} placeholder="Enter PAN" />
                  </div>
                </div>
                <div>
                  <Label>Address *</Label>
                  <Textarea value={formData.personalInfo.address} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} placeholder="Enter address" rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input value={formData.personalInfo.city} onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)} placeholder="Enter city" />
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Input value={formData.personalInfo.state} onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)} placeholder="Enter state" />
                  </div>
                  <div>
                    <Label>PIN Code *</Label>
                    <Input value={formData.personalInfo.pincode} onChange={(e) => handleInputChange('personalInfo', 'pincode', e.target.value)} placeholder="Enter PIN" />
                  </div>
                </div>

                {/* Representative Information */}
                {formData.claimantType === 'representative' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Representative Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Representative Name *</Label>
                          <Input
                            value={formData.representativeInfo?.fullName || ''}
                            onChange={(e) => handleInputChange('representativeInfo', 'fullName', e.target.value)}
                            placeholder="Enter representative name"
                          />
                        </div>
                        <div>
                          <Label>Relationship *</Label>
                          <Input
                            value={formData.representativeInfo?.relationship || ''}
                            onChange={(e) => handleInputChange('representativeInfo', 'relationship', e.target.value)}
                            placeholder="Enter relationship"
                          />
                        </div>
                        <div>
                          <Label>Representative Email *</Label>
                          <Input
                            type="email"
                            value={formData.representativeInfo?.email || ''}
                            onChange={(e) => handleInputChange('representativeInfo', 'email', e.target.value)}
                            placeholder="Enter representative email"
                          />
                        </div>
                        <div>
                          <Label>Representative Phone *</Label>
                          <Input
                            value={formData.representativeInfo?.phone || ''}
                            onChange={(e) => handleInputChange('representativeInfo', 'phone', e.target.value)}
                            placeholder="Enter representative phone"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Authorization Document *</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">Upload authorization document</p>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e.target.files)}
                            className="max-w-xs mx-auto"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Group Claimants Information */}
                {formData.claimantType === 'group_representative' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Group Claimants Information</span>
                        <Button type="button" onClick={addGroupClaimant} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Claimant
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.groupClaimants && formData.groupClaimants.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No group claimants added yet</p>
                          <p className="text-sm">Click "Add Claimant" to add organizations/entities to this group claim</p>
                        </div>
                      )}
                      
                      {formData.groupClaimants?.map((claimant, index) => (
                        <Card key={claimant.id} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                              <span>Claimant #{index + 1}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeGroupClaimant(claimant.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Organization/Entity Name *</Label>
                                <Input
                                  value={claimant.organizationName}
                                  onChange={(e) => updateGroupClaimant(claimant.id, 'organizationName', e.target.value)}
                                  placeholder="Enter organization name"
                                />
                              </div>
                              <div>
                                <Label>Contact Person Name *</Label>
                                <Input
                                  value={claimant.contactPersonName}
                                  onChange={(e) => updateGroupClaimant(claimant.id, 'contactPersonName', e.target.value)}
                                  placeholder="Enter contact person name"
                                />
                              </div>
                              <div>
                                <Label>Email Address *</Label>
                                <Input
                                  type="email"
                                  value={claimant.email}
                                  onChange={(e) => updateGroupClaimant(claimant.id, 'email', e.target.value)}
                                  placeholder="Enter email address"
                                />
                              </div>
                              <div>
                                <Label>Phone Number *</Label>
                                <Input
                                  value={claimant.phone}
                                  onChange={(e) => updateGroupClaimant(claimant.id, 'phone', e.target.value)}
                                  placeholder="Enter phone number"
                                />
                              </div>
                              <div>
                                <Label>PAN Number *</Label>
                                <Input
                                  value={claimant.panNumber}
                                  onChange={(e) => updateGroupClaimant(claimant.id, 'panNumber', e.target.value)}
                                  placeholder="Enter PAN number"
                                />
                              </div>
                              <div>
                                <Label>Registration Number</Label>
                                <Input
                                  value={claimant.registrationNumber || ''}
                                  onChange={(e) => updateGroupClaimant(claimant.id, 'registrationNumber', e.target.value)}
                                  placeholder="Enter registration number (optional)"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Individual Claim Amount (INR) *</Label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    value={claimant.claimAmount}
                                    onChange={(e) => updateGroupClaimant(claimant.id, 'claimAmount', parseFloat(e.target.value) || 0)}
                                    placeholder="Enter claim amount for this entity"
                                    className="pl-10"
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {formData.groupClaimants && formData.groupClaimants.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-900">Group Summary</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700">Total Claimants: </span>
                              <span className="font-medium">{formData.groupClaimants.length}</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Total Claim Amount: </span>
                              <span className="font-medium">
                                ₹{formData.groupClaimants.reduce((sum, c) => sum + c.claimAmount, 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claim-details">
            <Card>
              <CardHeader><CardTitle>Claim Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Claim Amount (INR) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="number" value={formData.claimDetails.claimAmount} onChange={(e) => handleInputChange('claimDetails', 'claimAmount', parseFloat(e.target.value) || 0)} placeholder="Enter amount" className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label>Claim Category *</Label>
                    <Select value={formData.claimDetails.claimCategory} onValueChange={(value) => handleInputChange('claimDetails', 'claimCategory', value)}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational_debt">Operational Debt</SelectItem>
                        <SelectItem value="financial_debt">Financial Debt</SelectItem>
                        <SelectItem value="contingent_claim">Contingent Claim</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Claim Description *</Label>
                  <Textarea value={formData.claimDetails.claimDescription} onChange={(e) => handleInputChange('claimDetails', 'claimDescription', e.target.value)} placeholder="Describe your claim" rows={4} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Incident Date *</Label>
                    <Input type="date" value={formData.claimDetails.incidentDate} onChange={(e) => handleInputChange('claimDetails', 'incidentDate', e.target.value)} />
                  </div>
                  <div>
                    <Label>Claim Basis *</Label>
                    <Select value={formData.claimDetails.claimBasis} onValueChange={(value) => handleInputChange('claimDetails', 'claimBasis', value)}>
                      <SelectTrigger><SelectValue placeholder="Select basis" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="court_order">Court Order</SelectItem>
                        <SelectItem value="statutory">Statutory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="interestClaimed" checked={formData.claimDetails.interestClaimed} onCheckedChange={(checked) => handleInputChange('claimDetails', 'interestClaimed', checked)} />
                  <Label htmlFor="interestClaimed">Claim Interest (12% p.a.)</Label>
                </div>
                {formData.claimDetails.interestClaimed && (
                  <div>
                    <Label>Interest From Date</Label>
                    <Input type="date" value={formData.claimDetails.interestFromDate || ''} onChange={(e) => handleInputChange('claimDetails', 'interestFromDate', e.target.value)} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader><CardTitle>Supporting Documents</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Upload supporting documents</p>
                  <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e.target.files)} className="max-w-xs mx-auto" />
                </div>
                {formData.supportingDocuments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Uploaded Documents ({formData.supportingDocuments.length})</h4>
                    <div className="space-y-2">
                      {formData.supportingDocuments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank-details">
            <Card>
              <CardHeader><CardTitle>Bank Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Account Holder Name *</Label>
                    <Input value={formData.bankDetails.accountHolderName} onChange={(e) => handleInputChange('bankDetails', 'accountHolderName', e.target.value)} placeholder="Enter account holder name" />
                  </div>
                  <div>
                    <Label>Account Number *</Label>
                    <Input value={formData.bankDetails.accountNumber} onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)} placeholder="Enter account number" />
                  </div>
                  <div>
                    <Label>IFSC Code *</Label>
                    <Input value={formData.bankDetails.ifscCode} onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value)} placeholder="Enter IFSC code" />
                  </div>
                  <div>
                    <Label>Bank Name *</Label>
                    <Input value={formData.bankDetails.bankName} onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)} placeholder="Enter bank name" />
                  </div>
                </div>
                <div>
                  <Label>Branch Name *</Label>
                  <Input value={formData.bankDetails.branchName} onChange={(e) => handleInputChange('bankDetails', 'branchName', e.target.value)} placeholder="Enter branch name" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review">
            <Card>
              <CardHeader><CardTitle>Review & Submit</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="accuracy" checked={formData.declarations.accuracyDeclaration} onCheckedChange={(checked) => handleInputChange('declarations', 'accuracyDeclaration', checked)} />
                    <Label htmlFor="accuracy">I declare that all information provided is accurate and complete</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="legal" checked={formData.declarations.legalConsequencesAcknowledgment} onCheckedChange={(checked) => handleInputChange('declarations', 'legalConsequencesAcknowledgment', checked)} />
                    <Label htmlFor="legal">I understand the legal consequences of providing false information</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="duplicate" checked={formData.declarations.duplicateClaimDeclaration} onCheckedChange={(checked) => handleInputChange('declarations', 'duplicateClaimDeclaration', checked)} />
                    <Label htmlFor="duplicate">I confirm this is not a duplicate claim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="communication" checked={formData.declarations.communicationConsent} onCheckedChange={(checked) => handleInputChange('declarations', 'communicationConsent', checked)} />
                    <Label htmlFor="communication">I consent to receive communications regarding this claim</Label>
                  </div>
                </div>
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setActiveTab("bank-details")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button onClick={handleSubmitClaim} disabled={isLoading}>
                      {isLoading ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                      Submit Claim
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClaimSubmission;

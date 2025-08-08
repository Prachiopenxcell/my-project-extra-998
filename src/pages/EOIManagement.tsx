import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  FileText,
  Calendar,
  Clock,
  Users,
  Building,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Save,
  Send,
  Bot,
  Target,
  Info,
  ExternalLink
} from 'lucide-react';

interface COCMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface EOIFormData {
  entityId: string;
  entityName: string;
  lastDateEOI: string;
  lastDateResolutionPlan: string;
  eligibilityURL: string;
  documentsURL: string;
  publicationDate: string;
  formGPublished: boolean;
  publicationDone: boolean;
  aiAssistance: boolean;
  cocMembers: COCMember[];
  requiredDocuments: string[];
  additionalDetails: string;
}

interface DocumentRequirement {
  id: string;
  name: string;
  required: boolean;
  description: string;
}

const EOIManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('setup');
  const [loading, setLoading] = useState(false);
  const [showCOCDialog, setShowCOCDialog] = useState(false);
  const [newCOCMember, setNewCOCMember] = useState({ name: '', email: '', role: '' });
  
  const [formData, setFormData] = useState<EOIFormData>({
    entityId: '',
    entityName: '',
    lastDateEOI: '',
    lastDateResolutionPlan: '',
    eligibilityURL: '',
    documentsURL: '',
    publicationDate: '',
    formGPublished: false,
    publicationDone: false,
    aiAssistance: false,
    cocMembers: [],
    requiredDocuments: [],
    additionalDetails: ''
  });

  // Mock entities data
  const [entities] = useState([
    { id: '1', name: 'ABC Corporation Ltd.', cin: 'U12345DL2020PLC123456', type: 'Private Limited' },
    { id: '2', name: 'XYZ Industries Pvt. Ltd.', cin: 'U67890MH2019PTC234567', type: 'Private Limited' },
    { id: '3', name: 'PQR Manufacturing Co.', cin: 'U11111KA2021PLC345678', type: 'Public Limited' }
  ]);

  // Document requirements checklist
  const [documentRequirements] = useState<DocumentRequirement[]>([
    { id: 'eoi-letter', name: 'Letter stating EOI signed by PRAs', required: true, description: 'Formal letter expressing interest' },
    { id: '29a-undertaking', name: '29A eligibility undertaking', required: true, description: 'Section 29A compliance undertaking' },
    { id: 'eligibility-undertaking', name: 'Fulfilling Eligibility criteria undertaking', required: true, description: 'General eligibility compliance' },
    { id: 'confidential-undertaking', name: 'Confidential Undertaking', required: true, description: 'Confidentiality agreement' },
    { id: 'annual-reports', name: 'Copies of Annual Reports for last three years', required: true, description: 'Financial performance records' },
    { id: 'networth-certificate', name: 'Copies of Net worth certificate', required: true, description: 'Financial standing proof' },
    { id: 'board-resolution', name: 'Copies of Board Resolution authorising person', required: true, description: 'Authorization documents' },
    { id: 'incorporation-docs', name: 'Copies of Incorporation docs', required: true, description: 'Company registration documents' },
    { id: 'kyc-pras', name: 'Copies of KYC of PRAs', required: true, description: 'Know Your Customer documents' },
    { id: 'kyc-authorized', name: 'Copies of KYC of Authorised person', required: true, description: 'Authorized representative KYC' },
    { id: 'connected-persons', name: 'List of connected persons', required: true, description: 'Related party disclosures' },
    { id: 'consortium-agreement', name: 'Consortium Agreement', required: false, description: 'If applicable for consortiums' },
    { id: 'payment-proof', name: 'Copy of cheque/DD/NEFT', required: true, description: 'EMD payment proof' },
    { id: 'profile', name: 'Profile', required: true, description: 'Company/individual profile' },
    { id: 'others', name: 'Others, Specify', required: false, description: 'Additional documents as required' }
  ]);

  useEffect(() => {
    if (id) {
      // Load existing EOI data
      loadEOIData(id);
    }
  }, [id]);

  const loadEOIData = async (eoiId: string) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      setTimeout(() => {
        setFormData({
          ...formData,
          entityId: '1',
          entityName: 'ABC Corporation Ltd.',
          lastDateEOI: '2024-02-15',
          lastDateResolutionPlan: '2024-03-15',
          cocMembers: [
            { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Financial Creditor', status: 'active' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Operational Creditor', status: 'active' }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load EOI data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleEntitySelect = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (entity) {
      setFormData(prev => ({
        ...prev,
        entityId,
        entityName: entity.name
      }));
    }
  };

  const handleAddCOCMember = () => {
    if (!newCOCMember.name || !newCOCMember.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    const member: COCMember = {
      id: Date.now().toString(),
      name: newCOCMember.name,
      email: newCOCMember.email,
      role: newCOCMember.role || 'COC Member',
      status: 'active'
    };

    setFormData(prev => ({
      ...prev,
      cocMembers: [...prev.cocMembers, member]
    }));

    setNewCOCMember({ name: '', email: '', role: '' });
    setShowCOCDialog(false);
    
    toast({
      title: "Success",
      description: "COC member added successfully"
    });
  };

  const handleRemoveCOCMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      cocMembers: prev.cocMembers.filter(m => m.id !== memberId)
    }));
    
    toast({
      title: "Success",
      description: "COC member removed successfully"
    });
  };

  const handleDocumentToggle = (docId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: checked 
        ? [...prev.requiredDocuments, docId]
        : prev.requiredDocuments.filter(id => id !== docId)
    }));
  };

  const handleSaveAndPublish = async () => {
    if (!formData.entityId || !formData.lastDateEOI || !formData.lastDateResolutionPlan) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.cocMembers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one COC member",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        toast({
          title: "Success",
          description: "EOI invitation created and published successfully"
        });
        navigate('/resolution/dashboard');
        setLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save EOI invitation",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        toast({
          title: "Success",
          description: "EOI invitation saved as draft"
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/resolution/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {id ? 'Edit EOI Invitation' : 'Create EOI Invitation'}
              </h1>
              <p className="text-muted-foreground">
                Set up Expression of Interest invitation for resolution process
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {activeTab === 'setup' ? 'Setup' : activeTab === 'documents' ? 'Documents' : 'Preview'}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Setup & COC Members
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Document Requirements
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview & Publish
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Entity Selection & Basic Details
                </CardTitle>
                <CardDescription>
                  Select the entity and configure basic EOI invitation details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Select Entity</Label>
                    <Select value={formData.entityId} onValueChange={handleEntitySelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose entity for resolution process" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            <div>
                              <div className="font-medium">{entity.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {entity.type} • CIN: {entity.cin}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lastDateEOI">Last Date for EOI Submission</Label>
                    <Input
                      id="lastDateEOI"
                      type="date"
                      value={formData.lastDateEOI}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastDateEOI: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastDateResolutionPlan">Last Date for Resolution Plan</Label>
                    <Input
                      id="lastDateResolutionPlan"
                      type="date"
                      value={formData.lastDateResolutionPlan}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastDateResolutionPlan: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="publicationDate">Publication Date</Label>
                    <Input
                      id="publicationDate"
                      type="date"
                      value={formData.publicationDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, publicationDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="eligibilityURL">Eligibility Criteria URL</Label>
                    <Input
                      id="eligibilityURL"
                      placeholder="https://example.com/eligibility-criteria"
                      value={formData.eligibilityURL}
                      onChange={(e) => setFormData(prev => ({ ...prev, eligibilityURL: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentsURL">Documents & Financial Statements URL</Label>
                    <Input
                      id="documentsURL"
                      placeholder="https://example.com/documents"
                      value={formData.documentsURL}
                      onChange={(e) => setFormData(prev => ({ ...prev, documentsURL: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="formGPublished"
                      checked={formData.formGPublished}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, formGPublished: checked as boolean }))}
                    />
                    <Label htmlFor="formGPublished">Form G is Published</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="publicationDone"
                      checked={formData.publicationDone}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, publicationDone: checked as boolean }))}
                    />
                    <Label htmlFor="publicationDone">Publication Done</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aiAssistance"
                      checked={formData.aiAssistance}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, aiAssistance: checked as boolean }))}
                    />
                    <Label htmlFor="aiAssistance" className="flex items-center gap-1">
                      <Bot className="h-4 w-4" />
                      AI Assistance
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* COC Members Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Committee of Creditors (COC) Members
                    </CardTitle>
                    <CardDescription>
                      Add COC members who will receive the EOI invitation
                    </CardDescription>
                  </div>
                  <Dialog open={showCOCDialog} onOpenChange={setShowCOCDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add COC Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add COC Member</DialogTitle>
                        <DialogDescription>
                          Enter the details of the COC member
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="memberName">Name</Label>
                          <Input
                            id="memberName"
                            value={newCOCMember.name}
                            onChange={(e) => setNewCOCMember(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter member name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberEmail">Email</Label>
                          <Input
                            id="memberEmail"
                            type="email"
                            value={newCOCMember.email}
                            onChange={(e) => setNewCOCMember(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberRole">Role</Label>
                          <Select value={newCOCMember.role} onValueChange={(value) => setNewCOCMember(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Financial Creditor">Financial Creditor</SelectItem>
                              <SelectItem value="Operational Creditor">Operational Creditor</SelectItem>
                              <SelectItem value="COC Member">COC Member</SelectItem>
                              <SelectItem value="Representative">Representative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowCOCDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddCOCMember}>
                            Add Member
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {formData.cocMembers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.cocMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCOCMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No COC members added yet</p>
                    <p className="text-sm">Click "Add COC Member" to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Save and Next Button for Setup Tab */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => navigate('/resolution')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => setActiveTab('documents')}
                className="flex items-center gap-2"
                disabled={!formData.entityId || !formData.lastDateEOI}
              >
                <Save className="h-4 w-4" />
                Save & Next
              </Button>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Requirements Checklist
                </CardTitle>
                <CardDescription>
                  Select the documents that PRAs must submit with their EOI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentRequirements.map((doc) => (
                    <div key={doc.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={doc.id}
                        checked={formData.requiredDocuments.includes(doc.id)}
                        onCheckedChange={(checked) => handleDocumentToggle(doc.id, checked as boolean)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label htmlFor={doc.id} className="font-medium cursor-pointer">
                          {doc.name}
                          {doc.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Label htmlFor="additionalDetails">Additional Requirements/Details</Label>
                  <Textarea
                    id="additionalDetails"
                    placeholder="Enter any additional requirements or special instructions for PRAs..."
                    value={formData.additionalDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Save and Next Button for Documents Tab */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('setup')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Setup
              </Button>
              <Button 
                onClick={() => setActiveTab('preview')}
                className="flex items-center gap-2"
                disabled={formData.requiredDocuments.length === 0}
              >
                <Save className="h-4 w-4" />
                Save & Next
              </Button>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  EOI Invitation Preview
                </CardTitle>
                <CardDescription>
                  Review the EOI invitation before publishing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.entityName ? (
                  <div className="space-y-6">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        This is a preview of your EOI invitation. Review all details carefully before publishing.
                      </AlertDescription>
                    </Alert>

                    <div className="border rounded-lg p-6 bg-muted/20">
                      <h3 className="text-xl font-bold mb-4">Expression of Interest Invitation</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Entity Details:</h4>
                          <p>{formData.entityName}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold">Last Date for EOI:</h4>
                            <p>{formData.lastDateEOI ? new Date(formData.lastDateEOI).toLocaleDateString() : 'Not set'}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Last Date for Resolution Plan:</h4>
                            <p>{formData.lastDateResolutionPlan ? new Date(formData.lastDateResolutionPlan).toLocaleDateString() : 'Not set'}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold">COC Members ({formData.cocMembers.length}):</h4>
                          <ul className="list-disc list-inside mt-2">
                            {formData.cocMembers.map((member) => (
                              <li key={member.id}>{member.name} ({member.role})</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold">Required Documents ({formData.requiredDocuments.length}):</h4>
                          <ul className="list-disc list-inside mt-2">
                            {formData.requiredDocuments.map((docId) => {
                              const doc = documentRequirements.find(d => d.id === docId);
                              return doc ? <li key={docId}>{doc.name}</li> : null;
                            })}
                          </ul>
                        </div>

                        {formData.additionalDetails && (
                          <div>
                            <h4 className="font-semibold">Additional Requirements:</h4>
                            <p className="whitespace-pre-wrap">{formData.additionalDetails}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleSaveAsDraft} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                      <Button onClick={handleSaveAndPublish} disabled={loading}>
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Save & Publish
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Complete the setup to preview your EOI invitation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EOIManagement;

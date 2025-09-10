import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { useSubscription } from '@/contexts/SubscriptionContext';
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
  formGFileName?: string;
  detailedEOIFileName?: string;
  // Detailed EOI fields
  formGNumber?: string;
  formGIteration?: 'First' | 'Second' | 'Third';
  effectiveICDDate?: string;
  detailsIndividuals?: string;
  detailsGroups?: string;
  detailsFinancialInstitutions?: string;
  detailsFundHouses?: string;
  detailsEMD?: string;
  attachmentNames?: string[];
  signatureType?: 'digital' | 'upload' | 'profile' | null;
  signatureFileName?: string;
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
  const creditorsFileRef = useRef<HTMLInputElement | null>(null);
  const { hasModuleAccess } = useSubscription();
  const formGFileRef = useRef<HTMLInputElement | null>(null);
  const detailedEOIFileRef = useRef<HTMLInputElement | null>(null);
  const extraAttachmentRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  
  const [activeTab, setActiveTab] = useState('coc');
  const [loading, setLoading] = useState(false);
  const [showCOCDialog, setShowCOCDialog] = useState(false);
  const [newCOCMember, setNewCOCMember] = useState({ name: '', email: '', role: '' });
  const [editDates, setEditDates] = useState(false);
  const [autoCalcDates, setAutoCalcDates] = useState(true);
  
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
    cocMembers: [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Financial Creditor', status: 'active' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Operational Creditor', status: 'active' }
    ],
    requiredDocuments: [],
    additionalDetails: '',
    formGNumber: '',
    formGIteration: 'First',
    effectiveICDDate: '',
    detailsIndividuals: '',
    detailsGroups: '',
    detailsFinancialInstitutions: '',
    detailsFundHouses: '',
    detailsEMD: '',
    attachmentNames: [],
    signatureType: null
  });

  // Helpers for date math
  const addDays = (dateStr: string, days: number): string => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Export helpers
  const handleDownloadPDF = () => {
    if (!previewRef.current) return;
    // Open a new printable window with the preview content
    const printContents = previewRef.current.innerHTML;
    const win = window.open('', '', 'width=900,height=650');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>EOI Invitation</title>
      <style>
        body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"; padding: 24px; }
        h3, h4 { margin: 0 0 8px; }
        .section { margin-bottom: 16px; }
        .muted { color: #6b7280; font-size: 12px; }
      </style>
    </head><body>${printContents}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleDownloadDOC = () => {
    if (!previewRef.current) return;
    const content = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${previewRef.current.innerHTML}</body></html>`;
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Detailed_EOI_${formData.formGNumber || 'draft'}.doc`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  // Auto-calc dates when publication date changes (if enabled)
  useEffect(() => {
    if (!autoCalcDates) return;
    if (!formData.publicationDate) return;
    // Defaults as per standard timelines; adjust when legal durations change
    const defaultEOIDays = 14; // days from publication to last date of EOI
    const defaultRPDays = 30;  // days from publication to last date of Resolution Plan
    const newEOI = addDays(formData.publicationDate, defaultEOIDays);
    const newRP = addDays(formData.publicationDate, defaultRPDays);
    setFormData(prev => ({
      ...prev,
      lastDateEOI: newEOI || prev.lastDateEOI,
      lastDateResolutionPlan: newRP || prev.lastDateResolutionPlan,
    }));
  }, [formData.publicationDate, autoCalcDates]);

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

  const loadEOIData = useCallback((eoiId: string) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          entityId: '1',
          entityName: 'ABC Corporation Ltd.',
          lastDateEOI: '2024-02-15',
          lastDateResolutionPlan: '2024-03-15',
          cocMembers: [
            { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Financial Creditor', status: 'active' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Operational Creditor', status: 'active' }
          ]
        }));
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
  }, [toast]);

  useEffect(() => {
    if (id) {
      loadEOIData(id);
    }
  }, [id, loadEOIData]);

  // Upload List of Creditors (Excel) handlers
  const handleUploadCreditorsClick = () => {
    creditorsFileRef.current?.click();
  };

  const handleCreditorsExcelSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock import: append two sample members to the list
      const imported: COCMember[] = [
        { id: `${Date.now()}-i1`, name: 'Imported Creditor 1', email: 'import1@example.com', role: 'Financial Creditor', status: 'active' },
        { id: `${Date.now()}-i2`, name: 'Imported Creditor 2', email: 'import2@example.com', role: 'Operational Creditor', status: 'active' }
      ];
      setFormData(prev => ({ ...prev, cocMembers: [...prev.cocMembers, ...imported] }));
      toast({ title: 'Creditors Imported', description: `${file.name} processed. ${imported.length} members added.` });
      // Reset input to allow re-selecting the same file
      e.target.value = '';
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
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Hidden input for uploading list of creditors (Excel) */}
        <input
          ref={creditorsFileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleCreditorsExcelSelected}
        />
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
              {activeTab === 'coc' ? 'COC Members' : activeTab === 'details' ? 'EOI Details' : activeTab === 'documents' ? 'Documents' : 'Preview'}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="coc" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              COC Members
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              EOI Details
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Detailed EOI
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* COC Members Tab */}
          <TabsContent value="coc" className="space-y-6">
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
                  <div className="flex items-center gap-2">
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
                    <Button variant="outline" size="sm" onClick={handleUploadCreditorsClick}>
                      Upload List (.xlsx)
                    </Button>
                  </div>
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
            
            {/* Save and Next for COC Tab */}
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
                onClick={() => setActiveTab('details')}
                className="flex items-center gap-2"
                disabled={false}
              >
                <Save className="h-4 w-4" />
                Save & Next
              </Button>
            </div>
          </TabsContent>

          {/* EOI Details Tab */}
          <TabsContent value="details" className="space-y-6">
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
                    <Label className="text-base font-medium mb-2 block">Select Entity</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
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
                      <Button variant="outline" size="sm" onClick={() => navigate('/create-entity')}>
                        Create Entity
                      </Button>
                    </div>
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
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Checkbox id="autoCalcDates" checked={autoCalcDates} onCheckedChange={(c) => setAutoCalcDates(c as boolean)} />
                        <Label htmlFor="autoCalcDates" className="text-xs">Auto-calculate dates from publication date</Label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!formData.publicationDate) return;
                          const newEOI = addDays(formData.publicationDate, 14);
                          const newRP = addDays(formData.publicationDate, 30);
                          setFormData(prev => ({ ...prev, lastDateEOI: newEOI, lastDateResolutionPlan: newRP }));
                          toast({ title: 'Dates recalculated', description: 'EOI and Resolution Plan dates updated from Publication Date.' });
                        }}
                      >
                        Recalculate
                      </Button>
                    </div>
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
                    <div className="flex items-center gap-2">
                      <Input
                        id="documentsURL"
                        placeholder="https://example.com/documents"
                        value={formData.documentsURL}
                        onChange={(e) => setFormData(prev => ({ ...prev, documentsURL: e.target.value }))}
                      />
                      {hasModuleAccess('vdr') && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = `/vdr/share/${Date.now()}`;
                            setFormData(prev => ({ ...prev, documentsURL: link }));
                            toast({ title: 'VDR Link Created', description: 'A shareable VDR link has been added to the Documents URL.' });
                          }}
                        >
                          Create VDR Link
                        </Button>
                      )}
                    </div>
                    {!hasModuleAccess('vdr') && (
                      <p className="text-xs text-muted-foreground mt-1">Subscribe to VDR to auto-create secure document links.</p>
                    )}
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

                  {!formData.formGPublished && (
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate('/create-service-request');
                        }}
                      >
                        Publish Form G
                      </Button>
                      <span className="text-xs text-muted-foreground">Not published yet</span>
                    </div>
                  )}

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

                {/* Conditional Uploads when Form G is published */}
                {formData.formGPublished && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hidden inputs */}
                    <input
                      ref={formGFileRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData(prev => ({ ...prev, formGFileName: file.name }));
                          toast({ title: 'Form G uploaded', description: file.name });
                        }
                        e.currentTarget.value = '';
                      }}
                    />
                    <input
                      ref={detailedEOIFileRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData(prev => ({ ...prev, detailedEOIFileName: file.name }));
                          toast({ title: 'Detailed EOI uploaded', description: file.name });
                        }
                        e.currentTarget.value = '';
                      }}
                    />

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">Upload Form G (PDF)</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => formGFileRef.current?.click()}>
                            {formData.formGFileName ? 'Replace' : 'Upload'}
                          </Button>
                          {formData.formGFileName && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, formGFileName: undefined }))}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formData.formGFileName ? formData.formGFileName : 'No file uploaded'}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">Upload Detailed EOI (PDF)</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => detailedEOIFileRef.current?.click()}>
                            {formData.detailedEOIFileName ? 'Replace' : 'Upload'}
                          </Button>
                          {formData.detailedEOIFileName && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, detailedEOIFileName: undefined }))}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formData.detailedEOIFileName ? formData.detailedEOIFileName : 'No file uploaded'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save and Next for Details Tab */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('coc')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to COC Members
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
                {/* AI Assistance for Documents */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 p-3 rounded-md bg-muted/40">
                  <div className="text-sm text-muted-foreground">AI can help suggest an appropriate checklist and draft additional details.</div>
                  {formData.aiAssistance ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Suggest all required docs + a few recommended optional ones
                          const required = documentRequirements.filter(d => d.required).map(d => d.id);
                          const recommended = ['consortium-agreement', 'others'].filter(id => documentRequirements.some(d => d.id === id));
                          const newList = Array.from(new Set([...(formData.requiredDocuments || []), ...required, ...recommended]));
                          setFormData(prev => ({ ...prev, requiredDocuments: newList }));
                          toast({ title: 'Checklist suggested', description: 'AI selected core documents and recommended a few optional ones.' });
                        }}
                      >
                        Suggest Checklist
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const draft = `Please ensure the submission includes all required undertakings and documentary proofs. 
EOI submissions must adhere to eligibility criteria as per Form G${formData.formGNumber ? ` (No. ${formData.formGNumber})` : ''}. 
Submission timelines: EOI by ${formData.lastDateEOI || '—'}; Resolution Plan by ${formData.lastDateResolutionPlan || '—'}. 
Where applicable, consortium participants should provide a duly executed Consortium Agreement and authorization. 
Confidentiality obligations apply to all PRAs. EMD terms are as specified under the Detailed EOI.`;
                          setFormData(prev => ({ ...prev, additionalDetails: prev.additionalDetails ? prev.additionalDetails : draft }));
                          toast({ title: 'Draft prepared', description: 'AI drafted additional details. Review and edit as needed.' });
                        }}
                      >
                        Draft Additional Details
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => navigate('/subscription/browse?feature=ai-assistance')}>
                      Enable AI Assistance
                    </Button>
                  )}
                </div>
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
                onClick={() => setActiveTab('details')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to EOI Details
              </Button>
              <Button 
                onClick={() => setActiveTab('detailed')}
                className="flex items-center gap-2"
                disabled={formData.requiredDocuments.length === 0}
              >
                <Save className="h-4 w-4" />
                Save & Next
              </Button>
            </div>
          </TabsContent>

          {/* Detailed EOI Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Detailed Invitation for EOI
                </CardTitle>
                <CardDescription>
                  Auto-populated from Form G, timelines, and subscribed modules. Review and complete mandatory fields.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="formGNumber">No. of Form G</Label>
                    <Input id="formGNumber" value={formData.formGNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, formGNumber: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="formGIteration">Iteration</Label>
                    <Select value={formData.formGIteration}
                      onValueChange={(v: 'First' | 'Second' | 'Third') => setFormData(prev => ({ ...prev, formGIteration: v }))}>
                      <SelectTrigger id="formGIteration"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First">First</SelectItem>
                        <SelectItem value="Second">Second</SelectItem>
                        <SelectItem value="Third">Third</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="effectiveICDDate">Effective date of ICD*</Label>
                    <Input id="effectiveICDDate" type="date" value={formData.effectiveICDDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, effectiveICDDate: e.target.value }))} />
                    <p className="text-xs text-muted-foreground mt-1">Effective date means date of receipt of order by RP / date after excluding days approved by NCLT.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    // Prefill from Form G and timelines if available
                    setFormData(prev => ({
                      ...prev,
                      detailsIndividuals: prev.detailsIndividuals || `EOI invited pursuant to Form G ${prev.formGNumber || ''} dated ${prev.publicationDate || ''}.`,
                      detailsGroups: prev.detailsGroups || 'Consortium participation permitted as per published criteria.',
                      detailsFinancialInstitutions: prev.detailsFinancialInstitutions || 'Financial institutions may participate subject to eligibility.',
                      detailsFundHouses: prev.detailsFundHouses || 'Fund houses may participate per guidelines.',
                      detailsEMD: prev.detailsEMD || 'EMD as per Form G / Process Memorandum.'
                    }));
                    toast({ title: 'Prefilled from Form G', description: 'Details drafted from Form G and timeline.' });
                  }}>Prefill from Form G</Button>
                  {hasModuleAccess('meetings') && (
                    <Button variant="outline" size="sm" onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        detailsIndividuals: prev.detailsIndividuals || 'Meeting module data used to suggest content for Individuals.',
                        detailsGroups: prev.detailsGroups || 'Meeting module indicates consortium allowances and brief.',
                        detailsFinancialInstitutions: prev.detailsFinancialInstitutions || 'Meeting-derived financial institution guidelines added.',
                        detailsFundHouses: prev.detailsFundHouses || 'Meeting-derived fund house participation notes added.',
                      }));
                      toast({ title: 'Prefilled from Meetings', description: 'Suggested content added from Meetings module.' });
                    }}>Prefill from Meetings</Button>
                  )}
                  {formData.aiAssistance ? (
                    <Button variant="outline" size="sm" onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        detailsIndividuals: prev.detailsIndividuals || 'AI-drafted guidance for Individuals section based on Form G.',
                        detailsGroups: prev.detailsGroups || 'AI-drafted consortium instructions based on past templates.',
                        detailsFinancialInstitutions: prev.detailsFinancialInstitutions || 'AI-drafted FI section aligned with criteria.',
                        detailsFundHouses: prev.detailsFundHouses || 'AI-drafted text for Fund Houses participation.',
                        detailsEMD: prev.detailsEMD || 'AI-drafted EMD clause with standard safeguards.'
                      }));
                      toast({ title: 'AI Assistance Used', description: 'Draft text suggested by AI.' });
                    }}>AI Suggest</Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => navigate('/subscription/browse?feature=ai-assistance')}>
                      Enable AI Assistance
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Individuals</Label>
                    <Textarea rows={4} value={formData.detailsIndividuals}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailsIndividuals: e.target.value }))}
                      placeholder="Provided by the user or auto-populated" />
                  </div>
                  <div>
                    <Label>Groups / Consortium</Label>
                    <Textarea rows={4} value={formData.detailsGroups}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailsGroups: e.target.value }))}
                      placeholder="Provided by the user or auto-populated" />
                  </div>
                  <div>
                    <Label>Financial Institutions</Label>
                    <Textarea rows={4} value={formData.detailsFinancialInstitutions}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailsFinancialInstitutions: e.target.value }))}
                      placeholder="Provided by the user or auto-populated" />
                  </div>
                  <div>
                    <Label>Fund Houses</Label>
                    <Textarea rows={4} value={formData.detailsFundHouses}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailsFundHouses: e.target.value }))}
                      placeholder="Provided by the user or auto-populated" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>EMD</Label>
                    <Textarea rows={3} value={formData.detailsEMD}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailsEMD: e.target.value }))}
                      placeholder="Earnest Money Deposit terms" />
                  </div>
                </div>

                {/* Additional Attachments */}
                <input ref={extraAttachmentRef} type="file" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, attachmentNames: [...(prev.attachmentNames||[]), file.name] }));
                    toast({ title: 'Attachment added', description: file.name });
                  }
                  e.currentTarget.value = '';
                }} />
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-medium">Additional Attachments</Label>
                    <Button variant="outline" size="sm" onClick={() => extraAttachmentRef.current?.click()}>Add Attachment</Button>
                  </div>
                  {formData.attachmentNames && formData.attachmentNames.length > 0 ? (
                    <ul className="text-sm space-y-1">
                      {formData.attachmentNames.map((n, idx) => (
                        <li key={`${n}-${idx}`} className="flex items-center justify-between">
                          <span className="truncate">{n}</span>
                          <Button variant="ghost" size="sm" onClick={() => setFormData(prev => ({ ...prev, attachmentNames: prev.attachmentNames?.filter((_, i) => i !== idx) }))}>Remove</Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No attachments added</p>
                  )}
                </div>

                
              </CardContent>
            </Card>

            {/* Save and Next for Detailed Tab */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('documents')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Documents
              </Button>
              <Button 
                onClick={() => setActiveTab('preview')}
                className="flex items-center gap-2"
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

                    <div ref={previewRef} className="border rounded-lg p-6 bg-muted/20 space-y-4">
                      <div>
                        <h4 className="font-semibold">Entity Details</h4>
                        <p>{formData.entityName}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold">Last Date for EOI</h4>
                          <p>{formData.lastDateEOI ? new Date(formData.lastDateEOI).toLocaleDateString() : 'Not set'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Last Date for Resolution Plan</h4>
                          <p>{formData.lastDateResolutionPlan ? new Date(formData.lastDateResolutionPlan).toLocaleDateString() : 'Not set'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Publication Date</h4>
                          <p>{formData.publicationDate ? new Date(formData.publicationDate).toLocaleDateString() : 'Not set'}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold">Documents URL</h4>
                        <div className="flex items-center gap-2">
                          <p className="truncate">{formData.documentsURL || 'Not set'}</p>
                          {hasModuleAccess('vdr') && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = `/vdr/share/${Date.now()}`;
                                setFormData(prev => ({ ...prev, documentsURL: link }));
                                toast({ title: 'VDR Link Created', description: 'A shareable VDR link has been added to the Documents URL.' });
                              }}
                            >
                              Create VDR Link
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Detailed EOI</h4>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab('detailed')}>Edit</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Form G No.</span>
                            <p>{formData.formGNumber || '—'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Iteration</span>
                            <p>{formData.formGIteration || '—'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Effective ICD</span>
                            <p>{formData.effectiveICDDate ? new Date(formData.effectiveICDDate).toLocaleDateString() : '—'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <span className="text-sm text-muted-foreground">Individuals</span>
                            <p className="whitespace-pre-wrap">{formData.detailsIndividuals || '—'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Groups/Consortium</span>
                            <p className="whitespace-pre-wrap">{formData.detailsGroups || '—'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Financial Institutions</span>
                            <p className="whitespace-pre-wrap">{formData.detailsFinancialInstitutions || '—'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Fund Houses</span>
                            <p className="whitespace-pre-wrap">{formData.detailsFundHouses || '—'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-sm text-muted-foreground">EMD</span>
                            <p className="whitespace-pre-wrap">{formData.detailsEMD || '—'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <Label className="font-medium mb-2 block">Sign</Label>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant={formData.signatureType === 'digital' ? 'default' : 'outline'} size="sm" onClick={() => setFormData(prev => ({ ...prev, signatureType: 'digital' }))}>Digital Signature</Button>
                        <Button variant={formData.signatureType === 'upload' ? 'default' : 'outline'} size="sm" onClick={() => setFormData(prev => ({ ...prev, signatureType: 'upload' }))}>Upload Signature</Button>
                        <Button variant={formData.signatureType === 'profile' ? 'default' : 'outline'} size="sm" onClick={() => {
                          setFormData(prev => ({ ...prev, signatureType: 'profile', signatureFileName: 'profile-signature.png' }));
                          toast({ title: 'Profile signature used', description: 'Pulled signature from your profile.' });
                        }}>Use Profile Signature</Button>
                      </div>
                      {formData.signatureType === 'upload' && (
                        <div className="mt-3">
                          <input type="file" accept="image/*" className="hidden" id="sigUploadInput" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData(prev => ({ ...prev, signatureFileName: file.name }));
                              toast({ title: 'Signature uploaded', description: file.name });
                            }
                            e.currentTarget.value = '';
                          }} />
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => document.getElementById('sigUploadInput')?.click()}>Upload</Button>
                            {formData.signatureFileName && <span className="text-sm text-muted-foreground">{formData.signatureFileName}</span>}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleSaveAsDraft} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleDownloadDOC}>Download DOC</Button>
                        <Button variant="outline" onClick={handleDownloadPDF}>Download PDF</Button>
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

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { 
  User, 
  Building, 
  DollarSign,
  FileText,
  Save,
  Phone,
  Mail
} from 'lucide-react';

interface PRAApplication {
  id: string;
  name: string;
  groupType: 'standalone' | 'group';
  entityType: 'company' | 'partnership' | 'individual';
  status: 'review' | 'approved' | 'query' | 'rejected';
  submitDate: string;
  complianceScore: number;
  section29ACompliant: boolean;
  documentsComplete: boolean;
  netWorthCertificate: boolean;
  kycComplete: boolean;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  financialInfo: {
    netWorth: number;
    turnover: number;
    experience: string;
  };
  documents: Array<{
    name: string;
    status: 'pending' | 'submitted' | 'verified' | 'rejected';
    uploadDate?: string;
    remarks?: string;
  }>;
  evaluationHistory: Array<{
    date: string;
    action: string;
    evaluator: string;
    remarks: string;
  }>;
}

interface PRAEditFormProps {
  pra: PRAApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (pra: PRAApplication) => void;
}

const PRAEditForm: React.FC<PRAEditFormProps> = ({ pra, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<PRAApplication | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (pra) {
      setFormData({ ...pra });
    }
  }, [pra]);

  if (!formData) return null;

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => {
      if (!prev) return null;
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof PRAApplication] as Record<string, unknown>),
            [child]: value
          }
        };
      }
      
      return { ...prev, [field]: value };
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      toast({
        title: "PRA Updated",
        description: "The PRA application has been successfully updated."
      });
      onClose();
    }
  };

  const updateDocumentStatus = (index: number, status: string, remarks?: string) => {
    if (formData) {
      const updatedDocuments = [...formData.documents];
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        status: status as 'pending' | 'submitted' | 'verified' | 'rejected',
        remarks: remarks || updatedDocuments[index].remarks
      };
      setFormData(prev => prev ? { ...prev, documents: updatedDocuments } : null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit PRA: {formData.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Applicant Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter applicant name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groupType">Group Type</Label>
                <Select
                  value={formData.groupType}
                  onValueChange={(value) => handleInputChange('groupType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="consortium">Consortium</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entityType">Entity Type</Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(value) => handleInputChange('entityType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="llp">LLP</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.contactInfo.address}
                    onChange={(e) => handleInputChange('contactInfo.address', e.target.value)}
                    placeholder="Enter complete address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="complianceScore">Overall Compliance Score (%)</Label>
                  <Input
                    id="complianceScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.complianceScore}
                    onChange={(e) => handleInputChange('complianceScore', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="section29A"
                      checked={formData.section29ACompliant}
                      onCheckedChange={(checked) => handleInputChange('section29ACompliant', !!checked)}
                    />
                    <Label htmlFor="section29A">Section 29A Compliant</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="documentsComplete"
                      checked={formData.documentsComplete}
                      onCheckedChange={(checked) => handleInputChange('documentsComplete', !!checked)}
                    />
                    <Label htmlFor="documentsComplete">Documents Complete</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="netWorthCertificate"
                      checked={formData.netWorthCertificate}
                      onCheckedChange={(checked) => handleInputChange('netWorthCertificate', !!checked)}
                    />
                    <Label htmlFor="netWorthCertificate">Net Worth Certificate</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="kycComplete"
                      checked={formData.kycComplete}
                      onCheckedChange={(checked) => handleInputChange('kycComplete', !!checked)}
                    />
                    <Label htmlFor="kycComplete">KYC Complete</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Status Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        <Select
                          value={doc.status}
                          onValueChange={(value) => updateDocumentStatus(index, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`remarks-${index}`}>Remarks</Label>
                        <Textarea
                          id={`remarks-${index}`}
                          value={doc.remarks || ''}
                          onChange={(e) => updateDocumentStatus(index, doc.status, e.target.value)}
                          placeholder="Add remarks for this document"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="netWorth">Net Worth (₹)</Label>
                    <Input
                      id="netWorth"
                      type="number"
                      value={formData.financialInfo.netWorth}
                      onChange={(e) => handleInputChange('financialInfo.netWorth', parseInt(e.target.value) || 0)}
                      placeholder="Enter net worth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="turnover">Annual Turnover (₹)</Label>
                    <Input
                      id="turnover"
                      type="number"
                      value={formData.financialInfo.turnover}
                      onChange={(e) => handleInputChange('financialInfo.turnover', parseInt(e.target.value) || 0)}
                      placeholder="Enter annual turnover"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Details</Label>
                  <Textarea
                    id="experience"
                    value={formData.financialInfo.experience}
                    onChange={(e) => handleInputChange('financialInfo.experience', e.target.value)}
                    placeholder="Describe relevant experience"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PRAEditForm;

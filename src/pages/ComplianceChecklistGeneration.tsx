import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft,
  ArrowRight,
  Bot,
  Plus,
  FileText,
  Building,
  CheckCircle,
  Settings,
  Upload,
  Save,
  Eye,
  Zap,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface ComplianceRequirement {
  id: string;
  title: string;
  authority: string;
  category: 'core' | 'sectoral' | 'size-based';
  description: string;
  frequency: string;
  selected: boolean;
  autoDetected: boolean;
}

interface CustomRequirement {
  title: string;
  authority: string;
  frequency: string;
  documentation: File | null;
}

const ComplianceChecklistGeneration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const selectedEntities = location.state?.selectedEntities || [];
  
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([
    // Core Legal Requirements
    {
      id: "1",
      title: "Income Tax Act, 1961 - Annual Returns, TDS, Advance Tax",
      authority: "Income Tax Department",
      category: "core",
      description: "Annual income tax returns, TDS compliance, advance tax payments",
      frequency: "Annual/Quarterly/Monthly",
      selected: true,
      autoDetected: true
    },
    {
      id: "2", 
      title: "GST Act, 2017 - Monthly Returns, Annual Return",
      authority: "GST Department",
      category: "core",
      description: "GSTR-1, GSTR-3B monthly returns and annual GSTR-9",
      frequency: "Monthly/Annual",
      selected: true,
      autoDetected: true
    },
    {
      id: "3",
      title: "Companies Act, 2013 - ROC Filings, Board Meetings",
      authority: "Ministry of Corporate Affairs",
      category: "core", 
      description: "Annual filings, board resolutions, compliance certificates",
      frequency: "Annual/Quarterly",
      selected: true,
      autoDetected: true
    },
    {
      id: "4",
      title: "Labour Laws - PF, ESI, Professional Tax",
      authority: "Labour Department",
      category: "core",
      description: "Provident Fund, ESI, Professional Tax compliance",
      frequency: "Monthly",
      selected: true,
      autoDetected: true
    },
    {
      id: "5",
      title: "Shops & Establishment Act (Maharashtra)",
      authority: "State Labour Department",
      category: "core",
      description: "Shop and establishment registration and renewals",
      frequency: "Annual",
      selected: true,
      autoDetected: true
    },
    // Sectoral Requirements
    {
      id: "6",
      title: "SEZ regulations (if applicable)",
      authority: "SEZ Authority",
      category: "sectoral",
      description: "Special Economic Zone compliance requirements",
      frequency: "Quarterly",
      selected: true,
      autoDetected: true
    },
    {
      id: "7",
      title: "Software Export obligations",
      authority: "STPI/SEZ",
      category: "sectoral", 
      description: "Software export documentation and reporting",
      frequency: "Monthly",
      selected: true,
      autoDetected: true
    },
    {
      id: "8",
      title: "Data Protection compliance",
      authority: "IT Ministry",
      category: "sectoral",
      description: "Data privacy and protection compliance",
      frequency: "Annual",
      selected: true,
      autoDetected: true
    },
    // Size-based Requirements
    {
      id: "9",
      title: "Contract Labour Act compliance",
      authority: "Labour Department",
      category: "size-based",
      description: "Contract labour registration and compliance",
      frequency: "Annual",
      selected: true,
      autoDetected: true
    },
    {
      id: "10",
      title: "Gratuity Act provisions",
      authority: "Labour Department", 
      category: "size-based",
      description: "Gratuity payment and compliance requirements",
      frequency: "Annual",
      selected: true,
      autoDetected: true
    }
  ]);

  const [customRequirement, setCustomRequirement] = useState<CustomRequirement>({
    title: '',
    authority: '',
    frequency: '',
    documentation: null
  });

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requirementToDelete, setRequirementToDelete] = useState<string | null>(null);
  const [editingRequirement, setEditingRequirement] = useState<string | null>(null);

  const handleRequirementToggle = (id: string) => {
    setRequirements(prev => 
      prev.map(req => 
        req.id === id ? { ...req, selected: !req.selected } : req
      )
    );
  };

  // CRUD Functions
  const handleEditRequirement = (requirementId: string) => {
    setEditingRequirement(requirementId);
    toast({
      title: "Edit Mode",
      description: "Requirement edit functionality would open here.",
    });
  };

  const handleDeleteRequirement = (requirementId: string) => {
    setRequirementToDelete(requirementId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRequirement = () => {
    if (requirementToDelete) {
      setRequirements(requirements.filter(req => req.id !== requirementToDelete));
      toast({
        title: "Requirement Deleted",
        description: "The compliance requirement has been successfully removed.",
      });
      setDeleteDialogOpen(false);
      setRequirementToDelete(null);
    }
  };

  const handleSelectAll = () => {
    setRequirements(prev => prev.map(req => ({ ...req, selected: true })));
  };

  const handleDeselectAll = () => {
    setRequirements(prev => prev.map(req => ({ ...req, selected: false })));
  };

  const handleAddCustomRequirement = () => {
    if (customRequirement.title && customRequirement.authority) {
      const newRequirement: ComplianceRequirement = {
        id: `custom-${Date.now()}`,
        title: customRequirement.title,
        authority: customRequirement.authority,
        category: 'core',
        description: `Custom requirement: ${customRequirement.title}`,
        frequency: customRequirement.frequency,
        selected: true,
        autoDetected: false
      };
      
      setRequirements(prev => [...prev, newRequirement]);
      setCustomRequirement({
        title: "",
        authority: "",
        frequency: "monthly",
        documentation: null
      });
      setShowCustomForm(false);
    }
  };

  const handleContinue = () => {
    const selectedRequirements = requirements.filter(req => req.selected);
    navigate('/compliance/assignment', {
      state: {
        selectedEntities,
        selectedRequirements
      }
    });
  };

  const selectedCount = requirements.filter(req => req.selected).length;
  const coreRequirements = requirements.filter(req => req.category === 'core');
  const sectoralRequirements = requirements.filter(req => req.category === 'sectoral');
  const sizeBasedRequirements = requirements.filter(req => req.category === 'size-based');

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Compliance</h1>
            <p className="text-muted-foreground">ABC Corp → Checklist Generation</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-6 bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-slate-600 mr-3" />
              <div>
                <h3 className="font-semibold text-slate-900">COMPLIANCE CHECKLIST FOR: ABC CORPORATION LTD</h3>
                <p className="text-slate-700 text-sm mt-1">Step 2 of 3: Generate & Customize Compliance Requirements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Auto-Generated Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Bot className="w-5 h-5 mr-2" />
                AUTO-GENERATED
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">24 laws detected</span>
                </div>
                
                <div className="text-sm space-y-2">
                  <p><strong>Based on:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Entity type</li>
                    <li>• Location (Mumbai)</li>
                    <li>• Sector (IT)</li>
                    <li>• Size (50-100 emp)</li>
                    <li>• Turnover (₹10Cr)</li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm" className="h-9">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Settings className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Additions Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700">
                <Plus className="w-5 h-5 mr-2" />
                CUSTOM ADDITIONS
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showCustomForm ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Add specialized requirements</p>
                  <Button onClick={() => setShowCustomForm(true)} className="bg-slate-600 hover:bg-slate-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Requirement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Law/Regulation Title
                    </label>
                    <Input
                      value={customRequirement.title}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter law or regulation title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Authority/Department
                    </label>
                    <Input
                      value={customRequirement.authority}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, authority: e.target.value }))}
                      placeholder="Enter authority or department"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <Select value={customRequirement.frequency} onValueChange={(value) => 
                      setCustomRequirement(prev => ({ ...prev, frequency: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="biannual">Bi-Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documentation
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddCustomRequirement} size="sm" className="flex-1 h-9">
                      <Save className="mr-2 h-4 w-4" />
                      Save Custom Law
                    </Button>
                    <Button variant="outline" size="sm" className="h-9" onClick={() => setShowCustomForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detected Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                DETECTED COMPLIANCE REQUIREMENTS
              </CardTitle>
              <div className="text-sm text-gray-600">
                {selectedCount} of {requirements.length} selected
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Core Legal Requirements */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Core Legal Requirements (Auto-detected):</h3>
              <div className="space-y-3">
                {coreRequirements.map((req) => (
                  <div key={req.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={req.selected}
                      onCheckedChange={() => handleRequirementToggle(req.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{req.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Authority: {req.authority} | Frequency: {req.frequency}
                          </p>
                        </div>
                        {req.autoDetected && (
                          <Badge variant="secondary" className="ml-2">
                            Auto-detected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sectoral Requirements */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Sectoral Requirements (IT Sector):</h3>
              <div className="space-y-3">
                {sectoralRequirements.map((req) => (
                  <div key={req.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={req.selected}
                      onCheckedChange={() => handleRequirementToggle(req.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{req.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Authority: {req.authority} | Frequency: {req.frequency}
                          </p>
                        </div>
                        {req.autoDetected && (
                          <Badge variant="secondary" className="ml-2">
                            Auto-detected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size-based Requirements */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Size-based Requirements (50-100 employees):</h3>
              <div className="space-y-3">
                {sizeBasedRequirements.map((req) => (
                  <div key={req.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={req.selected}
                      onCheckedChange={() => handleRequirementToggle(req.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{req.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Authority: {req.authority} | Frequency: {req.frequency}
                          </p>
                        </div>
                        {req.autoDetected && (
                          <Badge variant="secondary" className="ml-2">
                            Auto-detected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleSelectAll}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Select All
                </Button>
                <Button variant="outline" onClick={handleDeselectAll}>
                  Deselect All
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Customize Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" size="sm" className="h-9" onClick={() => navigate('/compliance/setup')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entity Selection
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={selectedCount === 0}
            size="sm"
            className="h-9"
          >
            Continue to Assignment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceChecklistGeneration;

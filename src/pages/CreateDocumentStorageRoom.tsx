import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowLeft,
  ArrowRight,
  Bot,
  Settings,
  FolderOpen,
  Building,
  Users,
  Plus,
  Info,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Entity {
  id: string;
  name: string;
  type: string;
  status: string;
  cin: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  permissions: string[];
}

const CreateDocumentStorageRoom = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [templateType, setTemplateType] = useState<'system' | 'custom'>('system');
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    entityId: '',
    selectedGroup: '',
    systemDescription: '',
    moduleType: '',
    subModuleType: ''
  });

  // Mock data - replace with actual API calls
  const entities: Entity[] = [
    { id: "abc-corp", name: "ABC Corporation Ltd", type: "Corporate Debtor", status: "Active", cin: "L12345MH2020PLC" },
    { id: "xyz-ltd", name: "XYZ Industries Ltd", type: "Financial Creditor", status: "Active", cin: "L67890DL2019PLC" },
    { id: "pqr-inc", name: "PQR Services Inc", type: "Operational Creditor", status: "Active", cin: "L54321KA2021PLC" }
  ];

  const groups: Group[] = [
    { id: "audit-team", name: "Audit Team", description: "External audit firm access", memberCount: 5, permissions: ["read", "comment"] },
    { id: "legal-team", name: "Legal Team", description: "Legal advisors and counsels", memberCount: 3, permissions: ["read", "write", "comment"] },
    { id: "management", name: "Management Team", description: "Internal management access", memberCount: 8, permissions: ["read", "write", "delete", "admin"] }
  ];

  const moduleTypes = [
    { value: "cirp", label: "CIRP (Corporate Insolvency Resolution Process)" },
    { value: "liquidation", label: "Liquidation Process" },
    { value: "financial-analysis", label: "Financial Analysis" },
    { value: "legal-compliance", label: "Legal & Compliance" },
    { value: "asset-management", label: "Asset Management" },
    { value: "stakeholder-communication", label: "Stakeholder Communication" }
  ];

  const subModuleTypes = {
    "cirp": [
      { value: "eoi-management", label: "EOI Management" },
      { value: "pra-evaluation", label: "PRA Evaluation" },
      { value: "resolution-plans", label: "Resolution Plans" },
      { value: "coc-meetings", label: "COC Meetings" }
    ],
    "liquidation": [
      { value: "asset-valuation", label: "Asset Valuation" },
      { value: "asset-sale", label: "Asset Sale Process" },
      { value: "distribution", label: "Distribution to Creditors" }
    ],
    "financial-analysis": [
      { value: "cash-flow", label: "Cash Flow Analysis" },
      { value: "debt-analysis", label: "Debt Analysis" },
      { value: "viability-study", label: "Viability Study" }
    ]
  };

  const selectedEntity = entities.find(e => e.id === formData.entityId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateRoom = () => {
    if (templateType === 'system') {
      if (!formData.systemDescription || !formData.entityId || !formData.moduleType) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields for System Template.",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!formData.title || !formData.description || !formData.entityId) {
        toast({
          title: "Missing Information", 
          description: "Please fill in all required fields for Custom Template.",
          variant: "destructive"
        });
        return;
      }
    }

    // Simulate room creation
    toast({
      title: "Document Storage Room Created",
      description: `Successfully created ${templateType === 'system' ? 'AI-generated' : 'custom'} document storage room.`
    });

    // Navigate to the created room or back to VDR dashboard
    setTimeout(() => {
      navigate('/virtual-data-room');
    }, 2000);
  };

  const handleCreateGroup = () => {
    navigate('/data-room/create-group');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            1
          </div>
          <span className="ml-2 text-sm font-medium text-blue-600">Template Selection</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-medium">
            2
          </div>
          <span className="ml-2 text-sm text-gray-500">Configuration</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-medium">
            3
          </div>
          <span className="ml-2 text-sm text-gray-500">Review & Create</span>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/virtual-data-room')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to VDR
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create Document Storage Room</h1>
              <p className="text-muted-foreground">Set up a secure document storage and collaboration space</p>
            </div>
          </div>
        </div>

        {renderStepIndicator()}

        {/* Step 1: Template Selection */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Step 1: Template Selection
            </CardTitle>
            <p className="text-muted-foreground">
              Choose how you want to create your Document Storage Room structure
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Document Storage Room Structure Template</Label>
              
              {/* Template Toggle Buttons */}
              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
                <Button
                  variant={templateType === 'system' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTemplateType('system')}
                  className="flex items-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  AI-Generated
                </Button>
                <Button
                  variant={templateType === 'custom' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTemplateType('custom')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Custom-Generated
                </Button>
              </div>

              {/* System Template Card */}
              {templateType === 'system' && (
                <Card className="border-2 border-blue-500 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Bot className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-blue-900">
                          System Template (AI-Powered)
                        </h3>
                        <Badge variant="secondary" className="mt-1">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      </div>
                    </div>
                    <p className="text-blue-800 mb-6">
                      AI will automatically set up the file structure and folders based on your description, 
                      entity details, and selected module/sub-module activities.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Intelligent folder structure</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Module-based organization</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Best practice templates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Auto-categorization</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Custom Template Card */}
              {templateType === 'custom' && (
                <Card className="border-2 border-purple-500 bg-purple-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Settings className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-purple-900">
                          Custom Template (Manual Setup)
                        </h3>
                      </div>
                    </div>
                    <p className="text-purple-800 mb-6">
                      Manually create the Document Storage Room by providing specific details 
                      and customizing the structure according to your requirements.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-purple-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Full customization control</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Manual folder creation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Custom naming conventions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Flexible structure</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            {/* System Template Configuration */}
            {templateType === 'system' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">AI-Powered Template Configuration</h3>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Provide a description of your document storage needs, and our AI will create an optimized 
                    folder structure based on your entity type, selected module, and industry best practices.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="entity-select">Entity Name *</Label>
                    <Select value={formData.entityId} onValueChange={(value) => handleInputChange('entityId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an entity" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedEntity && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedEntity.type} • {selectedEntity.cin}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="module-type">Module Type *</Label>
                    <Select value={formData.moduleType} onValueChange={(value) => handleInputChange('moduleType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select module type" />
                      </SelectTrigger>
                      <SelectContent>
                        {moduleTypes.map((module) => (
                          <SelectItem key={module.value} value={module.value}>
                            {module.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.moduleType && subModuleTypes[formData.moduleType as keyof typeof subModuleTypes] && (
                  <div className="space-y-2">
                    <Label htmlFor="sub-module-type">Sub-Module Type</Label>
                    <Select value={formData.subModuleType} onValueChange={(value) => handleInputChange('subModuleType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-module (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {subModuleTypes[formData.moduleType as keyof typeof subModuleTypes].map((subModule) => (
                          <SelectItem key={subModule.value} value={subModule.value}>
                            {subModule.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="system-description">Description for AI Setup *</Label>
                  <Textarea
                    id="system-description"
                    placeholder="Describe your document storage needs, workflow requirements, and any specific organizational preferences. For example: 'Need a document room for CIRP process with separate folders for financial documents, legal filings, asset valuations, and stakeholder communications. Include audit trail and version control for all critical documents.'"
                    value={formData.systemDescription}
                    onChange={(e) => handleInputChange('systemDescription', e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    The more detailed your description, the better the AI can structure your document room.
                  </p>
                </div>
              </div>
            )}

            {/* Custom Template Configuration */}
            {templateType === 'custom' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Custom Template Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter document room title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entity-select-custom">Entity Name *</Label>
                    <Select value={formData.entityId} onValueChange={(value) => handleInputChange('entityId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an entity" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedEntity && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedEntity.type} • {selectedEntity.cin}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the document storage room purpose and contents"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* Group Assignment Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Assign Group (Optional)</h3>
                </div>
                <Button variant="outline" size="sm" onClick={handleCreateGroup}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Group
                </Button>
              </div>

              {groups.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>No groups found. Create a group to manage access permissions for this document room.</p>
                      <Button size="sm" onClick={handleCreateGroup}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Group
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="group-select">Select Group</Label>
                  <Select value={formData.selectedGroup} onValueChange={(value) => handleInputChange('selectedGroup', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a group (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{group.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {group.memberCount} members
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {formData.selectedGroup && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                      {(() => {
                        const selectedGroupData = groups.find(g => g.id === formData.selectedGroup);
                        return selectedGroupData ? (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{selectedGroupData.name}</span>
                              <Badge variant="outline">{selectedGroupData.memberCount} members</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{selectedGroupData.description}</p>
                            <div className="flex gap-1">
                              {selectedGroupData.permissions.map((permission) => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => navigate('/virtual-data-room')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              <Button onClick={handleCreateRoom} className="min-w-[200px]">
                {templateType === 'system' ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Create with AI
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Custom Room
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateDocumentStorageRoom;

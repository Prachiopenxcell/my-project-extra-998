import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  Building,
  Database,
  FileText,
  Target,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  Clock,
  X,
  Upload,
  Download,
  Bot,
  Save,
  Sparkles,
  Users,
  DollarSign,
  Gavel,
  Shield,
  Hash,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Info,
  AlertTriangle,
  BarChart3,
  CreditCard,
  UserCheck
} from 'lucide-react';

interface Entity {
  id: string;
  name: string;
  type: string;
  cin: string;
  status: string;
}

interface RecordCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'completed' | 'in-progress' | 'pending' | 'not-started';
  fields: RecordField[];
  progress: number;
}

interface RecordField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'file';
  required: boolean;
  value: string;
  options?: string[];
}

interface ProcessTemplate {
  id: string;
  name: string;
  description: string;
  categories: string[];
}

const CreateDataRecord = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [aiAutoSync, setAiAutoSync] = useState(false);
  const [recordData, setRecordData] = useState<Record<string, string | number>>({});
  const [activeCategory, setActiveCategory] = useState('');
  const [folderStructure, setFolderStructure] = useState<{ id: string; name: string; type: string; children?: { id: string; name: string; type: string }[] }[]>([]);
  
  // Mock Data
  const availableEntities: Entity[] = [
    {
      id: '1',
      name: 'ABC Corporation Ltd.',
      type: 'Private Limited Company',
      cin: 'U12345MH2020PTC123456',
      status: 'Active'
    },
    {
      id: '2',
      name: 'XYZ Financial Services',
      type: 'Financial Institution',
      cin: 'U65100DL2018PTC234567',
      status: 'Active'
    },
    {
      id: '3',
      name: 'DEF Manufacturing LLP',
      type: 'Limited Liability Partnership',
      cin: 'AAI-1234',
      status: 'Under CIRP'
    }
  ];
  
  const processTypes = [
    { id: 'cirp', name: 'CIRP', description: 'Corporate Insolvency Resolution Process' },
    { id: 'liquidation', name: 'Liquidation', description: 'Liquidation Process' },
    { id: 'due-diligence', name: 'Funding Due Diligence', description: 'Due Diligence for Funding' },
    { id: 'audit', name: 'Audit', description: 'Financial and Compliance Audit' },
    { id: 'litigation', name: 'Litigation', description: 'Legal Proceedings and Documentation' }
  ];
  
  const recordCategories: RecordCategory[] = [
    {
      id: 'basic-info',
      name: 'Basic Information',
      icon: Building,
      status: 'completed',
      progress: 100,
      fields: [
        { id: 'company-name', name: 'Company Name', type: 'text', required: true, value: selectedEntity?.name || '' },
        { id: 'cin', name: 'CIN Number', type: 'text', required: true, value: selectedEntity?.cin || '' },
        { id: 'registered-address', name: 'Registered Address', type: 'textarea', required: true, value: '' },
        { id: 'contact-email', name: 'Contact Email', type: 'text', required: true, value: '' },
        { id: 'contact-phone', name: 'Contact Phone', type: 'text', required: true, value: '' },
        { id: 'incorporation-date', name: 'Date of Incorporation', type: 'date', required: true, value: '' }
      ]
    },
    {
      id: 'board-directors',
      name: 'Board of Directors / Partners',
      icon: Users,
      status: 'in-progress',
      progress: 60,
      fields: [
        { id: 'director-count', name: 'Number of Directors', type: 'number', required: true, value: '' },
        { id: 'chairman-name', name: 'Chairman Name', type: 'text', required: true, value: '' },
        { id: 'managing-director', name: 'Managing Director', type: 'text', required: true, value: '' },
        { id: 'independent-directors', name: 'Independent Directors', type: 'number', required: false, value: '' }
      ]
    },
    {
      id: 'shareholding',
      name: 'Shareholding Patterns',
      icon: BarChart3,
      status: 'pending',
      progress: 25,
      fields: [
        { id: 'authorized-capital', name: 'Authorized Capital', type: 'number', required: true, value: '' },
        { id: 'paid-up-capital', name: 'Paid-up Capital', type: 'number', required: true, value: '' },
        { id: 'equity-shares', name: 'Equity Shares', type: 'number', required: true, value: '' },
        { id: 'preference-shares', name: 'Preference Shares', type: 'number', required: false, value: '' }
      ]
    },
    {
      id: 'creditors-claims',
      name: 'Creditors and Claims',
      icon: CreditCard,
      status: 'not-started',
      progress: 0,
      fields: [
        { id: 'financial-creditors', name: 'Financial Creditors Count', type: 'number', required: true, value: '' },
        { id: 'operational-creditors', name: 'Operational Creditors Count', type: 'number', required: true, value: '' },
        { id: 'total-debt', name: 'Total Debt Amount', type: 'number', required: true, value: '' },
        { id: 'secured-debt', name: 'Secured Debt', type: 'number', required: false, value: '' }
      ]
    },
    {
      id: 'legal-representatives',
      name: 'Legal Representatives',
      icon: Gavel,
      status: 'not-started',
      progress: 0,
      fields: [
        { id: 'legal-counsel', name: 'Legal Counsel Name', type: 'text', required: true, value: '' },
        { id: 'law-firm', name: 'Law Firm', type: 'text', required: true, value: '' },
        { id: 'counsel-contact', name: 'Counsel Contact', type: 'text', required: true, value: '' }
      ]
    },
    {
      id: 'authorized-signatories',
      name: 'Authorized Signatories',
      icon: UserCheck,
      status: 'not-started',
      progress: 0,
      fields: [
        { id: 'primary-signatory', name: 'Primary Signatory', type: 'text', required: true, value: '' },
        { id: 'secondary-signatory', name: 'Secondary Signatory', type: 'text', required: false, value: '' },
        { id: 'bank-signatories', name: 'Bank Account Signatories', type: 'textarea', required: true, value: '' }
      ]
    },
    {
      id: 'committee-members',
      name: 'Committee Members (COC/OC/Stakeholders)',
      icon: Users,
      status: 'not-started',
      progress: 0,
      fields: [
        { id: 'coc-members', name: 'COC Members Count', type: 'number', required: false, value: '' },
        { id: 'coc-chairman', name: 'COC Chairman', type: 'text', required: false, value: '' },
        { id: 'stakeholder-count', name: 'Stakeholder Count', type: 'number', required: false, value: '' }
      ]
    },
    {
      id: 'cirp-status',
      name: 'CIRP/Liquidation Status',
      icon: AlertTriangle,
      status: 'not-started',
      progress: 0,
      fields: [
        { id: 'cirp-commencement', name: 'CIRP Commencement Date', type: 'date', required: false, value: '' },
        { id: 'resolution-professional', name: 'Resolution Professional', type: 'text', required: false, value: '' },
        { id: 'moratorium-period', name: 'Moratorium Period', type: 'text', required: false, value: '' }
      ]
    },
    {
      id: 'related-parties',
      name: 'Related Party Information',
      icon: Building,
      status: 'not-started',
      progress: 0,
      fields: [
        { id: 'subsidiary-count', name: 'Number of Subsidiaries', type: 'number', required: false, value: '' },
        { id: 'associate-count', name: 'Number of Associates', type: 'number', required: false, value: '' },
        { id: 'joint-ventures', name: 'Joint Ventures', type: 'number', required: false, value: '' }
      ]
    },
    {
      id: 'regulatory-ids',
      name: 'PAN/GST and Regulatory IDs',
      icon: Hash,
      status: 'not-started',
      progress: 0,
      fields: [
        { id: 'pan-number', name: 'PAN Number', type: 'text', required: true, value: '' },
        { id: 'gst-number', name: 'GST Number', type: 'text', required: true, value: '' },
        { id: 'tan-number', name: 'TAN Number', type: 'text', required: false, value: '' },
        { id: 'other-registrations', name: 'Other Regulatory Registrations', type: 'textarea', required: false, value: '' }
      ]
    }
  ];
  
  const processTemplates: ProcessTemplate[] = [
    {
      id: 'cirp-template',
      name: 'CIRP Documentation Template',
      description: 'Complete template for Corporate Insolvency Resolution Process',
      categories: ['basic-info', 'board-directors', 'creditors-claims', 'committee-members', 'cirp-status', 'regulatory-ids']
    },
    {
      id: 'liquidation-template',
      name: 'Liquidation Process Template',
      description: 'Template for liquidation proceedings and asset management',
      categories: ['basic-info', 'creditors-claims', 'legal-representatives', 'regulatory-ids']
    },
    {
      id: 'due-diligence-template',
      name: 'Due Diligence Template',
      description: 'Comprehensive due diligence documentation template',
      categories: ['basic-info', 'board-directors', 'shareholding', 'creditors-claims', 'related-parties', 'regulatory-ids']
    }
  ];

  // Helper Functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "not-started":
        return <X className="h-4 w-4 text-gray-400" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "in-progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "not-started":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Event Handlers
  const handleEntitySelect = (entityId: string) => {
    const entity = availableEntities.find(e => e.id === entityId);
    setSelectedEntity(entity || null);
    if (entity) {
      toast({
        title: "Entity Selected",
        description: `Selected ${entity.name} for data record creation.`,
      });
    }
  };

  const handleProcessSelect = (processId: string) => {
    setSelectedProcess(processId);
    const process = processTypes.find(p => p.id === processId);
    if (process) {
      toast({
        title: "Process Selected",
        description: `Selected ${process.name} for record organization.`,
      });
    }
  };

  const handleFieldUpdate = (categoryId: string, fieldId: string, value: string) => {
    setRecordData(prev => ({
      ...prev,
      [`${categoryId}-${fieldId}`]: value
    }));
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = processTemplates.find(t => t.id === templateId);
    if (template) {
      // Auto-populate relevant categories based on template
      template.categories.forEach(categoryId => {
        const category = recordCategories.find(c => c.id === categoryId);
        if (category) {
          category.fields.forEach(field => {
            if (field.required && !recordData[`${categoryId}-${field.id}`]) {
              // Set default values or trigger AI auto-fill
              handleFieldUpdate(categoryId, field.id, field.value);
            }
          });
        }
      });
      
      toast({
        title: "Template Applied",
        description: `Applied ${template.name} with recommended field structure.`,
      });
    }
  };

  const handleAIAutoFill = () => {
    if (!selectedEntity) {
      toast({
        title: "Entity Required",
        description: "Please select an entity before using AI auto-fill.",
        variant: "destructive"
      });
      return;
    }

    setAiAutoSync(true);
    // Simulate AI processing
    setTimeout(() => {
      // Auto-populate fields with AI-generated data
      recordCategories.forEach(category => {
        category.fields.forEach(field => {
          if (field.required && !recordData[`${category.id}-${field.id}`]) {
            let aiValue = '';
            // Simulate AI-generated values based on field type
            switch (field.id) {
              case 'company-name':
                aiValue = selectedEntity?.name || '';
                break;
              case 'cin':
                aiValue = selectedEntity?.cin || '';
                break;
              case 'registered-address':
                aiValue = '123 Business District, Mumbai, Maharashtra 400001';
                break;
              case 'contact-email':
                aiValue = 'info@' + (selectedEntity?.name.toLowerCase().replace(/\s+/g, '') || 'company') + '.com';
                break;
              case 'contact-phone':
                aiValue = '+91 22 1234 5678';
                break;
              default:
                if (field.type === 'number') aiValue = '0';
                else if (field.type === 'date') aiValue = new Date().toISOString().split('T')[0];
                else aiValue = 'Auto-filled by AI';
            }
            handleFieldUpdate(category.id, field.id, aiValue);
          }
        });
      });
      
      setAiAutoSync(false);
      toast({
        title: "AI Auto-Fill Complete",
        description: "Successfully populated fields using AI and cross-module data.",
      });
    }, 2000);
  };

  const handleSaveAndContinue = () => {
    if (!selectedEntity || !selectedProcess) {
      toast({
        title: "Missing Information",
        description: "Please select both entity and process before saving.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Records Saved",
      description: "Data records have been saved successfully. Redirecting to records list.",
    });
    
    setTimeout(() => {
      navigate('/data-room/data-records');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/data-room/data-records')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Data Records
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create Data Records</h1>
              <p className="text-muted-foreground">
                Set up comprehensive data records for cross-module synchronization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              Step {currentStep} of 3
            </Badge>
          </div>
        </div>

        {/* Step 1: Entity Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  STEP 1: ENTITY SELECTION
                </CardTitle>
                <CardDescription>
                  Select an entity from the Entity Master list to create data records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Select Entity</Label>
                  <Select value={selectedEntity?.id || ''} onValueChange={handleEntitySelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose an entity from Entity Master list" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEntities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          <div className="flex items-center gap-3">
                            <Building className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{entity.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {entity.type} • CIN: {entity.cin} • Status: {entity.status}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEntity && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <div className="space-y-2">
                        <div className="font-semibold">Selected Entity: {selectedEntity.name}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Type: {selectedEntity.type}</div>
                          <div>CIN: {selectedEntity.cin}</div>
                          <div>Status: {selectedEntity.status}</div>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentStep(2)} 
                    disabled={!selectedEntity}
                  >
                    Continue to Process Selection
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Process Selection & Record Structure */}
        {currentStep === 2 && selectedEntity && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  STEP 2: PROCESS SELECTION & RECORD STRUCTURE
                </CardTitle>
                <CardDescription>
                  Choose the process type and review the associated record structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Select Process Type</Label>
                  <Select value={selectedProcess} onValueChange={handleProcessSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose process for record organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {processTypes.map((process) => (
                        <SelectItem key={process.id} value={process.id}>
                          <div>
                            <div className="font-medium">{process.name}</div>
                            <div className="text-sm text-muted-foreground">{process.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProcess && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Record Structure Overview</h3>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="ai-sync" 
                          checked={aiAutoSync} 
                          onCheckedChange={setAiAutoSync}
                        />
                        <Label htmlFor="ai-sync" className="text-sm">
                          Enable AI Auto-Sync
                        </Label>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      {recordCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <Card key={category.id} className={`border ${getStatusColor(category.status)}`}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <IconComponent className="h-5 w-5" />
                                  <h4 className="font-medium">{category.name}</h4>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(category.status)}
                                  <Badge variant="outline" className={getStatusColor(category.status)}>
                                    {category.status.replace('-', ' ').toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                              <Progress value={category.progress} className="mb-3" />
                              <div className="text-sm text-muted-foreground">
                                {category.fields.length} fields • {category.progress}% complete
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Entity Selection
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)} 
                    disabled={!selectedProcess}
                  >
                    Continue to Data Entry
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Data Entry & Template Application */}
        {currentStep === 3 && selectedEntity && selectedProcess && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  STEP 3: DATA ENTRY & TEMPLATE APPLICATION
                </CardTitle>
                <CardDescription>
                  Enter data manually or use AI auto-fill and templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Auto-Fill and Template Actions */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                  <Button 
                    onClick={handleAIAutoFill} 
                    disabled={aiAutoSync}
                    className="flex items-center gap-2"
                  >
                    {aiAutoSync ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {aiAutoSync ? 'AI Processing...' : 'AI Auto-Fill'}
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Template
                  </Button>
                </div>

                {/* Template Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="h-4 w-4" />
                      Recommended Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {processTemplates
                        .filter(template => template.id.includes(selectedProcess))
                        .map((template) => (
                          <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-muted-foreground">{template.description}</div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApplyTemplate(template.id)}
                            >
                              Apply Template
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Data Entry Tabs */}
                <Tabs value={activeCategory || recordCategories[0]?.id} onValueChange={setActiveCategory}>
                  <TabsList className="grid w-full grid-cols-5">
                    {recordCategories.slice(0, 5).map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                          <IconComponent className="h-3 w-3" />
                          <span className="hidden sm:inline">{category.name.split(' ')[0]}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  
                  {recordCategories.slice(0, 5).map((category) => (
                    <TabsContent key={category.id} value={category.id}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <category.icon className="h-5 w-5" />
                            {category.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2">
                            {category.fields.map((field) => (
                              <div key={field.id}>
                                <Label className="text-sm font-medium mb-2 block">
                                  {field.name}
                                  {field.required && <span className="text-red-500 ml-1">*</span>}
                                </Label>
                                {field.type === 'textarea' ? (
                                  <Textarea
                                    value={recordData[`${category.id}-${field.id}`] || field.value}
                                    onChange={(e) => handleFieldUpdate(category.id, field.id, e.target.value)}
                                    placeholder={`Enter ${field.name.toLowerCase()}`}
                                  />
                                ) : field.type === 'select' ? (
                                  <Select 
                                    value={recordData[`${category.id}-${field.id}`] || field.value}
                                    onValueChange={(value) => handleFieldUpdate(category.id, field.id, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options?.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    type={field.type}
                                    value={recordData[`${category.id}-${field.id}`] || field.value}
                                    onChange={(e) => handleFieldUpdate(category.id, field.id, e.target.value)}
                                    placeholder={`Enter ${field.name.toLowerCase()}`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Process Selection
                  </Button>
                  <Button onClick={handleSaveAndContinue}>
                    <Save className="h-4 w-4 mr-2" />
                    Save & Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateDataRecord;

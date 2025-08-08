import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Eye, 
  Download, 
  Trash2, 
  Plus, 
  RefreshCw, 
  FolderOpen,
  Save,
  ArrowRight,
  Paperclip,
  File,
  FileCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";

interface DocumentItem {
  id: string;
  label: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  files: UploadedFile[];
  required: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'uploading' | 'completed' | 'error';
}

interface VDRDocument {
  id: string;
  name: string;
  category: string;
  size: number;
  selected: boolean;
}

const LitigationDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [currentStep] = useState(3); // Step 3: Documents
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: "doc-001",
      label: "Board Resolution for Filing",
      category: "legal-documents",
      priority: "high",
      files: [
        {
          id: "file-001",
          name: "Board_Resolution_Jan2025.pdf",
          size: 1200000,
          type: "application/pdf",
          uploadedAt: "2025-01-20T10:30:00Z",
          status: "completed"
        }
      ],
      required: true
    },
    {
      id: "doc-002",
      label: "Financial Statements & Balance Sheet",
      category: "financial-records",
      priority: "high",
      files: [
        {
          id: "file-002",
          name: "Financial_Statements_FY24.pdf",
          size: 3400000,
          type: "application/pdf",
          uploadedAt: "2025-01-20T10:35:00Z",
          status: "completed"
        },
        {
          id: "file-003",
          name: "Audited_Balance_Sheet_FY24.pdf",
          size: 2100000,
          type: "application/pdf",
          uploadedAt: "2025-01-20T10:40:00Z",
          status: "completed"
        }
      ],
      required: true
    },
    {
      id: "doc-003",
      label: "Demand Notice & Acknowledgment",
      category: "correspondence",
      priority: "critical",
      files: [
        {
          id: "file-004",
          name: "Demand_Notice_Dec2024.pdf",
          size: 845000,
          type: "application/pdf",
          uploadedAt: "2025-01-20T10:45:00Z",
          status: "completed"
        },
        {
          id: "file-005",
          name: "Postal_Receipt_Acknowledgment.pdf",
          size: 234000,
          type: "application/pdf",
          uploadedAt: "2025-01-20T10:50:00Z",
          status: "completed"
        }
      ],
      required: true
    }
  ]);

  const [newDocument, setNewDocument] = useState({
    label: "",
    category: "",
    priority: "medium" as const
  });

  const [vdrDocuments] = useState<VDRDocument[]>([
    { id: "vdr-001", name: "Certificate of Incorporation", category: "Corporate Documents", size: 450000, selected: true },
    { id: "vdr-002", name: "Memorandum of Association", category: "Corporate Documents", size: 680000, selected: true },
    { id: "vdr-003", name: "Articles of Association", category: "Corporate Documents", size: 520000, selected: false },
    { id: "vdr-004", name: "Annual Return FY24", category: "Financial Records", size: 890000, selected: true },
    { id: "vdr-005", name: "Tax Audit Report", category: "Financial Records", size: 1200000, selected: false }
  ]);

  const [selectedVDRCategories, setSelectedVDRCategories] = useState({
    "corporate-documents": true,
    "financial-records": true,
    "legal-correspondence": true,
    "compliance-certificates": false
  });

  // Progress steps
  const steps = [
    { id: 1, title: "Stage Selection", completed: true },
    { id: 2, title: "Details", completed: true },
    { id: 3, title: "Documents", completed: false, active: true },
    { id: 4, title: "Review", completed: false }
  ];

  // Document requirements checklist
  const requiredDocuments = [
    { name: "Board Resolution", status: "completed" },
    { name: "Financial Statements", status: "completed" },
    { name: "Demand Notice", status: "completed" },
    { name: "Acknowledgment of Service", status: "completed" },
    { name: "Power of Attorney", status: "completed" },
    { name: "Certificate of Incorporation", status: "missing" },
    { name: "List of Creditors", status: "missing" },
    { name: "Valuation Report", status: "missing" }
  ];

  const completedCount = requiredDocuments.filter(doc => doc.status === "completed").length;
  const completionPercentage = (completedCount / requiredDocuments.length) * 100;

  // File upload handlers
  const onDrop = useCallback((acceptedFiles: File[], documentId: string) => {
    acceptedFiles.forEach(file => {
      const newFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: "uploading"
      };

      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, files: [...doc.files, newFile] }
          : doc
      ));

      // Simulate upload completion
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                files: doc.files.map(f => 
                  f.id === newFile.id ? { ...f, status: "completed" } : f
                )
              }
            : doc
        ));
      }, 2000);
    });
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (documentId: string, fileId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, files: doc.files.filter(f => f.id !== fileId) }
        : doc
    ));
  };

  const addNewDocument = () => {
    if (!newDocument.label || !newDocument.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      label: newDocument.label,
      category: newDocument.category,
      priority: newDocument.priority,
      files: [],
      required: false
    };

    setDocuments(prev => [...prev, newDoc]);
    setNewDocument({ label: "", category: "", priority: "medium" });
    
    toast({
      title: "Document Added",
      description: "New document category has been added.",
    });
  };

  const handleVDRImport = () => {
    const selectedDocs = vdrDocuments.filter(doc => doc.selected);
    toast({
      title: "Documents Imported",
      description: `${selectedDocs.length} documents imported from VDR.`,
    });
  };

  const DocumentUploadZone = ({ documentId }: { documentId: string }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, documentId),
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
      },
      maxSize: 25 * 1024 * 1024 // 25MB
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive 
            ? "Drop files here..." 
            : "Drag & drop files here or Browse Files"
          }
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Accepted formats: PDF, DOC, DOCX (Max: 25MB)
        </p>
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'missing': return <X className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/litigation/create')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Application Details
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Case: PRE-2025-001
          </div>
        </div>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Document Upload & Management</h2>
            </div>
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.completed ? 'bg-green-500 border-green-500 text-white' :
                    step.active ? 'bg-blue-500 border-blue-500 text-white' :
                    'border-gray-300 text-gray-400'
                  }`}>
                    {step.completed ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step.active ? 'font-medium text-blue-600' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-0.5 w-12 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Upload Options */}
        <Card>
          <CardHeader>
            <CardTitle>Document Upload Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Manual Document Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Upload Documents Required for Filing
              </h3>
              
              {documents.map((document) => (
                <Card key={document.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Label className="font-medium">{document.label}</Label>
                          {document.required && <span className="text-red-500">*</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline">{document.category}</Badge>
                          <Badge className={getPriorityColor(document.priority)}>
                            {document.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {document.files.length === 0 ? (
                      <DocumentUploadZone documentId={document.id} />
                    ) : (
                      <div className="space-y-2">
                        {document.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileCheck className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({formatFileSize(file.size)})
                              </span>
                              {file.status === "uploading" && (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                  <span className="text-xs text-blue-600">Uploading...</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeFile(document.id, file.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <DocumentUploadZone documentId={document.id} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Add New Document */}
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="doc-label">Document Label</Label>
                      <Input
                        id="doc-label"
                        placeholder="Enter document name"
                        value={newDocument.label}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, label: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-category">Category</Label>
                      <Select value={newDocument.category} onValueChange={(value) => setNewDocument(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="legal-documents">Legal Documents</SelectItem>
                          <SelectItem value="financial-records">Financial Records</SelectItem>
                          <SelectItem value="correspondence">Correspondence</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-priority">Priority</Label>
                      <Select value={newDocument.priority} onValueChange={(value: any) => setNewDocument(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addNewDocument} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Auto-Upload from VDR */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Auto-Import Documents from Virtual Data Room
              </h3>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Entity: Acme Corporation Ltd</p>
                      <p className="text-sm text-muted-foreground">Available Documents: [23 documents found]</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="corporate-docs"
                        checked={selectedVDRCategories["corporate-documents"]}
                        onCheckedChange={(checked) => setSelectedVDRCategories(prev => ({ ...prev, "corporate-documents": checked as boolean }))}
                      />
                      <Label htmlFor="corporate-docs">Corporate Documents (5)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="financial-records"
                        checked={selectedVDRCategories["financial-records"]}
                        onCheckedChange={(checked) => setSelectedVDRCategories(prev => ({ ...prev, "financial-records": checked as boolean }))}
                      />
                      <Label htmlFor="financial-records">Financial Records (8)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="legal-correspondence"
                        checked={selectedVDRCategories["legal-correspondence"]}
                        onCheckedChange={(checked) => setSelectedVDRCategories(prev => ({ ...prev, "legal-correspondence": checked as boolean }))}
                      />
                      <Label htmlFor="legal-correspondence">Legal Correspondence (4)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="compliance-certs"
                        checked={selectedVDRCategories["compliance-certificates"]}
                        onCheckedChange={(checked) => setSelectedVDRCategories(prev => ({ ...prev, "compliance-certificates": checked as boolean }))}
                      />
                      <Label htmlFor="compliance-certs">Compliance Certificates (6)</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleVDRImport} className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Import Selected Documents
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview VDR Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Document Checklist */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Checklist
              </h3>
              
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Required Documents Status:</h4>
                    <div className="text-sm text-muted-foreground">
                      Completion: {completedCount}/{requiredDocuments.length} Required Documents ({Math.round(completionPercentage)}%)
                    </div>
                  </div>
                  
                  <Progress value={completionPercentage} className="w-full" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    {requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        <span className={`text-sm ${
                          doc.status === 'completed' ? 'text-green-600' : 
                          doc.status === 'missing' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {doc.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {completedCount < requiredDocuments.length && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        {requiredDocuments.length - completedCount} documents still needed for filing
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Document Organization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Uploaded Documents ({documents.reduce((acc, doc) => acc + doc.files.length, 0)} files, {formatFileSize(documents.reduce((acc, doc) => acc + doc.files.reduce((fileAcc, file) => fileAcc + file.size, 0), 0))} total)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.flatMap(doc => doc.files).map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Generate Document Index
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Batch Process
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Share with Lawyer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/litigation/create')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={() => navigate('/litigation/review-submit')}>
                Review & Submit
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LitigationDocuments;

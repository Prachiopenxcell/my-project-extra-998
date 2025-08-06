import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Plus, Upload, FileCheck, AlertCircle, CheckCircle2, FileText, Building, Calendar } from "lucide-react";

import { StepComponentProps, BankDocument } from "./types";

export const BankDocumentsStep = ({ formData, updateFormData }: StepComponentProps): JSX.Element => {
  // Document types
  const documentTypes = [
    "Bank Statement",
    "Loan Agreement",
    "Sanction Letter",
    "Security Document",
    "Facility Agreement",
    "Mortgage Deed",
    "Charge Document",
    "Investment Certificate",
    "Fixed Deposit Receipt",
    "Share Certificate",
    "Debenture Certificate",
    "Other"
  ];
  
  // Status options
  const statusOptions = [
    "Verified",
    "Pending",
    "Rejected",
    "Expired",
    "Active"
  ];
  
  // State for bank documents
  const [bankDocuments, setBankDocuments] = useState<BankDocument[]>(
    formData.bankDocuments || []
  );
  
  // State for investment summary
  const [investmentSummary, setInvestmentSummary] = useState<string>(
    formData.investmentSummary || ""
  );
  
  // State for new document form
  const [newDocument, setNewDocument] = useState<Partial<BankDocument>>({
    bankName: "",
    documentType: "",
    documentDate: new Date().toISOString().split('T')[0],
    status: "Pending"
  });
  
  // Update form data when bank documents change
  useEffect(() => {
    updateFormData({ bankDocuments });
  }, [bankDocuments, updateFormData]);
  
  // Update form data when investment summary changes
  useEffect(() => {
    updateFormData({ investmentSummary });
  }, [investmentSummary, updateFormData]);
  
  // Handle adding a new bank document
  const handleAddDocument = () => {
    if (!newDocument.bankName || !newDocument.documentType || !newDocument.documentDate) {
      alert("Please fill in all required fields (Bank Name, Document Type, Document Date).");
      return;
    }
    
    const newId = `bank-doc-${Date.now()}`;
    const document: BankDocument = {
      id: newId,
      bankName: newDocument.bankName || "",
      documentType: newDocument.documentType || "",
      documentDate: newDocument.documentDate || new Date().toISOString().split('T')[0],
      fileName: newDocument.fileName || "No file selected",
      status: "Pending",
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedDocuments = [...bankDocuments, document];
    setBankDocuments(updatedDocuments);
    updateFormData({ bankDocuments: updatedDocuments });
    
    // Reset new document form
    setNewDocument({
      bankName: "",
      documentType: "",
      documentDate: new Date().toISOString().split('T')[0],
      status: "Pending"
    });
  };
  
  // Handle removing a bank document
  const handleRemoveDocument = (documentId: string) => {
    const updatedDocuments = bankDocuments.filter(doc => doc.id !== documentId);
    setBankDocuments(updatedDocuments);
    updateFormData({ bankDocuments: updatedDocuments });
  };
  
  // Handle updating a document's status
  const handleUpdateDocumentStatus = (documentId: string, status: string) => {
    const updatedDocuments = bankDocuments.map(doc => {
      if (doc.id === documentId) {
        return { ...doc, status };
      }
      return doc;
    });
    
    setBankDocuments(updatedDocuments);
    updateFormData({ bankDocuments: updatedDocuments });
  };
  
  // Handle updating a document's remarks
  const handleUpdateDocumentRemarks = (documentId: string, remarks: string) => {
    const updatedDocuments = bankDocuments.map(doc => {
      if (doc.id === documentId) {
        return { ...doc, remarks };
      }
      return doc;
    });
    
    setBankDocuments(updatedDocuments);
    updateFormData({ bankDocuments: updatedDocuments });
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge>;
      case "Rejected":
        return <Badge className="bg-red-500"><X className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "Expired":
        return <Badge className="bg-gray-500"><AlertCircle className="h-3 w-3 mr-1" /> Expired</Badge>;
      case "Active":
        return <Badge className="bg-blue-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Active</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Bank Documents Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Bank & Investment Documents</h3>
        
        {/* Add New Document Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Add New Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank/Institution Name <span className="text-red-500">*</span></Label>
                <Input
                  id="bankName"
                  value={newDocument.bankName || ""}
                  onChange={(e) => setNewDocument({...newDocument, bankName: e.target.value})}
                  placeholder="Enter bank or institution name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type <span className="text-red-500">*</span></Label>
                <Select 
                  value={newDocument.documentType} 
                  onValueChange={(value) => setNewDocument({...newDocument, documentType: value})}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentDate">Document Date <span className="text-red-500">*</span></Label>
                <Input
                  id="documentDate"
                  type="date"
                  value={newDocument.documentDate || ""}
                  onChange={(e) => setNewDocument({...newDocument, documentDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Upload Document</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fileUpload"
                    type="file"
                    className="flex-1"
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name || "No file selected";
                      setNewDocument({...newDocument, fileName});
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="documentRemarks">Remarks</Label>
                <Textarea
                  id="documentRemarks"
                  value={newDocument.remarks || ""}
                  onChange={(e) => setNewDocument({...newDocument, remarks: e.target.value})}
                  placeholder="Enter any remarks about this document"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                type="button" 
                onClick={handleAddDocument}
              >
                <Upload className="h-4 w-4 mr-1" /> Upload Document
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Documents Table */}
        {bankDocuments.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableCaption>List of bank & investment documents</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank/Institution</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Document Date</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {doc.bankName}
                      </div>
                    </TableCell>
                    <TableCell>{doc.documentType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {doc.documentDate}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {doc.fileName && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs truncate">{doc.fileName}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>
                      <Input
                        value={doc.remarks || ""}
                        onChange={(e) => handleUpdateDocumentRemarks(doc.id, e.target.value)}
                        placeholder="Add remarks"
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Select 
                          value={doc.status} 
                          onValueChange={(value) => handleUpdateDocumentStatus(doc.id, value)}
                        >
                          <SelectTrigger className="h-8 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveDocument(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-4 border rounded-md text-muted-foreground">
            No bank or investment documents added yet. Use the form above to add documents.
          </div>
        )}
      </div>
      
      {/* Investment Summary Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Investment Summary</h3>
        
        <div className="space-y-2">
          <Label htmlFor="investmentSummary">Investment Summary</Label>
          <Textarea
            id="investmentSummary"
            value={investmentSummary}
            onChange={(e) => setInvestmentSummary(e.target.value)}
            placeholder="Provide a summary of the entity's investments, loans, and financial arrangements"
            className="min-h-[120px]"
          />
        </div>
      </div>
      
      {/* Information Section */}
      <div className="space-y-4 pt-4 border-t">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All bank and investment documents should be kept up to date. 
            Regular updates to these documents help maintain accurate financial records and ensure compliance with regulatory requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

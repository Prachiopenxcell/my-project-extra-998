import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Plus, Upload, FileCheck, AlertCircle, CheckCircle2 } from "lucide-react";

import { StepComponentProps, FinancialRecord } from "./types";

export const RecordsFinancialStep = ({ formData, updateFormData }: StepComponentProps): JSX.Element => {
  // Financial years (typically last 3 years)
  const currentYear = new Date().getFullYear();
  const defaultFinancialYears = [
    `${currentYear-3}-${currentYear-2}`,
    `${currentYear-2}-${currentYear-1}`,
    `${currentYear-1}-${currentYear}`
  ];
  
  // Document types
  const documentTypes = [
    "Balance Sheet",
    "Profit & Loss Statement",
    "Cash Flow Statement",
    "Annual Report",
    "Audit Report",
    "Income Tax Return",
    "GST Returns",
    "Bank Statements",
    "Other"
  ];
  
  // State for financial records
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(
    formData.financialRecords || []
  );
  
  // State for financial years
  const [financialYears, setFinancialYears] = useState<string[]>(
    formData.financialYears || defaultFinancialYears
  );
  
  // State for audit status and remarks
  const [auditStatus, setAuditStatus] = useState<string>(
    formData.auditStatus || "Completed"
  );
  
  const [auditRemarks, setAuditRemarks] = useState<string>(
    formData.auditRemarks || ""
  );
  
  // State for tax filing status and remarks
  const [taxFilingStatus, setTaxFilingStatus] = useState<string>(
    formData.taxFilingStatus || "Filed"
  );
  
  const [taxRemarks, setTaxRemarks] = useState<string>(
    formData.taxRemarks || ""
  );
  
  // State for new record form
  const [newRecord, setNewRecord] = useState<Partial<FinancialRecord>>({
    documentType: "",
    financialYear: financialYears[0],
    status: "Pending"
  });
  
  // Update form data when financial records change
  useEffect(() => {
    updateFormData({ financialRecords });
  }, [financialRecords, updateFormData]);
  
  // Update form data when financial years change
  useEffect(() => {
    updateFormData({ financialYears });
  }, [financialYears, updateFormData]);
  
  // Update form data when audit status/remarks change
  useEffect(() => {
    updateFormData({ auditStatus, auditRemarks });
  }, [auditStatus, auditRemarks, updateFormData]);
  
  // Update form data when tax filing status/remarks change
  useEffect(() => {
    updateFormData({ taxFilingStatus, taxRemarks });
  }, [taxFilingStatus, taxRemarks, updateFormData]);
  
  // Handle adding a new financial year
  const handleAddFinancialYear = () => {
    const lastYear = financialYears[financialYears.length - 1];
    const [_, endYear] = lastYear.split('-').map(Number);
    const newYear = `${endYear}-${endYear + 1}`;
    
    const updatedYears = [...financialYears, newYear];
    setFinancialYears(updatedYears);
    updateFormData({ financialYears: updatedYears });
  };
  
  // Handle removing a financial year
  const handleRemoveFinancialYear = (yearToRemove: string) => {
    // Don't remove if there are records using this year
    if (financialRecords.some(record => record.financialYear === yearToRemove)) {
      alert("Cannot remove a financial year that has associated records.");
      return;
    }
    
    const updatedYears = financialYears.filter(year => year !== yearToRemove);
    setFinancialYears(updatedYears);
    updateFormData({ financialYears: updatedYears });
  };
  
  // Handle adding a new financial record
  const handleAddRecord = () => {
    if (!newRecord.documentType || !newRecord.financialYear) {
      alert("Please select a document type and financial year.");
      return;
    }
    
    const newId = `record-${Date.now()}`;
    const record: FinancialRecord = {
      id: newId,
      documentType: newRecord.documentType || "",
      financialYear: newRecord.financialYear || financialYears[0],
      fileName: newRecord.fileName || "No file selected",
      status: "Pending",
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedRecords = [...financialRecords, record];
    setFinancialRecords(updatedRecords);
    updateFormData({ financialRecords: updatedRecords });
    
    // Reset new record form
    setNewRecord({
      documentType: "",
      financialYear: financialYears[0],
      status: "Pending"
    });
  };
  
  // Handle removing a financial record
  const handleRemoveRecord = (recordId: string) => {
    const updatedRecords = financialRecords.filter(record => record.id !== recordId);
    setFinancialRecords(updatedRecords);
    updateFormData({ financialRecords: updatedRecords });
  };
  
  // Handle updating a record's status
  const handleUpdateRecordStatus = (recordId: string, status: string) => {
    const updatedRecords = financialRecords.map(record => {
      if (record.id === recordId) {
        return { ...record, status };
      }
      return record;
    });
    
    setFinancialRecords(updatedRecords);
    updateFormData({ financialRecords: updatedRecords });
  };
  
  // Handle updating a record's remarks
  const handleUpdateRecordRemarks = (recordId: string, remarks: string) => {
    const updatedRecords = financialRecords.map(record => {
      if (record.id === recordId) {
        return { ...record, remarks };
      }
      return record;
    });
    
    setFinancialRecords(updatedRecords);
    updateFormData({ financialRecords: updatedRecords });
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
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Financial Years Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Financial Years</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAddFinancialYear}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Year
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {financialYears.map(year => (
            <Badge key={year} className="flex items-center gap-1 px-3 py-1">
              {year}
              {financialYears.length > 1 && (
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveFinancialYear(year)}
                />
              )}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Financial Records Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Financial Records</h3>
        
        {/* Add New Record Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Add New Financial Record</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select 
                  value={newRecord.documentType} 
                  onValueChange={(value) => setNewRecord({...newRecord, documentType: value})}
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
                <Label htmlFor="financialYear">Financial Year</Label>
                <Select 
                  value={newRecord.financialYear} 
                  onValueChange={(value) => setNewRecord({...newRecord, financialYear: value})}
                >
                  <SelectTrigger id="financialYear">
                    <SelectValue placeholder="Select financial year" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fileUpload">Upload Document</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fileUpload"
                    type="file"
                    className="flex-1"
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name || "No file selected";
                      setNewRecord({...newRecord, fileName});
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddRecord}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Records Table */}
        {financialRecords.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableCaption>List of financial records</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Financial Year</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.documentType}</TableCell>
                    <TableCell>{record.financialYear}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{record.fileName}</TableCell>
                    <TableCell>{record.uploadDate}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <Input
                        value={record.remarks || ""}
                        onChange={(e) => handleUpdateRecordRemarks(record.id, e.target.value)}
                        placeholder="Add remarks"
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Select 
                          value={record.status} 
                          onValueChange={(value) => handleUpdateRecordStatus(record.id, value)}
                        >
                          <SelectTrigger className="h-8 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Verified">Verified</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveRecord(record.id)}
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
            No financial records added yet. Use the form above to add records.
          </div>
        )}
      </div>
      
      {/* Audit Status Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Audit Status</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Audit Status</Label>
            <RadioGroup
              value={auditStatus}
              onValueChange={setAuditStatus}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Completed" id="audit-completed" />
                <Label htmlFor="audit-completed">Completed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="In Progress" id="audit-in-progress" />
                <Label htmlFor="audit-in-progress">In Progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Not Started" id="audit-not-started" />
                <Label htmlFor="audit-not-started">Not Started</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Not Required" id="audit-not-required" />
                <Label htmlFor="audit-not-required">Not Required</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="auditRemarks">Audit Remarks</Label>
            <Textarea
              id="auditRemarks"
              value={auditRemarks}
              onChange={(e) => setAuditRemarks(e.target.value)}
              placeholder="Enter any remarks about the audit status"
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
      
      {/* Tax Filing Status Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Tax Filing Status</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tax Filing Status</Label>
            <RadioGroup
              value={taxFilingStatus}
              onValueChange={setTaxFilingStatus}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Filed" id="tax-filed" />
                <Label htmlFor="tax-filed">Filed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pending" id="tax-pending" />
                <Label htmlFor="tax-pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Not Required" id="tax-not-required" />
                <Label htmlFor="tax-not-required">Not Required</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Delayed" id="tax-delayed" />
                <Label htmlFor="tax-delayed">Delayed</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxRemarks">Tax Filing Remarks</Label>
            <Textarea
              id="taxRemarks"
              value={taxRemarks}
              onChange={(e) => setTaxRemarks(e.target.value)}
              placeholder="Enter any remarks about the tax filing status"
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

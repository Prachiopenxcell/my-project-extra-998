import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Plus, Upload, FileCheck, AlertCircle, CheckCircle2, FileText } from "lucide-react";

import { StepComponentProps, Creditor } from "./types";

export const CreditorsClassStep = ({ formData, updateFormData }: StepComponentProps): JSX.Element => {
  // Creditor classes
  const creditorClasses = [
    "Financial Creditor",
    "Operational Creditor",
    "Secured Creditor",
    "Unsecured Creditor",
    "Other"
  ];
  
  // Subclasses based on class
  const subClassMap: Record<string, string[]> = {
    "Financial Creditor": ["Bank", "NBFC", "Bond Holder", "Other Financial Institution"],
    "Operational Creditor": ["Vendor", "Employee", "Government", "Service Provider"],
    "Secured Creditor": ["Bank", "NBFC", "Other"],
    "Unsecured Creditor": ["Trade Creditor", "Loan", "Other"],
    "Other": ["Related Party", "Miscellaneous"]
  };
  
  // Status options
  const statusOptions = [
    "Admitted",
    "Rejected",
    "Under Review",
    "Disputed",
    "Settled"
  ];
  
  // State for creditors
  const [creditors, setCreditors] = useState<Creditor[]>(
    formData.creditors || []
  );
  
  // State for total claim amount
  const [totalClaimAmount, setTotalClaimAmount] = useState<number>(
    formData.totalClaimAmount || 0
  );
  
  // State for creditors classification
  const [creditorsClassification, setCreditorsClassification] = useState<string>(
    formData.creditorsClassification || ""
  );
  
  // State for new creditor form
  const [newCreditor, setNewCreditor] = useState<Partial<Creditor>>({
    class: "",
    status: "Under Review",
    amount: 0
  });
  
  // Update form data when creditors change
  useEffect(() => {
    updateFormData({ creditors });
    
    // Calculate total claim amount
    const total = creditors.reduce((sum, creditor) => sum + (creditor.amount || 0), 0);
    setTotalClaimAmount(total);
    updateFormData({ totalClaimAmount: total });
  }, [creditors, updateFormData]);
  
  // Update form data when creditors classification changes
  useEffect(() => {
    updateFormData({ creditorsClassification });
  }, [creditorsClassification, updateFormData]);
  
  // Handle adding a new creditor
  const handleAddCreditor = () => {
    if (!newCreditor.name || !newCreditor.class || !newCreditor.amount) {
      alert("Please fill in all required fields (Name, Class, Amount).");
      return;
    }
    
    const newId = `creditor-${Date.now()}`;
    const creditor: Creditor = {
      id: newId,
      name: newCreditor.name || "",
      class: newCreditor.class || "",
      subClass: newCreditor.subClass || "",
      amount: newCreditor.amount || 0,
      claimDate: newCreditor.claimDate || new Date().toISOString().split('T')[0],
      status: newCreditor.status || "Under Review",
      remarks: newCreditor.remarks || "",
      documentName: newCreditor.documentName || ""
    };
    
    const updatedCreditors = [...creditors, creditor];
    setCreditors(updatedCreditors);
    updateFormData({ creditors: updatedCreditors });
    
    // Reset new creditor form
    setNewCreditor({
      class: "",
      status: "Under Review",
      amount: 0
    });
  };
  
  // Handle removing a creditor
  const handleRemoveCreditor = (creditorId: string) => {
    const updatedCreditors = creditors.filter(creditor => creditor.id !== creditorId);
    setCreditors(updatedCreditors);
    updateFormData({ creditors: updatedCreditors });
  };
  
  // Handle updating a creditor's status
  const handleUpdateCreditorStatus = (creditorId: string, status: string) => {
    const updatedCreditors = creditors.map(creditor => {
      if (creditor.id === creditorId) {
        return { ...creditor, status };
      }
      return creditor;
    });
    
    setCreditors(updatedCreditors);
    updateFormData({ creditors: updatedCreditors });
  };
  
  // Handle updating a creditor's remarks
  const handleUpdateCreditorRemarks = (creditorId: string, remarks: string) => {
    const updatedCreditors = creditors.map(creditor => {
      if (creditor.id === creditorId) {
        return { ...creditor, remarks };
      }
      return creditor;
    });
    
    setCreditors(updatedCreditors);
    updateFormData({ creditors: updatedCreditors });
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Admitted":
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Admitted</Badge>;
      case "Rejected":
        return <Badge className="bg-red-500"><X className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case "Under Review":
        return <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" /> Under Review</Badge>;
      case "Disputed":
        return <Badge className="bg-orange-500"><AlertCircle className="h-3 w-3 mr-1" /> Disputed</Badge>;
      case "Settled":
        return <Badge className="bg-blue-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Settled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      {/* Creditors Classification */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Creditors Classification</h3>
        
        <div className="space-y-2">
          <Label htmlFor="creditorsClassification">Classification Notes</Label>
          <Textarea
            id="creditorsClassification"
            value={creditorsClassification}
            onChange={(e) => setCreditorsClassification(e.target.value)}
            placeholder="Enter any classification notes or special considerations for creditors"
            className="min-h-[80px]"
          />
        </div>
      </div>
      
      {/* Add New Creditor Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add New Creditor</h3>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditorName">Creditor Name <span className="text-red-500">*</span></Label>
                <Input
                  id="creditorName"
                  value={newCreditor.name || ""}
                  onChange={(e) => setNewCreditor({...newCreditor, name: e.target.value})}
                  placeholder="Enter creditor name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="creditorClass">Creditor Class <span className="text-red-500">*</span></Label>
                <Select 
                  value={newCreditor.class} 
                  onValueChange={(value) => setNewCreditor({...newCreditor, class: value, subClass: ""})}
                >
                  <SelectTrigger id="creditorClass">
                    <SelectValue placeholder="Select creditor class" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditorClasses.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {newCreditor.class && (
                <div className="space-y-2">
                  <Label htmlFor="creditorSubClass">Creditor Sub-Class</Label>
                  <Select 
                    value={newCreditor.subClass} 
                    onValueChange={(value) => setNewCreditor({...newCreditor, subClass: value})}
                  >
                    <SelectTrigger id="creditorSubClass">
                      <SelectValue placeholder="Select sub-class" />
                    </SelectTrigger>
                    <SelectContent>
                      {subClassMap[newCreditor.class]?.map(subClass => (
                        <SelectItem key={subClass} value={subClass}>{subClass}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="creditorAmount">Claim Amount (₹) <span className="text-red-500">*</span></Label>
                <Input
                  id="creditorAmount"
                  type="number"
                  value={newCreditor.amount || ""}
                  onChange={(e) => setNewCreditor({...newCreditor, amount: parseFloat(e.target.value)})}
                  placeholder="Enter claim amount"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="claimDate">Claim Date</Label>
                <Input
                  id="claimDate"
                  type="date"
                  value={newCreditor.claimDate || ""}
                  onChange={(e) => setNewCreditor({...newCreditor, claimDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="creditorStatus">Status</Label>
                <Select 
                  value={newCreditor.status} 
                  onValueChange={(value) => setNewCreditor({...newCreditor, status: value})}
                >
                  <SelectTrigger id="creditorStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="creditorDocument">Supporting Document</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="creditorDocument"
                    type="file"
                    className="flex-1"
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name || "";
                      setNewCreditor({...newCreditor, documentName: fileName});
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="creditorRemarks">Remarks</Label>
                <Textarea
                  id="creditorRemarks"
                  value={newCreditor.remarks || ""}
                  onChange={(e) => setNewCreditor({...newCreditor, remarks: e.target.value})}
                  placeholder="Enter any remarks about this creditor"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                type="button" 
                onClick={handleAddCreditor}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Creditor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Creditors Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Creditors List</h3>
          <Badge className="text-md px-3 py-1">
            Total Claims: {formatCurrency(totalClaimAmount)}
          </Badge>
        </div>
        
        {/* Creditors Table */}
        {creditors.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableCaption>List of creditors</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Sub-Class</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Claim Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditors.map(creditor => (
                  <TableRow key={creditor.id}>
                    <TableCell>{creditor.name}</TableCell>
                    <TableCell>{creditor.class}</TableCell>
                    <TableCell>{creditor.subClass || "-"}</TableCell>
                    <TableCell>{formatCurrency(creditor.amount)}</TableCell>
                    <TableCell>{creditor.claimDate || "-"}</TableCell>
                    <TableCell>{getStatusBadge(creditor.status)}</TableCell>
                    <TableCell>
                      {creditor.documentName ? (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs truncate max-w-[100px]">{creditor.documentName}</span>
                        </div>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Select 
                          value={creditor.status} 
                          onValueChange={(value) => handleUpdateCreditorStatus(creditor.id, value)}
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
                          onClick={() => handleRemoveCreditor(creditor.id)}
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
            No creditors added yet. Use the form above to add creditors.
          </div>
        )}
      </div>
      
      {/* Remarks Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Additional Notes</h3>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> All creditor claims should be supported with proper documentation. 
            The classification of creditors may impact priority of payments and other legal considerations.
          </p>
        </div>
      </div>
    </div>
  );
};

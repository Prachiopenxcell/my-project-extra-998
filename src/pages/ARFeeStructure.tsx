import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, DollarSign, Calculator, FileText, Download, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ARFeeStructure = () => {
  const navigate = useNavigate();
  const [feeStructure, setFeeStructure] = useState({
    baseFee: 250000,
    performanceBonus: 50000,
    expenseReimbursement: 25000,
    contingencyFee: 0
  });
  const [isFinalized, setIsFinalized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalFees = Object.values(feeStructure).reduce((sum, fee) => sum + fee, 0);

  const handleFeeChange = (field: string, value: string) => {
    setFeeStructure(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const feeBreakdown = [
    {
      category: "Professional Fees",
      amount: feeStructure.baseFee,
      description: "Base professional fees for AR services",
      percentage: ((feeStructure.baseFee / totalFees) * 100).toFixed(1)
    },
    {
      category: "Performance Bonus",
      amount: feeStructure.performanceBonus,
      description: "Performance-based incentive",
      percentage: ((feeStructure.performanceBonus / totalFees) * 100).toFixed(1)
    },
    {
      category: "Expense Reimbursement",
      amount: feeStructure.expenseReimbursement,
      description: "Travel and operational expenses",
      percentage: ((feeStructure.expenseReimbursement / totalFees) * 100).toFixed(1)
    },
    {
      category: "Contingency Fee",
      amount: feeStructure.contingencyFee,
      description: "Success-based contingency fee",
      percentage: ((feeStructure.contingencyFee / totalFees) * 100).toFixed(1)
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleFinalizeStructure = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to finalize fee structure
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsFinalized(true);
      
      // Show success message
      alert('Fee structure finalized successfully! The AR appointment process is now complete.');
      
      // Navigate back to AR Facilitators main page
      setTimeout(() => {
        navigate('/ar-facilitators');
      }, 1000);
    } catch (error) {
      alert('Error finalizing fee structure. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = () => {
    alert('Fee structure saved as draft successfully!');
  };

  const handleExportPDF = () => {
    alert('Fee structure PDF exported successfully!');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/ar-facilitators')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-2xl font-bold">AR Fee Structure Management</h1>
            <p className="text-muted-foreground">
              Dashboard &gt; AR &amp; Facilitators &gt; Fee Structure
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* AR and Class Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">FEE STRUCTURE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">AR:</p>
                  <p className="font-medium">John Smith</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class:</p>
                  <p className="font-medium">Financial Creditors-Secured</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="law-type">Law Type:</Label>
                  <Select defaultValue="IBBI CIRP">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IBBI CIRP">IBBI CIRP</SelectItem>
                      <SelectItem value="IBBI Liquidation">IBBI Liquidation</SelectItem>
                      <SelectItem value="SEBI">SEBI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fee-type">Fee Structure Type:</Label>
                  <Select defaultValue="Event Basis">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Event Basis">Event Basis</SelectItem>
                      <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                      <SelectItem value="Percentage Based">Percentage Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Fee Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Professional Fees (₹):</Label>
                <Input
                  type="number"
                  value={feeStructure.baseFee}
                  onChange={(e) => handleFeeChange('baseFee', e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Base professional fees for AR services
                </p>
              </div>
              
              <div>
                <Label>Performance Bonus (₹):</Label>
                <Input
                  type="number"
                  value={feeStructure.performanceBonus}
                  onChange={(e) => handleFeeChange('performanceBonus', e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Performance-based incentive
                </p>
              </div>
              
              <div>
                <Label>Expense Reimbursement (₹):</Label>
                <Input
                  type="number"
                  value={feeStructure.expenseReimbursement}
                  onChange={(e) => handleFeeChange('expenseReimbursement', e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Reimbursement for travel and operational expenses
                </p>
              </div>
              
              <div>
                <Label>Contingency Fee (₹):</Label>
                <Input
                  type="number"
                  value={feeStructure.contingencyFee}
                  onChange={(e) => handleFeeChange('contingencyFee', e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Success-based contingency fee (if applicable)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fee Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Fee Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.amount)}</p>
                      <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <div>
                    <p className="font-semibold text-lg">Total Fee Structure</p>
                    <p className="text-sm text-muted-foreground">Complete fee breakdown</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">{formatCurrency(totalFees)}</p>
                    <p className="text-sm text-muted-foreground">100%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleSaveAsDraft} disabled={isFinalized}>
              <FileText className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              onClick={handleFinalizeStructure} 
              disabled={isLoading || isFinalized}
              className={isFinalized ? "bg-green-600 hover:bg-green-600" : ""}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Finalizing...
                </>
              ) : isFinalized ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalized
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Finalize Structure
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ARFeeStructure;

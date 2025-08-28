import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, DollarSign, Calculator, FileText, Download } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ARFeeStructure = () => {
  return (
    <DashboardLayout>
      <ARFeeStructureModule />
    </DashboardLayout>
  );
};

const ARFeeStructureModule = () => {
  const navigate = useNavigate();
  const [feeStructure, setFeeStructure] = useState({
    baseFee: 250000,
    performanceBonus: 50000,
    expenseReimbursement: 25000,
    contingencyFee: 0
  });

  const totalFees = Object.values(feeStructure).reduce((sum, fee) => sum + fee, 0);

  const handleFeeChange = (field, value) => {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
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

        {/* Event-Based Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Event-Based Fees (CIRP Regulations)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">CoC Meeting Attendance:</h4>
              <div className="space-y-3">
                <div>
                  <Label>Creditors in Class:</Label>
                  <Select defaultValue="101-1000">
                    <SelectTrigger className="mt-1 max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-100">1-100</SelectItem>
                      <SelectItem value="101-1000">101-1000</SelectItem>
                      <SelectItem value="1000+">1000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm">Fee per Meeting: <span className="font-medium">₹40,000</span> <span className="text-muted-foreground">(As per regulation)</span></p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Class Creditor Meetings:</h4>
              <div>
                <p className="text-sm">Fee per Meeting: <span className="font-medium">₹12,000</span></p>
              </div>
            </div>

            <div>
              <Label htmlFor="performance-bonus">Performance Bonus</Label>
              <Input
                id="performance-bonus"
                type="number"
                value={feeStructure.performanceBonus}
                onChange={(e) => handleFeeChange('performanceBonus', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Additional bonus based on performance metrics
              </p>
            </div>

            <div>
              <Label htmlFor="expense-reimbursement">Expense Reimbursement</Label>
              <Input
                id="expense-reimbursement"
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
              <Label htmlFor="contingency-fee">Contingency Fee</Label>
              <Input
                id="contingency-fee"
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

        {/* Fee Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Fee Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Fee Structure</span>
                <span className="text-primary">{formatCurrency(totalFees)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Terms & Conditions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Payment Schedule</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 30% advance upon appointment</li>
                  <li>• 40% on completion of interim milestones</li>
                  <li>• 30% on final completion</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Performance Metrics</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Timeline adherence</li>
                  <li>• Stakeholder satisfaction</li>
                  <li>• Recovery optimization</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Expense Coverage</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Travel and accommodation</li>
                  <li>• Legal and professional costs</li>
                  <li>• Communication expenses</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Contingency Terms</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Based on recovery amount</li>
                  <li>• Minimum threshold applies</li>
                  <li>• Subject to regulatory approval</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Fee Structure
          </Button>
          <Button variant="outline">
            Save as Template
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Save Draft
          </Button>
          <Button>
            Approve Fee Structure
          </Button>
        </div>
      </div>

      <div className="mt-8 text-sm text-muted-foreground border-t pt-4">
        John Doe - Service Provider - ID: TRN-636169
      </div>
    </div>
  );
};

export default ARFeeStructure;

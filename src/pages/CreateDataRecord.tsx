import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Database, 
  DollarSign, 
  Scale, 
  FileText, 
  Bot, 
  Upload,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateDataRecord = () => {
  const navigate = useNavigate();

  const entityContext = {
    name: "ABC Corp Ltd",
    type: "Private Limited Company",
    process: "CIRP Documentation"
  };

  const recordStructure = [
    {
      category: "Basic Information",
      status: "completed",
      items: [
        { name: "Company Details", fields: 12 },
        { name: "Registration Info", fields: 8 },
        { name: "Contact Information", fields: 6 }
      ]
    },
    {
      category: "Board of Directors",
      status: "in-progress",
      items: [
        { name: "Director Details", records: 5 },
        { name: "KMP Information", records: 3 },
        { name: "Committee Members", records: 2 }
      ]
    },
    {
      category: "Shareholding Patterns",
      status: "warning",
      items: [
        { name: "Equity Structure", status: "Pending" },
        { name: "Shareholder Details", status: "Pending" }
      ]
    },
    {
      category: "Creditors and Claims",
      status: "not-set",
      items: [
        { name: "Financial Creditors", status: "Not Set" },
        { name: "Operational Creditors", status: "Not Set" }
      ]
    }
  ];

  const templateSuggestions = [
    "Financial Creditor Template",
    "Operational Creditor Template", 
    "Committee of Creditors Template"
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "not-set":
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "🔄";
      case "warning":
        return "⚠️";
      case "not-set":
        return "❌";
      default:
        return "⚪";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Data Records</h1>
            <p className="text-muted-foreground">
              📊 Create Data Records &gt; {entityContext.name}
            </p>
          </div>
        </div>

        {/* Entity Context */}
        <Card>
          <CardHeader>
            <CardTitle>Entity Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span>🏢 Entity: {entityContext.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span>📋 Type: {entityContext.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                <span>🎯 Process: {entityContext.process}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Record Structure Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Record Structure Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recordStructure.map((section, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{section.category}</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(section.status)}
                    <span className="text-sm">Status: {getStatusText(section.status)}</span>
                  </div>
                </div>
                
                <div className="ml-8 space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">├─ {item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.fields ? `[${item.fields} fields]` : 
                         item.records ? `[${item.records} records]` : 
                         `[${item.status}]`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                📝 Add New Record
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                📥 Import CSV
              </Button>
              <Button variant="outline">
                <Bot className="h-4 w-4 mr-2" />
                🤖 AI Auto-Fill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Template Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                💡 Based on CIRP process, recommended templates:
              </p>
              <div className="space-y-2">
                {templateSuggestions.map((template, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">• {template}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Apply Templates
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/data-room/data-records")}>
            Cancel
          </Button>
          <Button onClick={() => navigate("/data-room/data-records")}>
            Save & Continue
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateDataRecord;

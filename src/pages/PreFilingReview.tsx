import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CheckCircle, FileText, Calendar, User, Gavel, Save } from "lucide-react";

const PreFilingReview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [agree, setAgree] = useState(false);
  const [stage1Data, setStage1Data] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    try {
      const s1 = localStorage.getItem("review_stage1");
      if (s1) setStage1Data(JSON.parse(s1));
    } catch {}
  }, []);

  const pipelineActive = new URLSearchParams(location.search).get("pipeline") === "active";

  const steps = [
    { id: 1, title: "Details", completed: true },
    { id: 2, title: "Documents", completed: true },
    { id: 3, title: "Review", completed: false, active: true },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/litigation/create/documents" )} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Documents
            </Button>
            <div className="text-sm text-muted-foreground">Pre-filing Review</div>
          </div>

          {/* Progress Indicator */}
          <Card>
            <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Pre-filing Details (Stage 1)</h2>
            </div>
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step.completed ? 'bg-green-500 border-green-500 text-white' :
                      step.active ? 'bg-blue-500 border-blue-500 text-white' :
                      'border-gray-300 text-gray-400'
                    }`}>
                      {step.id}
                    </div>
                    <span className={`ml-2 text-sm ${step.active ? 'font-medium text-blue-600' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`mx-4 h-0.5 w-12 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-blue-600" />
                Stage 1 Review Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {stage1Data ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Title</label>
                      <p className="font-medium mt-1">{stage1Data.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Court</label>
                      <p className="mt-1">{stage1Data.court || '-'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Act & Section</label>
                      <p className="mt-1">{stage1Data.actSection || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Assigned Lawyer</label>
                      <p className="mt-1">{stage1Data.assignedLawyer || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Particulars</label>
                    <p className="mt-2 text-sm leading-relaxed">{stage1Data.particulars || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Relief Sought</label>
                    <p className="mt-2 text-sm leading-relaxed">{Array.isArray(stage1Data.reliefSought) ? stage1Data.reliefSought.join(', ') : (stage1Data.reliefSought || '-')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Documents</label>
                    <p className="mt-1">{stage1Data.documentsCount ?? 0} documents uploaded</p>
                  </div>
                  <Separator />
                  <div className="flex items-start space-x-2">
                    <Checkbox id="ack" checked={agree} onCheckedChange={(c) => setAgree(!!c)} />
                    <label htmlFor="ack" className="text-sm leading-relaxed">
                      I confirm the pre-filing details are accurate to the best of my knowledge.
                    </label>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No Stage 1 review data found. Please complete Details and Documents steps.</div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate('/litigation/create/documents')} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save Draft
                  </Button>
                </div>
                <div className="flex gap-2">
                  {pipelineActive ? (
                    <Button disabled={!agree} onClick={() => navigate('/litigation/create-active?from=stage1')} className="flex items-center gap-2">
                      Proceed to Stage 2 <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button disabled={!agree} onClick={() => navigate('/litigation/review-submit')} className="flex items-center gap-2">
                      Go to Final Review <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PreFilingReview;

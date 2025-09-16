import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  User, 
  Building, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Edit,
  ThumbsUp,
  ThumbsDown,
  DollarSign,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

interface PRAApplication {
  id: string;
  name: string;
  groupType: 'standalone' | 'group';
  entityType: 'company' | 'partnership' | 'individual';
  status: 'review' | 'approved' | 'query' | 'rejected';
  submitDate: string;
  complianceScore: number;
  section29ACompliant: boolean;
  documentsComplete: boolean;
  netWorthCertificate: boolean;
  kycComplete: boolean;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  financialInfo: {
    netWorth: number;
    turnover: number;
    experience: string;
  };
  documents: Array<{
    name: string;
    status: 'pending' | 'submitted' | 'verified' | 'rejected';
    uploadDate?: string;
    remarks?: string;
  }>;
  evaluationHistory: Array<{
    date: string;
    action: string;
    evaluator: string;
    remarks: string;
  }>;
}

interface PRADetailViewProps {
  pra: PRAApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (pra: PRAApplication) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PRADetailView: React.FC<PRADetailViewProps> = ({ 
  pra, 
  isOpen, 
  onClose, 
  onEdit, 
  onApprove, 
  onReject 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!pra) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { variant: 'secondary' as const, label: 'Submitted', className: '' },
      review: { variant: 'default' as const, label: 'Under Review', className: '' },
      approved: { variant: 'default' as const, label: 'Approved', className: 'bg-green-600' },
      rejected: { variant: 'destructive' as const, label: 'Rejected', className: '' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getDocumentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending', className: '' },
      submitted: { variant: 'outline' as const, label: 'Submitted', className: '' },
      verified: { variant: 'default' as const, label: 'Verified', className: 'bg-green-600' },
      rejected: { variant: 'destructive' as const, label: 'Rejected', className: '' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleApprove = () => {
    onApprove(pra.id);
    toast({
      title: "PRA Approved",
      description: `${pra.name}'s application has been approved.`
    });
    onClose();
  };

  const handleReject = () => {
    onReject(pra.id);
    toast({
      title: "PRA Rejected",
      description: `${pra.name}'s application has been rejected.`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5" />
                {pra.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(pra.status)}
                <Badge variant="outline" className="capitalize">
                  {pra.groupType} - {pra.entityType}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ID: {pra.id}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(pra)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Submit Date</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(pra.submitDate), "dd MMM yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Entity Type</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {pra.entityType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Group Type</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {pra.groupType}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">{pra.contactInfo.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">{pra.contactInfo.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Address</div>
                      <div className="text-sm text-muted-foreground">{pra.contactInfo.address}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Overall Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Rating</span>
                    <span className="text-sm font-medium">{pra.complianceScore}%</span>
                  </div>
                  <Progress value={pra.complianceScore} className="h-3" />
                  <div className="text-xs text-muted-foreground">
                    {pra.complianceScore >= 80 ? 'Excellent compliance' : 
                     pra.complianceScore >= 60 ? 'Good compliance' : 'Needs improvement'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    {pra.section29ACompliant ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="text-sm font-medium">Section 29A Compliant</div>
                      <div className="text-xs text-muted-foreground">
                        {pra.section29ACompliant ? 'Verified' : 'Not compliant'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    {pra.documentsComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="text-sm font-medium">Documents Complete</div>
                      <div className="text-xs text-muted-foreground">
                        {pra.documentsComplete ? 'All required documents submitted' : 'Missing documents'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    {pra.netWorthCertificate ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="text-sm font-medium">Net Worth Certificate</div>
                      <div className="text-xs text-muted-foreground">
                        {pra.netWorthCertificate ? 'Certificate verified' : 'Certificate pending'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    {pra.kycComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="text-sm font-medium">KYC Complete</div>
                      <div className="text-xs text-muted-foreground">
                        {pra.kycComplete ? 'KYC verification complete' : 'KYC pending'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pra.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{doc.name}</div>
                          {doc.uploadDate && (
                            <div className="text-xs text-muted-foreground">
                              Uploaded: {format(new Date(doc.uploadDate), "dd MMM yyyy")}
                            </div>
                          )}
                          {doc.remarks && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Remarks: {doc.remarks}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocumentStatusBadge(doc.status)}
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium">Net Worth</div>
                      <div className="text-lg font-semibold">
                        ₹{pra.financialInfo.netWorth.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Annual Turnover</div>
                      <div className="text-lg font-semibold">
                        ₹{pra.financialInfo.turnover.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 border rounded-lg">
                  <div className="text-sm font-medium mb-2">Experience</div>
                  <div className="text-sm text-muted-foreground">
                    {pra.financialInfo.experience}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pra.evaluationHistory.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{event.action}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(event.date), "dd MMM yyyy, HH:mm")}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          By: {event.evaluator}
                        </div>
                        {event.remarks && (
                          <div className="text-sm text-muted-foreground mt-2">
                            {event.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {pra.status === 'review' && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject PRA Application</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject {pra.name}'s application? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReject}>
                      Reject Application
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve PRA Application</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve {pra.name}'s application? This will grant them PRA status.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApprove}>
                      Approve Application
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PRADetailView;

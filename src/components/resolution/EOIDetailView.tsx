import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  FileText, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Edit,
  Send
} from 'lucide-react';
import { format } from 'date-fns';

interface EOI {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'closed' | 'evaluation';
  publishDate: string;
  closingDate: string;
  totalApplications: number;
  cocMembers: number;
  completionPercentage: number;
  description: string;
  requirements: string[];
  documents: Array<{
    name: string;
    required: boolean;
    uploaded: boolean;
  }>;
  timeline: Array<{
    date: string;
    event: string;
    completed: boolean;
  }>;
}

interface EOIDetailViewProps {
  eoi: EOI | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (eoi: EOI) => void;
}

const EOIDetailView: React.FC<EOIDetailViewProps> = ({ eoi, isOpen, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!eoi) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      published: { variant: 'default' as const, label: 'Published' },
      closed: { variant: 'destructive' as const, label: 'Closed' },
      evaluation: { variant: 'outline' as const, label: 'Under Evaluation' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{eoi.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(eoi.status)}
                <span className="text-sm text-muted-foreground">
                  EOI ID: {eoi.id}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(eoi)}>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Publication Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Publish Date</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(eoi.publishDate), "dd MMM yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Closing Date</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(eoi.closingDate), "dd MMM yyyy")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Application Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Total Applications</div>
                      <div className="text-sm text-muted-foreground">{eoi.totalApplications}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">COC Members</div>
                      <div className="text-sm text-muted-foreground">{eoi.cocMembers}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Completion Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Completion</span>
                    <span className="text-sm font-medium">{eoi.completionPercentage}%</span>
                  </div>
                  <Progress value={eoi.completionPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{eoi.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>EOI Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eoi.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">{requirement}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eoi.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {doc.uploaded ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <div className="text-sm font-medium">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {doc.required ? 'Required' : 'Optional'}
                          </div>
                        </div>
                      </div>
                      <Badge variant={doc.uploaded ? 'default' : 'secondary'}>
                        {doc.uploaded ? 'Uploaded' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>EOI Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eoi.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {event.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{event.event}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(event.date), "dd MMM yyyy")}
                          </div>
                        </div>
                        {index < eoi.timeline.length - 1 && (
                          <div className="w-px h-6 bg-border ml-2.5 mt-2" />
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
          {eoi.status === 'draft' && (
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Publish EOI
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EOIDetailView;

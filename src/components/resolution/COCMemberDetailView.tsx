import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  FileText,
  Activity,
  Edit,
  X
} from "lucide-react";
import { format } from 'date-fns';

interface COCMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  organization?: string;
  joinDate?: string;
  votingRights?: number;
  claimAmount?: number;
  documents?: Array<{
    name: string;
    status: 'verified' | 'pending' | 'rejected';
    uploadDate: string;
    remarks?: string;
  }>;
  activities?: Array<{
    date: string;
    action: string;
    description: string;
    type: 'vote' | 'meeting' | 'document' | 'communication';
  }>;
}

interface COCMemberDetailViewProps {
  member: COCMember | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (member: COCMember) => void;
}

const COCMemberDetailView = ({ member, isOpen, onClose, onEdit }: COCMemberDetailViewProps) => {
  if (!member) return null;

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'chairman':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'secretary':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return <Activity className="h-4 w-4 text-green-600" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'document':
        return <FileText className="h-4 w-4 text-orange-600" />;
      case 'communication':
        return <Mail className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              COC Member Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(member)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="voting">Voting Rights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{member.email}</p>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                    </div>
                  </div>

                  {member.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{member.phone}</p>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                      </div>
                    </div>
                  )}

                  {member.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{member.address}</p>
                        <p className="text-sm text-muted-foreground">Address</p>
                      </div>
                    </div>
                  )}

                  {member.organization && (
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{member.organization}</p>
                        <p className="text-sm text-muted-foreground">Organization</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Role & Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Role & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Role</p>
                    <Badge className={getRoleColor(member.role)}>
                      {member.role}
                    </Badge>
                  </div>

                  {member.joinDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{format(new Date(member.joinDate), "dd MMM yyyy")}</p>
                        <p className="text-sm text-muted-foreground">Join Date</p>
                      </div>
                    </div>
                  )}

                  {member.claimAmount && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Claim Amount</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{member.claimAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}

                  {member.votingRights && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Voting Rights</p>
                      <p className="text-xl font-semibold">{member.votingRights}%</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Status</CardTitle>
              </CardHeader>
              <CardContent>
                {member.documents && member.documents.length > 0 ? (
                  <div className="space-y-4">
                    {member.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded: {format(new Date(doc.uploadDate), "dd MMM yyyy")}
                            </p>
                            {doc.remarks && (
                              <p className="text-sm text-muted-foreground mt-1">{doc.remarks}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No documents uploaded yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {member.activities && member.activities.length > 0 ? (
                  <div className="space-y-4">
                    {member.activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                        <div className="p-2 rounded-full bg-gray-100">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(activity.date), "dd MMM yyyy, HH:mm")}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No activities recorded yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Voting Rights & History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{member.votingRights || 0}%</p>
                    <p className="text-sm text-muted-foreground">Voting Rights</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{(member.claimAmount || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-muted-foreground">Claim Amount</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">Active</p>
                    <p className="text-sm text-muted-foreground">Status</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Voting History</h4>
                  <p className="text-muted-foreground text-center py-8">
                    No voting history available yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default COCMemberDetailView;

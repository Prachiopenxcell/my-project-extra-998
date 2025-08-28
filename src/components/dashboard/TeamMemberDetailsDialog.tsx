import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Shield, 
  Briefcase,
  Building
} from "lucide-react";

interface TeamMember {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  status: string;
  lastLogin: string;
  joinDate?: string;
  department?: string;
  assignedModules?: string[];
  assignedEntities?: string[];
}

interface TeamMemberDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export const TeamMemberDetailsDialog: React.FC<TeamMemberDetailsDialogProps> = ({
  isOpen,
  onClose,
  member
}) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Team Member Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about this team member
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={member.status === 'active' ? 'default' : 'secondary'} 
                     className={member.status === 'active' ? 'bg-green-100 text-green-800' : ''}>
                {member.status}
              </Badge>
              {member.role && <Badge variant="outline">{member.role}</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {member.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.email}</span>
              </div>
            )}
            
            {member.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.phone}</span>
              </div>
            )}
            
            {member.joinDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined: {member.joinDate}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Last login: {member.lastLogin}</span>
            </div>
            
            {member.department && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Department: {member.department}</span>
              </div>
            )}
          </div>

          {member.assignedModules && member.assignedModules.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Assigned Modules
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.assignedModules.map((module, index) => (
                  <Badge key={index} variant="outline">{module}</Badge>
                ))}
              </div>
            </div>
          )}

          {member.assignedEntities && member.assignedEntities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Assigned Entities
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.assignedEntities.map((entity, index) => (
                  <Badge key={index} variant="outline">{entity}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

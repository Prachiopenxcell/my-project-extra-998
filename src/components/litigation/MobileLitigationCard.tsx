import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, 
  Calendar, 
  User, 
  Building, 
  DollarSign, 
  Phone, 
  Eye, 
  FileText, 
  MessageSquare, 
  MoreHorizontal,
  Clock,
  AlertTriangle,
  CheckCircle,
  Award
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface LitigationCase {
  id: string;
  caseNumber: string;
  title: string;
  type: 'pre-filing' | 'active' | 'closed';
  status: 'draft' | 'pending' | 'critical' | 'won' | 'lost' | 'awaiting-docs';
  court: string;
  lawyer: string;
  amount: number;
  filedDate?: string;
  nextHearing?: string;
  lastHearing?: string;
  plaintiff: string;
  defendant: string;
  daysLeft?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface MobileLitigationCardProps {
  case_: LitigationCase;
  onAction?: (action: string, caseId: string) => void;
}

const MobileLitigationCard = ({ case_, onAction }: MobileLitigationCardProps) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { color: 'bg-gray-100 text-gray-800', icon: FileText },
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'critical': { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      'won': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'lost': { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      'awaiting-docs': { color: 'bg-blue-100 text-blue-800', icon: FileText }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
        <Icon className="w-3 h-3" />
        {status === 'awaiting-docs' ? 'Awaiting Docs' : 
         status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '🟡';
      case 'critical': return '🔴';
      case 'won': return '✅';
      case 'lost': return '❌';
      case 'draft': return '📝';
      default: return '⚪';
    }
  };

  const handleViewDetails = () => {
    navigate(`/litigation/case/${case_.id}`);
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, case_.id);
    }
  };

  return (
    <Card className="w-full shadow-sm border-l-4 border-l-blue-500">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs font-medium text-muted-foreground truncate">
                {case_.caseNumber}
              </span>
              <div className="flex-shrink-0">
                {getStatusBadge(case_.status)}
              </div>
            </div>
            <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">
              {case_.title}
            </h3>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                {case_.nextHearing ? 'Next:' : case_.lastHearing ? 'Last:' : 'Filed:'}
              </span>
            </div>
            <div className="font-medium">
              {case_.nextHearing ? formatDate(case_.nextHearing) + ', 10:30 AM' :
               case_.lastHearing ? formatDate(case_.lastHearing) + ' (Final)' :
               case_.filedDate ? formatDate(case_.filedDate) : 'N/A'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Lawyer</span>
            </div>
            <div className="font-medium truncate">{case_.lawyer}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Building className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Court</span>
            </div>
            <div className="font-medium truncate">{case_.court}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Amount</span>
            </div>
            <div className="font-medium">{formatCurrency(case_.amount)}</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>
              {case_.filedDate ? `Filed: ${formatDate(case_.filedDate)}` : 
               `Created: ${formatDate(case_.filedDate || new Date().toISOString())}`}
            </span>
            {case_.daysLeft && (
              <span className={`font-medium ${case_.daysLeft <= 5 ? 'text-red-600' : 'text-orange-600'}`}>
                {case_.daysLeft} days left
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs"
              onClick={handleViewDetails}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs"
              onClick={() => handleAction('documents')}
            >
              <FileText className="h-3 w-3 mr-1" />
              Docs
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs"
              onClick={() => handleAction('call-lawyer')}
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs"
              onClick={() => handleAction('calendar')}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Calendar
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs"
              onClick={() => handleAction('notes')}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Notes
            </Button>
            
            {case_.status === 'won' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-3 text-xs text-green-600 border-green-200"
                onClick={() => handleAction('final-order')}
              >
                <Award className="h-3 w-3 mr-1" />
                Order
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleAction('edit')}>
                  Edit Case
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('duplicate')}>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('archive')}>
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleAction('delete')}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileLitigationCard;
